using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Reservations;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services;
using Core.Application.Abstraction.Services.Reservations;
using Core.Domain.Entities.Reservations;
using Core.Domain.Entities.Identity;
using Core.Domain.Enums;

namespace Core.Application.Services.Reservations
{
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IVoucherProIntegrationService _voucherProIntegrationService;
        private readonly IDuffelService _duffelService;

        public BookingService(IUnitOfWork unitOfWork, IMapper mapper, IVoucherProIntegrationService voucherProIntegrationService, IDuffelService duffelService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _voucherProIntegrationService = voucherProIntegrationService;
            _duffelService = duffelService;
        }

        public async Task<Result<BookingConfirmationDto>> CreateHotelBookingAsync(CreateHotelBookingDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync(cancellationToken);

                // Dynamically register hotel, room, and rate plan if GDS hotel info is provided
                if (!string.IsNullOrEmpty(dto.HotelName))
                {
                    // 1. Hotel
                    var hotel = await _unitOfWork.Hotels.FindAsync(h => h.Name == dto.HotelName, cancellationToken);
                    if (hotel == null)
                    {
                        hotel = new Core.Domain.Entities.Accommodation.Hotel
                        {
                            Id = Guid.NewGuid(),
                            HotelId = Guid.NewGuid().ToString().Substring(0, 8),
                            Name = dto.HotelName,
                            NameEn = dto.HotelName,
                            Stars = 4,
                            Rating = 8.5m,
                            ReviewCount = 100,
                            RatingText = "ممتاز",
                            Address = "Turkey",
                            Location = "Turkey",
                            Distance = "",
                            Description = "Dynamic GDS Hotel",
                            MainImageUrl = dto.HotelImage ?? "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80",
                            DayImageUrl = "",
                            NightImageUrl = "",
                            IsActive = true
                        };
                        await _unitOfWork.Hotels.AddAsync(hotel, cancellationToken);
                    }

                    // 2. Room
                    var hotelRoom = await _unitOfWork.Rooms.FindAsync(r => r.Name == dto.RoomName && r.HotelId == hotel.Id, cancellationToken);
                    if (hotelRoom == null)
                    {
                        hotelRoom = new Core.Domain.Entities.Accommodation.Room
                        {
                            Id = Guid.NewGuid(),
                            HotelId = hotel.Id,
                            Name = dto.RoomName ?? "Standard Room",
                            NameEn = dto.RoomName ?? "Standard Room",
                            ImageUrl = hotel.MainImageUrl,
                            MaxGuests = dto.NumberOfGuests > 0 ? dto.NumberOfGuests : 2,
                            BedType = "Double Bed",
                            Size = "30 sqm",
                            AvailableCount = 10,
                            IsActive = true
                        };
                        await _unitOfWork.Rooms.AddAsync(hotelRoom, cancellationToken);
                    }

                    // 3. RatePlan
                    var gdsRatePlan = await _unitOfWork.RatePlans.FindAsync(rp => rp.RoomId == hotelRoom.Id && rp.IsActive, cancellationToken);
                    if (gdsRatePlan == null)
                    {
                        gdsRatePlan = new Core.Domain.Entities.Accommodation.RatePlan
                        {
                            Id = Guid.NewGuid(),
                            RoomId = hotelRoom.Id,
                            Name = "Standard Rate",
                            Price = dto.RoomPrice ?? 100,
                            TaxInfo = "شامل الضرائب والرسوم",
                            ValidFrom = DateTime.UtcNow.AddDays(-30),
                            ValidTo = DateTime.UtcNow.AddDays(365),
                            IsActive = true
                        };
                        await _unitOfWork.RatePlans.AddAsync(gdsRatePlan, cancellationToken);
                    }

                    dto.HotelId = hotel.Id;
                    dto.RoomId = hotelRoom.Id;
                    dto.RatePlanId = gdsRatePlan.Id;

                    // Save changes to EF context so subsequent queries in this transaction can find these entities
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                }

                // Validate hotel exists
                var hotelEntity = await _unitOfWork.Hotels.GetByIdAsync(dto.HotelId, cancellationToken);
                if (hotelEntity == null)
                    return Result<BookingConfirmationDto>.Failure("Hotel not found");

                // Validate room exists and belongs to hotel
                var room = await _unitOfWork.Rooms
                    .FindAsync(r => r.Id == dto.RoomId && r.HotelId == dto.HotelId, cancellationToken);
                if (room == null)
                    return Result<BookingConfirmationDto>.Failure("Room not found or does not belong to this hotel");

                // Validate rate plan exists and belongs to room
                var ratePlan = await _unitOfWork.RatePlans
                    .FindAsync(rp => rp.Id == dto.RatePlanId && rp.RoomId == dto.RoomId && rp.IsActive, cancellationToken);
                if (ratePlan == null)
                    return Result<BookingConfirmationDto>.Failure("Rate plan not found or inactive");

                // Validate dates
                if (dto.CheckInDate < DateTime.UtcNow.Date)
                    return Result<BookingConfirmationDto>.Failure("Check-in date cannot be in the past");

                if (dto.CheckOutDate <= dto.CheckInDate)
                    return Result<BookingConfirmationDto>.Failure("Check-out date must be after check-in date");

                // Validate rate plan validity period
                if (dto.CheckInDate < ratePlan.ValidFrom || dto.CheckInDate > ratePlan.ValidTo)
                    return Result<BookingConfirmationDto>.Failure("Rate plan is not valid for the selected dates");

                // Calculate nights and total amount
                int numberOfNights = (dto.CheckOutDate - dto.CheckInDate).Days;
                decimal totalAmount = ratePlan.Price * numberOfNights;

                // 3. Create real order via Duffel API
                var pnr = await _duffelService.CreateStayOrderAsync(dto, cancellationToken);

                // Create booking with guest info
                var booking = new Booking
                {
                    Id = Guid.NewGuid(),
                    ReferenceNumber = pnr, // Use real Duffel PNR
                    UserId = dto.UserId,
                    Type = BookingType.Hotel,
                    Status = BookingStatus.Pending,
                    TotalAmount = totalAmount,
                    TaxAmount = 0,
                    ServiceFee = 0,
                    Currency = "SAR",
                    CreatedAt = DateTime.UtcNow,
                    GuestFirstName = dto.GuestFirstName,
                    GuestLastName = dto.GuestLastName,
                    GuestEmail = dto.GuestEmail,
                    GuestPhone = dto.GuestPhone,
                    GuestCountryCode = dto.GuestCountryCode ?? "+966",
                    SpecialRequests = dto.SpecialRequests ?? "",
                    LateCheckIn = dto.LateCheckIn,
                    AirportTransfer = dto.AirportTransfer,
                };

                await _unitOfWork.Bookings.AddAsync(booking, cancellationToken);

                // Apply wallet payment if requested
                await ApplyWalletPaymentAsync(booking, dto.UserId, dto.UseWallet, cancellationToken);

                // Create hotel booking
                var hotelBooking = new Core.Domain.Entities.Reservations.HotelBooking
                {
                    Id = Guid.NewGuid(),
                    BookingId = booking.Id,
                    HotelId = dto.HotelId,
                    RoomId = dto.RoomId,
                    CheckInDate = dto.CheckInDate,
                    CheckOutDate = dto.CheckOutDate,
                    Nights = numberOfNights,
                    Guests = dto.NumberOfGuests,
                    RoomQuantity = 1
                };

                await _unitOfWork.HotelBookings.AddAsync(hotelBooking, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                if (booking.Status == BookingStatus.Confirmed)
                {
                    _ = Task.Run(() => _voucherProIntegrationService.ProcessBookingVoucherAsync(booking, CancellationToken.None));
                }

                return Result<BookingConfirmationDto>.Success(new BookingConfirmationDto
                {
                    Id = booking.Id,
                    ReferenceNumber = booking.ReferenceNumber,
                    Status = booking.Status.ToString(),
                    TotalAmount = booking.TotalAmount,
                    Currency = booking.Currency,
                    CreatedAt = booking.CreatedAt
                });
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return Result<BookingConfirmationDto>.Failure($"Failed to create hotel booking: {ex.Message}");
            }
        }

        public async Task<Result<BookingConfirmationDto>> CreateFlightBookingAsync(CreateFlightBookingDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync(cancellationToken);

                // Dynamically register airline, airports, flight, and schedule if GDS flight info is provided
                if (!string.IsNullOrEmpty(dto.FlightNumber) && !string.IsNullOrEmpty(dto.AirlineCode))
                {
                    // 1. Airline
                    var airline = await _unitOfWork.Airlines.FindAsync(a => a.Code == dto.AirlineCode, cancellationToken);
                    if (airline == null)
                    {
                        airline = new Core.Domain.Entities.Aviation.Airline
                        {
                            Id = Guid.NewGuid(),
                            Code = dto.AirlineCode,
                            NameAr = dto.AirlineName ?? dto.AirlineCode,
                            NameEn = dto.AirlineName ?? dto.AirlineCode,
                            LogoUrl = $"https://images.kiwi.com/airlines/64/{dto.AirlineCode}.png",
                            IsActive = true
                        };
                        await _unitOfWork.Airlines.AddAsync(airline, cancellationToken);
                    }

                    // 2. Departure Airport
                    var depAirport = await _unitOfWork.Airports.FindAsync(a => a.Code == dto.DepartureAirportCode, cancellationToken);
                    if (depAirport == null)
                    {
                        depAirport = new Core.Domain.Entities.Aviation.Airport
                        {
                            Id = Guid.NewGuid(),
                            Code = dto.DepartureAirportCode ?? "XXX",
                            NameAr = dto.DepartureAirportCode ?? "Unknown Airport",
                            NameEn = dto.DepartureAirportCode ?? "Unknown Airport",
                            CityAr = dto.DepartureAirportCode ?? "Unknown City",
                            CityEn = dto.DepartureAirportCode ?? "Unknown City",
                            Country = "Unknown Country",
                            IsActive = true
                        };
                        await _unitOfWork.Airports.AddAsync(depAirport, cancellationToken);
                    }

                    // 3. Arrival Airport
                    var arrAirport = await _unitOfWork.Airports.FindAsync(a => a.Code == dto.ArrivalAirportCode, cancellationToken);
                    if (arrAirport == null)
                    {
                        arrAirport = new Core.Domain.Entities.Aviation.Airport
                        {
                            Id = Guid.NewGuid(),
                            Code = dto.ArrivalAirportCode ?? "YYY",
                            NameAr = dto.ArrivalAirportCode ?? "Unknown Airport",
                            NameEn = dto.ArrivalAirportCode ?? "Unknown Airport",
                            CityAr = dto.ArrivalAirportCode ?? "Unknown City",
                            CityEn = dto.ArrivalAirportCode ?? "Unknown City",
                            Country = "Unknown Country",
                            IsActive = true
                        };
                        await _unitOfWork.Airports.AddAsync(arrAirport, cancellationToken);
                    }

                    // 4. Flight
                    var flight = await _unitOfWork.Flights.FindAsync(f => f.FlightNumber == dto.FlightNumber, cancellationToken);
                    if (flight == null)
                    {
                        flight = new Core.Domain.Entities.Aviation.Flight
                        {
                            Id = Guid.NewGuid(),
                            FlightNumber = dto.FlightNumber,
                            AirlineId = airline.Id,
                            DepartureAirportId = depAirport.Id,
                            ArrivalAirportId = arrAirport.Id,
                            DepartureTime = dto.DepartureTime?.TimeOfDay ?? TimeSpan.FromHours(10),
                            ArrivalTime = dto.ArrivalTime?.TimeOfDay ?? TimeSpan.FromHours(12),
                            Duration = "2h",
                            DurationMinutes = 120,
                            Stops = 0,
                            StopCity = "",
                            EconomyPrice = dto.FlightPrice ?? 100,
                            BusinessPrice = (dto.FlightPrice ?? 100) * 2,
                            IsActive = true
                        };
                        await _unitOfWork.Flights.AddAsync(flight, cancellationToken);
                    }

                    // 5. FlightSchedule
                    var departureDate = dto.DepartureTime?.Date ?? DateTime.UtcNow.Date;
                    var schedule = await _unitOfWork.FlightSchedules.FindAsync(fs => fs.FlightId == flight.Id && fs.Date == departureDate, cancellationToken);
                    if (schedule == null)
                    {
                        schedule = new Core.Domain.Entities.Aviation.FlightSchedule
                        {
                            Id = Guid.NewGuid(),
                            FlightId = flight.Id,
                            Date = departureDate,
                            EconomySeatsAvailable = 99,
                            BusinessSeatsAvailable = 20,
                            IsActive = true
                        };
                        await _unitOfWork.FlightSchedules.AddAsync(schedule, cancellationToken);
                    }

                    dto.OutboundFlightId = schedule.Id;
                    
                    // Save changes to EF context so subsequent queries in this transaction can find these entities
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                }

                // Validate outbound flight schedule
                var outboundSchedule = await _unitOfWork.FlightSchedules
                    .GetByIdAsync(dto.OutboundFlightId, fs => fs.Flight, fs => fs.Seats);
                if (outboundSchedule == null || !outboundSchedule.IsActive)
                    return Result<BookingConfirmationDto>.Failure("Outbound flight schedule not found or inactive");

                // Validate cabin class availability
                int requiredSeats = dto.Passengers.Count;
                if (dto.CabinClass.ToLower() == "economy")
                {
                    if (outboundSchedule.EconomySeatsAvailable < requiredSeats)
                        return Result<BookingConfirmationDto>.Failure("Not enough economy seats available");
                }
                else if (dto.CabinClass.ToLower() == "business")
                {
                    if (outboundSchedule.BusinessSeatsAvailable < requiredSeats)
                        return Result<BookingConfirmationDto>.Failure("Not enough business seats available");
                }

                // Validate return flight if provided
                Core.Domain.Entities.Aviation.FlightSchedule? returnSchedule = null;
                if (dto.ReturnFlightId.HasValue)
                {
                    returnSchedule = await _unitOfWork.FlightSchedules
                        .GetByIdAsync(dto.ReturnFlightId.Value, fs => fs.Flight, fs => fs.Seats);
                    if (returnSchedule == null || !returnSchedule.IsActive)
                        return Result<BookingConfirmationDto>.Failure("Return flight schedule not found or inactive");

                    // Validate return flight availability
                    if (dto.CabinClass.ToLower() == "economy")
                    {
                        if (returnSchedule.EconomySeatsAvailable < requiredSeats)
                            return Result<BookingConfirmationDto>.Failure("Not enough economy seats available on return flight");
                    }
                    else if (dto.CabinClass.ToLower() == "business")
                    {
                        if (returnSchedule.BusinessSeatsAvailable < requiredSeats)
                            return Result<BookingConfirmationDto>.Failure("Not enough business seats available on return flight");
                    }
                }

                // Validate and mark seats as occupied
                decimal seatExtraCharges = 0;
                foreach (var passenger in dto.Passengers)
                {
                    if (passenger.OutboundSeatId.HasValue)
                    {
                        var seat = await _unitOfWork.Seats.GetByIdAsync(passenger.OutboundSeatId.Value, cancellationToken);
                        if (seat == null || seat.IsOccupied || seat.FlightScheduleId != dto.OutboundFlightId)
                            return Result<BookingConfirmationDto>.Failure($"Outbound seat not available");

                        seat.IsOccupied = true;
                        _unitOfWork.Seats.Update(seat);
                        seatExtraCharges += seat.ExtraPrice;
                    }

                    if (passenger.ReturnSeatId.HasValue && dto.ReturnFlightId.HasValue)
                    {
                        var seat = await _unitOfWork.Seats.GetByIdAsync(passenger.ReturnSeatId.Value, cancellationToken);
                        if (seat == null || seat.IsOccupied || seat.FlightScheduleId != dto.ReturnFlightId.Value)
                            return Result<BookingConfirmationDto>.Failure($"Return seat not available");

                        seat.IsOccupied = true;
                        _unitOfWork.Seats.Update(seat);
                        seatExtraCharges += seat.ExtraPrice;
                    }
                }

                // Calculate total amount (base price from flight + seat charges)
                decimal basePrice;
                if (!string.IsNullOrEmpty(dto.FlightNumber) && dto.FlightPrice.HasValue)
                {
                    basePrice = dto.FlightPrice.Value;
                }
                else
                {
                    basePrice = dto.CabinClass.ToLower() == "economy" 
                        ? outboundSchedule.Flight.EconomyPrice 
                        : outboundSchedule.Flight.BusinessPrice;
                        
                    if (returnSchedule != null)
                    {
                        basePrice += dto.CabinClass.ToLower() == "economy"
                            ? returnSchedule.Flight.EconomyPrice
                            : returnSchedule.Flight.BusinessPrice;
                    }
                }

                decimal totalAmount = (basePrice * requiredSeats) + seatExtraCharges;

                // 3. Create real flight order via Duffel API
                var pnr = await _duffelService.CreateFlightOrderAsync(dto, cancellationToken);

                // Create booking with guest info
                var booking = new Booking
                {
                    Id = Guid.NewGuid(),
                    ReferenceNumber = pnr, // Use real Duffel PNR
                    UserId = dto.UserId,
                    Type = BookingType.Flight,
                    Status = BookingStatus.Pending,
                    TotalAmount = totalAmount,
                    TaxAmount = 0,
                    ServiceFee = 0,
                    Currency = "SAR",
                    CreatedAt = DateTime.UtcNow,
                    GuestFirstName = dto.GuestFirstName,
                    GuestLastName = dto.GuestLastName,
                    GuestEmail = dto.GuestEmail,
                    GuestPhone = dto.GuestPhone,
                    GuestCountryCode = dto.GuestCountryCode ?? "+966",
                    SpecialRequests = dto.SpecialRequests ?? ""
                };

                await _unitOfWork.Bookings.AddAsync(booking, cancellationToken);

                // Apply wallet payment if requested
                await ApplyWalletPaymentAsync(booking, dto.UserId, dto.UseWallet, cancellationToken);

                // Create flight booking
                var flightBooking = new FlightBooking
                {
                    Id = Guid.NewGuid(),
                    BookingId = booking.Id,
                    FlightScheduleId = dto.OutboundFlightId,
                    Class = dto.CabinClass,
                    DepartureDate = outboundSchedule.Date,
                    ReturnDate = returnSchedule?.Date
                };

                await _unitOfWork.FlightBookings.AddAsync(flightBooking, cancellationToken);

                // Create passengers
                foreach (var passengerDto in dto.Passengers)
                {
                    var passenger = new FlightPassenger
                    {
                        Id = Guid.NewGuid(),
                        FlightBookingId = flightBooking.Id,
                        FirstName = passengerDto.FirstName,
                        LastName = passengerDto.LastName,
                        PassportNumber = passengerDto.PassportNumber,
                        Nationality = passengerDto.Nationality,
                        DateOfBirth = passengerDto.DateOfBirth,
                        Title = passengerDto.PassengerType,
                        SeatNumber = ""
                    };

                    // Set seat number if seat was selected
                    if (passengerDto.OutboundSeatId.HasValue)
                    {
                        var seat = await _unitOfWork.Seats.GetByIdAsync(passengerDto.OutboundSeatId.Value, cancellationToken);
                        passenger.SeatNumber = seat?.SeatNumber ?? "";
                    }

                    await _unitOfWork.FlightPassengers.AddAsync(passenger, cancellationToken);
                }

                // Update available seats count
                if (dto.CabinClass.ToLower() == "economy")
                {
                    outboundSchedule.EconomySeatsAvailable -= requiredSeats;
                    if (returnSchedule != null)
                        returnSchedule.EconomySeatsAvailable -= requiredSeats;
                }
                else if (dto.CabinClass.ToLower() == "business")
                {
                    outboundSchedule.BusinessSeatsAvailable -= requiredSeats;
                    if (returnSchedule != null)
                        returnSchedule.BusinessSeatsAvailable -= requiredSeats;
                }

                _unitOfWork.FlightSchedules.Update(outboundSchedule);
                if (returnSchedule != null)
                    _unitOfWork.FlightSchedules.Update(returnSchedule);

                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                if (booking.Status == BookingStatus.Confirmed)
                {
                    _ = Task.Run(() => _voucherProIntegrationService.ProcessBookingVoucherAsync(booking, CancellationToken.None));
                }

                return Result<BookingConfirmationDto>.Success(new BookingConfirmationDto
                {
                    Id = booking.Id,
                    ReferenceNumber = booking.ReferenceNumber,
                    Status = booking.Status.ToString(),
                    TotalAmount = booking.TotalAmount,
                    Currency = booking.Currency,
                    CreatedAt = booking.CreatedAt
                });
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return Result<BookingConfirmationDto>.Failure($"Failed to create flight booking: {ex.Message}");
            }
        }

        public async Task<Result<BookingConfirmationDto>> CreatePackageBookingAsync(CreatePackageBookingDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync(cancellationToken);

                // Validate package exists and is active
                var package = await _unitOfWork.Packages.GetByIdAsync(dto.PackageId, cancellationToken);
                if (package == null || !package.IsActive)
                    return Result<BookingConfirmationDto>.Failure("Package not found or inactive");

                // Validate start date
                if (dto.StartDate < DateTime.UtcNow.Date)
                    return Result<BookingConfirmationDto>.Failure("Start date cannot be in the past");

                // Calculate end date based on package duration
                DateTime endDate = dto.StartDate.AddDays(package.DurationDays);

                // Calculate total amount
                decimal totalAmount = package.Price * dto.NumberOfTravelers;

                // Create booking with guest info
                var booking = new Booking
                {
                    Id = Guid.NewGuid(),
                    ReferenceNumber = GenerateReferenceNumber(),
                    UserId = dto.UserId,
                    Type = BookingType.Package,
                    Status = BookingStatus.Pending,
                    TotalAmount = totalAmount,
                    TaxAmount = 0,
                    ServiceFee = 0,
                    Currency = package.Currency,
                    CreatedAt = DateTime.UtcNow,
                    GuestFirstName = dto.GuestFirstName,
                    GuestLastName = dto.GuestLastName,
                    GuestEmail = dto.GuestEmail,
                    GuestPhone = dto.GuestPhone,
                    GuestCountryCode = dto.GuestCountryCode ?? "+966",
                    SpecialRequests = "",
                };

                await _unitOfWork.Bookings.AddAsync(booking, cancellationToken);

                // Apply wallet payment if requested
                await ApplyWalletPaymentAsync(booking, dto.UserId, dto.UseWallet, cancellationToken);

                // Create package booking
                var packageBooking = new PackageBooking
                {
                    Id = Guid.NewGuid(),
                    BookingId = booking.Id,
                    PackageId = dto.PackageId,
                    StartDate = dto.StartDate,
                    Adults = dto.NumberOfTravelers,
                    Children = 0
                };

                await _unitOfWork.PackageBookings.AddAsync(packageBooking, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                if (booking.Status == BookingStatus.Confirmed)
                {
                    _ = Task.Run(() => _voucherProIntegrationService.ProcessBookingVoucherAsync(booking, CancellationToken.None));
                }

                return Result<BookingConfirmationDto>.Success(new BookingConfirmationDto
                {
                    Id = booking.Id,
                    ReferenceNumber = booking.ReferenceNumber,
                    Status = booking.Status.ToString(),
                    TotalAmount = booking.TotalAmount,
                    Currency = booking.Currency,
                    CreatedAt = booking.CreatedAt
                });
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return Result<BookingConfirmationDto>.Failure($"Failed to create package booking: {ex.Message}");
            }
        }

        public async Task<Result<BookingDetailDto>> GetByReferenceAsync(string referenceNumber, string email, CancellationToken cancellationToken = default)
        {
            try
            {
                var booking = await _unitOfWork.Bookings.FindAsync(
                    b => b.ReferenceNumber == referenceNumber && b.GuestEmail == email,
                    b => b.HotelBooking,
                    b => b.FlightBooking,
                    b => b.PackageBooking,
                    b => b.Payment
                );

                if (booking == null)
                    return Result<BookingDetailDto>.Failure("Booking not found");

                var bookingDto = _mapper.Map<BookingDetailDto>(booking);
                return Result<BookingDetailDto>.Success(bookingDto);
            }
            catch (Exception ex)
            {
                return Result<BookingDetailDto>.Failure($"Failed to retrieve booking: {ex.Message}");
            }
        }

        public async Task<Result<BookingDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var booking = await _unitOfWork.Bookings.GetByIdAsync(
                    id,
                    b => b.HotelBooking,
                    b => b.FlightBooking,
                    b => b.PackageBooking,
                    b => b.Payment
                );

                if (booking == null)
                    return Result<BookingDetailDto>.Failure("Booking not found");

                var bookingDto = _mapper.Map<BookingDetailDto>(booking);
                return Result<BookingDetailDto>.Success(bookingDto);
            }
            catch (Exception ex)
            {
                return Result<BookingDetailDto>.Failure($"Failed to retrieve booking: {ex.Message}");
            }
        }

        public async Task<Result<List<BookingListDto>>> GetAllAsync(BookingSearchQuery query, CancellationToken cancellationToken = default)
        {
            try
            {
                var (bookings, totalCount) = await _unitOfWork.Bookings.GetPagedAsync(
                    pageNumber: query.PageNumber,
                    pageSize: query.PageSize,
                    predicate: b =>
                        (!query.Status.HasValue || b.Status == query.Status) &&
                        (!query.BookingType.HasValue || b.Type == query.BookingType) &&
                        (!query.FromDate.HasValue || b.CreatedAt >= query.FromDate) &&
                        (!query.ToDate.HasValue || b.CreatedAt <= query.ToDate) &&
                        (string.IsNullOrEmpty(query.BookingNumber) || b.ReferenceNumber.Contains(query.BookingNumber)) &&
                        (string.IsNullOrEmpty(query.CustomerEmail) || b.GuestEmail == query.CustomerEmail),
                    orderBy: q => q.OrderByDescending(b => b.CreatedAt),
                    b => b.User!
                );

                var result = bookings.Select(b => new BookingListDto
                {
                    Id = b.Id,
                    BookingNumber = b.ReferenceNumber ?? "",
                    BookingType = b.Type,
                    Status = b.Status,
                    TotalAmount = b.TotalAmount,
                    Currency = b.Currency ?? "SAR",
                    BookingDate = b.CreatedAt,
                    CustomerName = b.User != null
                        ? $"{b.User.FirstName} {b.User.LastName}"
                        : $"{b.GuestFirstName} {b.GuestLastName}",
                    CustomerEmail = b.User != null
                        ? b.User.Email
                        : b.GuestEmail ?? ""
                }).ToList();

                return Result<List<BookingListDto>>.Success(result);
            }
            catch (Exception ex)
            {
                return Result<List<BookingListDto>>.Failure($"Failed to retrieve bookings: {ex.Message}");
            }
        }

        public async Task<Result<List<BookingListDto>>> GetUserBookingsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            try
            {
                var bookings = await _unitOfWork.Bookings.FindAllAsync(
                    b => b.UserId == userId,
                    cancellationToken
                );

                var bookingDtos = bookings.OrderByDescending(b => b.CreatedAt).Select(b => new BookingListDto
                {
                    Id = b.Id,
                    BookingNumber = b.ReferenceNumber ?? "",
                    BookingType = b.Type,
                    Status = b.Status,
                    TotalAmount = b.TotalAmount,
                    Currency = b.Currency ?? "SAR",
                    BookingDate = b.CreatedAt,
                    CustomerName = b.User != null
                        ? $"{b.User.FirstName} {b.User.LastName}"
                        : $"{b.GuestFirstName} {b.GuestLastName}",
                    CustomerEmail = b.User != null
                        ? b.User.Email
                        : b.GuestEmail ?? ""
                }).ToList();
                return Result<List<BookingListDto>>.Success(bookingDtos);
            }
            catch (Exception ex)
            {
                return Result<List<BookingListDto>>.Failure($"Failed to retrieve user bookings: {ex.Message}");
            }
        }

        public async Task<Result> CancelBookingAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync(cancellationToken);

                var booking = await _unitOfWork.Bookings.GetByIdAsync(
                    id,
                    b => b.FlightBooking
                );

                if (booking == null)
                    return Result.Failure("Booking not found");

                if (booking.Status == BookingStatus.Cancelled)
                    return Result.Failure("Booking is already cancelled");

                // Update booking status
                booking.Status = BookingStatus.Cancelled;
                booking.CancelledAt = DateTime.UtcNow;
                _unitOfWork.Bookings.Update(booking);

                // If flight booking, release seats
                if (booking.Type == BookingType.Flight && booking.FlightBooking != null)
                {
                    var flightBooking = await _unitOfWork.FlightBookings.GetByIdAsync(
                        booking.FlightBooking.Id,
                        fb => fb.FlightSchedule,
                        fb => fb.Passengers
                    );

                    if (flightBooking != null)
                    {
                        // Release seats
                        var passengers = await _unitOfWork.FlightPassengers.FindAllAsync(
                            p => p.FlightBookingId == flightBooking.Id,
                            cancellationToken
                        );

                        int passengerCount = passengers.Count();

                        // Update available seats
                        var schedule = flightBooking.FlightSchedule;
                        if (flightBooking.Class.ToLower() == "economy")
                            schedule.EconomySeatsAvailable += passengerCount;
                        else if (flightBooking.Class.ToLower() == "business")
                            schedule.BusinessSeatsAvailable += passengerCount;

                        _unitOfWork.FlightSchedules.Update(schedule);

                        // Mark seats as not occupied
                        foreach (var passenger in passengers)
                        {
                            if (!string.IsNullOrEmpty(passenger.SeatNumber))
                            {
                                var seat = await _unitOfWork.Seats.FindAsync(
                                    s => s.SeatNumber == passenger.SeatNumber && s.FlightScheduleId == flightBooking.FlightScheduleId,
                                    cancellationToken
                                );
                                if (seat != null)
                                {
                                    seat.IsOccupied = false;
                                    _unitOfWork.Seats.Update(seat);
                                }
                            }
                        }
                    }
                }

                // Trigger refund for all completed payments
                var payments = await _unitOfWork.Payments.FindAllAsync(
                    p => p.BookingId == id && p.Status == PaymentStatus.Completed,
                    cancellationToken
                );

                decimal totalRefundAmount = 0;
                foreach (var payment in payments)
                {
                    payment.Status = PaymentStatus.Refunded;
                    _unitOfWork.Payments.Update(payment);
                    totalRefundAmount += payment.Amount;
                }

                // If booking belongs to registered user, refund everything to wallet
                if (booking.UserId.HasValue && totalRefundAmount > 0)
                {
                    var user = await _unitOfWork.Users.GetByIdAsync(booking.UserId.Value, cancellationToken);
                    if (user != null)
                    {
                        user.WalletBalance += totalRefundAmount;
                        _unitOfWork.Users.Update(user);

                        var walletTx = new WalletTransaction
                        {
                            Id = Guid.NewGuid(),
                            UserId = user.Id,
                            Amount = totalRefundAmount,
                            Type = "Refund",
                            Description = $"استرداد قيمة الحجز الملغي رقم {booking.ReferenceNumber} إلى المحفظة",
                            CreatedAt = DateTime.UtcNow
                        };
                        await _unitOfWork.WalletTransactions.AddAsync(walletTx, cancellationToken);

                        // Deduct loyalty points earned for this booking
                        var earnedPointsTxs = await _unitOfWork.LoyaltyTransactions.FindAllAsync(
                            l => l.UserId == user.Id && l.Type == "Earned" && l.Description.Contains(booking.ReferenceNumber),
                            cancellationToken
                        );
                        int pointsToDeduct = earnedPointsTxs.Sum(l => l.Points);
                        if (pointsToDeduct > 0)
                        {
                            user.LoyaltyPoints = Math.Max(0, user.LoyaltyPoints - pointsToDeduct);
                            _unitOfWork.Users.Update(user);

                            var loyaltyDeductionTx = new LoyaltyTransaction
                            {
                                Id = Guid.NewGuid(),
                                UserId = user.Id,
                                Points = -pointsToDeduct,
                                Type = "Redeemed",
                                Description = $"خصم نقاط الحجز الملغي رقم {booking.ReferenceNumber}",
                                CreatedAt = DateTime.UtcNow
                            };
                            await _unitOfWork.LoyaltyTransactions.AddAsync(loyaltyDeductionTx, cancellationToken);
                        }
                    }
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                return Result.Success();
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return Result.Failure($"Failed to cancel booking: {ex.Message}");
            }
        }

        public async Task<Result> ConfirmBookingAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var booking = await _unitOfWork.Bookings.GetByIdAsync(id, cancellationToken);
                if (booking == null)
                    return Result.Failure("Booking not found");

                if (booking.Status == BookingStatus.Confirmed)
                    return Result.Failure("Booking is already confirmed");

                if (booking.Status == BookingStatus.Cancelled)
                    return Result.Failure("Cannot confirm a cancelled booking");

                booking.Status = BookingStatus.Confirmed;
                booking.ConfirmedAt = DateTime.UtcNow;
                _unitOfWork.Bookings.Update(booking);

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Auto-generate and send Voucher Pro PDF in background task
                _ = Task.Run(() => _voucherProIntegrationService.ProcessBookingVoucherAsync(booking, CancellationToken.None));

                return Result.Success();
            }
            catch (Exception ex)
            {
                return Result.Failure($"Failed to confirm booking: {ex.Message}");
            }
        }

        private async Task ApplyWalletPaymentAsync(Booking booking, Guid? userId, bool useWallet, CancellationToken cancellationToken)
        {
            if (useWallet && userId.HasValue)
            {
                var user = await _unitOfWork.Users.GetByIdAsync(userId.Value, cancellationToken);
                if (user != null && user.WalletBalance > 0)
                {
                    var walletDeduction = Math.Min(booking.TotalAmount, user.WalletBalance);
                    user.WalletBalance -= walletDeduction;
                    _unitOfWork.Users.Update(user);

                    var walletTx = new WalletTransaction
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        Amount = -walletDeduction,
                        Type = "Purchase",
                        Description = $"دفع قيمة الحجز رقم {booking.ReferenceNumber} من المحفظة",
                        CreatedAt = DateTime.UtcNow
                    };
                    await _unitOfWork.WalletTransactions.AddAsync(walletTx, cancellationToken);

                    var walletPayment = new Payment
                    {
                        Id = Guid.NewGuid(),
                        BookingId = booking.Id,
                        Amount = walletDeduction,
                        Currency = booking.Currency ?? "SAR",
                        Method = PaymentMethod.Wallet,
                        Status = PaymentStatus.Completed,
                        TransactionId = $"WLT-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                        CardLast4 = "",
                        CardBrand = "Wallet",
                        CreatedAt = DateTime.UtcNow,
                        PaidAt = DateTime.UtcNow
                    };
                    await _unitOfWork.Payments.AddAsync(walletPayment, cancellationToken);

                    if (walletDeduction == booking.TotalAmount)
                    {
                        booking.Status = BookingStatus.Confirmed;
                        booking.ConfirmedAt = DateTime.UtcNow;

                        // Calculate and award loyalty points
                        decimal cashbackPercentage = 0.01m; // Amateur (default)
                        if (user.LoyaltyPoints >= 2000 && user.LoyaltyPoints < 5000)
                            cashbackPercentage = 0.015m;
                        else if (user.LoyaltyPoints >= 5000 && user.LoyaltyPoints < 10000)
                            cashbackPercentage = 0.02m;
                        else if (user.LoyaltyPoints >= 10000)
                            cashbackPercentage = 0.03m;

                        int pointsToAdd = (int)Math.Round(booking.TotalAmount * cashbackPercentage * 100);
                        if (pointsToAdd > 0)
                        {
                            user.LoyaltyPoints += pointsToAdd;
                            _unitOfWork.Users.Update(user);

                            var loyaltyTx = new LoyaltyTransaction
                            {
                                Id = Guid.NewGuid(),
                                UserId = user.Id,
                                Points = pointsToAdd,
                                Type = "Earned",
                                Description = $"كسب نقاط مقابل الحجز رقم {booking.ReferenceNumber}",
                                CreatedAt = DateTime.UtcNow
                            };
                            await _unitOfWork.LoyaltyTransactions.AddAsync(loyaltyTx, cancellationToken);
                        }
                    }
                }
            }
        }

        private string GenerateReferenceNumber()
        {
            var random = new Random();
            var number = random.Next(10000, 99999);
            return $"ALM-{number}";
        }
    }
}

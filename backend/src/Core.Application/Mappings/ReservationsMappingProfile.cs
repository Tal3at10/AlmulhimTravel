using AutoMapper;
using Core.Application.Abstraction.DTOs.Reservations;
using Core.Application.Helpers;
using Core.Domain.Entities.Reservations;
using Core.Domain.Enums;

namespace Core.Application.Mappings
{
    public class ReservationsMappingProfile : Profile
    {
        public ReservationsMappingProfile()
        {
            // Booking Mappings
            CreateMap<Booking, BookingListDto>()
                .ForMember(dest => dest.BookingNumber, opt => opt.MapFrom(src => src.ReferenceNumber))
                .ForMember(dest => dest.BookingType, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => 
                    $"{src.GuestFirstName} {src.GuestLastName}"))
                .ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.GuestEmail));

            CreateMap<Booking, BookingDetailDto>()
                .ForMember(dest => dest.BookingNumber, opt => opt.MapFrom(src => src.ReferenceNumber))
                .ForMember(dest => dest.BookingType, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => 
                    $"{src.GuestFirstName} {src.GuestLastName}"))
                .ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.GuestEmail))
                .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src => 
                    $"{src.GuestCountryCode}{src.GuestPhone}"));

            CreateMap<CreateBookingDto, Booking>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.ReferenceNumber, opt => opt.Ignore())
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.BookingType))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => BookingStatus.Pending))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.GuestFirstName, opt => opt.MapFrom(src => StringHelper.GetFirstName(src.CustomerName)))
                .ForMember(dest => dest.GuestLastName, opt => opt.MapFrom(src => StringHelper.GetLastName(src.CustomerName)))
                .ForMember(dest => dest.GuestEmail, opt => opt.MapFrom(src => src.CustomerEmail))
                .ForMember(dest => dest.GuestPhone, opt => opt.MapFrom(src => src.CustomerPhone))
                .ForMember(dest => dest.GuestCountryCode, opt => opt.MapFrom(src => "+966"));

            // HotelBooking Mappings
            CreateMap<HotelBooking, HotelBookingDto>()
                .ForMember(dest => dest.HotelName, opt => opt.MapFrom(src => src.Hotel.Name))
                .ForMember(dest => dest.RoomName, opt => opt.MapFrom(src => src.Room.Name))
                .ForMember(dest => dest.RatePlanName, opt => opt.MapFrom(src => "Standard Rate"))
                .ForMember(dest => dest.NumberOfNights, opt => opt.MapFrom(src => src.Nights))
                .ForMember(dest => dest.NumberOfGuests, opt => opt.MapFrom(src => src.Guests))
                .ForMember(dest => dest.RoomPrice, opt => opt.MapFrom(src => src.Booking.TotalAmount / src.Nights))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.Booking.TotalAmount));

            CreateMap<CreateHotelBookingDto, HotelBooking>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Nights, opt => opt.MapFrom(src => 
                    (src.CheckOutDate - src.CheckInDate).Days))
                .ForMember(dest => dest.Guests, opt => opt.MapFrom(src => src.NumberOfGuests))
                .ForMember(dest => dest.RoomQuantity, opt => opt.MapFrom(src => 1));

            // FlightBooking Mappings
            CreateMap<FlightBooking, FlightBookingDto>()
                .ForMember(dest => dest.OutboundFlightNumber, opt => opt.MapFrom(src => 
                    src.FlightSchedule.Flight.FlightNumber))
                .ForMember(dest => dest.OutboundDepartureTime, opt => opt.MapFrom(src => 
                    src.FlightSchedule.Date.Add(src.FlightSchedule.Flight.DepartureTime)))
                .ForMember(dest => dest.OutboundArrivalTime, opt => opt.MapFrom(src => 
                    src.FlightSchedule.Date.Add(src.FlightSchedule.Flight.ArrivalTime)))
                .ForMember(dest => dest.ReturnFlightId, opt => opt.MapFrom(src => (Guid?)null))
                .ForMember(dest => dest.ReturnFlightNumber, opt => opt.MapFrom(src => (string?)null))
                .ForMember(dest => dest.ReturnDepartureTime, opt => opt.MapFrom(src => src.ReturnDate))
                .ForMember(dest => dest.ReturnArrivalTime, opt => opt.MapFrom(src => (DateTime?)null))
                .ForMember(dest => dest.CabinClass, opt => opt.MapFrom(src => src.Class))
                .ForMember(dest => dest.NumberOfPassengers, opt => opt.MapFrom(src => 
                    src.Passengers.Count))
                .ForMember(dest => dest.FlightPrice, opt => opt.MapFrom(src => 
                    src.Booking.TotalAmount / src.Passengers.Count))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.Booking.TotalAmount));

            CreateMap<CreateFlightBookingDto, FlightBooking>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Class, opt => opt.MapFrom(src => src.CabinClass))
                .ForMember(dest => dest.DepartureDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.ReturnDate, opt => opt.MapFrom(src => (DateTime?)null));

            // FlightPassenger Mappings
            CreateMap<FlightPassenger, FlightPassengerDto>()
                .ForMember(dest => dest.PassengerType, opt => opt.MapFrom(src => "Adult"))
                .ForMember(dest => dest.OutboundSeatId, opt => opt.MapFrom(src => (Guid?)null))
                .ForMember(dest => dest.OutboundSeatNumber, opt => opt.MapFrom(src => src.SeatNumber))
                .ForMember(dest => dest.ReturnSeatId, opt => opt.MapFrom(src => (Guid?)null))
                .ForMember(dest => dest.ReturnSeatNumber, opt => opt.MapFrom(src => (string?)null));

            CreateMap<CreateFlightPassengerDto, FlightPassenger>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => "Mr"))
                .ForMember(dest => dest.SeatNumber, opt => opt.MapFrom(src => ""));

            // PackageBooking Mappings
            CreateMap<PackageBooking, PackageBookingDto>()
                .ForMember(dest => dest.PackageName, opt => opt.MapFrom(src => src.Package.TitleAr))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => 
                    src.StartDate.AddDays(src.Package.DurationDays)))
                .ForMember(dest => dest.NumberOfTravelers, opt => opt.MapFrom(src => src.Adults + src.Children))
                .ForMember(dest => dest.PackagePrice, opt => opt.MapFrom(src => src.Package.Price))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.Booking.TotalAmount));

            CreateMap<CreatePackageBookingDto, PackageBooking>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Adults, opt => opt.MapFrom(src => src.NumberOfTravelers))
                .ForMember(dest => dest.Children, opt => opt.MapFrom(src => 0));

            // Payment Mappings
            CreateMap<Payment, PaymentDto>()
                .ForMember(dest => dest.PaymentMethod, opt => opt.MapFrom(src => src.Method))
                .ForMember(dest => dest.PaymentDate, opt => opt.MapFrom(src => src.CreatedAt));

            CreateMap<CreatePaymentDto, Payment>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Method, opt => opt.MapFrom(src => src.PaymentMethod))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => PaymentStatus.Pending))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}

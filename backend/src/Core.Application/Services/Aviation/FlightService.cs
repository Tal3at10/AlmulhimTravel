using AutoMapper;
using Core.Application.Abstraction.DTOs.Aviation;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Aviation;
using Microsoft.EntityFrameworkCore;

namespace Core.Application.Services.Aviation
{
    public class FlightService : IFlightService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public FlightService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<PaginatedResult<FlightCardDto>>> SearchAsync(
            FlightSearchQuery query,
            CancellationToken cancellationToken = default)
        {
            try
            {
                // Start with active flights
                var flightsQuery = _unitOfWork.Flights.Query(f => f.IsActive).AsNoTracking();

                // Filter by route
                if (query.DepartureAirportId.HasValue)
                {
                    flightsQuery = flightsQuery.Where(f => f.DepartureAirportId == query.DepartureAirportId.Value);
                }

                if (query.ArrivalAirportId.HasValue)
                {
                    flightsQuery = flightsQuery.Where(f => f.ArrivalAirportId == query.ArrivalAirportId.Value);
                }

                // Filter by direct flights only
                if (query.DirectOnly == true)
                {
                    flightsQuery = flightsQuery.Where(f => f.Stops == 0);
                }

                // Get flights list
                var flights = flightsQuery.ToList();

                // Load related data
                foreach (var flight in flights)
                {
                    flight.Airline = await _unitOfWork.Airlines.GetByIdAsync(flight.AirlineId, cancellationToken);
                    flight.DepartureAirport = await _unitOfWork.Airports.GetByIdAsync(flight.DepartureAirportId, cancellationToken);
                    flight.ArrivalAirport = await _unitOfWork.Airports.GetByIdAsync(flight.ArrivalAirportId, cancellationToken);
                    flight.Schedules = (await _unitOfWork.FlightSchedules
                        .FindAllAsync(s => s.FlightId == flight.Id && s.IsActive, cancellationToken))
                        .ToList();

                    // Load seats for each schedule
                    foreach (var schedule in flight.Schedules)
                    {
                        schedule.Seats = (await _unitOfWork.Seats
                            .FindAllAsync(s => s.FlightScheduleId == schedule.Id, cancellationToken))
                            .ToList();
                    }
                }

                // Filter by departure date if provided
                if (query.DepartureDate.HasValue)
                {
                    flights = flights.Where(f =>
                        f.Schedules.Any(s => s.Date.Date == query.DepartureDate.Value.Date)
                    ).ToList();
                }

                // Filter by cabin class and price
                if (!string.IsNullOrEmpty(query.CabinClass))
                {
                    var cabinClass = query.CabinClass.ToLower();
                    
                    if (cabinClass == "economy")
                    {
                        if (query.MaxPrice.HasValue)
                        {
                            flights = flights.Where(f => f.EconomyPrice <= query.MaxPrice.Value).ToList();
                        }
                    }
                    else if (cabinClass == "business")
                    {
                        if (query.MaxPrice.HasValue)
                        {
                            flights = flights.Where(f => f.BusinessPrice <= query.MaxPrice.Value).ToList();
                        }
                    }
                }

                // Apply sorting
                flights = query.SortBy?.ToLower() switch
                {
                    "price" => flights.OrderBy(f => f.EconomyPrice).ToList(),
                    "price-desc" => flights.OrderByDescending(f => f.EconomyPrice).ToList(),
                    "duration" => flights.OrderBy(f => f.DurationMinutes).ToList(),
                    "departure" => flights.OrderBy(f => f.DepartureTime).ToList(),
                    _ => flights.OrderBy(f => f.DepartureTime).ToList() // Default: earliest departure
                };

                // Get total count
                var totalCount = flights.Count;

                // Apply pagination
                var paginatedFlights = flights
                    .Skip((query.PageNumber - 1) * query.PageSize)
                    .Take(query.PageSize)
                    .ToList();

                var flightDtos = _mapper.Map<List<FlightCardDto>>(paginatedFlights);
                var paginatedResult = new PaginatedResult<FlightCardDto>(
                    flightDtos,
                    totalCount,
                    query.PageNumber,
                    query.PageSize
                );

                return Result<PaginatedResult<FlightCardDto>>.Success(paginatedResult);
            }
            catch (Exception ex)
            {
                return Result<PaginatedResult<FlightCardDto>>.Failure($"Error searching flights: {ex.Message}");
            }
        }

        public async Task<Result<FlightDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var flight = await _unitOfWork.Flights.GetByIdAsync(
                    id,
                    f => f.Airline,
                    f => f.DepartureAirport,
                    f => f.ArrivalAirport,
                    f => f.Schedules
                );

                if (flight == null)
                    return Result<FlightDetailDto>.Failure("Flight not found");

                // Load seats for each schedule
                foreach (var schedule in flight.Schedules.Where(s => s.IsActive))
                {
                    schedule.Seats = (await _unitOfWork.Seats
                        .FindAllAsync(s => s.FlightScheduleId == schedule.Id, cancellationToken))
                        .ToList();
                }

                var flightDto = _mapper.Map<FlightDetailDto>(flight);
                return Result<FlightDetailDto>.Success(flightDto);
            }
            catch (Exception ex)
            {
                return Result<FlightDetailDto>.Failure($"Error retrieving flight: {ex.Message}");
            }
        }

        public async Task<Result<FlightDetailDto>> GetScheduleDetailsAsync(
            Guid scheduleId,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var schedule = await _unitOfWork.FlightSchedules.GetByIdAsync(
                    scheduleId,
                    s => s.Flight
                );

                if (schedule == null)
                    return Result<FlightDetailDto>.Failure("Flight schedule not found");

                // Load flight details
                var flight = await _unitOfWork.Flights.GetByIdAsync(
                    schedule.FlightId,
                    f => f.Airline,
                    f => f.DepartureAirport,
                    f => f.ArrivalAirport
                );

                if (flight == null)
                    return Result<FlightDetailDto>.Failure("Flight not found");

                // Load seats for this specific schedule
                schedule.Seats = (await _unitOfWork.Seats
                    .FindAllAsync(s => s.FlightScheduleId == scheduleId, cancellationToken))
                    .ToList();

                flight.Schedules = new List<Core.Domain.Entities.Aviation.FlightSchedule> { schedule };

                var flightDto = _mapper.Map<FlightDetailDto>(flight);
                return Result<FlightDetailDto>.Success(flightDto);
            }
            catch (Exception ex)
            {
                return Result<FlightDetailDto>.Failure($"Error retrieving flight schedule: {ex.Message}");
            }
        }

        public async Task<Result<List<SeatDto>>> GetAvailableSeatsAsync(
            Guid scheduleId,
            string cabinClass,
            CancellationToken cancellationToken = default)
        {
            try
            {
                // Verify schedule exists
                var scheduleExists = await _unitOfWork.FlightSchedules.ExistsAsync(scheduleId, cancellationToken);
                if (!scheduleExists)
                    return Result<List<SeatDto>>.Failure("Flight schedule not found");

                // Get available seats for the cabin class
                var seats = await _unitOfWork.Seats.FindAllAsync(
                    s => s.FlightScheduleId == scheduleId &&
                         s.Class.ToLower() == cabinClass.ToLower() &&
                         !s.IsOccupied,
                    cancellationToken
                );

                var sortedSeats = seats
                    .OrderBy(s => s.Row)
                    .ThenBy(s => s.Column)
                    .ToList();

                var seatDtos = _mapper.Map<List<SeatDto>>(sortedSeats);
                return Result<List<SeatDto>>.Success(seatDtos);
            }
            catch (Exception ex)
            {
                return Result<List<SeatDto>>.Failure($"Error retrieving available seats: {ex.Message}");
            }
        }
    }
}

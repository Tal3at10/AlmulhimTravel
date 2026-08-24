using AutoMapper;
using Core.Application.Abstraction.DTOs.Aviation;
using Core.Domain.Entities.Aviation;

namespace Core.Application.Mappings
{
    public class AviationMappingProfile : Profile
    {
        public AviationMappingProfile()
        {
            // Airline Mappings
            CreateMap<Airline, AirlineDto>();

            // Airport Mappings
            CreateMap<Airport, AirportDto>()
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.CityAr));

            // Flight Mappings
            CreateMap<Flight, FlightCardDto>()
                .ForMember(dest => dest.DepartureTime, opt => opt.MapFrom(src => DateTime.Today.Add(src.DepartureTime)))
                .ForMember(dest => dest.ArrivalTime, opt => opt.MapFrom(src => DateTime.Today.Add(src.ArrivalTime)))
                .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => "SAR"))
                .ForMember(dest => dest.AvailableSeats, opt => opt.MapFrom(src => 
                    src.Schedules.SelectMany(s => s.Seats).Count(seat => !seat.IsOccupied)))
                .ForMember(dest => dest.IsDirect, opt => opt.MapFrom(src => src.Stops == 0));

            CreateMap<Flight, FlightDetailDto>()
                .ForMember(dest => dest.DepartureTime, opt => opt.MapFrom(src => DateTime.Today.Add(src.DepartureTime)))
                .ForMember(dest => dest.ArrivalTime, opt => opt.MapFrom(src => DateTime.Today.Add(src.ArrivalTime)))
                .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => "SAR"))
                .ForMember(dest => dest.AircraftType, opt => opt.MapFrom(src => ""))
                .ForMember(dest => dest.TotalSeats, opt => opt.MapFrom(src => 
                    src.Schedules.SelectMany(s => s.Seats).Count()))
                .ForMember(dest => dest.AvailableSeats, opt => opt.MapFrom(src => 
                    src.Schedules.SelectMany(s => s.Seats).Count(seat => !seat.IsOccupied)))
                .ForMember(dest => dest.IsDirect, opt => opt.MapFrom(src => src.Stops == 0))
                .ForMember(dest => dest.Schedules, opt => opt.MapFrom(src => src.Schedules))
                .ForMember(dest => dest.AvailableSeatsDetails, opt => opt.MapFrom(src => 
                    src.Schedules.SelectMany(s => s.Seats).Where(seat => !seat.IsOccupied)));

            // FlightSchedule Mappings
            CreateMap<FlightSchedule, FlightScheduleDto>()
                .ForMember(dest => dest.DepartureTime, opt => opt.MapFrom(src => src.Date.Add(src.Flight.DepartureTime)))
                .ForMember(dest => dest.ArrivalTime, opt => opt.MapFrom(src => src.Date.Add(src.Flight.ArrivalTime)))
                .ForMember(dest => dest.DayOfWeek, opt => opt.MapFrom(src => src.Date.DayOfWeek.ToString()));

            // Seat Mappings
            CreateMap<Seat, SeatDto>()
                .ForMember(dest => dest.SeatClass, opt => opt.MapFrom(src => src.Class))
                .ForMember(dest => dest.IsAvailable, opt => opt.MapFrom(src => !src.IsOccupied))
                .ForMember(dest => dest.IsWindowSeat, opt => opt.MapFrom(src => src.IsWindow))
                .ForMember(dest => dest.IsAisleSeat, opt => opt.MapFrom(src => src.IsAisle))
                .ForMember(dest => dest.ExtraCharge, opt => opt.MapFrom(src => src.ExtraPrice));
        }
    }
}

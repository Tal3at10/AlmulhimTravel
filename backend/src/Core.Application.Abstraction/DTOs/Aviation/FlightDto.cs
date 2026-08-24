using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.DTOs.Aviation
{
    public class FlightCardDto
    {
        public Guid Id { get; set; }
        public string FlightNumber { get; set; } = string.Empty;
        public AirlineDto Airline { get; set; } = null!;
        public AirportDto DepartureAirport { get; set; } = null!;
        public AirportDto ArrivalAirport { get; set; } = null!;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public string Duration { get; set; } = string.Empty;
        public decimal EconomyPrice { get; set; }
        public decimal BusinessPrice { get; set; }
        public string Currency { get; set; } = "SAR";
        public int AvailableSeats { get; set; }
        public bool IsDirect { get; set; }
    }

    public class FlightDetailDto
    {
        public Guid Id { get; set; }
        public string FlightNumber { get; set; } = string.Empty;
        public AirlineDto Airline { get; set; } = null!;
        public AirportDto DepartureAirport { get; set; } = null!;
        public AirportDto ArrivalAirport { get; set; } = null!;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public string Duration { get; set; } = string.Empty;
        public decimal EconomyPrice { get; set; }
        public decimal BusinessPrice { get; set; }
        public string Currency { get; set; } = "SAR";
        public string AircraftType { get; set; } = string.Empty;
        public int TotalSeats { get; set; }
        public int AvailableSeats { get; set; }
        public bool IsDirect { get; set; }
        public List<FlightScheduleDto> Schedules { get; set; } = new();
        public List<SeatDto> AvailableSeatsDetails { get; set; } = new();
    }

    public class FlightSearchQuery : PagedQuery
    {
        public Guid? DepartureAirportId { get; set; }
        public Guid? ArrivalAirportId { get; set; }
        public DateTime? DepartureDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public int Adults { get; set; } = 1;
        public int Children { get; set; } = 0;
        public int Infants { get; set; } = 0;
        public string? CabinClass { get; set; } // Economy, Business
        public bool? DirectOnly { get; set; }
        public decimal? MaxPrice { get; set; }
    }

    public class FlightScheduleDto
    {
        public Guid Id { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}

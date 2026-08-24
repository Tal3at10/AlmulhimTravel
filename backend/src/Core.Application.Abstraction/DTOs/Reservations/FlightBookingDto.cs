using System.ComponentModel.DataAnnotations;

namespace Core.Application.Abstraction.DTOs.Reservations
{
    public class FlightBookingDto
    {
        public Guid Id { get; set; }
        public Guid OutboundFlightId { get; set; }
        public string OutboundFlightNumber { get; set; } = string.Empty;
        public DateTime OutboundDepartureTime { get; set; }
        public DateTime OutboundArrivalTime { get; set; }
        public Guid? ReturnFlightId { get; set; }
        public string? ReturnFlightNumber { get; set; }
        public DateTime? ReturnDepartureTime { get; set; }
        public DateTime? ReturnArrivalTime { get; set; }
        public string CabinClass { get; set; } = string.Empty;
        public int NumberOfPassengers { get; set; }
        public decimal FlightPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public List<FlightPassengerDto> Passengers { get; set; } = new();
    }

    public class CreateFlightBookingDto
    {
        public Guid OutboundFlightId { get; set; }

        public Guid? ReturnFlightId { get; set; }

        [Required(ErrorMessage = "CabinClass is required")]
        public string CabinClass { get; set; } = string.Empty;

        [Required(ErrorMessage = "At least one passenger is required")]
        [MinLength(1, ErrorMessage = "At least one passenger is required")]
        public List<CreateFlightPassengerDto> Passengers { get; set; } = new();

        // Guest Info
        [Required(ErrorMessage = "GuestFirstName is required")]
        [StringLength(100)]
        public string GuestFirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "GuestLastName is required")]
        [StringLength(100)]
        public string GuestLastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "GuestEmail is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string GuestEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "GuestPhone is required")]
        public string GuestPhone { get; set; } = string.Empty;

        public string? GuestCountryCode { get; set; }
        public Guid? UserId { get; set; }
        public bool UseWallet { get; set; } = false;

        // GDS / Duffel Dynamic Flight Fields
        public string? FlightNumber { get; set; }
        public string? AirlineCode { get; set; }
        public string? AirlineName { get; set; }
        public string? DepartureAirportCode { get; set; }
        public string? ArrivalAirportCode { get; set; }
        public DateTime? DepartureTime { get; set; }
        public DateTime? ArrivalTime { get; set; }
        public decimal? FlightPrice { get; set; }
        public string? SpecialRequests { get; set; }
        public string? OfferId { get; set; }
    }

    public class FlightPassengerDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PassportNumber { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Nationality { get; set; } = string.Empty;
        public string PassengerType { get; set; } = string.Empty; // Adult, Child, Infant
        public Guid? OutboundSeatId { get; set; }
        public string? OutboundSeatNumber { get; set; }
        public Guid? ReturnSeatId { get; set; }
        public string? ReturnSeatNumber { get; set; }
    }

    public class CreateFlightPassengerDto
    {
        public string Id { get; set; } = string.Empty;

        [Required(ErrorMessage = "FirstName is required")]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "LastName is required")]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "PassportNumber is required")]
        public string PassportNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "DateOfBirth is required")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Nationality is required")]
        public string Nationality { get; set; } = string.Empty;

        [Required(ErrorMessage = "PassengerType is required")]
        public string PassengerType { get; set; } = string.Empty;

        public Guid? OutboundSeatId { get; set; }
        public Guid? ReturnSeatId { get; set; }
    }
}

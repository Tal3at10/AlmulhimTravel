namespace Core.Application.Abstraction.DTOs.Reservations;

public class FlightBookingRequest
{
    public string Provider { get; set; } = string.Empty;
    public string FlightId { get; set; } = string.Empty;
    public int PassengersCount { get; set; }
    // Add other relevant properties
}

namespace Core.Application.Abstraction.DTOs.Amadeus;

/// <summary>
/// Complete flight offer with all details
/// </summary>
public record AmadeusFlightOfferDto(
    string Id,
    decimal Price,
    string Currency,
    int NumberOfBookableSeats,
    List<FlightItineraryDto> Itineraries
);

/// <summary>
/// Flight itinerary (outbound or return journey)
/// </summary>
public record FlightItineraryDto(
    string Duration,
    List<FlightSegmentDto> Segments
);

/// <summary>
/// Individual flight segment
/// </summary>
public record FlightSegmentDto(
    string CarrierCode,
    string CarrierName,
    string FlightNumber,
    string DepartureAirport,
    string DepartureTime,
    string? DepartureTerminal,
    string ArrivalAirport,
    string ArrivalTime,
    string? ArrivalTerminal,
    string Duration,
    string? Aircraft,
    int NumberOfStops
);

/// <summary>
/// Flight search request parameters
/// </summary>
public record FlightSearchRequest(
    string Origin,
    string Destination,
    string DepartureDate,
    string? ReturnDate = null,
    int Adults = 1,
    string TravelClass = "ECONOMY"
);

/// <summary>
/// Popular airports lookup
/// </summary>
public record AirportDto(
    string Code,
    string NameAr,
    string NameEn,
    string CityAr,
    string CityEn,
    string Country
);

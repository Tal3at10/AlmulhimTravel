using Core.Application.Abstraction.DTOs.Amadeus;

namespace Core.Application.Abstraction.Services;

public interface IDuffelService
{
    // Flights
    Task<List<AmadeusFlightOfferDto>> SearchFlightsAsync(FlightSearchRequest request, CancellationToken cancellationToken = default);
    Task<string> GetRawOfferAsync(string offerId, CancellationToken cancellationToken = default);
    Task<string> CreateClientKeyAsync(CancellationToken cancellationToken = default);


    // Booking / Orders
    Task<string> CreateFlightOrderAsync(Core.Application.Abstraction.DTOs.Reservations.CreateFlightBookingDto request, CancellationToken cancellationToken = default);
    Task<string> CreateStayOrderAsync(Core.Application.Abstraction.DTOs.Reservations.CreateHotelBookingDto request, CancellationToken cancellationToken = default);
}

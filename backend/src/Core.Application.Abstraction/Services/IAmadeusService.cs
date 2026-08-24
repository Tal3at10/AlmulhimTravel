using Core.Application.Abstraction.DTOs.Amadeus;

namespace Core.Application.Abstraction.Services;

/// <summary>
/// Amadeus API integration service for real-time hotel and flight data
/// </summary>
public interface IAmadeusService
{

    /// <summary>
    /// Search flights
    /// </summary>
    /// <param name="request">Search parameters</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of flight offers</returns>
    Task<List<AmadeusFlightOfferDto>> SearchFlightsAsync(FlightSearchRequest request, CancellationToken cancellationToken = default);
}

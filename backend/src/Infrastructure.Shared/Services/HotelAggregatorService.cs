using Core.Application.Abstraction.DTOs.Hotels;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Shared.Services;

public class HotelAggregatorService : IHotelAggregatorService
{
    private readonly IEnumerable<IHotelProvider> _providers;
    private readonly ILogger<HotelAggregatorService> _logger;

    public HotelAggregatorService(IEnumerable<IHotelProvider> providers, ILogger<HotelAggregatorService> logger)
    {
        _providers = providers;
        _logger = logger;
    }

    public async Task<List<HotelSearchResultDto>> SearchAsync(HotelSearchQuery query, CancellationToken ct = default)
    {
        var tasks = _providers.Select(p => p.SearchAsync(query, ct));
        var results = await Task.WhenAll(tasks);
        
        var allHotels = results.SelectMany(r => r).ToList();

        var uniqueHotels = new List<HotelSearchResultDto>();
        var unassignedHotels = new List<HotelSearchResultDto>(allHotels);

        while (unassignedHotels.Any())
        {
            var current = unassignedHotels.First();
            unassignedHotels.RemoveAt(0);

            var group = new List<HotelSearchResultDto> { current };

            // Find all matches for the current hotel
            for (int i = unassignedHotels.Count - 1; i >= 0; i--)
            {
                var candidate = unassignedHotels[i];
                bool isMatch = false;

                // Try to match by Geography if available (Distance < 0.5 KM)
                if (current.Latitude.HasValue && current.Longitude.HasValue &&
                    candidate.Latitude.HasValue && candidate.Longitude.HasValue)
                {
                    var distance = Core.Application.Abstraction.Utils.MatchingAlgorithms.CalculateHaversineDistance(
                        current.Latitude.Value, current.Longitude.Value,
                        candidate.Latitude.Value, candidate.Longitude.Value);
                        
                    if (distance < 0.5)
                    {
                        // Double check with name similarity > 70% to avoid matching different hotels in the same block
                        var similarity = Core.Application.Abstraction.Utils.MatchingAlgorithms.CalculateStringSimilarity(current.Name, candidate.Name);
                        if (similarity >= 0.70) isMatch = true;
                    }
                }
                else
                {
                    // Fallback to name similarity > 85%
                    var similarity = Core.Application.Abstraction.Utils.MatchingAlgorithms.CalculateStringSimilarity(current.Name, candidate.Name);
                    if (similarity >= 0.85) isMatch = true;
                }

                if (isMatch)
                {
                    group.Add(candidate);
                    unassignedHotels.RemoveAt(i);
                }
            }

            // Pick the cheapest one
            var bestOption = group.OrderBy(h => h.Price).First();
            uniqueHotels.Add(bestOption);
        }

        return uniqueHotels.OrderBy(h => h.Price).ToList();
    }

    public async Task<HotelDetailDto?> GetDetailsAsync(string hotelId, string providerName, HotelSearchQuery query, CancellationToken ct = default)
    {
        var provider = _providers.FirstOrDefault(p => p.ProviderName == providerName);
        if (provider == null) return null;

        return await provider.GetDetailsAsync(hotelId, query, ct);
    }

    public async Task<List<RoomTypeDto>> GetRoomsAsync(string hotelId, string providerName, HotelSearchQuery query, CancellationToken ct = default)
    {
        var provider = _providers.FirstOrDefault(p => p.ProviderName == providerName);
        if (provider == null) return new List<RoomTypeDto>();

        return await provider.GetRoomsAsync(hotelId, query, ct);
    }

    public async Task<BookingConfirmationDto?> CreateBookingAsync(BookingRequest request, CancellationToken ct = default)
    {
        var provider = _providers.FirstOrDefault(p => p.ProviderName == request.Provider);
        if (provider == null) throw new InvalidOperationException($"Provider {request.Provider} not found.");

        return await provider.CreateBookingAsync(request, ct);
    }
}

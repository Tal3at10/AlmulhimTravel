using Core.Application.Abstraction.DTOs.Aviation;
using Core.Application.Abstraction.DTOs.Reservations;
using Core.Application.Abstraction.Services.Aviation;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Shared.Services;

public class FlightAggregatorService : IFlightAggregatorService
{
    private readonly IEnumerable<IFlightProvider> _providers;
    private readonly ILogger<FlightAggregatorService> _logger;

    public FlightAggregatorService(IEnumerable<IFlightProvider> providers, ILogger<FlightAggregatorService> logger)
    {
        _providers = providers;
        _logger = logger;
    }

    public async Task<List<FlightCardDto>> SearchAsync(FlightSearchQuery query, CancellationToken ct = default)
    {
        var tasks = _providers.Select(p => p.SearchAsync(query, ct));
        var results = await Task.WhenAll(tasks);
        
        var allFlights = results.SelectMany(r => r).ToList();

        var uniqueFlights = new List<FlightCardDto>();
        var unassignedFlights = new List<FlightCardDto>(allFlights);

        while (unassignedFlights.Any())
        {
            var current = unassignedFlights.First();
            unassignedFlights.RemoveAt(0);

            var group = new List<FlightCardDto> { current };

            // Find exact matches for the current flight
            for (int i = unassignedFlights.Count - 1; i >= 0; i--)
            {
                var candidate = unassignedFlights[i];
                
                // Flights match if they have the same flight number and exact same departure/arrival times
                if (current.FlightNumber == candidate.FlightNumber &&
                    current.DepartureTime == candidate.DepartureTime &&
                    current.ArrivalTime == candidate.ArrivalTime)
                {
                    group.Add(candidate);
                    unassignedFlights.RemoveAt(i);
                }
            }

            // Pick the cheapest one (Economy Price for comparison)
            var bestOption = group.OrderBy(f => f.EconomyPrice).First();
            uniqueFlights.Add(bestOption);
        }

        return uniqueFlights.OrderBy(f => f.EconomyPrice).ToList();
    }

    public async Task<FlightDetailDto?> GetDetailsAsync(string flightId, string providerName, FlightSearchQuery query, CancellationToken ct = default)
    {
        var provider = _providers.FirstOrDefault(p => p.ProviderName == providerName);
        if (provider == null) return null;

        return await provider.GetDetailsAsync(flightId, query, ct);
    }

    public async Task<FlightBookingDto?> CreateBookingAsync(FlightBookingRequest request, CancellationToken ct = default)
    {
        var provider = _providers.FirstOrDefault(p => p.ProviderName == request.Provider);
        if (provider == null) throw new InvalidOperationException($"Provider {request.Provider} not found.");

        return await provider.CreateBookingAsync(request, ct);
    }
}

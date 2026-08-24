using Core.Application.Abstraction.DTOs.Aviation;
using Core.Application.Abstraction.DTOs.Reservations;
using Core.Application.Abstraction.Services.Aviation;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Shared.Services;

public class TboFlightService : IFlightProvider
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<TboFlightService> _logger;
    private readonly TboSettings _settings;

    public string ProviderName => "TBO";

    public TboFlightService(ILogger<TboFlightService> logger, IHttpClientFactory httpClientFactory, IOptions<TboSettings> settings)
    {
        _logger = logger;
        _settings = settings.Value;
        
        _httpClient = httpClientFactory.CreateClient("TboFlights");
        if (!string.IsNullOrEmpty(_settings.BaseUrl))
        {
            _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
        }
    }

    public Task<List<FlightCardDto>> SearchAsync(FlightSearchQuery query, CancellationToken ct = default)
    {
        _logger.LogInformation("TBO Flight SearchAsync called for Origin: {Origin}, Destination: {Destination}", query.DepartureAirportId, query.ArrivalAirportId);
        return Task.FromResult(new List<FlightCardDto>());
    }

    public Task<FlightDetailDto?> GetDetailsAsync(string flightId, FlightSearchQuery query, CancellationToken ct = default)
    {
        return Task.FromResult<FlightDetailDto?>(null);
    }

    public Task<FlightBookingDto?> CreateBookingAsync(FlightBookingRequest request, CancellationToken ct = default)
    {
        return Task.FromResult<FlightBookingDto?>(null);
    }
}

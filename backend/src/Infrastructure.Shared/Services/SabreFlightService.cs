using Core.Application.Abstraction.DTOs.Aviation;
using Core.Application.Abstraction.DTOs.Reservations;
using Core.Application.Abstraction.Services.Aviation;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Shared.Services;

public class SabreFlightService : IFlightProvider
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<SabreFlightService> _logger;
    private readonly SabreSettings _settings;

    public string ProviderName => "Sabre";

    public SabreFlightService(ILogger<SabreFlightService> logger, IHttpClientFactory httpClientFactory, IOptions<SabreSettings> settings)
    {
        _logger = logger;
        _settings = settings.Value;
        
        _httpClient = httpClientFactory.CreateClient("Sabre");
        if (!string.IsNullOrEmpty(_settings.BaseUrl))
        {
            _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
        }
    }

    public Task<List<FlightCardDto>> SearchAsync(FlightSearchQuery query, CancellationToken ct = default)
    {
        _logger.LogInformation("Sabre Flight SearchAsync called for Origin: {Origin}, Destination: {Destination}", query.DepartureAirportId, query.ArrivalAirportId);
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

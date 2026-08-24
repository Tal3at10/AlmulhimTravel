using System.Net.Http.Headers;
using System.Text.Json;
using Core.Application.Abstraction.DTOs.Amadeus;
using Core.Application.Abstraction.Services;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Shared.Services;

/// <summary>
/// Amadeus API integration service implementation
/// Provides real-time hotel and flight data from Amadeus GDS
/// </summary>
public class AmadeusService : IAmadeusService
{
    private readonly HttpClient _httpClient;
    private readonly AmadeusSettings _settings;
    private readonly ILogger<AmadeusService> _logger;
    private string? _accessToken;
    private DateTime _tokenExpiry = DateTime.MinValue;
    private readonly SemaphoreSlim _tokenLock = new(1, 1);

    public AmadeusService(
        IOptions<AmadeusSettings> settings,
        ILogger<AmadeusService> logger,
        IHttpClientFactory httpClientFactory)
    {
        _settings = settings.Value;
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient("Amadeus");
    }

    #region Authentication

    private async Task<string> GetAccessTokenAsync(CancellationToken cancellationToken = default)
    {
        // Check if current token is still valid
        if (!string.IsNullOrEmpty(_accessToken) && DateTime.UtcNow < _tokenExpiry)
        {
            return _accessToken;
        }

        await _tokenLock.WaitAsync(cancellationToken);
        try
        {
            // Double-check after acquiring lock
            if (!string.IsNullOrEmpty(_accessToken) && DateTime.UtcNow < _tokenExpiry)
            {
                return _accessToken;
            }

            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("client_id", _settings.ApiKey),
                new KeyValuePair<string, string>("client_secret", _settings.ApiSecret)
            });

            var response = await _httpClient.PostAsync(
                $"{_settings.BaseUrl}/v1/security/oauth2/token",
                content,
                cancellationToken);

            var json = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to get Amadeus token: {StatusCode} - {Response}", response.StatusCode, json);
                throw new InvalidOperationException("Failed to authenticate with Amadeus API");
            }

            using var doc = JsonDocument.Parse(json);
            _accessToken = doc.RootElement.GetProperty("access_token").GetString();
            var expiresIn = doc.RootElement.GetProperty("expires_in").GetInt32();
            _tokenExpiry = DateTime.UtcNow.AddSeconds(expiresIn - 60); // Refresh 1 minute early

            _logger.LogDebug("Amadeus token acquired, expires in {ExpiresIn} seconds", expiresIn);

            return _accessToken!;
        }
        finally
        {
            _tokenLock.Release();
        }
    }

    #endregion

#region Flights

    public async Task<List<AmadeusFlightOfferDto>> SearchFlightsAsync(
        FlightSearchRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var token = await GetAccessTokenAsync(cancellationToken);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var url = $"{_settings.BaseUrl}/v2/shopping/flight-offers" +
                      $"?originLocationCode={request.Origin}" +
                      $"&destinationLocationCode={request.Destination}" +
                      $"&departureDate={request.DepartureDate}" +
                      $"&adults={request.Adults}" +
                      $"&travelClass={request.TravelClass}" +
                      $"&currencyCode=SAR" +
                      $"&max=20";

            if (!string.IsNullOrEmpty(request.ReturnDate))
            {
                url += $"&returnDate={request.ReturnDate}";
            }

            var response = await _httpClient.GetAsync(url, cancellationToken);
            var json = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Flight search failed: {StatusCode}", response.StatusCode);
                return [];
            }

            using var doc = JsonDocument.Parse(json);
            var results = new List<AmadeusFlightOfferDto>();

            // Get carrier names dictionary
            var carriers = new Dictionary<string, string>();
            if (doc.RootElement.TryGetProperty("dictionaries", out var dictionaries) &&
                dictionaries.TryGetProperty("carriers", out var carrierDict))
            {
                foreach (var carrier in carrierDict.EnumerateObject())
                {
                    carriers[carrier.Name] = carrier.Value.GetString() ?? carrier.Name;
                }
            }

            if (doc.RootElement.TryGetProperty("data", out var data))
            {
                foreach (var offer in data.EnumerateArray())
                {
                    var price = offer.GetProperty("price");
                    var itineraries = offer.GetProperty("itineraries");

                    var flightItineraries = new List<FlightItineraryDto>();

                    foreach (var itinerary in itineraries.EnumerateArray())
                    {
                        var segments = itinerary.GetProperty("segments");
                        var flightSegments = new List<FlightSegmentDto>();

                        foreach (var segment in segments.EnumerateArray())
                        {
                            var departure = segment.GetProperty("departure");
                            var arrival = segment.GetProperty("arrival");
                            var carrierCode = segment.GetProperty("carrierCode").GetString() ?? "";

                            flightSegments.Add(new FlightSegmentDto(
                                CarrierCode: carrierCode,
                                CarrierName: carriers.TryGetValue(carrierCode, out var name) ? name : carrierCode,
                                FlightNumber: segment.GetProperty("number").GetString() ?? "",
                                DepartureAirport: departure.GetProperty("iataCode").GetString() ?? "",
                                DepartureTime: departure.GetProperty("at").GetString() ?? "",
                                DepartureTerminal: departure.TryGetProperty("terminal", out var depTerm) ? depTerm.GetString() : null,
                                ArrivalAirport: arrival.GetProperty("iataCode").GetString() ?? "",
                                ArrivalTime: arrival.GetProperty("at").GetString() ?? "",
                                ArrivalTerminal: arrival.TryGetProperty("terminal", out var arrTerm) ? arrTerm.GetString() : null,
                                Duration: segment.GetProperty("duration").GetString() ?? "",
                                Aircraft: segment.TryGetProperty("aircraft", out var aircraft) ? aircraft.GetProperty("code").GetString() : null,
                                NumberOfStops: segment.TryGetProperty("numberOfStops", out var stops) ? stops.GetInt32() : 0
                            ));
                        }

                        flightItineraries.Add(new FlightItineraryDto(
                            Duration: itinerary.GetProperty("duration").GetString() ?? "",
                            Segments: flightSegments
                        ));
                    }

                    results.Add(new AmadeusFlightOfferDto(
                        Id: offer.GetProperty("id").GetString() ?? "",
                        Price: decimal.Parse(price.GetProperty("grandTotal").GetString() ?? "0"),
                        Currency: price.GetProperty("currency").GetString() ?? "SAR",
                        NumberOfBookableSeats: offer.TryGetProperty("numberOfBookableSeats", out var seats) ? seats.GetInt32() : 0,
                        Itineraries: flightItineraries
                    ));
                }
            }

            _logger.LogInformation("Found {Count} flight offers from {Origin} to {Destination}",
                results.Count, request.Origin, request.Destination);

            return results.OrderBy(f => f.Price).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching flights from {Origin} to {Destination}",
                request.Origin, request.Destination);
            return [];
        }
    }

    #endregion
}


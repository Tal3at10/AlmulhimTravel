using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Core.Application.Abstraction.DTOs.Hotels;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Shared.Services;

public class RateHawkService : IHotelProvider
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<RateHawkService> _logger;
    private readonly string _apiKey;
    private readonly string _keyId;

    public string ProviderName => "RateHawk";

    public RateHawkService(ILogger<RateHawkService> logger, IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient("RateHawk");
        _httpClient.BaseAddress = new Uri("https://api.ratehawk.com/v3/");
        
        // Credentials will be loaded from appsettings.json
        _keyId = configuration["RateHawk:KeyId"] ?? string.Empty;
        _apiKey = configuration["RateHawk:ApiKey"] ?? string.Empty;

        if (!string.IsNullOrEmpty(_keyId) && !string.IsNullOrEmpty(_apiKey))
        {
            var authString = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_keyId}:{_apiKey}"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authString);
        }
    }

    public async Task<List<HotelSearchResultDto>> SearchAsync(HotelSearchQuery query, CancellationToken ct = default)
    {
        _logger.LogInformation("RateHawk SearchAsync called for City: {CityCode}", query.CityCode);

        if (string.IsNullOrEmpty(_apiKey))
        {
            _logger.LogWarning("RateHawk API Key is not configured. Returning empty list.");
            return new List<HotelSearchResultDto>();
        }

        try
        {
            // Note: In a real scenario, CityCode (IATA) needs to be mapped to a RateHawk Region ID.
            // For now, we simulate the structure of the V3 Search API.
            var requestBody = new
            {
                checkin = query.CheckInDate,
                checkout = query.CheckOutDate,
                residency = "sa", // Assuming Saudi Arabia
                language = "ar",
                guests = new[]
                {
                    new
                    {
                        adults = query.Adults,
                        children = Array.Empty<int>()
                    }
                },
                region_id = 9534, // Mock mapping for testing (e.g., Dubai)
                currency = query.Currency
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("search/serp/region/", content, ct);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError("RateHawk API Error: {Error}", error);
                return new List<HotelSearchResultDto>();
            }

            var jsonResponse = await response.Content.ReadAsStringAsync(ct);
            var results = new List<HotelSearchResultDto>();

            using var doc = JsonDocument.Parse(jsonResponse);
            if (doc.RootElement.TryGetProperty("data", out var dataElement) && 
                dataElement.TryGetProperty("hotels", out var hotelsElement) &&
                hotelsElement.ValueKind == JsonValueKind.Array)
            {
                foreach (var hotel in hotelsElement.EnumerateArray())
                {
                    if (!hotel.TryGetProperty("id", out var idElement)) continue;
                    
                    var hotelId = idElement.GetString() ?? string.Empty;
                    decimal minPrice = decimal.MaxValue;
                    string currency = query.Currency ?? "USD";

                    if (hotel.TryGetProperty("rates", out var ratesElement) && ratesElement.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var rate in ratesElement.EnumerateArray())
                        {
                            if (rate.TryGetProperty("payment_options", out var paymentOptions) &&
                                paymentOptions.TryGetProperty("payment_types", out var paymentTypes) &&
                                paymentTypes.ValueKind == JsonValueKind.Array)
                            {
                                foreach (var pt in paymentTypes.EnumerateArray())
                                {
                                    if (pt.TryGetProperty("amount", out var amountElement) && 
                                        decimal.TryParse(amountElement.GetString(), out var amount))
                                    {
                                        if (amount < minPrice) minPrice = amount;
                                        if (pt.TryGetProperty("currency_code", out var currElement))
                                            currency = currElement.GetString() ?? currency;
                                    }
                                }
                            }
                        }
                    }

                    if (minPrice < decimal.MaxValue)
                    {
                        results.Add(new HotelSearchResultDto(
                            hotelId,
                            $"RateHawk Hotel {hotelId}",
                            ProviderName,
                            0,
                            0m,
                            0,
                            "",
                            "",
                            "",
                            "",
                            new List<string>(),
                            minPrice,
                            minPrice,
                            0,
                            1,
                            query.Adults,
                            "",
                            new List<string>(),
                            new List<string>(),
                            currency,
                            null,
                            null
                        ));
                    }
                }
            }

            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to search RateHawk");
            return new List<HotelSearchResultDto>();
        }
    }

    public async Task<HotelDetailDto?> GetDetailsAsync(string hotelId, HotelSearchQuery query, CancellationToken ct = default)
    {
        if (string.IsNullOrEmpty(_apiKey)) return null;

        var requestBody = new { id = hotelId, language = "ar" };
        var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync("hotel/info/", content, ct);
        
        if (!response.IsSuccessStatusCode)
            return null;

        var jsonResponse = await response.Content.ReadAsStringAsync(ct);
        using var doc = JsonDocument.Parse(jsonResponse);
        
        if (doc.RootElement.TryGetProperty("data", out var dataElement))
        {
            var name = dataElement.TryGetProperty("name", out var n) ? n.GetString() : $"RateHawk Hotel {hotelId}";
            var desc = dataElement.TryGetProperty("description_struct", out var ds) && ds.ValueKind == JsonValueKind.Array && ds.GetArrayLength() > 0 
                ? ds[0].TryGetProperty("paragraphs", out var p) && p.ValueKind == JsonValueKind.Array && p.GetArrayLength() > 0 ? p[0].GetString() : "" 
                : "";
            
            var images = new List<string>();
            if (dataElement.TryGetProperty("images", out var imgs) && imgs.ValueKind == JsonValueKind.Array)
            {
                foreach (var img in imgs.EnumerateArray())
                {
                    var url = img.GetString();
                    if (!string.IsNullOrEmpty(url)) images.Add(url.Replace("{size}", "1024x768"));
                }
            }

            var address = dataElement.TryGetProperty("address", out var addr) ? addr.GetString() : "";

            return new HotelDetailDto(
                hotelId,
                name ?? string.Empty,
                ProviderName,
                dataElement.TryGetProperty("star_rating", out var sr) ? (int)sr.GetDouble() : 0,
                0m,
                0,
                "",
                "",
                address ?? string.Empty,
                desc ?? string.Empty,
                images,
                dataElement.TryGetProperty("latitude", out var lat) ? lat.GetDouble() : 0,
                dataElement.TryGetProperty("longitude", out var lon) ? lon.GetDouble() : 0,
                "",
                "",
                new List<string>(),
                new List<string>(),
                new List<RoomTypeDto>()
            );
        }
        
        return null;
    }

    public async Task<List<RoomTypeDto>> GetRoomsAsync(string hotelId, HotelSearchQuery query, CancellationToken ct = default)
    {
        return new List<RoomTypeDto>();
    }

    public async Task<BookingConfirmationDto?> CreateBookingAsync(BookingRequest request, CancellationToken ct = default)
    {
        return null;
    }

    public async Task<BookingStatusDto?> GetBookingStatusAsync(string bookingRef, CancellationToken ct = default)
    {
        return null;
    }

    public async Task<bool> CancelBookingAsync(string bookingRef, CancellationToken ct = default)
    {
        return false;
    }
}

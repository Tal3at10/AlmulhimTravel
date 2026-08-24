using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Core.Application.Abstraction.DTOs.Hotels;
using Core.Application.Abstraction.Services;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Shared.Services;

public class HotelbedsService : IHotelProvider
{
    private readonly HttpClient _httpClient;
    private readonly HotelbedsSettings _settings;
    private readonly ILogger<HotelbedsService> _logger;

    public string ProviderName => "Hotelbeds";

    public HotelbedsService(
        ILogger<HotelbedsService> logger, 
        IHttpClientFactory httpClientFactory, 
        IOptions<HotelbedsSettings> settings)
    {
        _logger = logger;
        _settings = settings.Value;
        
        _httpClient = httpClientFactory.CreateClient("Hotelbeds");
        _httpClient.BaseAddress = new Uri(_settings.BaseUrl.TrimEnd('/') + "/");
    }

    private string GenerateSignature()
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var dataToHash = _settings.ApiKey + _settings.ApiSecret + timestamp;

        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(dataToHash));
        return BitConverter.ToString(bytes).Replace("-", "").ToLower();
    }

    private async Task<HttpResponseMessage> SendRequestAsync(HttpMethod method, string url, HttpContent? content = null, CancellationToken ct = default)
    {
        var request = new HttpRequestMessage(method, url);
        request.Headers.Add("Api-key", _settings.ApiKey);
        request.Headers.Add("X-Signature", GenerateSignature());
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        if (content != null)
        {
            request.Content = content;
        }

        return await _httpClient.SendAsync(request, ct);
    }

    public async Task<List<HotelSearchResultDto>> SearchAsync(HotelSearchQuery query, CancellationToken ct = default)
    {
        _logger.LogInformation("Hotelbeds SearchAsync called for City: {CityCode}", query.CityCode);

        if (string.IsNullOrEmpty(_settings.ApiKey) || string.IsNullOrEmpty(_settings.ApiSecret))
        {
            _logger.LogWarning("Hotelbeds API Keys are not configured. Returning empty list.");
            return new List<HotelSearchResultDto>();
        }

        try
        {
            var destinationCode = HotelbedsDestinationMapper.GetDestinationCode(query.CityCode);

            var requestBody = new
            {
                stay = new
                {
                    checkIn = query.CheckInDate,
                    checkOut = query.CheckOutDate
                },
                occupancies = new[]
                {
                    new
                    {
                        rooms = query.Rooms,
                        adults = query.Adults,
                        children = 0
                    }
                },
                destination = new
                {
                    code = destinationCode
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await SendRequestAsync(HttpMethod.Post, "hotels", content, ct);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError("Hotelbeds API Error: {StatusCode} - {Error}", response.StatusCode, error);
                
                return new List<HotelSearchResultDto>();
            }

            var jsonResponse = await response.Content.ReadAsStringAsync(ct);
            using var doc = JsonDocument.Parse(jsonResponse);

            var results = new List<HotelSearchResultDto>();
            
            if (doc.RootElement.TryGetProperty("hotels", out var hotelsProp) && 
                hotelsProp.TryGetProperty("hotels", out var hotelsArray))
            {
                foreach (var hotel in hotelsArray.EnumerateArray())
                {
                    var hotelCode = hotel.GetProperty("code").GetInt32().ToString();
                    var hotelName = hotel.GetProperty("name").GetString() ?? "Unknown Hotel";
                    
                    // Parse stars
                    var categoryName = hotel.GetProperty("categoryName").GetString() ?? "";
                    int stars = 3; // default
                    if (categoryName.Contains("5")) stars = 5;
                    else if (categoryName.Contains("4")) stars = 4;
                    else if (categoryName.Contains("3")) stars = 3;
                    else if (categoryName.Contains("2")) stars = 2;
                    else if (categoryName.Contains("1")) stars = 1;

                    var minRateStr = hotel.GetProperty("minRate").GetString() ?? "0";
                    decimal.TryParse(minRateStr, out var price);

                    var currency = hotel.TryGetProperty("currency", out var currProp) ? currProp.GetString() : "EUR";
                    var lat = hotel.TryGetProperty("latitude", out var latProp) ? latProp.GetString() : "";
                    var lng = hotel.TryGetProperty("longitude", out var lngProp) ? lngProp.GetString() : "";

                    string roomTypeName = "Standard Room";
                    if (hotel.TryGetProperty("rooms", out var roomsArray) && roomsArray.GetArrayLength() > 0)
                    {
                        roomTypeName = roomsArray[0].GetProperty("name").GetString() ?? roomTypeName;
                    }

                    double.TryParse(lat, out var dLat);
                    double.TryParse(lng, out var dLng);

                    results.Add(new HotelSearchResultDto(
                        HotelId: hotelCode,
                        Name: hotelName,
                        Provider: ProviderName,
                        Stars: stars,
                        Rating: stars * 2.0m, // Mock rating based on stars
                        ReviewCount: new Random().Next(50, 500),
                        RatingText: stars >= 4 ? "Very Good" : "Good",
                        Location: hotel.TryGetProperty("destinationName", out var destProp) ? destProp.GetString() ?? query.CityCode : query.CityCode,
                        Distance: "City Center",
                        MainImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Placeholder until Content API
                        Images: new List<string> { "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                        Price: price,
                        OriginalPrice: price * 1.2m, // Mock 20% discount
                        DiscountPercentage: 20,
                        Nights: (int)(DateTime.Parse(query.CheckOutDate) - DateTime.Parse(query.CheckInDate)).TotalDays,
                        Guests: query.Adults,
                        RoomType: roomTypeName,
                        Badges: new List<string>(),
                        Features: new List<string> { "Free WiFi", "Air Conditioning", "Private Bathroom" },
                        Currency: currency ?? "EUR",
                        Latitude: dLat,
                        Longitude: dLng
                    ));
                }
            }
            if (results.Any())
            {
                try
                {
                    var codes = results.Select(r => r.HotelId).Take(50).ToList();
                    var contentUrl = $"{_settings.BaseUrl.Replace("hotel-api", "hotel-content-api")}/hotels?codes={string.Join(",", codes)}&fields=images&language=ENG";
                    using var contentRequest = new HttpRequestMessage(HttpMethod.Get, contentUrl);
                    var ts = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
                    var sigToHash = _settings.ApiKey + _settings.ApiSecret + ts;
                    var hashBytes = System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(sigToHash));
                    var signature = Convert.ToHexString(hashBytes).ToLower();

                    contentRequest.Headers.Add("Api-key", _settings.ApiKey);
                    contentRequest.Headers.Add("X-Signature", signature);
                    contentRequest.Headers.Add("Accept", "application/json");

                    var contentResponse = await _httpClient.SendAsync(contentRequest, ct);
                    if (contentResponse.IsSuccessStatusCode)
                    {
                        var contentJsonString = await contentResponse.Content.ReadAsStringAsync(ct);
                        var contentDoc = JsonDocument.Parse(contentJsonString);
                        if (contentDoc.RootElement.TryGetProperty("hotels", out var contentHotelsArray))
                        {
                            var imagesDict = new Dictionary<string, List<string>>();
                            foreach (var ch in contentHotelsArray.EnumerateArray())
                            {
                                var code = ch.GetProperty("code").GetInt32().ToString();
                                if (ch.TryGetProperty("images", out var imagesArray) && imagesArray.GetArrayLength() > 0)
                                {
                                    var imgList = new List<string>();
                                    foreach (var img in imagesArray.EnumerateArray().Take(5))
                                    {
                                        var path = img.GetProperty("path").GetString();
                                        imgList.Add($"https://photos.hotelbeds.com/giata/{path}");
                                    }
                                    imagesDict[code] = imgList;
                                }
                            }
                            
                            for (int i = 0; i < results.Count; i++)
                            {
                                if (imagesDict.TryGetValue(results[i].HotelId, out var imgList) && imgList.Any())
                                {
                                    results[i] = results[i] with { MainImage = imgList[0], Images = imgList };
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to fetch images from Content API");
                }
            }

            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to search Hotelbeds");
            return new List<HotelSearchResultDto>();
        }
    }

    public async Task<HotelDetailDto?> GetDetailsAsync(string hotelId, HotelSearchQuery query, CancellationToken ct = default)
    {
        // For simplicity, we search the specific hotel via Availability to get pricing
        // In a real scenario we'd call the Content API for detailed descriptions and images.
        var searchResult = await SearchAsync(new HotelSearchQuery
        {
            CityCode = query.CityCode,
            CheckInDate = query.CheckInDate,
            CheckOutDate = query.CheckOutDate,
            Adults = query.Adults,
            Rooms = query.Rooms
            // Ideally we'd pass hotelId directly to the search request, but we simulate it here by searching the city and filtering.
            // But we can construct a direct Hotelbeds request for this hotelId.
        }, ct);

        // Since Hotelbeds SearchAsync supports searching by hotel code, let's just create a new request for this specific hotel.
        try
        {
            var requestBody = new
            {
                stay = new { checkIn = query.CheckInDate, checkOut = query.CheckOutDate },
                occupancies = new[] { new { rooms = query.Rooms, adults = query.Adults, children = 0 } },
                hotels = new { hotel = new[] { int.Parse(hotelId) } }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await SendRequestAsync(HttpMethod.Post, "hotels", content, ct);

            if (!response.IsSuccessStatusCode) return null;

            var jsonResponse = await response.Content.ReadAsStringAsync(ct);
            using var doc = JsonDocument.Parse(jsonResponse);

            if (!doc.RootElement.TryGetProperty("hotels", out var hotelsProp) || !hotelsProp.TryGetProperty("hotels", out var hotelsArray) || hotelsArray.GetArrayLength() == 0)
                return null;

            var hotel = hotelsArray[0];
            var hotelName = hotel.GetProperty("name").GetString() ?? "Unknown";
            var categoryName = hotel.GetProperty("categoryName").GetString() ?? "";
            int stars = categoryName.Contains("5") ? 5 : categoryName.Contains("4") ? 4 : 3;

            var rooms = new List<RoomTypeDto>();
            if (hotel.TryGetProperty("rooms", out var roomsArray))
            {
                foreach (var room in roomsArray.EnumerateArray())
                {
                    var ratePlans = new List<RatePlanDto>();
                    if (room.TryGetProperty("rates", out var ratesArray))
                    {
                        foreach (var rate in ratesArray.EnumerateArray())
                        {
                            var rateKey = rate.GetProperty("rateKey").GetString() ?? "";
                            var netStr = rate.GetProperty("net").GetString() ?? "0";
                            decimal.TryParse(netStr, out var price);
                            var boardName = rate.GetProperty("boardName").GetString() ?? "Room Only";

                            ratePlans.Add(new RatePlanDto(
                                RateId: rateKey,
                                Name: boardName,
                                BoardType: boardName,
                                Price: price,
                                OriginalPrice: price * 1.1m,
                                DiscountPercentage: 10,
                                IsRefundable: rate.GetProperty("rateClass").GetString() == "NOR",
                                CancellationPolicy: "Check hotel policy.",
                                AvailableRooms: rate.TryGetProperty("allotment", out var allotment) ? allotment.GetInt32() : 1
                            ));
                        }
                    }

                    rooms.Add(new RoomTypeDto(
                        RoomId: room.GetProperty("code").GetString() ?? Guid.NewGuid().ToString(),
                        Name: room.GetProperty("name").GetString() ?? "Standard Room",
                        Images: new List<string> { "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                        MaxGuests: query.Adults,
                        BedType: "Standard Bed",
                        Size: "25 sqm",
                        Amenities: new List<string> { "Air Conditioning", "WiFi", "TV" },
                        RatePlans: ratePlans
                    ));
                }
            }

            var lat = hotel.TryGetProperty("latitude", out var latProp) ? latProp.GetString() : "";
            var lng = hotel.TryGetProperty("longitude", out var lngProp) ? lngProp.GetString() : "";
            double.TryParse(lat, out var dLat);
            double.TryParse(lng, out var dLng);

            var hotelImages = new List<string> { 
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            };

            try
            {
                var contentUrl = $"{_settings.BaseUrl.Replace("hotel-api", "hotel-content-api")}/hotels?codes={hotelId}&fields=images&language=ENG";
                using var contentRequest = new HttpRequestMessage(HttpMethod.Get, contentUrl);
                var ts = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
                var sigToHash = _settings.ApiKey + _settings.ApiSecret + ts;
                var hashBytes = System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(sigToHash));
                var signature = Convert.ToHexString(hashBytes).ToLower();

                contentRequest.Headers.Add("Api-key", _settings.ApiKey);
                contentRequest.Headers.Add("X-Signature", signature);
                contentRequest.Headers.Add("Accept", "application/json");

                var contentResponse = await _httpClient.SendAsync(contentRequest, ct);
                if (contentResponse.IsSuccessStatusCode)
                {
                    var contentJsonString = await contentResponse.Content.ReadAsStringAsync(ct);
                    var contentDoc = JsonDocument.Parse(contentJsonString);
                    if (contentDoc.RootElement.TryGetProperty("hotels", out var contentHotelsArray) && contentHotelsArray.GetArrayLength() > 0)
                    {
                        var ch = contentHotelsArray[0];
                        if (ch.TryGetProperty("images", out var imagesArray) && imagesArray.GetArrayLength() > 0)
                        {
                            hotelImages.Clear();
                            foreach (var img in imagesArray.EnumerateArray().Take(10))
                            {
                                var path = img.GetProperty("path").GetString();
                                hotelImages.Add($"https://photos.hotelbeds.com/giata/{path}");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to fetch images from Content API for details");
            }

            return new HotelDetailDto(
                HotelId: hotelId,
                Name: hotelName,
                Provider: ProviderName,
                Stars: stars,
                Rating: stars * 2.0m,
                ReviewCount: new Random().Next(50, 500),
                RatingText: stars >= 4 ? "Very Good" : "Good",
                Location: hotel.TryGetProperty("destinationName", out var dest) ? dest.GetString() ?? "" : "",
                Address: hotel.TryGetProperty("destinationName", out var dest2) ? dest2.GetString() ?? "" : "",
                Description: "Enjoy your stay at " + hotelName + ". We provide excellent service and comfortable rooms.",
                Images: hotelImages,
                Latitude: dLat,
                Longitude: dLng,
                CheckInTime: "14:00",
                CheckOutTime: "12:00",
                Amenities: new List<string> { "Free WiFi", "Pool", "Restaurant", "Air Conditioning", "24-hour front desk" },
                Highlights: new List<string> { "Great Location", "Excellent Breakfast" },
                Rooms: rooms
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get details from Hotelbeds");
            return null;
        }
    }

    public async Task<List<RoomTypeDto>> GetRoomsAsync(string hotelId, HotelSearchQuery query, CancellationToken ct = default)
    {
        var details = await GetDetailsAsync(hotelId, query, ct);
        return details?.Rooms ?? new List<RoomTypeDto>();
    }

    public async Task<BookingConfirmationDto?> CreateBookingAsync(BookingRequest request, CancellationToken ct = default)
    {
        try
        {
            var requestBody = new
            {
                holder = new
                {
                    name = request.PrimaryGuest?.FirstName ?? "Guest",
                    surname = request.PrimaryGuest?.LastName ?? "Name"
                },
                rooms = new[]
                {
                    new
                    {
                        rateKey = request.RateId,
                        paxes = new[]
                        {
                            new
                            {
                                roomId = 1,
                                type = "AD",
                                name = request.PrimaryGuest?.FirstName ?? "Guest",
                                surname = request.PrimaryGuest?.LastName ?? "Name"
                            }
                        }
                    }
                },
                clientReference = Guid.NewGuid().ToString("N").Substring(0, 10),
                remark = request.SpecialRequests
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await SendRequestAsync(HttpMethod.Post, "bookings", content, ct);

            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError("Hotelbeds Booking Error: {Error}", err);
                return null;
            }

            var jsonResponse = await response.Content.ReadAsStringAsync(ct);
            using var doc = JsonDocument.Parse(jsonResponse);
            
            var booking = doc.RootElement.GetProperty("booking");
            var reference = booking.GetProperty("reference").GetString() ?? "";
            var status = booking.GetProperty("status").GetString() ?? "CONFIRMED";
            var totalNetStr = booking.GetProperty("totalNet").GetString() ?? "0";
            decimal.TryParse(totalNetStr, out var totalNet);
            var currency = booking.GetProperty("currency").GetString() ?? "EUR";

            return new BookingConfirmationDto(
                BookingReference: Guid.NewGuid().ToString(),
                ProviderReference: reference,
                Status: status,
                TotalPrice: totalNet,
                Currency: currency
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create Hotelbeds booking");
            return null;
        }
    }

    public Task<BookingStatusDto?> GetBookingStatusAsync(string bookingRef, CancellationToken ct = default)
    {
        return Task.FromResult<BookingStatusDto?>(new BookingStatusDto(
            BookingReference: bookingRef,
            Status: "CONFIRMED",
            ProviderMessage: "Mock Confirmed"
        ));
    }

    public Task<bool> CancelBookingAsync(string bookingRef, CancellationToken ct = default)
    {
        return Task.FromResult(true);
    }
}

using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Core.Application.Abstraction.DTOs.Hotels;
using Core.Application.Abstraction.Services;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Shared.Services;

public class DuffelStaysService : IHotelProvider
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<DuffelStaysService> _logger;
    private readonly DuffelSettings _settings;

    public string ProviderName => "DuffelStays";

    public DuffelStaysService(
        IHttpClientFactory httpClientFactory,
        ILogger<DuffelStaysService> logger,
        IOptions<DuffelSettings> settings)
    {
        _logger = logger;
        _settings = settings.Value;

        _httpClient = httpClientFactory.CreateClient("DuffelStays");
        _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ApiKey);
        _httpClient.DefaultRequestHeaders.Add("Duffel-Version", "v2");
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<List<HotelSearchResultDto>> SearchAsync(HotelSearchQuery query, CancellationToken ct = default)
    {
        _logger.LogInformation("Searching Duffel Stays for {CityCode} from {CheckIn} to {CheckOut}", 
            query.CityCode, query.CheckInDate, query.CheckOutDate);

        var coords = CityCoordinatesMapper.GetCoordinates(query.CityCode);
        
        // Note: In test mode (with a duffel_test_ token), only coordinates (-24.38, -128.32) return test hotels.
        // We will override this if we are using a test token.
        if (_settings.ApiKey.StartsWith("duffel_test_"))
        {
            coords = (-24.38, -128.32);
        }

        var guests = new List<object>();
        for (int i = 0; i < query.Adults; i++)
        {
            guests.Add(new { type = "adult" });
        }

        var requestBody = new
        {
            data = new
            {
                rooms = query.Rooms,
                guests = guests,
                check_in_date = query.CheckInDate,
                check_out_date = query.CheckOutDate,
                location = new
                {
                    radius = query.Radius,
                    geographic_coordinates = new
                    {
                        latitude = coords.Latitude,
                        longitude = coords.Longitude
                    }
                }
            }
        };

        try
        {
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("/stays/search", content, ct);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync(ct);
                _logger.LogWarning("Duffel Stays search failed: {StatusCode} {Body}", response.StatusCode, errorBody);
                return new List<HotelSearchResultDto>();
            }

            var responseBody = await response.Content.ReadAsStringAsync(ct);
            using var doc = JsonDocument.Parse(responseBody);
            
            var results = new List<HotelSearchResultDto>();
            
            if (doc.RootElement.TryGetProperty("data", out var dataElement) && 
                dataElement.TryGetProperty("results", out var resultsElement) &&
                resultsElement.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in resultsElement.EnumerateArray())
                {
                    if (!item.TryGetProperty("accommodation", out var acc) ||
                        !item.TryGetProperty("cheapest_rate_total_amount", out var amountElement) ||
                        !item.TryGetProperty("cheapest_rate_currency", out var currencyElement))
                    {
                        continue;
                    }

                    var hotelId = acc.GetProperty("id").GetString() ?? "";
                    var name = acc.GetProperty("name").GetString() ?? "Unknown Accommodation";
                    var ratingElement = acc.TryGetProperty("rating", out var rat) ? rat.GetDouble() : 0;
                    var amount = amountElement.GetString();
                    decimal.TryParse(amount, out decimal price);
                    var currency = currencyElement.GetString() ?? "SAR";
                    
                    var lat = acc.TryGetProperty("location", out var loc) && loc.TryGetProperty("geographic_coordinates", out var gc) && gc.TryGetProperty("latitude", out var l) ? l.GetDouble() : 0;
                    var lng = acc.TryGetProperty("location", out var loc2) && loc2.TryGetProperty("geographic_coordinates", out var gc2) && gc2.TryGetProperty("longitude", out var lg) ? lg.GetDouble() : 0;

                    var photos = new List<string>();
                    if (acc.TryGetProperty("photos", out var photosArray) && photosArray.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var photo in photosArray.EnumerateArray())
                        {
                            if (photo.TryGetProperty("url", out var urlElement))
                            {
                                photos.Add(urlElement.GetString()!);
                            }
                        }
                    }
                    
                    var mainImage = photos.FirstOrDefault() ?? "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";

                    // Note: search_result_id is needed for details/rooms later, so we pack it in the HotelId for convenience
                    var searchResultId = item.GetProperty("id").GetString() ?? "";
                    var combinedId = $"{hotelId}::{searchResultId}";

                    results.Add(new HotelSearchResultDto(
                        HotelId: combinedId,
                        Name: name,
                        Provider: ProviderName,
                        Stars: (int)Math.Max(1, Math.Min(5, Math.Round(ratingElement))),
                        Rating: (decimal)ratingElement,
                        ReviewCount: new Random().Next(10, 500),
                        RatingText: "Very Good",
                        Location: "City Center",
                        Distance: "2 km from center",
                        MainImage: mainImage,
                        Images: photos,
                        Price: price,
                        OriginalPrice: price * 1.15m,
                        DiscountPercentage: 15,
                        Nights: (int)((DateTime.Parse(query.CheckOutDate) - DateTime.Parse(query.CheckInDate)).TotalDays),
                        Guests: query.Adults,
                        RoomType: "Standard Room",
                        Badges: new List<string>(),
                        Features: new List<string> { "Free WiFi", "Air Conditioning" },
                        Currency: currency,
                        Latitude: lat,
                        Longitude: lng
                    ));
                }
            }

            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching Duffel Stays");
            return new List<HotelSearchResultDto>();
        }
    }



    public async Task<HotelDetailDto?> GetDetailsAsync(string combinedId, HotelSearchQuery query, CancellationToken ct = default)
    {
        var parts = combinedId.Split("::");
        var hotelId = parts[0];
        var searchResultId = parts.Length > 1 ? parts[1] : "";

        if (string.IsNullOrEmpty(searchResultId))
        {
            return null;
        }

        try
        {
            // First get accommodation details
            var accResponse = await _httpClient.GetAsync($"/stays/accommodations/{hotelId}", ct);
            JsonElement accData = default;
            
            if (accResponse.IsSuccessStatusCode)
            {
                var accBody = await accResponse.Content.ReadAsStringAsync(ct);
                using var accDoc = JsonDocument.Parse(accBody);
                if (accDoc.RootElement.TryGetProperty("data", out var data))
                {
                    accData = data.Clone();
                }
            }

            // Then get rates/rooms
            var content = new StringContent("{}", Encoding.UTF8, "application/json");
            var ratesResponse = await _httpClient.PostAsync($"/stays/search_results/{searchResultId}/actions/fetch_all_rates", content, ct);
            
            if (!ratesResponse.IsSuccessStatusCode)
            {
                var errorBody = await ratesResponse.Content.ReadAsStringAsync(ct);
                _logger.LogWarning("Duffel fetch_all_rates failed: {StatusCode} {Body}", ratesResponse.StatusCode, errorBody);
                return null;
            }

            var ratesBody = await ratesResponse.Content.ReadAsStringAsync(ct);
            using var ratesDoc = JsonDocument.Parse(ratesBody);
            
            var rooms = new List<RoomTypeDto>();
            
            if (ratesDoc.RootElement.TryGetProperty("data", out var ratesDataElement) && 
                ratesDataElement.TryGetProperty("rooms", out var roomsArray) &&
                roomsArray.ValueKind == JsonValueKind.Array)
            {
                foreach (var roomElement in roomsArray.EnumerateArray())
                {
                    var roomName = roomElement.GetProperty("name").GetString() ?? "Room";
                    var ratePlans = new List<RatePlanDto>();
                    
                    if (roomElement.TryGetProperty("rates", out var ratesList) && ratesList.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var rateElement in ratesList.EnumerateArray())
                        {
                            var rateId = rateElement.GetProperty("id").GetString() ?? "";
                            var amount = rateElement.GetProperty("total_amount").GetString();
                            decimal.TryParse(amount, out decimal price);
                            
                            var boardType = rateElement.TryGetProperty("board_type", out var bt) ? bt.GetString() : "room_only";
                            
                            // Determine refundability
                            var isRefundable = false;
                            if (rateElement.TryGetProperty("cancellation_timeline", out var ctArray) && ctArray.ValueKind == JsonValueKind.Array)
                            {
                                foreach (var item in ctArray.EnumerateArray())
                                {
                                    if (item.TryGetProperty("refund_amount", out var refundAmt))
                                    {
                                        if (decimal.TryParse(refundAmt.GetString(), out var refVal) && refVal > 0)
                                        {
                                            isRefundable = true;
                                            break;
                                        }
                                    }
                                }
                            }

                            ratePlans.Add(new RatePlanDto(
                                RateId: rateId,
                                Name: boardType ?? "Room Only",
                                BoardType: boardType ?? "Room Only",
                                Price: price,
                                OriginalPrice: price * 1.1m,
                                DiscountPercentage: 10,
                                IsRefundable: isRefundable,
                                CancellationPolicy: isRefundable ? "Refundable" : "Non-refundable",
                                AvailableRooms: 1
                            ));
                        }
                    }

                    var roomPhotos = new List<string>();
                    if (roomElement.TryGetProperty("photos", out var rPhotos) && rPhotos.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var rp in rPhotos.EnumerateArray())
                        {
                            if (rp.TryGetProperty("url", out var urlElement))
                            {
                                roomPhotos.Add(urlElement.GetString()!);
                            }
                        }
                    }

                    rooms.Add(new RoomTypeDto(
                        RoomId: roomName,
                        Name: roomName,
                        Images: roomPhotos,
                        MaxGuests: query.Adults,
                        BedType: "Standard",
                        Size: "Standard",
                        Amenities: new List<string> { "WiFi", "TV" },
                        RatePlans: ratePlans
                    ));
                }
            }

            var name = "Unknown Hotel";
            var address = "";
            var description = "";
            var lat = 0.0;
            var lng = 0.0;
            var stars = 3;
            var rating = 3.0m;
            var hotelPhotos = new List<string> { "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" };
            
            if (accData.ValueKind != JsonValueKind.Undefined)
            {
                name = accData.GetProperty("name").GetString() ?? name;
                
                if (accData.TryGetProperty("location", out var loc))
                {
                    address = loc.TryGetProperty("address", out var a) && a.TryGetProperty("line_one", out var line1) ? line1.GetString() ?? "" : "";
                    lat = loc.TryGetProperty("geographic_coordinates", out var gc) && gc.TryGetProperty("latitude", out var l) ? l.GetDouble() : lat;
                    lng = loc.TryGetProperty("geographic_coordinates", out var gc2) && gc2.TryGetProperty("longitude", out var lg) ? lg.GetDouble() : lng;
                }

                if (accData.TryGetProperty("rating", out var ratElement))
                {
                    rating = (decimal)ratElement.GetDouble();
                    stars = (int)Math.Max(1, Math.Min(5, Math.Round(rating)));
                }

                if (accData.TryGetProperty("photos", out var phs) && phs.ValueKind == JsonValueKind.Array)
                {
                    hotelPhotos.Clear();
                    foreach (var p in phs.EnumerateArray())
                    {
                        if (p.TryGetProperty("url", out var u)) hotelPhotos.Add(u.GetString()!);
                    }
                }
            }

            return new HotelDetailDto(
                HotelId: combinedId,
                Name: name,
                Provider: ProviderName,
                Stars: stars,
                Rating: rating,
                ReviewCount: new Random().Next(10, 500),
                RatingText: "Very Good",
                Location: "City Center",
                Address: address,
                Description: description,
                Images: hotelPhotos,
                Latitude: lat,
                Longitude: lng,
                CheckInTime: "14:00",
                CheckOutTime: "12:00",
                Amenities: new List<string> { "WiFi", "Pool" },
                Highlights: new List<string> { "Great location" },
                Rooms: rooms
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting Duffel Stays details");
            return null;
        }
    }

    public async Task<List<RoomTypeDto>> GetRoomsAsync(string combinedId, HotelSearchQuery query, CancellationToken ct = default)
    {
        var details = await GetDetailsAsync(combinedId, query, ct);
        return details?.Rooms ?? new List<RoomTypeDto>();
    }

    public async Task<BookingConfirmationDto?> CreateBookingAsync(BookingRequest request, CancellationToken ct = default)
    {
        try
        {
            // Step 1: Create Quote
            var quoteReq = new { data = new { rate_id = request.RateId } };
            var quoteContent = new StringContent(JsonSerializer.Serialize(quoteReq), Encoding.UTF8, "application/json");
            var quoteResponse = await _httpClient.PostAsync("/stays/quotes", quoteContent, ct);
            
            if (!quoteResponse.IsSuccessStatusCode)
            {
                _logger.LogWarning("Duffel quote failed: {StatusCode}", quoteResponse.StatusCode);
                return null;
            }
            
            var quoteBody = await quoteResponse.Content.ReadAsStringAsync(ct);
            using var quoteDoc = JsonDocument.Parse(quoteBody);
            var quoteId = quoteDoc.RootElement.GetProperty("data").GetProperty("id").GetString();
            var totalAmountStr = quoteDoc.RootElement.GetProperty("data").GetProperty("total_amount").GetString();
            var currency = quoteDoc.RootElement.GetProperty("data").GetProperty("base_currency").GetString();
            decimal.TryParse(totalAmountStr, out decimal totalAmount);

            // Step 2: Book
            var guests = new List<object>
            {
                new { 
                    given_name = request.PrimaryGuest.FirstName, 
                    family_name = request.PrimaryGuest.LastName,
                    born_on = "1980-01-01" // Required by Duffel, placeholder if not available
                }
            };

            foreach (var g in request.AdditionalGuests)
            {
                guests.Add(new { 
                    given_name = g.FirstName, 
                    family_name = g.LastName,
                    born_on = "1980-01-01"
                });
            }

            var bookReq = new
            {
                data = new
                {
                    quote_id = quoteId,
                    email = request.PrimaryGuest.Email,
                    phone_number = "+442080160509", // E.164 format requirement
                    guests = guests,
                    accommodation_special_requests = request.SpecialRequests ?? ""
                }
            };

            var bookContent = new StringContent(JsonSerializer.Serialize(bookReq), Encoding.UTF8, "application/json");
            var bookResponse = await _httpClient.PostAsync("/stays/bookings", bookContent, ct);

            if (!bookResponse.IsSuccessStatusCode)
            {
                var errBody = await bookResponse.Content.ReadAsStringAsync(ct);
                _logger.LogWarning("Duffel book failed: {StatusCode} {Body}", bookResponse.StatusCode, errBody);
                return null;
            }

            var bookBody = await bookResponse.Content.ReadAsStringAsync(ct);
            using var bookDoc = JsonDocument.Parse(bookBody);
            var bookingId = bookDoc.RootElement.GetProperty("data").GetProperty("id").GetString() ?? Guid.NewGuid().ToString();
            var status = bookDoc.RootElement.GetProperty("data").GetProperty("status").GetString() ?? "confirmed";

            return new BookingConfirmationDto(
                BookingReference: bookingId,
                ProviderReference: bookingId,
                Status: status.Equals("confirmed", StringComparison.OrdinalIgnoreCase) ? "CONFIRMED" : "PENDING",
                TotalPrice: totalAmount,
                Currency: currency ?? "SAR"
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Duffel Stays booking");
            return null;
        }
    }

    public async Task<BookingStatusDto?> GetBookingStatusAsync(string bookingRef, CancellationToken ct = default)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/stays/bookings/{bookingRef}", ct);
            if (response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(ct);
                using var doc = JsonDocument.Parse(body);
                var status = doc.RootElement.GetProperty("data").GetProperty("status").GetString();
                return new BookingStatusDto(bookingRef, status.Equals("confirmed", StringComparison.OrdinalIgnoreCase) ? "CONFIRMED" : "PENDING", "Checked with Duffel");
            }
            return null;
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> CancelBookingAsync(string bookingRef, CancellationToken ct = default)
    {
        try
        {
            var content = new StringContent("{}", Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"/stays/bookings/{bookingRef}/actions/cancel", content, ct);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}

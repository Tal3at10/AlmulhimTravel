using System.Net.Http.Headers;
using System.Text.Json;
using Core.Application.Abstraction.DTOs.RapidApi;
using Core.Application.Abstraction.Services;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Shared.Services;

/// <summary>
/// RapidAPI integration service for Booking.com and Tripadvisor
/// </summary>
public partial class RapidApiHotelService
{

    /// <summary>
    /// Search hotels from Hotels.com via RapidAPI
    /// </summary>
    public async Task<List<NormalizedHotelDto>> SearchHotelsComAsync(
        string destination,
        string checkIn,
        string checkOut,
        int adults = 2,
        int rooms = 1,
        CancellationToken cancellationToken = default)
    {
        var results = new List<NormalizedHotelDto>();

        try
        {
            // First, search for the destination to get region_id (gaiaId)
            var searchUrl = $"https://{_settings.HotelsComHost}/v2/regions?query={Uri.EscapeDataString(destination)}&domain=US&locale=en_US";
            
            var searchRequest = new HttpRequestMessage(HttpMethod.Get, searchUrl);
            searchRequest.Headers.Add("x-rapidapi-host", _settings.HotelsComHost);
            searchRequest.Headers.Add("x-rapidapi-key", _settings.ApiKey);

            var searchResponse = await _httpClient.SendAsync(searchRequest, cancellationToken);
            var searchJson = await searchResponse.Content.ReadAsStringAsync(cancellationToken);

            if (!searchResponse.IsSuccessStatusCode)
            {
                _logger.LogWarning("Hotels.com region search failed: {StatusCode}", searchResponse.StatusCode);
                return results;
            }

            using var searchDoc = JsonDocument.Parse(searchJson);
            var searchRoot = searchDoc.RootElement;

            string? regionId = null;
            if (searchRoot.TryGetProperty("data", out var data) && data.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in data.EnumerateArray())
                {
                    if (item.TryGetProperty("type", out var type) && type.GetString() == "CITY")
                    {
                        if (item.TryGetProperty("gaiaId", out var gId))
                        {
                            regionId = gId.GetString();
                            break;
                        }
                        if (item.TryGetProperty("regionId", out var rId))
                        {
                            regionId = rId.GetString();
                            break;
                        }
                    }
                }
                // Fallback to first result
                if (string.IsNullOrEmpty(regionId) && data.GetArrayLength() > 0)
                {
                    var first = data[0];
                    if (first.TryGetProperty("gaiaId", out var gId))
                        regionId = gId.GetString();
                    else if (first.TryGetProperty("regionId", out var rId))
                        regionId = rId.GetString();
                }
            }

            if (string.IsNullOrEmpty(regionId))
            {
                _logger.LogWarning("Could not find Hotels.com region ID for: {Destination}", destination);
                return results;
            }

            _logger.LogInformation("Hotels.com region ID for {Destination}: {RegionId}", destination, regionId);

            // Now search for hotels
            var hotelsUrl = $"https://{_settings.HotelsComHost}/v2/hotels/search" +
                           $"?region_id={regionId}" +
                           $"&locale=en_US" +
                           $"&domain=US" +
                           $"&checkin_date={checkIn}" +
                           $"&checkout_date={checkOut}" +
                           $"&adults_number={adults}" +
                           $"&sort_order=PRICE_LOW_TO_HIGH" +
                           $"&available_filter=SHOW_AVAILABLE_ONLY";

            var hotelsRequest = new HttpRequestMessage(HttpMethod.Get, hotelsUrl);
            hotelsRequest.Headers.Add("x-rapidapi-host", _settings.HotelsComHost);
            hotelsRequest.Headers.Add("x-rapidapi-key", _settings.ApiKey);

            var hotelsResponse = await _httpClient.SendAsync(hotelsRequest, cancellationToken);
            var hotelsJson = await hotelsResponse.Content.ReadAsStringAsync(cancellationToken);

            if (!hotelsResponse.IsSuccessStatusCode)
            {
                _logger.LogWarning("Hotels.com hotel search failed: {StatusCode} - {Response}", 
                    hotelsResponse.StatusCode, hotelsJson.Substring(0, Math.Min(500, hotelsJson.Length)));
                return results;
            }

            using var hotelsDoc = JsonDocument.Parse(hotelsJson);
            var hotelsRoot = hotelsDoc.RootElement;

            // Log the response structure for debugging
            _logger.LogDebug("Hotels.com response keys: {Keys}", 
                string.Join(", ", hotelsRoot.EnumerateObject().Select(p => p.Name)));

            JsonElement hotels;
            // Hotels.com v2 API returns hotels in 'propertySearchListings'
            if (hotelsRoot.TryGetProperty("propertySearchListings", out var listings))
            {
                hotels = listings;
                _logger.LogDebug("Found {Count} hotels in propertySearchListings", 
                    listings.ValueKind == JsonValueKind.Array ? listings.GetArrayLength() : 0);
            }
            else if (hotelsRoot.TryGetProperty("properties", out var props))
                hotels = props;
            else if (hotelsRoot.TryGetProperty("data", out var hData) && hData.ValueKind == JsonValueKind.Array)
                hotels = hData;
            else
            {
                _logger.LogWarning("Hotels.com: No properties found in response. Response: {Response}", 
                    hotelsJson.Substring(0, Math.Min(500, hotelsJson.Length)));
                return results;
            }

            foreach (var hotel in hotels.EnumerateArray())
            {
                try
                {
                    var hotelId = hotel.TryGetProperty("id", out var id) ? id.GetString() ?? "" : "";
                    var name = hotel.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "";
                    
                    // Get price
                    decimal? price = null;
                    string? currency = "USD";
                    if (hotel.TryGetProperty("price", out var priceObj))
                    {
                        if (priceObj.TryGetProperty("lead", out var lead))
                        {
                            if (lead.TryGetProperty("amount", out var amt))
                                price = amt.GetDecimal();
                            if (lead.TryGetProperty("currencyInfo", out var curr) && 
                                curr.TryGetProperty("code", out var code))
                                currency = code.GetString();
                        }
                    }

                    // Get photo
                    string? photoUrl = null;
                    if (hotel.TryGetProperty("propertyImage", out var img))
                    {
                        if (img.TryGetProperty("image", out var imgObj) && 
                            imgObj.TryGetProperty("url", out var url))
                            photoUrl = url.GetString();
                    }

                    // Get rating
                    double? rating = null;
                    int? reviewCount = null;
                    if (hotel.TryGetProperty("reviews", out var reviews))
                    {
                        if (reviews.TryGetProperty("score", out var score))
                            rating = score.GetDouble();
                        if (reviews.TryGetProperty("total", out var total))
                            reviewCount = total.GetInt32();
                    }

                    // Get star rating
                    int starRating = 0;
                    if (hotel.TryGetProperty("star", out var star))
                        starRating = star.GetInt32();

                    // Build Hotels.com URL
                    var bookingUrl = $"https://www.hotels.com/ho{hotelId}/?chkin={checkIn}&chkout={checkOut}&x_pwa=1";

                    if (!string.IsNullOrEmpty(name) && price.HasValue)
                    {
                        results.Add(new NormalizedHotelDto(
                            Id: $"hotelscom_{hotelId}",
                            Provider: "hotels.com",
                            Name: name,
                            Address: null,
                            City: destination,
                            Latitude: null,
                            Longitude: null,
                            StarRating: starRating,
                            Rating: rating,
                            ReviewCount: reviewCount,
                            MainPhotoUrl: photoUrl,
                            PhotoUrls: photoUrl != null ? new List<string> { photoUrl } : null,
                            PricePerNight: price,
                            Currency: currency,
                            RoomType: null,
                            Facilities: null,
                            BookingUrl: bookingUrl
                        ));
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error parsing Hotels.com hotel");
                }
            }

            _logger.LogInformation("Hotels.com returned {Count} hotels for {Destination}", results.Count, destination);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching Hotels.com for: {Destination}", destination);
        }

        return results;
    }

}


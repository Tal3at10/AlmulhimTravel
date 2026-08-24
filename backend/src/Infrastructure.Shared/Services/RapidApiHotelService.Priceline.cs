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
    /// Search hotels from Priceline via RapidAPI
    /// </summary>
    public async Task<List<NormalizedHotelDto>> SearchPricelineHotelsAsync(
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
            // First, get location ID
            var locationUrl = $"https://{_settings.PricelineHost}/hotels/locations" +
                             $"?name={Uri.EscapeDataString(destination)}" +
                             $"&search_type=CITY";

            var locationRequest = new HttpRequestMessage(HttpMethod.Get, locationUrl);
            locationRequest.Headers.Add("x-rapidapi-host", _settings.PricelineHost);
            locationRequest.Headers.Add("x-rapidapi-key", _settings.ApiKey);

            var locationResponse = await _httpClient.SendAsync(locationRequest, cancellationToken);
            var locationJson = await locationResponse.Content.ReadAsStringAsync(cancellationToken);

            if (!locationResponse.IsSuccessStatusCode)
            {
                _logger.LogWarning("Priceline location search failed: {StatusCode}", locationResponse.StatusCode);
                return results;
            }

            using var locationDoc = JsonDocument.Parse(locationJson);
            var locationRoot = locationDoc.RootElement;

            string? cityId = null;
            if (locationRoot.ValueKind == JsonValueKind.Array && locationRoot.GetArrayLength() > 0)
            {
                var first = locationRoot[0];
                if (first.TryGetProperty("id", out var id))
                    cityId = id.GetString();
                else if (first.TryGetProperty("cityId", out var cId))
                    cityId = cId.GetString();
            }
            else if (locationRoot.TryGetProperty("data", out var data) && data.ValueKind == JsonValueKind.Array)
            {
                if (data.GetArrayLength() > 0)
                {
                    var first = data[0];
                    if (first.TryGetProperty("id", out var id))
                        cityId = id.GetString();
                }
            }

            if (string.IsNullOrEmpty(cityId))
            {
                _logger.LogWarning("Could not find Priceline city ID for: {Destination}", destination);
                return results;
            }

            _logger.LogInformation("Priceline city ID for {Destination}: {CityId}", destination, cityId);

            // Search hotels
            var hotelsUrl = $"https://{_settings.PricelineHost}/hotels/search" +
                           $"?location_id={cityId}" +
                           $"&date_checkin={checkIn}" +
                           $"&date_checkout={checkOut}" +
                           $"&rooms={rooms}" +
                           $"&adults={adults}" +
                           $"&sort_order=PRICE";

            var hotelsRequest = new HttpRequestMessage(HttpMethod.Get, hotelsUrl);
            hotelsRequest.Headers.Add("x-rapidapi-host", _settings.PricelineHost);
            hotelsRequest.Headers.Add("x-rapidapi-key", _settings.ApiKey);

            var hotelsResponse = await _httpClient.SendAsync(hotelsRequest, cancellationToken);
            var hotelsJson = await hotelsResponse.Content.ReadAsStringAsync(cancellationToken);

            if (!hotelsResponse.IsSuccessStatusCode)
            {
                _logger.LogWarning("Priceline hotel search failed: {StatusCode}", hotelsResponse.StatusCode);
                return results;
            }

            using var hotelsDoc = JsonDocument.Parse(hotelsJson);
            var hotelsRoot = hotelsDoc.RootElement;

            JsonElement hotels;
            if (hotelsRoot.TryGetProperty("hotels", out var h))
                hotels = h;
            else if (hotelsRoot.TryGetProperty("data", out var data) && data.ValueKind == JsonValueKind.Array)
                hotels = data;
            else if (hotelsRoot.ValueKind == JsonValueKind.Array)
                hotels = hotelsRoot;
            else
            {
                _logger.LogWarning("Priceline: No hotels found in response");
                return results;
            }

            foreach (var hotel in hotels.EnumerateArray())
            {
                try
                {
                    var hotelId = "";
                    if (hotel.TryGetProperty("hotelId", out var hId))
                        hotelId = hId.ValueKind == JsonValueKind.String ? hId.GetString() ?? "" : hId.GetInt64().ToString();
                    else if (hotel.TryGetProperty("id", out var id))
                        hotelId = id.ValueKind == JsonValueKind.String ? id.GetString() ?? "" : id.GetInt64().ToString();

                    var name = hotel.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "";
                    if (string.IsNullOrEmpty(name) && hotel.TryGetProperty("hotelName", out var hn))
                        name = hn.GetString() ?? "";

                    // Get price
                    decimal? price = null;
                    string? currency = "USD";
                    if (hotel.TryGetProperty("ratesSummary", out var rates))
                    {
                        if (rates.TryGetProperty("minPrice", out var minPrice))
                            price = minPrice.GetDecimal();
                        if (rates.TryGetProperty("minCurrencyCode", out var curr))
                            currency = curr.GetString();
                    }
                    else if (hotel.TryGetProperty("price", out var priceVal))
                    {
                        price = priceVal.GetDecimal();
                    }

                    // Get photo
                    string? photoUrl = null;
                    if (hotel.TryGetProperty("thumbnailUrl", out var thumb))
                        photoUrl = thumb.GetString();
                    else if (hotel.TryGetProperty("image", out var img))
                        photoUrl = img.GetString();

                    // Get rating
                    double? rating = null;
                    int? reviewCount = null;
                    if (hotel.TryGetProperty("overallGuestRating", out var guestRating))
                        rating = guestRating.GetDouble();
                    if (hotel.TryGetProperty("totalReviewCount", out var revCount))
                        reviewCount = revCount.GetInt32();

                    // Get star rating
                    int starRating = 0;
                    if (hotel.TryGetProperty("starRating", out var star))
                        starRating = (int)star.GetDouble();

                    // Build Priceline URL
                    var bookingUrl = $"https://www.priceline.com/relax/at/{hotelId}?refid=PLHOMEPAGE";

                    if (!string.IsNullOrEmpty(name) && price.HasValue)
                    {
                        results.Add(new NormalizedHotelDto(
                            Id: $"priceline_{hotelId}",
                            Provider: "priceline",
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
                    _logger.LogWarning(ex, "Error parsing Priceline hotel");
                }
            }

            _logger.LogInformation("Priceline returned {Count} hotels for {Destination}", results.Count, destination);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching Priceline for: {Destination}", destination);
        }

        return results;
    }

}


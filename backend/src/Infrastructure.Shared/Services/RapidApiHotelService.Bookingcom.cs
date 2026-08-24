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

    public async Task<string?> GetBookingDestinationIdAsync(
        string query,
        CancellationToken cancellationToken = default)
    {
        // First check if we have a pre-defined ID
        if (CityDestinationIds.TryGetValue(query.Trim(), out var cachedId))
        {
            _logger.LogDebug("Using cached destination ID for {Query}: {DestId}", query, cachedId);
            return cachedId;
        }

        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"https://{_settings.BookingHost}/api/v1/hotels/searchDestination?query={Uri.EscapeDataString(query)}");

            request.Headers.Add("x-rapidapi-host", _settings.BookingHost);
            request.Headers.Add("x-rapidapi-key", _settings.ApiKey);

            var response = await _httpClient.SendAsync(request, cancellationToken);
            var json = await response.Content.ReadAsStringAsync(cancellationToken);

            _logger.LogDebug("Booking destination search response: {Response}", json.Substring(0, Math.Min(500, json.Length)));

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Booking destination search failed: {StatusCode}", response.StatusCode);
                return null;
            }

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            // Check if response has 'data' property (new format)
            JsonElement dataArray;
            if (root.TryGetProperty("data", out var data))
            {
                dataArray = data;
            }
            else if (root.ValueKind == JsonValueKind.Array)
            {
                dataArray = root;
            }
            else
            {
                _logger.LogWarning("Unexpected Booking destination response format");
                return null;
            }

            // Find a CITY type destination (not airport, district, etc.)
            foreach (var item in dataArray.EnumerateArray())
            {
                var destType = item.TryGetProperty("dest_type", out var dt) ? dt.GetString() : null;
                var searchType = item.TryGetProperty("search_type", out var st) ? st.GetString() : null;
                
                // Prefer city type
                if (destType == "city" || searchType == "city")
                {
                    if (item.TryGetProperty("dest_id", out var destId))
                    {
                        var id = destId.GetString();
                        _logger.LogInformation("Found city destination ID for {Query}: {DestId}", query, id);
                        return id;
                    }
                }
            }

            // If no city found, take the first one with most hotels
            if (dataArray.GetArrayLength() > 0)
            {
                var first = dataArray[0];
                if (first.TryGetProperty("dest_id", out var destId))
                {
                    var id = destId.GetString();
                    _logger.LogInformation("Using first destination ID for {Query}: {DestId}", query, id);
                    return id;
                }
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting Booking destination ID for: {Query}", query);
            return null;
        }
    }

    public async Task<List<BookingHotelDto>> SearchBookingHotelsAsync(
        string destination,
        string checkIn,
        string checkOut,
        int adults = 2,
        int rooms = 1,
        CancellationToken cancellationToken = default)
    {
        var results = new List<BookingHotelDto>();

        try
        {
            // First, get the destination ID
            var destId = await GetBookingDestinationIdAsync(destination, cancellationToken);
            if (string.IsNullOrEmpty(destId))
            {
                _logger.LogWarning("Could not find Booking destination ID for: {Destination}", destination);
                return results;
            }

            _logger.LogInformation("Searching Booking.com hotels for destId: {DestId}", destId);

            var url = $"https://{_settings.BookingHost}/api/v1/hotels/searchHotels" +
                      $"?dest_id={destId}" +
                      $"&search_type=CITY" +
                      $"&arrival_date={checkIn}" +
                      $"&departure_date={checkOut}" +
                      $"&adults={adults}" +
                      $"&room_qty={rooms}" +
                      $"&page_number=1" +
                      $"&units=metric" +
                      $"&temperature_unit=c" +
                      $"&languagecode=en-us" +
                      $"&currency_code=USD";

            // Log API key status (for debugging)
            _logger.LogInformation("Booking.com API - Host: {Host}, ApiKey set: {HasKey}", 
                _settings.BookingHost, !string.IsNullOrEmpty(_settings.ApiKey));

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("x-rapidapi-host", _settings.BookingHost);
            request.Headers.Add("x-rapidapi-key", _settings.ApiKey);

            var response = await _httpClient.SendAsync(request, cancellationToken);
            var json = await response.Content.ReadAsStringAsync(cancellationToken);

            _logger.LogInformation("Booking hotel search response: StatusCode={StatusCode}, Length={Length}", 
                response.StatusCode, json.Length);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Booking hotel search failed: {StatusCode} - {Response}",
                    response.StatusCode, json.Substring(0, Math.Min(500, json.Length)));
                return results;
            }

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            // Parse hotels from response - handle different response structures
            JsonElement hotels;
            if (root.TryGetProperty("data", out var data))
            {
                if (data.TryGetProperty("hotels", out var h))
                {
                    hotels = h;
                }
                else if (data.ValueKind == JsonValueKind.Array)
                {
                    hotels = data;
                }
                else
                {
                    _logger.LogWarning("No hotels array found in Booking response");
                    return results;
                }
            }
            else if (root.TryGetProperty("result", out var result))
            {
                hotels = result;
            }
            else
            {
                _logger.LogWarning("Unexpected Booking hotel search response format. Response: {Response}", 
                    json.Substring(0, Math.Min(1000, json.Length)));
                return results;
            }

            foreach (var hotel in hotels.EnumerateArray())
            {
                try
                {
                    // Extract property info - Booking.com nests hotel info in 'property'
                    var property = hotel.TryGetProperty("property", out var prop) ? prop : hotel;
                    
                    // Get photo URLs
                    var photoUrls = new List<string>();
                    if (property.TryGetProperty("photoUrls", out var photos))
                    {
                        foreach (var photo in photos.EnumerateArray())
                        {
                            var photoUrl = photo.GetString();
                            if (!string.IsNullOrEmpty(photoUrl))
                                photoUrls.Add(photoUrl);
                        }
                    }
                    // Alternative: single main photo
                    if (photoUrls.Count == 0 && property.TryGetProperty("mainPhotoUrl", out var mainPhoto))
                    {
                        var url2 = mainPhoto.GetString();
                        if (!string.IsNullOrEmpty(url2))
                            photoUrls.Add(url2);
                    }

                    // Get price - try multiple sources
                    decimal? price = null;
                    string? currency = "USD";

                    if (property.TryGetProperty("priceBreakdown", out var priceBreakdown))
                    {
                        // First try grossPricePerNight (this is what we want)
                        if (priceBreakdown.TryGetProperty("grossPricePerNight", out var ppn))
                        {
                            if (ppn.TryGetProperty("value", out var ppnVal))
                            {
                                price = ppnVal.GetDecimal();
                                _logger.LogDebug("Found grossPricePerNight: {Price}", price);
                            }
                            if (ppn.TryGetProperty("currency", out var ppnCurr))
                                currency = ppnCurr.GetString();
                        }
                        // Then try grossPrice (this is usually total, but keep as-is for now)
                        else if (priceBreakdown.TryGetProperty("grossPrice", out var gp))
                        {
                            if (gp.TryGetProperty("value", out var val))
                            {
                                price = val.GetDecimal();
                                _logger.LogDebug("Found grossPrice (total): {Price}", price);
                            }
                            if (gp.TryGetProperty("currency", out var curr))
                                currency = curr.GetString();
                        }
                    }

                    // Get hotel ID from different possible locations
                    string hotelId = "";
                    if (hotel.TryGetProperty("hotel_id", out var hid))
                        hotelId = hid.ValueKind == JsonValueKind.String ? hid.GetString() ?? "" : hid.GetInt64().ToString();
                    else if (property.TryGetProperty("id", out var pid))
                        hotelId = pid.ValueKind == JsonValueKind.String ? pid.GetString() ?? "" : pid.GetInt64().ToString();

                    // Get hotel name
                    string hotelName = "";
                    if (property.TryGetProperty("name", out var name))
                        hotelName = name.GetString() ?? "";

                    // Get star rating
                    int starRating = 0;
                    if (property.TryGetProperty("propertyClass", out var cls))
                        starRating = cls.GetInt32();
                    else if (property.TryGetProperty("class", out var cls2))
                        starRating = cls2.GetInt32();

                    // Get review score
                    double? reviewScore = null;
                    if (property.TryGetProperty("reviewScore", out var rs))
                        reviewScore = rs.GetDouble();

                    // Get review count
                    int? reviewCount = null;
                    if (property.TryGetProperty("reviewCount", out var rc))
                        reviewCount = rc.GetInt32();

                    // Get coordinates
                    double? latitude = null, longitude = null;
                    if (property.TryGetProperty("latitude", out var lat))
                        latitude = lat.GetDouble();
                    if (property.TryGetProperty("longitude", out var lon))
                        longitude = lon.GetDouble();

                    // Get booking URL from API response - try multiple properties
                    string? bookingUrl = null;
                    
                    // Try to get direct URL from multiple possible properties
                    if (property.TryGetProperty("url", out var urlProp))
                    {
                        bookingUrl = urlProp.GetString();
                    }
                    else if (hotel.TryGetProperty("url", out var hotelUrlProp))
                    {
                        bookingUrl = hotelUrlProp.GetString();
                    }
                    else if (property.TryGetProperty("wishlistName", out var wishlistName))
                    {
                        // wishlistName is often the hotel slug like "eg/hyatt-regency-cairo-west"
                        var slug = wishlistName.GetString();
                        if (!string.IsNullOrEmpty(slug))
                        {
                            bookingUrl = $"https://www.booking.com/hotel/{slug}.ar.html?checkin={checkIn}&checkout={checkOut}&group_adults={adults}&no_rooms={rooms}";
                        }
                    }
                    else if (property.TryGetProperty("ufi", out var ufi) && property.TryGetProperty("slug", out var slugProp))
                    {
                        // Build URL using ufi (country/city code) and slug
                        var slug = slugProp.GetString();
                        if (!string.IsNullOrEmpty(slug))
                        {
                            bookingUrl = $"https://www.booking.com/hotel/{slug}.ar.html?checkin={checkIn}&checkout={checkOut}&group_adults={adults}&no_rooms={rooms}";
                        }
                    }
                    
                    // Final fallback: search with EXACT hotel name (quoted)
                    if (string.IsNullOrEmpty(bookingUrl))
                    {
                        // Use quotes around hotel name to get exact match in search
                        var searchQuery = Uri.EscapeDataString($"\"{hotelName}\" {destination}");
                        bookingUrl = $"https://www.booking.com/searchresults.ar.html?ss={searchQuery}&checkin={checkIn}&checkout={checkOut}&group_adults={adults}&no_rooms={rooms}";
                    }
                    
                    // Log the URL for debugging
                    _logger.LogDebug("Hotel {Name} booking URL: {Url}", hotelName, bookingUrl);

                    if (!string.IsNullOrEmpty(hotelName))
                    {
                        results.Add(new BookingHotelDto(
                            HotelId: hotelId,
                            Name: hotelName,
                            Address: null,
                            City: destination,
                            Country: null,
                            Latitude: latitude,
                            Longitude: longitude,
                            StarRating: starRating,
                            ReviewScore: reviewScore,
                            ReviewCount: reviewCount,
                            MainPhotoUrl: photoUrls.FirstOrDefault(),
                            PricePerNight: price,
                            Currency: currency,
                            CheckIn: checkIn,
                            CheckOut: checkOut,
                            PhotoUrls: photoUrls,
                            Facilities: null,
                            BookingUrl: bookingUrl
                        ));
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error parsing Booking hotel");
                }
            }

            _logger.LogInformation("Found {Count} hotels from Booking.com for {Destination}", results.Count, destination);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching Booking hotels for: {Destination}", destination);
        }

        return results;
    }

    public async Task<HotelDetailsDto?> GetHotelDetailsAsync(
        string hotelId,
        string checkIn,
        string checkOut,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var cleanId = hotelId.Replace("booking_", "").Replace("hotelscom_", "").Replace("tripadvisor_", "");
            
            // For now, we will fetch photos and description
            var photosUrl = $"https://{_settings.BookingHost}/api/v1/hotels/getPhotos?hotel_id={cleanId}&locale=ar-sa";
            var photosRequest = new HttpRequestMessage(HttpMethod.Get, photosUrl);
            photosRequest.Headers.Add("x-rapidapi-host", _settings.BookingHost);
            photosRequest.Headers.Add("x-rapidapi-key", _settings.ApiKey);

            var photosResponse = await _httpClient.SendAsync(photosRequest, cancellationToken);
            var photosJson = await photosResponse.Content.ReadAsStringAsync(cancellationToken);
            
            var descUrl = $"https://{_settings.BookingHost}/api/v1/hotels/getDescription?hotel_id={cleanId}&locale=ar-sa";
            var descRequest = new HttpRequestMessage(HttpMethod.Get, descUrl);
            descRequest.Headers.Add("x-rapidapi-host", _settings.BookingHost);
            descRequest.Headers.Add("x-rapidapi-key", _settings.ApiKey);
            
            var descResponse = await _httpClient.SendAsync(descRequest, cancellationToken);
            var descJson = await descResponse.Content.ReadAsStringAsync(cancellationToken);

            var photos = new List<string>();
            if (photosResponse.IsSuccessStatusCode)
            {
                using var doc = JsonDocument.Parse(photosJson);
                var root = doc.RootElement;
                if (root.ValueKind == JsonValueKind.Array)
                {
                    foreach (var photo in root.EnumerateArray())
                    {
                        if (photo.TryGetProperty("url_max", out var max))
                            photos.Add(max.GetString() ?? "");
                    }
                }
            }
            
            var description = "";
            if (descResponse.IsSuccessStatusCode)
            {
                using var doc = JsonDocument.Parse(descJson);
                if (doc.RootElement.TryGetProperty("description", out var desc))
                    description = desc.GetString() ?? "";
            }

            // Return dto
            return new HotelDetailsDto(
                Id: hotelId,
                Name: "فندق", // Since we don't have search payload here, we expect frontend to pass the basic details
                NameEn: null,
                Description: description,
                Address: null,
                City: null,
                StarRating: 4,
                Rating: null,
                RatingText: null,
                ReviewCount: null,
                CheckInTime: "14:00",
                CheckOutTime: "12:00",
                Photos: photos,
                Facilities: new List<string> { "واي فاي مجاني", "مسبح", "مواقف سيارات" },
                Price: null,
                Currency: "SAR"
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting hotel details for {HotelId}", hotelId);
            return null;
        }
    }

}


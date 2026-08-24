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

    public async Task<string?> GetTripadvisorLocationIdAsync(
        string query,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"https://{_settings.TripadvisorHost}/api/v1/hotels/searchLocation?query={Uri.EscapeDataString(query)}");

            request.Headers.Add("x-rapidapi-host", _settings.TripadvisorHost);
            request.Headers.Add("x-rapidapi-key", _settings.ApiKey);

            var response = await _httpClient.SendAsync(request, cancellationToken);
            var json = await response.Content.ReadAsStringAsync(cancellationToken);

            _logger.LogDebug("Tripadvisor location search response: {Response}", json.Substring(0, Math.Min(500, json.Length)));

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Tripadvisor location search failed: {StatusCode}", response.StatusCode);
                return null;
            }

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            JsonElement dataArray;
            if (root.TryGetProperty("data", out var data))
                dataArray = data;
            else if (root.ValueKind == JsonValueKind.Array)
                dataArray = root;
            else
                return null;

            if (dataArray.GetArrayLength() > 0)
            {
                var first = dataArray[0];
                // Try different property names - handle both string and int types
                if (first.TryGetProperty("locationId", out var locId))
                    return locId.ValueKind == JsonValueKind.String ? locId.GetString() : locId.GetInt64().ToString();
                if (first.TryGetProperty("location_id", out var locId2))
                    return locId2.ValueKind == JsonValueKind.String ? locId2.GetString() : locId2.GetInt64().ToString();
                if (first.TryGetProperty("geoId", out var geoId))
                    return geoId.ValueKind == JsonValueKind.String ? geoId.GetString() : geoId.GetInt64().ToString();
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting Tripadvisor location ID for: {Query}", query);
            return null;
        }
    }

    public async Task<List<TripadvisorHotelDto>> SearchTripadvisorHotelsAsync(
        string locationId,
        CancellationToken cancellationToken = default)
    {
        var results = new List<TripadvisorHotelDto>();

        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"https://{_settings.TripadvisorHost}/api/v1/hotels/searchHotels?geoId={locationId}");

            request.Headers.Add("x-rapidapi-host", _settings.TripadvisorHost);
            request.Headers.Add("x-rapidapi-key", _settings.ApiKey);

            var response = await _httpClient.SendAsync(request, cancellationToken);
            var json = await response.Content.ReadAsStringAsync(cancellationToken);

            _logger.LogDebug("Tripadvisor hotel search response length: {Length}", json.Length);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Tripadvisor hotel search failed: {StatusCode}", response.StatusCode);
                return results;
            }

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            // Try to find hotels in different response structures
            JsonElement hotels;
            if (root.TryGetProperty("data", out var data))
            {
                if (data.TryGetProperty("data", out var innerData))
                    hotels = innerData;
                else if (data.ValueKind == JsonValueKind.Array)
                    hotels = data;
                else
                    hotels = data;
            }
            else if (root.ValueKind == JsonValueKind.Array)
            {
                hotels = root;
            }
            else
            {
                return results;
            }

            if (hotels.ValueKind != JsonValueKind.Array)
            {
                _logger.LogWarning("Hotels is not an array in Tripadvisor response");
                return results;
            }

            foreach (var hotel in hotels.EnumerateArray())
            {
                try
                {
                    var photos = new List<TripadvisorPhotoDto>();
                    
                    // Try to get photo
                    string? photoUrl = null;
                    if (hotel.TryGetProperty("cardPhotos", out var cardPhotos) && 
                        cardPhotos.ValueKind == JsonValueKind.Array && 
                        cardPhotos.GetArrayLength() > 0)
                    {
                        var firstPhoto = cardPhotos[0];
                        if (firstPhoto.TryGetProperty("sizes", out var sizes))
                        {
                            if (sizes.TryGetProperty("urlTemplate", out var urlTemplate))
                            {
                                photoUrl = urlTemplate.GetString()?.Replace("{width}", "500").Replace("{height}", "350");
                            }
                        }
                    }

                    // Get name
                    string name = "";
                    if (hotel.TryGetProperty("title", out var title))
                        name = title.GetString() ?? "";
                    else if (hotel.TryGetProperty("name", out var n))
                        name = n.GetString() ?? "";

                    // Get location ID
                    string locId = "";
                    if (hotel.TryGetProperty("id", out var id))
                        locId = id.GetString() ?? "";
                    else if (hotel.TryGetProperty("locationId", out var lid))
                        locId = lid.GetString() ?? "";

                    // Get rating
                    string? rating = null;
                    if (hotel.TryGetProperty("bubbleRating", out var br))
                    {
                        if (br.TryGetProperty("rating", out var r))
                            rating = r.GetDouble().ToString();
                    }

                    // Get review count
                    int? reviewCount = null;
                    if (hotel.TryGetProperty("bubbleRating", out var br2))
                    {
                        if (br2.TryGetProperty("count", out var c))
                        {
                            var countStr = c.GetString();
                            if (int.TryParse(countStr?.Replace(",", ""), out var count))
                                reviewCount = count;
                        }
                    }

                    if (!string.IsNullOrEmpty(name))
                    {
                        results.Add(new TripadvisorHotelDto(
                            LocationId: locId,
                            Name: name,
                            Address: null,
                            Latitude: null,
                            Longitude: null,
                            Rating: rating,
                            NumReviews: reviewCount,
                            PriceLevel: null,
                            PhotoUrl: photoUrl,
                            Photos: photos
                        ));
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error parsing Tripadvisor hotel");
                }
            }

            _logger.LogInformation("Found {Count} hotels from Tripadvisor", results.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching Tripadvisor hotels");
        }

        return results;
    }

}


using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers;

/// <summary>
/// RapidAPI Hotels - Multi-Provider Hotel Search (Booking.com, Tripadvisor)
/// </summary>
[Route("api/rapidapi/hotels")]
public class RapidApiHotelsController : BaseApiController
{
    private readonly IRapidApiHotelService _hotelService;
    private readonly ILogger<RapidApiHotelsController> _logger;

    public RapidApiHotelsController(
        IRapidApiHotelService hotelService,
        ILogger<RapidApiHotelsController> logger)
    {
        _hotelService = hotelService;
        _logger = logger;
    }

    /// <summary>
    /// Get full hotel details
    /// </summary>
    [HttpGet("{hotelId}")]
    public async Task<IActionResult> GetHotelDetails(
        string hotelId,
        [FromQuery] string checkIn,
        [FromQuery] string checkOut,
        CancellationToken cancellationToken = default)
    {
        var details = await _hotelService.GetHotelDetailsAsync(hotelId, checkIn, checkOut, cancellationToken);
        if (details == null) return NotFound(new { success = false, message = "Hotel not found" });
        return Ok(new { success = true, data = details });
    }

    /// <summary>
    /// Search hotels from all providers (Booking.com, Tripadvisor)
    /// Returns normalized results for easy comparison
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> SearchAllProviders(
        [FromQuery] string destination,
        [FromQuery] string checkIn,
        [FromQuery] string checkOut,
        [FromQuery] int adults = 2,
        [FromQuery] int rooms = 1,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(destination) || string.IsNullOrEmpty(checkIn) || string.IsNullOrEmpty(checkOut))
        {
            return BadRequest(new { success = false, message = "destination, checkIn, and checkOut are required" });
        }

        _logger.LogInformation("Multi-provider hotel search for {Destination}, {CheckIn} to {CheckOut}",
            destination, checkIn, checkOut);

        var results = await _hotelService.SearchAllProvidersAsync(
            destination, checkIn, checkOut, adults, rooms, cancellationToken);

        // Group by provider for stats
        var providerStats = results
            .GroupBy(h => h.Provider)
            .Select(g => new { provider = g.Key, count = g.Count() })
            .ToList();

        return Ok(new
        {
            success = true,
            data = results,
            count = results.Count,
            providers = providerStats,
            search = new { destination, checkIn, checkOut, adults, rooms }
        });
    }

    /// <summary>
    /// Search hotels from Booking.com only
    /// </summary>
    [HttpGet("booking/search")]
    public async Task<IActionResult> SearchBooking(
        [FromQuery] string destination,
        [FromQuery] string checkIn,
        [FromQuery] string checkOut,
        [FromQuery] int adults = 2,
        [FromQuery] int rooms = 1,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(destination) || string.IsNullOrEmpty(checkIn) || string.IsNullOrEmpty(checkOut))
        {
            return BadRequest(new { success = false, message = "destination, checkIn, and checkOut are required" });
        }

        var results = await _hotelService.SearchBookingHotelsAsync(
            destination, checkIn, checkOut, adults, rooms, cancellationToken);

        return Ok(new
        {
            success = true,
            data = results,
            count = results.Count,
            provider = "booking.com"
        });
    }

    /// <summary>
    /// Get Booking.com destination ID for a city
    /// </summary>
    [HttpGet("booking/destination")]
    public async Task<IActionResult> GetBookingDestination(
        [FromQuery] string query,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(query))
        {
            return BadRequest(new { success = false, message = "query is required" });
        }

        var destId = await _hotelService.GetBookingDestinationIdAsync(query, cancellationToken);

        return Ok(new
        {
            success = destId != null,
            data = new { destinationId = destId, query }
        });
    }

    /// <summary>
    /// Get Tripadvisor location ID for a city
    /// </summary>
    [HttpGet("tripadvisor/location")]
    public async Task<IActionResult> GetTripadvisorLocation(
        [FromQuery] string query,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(query))
        {
            return BadRequest(new { success = false, message = "query is required" });
        }

        var locationId = await _hotelService.GetTripadvisorLocationIdAsync(query, cancellationToken);

        return Ok(new
        {
            success = locationId != null,
            data = new { locationId, query }
        });
    }

    /// <summary>
    /// Get list of supported destinations for testing
    /// </summary>
    [HttpGet("destinations")]
    public IActionResult GetSupportedDestinations()
    {
        var destinations = new[]
        {
            new { nameAr = "لندن", nameEn = "London", country = "UK" },
            new { nameAr = "دبي", nameEn = "Dubai", country = "UAE" },
            new { nameAr = "إسطنبول", nameEn = "Istanbul", country = "Turkey" },
            new { nameAr = "باريس", nameEn = "Paris", country = "France" },
            new { nameAr = "كوالالمبور", nameEn = "Kuala Lumpur", country = "Malaysia" },
            new { nameAr = "بانكوك", nameEn = "Bangkok", country = "Thailand" },
            new { nameAr = "القاهرة", nameEn = "Cairo", country = "Egypt" },
            new { nameAr = "الرياض", nameEn = "Riyadh", country = "Saudi Arabia" },
            new { nameAr = "جدة", nameEn = "Jeddah", country = "Saudi Arabia" },
            new { nameAr = "موسكو", nameEn = "Moscow", country = "Russia" },
            new { nameAr = "سنغافورة", nameEn = "Singapore", country = "Singapore" },
            new { nameAr = "نيويورك", nameEn = "New York", country = "USA" },
        };

        return Ok(new { success = true, data = destinations });
    }

    /// <summary>
    /// Debug endpoint - Test direct Booking.com API call
    /// </summary>
    [HttpGet("debug/booking-test")]
    public async Task<IActionResult> DebugBookingTest(
        [FromQuery] string destId = "-2601889",
        [FromQuery] string checkIn = "2026-02-01",
        [FromQuery] string checkOut = "2026-02-03",
        CancellationToken cancellationToken = default)
    {
        try
        {
            using var httpClient = new HttpClient();
            httpClient.Timeout = TimeSpan.FromSeconds(30);

            var url = $"https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels" +
                      $"?dest_id={destId}" +
                      $"&search_type=CITY" +
                      $"&arrival_date={checkIn}" +
                      $"&departure_date={checkOut}" +
                      $"&adults=2" +
                      $"&room_qty=1" +
                      $"&page_number=1";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("x-rapidapi-host", "booking-com15.p.rapidapi.com");
            request.Headers.Add("x-rapidapi-key", "e2308643e9msh246d72644d5036cp1a49dcjsnc2bd7c8c9d1c");

            _logger.LogInformation("Debug: Calling Booking.com API: {Url}", url);

            var response = await httpClient.SendAsync(request, cancellationToken);
            var json = await response.Content.ReadAsStringAsync(cancellationToken);

            _logger.LogInformation("Debug: Booking.com response status: {StatusCode}, length: {Length}", 
                response.StatusCode, json.Length);

            // Parse and return first 5 hotels for debugging
            var doc = System.Text.Json.JsonDocument.Parse(json);
            
            return Ok(new
            {
                success = response.IsSuccessStatusCode,
                statusCode = (int)response.StatusCode,
                responseLength = json.Length,
                rawResponsePreview = json.Substring(0, Math.Min(2000, json.Length)),
                url = url
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Debug: Error calling Booking.com API");
            return Ok(new
            {
                success = false,
                error = ex.Message,
                stackTrace = ex.StackTrace
            });
        }
    }
}

using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers;

/// <summary>
/// Hotel Price Comparison API (Trivago-style)
/// Search and compare hotel prices across multiple providers
/// </summary>
[Route("api/hotels/compare")]
public class HotelComparisonController : BaseApiController
{
    private readonly IHotelComparisonService _comparisonService;
    private readonly ILogger<HotelComparisonController> _logger;

    public HotelComparisonController(
        IHotelComparisonService comparisonService,
        ILogger<HotelComparisonController> logger)
    {
        _comparisonService = comparisonService;
        _logger = logger;
    }

    /// <summary>
    /// Search and compare hotel prices across all providers
    /// Returns grouped hotels with price comparison from Booking.com, Tripadvisor, etc.
    /// </summary>
    /// <param name="destination">City name (e.g., "London", "لندن", "Dubai")</param>
    /// <param name="checkIn">Check-in date (YYYY-MM-DD)</param>
    /// <param name="checkOut">Check-out date (YYYY-MM-DD)</param>
    /// <param name="adults">Number of adults (default: 2)</param>
    /// <param name="rooms">Number of rooms (default: 1)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of hotels with price comparison from multiple providers</returns>
    [HttpGet("search")]
    public async Task<IActionResult> SearchAndCompare(
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

        _logger.LogInformation("Hotel comparison search for {Destination}, {CheckIn} to {CheckOut}",
            destination, checkIn, checkOut);

        var results = await _comparisonService.SearchAndCompareAsync(
            destination, checkIn, checkOut, adults, rooms, cancellationToken);

        // Calculate statistics
        var totalHotels = results.Count;
        var hotelsWithPrices = results.Count(h => h.LowestPrice.HasValue);
        var hotelsWithMultipleOffers = results.Count(h => h.Offers.Count > 1);

        // Get lowest and highest prices
        var hotelsWithPricesList = results.Where(h => h.LowestPrice.HasValue).ToList();
        var lowestPrice = hotelsWithPricesList.Any() ? hotelsWithPricesList.Min(h => h.LowestPrice) : null;
        var highestPrice = hotelsWithPricesList.Any() ? hotelsWithPricesList.Max(h => h.LowestPrice) : null;

        // Provider breakdown
        var providerStats = results
            .SelectMany(h => h.Offers)
            .GroupBy(o => o.Provider)
            .Select(g => new { provider = g.First().ProviderDisplayName, count = g.Count() })
            .ToList();

        return Ok(new
        {
            success = true,
            data = results,
            meta = new
            {
                totalHotels,
                hotelsWithPrices,
                hotelsWithMultipleOffers,
                priceRange = new { lowest = lowestPrice, highest = highestPrice },
                providers = providerStats
            },
            search = new { destination, checkIn, checkOut, adults, rooms }
        });
    }

    /// <summary>
    /// Get list of supported providers
    /// </summary>
    [HttpGet("providers")]
    public IActionResult GetProviders()
    {
        var providers = new[]
        {
            new { id = "booking", name = "Booking.com", logo = "https://cf.bstatic.com/static/img/favicon/favicon-32x32.png", color = "#003580" },
            new { id = "tripadvisor", name = "Tripadvisor", logo = "https://static.tacdn.com/img2/branding/rebrand/TA_logo_primary.png", color = "#00AF87" },
            new { id = "hotels.com", name = "Hotels.com", logo = "https://www.hotels.com/favicon.ico", color = "#D32F2F" },
            new { id = "priceline", name = "Priceline", logo = "https://www.priceline.com/favicon.ico", color = "#0066CC" },
            new { id = "amadeus", name = "Amadeus GDS", logo = "https://amadeus.com/favicon.ico", color = "#005EB8" },
        };

        return Ok(new { success = true, data = providers });
    }

    /// <summary>
    /// Get list of supported destinations for hotel comparison
    /// </summary>
    [HttpGet("destinations")]
    public IActionResult GetDestinations()
    {
        var destinations = new[]
        {
            new { nameAr = "لندن", nameEn = "London", country = "المملكة المتحدة", code = "LON" },
            new { nameAr = "دبي", nameEn = "Dubai", country = "الإمارات", code = "DXB" },
            new { nameAr = "إسطنبول", nameEn = "Istanbul", country = "تركيا", code = "IST" },
            new { nameAr = "باريس", nameEn = "Paris", country = "فرنسا", code = "PAR" },
            new { nameAr = "كوالالمبور", nameEn = "Kuala Lumpur", country = "ماليزيا", code = "KUL" },
            new { nameAr = "بانكوك", nameEn = "Bangkok", country = "تايلند", code = "BKK" },
            new { nameAr = "القاهرة", nameEn = "Cairo", country = "مصر", code = "CAI" },
            new { nameAr = "الرياض", nameEn = "Riyadh", country = "السعودية", code = "RUH" },
            new { nameAr = "جدة", nameEn = "Jeddah", country = "السعودية", code = "JED" },
            new { nameAr = "موسكو", nameEn = "Moscow", country = "روسيا", code = "MOW" },
            new { nameAr = "سنغافورة", nameEn = "Singapore", country = "سنغافورة", code = "SIN" },
            new { nameAr = "نيويورك", nameEn = "New York", country = "أمريكا", code = "NYC" },
        };

        return Ok(new { success = true, data = destinations });
    }
}

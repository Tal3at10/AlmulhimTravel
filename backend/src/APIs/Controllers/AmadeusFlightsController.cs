using Core.Application.Abstraction.DTOs.Amadeus;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers;

/// <summary>
/// Amadeus Flight Search API - Real-time flight data from Amadeus GDS
/// </summary>
[Route("api/amadeus/flights")]
public class AmadeusFlightsController : BaseApiController
{
    private readonly IDuffelService _duffelService;
    private readonly ILogger<AmadeusFlightsController> _logger;

    public AmadeusFlightsController(
        IDuffelService duffelService,
        ILogger<AmadeusFlightsController> logger)
    {
        _duffelService = duffelService;
        _logger = logger;
    }

    /// <summary>
    /// Search flights
    /// </summary>
    [HttpGet("search")]
    [ResponseCache(Duration = 300, VaryByQueryKeys = new[] { "origin", "destination", "departureDate", "returnDate", "adults", "travelClass" })]
    public async Task<IActionResult> Search(
        [FromQuery] string origin,
        [FromQuery] string destination,
        [FromQuery] string departureDate,
        [FromQuery] string? returnDate = null,
        [FromQuery] int adults = 1,
        [FromQuery] string travelClass = "ECONOMY",
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(origin) || string.IsNullOrEmpty(destination) || string.IsNullOrEmpty(departureDate))
        {
            return BadRequest(new { success = false, message = "origin, destination, and departureDate are required" });
        }

        _logger.LogInformation("Searching flights from {Origin} to {Destination} on {Date}",
            origin, destination, departureDate);

        var request = new FlightSearchRequest(
            Origin: origin.ToUpperInvariant(),
            Destination: destination.ToUpperInvariant(),
            DepartureDate: departureDate,
            ReturnDate: returnDate,
            Adults: adults,
            TravelClass: travelClass.ToUpperInvariant()
        );

        var flights = await _duffelService.SearchFlightsAsync(request, cancellationToken);

        // Add Profit Margin (50 SAR per adult ticket)
        decimal marginPerAdult = 50.0m;
        var modifiedFlights = flights.Select(f => f with { Price = f.Price + (marginPerAdult * adults) }).ToList();

        return Ok(new
        {
            success = true,
            data = modifiedFlights,
            count = modifiedFlights.Count,
            search = new
            {
                origin,
                destination,
                departureDate,
                returnDate,
                adults,
                travelClass
            }
        });
    }

    /// <summary>
    /// Get supported airports
    /// </summary>
    [HttpGet("airports")]
    [ResponseCache(Duration = 86400)]
    public IActionResult GetAirports()
    {
        var airports = new[]
        {
            // Saudi Arabia
            new { code = "RUH", nameAr = "مطار الملك خالد الدولي", nameEn = "King Khalid International", cityAr = "الرياض", cityEn = "Riyadh", country = "السعودية" },
            new { code = "JED", nameAr = "مطار الملك عبدالعزيز الدولي", nameEn = "King Abdulaziz International", cityAr = "جدة", cityEn = "Jeddah", country = "السعودية" },
            new { code = "DMM", nameAr = "مطار الملك فهد الدولي", nameEn = "King Fahd International", cityAr = "الدمام", cityEn = "Dammam", country = "السعودية" },
            
            // UAE
            new { code = "DXB", nameAr = "مطار دبي الدولي", nameEn = "Dubai International", cityAr = "دبي", cityEn = "Dubai", country = "الإمارات" },
            new { code = "AUH", nameAr = "مطار أبوظبي الدولي", nameEn = "Abu Dhabi International", cityAr = "أبوظبي", cityEn = "Abu Dhabi", country = "الإمارات" },
            
            // Turkey
            new { code = "IST", nameAr = "مطار إسطنبول", nameEn = "Istanbul Airport", cityAr = "إسطنبول", cityEn = "Istanbul", country = "تركيا" },
            new { code = "SAW", nameAr = "مطار صبيحة كوكجن", nameEn = "Sabiha Gokcen", cityAr = "إسطنبول", cityEn = "Istanbul", country = "تركيا" },
            
            // Europe
            new { code = "LHR", nameAr = "مطار هيثرو", nameEn = "Heathrow", cityAr = "لندن", cityEn = "London", country = "المملكة المتحدة" },
            new { code = "CDG", nameAr = "مطار شارل ديغول", nameEn = "Charles de Gaulle", cityAr = "باريس", cityEn = "Paris", country = "فرنسا" },
            new { code = "FCO", nameAr = "مطار فيوميتشينو", nameEn = "Fiumicino", cityAr = "روما", cityEn = "Rome", country = "إيطاليا" },
            new { code = "SVO", nameAr = "مطار شيريميتيفو", nameEn = "Sheremetyevo", cityAr = "موسكو", cityEn = "Moscow", country = "روسيا" },
            
            // Asia
            new { code = "KUL", nameAr = "مطار كوالالمبور الدولي", nameEn = "Kuala Lumpur International", cityAr = "كوالالمبور", cityEn = "Kuala Lumpur", country = "ماليزيا" },
            new { code = "SIN", nameAr = "مطار شانغي", nameEn = "Changi", cityAr = "سنغافورة", cityEn = "Singapore", country = "سنغافورة" },
            new { code = "BKK", nameAr = "مطار سوفارنابومي", nameEn = "Suvarnabhumi", cityAr = "بانكوك", cityEn = "Bangkok", country = "تايلند" },
            new { code = "SGN", nameAr = "مطار تان سون نهات", nameEn = "Tan Son Nhat", cityAr = "هو تشي منه", cityEn = "Ho Chi Minh", country = "فيتنام" },
            
            // Other
            new { code = "TBS", nameAr = "مطار تبليسي الدولي", nameEn = "Tbilisi International", cityAr = "تبليسي", cityEn = "Tbilisi", country = "جورجيا" },
            new { code = "MLE", nameAr = "مطار فيلانا الدولي", nameEn = "Velana International", cityAr = "ماليه", cityEn = "Male", country = "المالديف" },
            new { code = "CAI", nameAr = "مطار القاهرة الدولي", nameEn = "Cairo International", cityAr = "القاهرة", cityEn = "Cairo", country = "مصر" },
        };

        return Ok(new { success = true, data = airports });
    }

    /// <summary>
    /// Get travel classes
    /// </summary>
    [HttpGet("classes")]
    [ResponseCache(Duration = 86400)]
    public IActionResult GetTravelClasses()
    {
        var classes = new[]
        {
            new { code = "ECONOMY", nameAr = "اقتصادية", nameEn = "Economy" },
            new { code = "PREMIUM_ECONOMY", nameAr = "اقتصادية مميزة", nameEn = "Premium Economy" },
            new { code = "BUSINESS", nameAr = "رجال الأعمال", nameEn = "Business" },
            new { code = "FIRST", nameAr = "الدرجة الأولى", nameEn = "First Class" },
        };

        return Ok(new { success = true, data = classes });
    }

    /// <summary>
    /// Get raw offer from Duffel
    /// </summary>
    [HttpGet("offers/{id}")]
    public async Task<IActionResult> GetRawOffer(string id, CancellationToken cancellationToken = default)
    {
        var rawJson = await _duffelService.GetRawOfferAsync(id, cancellationToken);
        if (string.IsNullOrEmpty(rawJson))
        {
            return NotFound(new { success = false, message = "Offer not found" });
        }
        return Content(rawJson, "application/json");
    }

    /// <summary>
    /// Create Duffel Client Key for UI components
    /// </summary>
    [HttpPost("client-key")]
    public async Task<IActionResult> CreateClientKey(CancellationToken cancellationToken = default)
    {
        var rawJson = await _duffelService.CreateClientKeyAsync(cancellationToken);
        if (string.IsNullOrEmpty(rawJson))
        {
            return BadRequest(new { success = false, message = "Could not create client key" });
        }
        return Content(rawJson, "application/json");
    }
}

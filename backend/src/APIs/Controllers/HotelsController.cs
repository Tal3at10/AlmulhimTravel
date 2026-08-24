using Core.Application.Abstraction.DTOs.Hotels;
using Core.Application.Abstraction.Services;
using Infrastructure.Shared.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace APIs.Controllers;

[Route("api/[controller]")]
public class HotelsController : BaseApiController
{
    private readonly IHotelAggregatorService _aggregator;
    private readonly ILogger<HotelsController> _logger;

    public HotelsController(IHotelAggregatorService aggregator, ILogger<HotelsController> logger)
    {
        _aggregator = aggregator;
        _logger = logger;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string cityCode,
        [FromQuery] string checkIn,
        [FromQuery] string checkOut,
        [FromQuery] int adults = 2,
        [FromQuery] int rooms = 1,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(cityCode) || string.IsNullOrEmpty(checkIn) || string.IsNullOrEmpty(checkOut))
        {
            return BadRequest(new { success = false, message = "cityCode, checkIn, and checkOut are required" });
        }

        var query = new HotelSearchQuery
        {
            CityCode = cityCode.ToUpperInvariant(),
            CheckInDate = checkIn,
            CheckOutDate = checkOut,
            Adults = adults,
            Rooms = rooms
        };

        var hotels = await _aggregator.SearchAsync(query, cancellationToken);
        return Ok(new { success = true, data = hotels, count = hotels.Count });
    }

    [HttpGet("{hotelId}")]
    public async Task<IActionResult> GetDetails(
        string hotelId,
        [FromQuery] string provider = "Amadeus",
        [FromQuery] string? checkIn = null,
        [FromQuery] string? checkOut = null,
        [FromQuery] int adults = 2,
        [FromQuery] int rooms = 1,
        CancellationToken cancellationToken = default)
    {
        var query = new HotelSearchQuery
        {
            CheckInDate = checkIn ?? DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"),
            CheckOutDate = checkOut ?? DateTime.Now.AddDays(2).ToString("yyyy-MM-dd"),
            Adults = adults,
            Rooms = rooms
        };

        var details = await _aggregator.GetDetailsAsync(hotelId, provider, query, cancellationToken);
        if (details == null) return NotFound();

        return Ok(new { success = true, data = details });
    }

    [HttpGet("{hotelId}/rooms")]
    public async Task<IActionResult> GetRooms(
        string hotelId,
        [FromQuery] string provider = "Amadeus",
        [FromQuery] string? checkIn = null,
        [FromQuery] string? checkOut = null,
        [FromQuery] int adults = 2,
        [FromQuery] int rooms = 1,
        CancellationToken cancellationToken = default)
    {
        var query = new HotelSearchQuery
        {
            CheckInDate = checkIn ?? DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"),
            CheckOutDate = checkOut ?? DateTime.Now.AddDays(2).ToString("yyyy-MM-dd"),
            Adults = adults,
            Rooms = rooms
        };

        var roomTypes = await _aggregator.GetRoomsAsync(hotelId, provider, query, cancellationToken);
        return Ok(new { success = true, data = roomTypes });
    }

    [HttpPost("book")]
    public async Task<IActionResult> Book([FromBody] BookingRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _aggregator.CreateBookingAsync(request, cancellationToken);
            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Booking failed");
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpGet("destinations/popular")]
    public IActionResult GetPopularDestinations(CancellationToken cancellationToken)
    {
        // Mocking destinations for now, matching frontend requirements
        var cities = new[]
        {
            new { code = "TBS", nameAr = "تبليسي", nameEn = "Tbilisi", country = "جورجيا", image = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b" },
            new { code = "DXB", nameAr = "دبي", nameEn = "Dubai", country = "الإمارات", image = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c" },
            new { code = "IST", nameAr = "إسطنبول", nameEn = "Istanbul", country = "تركيا", image = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200" },
        };
        return Ok(new { success = true, data = cities });
    }
}

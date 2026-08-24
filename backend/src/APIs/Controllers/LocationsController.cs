using Microsoft.AspNetCore.Mvc;
using Core.Application.Abstraction.Services;

namespace APIs.Controllers;

/// <summary>
/// API for smart autocomplete search suggestions (flights and hotels)
/// </summary>
[Route("api/locations")]
public class LocationsController : BaseApiController
{
    private readonly ILocationsService _locationsService;
    private readonly ILogger<LocationsController> _logger;

    public LocationsController(
        ILocationsService locationsService,
        ILogger<LocationsController> logger)
    {
        _locationsService = locationsService;
        _logger = logger;
    }

    /// <summary>
    /// Search hotel destinations dynamically
    /// </summary>
    [HttpGet("hotels")]
    [ResponseCache(Duration = 3600, VaryByQueryKeys = new[] { "query" })]
    public async Task<IActionResult> SearchHotels([FromQuery] string query, CancellationToken cancellationToken)
    {
        var result = await _locationsService.SearchHotelsAsync(query, cancellationToken);
        return Ok(new { success = true, data = result });
    }

    /// <summary>
    /// Search airports and cities for flight offers
    /// </summary>
    [HttpGet("flights")]
    [ResponseCache(Duration = 3600, VaryByQueryKeys = new[] { "query" })]
    public async Task<IActionResult> SearchFlights([FromQuery] string query, CancellationToken cancellationToken)
    {
        var result = await _locationsService.SearchFlightsAsync(query, cancellationToken);
        return Ok(new { success = true, data = result });
    }
}

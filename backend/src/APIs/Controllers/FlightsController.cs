using Core.Application.Abstraction.DTOs.Aviation;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    public class FlightsController : BaseApiController
    {
        private readonly IServiceManager _serviceManager;

        public FlightsController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] FlightSearchQuery query, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Flights.SearchAsync(query, cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("{flightId}")]
        public async Task<IActionResult> GetById(Guid flightId, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Flights.GetByIdAsync(flightId, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpGet("airports/popular")]
        public async Task<IActionResult> GetPopularAirports(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Airports.GetPopularAsync(cancellationToken);
            return HandleResult(result);
        }
    }
}

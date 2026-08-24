using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    public class DestinationsController : BaseApiController
    {
        private readonly IServiceManager _serviceManager;

        public DestinationsController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet]
        [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Destinations.GetAllActiveAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("featured")]
        [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetFeatured(CancellationToken cancellationToken, [FromQuery] int count = 8)
        {
            var result = await _serviceManager.Destinations.GetFeaturedAsync(count, cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("{slug}")]
        [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any, VaryByQueryKeys = new[] { "slug" })]
        public async Task<IActionResult> GetBySlug(string slug, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Destinations.GetBySlugAsync(slug, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpGet("{destinationId}/videos")]
        public async Task<IActionResult> GetVideos(Guid destinationId, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.CustomerVideos.GetByDestinationIdAsync(destinationId, cancellationToken);
            return HandleResult(result);
        }
    }
}

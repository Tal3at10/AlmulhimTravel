using Core.Application.Abstraction.DTOs.Catalog;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    public class PackagesController : BaseApiController
    {
        private readonly IServiceManager _serviceManager;

        public PackagesController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet("featured")]
        [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetFeatured(CancellationToken cancellationToken, [FromQuery] int count = 10)
        {
            var result = await _serviceManager.Packages.GetFeaturedAsync(count, cancellationToken);
            return HandleResult(result);
        }

        [HttpGet]
        [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetAll([FromQuery] PackageSearchQuery query, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.SearchAsync(query, cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("{packageId}")]
        public async Task<IActionResult> GetById(string packageId, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.GetByPackageIdAsync(packageId, cancellationToken);
            return HandleNotFoundResult(result);
        }
    }
}

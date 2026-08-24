using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    public class CmsController : BaseApiController
    {
        private readonly IServiceManager _serviceManager;

        public CmsController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet("hero-slides")]
        public async Task<IActionResult> GetHeroSlides(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.HeroSlides.GetAllActiveAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("testimonials")]
        public async Task<IActionResult> GetTestimonials(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Testimonials.GetAllActiveAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("partners")]
        public async Task<IActionResult> GetPartners(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Partners.GetAllActiveAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("board-members")]
        public async Task<IActionResult> GetBoardMembers(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BoardMembers.GetAllAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("settings/{key}")]
        public async Task<IActionResult> GetSetting(string key, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.CompanySettings.GetByKeyAsync(key, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpGet("customer-videos")]
        public async Task<IActionResult> GetCustomerVideos([FromQuery] string? destination, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(destination))
            {
                var result = await _serviceManager.CustomerVideos.GetAllActiveAsync(cancellationToken);
                return HandleResult(result);
            }
            else
            {
                var destResult = await _serviceManager.Destinations.GetBySlugAsync(destination, cancellationToken);
                if (!destResult.IsSuccess)
                    return HandleNotFoundResult(destResult);

                var result = await _serviceManager.CustomerVideos.GetByDestinationIdAsync(destResult.Data!.Id, cancellationToken);
                return HandleResult(result);
            }
        }
    }
}

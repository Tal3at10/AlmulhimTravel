using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    public class BlogPostsController : BaseApiController
    {
        private readonly IServiceManager _serviceManager;

        public BlogPostsController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetPublishedBlogPosts(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BlogPosts.GetPublishedBlogPostsAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBlogPostBySlug(string slug, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BlogPosts.GetBySlugAsync(slug, cancellationToken);
            return HandleNotFoundResult(result);
        }
    }
}

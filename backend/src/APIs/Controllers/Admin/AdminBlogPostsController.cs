using Core.Application.Abstraction.DTOs.Content;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers.Admin
{
    public class AdminBlogPostsController : AdminBaseController
    {
        private readonly IServiceManager _serviceManager;

        public AdminBlogPostsController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BlogPosts.GetAllAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BlogPosts.GetByIdAsync(id, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateBlogPostDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BlogPosts.CreateAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateBlogPostDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BlogPosts.UpdateAsync(id, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BlogPosts.DeleteAsync(id, cancellationToken);
            return HandleResult(result);
        }
    }
}

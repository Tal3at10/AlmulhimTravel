using Core.Application.Abstraction.DTOs.Catalog;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers.Admin
{
    /// <summary>
    /// Admin Destinations Controller
    /// Full CRUD for managing travel destinations
    /// </summary>
    public class AdminDestinationsController : AdminBaseController
    {
        private readonly IServiceManager _serviceManager;

        public AdminDestinationsController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Destinations.GetAllActiveAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Destinations.GetByIdAsync(id, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDestinationDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Destinations.CreateAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDestinationDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Destinations.UpdateAsync(id, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Destinations.DeleteAsync(id, cancellationToken);
            return HandleResult(result);
        }
    }
}

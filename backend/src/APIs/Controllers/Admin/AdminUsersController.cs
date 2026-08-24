using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers.Admin
{
    /// <summary>
    /// Admin Users Controller
    /// Manage users and their accounts
    /// </summary>
    public class AdminUsersController : AdminBaseController
    {
        private readonly IServiceManager _serviceManager;

        public AdminUsersController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Users.GetAllAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Users.GetByIdAsync(id, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpPut("{id}/toggle-active")]
        public async Task<IActionResult> ToggleActive(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Users.DeactivateAccountAsync(id, cancellationToken);
            return HandleResult(result);
        }
    }
}

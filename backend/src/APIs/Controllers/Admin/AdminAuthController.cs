using Core.Application.Abstraction.DTOs.Identity;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers.Admin
{
    /// <summary>
    /// Admin Authentication Controller
    /// Handles admin login (separate from public login)
    /// </summary>
    [Route("api/admin/auth")]
    [ApiController]
    public class AdminAuthController : BaseApiController
    {
        private readonly IServiceManager _serviceManager;

        public AdminAuthController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        /// <summary>
        /// Admin Login - Only users with Role = "Admin" can login
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Auth.AdminLoginAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        /// <summary>
        /// Verify admin token - Check if current admin session is valid
        /// </summary>
        [HttpGet("verify")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> VerifyToken(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _serviceManager.Users.GetByIdAsync(userId, cancellationToken);
            return HandleResult(result);
        }
    }
}

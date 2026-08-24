using Core.Application.Abstraction.DTOs.Identity;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    [EnableRateLimiting("AuthLimiter")]
    public class AuthController : BaseApiController
    {
        private readonly IServiceManager _serviceManager;

        public AuthController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Auth.RegisterAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Auth.LoginAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Auth.RefreshTokenAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _serviceManager.Auth.LogoutAsync(userId, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _serviceManager.Auth.ChangePasswordAndRevokeAllSessionsAsync(userId, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] string email, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Auth.GeneratePasswordResetTokenAsync(email, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Auth.ResetPasswordAsync(dto, cancellationToken);
            return HandleResult(result);
        }
    }
}


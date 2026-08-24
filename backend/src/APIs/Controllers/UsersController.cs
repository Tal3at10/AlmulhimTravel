using Core.Application.Abstraction.DTOs.Identity;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    [Authorize] // All endpoints require authentication
    public class UsersController : BaseApiController
    {
        private readonly IServiceManager _serviceManager;

        public UsersController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _serviceManager.Users.GetByIdAsync(userId, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _serviceManager.Users.UpdateProfileAsync(userId, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _serviceManager.Users.ChangePasswordAsync(userId, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("favorites")]
        public async Task<IActionResult> GetFavorites(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _serviceManager.UserFavorites.GetUserFavoritesAsync(userId, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("favorites")]
        public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteDto dto, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _serviceManager.UserFavorites.AddFavoriteAsync(userId, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpDelete("favorites/{favoriteId}")]
        public async Task<IActionResult> RemoveFavorite(Guid favoriteId, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _serviceManager.UserFavorites.RemoveFavoriteAsync(userId, favoriteId, cancellationToken);
            return HandleResult(result);
        }
    }
}

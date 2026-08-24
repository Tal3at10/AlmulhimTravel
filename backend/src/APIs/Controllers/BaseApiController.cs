using Core.Application.Abstraction.DTOs.Common;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace APIs.Controllers
{
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        protected IActionResult HandleResult<T>(Result<T> result)
        {
            if (result.IsSuccess)
                return Ok(result);

            return BadRequest(new { errors = result.Errors, message = result.Message });
        }

        protected IActionResult HandleResult(Result result)
        {
            if (result.IsSuccess)
                return Ok(new { message = result.Message });

            return BadRequest(new { errors = result.Errors, message = result.Message });
        }

        protected IActionResult HandleNotFoundResult<T>(Result<T> result)
        {
            if (result.IsSuccess)
                return Ok(result.Data);

            return NotFound(new { errors = result.Errors, message = result.Message });
        }

        /// <summary>
        /// Get current user ID from JWT token claims
        /// </summary>
        protected Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                throw new UnauthorizedAccessException("Invalid user token");
            
            return userId;
        }

        /// <summary>
        /// Get current user ID from JWT token claims (returns null if not authenticated)
        /// </summary>
        protected Guid? GetCurrentUserIdOrNull()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return null;
            
            return userId;
        }
    }
}

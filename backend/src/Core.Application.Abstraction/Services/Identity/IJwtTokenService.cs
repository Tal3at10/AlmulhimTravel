using System.Security.Claims;
using Core.Domain.Entities.Identity;

namespace Core.Application.Abstraction.Services.Identity
{
    /// <summary>
    /// JWT Token Service Interface
    /// Handles token generation, validation, and claims extraction
    /// </summary>
    public interface IJwtTokenService
    {
        /// <summary>
        /// Generate JWT access token for user
        /// </summary>
        string GenerateAccessToken(User user);

        /// <summary>
        /// Generate refresh token
        /// </summary>
        string GenerateRefreshToken();

        /// <summary>
        /// Validate JWT token and extract claims
        /// </summary>
        ClaimsPrincipal? ValidateToken(string token);

        /// <summary>
        /// Extract user ID from token claims
        /// </summary>
        Guid? GetUserIdFromToken(string token);

        /// <summary>
        /// Check if token is expired
        /// </summary>
        bool IsTokenExpired(string token);
    }
}

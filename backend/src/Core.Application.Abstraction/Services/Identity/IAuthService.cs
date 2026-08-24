using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Identity;

namespace Core.Application.Abstraction.Services.Identity
{
    public interface IAuthService
    {
        Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default);
        Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default);
        Task<Result<AuthResponseDto>> AdminLoginAsync(LoginDto dto, CancellationToken cancellationToken = default);
        Task<Result<AuthResponseDto>> RefreshTokenAsync(RefreshTokenDto dto, CancellationToken cancellationToken = default);
        Task<Result> LogoutAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<Result> ChangePasswordAndRevokeAllSessionsAsync(Guid userId, ChangePasswordDto dto, CancellationToken cancellationToken = default);
        Task<Result<string>> GeneratePasswordResetTokenAsync(string email, CancellationToken cancellationToken = default);
        Task<Result> ResetPasswordAsync(ResetPasswordDto dto, CancellationToken cancellationToken = default);
    }
}

using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Identity;

namespace Core.Application.Abstraction.Services.Identity
{
    public interface IUserService
    {
        Task<Result<List<UserDto>>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Result<UserDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<UserDto>> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
        Task<Result<UserDto>> UpdateProfileAsync(Guid id, UpdateProfileDto dto, CancellationToken cancellationToken = default);
        Task<Result> ChangePasswordAsync(Guid id, ChangePasswordDto dto, CancellationToken cancellationToken = default);
        Task<Result> DeactivateAccountAsync(Guid id, CancellationToken cancellationToken = default);
    }
}

using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Identity;

namespace Core.Application.Abstraction.Services.Identity
{
    public interface IUserFavoriteService
    {
        Task<Result<List<UserFavoriteDto>>> GetUserFavoritesAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<Result<UserFavoriteDto>> AddFavoriteAsync(Guid userId, AddFavoriteDto dto, CancellationToken cancellationToken = default);
        Task<Result> RemoveFavoriteAsync(Guid userId, Guid favoriteId, CancellationToken cancellationToken = default);
        Task<Result<bool>> IsFavoriteAsync(Guid userId, Guid itemId, CancellationToken cancellationToken = default);
    }
}

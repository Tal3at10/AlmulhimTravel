using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;

namespace Core.Application.Abstraction.Services.Content
{
    public interface IHeroSlideService
    {
        Task<Result<List<HeroSlideDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default);
        Task<Result<HeroSlideDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<HeroSlideDto>> CreateAsync(CreateHeroSlideDto dto, CancellationToken cancellationToken = default);
        Task<Result<HeroSlideDto>> UpdateAsync(Guid id, CreateHeroSlideDto dto, CancellationToken cancellationToken = default);
        Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result> ReorderAsync(Dictionary<Guid, int> sortOrders, CancellationToken cancellationToken = default);
    }
}

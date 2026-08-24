using Core.Application.Abstraction.DTOs.Catalog;
using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.Services.Catalog
{
    public interface IDestinationService
    {
        Task<Result<List<DestinationListDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default);
        Task<Result<List<DestinationListDto>>> GetFeaturedAsync(int count = 8, CancellationToken cancellationToken = default);
        Task<Result<DestinationDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<DestinationDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
        Task<Result<DestinationDto>> CreateAsync(CreateDestinationDto dto, CancellationToken cancellationToken = default);
        Task<Result<DestinationDto>> UpdateAsync(Guid id, UpdateDestinationDto dto, CancellationToken cancellationToken = default);
        Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}

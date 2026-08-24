using Core.Application.Abstraction.DTOs.Accommodation;
using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.Services.Accommodation
{
    public interface IAmenityService
    {
        Task<Result<List<AmenityDto>>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Result<AmenityDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    }
}

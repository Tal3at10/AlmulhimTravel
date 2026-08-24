using Core.Application.Abstraction.DTOs.Accommodation;
using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.Services.Accommodation
{
    public interface ICityService
    {
        Task<Result<List<CityListDto>>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Result<CityDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<List<string>>> GetPopularCitiesAsync(CancellationToken cancellationToken = default);
    }
}

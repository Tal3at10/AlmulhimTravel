using Core.Application.Abstraction.DTOs.Aviation;
using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.Services.Aviation
{
    public interface IAirlineService
    {
        Task<Result<List<AirlineDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default);
        Task<Result<AirlineDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<AirlineDto>> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
    }
}

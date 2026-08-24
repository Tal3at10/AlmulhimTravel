using Core.Application.Abstraction.DTOs.Aviation;
using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.Services.Aviation
{
    public interface IAirportService
    {
        Task<Result<List<AirportDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default);
        Task<Result<List<AirportDto>>> GetPopularAsync(CancellationToken cancellationToken = default);
        Task<Result<AirportDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<AirportDto>> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
        Task<Result<List<AirportDto>>> SearchAsync(string query, CancellationToken cancellationToken = default);
    }
}

using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;

namespace Core.Application.Abstraction.Services.Content
{
    public interface IPartnerService
    {
        Task<Result<List<PartnerDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default);
        Task<Result<PartnerDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<PartnerDto>> CreateAsync(CreatePartnerDto dto, CancellationToken cancellationToken = default);
        Task<Result<PartnerDto>> UpdateAsync(Guid id, CreatePartnerDto dto, CancellationToken cancellationToken = default);
        Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}

using Core.Application.Abstraction.DTOs.Catalog;
using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.Services.Catalog
{
    public interface ICustomerVideoService
    {
        Task<Result<List<CustomerVideoDto>>> GetByDestinationIdAsync(Guid destinationId, CancellationToken cancellationToken = default);
        Task<Result<List<CustomerVideoDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default);
        Task<Result<CustomerVideoDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<CustomerVideoDto>> CreateAsync(CreateCustomerVideoDto dto, CancellationToken cancellationToken = default);
        Task<Result<CustomerVideoDto>> UpdateAsync(Guid id, UpdateCustomerVideoDto dto, CancellationToken cancellationToken = default);
        Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}

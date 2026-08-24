using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;

namespace Core.Application.Abstraction.Services.Content
{
    public interface ITestimonialService
    {
        Task<Result<List<TestimonialDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default);
        Task<Result<TestimonialDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<TestimonialDto>> CreateAsync(CreateTestimonialDto dto, CancellationToken cancellationToken = default);
        Task<Result<TestimonialDto>> UpdateAsync(Guid id, CreateTestimonialDto dto, CancellationToken cancellationToken = default);
        Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}

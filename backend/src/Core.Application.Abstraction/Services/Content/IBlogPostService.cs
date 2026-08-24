using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;

namespace Core.Application.Abstraction.Services.Content
{
    public interface IBlogPostService
    {
        Task<Result<List<BlogPostDto>>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Result<List<BlogPostDto>>> GetPublishedBlogPostsAsync(CancellationToken cancellationToken = default);
        Task<Result<BlogPostDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<BlogPostDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
        Task<Result<BlogPostDto>> CreateAsync(CreateBlogPostDto dto, CancellationToken cancellationToken = default);
        Task<Result<BlogPostDto>> UpdateAsync(Guid id, UpdateBlogPostDto dto, CancellationToken cancellationToken = default);
        Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}

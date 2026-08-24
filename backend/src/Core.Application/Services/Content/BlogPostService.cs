using AutoMapper;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Content;
using Core.Domain.Entities.Content;

namespace Core.Application.Services.Content
{
    public class BlogPostService : IBlogPostService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BlogPostService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<BlogPostDto>>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var posts = await _unitOfWork.BlogPosts.GetAllAsync(cancellationToken);
                var sortedPosts = posts.OrderByDescending(p => p.CreatedAt).ToList();
                var postDtos = _mapper.Map<List<BlogPostDto>>(sortedPosts);
                return Result<List<BlogPostDto>>.Success(postDtos);
            }
            catch (Exception ex)
            {
                return Result<List<BlogPostDto>>.Failure($"Error retrieving blog posts: {ex.Message}");
            }
        }

        public async Task<Result<List<BlogPostDto>>> GetPublishedBlogPostsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var posts = await _unitOfWork.BlogPosts.FindAllAsync(p => p.IsPublished, cancellationToken);
                var sortedPosts = posts.OrderByDescending(p => p.CreatedAt).ToList();
                var postDtos = _mapper.Map<List<BlogPostDto>>(sortedPosts);
                return Result<List<BlogPostDto>>.Success(postDtos);
            }
            catch (Exception ex)
            {
                return Result<List<BlogPostDto>>.Failure($"Error retrieving published blog posts: {ex.Message}");
            }
        }

        public async Task<Result<BlogPostDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var post = await _unitOfWork.BlogPosts.GetByIdAsync(id, cancellationToken);
                if (post == null)
                    return Result<BlogPostDto>.Failure("Blog post not found");

                var postDto = _mapper.Map<BlogPostDto>(post);
                return Result<BlogPostDto>.Success(postDto);
            }
            catch (Exception ex)
            {
                return Result<BlogPostDto>.Failure($"Error retrieving blog post: {ex.Message}");
            }
        }

        public async Task<Result<BlogPostDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        {
            try
            {
                var post = await _unitOfWork.BlogPosts.FindAsync(p => p.Slug == slug, cancellationToken);
                if (post == null)
                    return Result<BlogPostDto>.Failure("Blog post not found");

                var postDto = _mapper.Map<BlogPostDto>(post);
                return Result<BlogPostDto>.Success(postDto);
            }
            catch (Exception ex)
            {
                return Result<BlogPostDto>.Failure($"Error retrieving blog post by slug: {ex.Message}");
            }
        }

        public async Task<Result<BlogPostDto>> CreateAsync(CreateBlogPostDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var existingPost = await _unitOfWork.BlogPosts.FindAsync(p => p.Slug == dto.Slug, cancellationToken);
                if (existingPost != null)
                {
                    return Result<BlogPostDto>.Failure("A blog post with this slug already exists.");
                }

                var post = _mapper.Map<BlogPost>(dto);
                post.Id = Guid.NewGuid();
                post.CreatedAt = DateTime.UtcNow;
                post.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.BlogPosts.AddAsync(post, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var postDto = _mapper.Map<BlogPostDto>(post);
                return Result<BlogPostDto>.Success(postDto, "Blog post created successfully");
            }
            catch (Exception ex)
            {
                return Result<BlogPostDto>.Failure($"Error creating blog post: {ex.Message}");
            }
        }

        public async Task<Result<BlogPostDto>> UpdateAsync(Guid id, UpdateBlogPostDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var post = await _unitOfWork.BlogPosts.GetByIdAsync(id, cancellationToken);
                if (post == null)
                    return Result<BlogPostDto>.Failure("Blog post not found");

                var existingSlug = await _unitOfWork.BlogPosts.FindAsync(p => p.Slug == dto.Slug && p.Id != id, cancellationToken);
                if (existingSlug != null)
                {
                    return Result<BlogPostDto>.Failure("A blog post with this slug already exists.");
                }

                _mapper.Map(dto, post);
                post.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.BlogPosts.Update(post);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var postDto = _mapper.Map<BlogPostDto>(post);
                return Result<BlogPostDto>.Success(postDto, "Blog post updated successfully");
            }
            catch (Exception ex)
            {
                return Result<BlogPostDto>.Failure($"Error updating blog post: {ex.Message}");
            }
        }

        public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var post = await _unitOfWork.BlogPosts.GetByIdAsync(id, cancellationToken);
                if (post == null)
                    return Result.Failure("Blog post not found");

                _unitOfWork.BlogPosts.Delete(post);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("Blog post deleted successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting blog post: {ex.Message}");
            }
        }
    }
}

using AutoMapper;
using Core.Application.Abstraction.DTOs.Catalog;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Catalog;
using Core.Domain.Entities.Catalog;

namespace Core.Application.Services.Catalog
{
    public class CustomerVideoService : ICustomerVideoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CustomerVideoService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<CustomerVideoDto>>> GetByDestinationIdAsync(Guid destinationId, CancellationToken cancellationToken = default)
        {
            try
            {
                var videos = await _unitOfWork.CustomerVideos
                    .FindAllAsync(v => v.DestinationId == destinationId && v.IsActive, cancellationToken);

                // Handle null or empty result
                if (videos == null)
                {
                    return Result<List<CustomerVideoDto>>.Success(new List<CustomerVideoDto>());
                }

                var sortedVideos = videos.OrderBy(v => v.SortOrder).ToList();
                
                // Manual mapping to avoid AutoMapper null issues
                var videoDtos = sortedVideos.Select(v => new CustomerVideoDto
                {
                    Id = v.Id,
                    VideoUrl = v.VideoUrl ?? string.Empty,
                    ThumbnailUrl = v.ThumbnailUrl,
                    CustomerName = v.CustomerName ?? string.Empty,
                    Location = v.Location,
                    Date = v.Date,
                    DestinationId = v.DestinationId,
                    SortOrder = v.SortOrder,
                    IsActive = v.IsActive
                }).ToList();
                
                return Result<List<CustomerVideoDto>>.Success(videoDtos);
            }
            catch (Exception ex)
            {
                return Result<List<CustomerVideoDto>>.Failure($"Error retrieving customer videos: {ex.Message}");
            }
        }

        public async Task<Result<List<CustomerVideoDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var videos = await _unitOfWork.CustomerVideos
                    .FindAllAsync(v => v.IsActive, cancellationToken);

                // Handle null or empty result
                if (videos == null)
                {
                    return Result<List<CustomerVideoDto>>.Success(new List<CustomerVideoDto>());
                }

                var sortedVideos = videos.OrderBy(v => v.SortOrder).ToList();
                
                // Manual mapping to avoid AutoMapper null issues
                var videoDtos = sortedVideos.Select(v => new CustomerVideoDto
                {
                    Id = v.Id,
                    VideoUrl = v.VideoUrl ?? string.Empty,
                    ThumbnailUrl = v.ThumbnailUrl,
                    CustomerName = v.CustomerName ?? string.Empty,
                    Location = v.Location,
                    Date = v.Date,
                    DestinationId = v.DestinationId,
                    SortOrder = v.SortOrder,
                    IsActive = v.IsActive
                }).ToList();
                
                return Result<List<CustomerVideoDto>>.Success(videoDtos);
            }
            catch (Exception ex)
            {
                return Result<List<CustomerVideoDto>>.Failure($"Error retrieving customer videos: {ex.Message}");
            }
        }

        public async Task<Result<CustomerVideoDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var video = await _unitOfWork.CustomerVideos.GetByIdAsync(id, cancellationToken);

                if (video == null)
                    return Result<CustomerVideoDto>.Failure("Customer video not found");

                // Manual mapping to avoid AutoMapper null issues
                var videoDto = new CustomerVideoDto
                {
                    Id = video.Id,
                    VideoUrl = video.VideoUrl ?? string.Empty,
                    ThumbnailUrl = video.ThumbnailUrl,
                    CustomerName = video.CustomerName ?? string.Empty,
                    Location = video.Location,
                    Date = video.Date,
                    DestinationId = video.DestinationId,
                    SortOrder = video.SortOrder,
                    IsActive = video.IsActive
                };
                return Result<CustomerVideoDto>.Success(videoDto);
            }
            catch (Exception ex)
            {
                return Result<CustomerVideoDto>.Failure($"Error retrieving customer video: {ex.Message}");
            }
        }

        public async Task<Result<CustomerVideoDto>> CreateAsync(CreateCustomerVideoDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                // Verify destination exists
                var destinationExists = await _unitOfWork.Destinations.ExistsAsync(dto.DestinationId, cancellationToken);
                if (!destinationExists)
                    return Result<CustomerVideoDto>.Failure("Destination not found");

                // Manual mapping to avoid AutoMapper issues
                var video = new CustomerVideo
                {
                    Id = Guid.NewGuid(),
                    VideoUrl = dto.VideoUrl ?? string.Empty,
                    ThumbnailUrl = dto.ThumbnailUrl,
                    CustomerName = dto.CustomerName ?? string.Empty,
                    Location = dto.Location,
                    Date = dto.Date,
                    DestinationId = dto.DestinationId,
                    SortOrder = dto.SortOrder,
                    IsActive = true
                };

                await _unitOfWork.CustomerVideos.AddAsync(video, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var videoDto = new CustomerVideoDto
                {
                    Id = video.Id,
                    VideoUrl = video.VideoUrl,
                    ThumbnailUrl = video.ThumbnailUrl,
                    CustomerName = video.CustomerName,
                    Location = video.Location,
                    Date = video.Date,
                    DestinationId = video.DestinationId,
                    SortOrder = video.SortOrder,
                    IsActive = video.IsActive
                };
                return Result<CustomerVideoDto>.Success(videoDto, "Customer video created successfully");
            }
            catch (Exception ex)
            {
                return Result<CustomerVideoDto>.Failure($"Error creating customer video: {ex.Message}");
            }
        }

        public async Task<Result<CustomerVideoDto>> UpdateAsync(Guid id, UpdateCustomerVideoDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var video = await _unitOfWork.CustomerVideos.GetByIdAsync(id, cancellationToken);

                if (video == null)
                    return Result<CustomerVideoDto>.Failure("Customer video not found");

                // Verify destination exists if changed
                if (video.DestinationId != dto.DestinationId)
                {
                    var destinationExists = await _unitOfWork.Destinations.ExistsAsync(dto.DestinationId, cancellationToken);
                    if (!destinationExists)
                        return Result<CustomerVideoDto>.Failure("Destination not found");
                }

                // Manual mapping to avoid AutoMapper issues
                video.VideoUrl = dto.VideoUrl ?? string.Empty;
                video.ThumbnailUrl = dto.ThumbnailUrl;
                video.CustomerName = dto.CustomerName ?? string.Empty;
                video.Location = dto.Location;
                video.Date = dto.Date;
                video.DestinationId = dto.DestinationId;
                video.SortOrder = dto.SortOrder;

                _unitOfWork.CustomerVideos.Update(video);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var videoDto = new CustomerVideoDto
                {
                    Id = video.Id,
                    VideoUrl = video.VideoUrl,
                    ThumbnailUrl = video.ThumbnailUrl,
                    CustomerName = video.CustomerName,
                    Location = video.Location,
                    Date = video.Date,
                    DestinationId = video.DestinationId,
                    SortOrder = video.SortOrder,
                    IsActive = video.IsActive
                };
                return Result<CustomerVideoDto>.Success(videoDto, "Customer video updated successfully");
            }
            catch (Exception ex)
            {
                return Result<CustomerVideoDto>.Failure($"Error updating customer video: {ex.Message}");
            }
        }

        public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var video = await _unitOfWork.CustomerVideos.GetByIdAsync(id, cancellationToken);

                if (video == null)
                    return Result.Failure("Customer video not found");

                _unitOfWork.CustomerVideos.Delete(video);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("Customer video deleted successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting customer video: {ex.Message}");
            }
        }
    }
}

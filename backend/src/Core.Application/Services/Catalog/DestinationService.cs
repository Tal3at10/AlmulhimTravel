using AutoMapper;
using Core.Application.Abstraction.DTOs.Catalog;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Catalog;
using Core.Domain.Entities.Catalog;

namespace Core.Application.Services.Catalog
{
    public class DestinationService : IDestinationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DestinationService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<DestinationListDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var destinations = await _unitOfWork.Destinations
                    .FindAllAsync(d => d.IsActive, d => d.Packages);

                var sortedDestinations = destinations.OrderBy(d => d.SortOrder).ToList();
                var destinationDtos = _mapper.Map<List<DestinationListDto>>(sortedDestinations);
                
                return Result<List<DestinationListDto>>.Success(destinationDtos);
            }
            catch (Exception ex)
            {
                return Result<List<DestinationListDto>>.Failure($"Error retrieving destinations: {ex.Message}");
            }
        }

        public async Task<Result<List<DestinationListDto>>> GetFeaturedAsync(int count = 8, CancellationToken cancellationToken = default)
        {
            try
            {
                var destinations = await _unitOfWork.Destinations
                    .FindAllAsync(d => d.IsActive && d.IsFeatured, d => d.Packages);

                var sortedDestinations = destinations.OrderBy(d => d.FeaturedOrder).Take(count).ToList();
                var destinationDtos = _mapper.Map<List<DestinationListDto>>(sortedDestinations);
                
                return Result<List<DestinationListDto>>.Success(destinationDtos);
            }
            catch (Exception ex)
            {
                return Result<List<DestinationListDto>>.Failure($"Error retrieving featured destinations: {ex.Message}");
            }
        }

        public async Task<Result<DestinationDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var destination = await _unitOfWork.Destinations.GetByIdAsync(
                    id,
                    d => d.Packages,
                    d => d.Hotels,
                    d => d.CustomerVideos
                );

                if (destination == null)
                    return Result<DestinationDto>.Failure("Destination not found");

                var destinationDto = _mapper.Map<DestinationDto>(destination);
                return Result<DestinationDto>.Success(destinationDto);
            }
            catch (Exception ex)
            {
                return Result<DestinationDto>.Failure($"Error retrieving destination: {ex.Message}");
            }
        }

        public async Task<Result<DestinationDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        {
            try
            {
                var destination = await _unitOfWork.Destinations.FindAsync(
                    d => d.Slug == slug && d.IsActive,
                    d => d.Packages,
                    d => d.Hotels,
                    d => d.CustomerVideos
                );

                if (destination == null)
                    return Result<DestinationDto>.Failure($"Destination with slug '{slug}' not found");

                var destinationDto = _mapper.Map<DestinationDto>(destination);
                return Result<DestinationDto>.Success(destinationDto);
            }
            catch (Exception ex)
            {
                return Result<DestinationDto>.Failure($"Error retrieving destination: {ex.Message}");
            }
        }

        public async Task<Result<DestinationDto>> CreateAsync(CreateDestinationDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                // Check if slug already exists
                var existingDestination = await _unitOfWork.Destinations
                    .FindAsync(d => d.Slug == dto.Slug, cancellationToken);

                if (existingDestination != null)
                    return Result<DestinationDto>.Failure($"Destination with slug '{dto.Slug}' already exists");

                var destination = _mapper.Map<Destination>(dto);
                destination.Id = Guid.NewGuid();
                destination.IsActive = true;

                await _unitOfWork.Destinations.AddAsync(destination, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var destinationDto = _mapper.Map<DestinationDto>(destination);
                return Result<DestinationDto>.Success(destinationDto, "Destination created successfully");
            }
            catch (Exception ex)
            {
                return Result<DestinationDto>.Failure($"Error creating destination: {ex.Message}");
            }
        }

        public async Task<Result<DestinationDto>> UpdateAsync(Guid id, UpdateDestinationDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var destination = await _unitOfWork.Destinations.GetByIdAsync(id, cancellationToken);

                if (destination == null)
                    return Result<DestinationDto>.Failure("Destination not found");

                // Check if new slug conflicts with another destination
                if (destination.Slug != dto.Slug)
                {
                    var existingDestination = await _unitOfWork.Destinations
                        .FindAsync(d => d.Slug == dto.Slug && d.Id != id, cancellationToken);

                    if (existingDestination != null)
                        return Result<DestinationDto>.Failure($"Destination with slug '{dto.Slug}' already exists");
                }

                _mapper.Map(dto, destination);
                _unitOfWork.Destinations.Update(destination);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var destinationDto = _mapper.Map<DestinationDto>(destination);
                return Result<DestinationDto>.Success(destinationDto, "Destination updated successfully");
            }
            catch (Exception ex)
            {
                return Result<DestinationDto>.Failure($"Error updating destination: {ex.Message}");
            }
        }

        public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var destination = await _unitOfWork.Destinations.GetByIdAsync(id, cancellationToken);

                if (destination == null)
                    return Result.Failure("Destination not found");

                // Soft delete - just mark as inactive
                destination.IsActive = false;
                _unitOfWork.Destinations.Update(destination);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("Destination deleted successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting destination: {ex.Message}");
            }
        }
    }
}

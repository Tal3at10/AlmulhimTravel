using AutoMapper;
using Core.Application.Abstraction.DTOs.Catalog;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Catalog;
using Core.Domain.Entities.Catalog;
using Microsoft.EntityFrameworkCore;

namespace Core.Application.Services.Catalog
{
    public class PackageService : IPackageService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PackageService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<PackageCardDto>>> GetFeaturedAsync(int count = 6, CancellationToken cancellationToken = default)
        {
            try
            {
                var packages = await _unitOfWork.Packages.FindAllAsync(
                    p => p.IsActive && p.IsFeatured,
                    p => p.Destination,
                    p => p.Features,
                    p => p.Itineraries
                );

                var featuredPackages = packages
                    .OrderBy(p => p.FeaturedOrder)
                    .Take(count)
                    .ToList();

                var packageDtos = _mapper.Map<List<PackageCardDto>>(featuredPackages);
                return Result<List<PackageCardDto>>.Success(packageDtos);
            }
            catch (Exception ex)
            {
                return Result<List<PackageCardDto>>.Failure($"Error retrieving featured packages: {ex.Message}");
            }
        }

        public async Task<Result<PaginatedResult<PackageCardDto>>> SearchAsync(PackageSearchQuery query, CancellationToken cancellationToken = default)
        {
            try
            {
                // Start with active packages
                var packagesQuery = _unitOfWork.Packages.Query(p => p.IsActive)
                    .Include(p => p.Destination)
                    .Include(p => p.Features)
                    .AsNoTracking();

                // Filter by destination slug
                if (!string.IsNullOrEmpty(query.DestinationSlug))
                {
                    var destination = await _unitOfWork.Destinations
                        .FindAsync(d => d.Slug == query.DestinationSlug && d.IsActive, cancellationToken);

                    if (destination != null)
                    {
                        packagesQuery = packagesQuery.Where(p => p.DestinationId == destination.Id);
                    }
                }

                // Filter by offer status
                if (query.IsOffer.HasValue)
                {
                    packagesQuery = packagesQuery.Where(p => p.IsOffer == query.IsOffer.Value);
                }

                // Filter by price range
                if (query.MinPrice.HasValue)
                {
                    packagesQuery = packagesQuery.Where(p => p.Price >= query.MinPrice.Value);
                }

                if (query.MaxPrice.HasValue)
                {
                    packagesQuery = packagesQuery.Where(p => p.Price <= query.MaxPrice.Value);
                }

                // Apply sorting
                packagesQuery = query.SortBy?.ToLower() switch
                {
                    "price" => packagesQuery.OrderBy(p => p.Price),
                    "price-desc" => packagesQuery.OrderByDescending(p => p.Price),
                    "rating" => packagesQuery.OrderByDescending(p => p.Rating),
                    "duration" => packagesQuery.OrderBy(p => p.DurationDays),
                    _ => packagesQuery.OrderByDescending(p => p.Rating).ThenByDescending(p => p.IsOffer)
                };

                // Get total count
                var totalCount = packagesQuery.Count();

                // Apply pagination
                var packages = packagesQuery
                    .Skip((query.PageNumber - 1) * query.PageSize)
                    .Take(query.PageSize)
                    .ToList();

                // Load related data
                foreach (var package in packages)
                {
                    await _unitOfWork.Packages.GetByIdAsync(
                        package.Id,
                        p => p.Destination,
                        p => p.Features,
                        p => p.Itineraries
                    );
                }

                var packageDtos = _mapper.Map<List<PackageCardDto>>(packages);
                var paginatedResult = new PaginatedResult<PackageCardDto>(
                    packageDtos,
                    totalCount,
                    query.PageNumber,
                    query.PageSize
                );

                return Result<PaginatedResult<PackageCardDto>>.Success(paginatedResult);
            }
            catch (Exception ex)
            {
                return Result<PaginatedResult<PackageCardDto>>.Failure($"Error searching packages: {ex.Message}");
            }
        }

        public async Task<Result<PackageDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var package = await _unitOfWork.Packages.GetByIdAsync(
                    id,
                    p => p.Destination,
                    p => p.Itineraries,
                    p => p.Features,
                    p => p.PackageHotels
                );

                if (package == null)
                    return Result<PackageDetailDto>.Failure("Package not found");

                // Hotels are now embedded in PackageHotels - no need to load separately

                var packageDto = _mapper.Map<PackageDetailDto>(package);
                return Result<PackageDetailDto>.Success(packageDto);
            }
            catch (Exception ex)
            {
                return Result<PackageDetailDto>.Failure($"Error retrieving package: {ex.Message}");
            }
        }

        public async Task<Result<PackageDetailDto>> GetByPackageIdAsync(string packageId, CancellationToken cancellationToken = default)
        {
            try
            {
                var package = await _unitOfWork.Packages.FindAsync(
                    p => (p.PackageId == packageId || p.PackageId.Replace(" ", "-") == packageId) && p.IsActive,
                    p => p.Destination,
                    p => p.Itineraries,
                    p => p.Features,
                    p => p.PackageHotels
                );

                if (package == null)
                    return Result<PackageDetailDto>.Failure($"Package with ID '{packageId}' not found");

                // Hotels are now embedded in PackageHotels - no need to load separately

                var packageDto = _mapper.Map<PackageDetailDto>(package);
                return Result<PackageDetailDto>.Success(packageDto);
            }
            catch (Exception ex)
            {
                return Result<PackageDetailDto>.Failure($"Error retrieving package: {ex.Message}");
            }
        }

        public async Task<Result<PackageDetailDto>> CreateAsync(CreatePackageDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                // Check if package ID already exists
                var existingPackage = await _unitOfWork.Packages
                    .FindAsync(p => p.PackageId == dto.PackageId, cancellationToken);

                if (existingPackage != null)
                    return Result<PackageDetailDto>.Failure($"Package with ID '{dto.PackageId}' already exists");

                // Verify destination exists
                var destinationExists = await _unitOfWork.Destinations.ExistsAsync(dto.DestinationId, cancellationToken);
                if (!destinationExists)
                    return Result<PackageDetailDto>.Failure("Destination not found");

                var package = _mapper.Map<Package>(dto);
                package.Id = Guid.NewGuid();
                package.IsActive = true;
                package.CreatedAt = DateTime.UtcNow;

                await _unitOfWork.Packages.AddAsync(package, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Reload with relationships
                package = await _unitOfWork.Packages.GetByIdAsync(
                    package.Id,
                    p => p.Destination,
                    p => p.Itineraries,
                    p => p.Features,
                    p => p.PackageHotels
                );

                var packageDto = _mapper.Map<PackageDetailDto>(package);
                return Result<PackageDetailDto>.Success(packageDto, "Package created successfully");
            }
            catch (Exception ex)
            {
                return Result<PackageDetailDto>.Failure($"Error creating package: {ex.Message}");
            }
        }

        public async Task<Result<PackageDetailDto>> UpdateAsync(Guid id, UpdatePackageDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var package = await _unitOfWork.Packages.GetByIdAsync(id, cancellationToken);

                if (package == null)
                    return Result<PackageDetailDto>.Failure("Package not found");

                // Check if new package ID conflicts
                if (package.PackageId != dto.PackageId)
                {
                    var existingPackage = await _unitOfWork.Packages
                        .FindAsync(p => p.PackageId == dto.PackageId && p.Id != id, cancellationToken);

                    if (existingPackage != null)
                        return Result<PackageDetailDto>.Failure($"Package with ID '{dto.PackageId}' already exists");
                }

                // Verify destination exists if changed
                if (package.DestinationId != dto.DestinationId)
                {
                    var destinationExists = await _unitOfWork.Destinations.ExistsAsync(dto.DestinationId, cancellationToken);
                    if (!destinationExists)
                        return Result<PackageDetailDto>.Failure("Destination not found");
                }

                _mapper.Map(dto, package);
                _unitOfWork.Packages.Update(package);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Reload with relationships
                package = await _unitOfWork.Packages.GetByIdAsync(
                    package.Id,
                    p => p.Destination,
                    p => p.Itineraries,
                    p => p.Features,
                    p => p.PackageHotels
                );

                var packageDto = _mapper.Map<PackageDetailDto>(package);
                return Result<PackageDetailDto>.Success(packageDto, "Package updated successfully");
            }
            catch (Exception ex)
            {
                return Result<PackageDetailDto>.Failure($"Error updating package: {ex.Message}");
            }
        }

        public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var package = await _unitOfWork.Packages.GetByIdAsync(id, cancellationToken);

                if (package == null)
                    return Result.Failure("Package not found");

                // Soft delete - just mark as inactive
                package.IsActive = false;
                _unitOfWork.Packages.Update(package);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("Package deleted successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting package: {ex.Message}");
            }
        }

        // Itinerary Management
        public async Task<Result<List<PackageItineraryDto>>> GetItineraryAsync(Guid packageId, CancellationToken cancellationToken = default)
        {
            try
            {
                var package = await _unitOfWork.Packages.GetByIdAsync(
                    packageId,
                    p => p.Itineraries
                );

                if (package == null)
                    return Result<List<PackageItineraryDto>>.Failure("Package not found");

                var itineraryDtos = _mapper.Map<List<PackageItineraryDto>>(package.Itineraries.OrderBy(i => i.Day));
                return Result<List<PackageItineraryDto>>.Success(itineraryDtos);
            }
            catch (Exception ex)
            {
                return Result<List<PackageItineraryDto>>.Failure($"Error retrieving itinerary: {ex.Message}");
            }
        }

        public async Task<Result<PackageItineraryDto>> AddItineraryItemAsync(Guid packageId, PackageItineraryDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var package = await _unitOfWork.Packages.GetByIdAsync(packageId, cancellationToken);

                if (package == null)
                    return Result<PackageItineraryDto>.Failure("Package not found");

                var itineraryItem = _mapper.Map<PackageItinerary>(dto);
                itineraryItem.Id = Guid.NewGuid();
                itineraryItem.PackageId = packageId;

                await _unitOfWork.PackageItineraries.AddAsync(itineraryItem, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var resultDto = _mapper.Map<PackageItineraryDto>(itineraryItem);
                return Result<PackageItineraryDto>.Success(resultDto, "Itinerary item added successfully");
            }
            catch (Exception ex)
            {
                return Result<PackageItineraryDto>.Failure($"Error adding itinerary item: {ex.Message}");
            }
        }

        public async Task<Result<PackageItineraryDto>> UpdateItineraryItemAsync(Guid itemId, PackageItineraryDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var item = await _unitOfWork.PackageItineraries.GetByIdAsync(itemId, cancellationToken);

                if (item == null)
                    return Result<PackageItineraryDto>.Failure("Itinerary item not found");

                _mapper.Map(dto, item);
                _unitOfWork.PackageItineraries.Update(item);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var resultDto = _mapper.Map<PackageItineraryDto>(item);
                return Result<PackageItineraryDto>.Success(resultDto, "Itinerary item updated successfully");
            }
            catch (Exception ex)
            {
                return Result<PackageItineraryDto>.Failure($"Error updating itinerary item: {ex.Message}");
            }
        }

        public async Task<Result> DeleteItineraryItemAsync(Guid itemId, CancellationToken cancellationToken = default)
        {
            try
            {
                var item = await _unitOfWork.PackageItineraries.GetByIdAsync(itemId, cancellationToken);

                if (item == null)
                    return Result.Failure("Itinerary item not found");

                _unitOfWork.PackageItineraries.Delete(item);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("Itinerary item deleted successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting itinerary item: {ex.Message}");
            }
        }

        #region Hotel Management

        public async Task<Result<List<PackageHotelDto>>> GetHotelsAsync(Guid packageId, CancellationToken cancellationToken = default)
        {
            try
            {
                var package = await _unitOfWork.Packages.GetByIdAsync(packageId, cancellationToken);

                if (package == null)
                    return Result<List<PackageHotelDto>>.Failure("Package not found");

                var packageHotels = await _unitOfWork.PackageHotels.FindAllAsync(
                    ph => ph.PackageId == packageId
                );

                var hotelDtos = packageHotels
                    .OrderBy(ph => ph.SortOrder)
                    .Select(ph => new PackageHotelDto
                    {
                        Id = ph.Id,
                        Name = ph.Name,
                        Location = ph.Location,
                        Stars = ph.Stars,
                        NightsCount = ph.NightsCount,
                        DayImageUrl = ph.DayImageUrl,
                        NightImageUrl = ph.NightImageUrl,
                        SortOrder = ph.SortOrder
                    })
                    .ToList();

                return Result<List<PackageHotelDto>>.Success(hotelDtos);
            }
            catch (Exception ex)
            {
                return Result<List<PackageHotelDto>>.Failure($"Error retrieving package hotels: {ex.Message}");
            }
        }

        public async Task<Result<PackageHotelDto>> AddHotelAsync(Guid packageId, CreatePackageHotelDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                // Verify package exists
                var package = await _unitOfWork.Packages.GetByIdAsync(packageId, cancellationToken);
                if (package == null)
                    return Result<PackageHotelDto>.Failure("Package not found");

                // Create new package hotel with embedded data
                var packageHotel = new PackageHotel
                {
                    Id = Guid.NewGuid(),
                    PackageId = packageId,
                    Name = dto.Name,
                    Location = dto.Location,
                    Stars = dto.Stars,
                    NightsCount = dto.NightsCount,
                    DayImageUrl = dto.DayImageUrl,
                    NightImageUrl = dto.NightImageUrl,
                    SortOrder = dto.SortOrder
                };

                await _unitOfWork.PackageHotels.AddAsync(packageHotel, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Return DTO
                var resultDto = new PackageHotelDto
                {
                    Id = packageHotel.Id,
                    Name = packageHotel.Name,
                    Location = packageHotel.Location,
                    Stars = packageHotel.Stars,
                    NightsCount = packageHotel.NightsCount,
                    DayImageUrl = packageHotel.DayImageUrl,
                    NightImageUrl = packageHotel.NightImageUrl,
                    SortOrder = packageHotel.SortOrder
                };

                return Result<PackageHotelDto>.Success(resultDto);
            }
            catch (Exception ex)
            {
                return Result<PackageHotelDto>.Failure($"Error adding hotel to package: {ex.Message}");
            }
        }

        public async Task<Result<PackageHotelDto>> UpdateHotelAsync(Guid packageId, Guid hotelId, UpdatePackageHotelDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var packageHotel = await _unitOfWork.PackageHotels.GetByIdAsync(hotelId, cancellationToken);

                if (packageHotel == null || packageHotel.PackageId != packageId)
                    return Result<PackageHotelDto>.Failure("Package hotel not found");

                // Update properties
                packageHotel.Name = dto.Name;
                packageHotel.Location = dto.Location;
                packageHotel.Stars = dto.Stars;
                packageHotel.NightsCount = dto.NightsCount;
                packageHotel.DayImageUrl = dto.DayImageUrl;
                packageHotel.NightImageUrl = dto.NightImageUrl;
                packageHotel.SortOrder = dto.SortOrder;

                _unitOfWork.PackageHotels.Update(packageHotel);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var resultDto = new PackageHotelDto
                {
                    Id = packageHotel.Id,
                    Name = packageHotel.Name,
                    Location = packageHotel.Location,
                    Stars = packageHotel.Stars,
                    NightsCount = packageHotel.NightsCount,
                    DayImageUrl = packageHotel.DayImageUrl,
                    NightImageUrl = packageHotel.NightImageUrl,
                    SortOrder = packageHotel.SortOrder
                };

                return Result<PackageHotelDto>.Success(resultDto);
            }
            catch (Exception ex)
            {
                return Result<PackageHotelDto>.Failure($"Error updating package hotel: {ex.Message}");
            }
        }

        public async Task<Result> DeleteHotelAsync(Guid packageId, Guid hotelId, CancellationToken cancellationToken = default)
        {
            try
            {
                var packageHotel = await _unitOfWork.PackageHotels.GetByIdAsync(hotelId, cancellationToken);

                if (packageHotel == null || packageHotel.PackageId != packageId)
                    return Result.Failure("Package hotel not found");

                _unitOfWork.PackageHotels.Delete(packageHotel);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("Hotel removed from package successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting package hotel: {ex.Message}");
            }
        }

        #endregion
    }
}

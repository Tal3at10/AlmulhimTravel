using Core.Application.Abstraction.DTOs.Catalog;
using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.Services.Catalog
{
    public interface IPackageService
    {
        Task<Result<List<PackageCardDto>>> GetFeaturedAsync(int count = 6, CancellationToken cancellationToken = default);
        Task<Result<PaginatedResult<PackageCardDto>>> SearchAsync(PackageSearchQuery query, CancellationToken cancellationToken = default);
        Task<Result<PackageDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<PackageDetailDto>> GetByPackageIdAsync(string packageId, CancellationToken cancellationToken = default);
        Task<Result<PackageDetailDto>> CreateAsync(CreatePackageDto dto, CancellationToken cancellationToken = default);
        Task<Result<PackageDetailDto>> UpdateAsync(Guid id, UpdatePackageDto dto, CancellationToken cancellationToken = default);
        Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

        // Itinerary Management
        Task<Result<List<PackageItineraryDto>>> GetItineraryAsync(Guid packageId, CancellationToken cancellationToken = default);
        Task<Result<PackageItineraryDto>> AddItineraryItemAsync(Guid packageId, PackageItineraryDto dto, CancellationToken cancellationToken = default);
        Task<Result<PackageItineraryDto>> UpdateItineraryItemAsync(Guid itemId, PackageItineraryDto dto, CancellationToken cancellationToken = default);
        Task<Result> DeleteItineraryItemAsync(Guid itemId, CancellationToken cancellationToken = default);

        // Hotel Management
        Task<Result<List<PackageHotelDto>>> GetHotelsAsync(Guid packageId, CancellationToken cancellationToken = default);
        Task<Result<PackageHotelDto>> AddHotelAsync(Guid packageId, CreatePackageHotelDto dto, CancellationToken cancellationToken = default);
        Task<Result<PackageHotelDto>> UpdateHotelAsync(Guid packageId, Guid hotelId, UpdatePackageHotelDto dto, CancellationToken cancellationToken = default);
        Task<Result> DeleteHotelAsync(Guid packageId, Guid hotelId, CancellationToken cancellationToken = default);
    }
}

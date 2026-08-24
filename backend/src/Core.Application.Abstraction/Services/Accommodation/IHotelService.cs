using Core.Application.Abstraction.DTOs.Accommodation;
using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.Services.Accommodation
{
    public interface IHotelService
    {
        Task<Result<PaginatedResult<HotelCardDto>>> SearchAsync(HotelSearchQuery query, CancellationToken cancellationToken = default);
        Task<Result<HotelDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<HotelDetailDto>> GetByHotelIdAsync(string hotelId, CancellationToken cancellationToken = default);
        Task<Result<List<string>>> GetPopularDestinationsAsync(CancellationToken cancellationToken = default);
    }
}

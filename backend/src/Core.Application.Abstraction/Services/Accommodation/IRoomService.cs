using Core.Application.Abstraction.DTOs.Accommodation;
using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.Services.Accommodation
{
    public interface IRoomService
    {
        Task<Result<List<RoomCardDto>>> GetAvailableRoomsByHotelAsync(
            Guid hotelId,
            DateTime checkIn,
            DateTime checkOut,
            int guests,
            CancellationToken cancellationToken = default);
        
        Task<Result<RoomDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    }
}

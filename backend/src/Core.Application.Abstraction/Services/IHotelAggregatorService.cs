using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.DTOs.Hotels;

namespace Core.Application.Abstraction.Services;

public interface IHotelAggregatorService
{
    Task<List<HotelSearchResultDto>> SearchAsync(HotelSearchQuery query, CancellationToken ct = default);
    Task<HotelDetailDto?> GetDetailsAsync(string hotelId, string providerName, HotelSearchQuery query, CancellationToken ct = default);
    Task<List<RoomTypeDto>> GetRoomsAsync(string hotelId, string providerName, HotelSearchQuery query, CancellationToken ct = default);
    Task<BookingConfirmationDto?> CreateBookingAsync(BookingRequest request, CancellationToken ct = default);
}

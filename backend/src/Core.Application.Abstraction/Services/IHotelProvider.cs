using Core.Application.Abstraction.DTOs.Hotels;

namespace Core.Application.Abstraction.Services;

public interface IHotelProvider
{
    string ProviderName { get; }
    Task<List<HotelSearchResultDto>> SearchAsync(HotelSearchQuery query, CancellationToken ct = default);
    Task<HotelDetailDto?> GetDetailsAsync(string hotelId, HotelSearchQuery query, CancellationToken ct = default);
    Task<List<RoomTypeDto>> GetRoomsAsync(string hotelId, HotelSearchQuery query, CancellationToken ct = default);
    Task<BookingConfirmationDto?> CreateBookingAsync(BookingRequest request, CancellationToken ct = default);
    Task<BookingStatusDto?> GetBookingStatusAsync(string bookingRef, CancellationToken ct = default);
    Task<bool> CancelBookingAsync(string bookingRef, CancellationToken ct = default);
}

using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Reservations;

namespace Core.Application.Abstraction.Services.Reservations
{
    public interface IBookingService
    {
        // Hotel Booking
        Task<Result<BookingConfirmationDto>> CreateHotelBookingAsync(CreateHotelBookingDto dto, CancellationToken cancellationToken = default);
        
        // Flight Booking
        Task<Result<BookingConfirmationDto>> CreateFlightBookingAsync(CreateFlightBookingDto dto, CancellationToken cancellationToken = default);
        
        // Package Booking
        Task<Result<BookingConfirmationDto>> CreatePackageBookingAsync(CreatePackageBookingDto dto, CancellationToken cancellationToken = default);
        
        // Booking Lookup
        Task<Result<BookingDetailDto>> GetByReferenceAsync(string referenceNumber, string email, CancellationToken cancellationToken = default);
        Task<Result<BookingDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        
        // Admin - All Bookings
        Task<Result<List<BookingListDto>>> GetAllAsync(BookingSearchQuery query, CancellationToken cancellationToken = default);
        
        // User Bookings
        Task<Result<List<BookingListDto>>> GetUserBookingsAsync(Guid userId, CancellationToken cancellationToken = default);
        
        // Booking Management
        Task<Result> CancelBookingAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result> ConfirmBookingAsync(Guid id, CancellationToken cancellationToken = default);
    }
}

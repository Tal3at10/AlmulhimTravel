using Core.Application.Abstraction.DTOs.RapidApi;

namespace Core.Application.Abstraction.Services;

/// <summary>
/// RapidAPI integration service for Booking.com and Tripadvisor
/// </summary>
public interface IRapidApiHotelService
{
    /// <summary>
    /// Search hotels using Booking.com API
    /// </summary>
    Task<List<BookingHotelDto>> SearchBookingHotelsAsync(
        string destination,
        string checkIn,
        string checkOut,
        int adults = 2,
        int rooms = 1,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get destination ID from Booking.com (required for hotel search)
    /// </summary>
    Task<string?> GetBookingDestinationIdAsync(
        string query,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Search hotels using Tripadvisor API
    /// </summary>
    Task<List<TripadvisorHotelDto>> SearchTripadvisorHotelsAsync(
        string locationId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get location ID from Tripadvisor (required for hotel search)
    /// </summary>
    Task<string?> GetTripadvisorLocationIdAsync(
        string query,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Search hotels from all providers and return normalized results
    /// </summary>
    Task<List<NormalizedHotelDto>> SearchAllProvidersAsync(
        string destination,
        string checkIn,
        string checkOut,
        int adults = 2,
        int rooms = 1,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get full hotel details from Booking.com API
    /// </summary>
    Task<HotelDetailsDto?> GetHotelDetailsAsync(
        string hotelId,
        string checkIn,
        string checkOut,
        CancellationToken cancellationToken = default);
}

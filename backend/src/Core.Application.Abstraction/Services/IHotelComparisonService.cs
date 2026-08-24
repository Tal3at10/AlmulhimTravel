using Core.Application.Abstraction.DTOs.RapidApi;

namespace Core.Application.Abstraction.Services;

/// <summary>
/// Service for comparing hotel prices across multiple providers (Trivago-style)
/// </summary>
public interface IHotelComparisonService
{
    /// <summary>
    /// Search hotels from all providers and group same hotels together with price comparison
    /// </summary>
    /// <param name="destination">City name (Arabic or English)</param>
    /// <param name="checkIn">Check-in date (YYYY-MM-DD)</param>
    /// <param name="checkOut">Check-out date (YYYY-MM-DD)</param>
    /// <param name="adults">Number of adults</param>
    /// <param name="rooms">Number of rooms</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of hotels with price comparison from multiple providers</returns>
    Task<List<HotelComparisonResultDto>> SearchAndCompareAsync(
        string destination,
        string checkIn,
        string checkOut,
        int adults = 2,
        int rooms = 1,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Result of hotel comparison across providers
/// </summary>
public record HotelComparisonResultDto(
    string Id,                          // Unique ID for the grouped hotel
    string HotelName,                   // Display name
    string? NormalizedName,             // Normalized name for matching
    string? City,                       // City name
    string? Address,                    // Address
    double? Latitude,                   // Coordinates for map
    double? Longitude,
    int StarRating,                     // 1-5 stars
    double? Rating,                     // User rating (0-10)
    int? ReviewCount,                   // Total reviews
    string? MainPhotoUrl,               // Main display image
    List<string>? PhotoUrls,            // All photos
    List<string>? Facilities,           // Hotel facilities
    List<ProviderOfferDto> Offers,      // Offers from different providers
    decimal? LowestPrice,               // Cheapest price for quick display
    string? LowestPriceCurrency,        // Currency of lowest price
    string? LowestPriceProvider         // Provider with lowest price
);

/// <summary>
/// An offer from a specific provider
/// </summary>
public record ProviderOfferDto(
    string Provider,                    // "booking", "tripadvisor", "amadeus"
    string ProviderDisplayName,         // "Booking.com", "Tripadvisor", "Amadeus"
    string ProviderLogo,                // Logo URL
    string ProviderColor,               // Brand color (hex)
    decimal? PricePerNight,             // Price per night
    decimal? TotalPrice,                // Total price for stay
    string? Currency,                   // Currency code
    string? RoomType,                   // Room description
    string? BookingUrl,                 // Direct link to book
    bool HasPrice,                      // Whether price is available
    double? ProviderRating,             // Rating on this provider
    int? ProviderReviewCount            // Reviews on this provider
);

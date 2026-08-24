namespace Core.Application.Abstraction.DTOs.RapidApi;

// ==================== Booking.com DTOs ====================

/// <summary>
/// Hotel search result from Booking.com API
/// </summary>
public record BookingHotelDto(
    string HotelId,
    string Name,
    string? Address,
    string? City,
    string? Country,
    double? Latitude,
    double? Longitude,
    int StarRating,
    double? ReviewScore,
    int? ReviewCount,
    string? MainPhotoUrl,
    decimal? PricePerNight,
    string? Currency,
    string? CheckIn,
    string? CheckOut,
    List<string>? PhotoUrls,
    List<string>? Facilities,
    string? BookingUrl = null
);

/// <summary>
/// Hotel search request for Booking.com
/// </summary>
public record BookingHotelSearchRequest(
    string DestinationId,
    string CheckIn,
    string CheckOut,
    int Adults = 2,
    int Children = 0,
    int Rooms = 1,
    string Currency = "SAR"
);

// ==================== Tripadvisor DTOs ====================

/// <summary>
/// Hotel from Tripadvisor API
/// </summary>
public record TripadvisorHotelDto(
    string LocationId,
    string Name,
    string? Address,
    double? Latitude,
    double? Longitude,
    string? Rating,
    int? NumReviews,
    string? PriceLevel,
    string? PhotoUrl,
    List<TripadvisorPhotoDto>? Photos
);

/// <summary>
/// Photo from Tripadvisor
/// </summary>
public record TripadvisorPhotoDto(
    string? Small,
    string? Medium,
    string? Large
);

// ==================== Combined/Normalized DTOs ====================

/// <summary>
/// Normalized hotel result for comparison across providers
/// </summary>
public record NormalizedHotelDto(
    string Id,
    string Provider,        // "booking", "tripadvisor", "amadeus"
    string Name,
    string? Address,
    string? City,
    double? Latitude,
    double? Longitude,
    int StarRating,
    double? Rating,         // 0-10 scale
    int? ReviewCount,
    string? MainPhotoUrl,
    List<string>? PhotoUrls,
    decimal? PricePerNight,
    string? Currency,
    string? RoomType,
    List<string>? Facilities,
    string? BookingUrl
);

/// <summary>
/// Comparison result showing same hotel from multiple providers
/// </summary>
public record HotelComparisonDto(
    string HotelName,
    string? City,
    int StarRating,
    string? MainPhotoUrl,
    List<HotelProviderPrice> Prices
);

/// <summary>
/// Price from a specific provider
/// </summary>
public record HotelProviderPrice(
    string Provider,
    string ProviderLogo,
    decimal PricePerNight,
    decimal TotalPrice,
    string Currency,
    string? RoomType,
    string BookingUrl
);


/// <summary>
/// Full hotel details including multiple photos and description
/// </summary>
public record HotelDetailsDto(
    string Id,
    string Name,
    string? NameEn,
    string? Description,
    string? Address,
    string? City,
    int StarRating,
    double? Rating,
    string? RatingText,
    int? ReviewCount,
    string? CheckInTime,
    string? CheckOutTime,
    List<string>? Photos,
    List<string>? Facilities,
    decimal? Price,
    string? Currency
);

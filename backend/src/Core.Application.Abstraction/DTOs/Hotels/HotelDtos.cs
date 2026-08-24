namespace Core.Application.Abstraction.DTOs.Hotels;

public class HotelSearchQuery
{
    public string CityCode { get; set; } = string.Empty;
    public string CheckInDate { get; set; } = string.Empty;
    public string CheckOutDate { get; set; } = string.Empty;
    public int Adults { get; set; } = 2;
    public int Rooms { get; set; } = 1;
    public int Radius { get; set; } = 50;
    public string Currency { get; set; } = "SAR";
}

public record HotelSearchResultDto(
    string HotelId,
    string Name,
    string Provider,
    int Stars,
    decimal Rating,
    int ReviewCount,
    string RatingText,
    string Location,
    string Distance,
    string MainImage,
    List<string> Images,
    decimal Price,
    decimal OriginalPrice,
    int DiscountPercentage,
    int Nights,
    int Guests,
    string RoomType,
    List<string> Badges,
    List<string> Features,
    string Currency,
    double? Latitude,
    double? Longitude
);

public record HotelDetailDto(
    string HotelId,
    string Name,
    string Provider,
    int Stars,
    decimal Rating,
    int ReviewCount,
    string RatingText,
    string Location,
    string Address,
    string Description,
    List<string> Images,
    double? Latitude,
    double? Longitude,
    string CheckInTime,
    string CheckOutTime,
    List<string> Amenities,
    List<string> Highlights,
    List<RoomTypeDto> Rooms
);

public record RoomTypeDto(
    string RoomId,
    string Name,
    List<string> Images,
    int MaxGuests,
    string BedType,
    string Size,
    List<string> Amenities,
    List<RatePlanDto> RatePlans
);

public record RatePlanDto(
    string RateId,
    string Name,
    string BoardType, // e.g., "ROOM_ONLY", "BREAKFAST"
    decimal Price,
    decimal? OriginalPrice,
    int DiscountPercentage,
    bool IsRefundable,
    string CancellationPolicy,
    int AvailableRooms
);

public record BookingRequest(
    string HotelId,
    string RateId,
    string Provider,
    string CheckInDate,
    string CheckOutDate,
    int Guests,
    GuestDetails PrimaryGuest,
    List<GuestDetails>? AdditionalGuests = null,
    string? SpecialRequests = null
);

public record GuestDetails(
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    string Nationality,
    string Gender,
    string DateOfBirth
);

public record BookingConfirmationDto(
    string BookingReference,
    string ProviderReference,
    string Status,
    decimal TotalPrice,
    string Currency
);

public record BookingStatusDto(
    string BookingReference,
    string Status, // CONFIRMED, CANCELLED, PENDING
    string ProviderMessage
);

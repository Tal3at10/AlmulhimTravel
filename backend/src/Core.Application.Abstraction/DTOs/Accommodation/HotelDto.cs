using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.DTOs.Accommodation
{
    public class HotelCardDto
    {
        public Guid Id { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public int Stars { get; set; }
        public string CityName { get; set; } = string.Empty;
        public string MainImageUrl { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public int ReviewsCount { get; set; }
        public decimal StartingPrice { get; set; }
        public string Currency { get; set; } = "SAR";
        public List<string> Badges { get; set; } = new();
        public List<string> TopAmenities { get; set; } = new();
    }

    public class HotelDetailDto
    {
        public Guid Id { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string DescriptionAr { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        public int Stars { get; set; }
        public string Address { get; set; } = string.Empty;
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public int ReviewsCount { get; set; }
        public CityDto City { get; set; } = null!;
        public List<HotelImageDto> Images { get; set; } = new();
        public List<AmenityDto> Amenities { get; set; } = new();
        public List<HotelBadgeDto> Badges { get; set; } = new();
        public List<HotelHighlightDto> Highlights { get; set; } = new();
        public List<RoomCardDto> Rooms { get; set; } = new();
    }

    public class HotelSearchQuery : PagedQuery
    {
        public Guid? CityId { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public int Adults { get; set; } = 1;
        public int Children { get; set; } = 0;
        public int? MinStars { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public List<Guid>? AmenityIds { get; set; }
        public decimal? MinRating { get; set; }
    }

    public class HotelImageDto
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Caption { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
        public int SortOrder { get; set; }
    }

    public class HotelBadgeDto
    {
        public string Name { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }

    public class HotelHighlightDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
    }
}

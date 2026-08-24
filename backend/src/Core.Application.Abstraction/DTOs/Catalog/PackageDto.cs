namespace Core.Application.Abstraction.DTOs.Catalog
{
    public class PackageCardDto
    {
        public Guid Id { get; set; }
        public string PackageId { get; set; } = string.Empty;
        public Guid DestinationId { get; set; }
        public string TitleAr { get; set; } = string.Empty;
        public string TitleEn { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public int DurationDays { get; set; }
        public int DurationNights { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string Vibe { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public bool IsOffer { get; set; }
        public bool IsFeatured { get; set; }
        public int FeaturedOrder { get; set; }
        public List<string> Features { get; set; } = new();
        public string DestinationName { get; set; } = string.Empty;
    }

    public class PackageDetailDto
    {
        public Guid Id { get; set; }
        public string PackageId { get; set; } = string.Empty;
        public string TitleAr { get; set; } = string.Empty;
        public string TitleEn { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public int DurationDays { get; set; }
        public int DurationNights { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string Vibe { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public bool IsOffer { get; set; }
        public bool IsFeatured { get; set; }
        public int FeaturedOrder { get; set; }
        public string DestinationSlug { get; set; } = string.Empty;
        public DestinationDto Destination { get; set; } = null!;
        public List<PackageItineraryDto> Itineraries { get; set; } = new();
        public List<PackageHotelDto> Hotels { get; set; } = new();
        public List<string> Features { get; set; } = new();
    }

    public class PackageItineraryDto
    {
        public Guid? Id { get; set; }  // Make it nullable for create operations
        public int Day { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }

    public class PackageHotelDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int Stars { get; set; }
        public int NightsCount { get; set; }
        public string DayImageUrl { get; set; } = string.Empty;
        public string NightImageUrl { get; set; } = string.Empty;
        public int SortOrder { get; set; }
    }

    public class CreatePackageHotelDto
    {
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int Stars { get; set; }
        public int NightsCount { get; set; }
        public string DayImageUrl { get; set; } = string.Empty;
        public string NightImageUrl { get; set; } = string.Empty;
        public int SortOrder { get; set; }
    }

    public class UpdatePackageHotelDto
    {
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int Stars { get; set; }
        public int NightsCount { get; set; }
        public string DayImageUrl { get; set; } = string.Empty;
        public string NightImageUrl { get; set; } = string.Empty;
        public int SortOrder { get; set; }
    }

    public class PackageSearchQuery
    {
        public string? DestinationSlug { get; set; }
        public bool? IsOffer { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? SortBy { get; set; } // price, rating, duration
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }

    public class CreatePackageDto
    {
        public string PackageId { get; set; } = string.Empty;
        public Guid DestinationId { get; set; }
        public string TitleAr { get; set; } = string.Empty;
        public string TitleEn { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Currency { get; set; } = "ر.س";
        public string Duration { get; set; } = string.Empty;
        public int DurationDays { get; set; }
        public int DurationNights { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string Vibe { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public bool IsOffer { get; set; }
        public bool IsFeatured { get; set; }
        public int FeaturedOrder { get; set; }
    }

    public class UpdatePackageDto : CreatePackageDto
    {
    }
}

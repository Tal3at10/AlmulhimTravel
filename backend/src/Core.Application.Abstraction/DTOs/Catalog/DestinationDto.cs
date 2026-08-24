using System.ComponentModel.DataAnnotations;

namespace Core.Application.Abstraction.DTOs.Catalog
{
    public class DestinationDto
    {
        public Guid Id { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? DescriptionEn { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public int PackagesCount { get; set; }
        public int HotelsCount { get; set; }
        public int VideosCount { get; set; }
        public bool IsFeatured { get; set; }
        public int FeaturedOrder { get; set; }
    }

    public class DestinationListDto
    {
        public Guid Id { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public int PackagesCount { get; set; }
        public bool IsFeatured { get; set; }
        public int FeaturedOrder { get; set; }
    }

    public class CreateDestinationDto
    {
        [Required(ErrorMessage = "NameAr is required")]
        [StringLength(200)]
        public string NameAr { get; set; } = string.Empty;

        [StringLength(200)]
        public string NameEn { get; set; } = string.Empty;

        [StringLength(200)]
        public string Slug { get; set; } = string.Empty;

        [Required(ErrorMessage = "Country is required")]
        [StringLength(100)]
        public string Country { get; set; } = string.Empty;

        [Required(ErrorMessage = "ImageUrl is required")]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(5000)]
        public string? Description { get; set; }

        [StringLength(5000)]
        public string? DescriptionEn { get; set; }

        public int SortOrder { get; set; }
        public bool IsFeatured { get; set; }
        public int FeaturedOrder { get; set; }
    }

    public class UpdateDestinationDto
    {
        [Required(ErrorMessage = "NameAr is required")]
        [StringLength(200)]
        public string NameAr { get; set; } = string.Empty;

        [StringLength(200)]
        public string NameEn { get; set; } = string.Empty;

        [StringLength(200)]
        public string Slug { get; set; } = string.Empty;

        [Required(ErrorMessage = "Country is required")]
        [StringLength(100)]
        public string Country { get; set; } = string.Empty;

        [Required(ErrorMessage = "ImageUrl is required")]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(5000)]
        public string? Description { get; set; }

        [StringLength(5000)]
        public string? DescriptionEn { get; set; }

        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public int FeaturedOrder { get; set; }
    }
}

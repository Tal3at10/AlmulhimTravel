using System.ComponentModel.DataAnnotations;

namespace Core.Application.Abstraction.DTOs.Content
{
    public class HeroSlideDto
    {
        public Guid Id { get; set; }
        public string TitleAr { get; set; } = string.Empty;
        public string TitleEn { get; set; } = string.Empty;
        public string SubtitleAr { get; set; } = string.Empty;
        public string SubtitleEn { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }
        public string? ButtonText { get; set; }
        public string? ButtonLink { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateHeroSlideDto
    {
        [StringLength(200)]
        public string TitleAr { get; set; } = string.Empty;

        [StringLength(200)]
        public string? TitleEn { get; set; }

        [StringLength(500)]
        public string? SubtitleAr { get; set; }

        [StringLength(500)]
        public string? SubtitleEn { get; set; }

        [Required(ErrorMessage = "ImageUrl is required")]
        [Url(ErrorMessage = "Invalid URL format")]
        public string ImageUrl { get; set; } = string.Empty;

        public string? VideoUrl { get; set; }

        [StringLength(100)]
        public string? ButtonText { get; set; }

        public string? ButtonLink { get; set; }

        public int SortOrder { get; set; }
    }
}

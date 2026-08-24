using System.ComponentModel.DataAnnotations;

namespace Core.Application.Abstraction.DTOs.Content
{
    public class PartnerDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
        public string? Website { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreatePartnerDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "LogoUrl is required")]
        [Url(ErrorMessage = "Invalid LogoUrl format")]
        public string LogoUrl { get; set; } = string.Empty;

        [Url(ErrorMessage = "Invalid Website URL")]
        public string? Website { get; set; }

        public int SortOrder { get; set; }
    }
}

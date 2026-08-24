using System.ComponentModel.DataAnnotations;

namespace Core.Application.Abstraction.DTOs.Content
{
    public class BoardMemberDto
    {
        public Guid Id { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string PositionAr { get; set; } = string.Empty;
        public string PositionEn { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? TwitterHandle { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateBoardMemberDto
    {
        [Required(ErrorMessage = "NameAr is required")]
        [StringLength(200)]
        public string NameAr { get; set; } = string.Empty;

        [Required(ErrorMessage = "NameEn is required")]
        [StringLength(200)]
        public string NameEn { get; set; } = string.Empty;

        [Required(ErrorMessage = "PositionAr is required")]
        [StringLength(200)]
        public string PositionAr { get; set; } = string.Empty;

        [Required(ErrorMessage = "PositionEn is required")]
        [StringLength(200)]
        public string PositionEn { get; set; } = string.Empty;

        [Required(ErrorMessage = "ImageUrl is required")]
        [Url(ErrorMessage = "Invalid ImageUrl format")]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Bio { get; set; }

        public string? TwitterHandle { get; set; }

        public int SortOrder { get; set; }
    }
}

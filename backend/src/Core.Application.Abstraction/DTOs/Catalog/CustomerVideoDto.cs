using System.ComponentModel.DataAnnotations;

namespace Core.Application.Abstraction.DTOs.Catalog
{
    public class CustomerVideoDto
    {
        public Guid Id { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? Date { get; set; }
        public Guid DestinationId { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateCustomerVideoDto
    {
        [Required(ErrorMessage = "VideoUrl is required")]
        public string VideoUrl { get; set; } = string.Empty;

        public string? ThumbnailUrl { get; set; }

        [Required(ErrorMessage = "CustomerName is required")]
        [StringLength(200)]
        public string CustomerName { get; set; } = string.Empty;

        public string? Location { get; set; }

        public string? Date { get; set; }

        [Required(ErrorMessage = "DestinationId is required")]
        public Guid DestinationId { get; set; }

        public int SortOrder { get; set; }
    }

    public class UpdateCustomerVideoDto
    {
        [Required(ErrorMessage = "VideoUrl is required")]
        public string VideoUrl { get; set; } = string.Empty;

        public string? ThumbnailUrl { get; set; }

        [Required(ErrorMessage = "CustomerName is required")]
        [StringLength(200)]
        public string CustomerName { get; set; } = string.Empty;

        public string? Location { get; set; }

        public string? Date { get; set; }

        [Required(ErrorMessage = "DestinationId is required")]
        public Guid DestinationId { get; set; }

        public int SortOrder { get; set; }
    }
}

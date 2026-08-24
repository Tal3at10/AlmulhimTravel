using System.ComponentModel.DataAnnotations;

namespace Core.Application.Abstraction.DTOs.Content
{
    public class TestimonialDto
    {
        public Guid Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerTitle { get; set; } = string.Empty;
        public string CustomerImage { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; }
        public DateTime Date { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateTestimonialDto
    {
        [Required(ErrorMessage = "CustomerName is required")]
        [StringLength(200)]
        public string CustomerName { get; set; } = string.Empty;

        [StringLength(200)]
        public string CustomerTitle { get; set; } = string.Empty;

        public string CustomerImage { get; set; } = string.Empty;

        [Required(ErrorMessage = "Content is required")]
        [StringLength(2000)]
        public string Content { get; set; } = string.Empty;

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }
    }
}

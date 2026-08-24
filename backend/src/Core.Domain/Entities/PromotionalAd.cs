using System;

namespace Core.Domain.Entities
{
    public class PromotionalAd
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // The unique ID from Instagram/Snapchat to prevent duplicate processing
        public string SocialMediaId { get; set; } = string.Empty;
        
        // The platform name (e.g., "Instagram", "Snapchat")
        public string Platform { get; set; } = "Instagram";
        
        public string ImageUrl { get; set; } = string.Empty;
        
        // Raw text extracted by the Vision AI
        public string ExtractedText { get; set; } = string.Empty;
        
        // Structured data extracted by AI
        public string? Destination { get; set; }
        public decimal? Price { get; set; }
        
        // Whether this ad should be displayed on the website
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

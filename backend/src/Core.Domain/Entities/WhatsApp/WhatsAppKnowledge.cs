using System;

namespace Core.Domain.Entities.WhatsApp
{
    public class WhatsAppKnowledge
    {
        public Guid Id { get; set; }
        public string Category { get; set; } = string.Empty; // e.g., "عام", "باقات", "تأشيرات"
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public int Priority { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

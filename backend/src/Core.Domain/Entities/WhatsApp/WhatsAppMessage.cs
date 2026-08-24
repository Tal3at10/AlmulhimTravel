using System;
using Core.Domain.Enums;

namespace Core.Domain.Entities.WhatsApp
{
    public class WhatsAppMessage
    {
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public MessageDirection Direction { get; set; }
        public MessageSender SenderType { get; set; }
        public string Content { get; set; } = string.Empty;
        public string? MediaUrl { get; set; }
        public string? MediaType { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;

        // Navigation
        public WhatsAppConversation Conversation { get; set; } = null!;
    }
}

using System;
using System.Collections.Generic;
using Core.Domain.Enums;

namespace Core.Domain.Entities.WhatsApp
{
    public class WhatsAppConversation
    {
        public Guid Id { get; set; }
        public string CustomerPhone { get; set; } = string.Empty;
        public string? CustomerName { get; set; }
        public ConversationMode Mode { get; set; } = ConversationMode.Bot;
        public string? AssignedAgentName { get; set; }
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastMessageAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }
        public string? Notes { get; set; }
        public string? FreshchatConversationId { get; set; }
        public DateTime? LastAgentMessageAt { get; set; }

        // Navigation
        public ICollection<WhatsAppMessage> Messages { get; set; } = new List<WhatsAppMessage>();
    }
}

using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Application.Abstraction.Services
{
    public interface IAiService
    {
        Task<AiResponse> GenerateResponseAsync(
            string customerMessage,
            List<ChatMessage> conversationHistory,
            string systemPrompt
        );
    }

    public class ChatMessage
    {
        public string Role { get; set; } = string.Empty; // "user" or "assistant" or "system"
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }

    public class AiResponse
    {
        public string Text { get; set; } = string.Empty;
        public bool ShouldHandoff { get; set; } = false;
        public string? SuggestedImageUrl { get; set; }
        public List<string>? SuggestedImageUrls { get; set; }
        public string? SuggestedPackageId { get; set; }
    }
}

using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Application.Abstraction.Services
{
    public interface IWhatsAppProvider
    {
        Task<string> GetAgentIdAsync();
        Task SendTextMessageAsync(string phoneNumber, string message);
        Task SendImageMessageAsync(string phoneNumber, string imageUrl, string? caption);
        Task SendDocumentMessageAsync(string phoneNumber, string documentUrl, string? caption);
        Task AssignConversationToGroupAsync(string conversationId, string groupId);
        Task SendPrivateNoteAsync(string conversationId, string note);

        
        /// <summary>
        /// Sends a message with WhatsApp Quick Reply buttons (max 3 buttons).
        /// Each button is a (label, replyText) tuple.
        /// </summary>
        Task SendQuickReplyButtonsAsync(string conversationId, string bodyText, List<(string Label, string ReplyText)> buttons);
        
        /// <summary>
        /// Sends a WhatsApp List/Dropdown message (max 10 items).
        /// Each item is a (label, replyText) tuple.
        /// </summary>
        Task SendListMessageAsync(string conversationId, string bodyText, string buttonLabel, List<(string Label, string ReplyText)> items);
    }
}

using System;
using System.Linq;
using System.Threading.Tasks;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services;
using Core.Domain.Entities.WhatsApp;
using Core.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers.Admin
{
    public class SendMessageRequest
    {
        public string Content { get; set; } = string.Empty;
    }

    public class BotToggleRequest
    {
        public bool Enabled { get; set; }
    }

    [Authorize(Roles = "Admin")]
    [Route("api/admin/whatsapp")]
    public class AdminWhatsAppController : AdminBaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWhatsAppProvider _whatsAppProvider;

        public AdminWhatsAppController(IUnitOfWork unitOfWork, IWhatsAppProvider whatsAppProvider)
        {
            _unitOfWork = unitOfWork;
            _whatsAppProvider = whatsAppProvider;
        }

        #region Bot Kill Switch

        [HttpGet("bot-status")]
        public IActionResult GetBotStatus()
        {
            return Ok(new { enabled = WhatsAppWebhookController.IsBotEnabled });
        }

        [HttpPost("bot-toggle")]
        public IActionResult ToggleBot([FromBody] BotToggleRequest request)
        {
            WhatsAppWebhookController.IsBotEnabled = request.Enabled;
            var status = request.Enabled ? "مفعّل ✅" : "متوقف ⛔";
            Console.WriteLine($"🔘 Bot toggled to: {status} by Admin at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
            return Ok(new { enabled = WhatsAppWebhookController.IsBotEnabled, message = $"تم تغيير حالة البوت إلى: {status}" });
        }

        #endregion

        #region Conversations

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var allConversations = await _unitOfWork.WhatsAppConversations.GetAllAsync();
            var totalCount = allConversations.Count();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var result = allConversations
                .OrderByDescending(c => c.LastMessageAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new
                {
                    c.Id,
                    c.CustomerPhone,
                    c.CustomerName,
                    c.Mode,
                    StartedAt = c.StartedAt.AddHours(3),
                    LastMessageAt = c.LastMessageAt.AddHours(3)
                })
                .ToList();

            return Ok(new
            {
                totalCount,
                totalPages,
                currentPage = page,
                items = result
            });
        }

        [HttpGet("conversations/{id}")]
        public async Task<IActionResult> GetConversationDetails(Guid id)
        {
            var conversation = await _unitOfWork.WhatsAppConversations.GetByIdAsync(id);
            if (conversation == null) return NotFound();

            var messages = await _unitOfWork.WhatsAppMessages.FindAllAsync(m => m.ConversationId == id);
            var orderedMessages = messages.OrderBy(m => m.SentAt).ToList();

            return Ok(new
            {
                conversation.Id,
                conversation.CustomerPhone,
                conversation.CustomerName,
                conversation.Mode,
                StartedAt = conversation.StartedAt.AddHours(3),
                LastMessageAt = conversation.LastMessageAt.AddHours(3),
                conversation.Notes,
                Messages = orderedMessages.Select(m => new
                {
                    m.Id,
                    m.Direction,
                    m.SenderType,
                    m.Content,
                    m.MediaUrl,
                    SentAt = m.SentAt.AddHours(3),
                    m.IsRead
                })
            });
        }

        [HttpPost("conversations/{id}/takeover")]
        public async Task<IActionResult> TakeoverConversation(Guid id)
        {
            var conversation = await _unitOfWork.WhatsAppConversations.GetByIdAsync(id);
            if (conversation == null) return NotFound();

            conversation.Mode = ConversationMode.Human;
            conversation.Notes = "تم التدخل اليدوي من الداشبورد";
            
            _unitOfWork.WhatsAppConversations.Update(conversation);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { success = true, mode = conversation.Mode });
        }

        [HttpPost("conversations/{id}/release")]
        public async Task<IActionResult> ReleaseConversation(Guid id)
        {
            var conversation = await _unitOfWork.WhatsAppConversations.GetByIdAsync(id);
            if (conversation == null) return NotFound();

            conversation.Mode = ConversationMode.Bot;
            conversation.StartedAt = DateTime.UtcNow;
            conversation.LastMessageAt = DateTime.UtcNow;
            conversation.Notes = "تم إعادة المحادثة للبوت";
            
            _unitOfWork.WhatsAppConversations.Update(conversation);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { success = true, mode = conversation.Mode });
        }

        [HttpPost("conversations/{id}/send")]
        public async Task<IActionResult> SendMessage(Guid id, [FromBody] SendMessageRequest request)
        {
            var conversation = await _unitOfWork.WhatsAppConversations.GetByIdAsync(id);
            if (conversation == null) return NotFound();

            // IMPORTANT: When admin sends a message, automatically switch to Human mode
            // This prevents the bot from interfering when a human agent takes over
            if (conversation.Mode != ConversationMode.Human)
            {
                conversation.Mode = ConversationMode.Human;
                conversation.Notes = "تم التحويل تلقائياً للموظف بعد إرسال رسالة من الداشبورد";
                _unitOfWork.WhatsAppConversations.Update(conversation);
            }

            // Save the admin's message to database
            var message = new WhatsAppMessage
            {
                Id = Guid.NewGuid(),
                ConversationId = id,
                Direction = MessageDirection.Outbound,
                SenderType = MessageSender.Human,
                Content = request.Content,
                SentAt = DateTime.UtcNow,
                IsRead = true
            };

            await _unitOfWork.WhatsAppMessages.AddAsync(message);
            await _unitOfWork.SaveChangesAsync();

            // Send via WhatsApp Provider
            var destinationId = conversation.FreshchatConversationId ?? conversation.Id.ToString();
            await _whatsAppProvider.SendTextMessageAsync(destinationId, request.Content);

            return Ok(new { 
                success = true, 
                message = new {
                    message.Id,
                    message.Content,
                    message.SentAt,
                    message.SenderType
                },
                conversationMode = conversation.Mode
            });
        }

        #endregion

        #region Knowledge Base

        [HttpGet("knowledge")]
        public async Task<IActionResult> GetKnowledge()
        {
            var knowledge = await _unitOfWork.WhatsAppKnowledge.GetAllAsync();
            var result = knowledge.OrderByDescending(k => k.Priority).ToList();
            return Ok(result);
        }

        [HttpPost("knowledge")]
        public async Task<IActionResult> AddKnowledge([FromBody] WhatsAppKnowledge dto)
        {
            dto.Id = Guid.NewGuid();
            dto.CreatedAt = DateTime.UtcNow;
            dto.UpdatedAt = DateTime.UtcNow;
            
            await _unitOfWork.WhatsAppKnowledge.AddAsync(dto);
            await _unitOfWork.SaveChangesAsync();

            return Ok(dto);
        }

        [HttpPut("knowledge/{id}")]
        public async Task<IActionResult> UpdateKnowledge(Guid id, [FromBody] WhatsAppKnowledge dto)
        {
            var existing = await _unitOfWork.WhatsAppKnowledge.GetByIdAsync(id);
            if (existing == null) return NotFound();

            existing.Category = dto.Category;
            existing.Title = dto.Title;
            existing.Content = dto.Content;
            existing.ImageUrl = dto.ImageUrl;
            existing.IsActive = dto.IsActive;
            existing.Priority = dto.Priority;
            existing.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.WhatsAppKnowledge.Update(existing);
            await _unitOfWork.SaveChangesAsync();

            return Ok(existing);
        }

        [HttpDelete("knowledge/{id}")]
        public async Task<IActionResult> DeleteKnowledge(Guid id)
        {
            var existing = await _unitOfWork.WhatsAppKnowledge.GetByIdAsync(id);
            if (existing == null) return NotFound();

            _unitOfWork.WhatsAppKnowledge.Delete(existing);
            await _unitOfWork.SaveChangesAsync();

            return Ok();
        }

        #endregion
    }
}

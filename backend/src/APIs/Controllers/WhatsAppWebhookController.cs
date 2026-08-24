using System;
using System.Collections.Concurrent;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using APIs.Helpers;
using Core.Application.Services.WhatsApp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using APIs.Filters;
using Microsoft.EntityFrameworkCore;

namespace APIs.Controllers
{
    [ApiController]
    [Route("api/whatsapp/webhook")]
    public class WhatsAppWebhookController : ControllerBase
    {
        private readonly IServiceScopeFactory _scopeFactory;

        // Deduplication: track message IDs we've already processed using IMemoryCache
        private readonly Microsoft.Extensions.Caching.Memory.IMemoryCache _cache;
        private readonly IConfiguration _configuration;
        private readonly System.Net.Http.IHttpClientFactory _httpClientFactory;

        // Timer-based debounce (replaces MemoryCache which was lazy and unreliable)
        private static readonly ConcurrentDictionary<string, DebounceEntry> _debounceTimers = new();
        private static readonly ConcurrentDictionary<string, byte> _processingLock = new();

        // Runtime kill switch — can be toggled via Admin API without restart
        private static bool? _isBotEnabled = null;
        public static bool IsBotEnabled
        {
            get => _isBotEnabled ?? true;
            set => _isBotEnabled = value;
        }

        public WhatsAppWebhookController(IServiceScopeFactory scopeFactory, Microsoft.Extensions.Caching.Memory.IMemoryCache cache, IConfiguration configuration, System.Net.Http.IHttpClientFactory httpClientFactory)
        {
            _scopeFactory = scopeFactory;
            _cache = cache;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;

            // Initialize from appsettings only on first request (if not yet set via API)
            if (_isBotEnabled == null)
            {
                var isBotEnabledStr = _configuration["WhatsAppSettings:IsBotEnabled"];
                if (!string.IsNullOrEmpty(isBotEnabledStr) && bool.TryParse(isBotEnabledStr, out var parsed))
                    _isBotEnabled = parsed;
                else
                    _isBotEnabled = true;
            }
        }

        [HttpPost]
        [FreshchatSignature]
        public async Task<IActionResult> ReceiveMessage([FromBody] JsonElement payload)
        {
            // ===== INSTANCE KILL SWITCH (for B2B) =====
            var enabledOnThisInstanceStr = _configuration["WhatsAppSettings:EnabledOnThisInstance"];
            if (!string.IsNullOrEmpty(enabledOnThisInstanceStr) && bool.TryParse(enabledOnThisInstanceStr, out var enabledOnThisInstance) && !enabledOnThisInstance)
            {
                BotLogger.Log($"⚠️ Webhook ignored because Bot is disabled on this specific instance via appsettings.");
                return Ok();
            }
            // ===========================================

            try
            {
                var action = payload.TryGetProperty("action", out var actionElement) ? actionElement.GetString() : "unknown";
                BotLogger.Log($"📩 Webhook received. Action: {action}");

                if (action == "conversation_status_update")
                {
                    var dataConv = payload.GetProperty("data").GetProperty("conversation");
                    var conversationId = dataConv.GetProperty("conversation_id").GetString();
                    var status = dataConv.GetProperty("status").GetString();
                    
                    if (status == "resolved" && !string.IsNullOrEmpty(conversationId))
                    {
                        BotLogger.Log($"✅ Conversation {conversationId} resolved by Agent. Resetting state.");
                        using var scope = _scopeFactory.CreateScope();
                        var unitOfWork = scope.ServiceProvider.GetRequiredService<Core.Application.Abstraction.Interfaces.IUnitOfWork>();
                        var convs = await unitOfWork.WhatsAppConversations.FindAllAsync(c => c.FreshchatConversationId == conversationId);
                        var conv = convs.OrderByDescending(c => c.StartedAt).FirstOrDefault();
                        
                        if (conv != null && conv.Mode != Core.Domain.Enums.ConversationMode.Closed)
                        {
                            conv.Mode = Core.Domain.Enums.ConversationMode.Closed;
                            conv.Notes = "تم إغلاق المحادثة من قبل الموظف (Resolved)";
                            unitOfWork.WhatsAppConversations.Update(conv);
                            await unitOfWork.SaveChangesAsync();
                        }
                    }
                    return Ok();
                }

                if (action == "message_create")
                {
                    var actorType = payload.GetProperty("actor").GetProperty("actor_type").GetString();

                    var dataMessage = payload.GetProperty("data").GetProperty("message");
                    var conversationId = dataMessage.GetProperty("conversation_id").GetString();
                    BotLogger.Log($"👤 Actor: {actorType} | ConvID: {conversationId}");

                    // Allowed Conversation IDs check (for local testing mode)
                    var allowedIdsStr = _configuration["WhatsAppSettings:AllowedConversationIds"];
                    if (!string.IsNullOrEmpty(allowedIdsStr) && !string.IsNullOrEmpty(conversationId))
                    {
                        var allowedIds = allowedIdsStr.Split(',', StringSplitOptions.RemoveEmptyEntries)
                            .Select(id => id.Trim())
                            .ToList();
                        
                        if (allowedIds.Count > 0 && !allowedIds.Contains(conversationId))
                        {
                            BotLogger.Log($"⏭️ Webhook ignored because ConvID: {conversationId} is not in AllowedConversationIds.");
                            return Ok();
                        }
                    }

                    // Ignore non-user messages
                    if (actorType == "bot" || actorType == "system")
                    {
                        BotLogger.Log($"⏭️ Ignoring {actorType} message");
                        return Ok();
                    }

                    if (actorType == "agent")
                    {
                        var actorId = payload.GetProperty("actor").TryGetProperty("actor_id", out var actorIdElement) 
                            ? actorIdElement.GetString() 
                            : "";

                        // Extract message content first
                        var agentMsgContent = "";
                        if (dataMessage.TryGetProperty("message_parts", out var agentParts) && agentParts.GetArrayLength() > 0)
                        {
                            var fp = agentParts[0];
                            if (fp.TryGetProperty("text", out var to) && to.TryGetProperty("content", out var ce))
                                agentMsgContent = ce.GetString() ?? "";
                        }

                        using var scope = _scopeFactory.CreateScope();
                        var unitOfWork = scope.ServiceProvider.GetRequiredService<Core.Application.Abstraction.Interfaces.IUnitOfWork>();
                        
                        // Ignore if it's our bot's own message (by comparing with recently saved DB message)
                        var convs = await unitOfWork.WhatsAppConversations.FindAllAsync(c => c.FreshchatConversationId == conversationId);
                        var conv = convs.OrderByDescending(c => c.StartedAt).FirstOrDefault();
                        if (conv != null)
                        {
                            var lastBotMessage = (await unitOfWork.WhatsAppMessages.FindAllAsync(m => m.ConversationId == conv.Id && m.SenderType == Core.Domain.Enums.MessageSender.Bot))
                                .OrderByDescending(m => m.SentAt)
                                .FirstOrDefault();
                            
                            if (lastBotMessage != null)
                            {
                                var dbContent = lastBotMessage.Content?.Replace("\r\n", "\n").Trim() ?? "";
                                var incomingContent = agentMsgContent?.Replace("\r\n", "\n").Trim() ?? "";
                                
                                if (dbContent == incomingContent && (DateTime.UtcNow - lastBotMessage.SentAt).TotalSeconds < 30)
                                {
                                    BotLogger.Log($"⏭️ Our own bot message (matched DB content), ignoring");
                                    return Ok();
                                }
                            }
                        }

                        // Known Freshworks automation patterns
                        var isAutomation = agentMsgContent.Contains("ترحب بك") 
                            || agentMsgContent.Contains("نرحب بك")
                            || agentMsgContent.Contains("خارج وقت الدوام")
                            || agentMsgContent.Contains("اكتب 1")
                            || agentMsgContent.Contains("اكتب 2")
                            || agentMsgContent.Contains("اكتب 3")
                            || agentMsgContent.Contains("التحويل للقسم")
                            || agentMsgContent.Contains("سيتم تحويل")
                            || agentMsgContent.Contains("الحجوزات الجديده")
                            || agentMsgContent.Contains("الحجوزات السابقة")
                            || agentMsgContent.Contains("خدمة العملاء")
                            || agentMsgContent.Contains("تم استلام طلبك")
                            || agentMsgContent.Contains("تم استلام تفاصيل");

                        if (isAutomation)
                        {
                            BotLogger.Log($"🤖 Freshworks automation message detected, ignoring: '{agentMsgContent.Substring(0, Math.Min(50, agentMsgContent.Length))}...'");
                            return Ok(); // Ignore automation messages
                        }

                        // Genuine human agent message
                        BotLogger.Log($"👨‍💼 REAL human agent message, switching to Human mode. Content: '{agentMsgContent.Substring(0, Math.Min(50, agentMsgContent.Length))}...'");
                        if (!string.IsNullOrEmpty(conversationId))
                        {
                            var agentService = scope.ServiceProvider.GetRequiredService<WhatsAppAgentService>();
                            await agentService.MarkConversationAsHumanAsync(conversationId, "", "عميل Freshchat");
                            
                            // Get the newly created or existing conversation
                            convs = await unitOfWork.WhatsAppConversations.FindAllAsync(c => c.FreshchatConversationId == conversationId);
                            conv = convs.OrderByDescending(c => c.StartedAt).FirstOrDefault();

                            if (conv != null)
                            {
                                // Get real agent name from Freshchat API
                                if (string.IsNullOrEmpty(conv.AssignedAgentName) || conv.AssignedAgentName.Contains("???") || conv.AssignedAgentName.Length > 20)
                                {
                                    var realAgentName = await GetFreshchatAgentNameAsync(actorId);
                                    if (!string.IsNullOrEmpty(realAgentName))
                                    {
                                        conv.AssignedAgentName = realAgentName;
                                        unitOfWork.WhatsAppConversations.Update(conv);
                                    }
                                }

                                if (!string.IsNullOrWhiteSpace(agentMsgContent))
                                {
                                    var humanMsg = new Core.Domain.Entities.WhatsApp.WhatsAppMessage
                                    {
                                        Id = Guid.NewGuid(),
                                        ConversationId = conv.Id,
                                        Direction = Core.Domain.Enums.MessageDirection.Outbound,
                                        SenderType = Core.Domain.Enums.MessageSender.Human,
                                        Content = agentMsgContent,
                                        SentAt = DateTime.UtcNow
                                    };
                                    await unitOfWork.WhatsAppMessages.AddAsync(humanMsg);
                                }
                                await unitOfWork.SaveChangesAsync();
                            }
                        }
                        return Ok();
                    }

                    if (actorType != "user")
                    {
                        if (actorType == "agent")
                        {
                            using var scope = _scopeFactory.CreateScope();
                            var unitOfWork = scope.ServiceProvider.GetRequiredService<Core.Application.Abstraction.Interfaces.IUnitOfWork>();
                            var dbConvs = await unitOfWork.WhatsAppConversations.FindAllAsync(c => c.FreshchatConversationId == conversationId);
                            var conv = dbConvs.OrderByDescending(c => c.StartedAt).FirstOrDefault();
                            
                            // 1. Force Human Mode for existing conversation
                            if (conv != null && conv.Mode != Core.Domain.Enums.ConversationMode.Human)
                            {
                                BotLogger.Log($"👨‍💼 Agent replied to ConvID: {conversationId}. Forcing Human mode immediately!");
                                conv.Mode = Core.Domain.Enums.ConversationMode.Human;
                                conv.LastAgentMessageAt = DateTime.UtcNow;
                                unitOfWork.WhatsAppConversations.Update(conv);
                                await unitOfWork.SaveChangesAsync();
                            }
                            // 2. Create new conversation in Human mode if it doesn't exist
                            else if (conv == null)
                            {
                                BotLogger.Log($"👨‍💼 Agent initiated a new conversation ConvID: {conversationId}. Creating in Human mode!");
                                var newConv = new Core.Domain.Entities.WhatsApp.WhatsAppConversation
                                {
                                    Id = Guid.NewGuid(),
                                    FreshchatConversationId = conversationId,
                                    CustomerPhone = "Freshchat-" + conversationId.Substring(0, Math.Min(8, conversationId.Length)),
                                    CustomerName = "عميل Freshchat",
                                    Mode = Core.Domain.Enums.ConversationMode.Human,
                                    StartedAt = DateTime.UtcNow,
                                    LastMessageAt = DateTime.UtcNow,
                                    LastAgentMessageAt = DateTime.UtcNow
                                };
                                await unitOfWork.WhatsAppConversations.AddAsync(newConv);
                                await unitOfWork.SaveChangesAsync();
                            }
                        }
                        return Ok();
                    }

                    // Deduplication
                    var messageId = payload.TryGetProperty("data", out var data) && data.TryGetProperty("message", out var msg) && msg.TryGetProperty("id", out var id) 
                        ? id.GetString() 
                        : null;
                    
                    if (messageId != null)
                    {
                        var cacheKey = $"WhatsAppWebhook_Processed_{messageId}";
                        if (_cache.TryGetValue(cacheKey, out _))
                        {
                            BotLogger.Log($"🔄 Duplicate message {messageId}, skipping.");
                            return Ok();
                        }
                        _cache.Set(cacheKey, true, TimeSpan.FromMinutes(10));
                    }

                    // Extract content
                    var content = "";
                    if (dataMessage.TryGetProperty("message_parts", out var parts) && parts.GetArrayLength() > 0)
                    {
                        var textContent = "";
                        var mediaContent = "";
                        foreach (var part in parts.EnumerateArray())
                        {
                            // Diagnostic: Log raw part structure for non-text parts
                            if (!part.TryGetProperty("text", out _))
                            {
                                BotLogger.Log($"📦 Non-text message_part received: {part.ToString().Substring(0, Math.Min(200, part.ToString().Length))}");
                            }
                            
                            if (part.TryGetProperty("text", out var textObj) && textObj.TryGetProperty("content", out var contentElement))
                            {
                                var textVal = contentElement.GetString() ?? "";
                                if (!textVal.EndsWith(".ogg", StringComparison.OrdinalIgnoreCase) &&
                                    !textVal.EndsWith(".opus", StringComparison.OrdinalIgnoreCase) &&
                                    !textVal.EndsWith(".mp3", StringComparison.OrdinalIgnoreCase) &&
                                    !textVal.EndsWith(".m4a", StringComparison.OrdinalIgnoreCase) &&
                                    !textVal.EndsWith(".wav", StringComparison.OrdinalIgnoreCase) &&
                                    !textVal.Contains("_File.", StringComparison.OrdinalIgnoreCase))
                                {
                                    textContent += textVal + "\n";
                                }
                            }

                            if (part.TryGetProperty("image", out var imgObj) && imgObj.TryGetProperty("url", out var imgUrl))
                            {
                                var url = imgUrl.GetString();
                                try {
                                    var bytes = await DownloadFreshchatMediaAsync(url);
                                    if (bytes != null) {
                                        var b64 = Convert.ToBase64String(bytes);
                                        mediaContent += $"[IMAGE: data:image/jpeg;base64,{b64}]\n";
                                    }
                                } catch (Exception ex) { BotLogger.Log($"Image Download Error: {ex.Message}"); }
                            }

                            if ((part.TryGetProperty("audio", out var mObj) || part.TryGetProperty("voice", out mObj)) && mObj.TryGetProperty("url", out var mUrl))
                            {
                                var url = mUrl.GetString();
                                try {
                                    using var scope = _scopeFactory.CreateScope();
                                    var groqService = scope.ServiceProvider.GetRequiredService<Infrastructure.Shared.Services.GroqAiService>();
                                    var bytes = await DownloadFreshchatMediaAsync(url);
                                    if (bytes != null) {
                                        var transcript = await groqService.TranscribeAudioAsync(bytes, "audio.ogg");
                                            if (!string.IsNullOrEmpty(transcript)) {
                                                mediaContent += $"{transcript}\n";
                                                BotLogger.Log($"🎤 Voice transcribed: '{transcript}'");
                                            }
                                    }
                                } catch (Exception ex) { BotLogger.Log($"Audio Transcription Error: {ex.Message}"); }
                            }

                            if (part.TryGetProperty("file", out var fileObj)) 
                            {
                                var fileContentType = fileObj.TryGetProperty("content_type", out var ctProp) ? ctProp.GetString() ?? "" : "";
                                var fileUrl = fileObj.TryGetProperty("url", out var fuProp) ? fuProp.GetString() ?? "" : "";
                                var fileName2 = fileObj.TryGetProperty("name", out var fnProp) ? fnProp.GetString() ?? "" : "";
                                
                                BotLogger.Log($"📎 File part received: content_type={fileContentType}, name={fileName2}, url_exists={!string.IsNullOrEmpty(fileUrl)}");

                                if (fileContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrEmpty(fileUrl))
                                {
                                    // Image sent as file (common in WhatsApp → Freshchat)
                                    try {
                                        var bytes = await DownloadFreshchatMediaAsync(fileUrl);
                                        if (bytes != null) {
                                            var b64 = Convert.ToBase64String(bytes);
                                            mediaContent += $"[IMAGE: data:{fileContentType};base64,{b64}]\n";
                                            BotLogger.Log($"🖼️ Image processed successfully ({bytes.Length} bytes)");
                                        }
                                    } catch (Exception ex) { BotLogger.Log($"Image Download Error (file handler): {ex.Message}"); }
                                }
                                else if ((fileContentType.StartsWith("audio/", StringComparison.OrdinalIgnoreCase) 
                                       || fileContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase)
                                       || fileContentType.Contains("ogg", StringComparison.OrdinalIgnoreCase)
                                       || fileContentType.Contains("opus", StringComparison.OrdinalIgnoreCase)
                                       || fileName2.EndsWith(".ogg", StringComparison.OrdinalIgnoreCase)
                                       || fileName2.EndsWith(".opus", StringComparison.OrdinalIgnoreCase)
                                       || fileName2.EndsWith(".mp3", StringComparison.OrdinalIgnoreCase)
                                       || fileName2.EndsWith(".m4a", StringComparison.OrdinalIgnoreCase)
                                       || fileName2.EndsWith(".wav", StringComparison.OrdinalIgnoreCase)) 
                                       && !string.IsNullOrEmpty(fileUrl))
                                {
                                    // Voice message sent as file (common in WhatsApp → Freshchat)
                                    try {
                                        using var scope2 = _scopeFactory.CreateScope();
                                        var groqService2 = scope2.ServiceProvider.GetRequiredService<Infrastructure.Shared.Services.GroqAiService>();
                                        var bytes = await DownloadFreshchatMediaAsync(fileUrl);
                                        if (bytes != null) {
                                            var audioFileName = !string.IsNullOrEmpty(fileName2) ? fileName2 : "audio.ogg";
                                            var transcript = await groqService2.TranscribeAudioAsync(bytes, audioFileName);
                                            if (!string.IsNullOrEmpty(transcript)) {
                                                mediaContent += $"{transcript}\n";
                                                BotLogger.Log($"🎤 Voice transcribed: '{transcript}'");
                                            }
                                        }
                                    } catch (Exception ex) { BotLogger.Log($"Audio Transcription Error (file handler): {ex.Message}"); }
                                }
                                else
                                {
                                    // Actual document (PDF, Word, etc.)
                                    mediaContent += "[FILE]\n";
                                    BotLogger.Log($"📄 Unsupported file type: {fileContentType} / {fileName2}");
                                }
                            }
                        }
                        content = (textContent + "\n" + mediaContent).Trim();
                    }

                    BotLogger.Log($"💬 Content extracted: '{content}'");

                    if (string.IsNullOrEmpty(content) || string.IsNullOrEmpty(conversationId))
                    {
                        BotLogger.Log($"⚠️ Empty content or conversationId, skipping");
                        return Ok();
                    }

                    // Fetch user phone from Freshchat if available
                    var userId = payload.GetProperty("actor").TryGetProperty("actor_id", out var uid) ? uid.GetString() : null;
                    var userDetails = await GetFreshchatUserDetailsAsync(userId ?? "");
                    var customerPhone = userDetails.Phone;
                    var customerName = string.IsNullOrEmpty(userDetails.Name) ? "عميل Freshchat" : userDetails.Name;

                    // Sync assignment status directly from API to prevent bot from hijacking old human conversations
                    // (The message_create payload usually does NOT contain assigned_agent_id)
                    var convDetails = await GetConversationDetailsFromFreshchatAsync(conversationId);
                    customerPhone = convDetails.Phone ?? customerPhone;
                    
                    // Check DB conversation state to see if it's in Human mode
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var unitOfWork = scope.ServiceProvider.GetRequiredService<Core.Application.Abstraction.Interfaces.IUnitOfWork>();
                        var dbConvs = await unitOfWork.WhatsAppConversations.FindAllAsync(c => c.FreshchatConversationId == conversationId);
                        var dbConv = dbConvs.OrderByDescending(c => c.StartedAt).FirstOrDefault();

                        if (dbConv != null && dbConv.Mode == Core.Domain.Enums.ConversationMode.Human)
                        {
                            BotLogger.Log($"👨‍💼 Conversation {conversationId} is in Human mode in DB. Ignoring bot processing.");
                            return Ok(); // Ignore message completely, it's a human chat!
                        }
                    }

                    // ====== TIMER-BASED DEBOUNCE (replaces broken MemoryCache approach) ======
                    var entry = _debounceTimers.GetOrAdd(conversationId, cid => new DebounceEntry(cid, _scopeFactory));
                    entry.AddMessage(content, customerPhone, customerName);

                    BotLogger.Log($"⏱️ Message buffered for {conversationId}. Total: {entry.GetCombinedLength()} chars. Waiting 10s...");
                    Console.WriteLine($"Webhook: Message buffered for {conversationId}. Total: {entry.GetCombinedLength()} chars");
                }
                else if (action == "conversation_resolution" || action == "conversation_reopen" || action == "conversation_assignment")
                {
                    var dataProp = payload.GetProperty("data");
                    string? conversationId = null;
                    
                    if (action == "conversation_resolution" && dataProp.TryGetProperty("resolve", out var resolveProp) && 
                        resolveProp.TryGetProperty("conversation", out var resConv) && resConv.TryGetProperty("conversation_id", out var resId))
                    {
                        conversationId = resId.GetString();
                    }
                    else if (action == "conversation_reopen" && dataProp.TryGetProperty("reopen", out var reopenProp) && 
                             reopenProp.TryGetProperty("conversation", out var reoConv) && reoConv.TryGetProperty("conversation_id", out var reoId))
                    {
                        conversationId = reoId.GetString();
                    }
                    else if (dataProp.TryGetProperty("conversation", out var convProp) && convProp.TryGetProperty("conversation_id", out var idProp1))
                    {
                        conversationId = idProp1.GetString();
                    }
                    else if (dataProp.TryGetProperty("conversation_id", out var idProp2))
                    {
                        conversationId = idProp2.GetString();
                    }
                    else if (dataProp.TryGetProperty("message", out var msgProp) && msgProp.TryGetProperty("conversation_id", out var idProp3))
                    {
                        conversationId = idProp3.GetString();
                    }
                    
                    if (string.IsNullOrEmpty(conversationId))
                    {
                        BotLogger.Log($"⚠️ Could not extract conversation_id from {action} webhook. Raw payload: {payload.GetRawText()}");
                        return Ok();
                    }

                    BotLogger.Log($"🔄 Conversation {action} for ConvID: {conversationId}");
                    
                    if (!string.IsNullOrEmpty(conversationId))
                    {
                        using var scope = _scopeFactory.CreateScope();
                        var unitOfWork = scope.ServiceProvider.GetRequiredService<Core.Application.Abstraction.Interfaces.IUnitOfWork>();
                        var convs = await unitOfWork.WhatsAppConversations.FindAllAsync(c => c.FreshchatConversationId == conversationId);
                        var conv = convs.OrderByDescending(c => c.StartedAt).FirstOrDefault();
                        
                        if (conv != null)
                        {
                            if (action == "conversation_assignment" || action == "conversation_reopen")
                            {
                                conv.Mode = Core.Domain.Enums.ConversationMode.Human;
                                conv.LastAgentMessageAt = DateTime.UtcNow;
                                BotLogger.Log($"👨‍💼 ConvID: {conversationId} {action}. Switching to Human mode.");
                            }
                            else if (action == "conversation_resolution")
                            {
                                conv.Mode = Core.Domain.Enums.ConversationMode.Bot;
                                conv.LastAgentMessageAt = null;
                                var retargetedFlag = (conv.Notes != null && conv.Notes.Contains("[RETARGETED]")) ? " [RETARGETED]" : "";
                                conv.Notes = $"[STATE:MainMenu] تم إعادة تعيين البوت بسبب {action}{retargetedFlag}";
                                BotLogger.Log($"✅ Reset ConvID: {conversationId} to Bot mode successfully due to {action}.");
                            }
                            
                            unitOfWork.WhatsAppConversations.Update(conv);
                            await unitOfWork.SaveChangesAsync();
                        }
                    }
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                BotLogger.Log($"❌ Webhook Parse Error: {ex.Message}");
                Console.WriteLine($"Webhook Parse Error: {ex.Message}");
            }

            return Ok();
        }

        [HttpPost("simulate")]
        public async Task<IActionResult> SimulateMessage([FromBody] JsonElement payload)
        {
            var conversationId = payload.TryGetProperty("conversationId", out var cidElement) ? cidElement.GetString() : null;
            var content = payload.TryGetProperty("content", out var contentElement) ? contentElement.GetString() : null;
            var imageUrl = payload.TryGetProperty("imageUrl", out var imgElement) ? imgElement.GetString() : null;

            if (string.IsNullOrEmpty(content) && string.IsNullOrEmpty(imageUrl))
            {
                return BadRequest("content or imageUrl is required.");
            }
            if (string.IsNullOrEmpty(conversationId))
            {
                return BadRequest("conversationId is required.");
            }

            if (!string.IsNullOrEmpty(imageUrl))
            {
                content = $"{(content ?? "")}\n[IMAGE: {imageUrl}]".Trim();
            }

            using var scope = _scopeFactory.CreateScope();
            var agentService = scope.ServiceProvider.GetRequiredService<WhatsAppAgentService>();
            
            // Process the message using our standard chatbot service
            await agentService.HandleIncomingMessageAsync(conversationId, "عميل تجريبي", content, null, IsBotEnabled);

            // Read the last bot reply from the database to return it to the UI
            var unitOfWork = scope.ServiceProvider.GetRequiredService<Core.Application.Abstraction.Interfaces.IUnitOfWork>();
            var openConversations = await unitOfWork.WhatsAppConversations
                .Query(c => c.FreshchatConversationId == conversationId && c.Mode != Core.Domain.Enums.ConversationMode.Closed)
                .OrderByDescending(c => c.StartedAt)
                .FirstOrDefaultAsync();
            var conversation = openConversations;
            
            if (conversation != null)
            {
                var lastReply = await unitOfWork.WhatsAppMessages
                    .Query(m => m.ConversationId == conversation.Id && m.Direction == Core.Domain.Enums.MessageDirection.Outbound)
                    .OrderByDescending(m => m.SentAt)
                    .FirstOrDefaultAsync();
                
                var currentState = "";
                if (conversation.Notes?.StartsWith("[STATE:") == true)
                {
                    var endIdx = conversation.Notes.IndexOf("]");
                    if (endIdx > 7)
                    {
                        currentState = conversation.Notes.Substring(7, endIdx - 7);
                    }
                }

                return Ok(new 
                { 
                    reply = lastReply?.Content ?? "تم استلام الرسالة ولكن لم يتم توليد رد.",
                    state = currentState,
                    mode = conversation.Mode.ToString()
                });
            }

            return Ok(new { reply = "لم يتم العثور على المحادثة النشطة." });
        }

        /// <summary>
        /// Manages debounce timer + message buffer for a single conversation.
        /// Uses System.Threading.Timer which fires RELIABLY on schedule.
        /// </summary>
        private class DebounceEntry
        {
            private readonly string _conversationId;
            private readonly IServiceScopeFactory _scopeFactory;
            private readonly object _lock = new();
            private readonly System.Collections.Generic.List<string> _messages = new();
            private string? _customerPhone;
            private string? _customerName;
            private Timer? _timer;
            private const int DebounceMs = 5_000; // 5 seconds (increased from 2s to group fast multi-messages)

            public DebounceEntry(string conversationId, IServiceScopeFactory scopeFactory)
            {
                _conversationId = conversationId;
                _scopeFactory = scopeFactory;
            }

            public void AddMessage(string content, string? customerPhone = null, string? customerName = null)
            {
                lock (_lock)
                {
                    _messages.Add(content);
                    if (!string.IsNullOrEmpty(customerPhone))
                    {
                        _customerPhone = customerPhone;
                    }
                    if (!string.IsNullOrEmpty(customerName))
                    {
                        _customerName = customerName;
                    }
                    
                    // Reset/start the timer - fires DebounceMs after the LAST message
                    _timer?.Dispose();
                    _timer = new Timer(OnTimerFired, null, DebounceMs, Timeout.Infinite);
                }
            }

            public int GetCombinedLength()
            {
                lock (_lock)
                {
                    return string.Join("\n", _messages).Length;
                }
            }

            private void OnTimerFired(object? state)
            {
                _ = Task.Run(async () => 
                {
                    // Prevent duplicate concurrent processing
                    if (!_processingLock.TryAdd(_conversationId, 0))
                    {
                        BotLogger.Log($"🔒 AI already processing for {_conversationId}, skipping timer. Messages remain in buffer.");
                        Console.WriteLine($"Webhook: AI already processing for {_conversationId}, skipping.");
                        return;
                    }

                    try
                    {
                        while (true)
                        {
                            string combinedText;
                            lock (_lock)
                            {
                                if (_messages.Count == 0) break;
                                combinedText = string.Join("\n", _messages);
                                _messages.Clear();
                                _timer?.Dispose();
                                _timer = null;
                            }

                            BotLogger.Log($"🚀 Processing for {_conversationId}. Text: '{combinedText}'");
                            Console.WriteLine($"Webhook Timer: Executing AI for {_conversationId}. Text: {combinedText.Length} chars");
                            
                            using var scope = _scopeFactory.CreateScope();
                            var agentService = scope.ServiceProvider.GetRequiredService<WhatsAppAgentService>();
                            await agentService.HandleIncomingMessageAsync(_conversationId, _customerName ?? "عميل Freshchat", combinedText, _customerPhone, IsBotEnabled);
                            BotLogger.Log($"✅ AI processing completed for {_conversationId}");
                        }
                    }
                    catch (Exception ex)
                    {
                        BotLogger.Log($"❌ ERROR: {ex.Message}\n{ex.StackTrace}");
                        Console.WriteLine($"Webhook Timer Error: {ex.Message}");
                    }
                    finally
                    {
                        _processingLock.TryRemove(_conversationId, out _);
                        lock (_lock)
                        {
                            if (_messages.Count == 0)
                            {
                                // Remove this entry only if no new messages arrived
                                _debounceTimers.TryRemove(_conversationId, out _);
                            }
                            else
                            {
                                // New messages arrived just as we finished processing, restart timer
                                _timer?.Dispose();
                                _timer = new Timer(OnTimerFired, null, DebounceMs, Timeout.Infinite);
                            }
                        }
                    }
                });
            }
        }
        private async Task<string?> GetFreshchatAgentNameAsync(string actorId)
        {
            if (string.IsNullOrEmpty(actorId)) return null;
            
            var cacheKey = $"AgentName_{actorId}";
            if (_cache.TryGetValue(cacheKey, out string? cachedName) && !string.IsNullOrEmpty(cachedName))
            {
                return cachedName;
            }

            try
            {
                var domain = _configuration["WhatsAppSettings:FreshchatDomain"];
                var apiKey = _configuration["WhatsAppSettings:FreshchatApiKey"];
                if (string.IsNullOrEmpty(domain) || string.IsNullOrEmpty(apiKey)) return null;

                var baseUrl = $"https://{domain.TrimEnd('/')}";
                if (!baseUrl.EndsWith("/v2")) baseUrl += "/v2";

                using var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                
                var response = await client.GetAsync($"{baseUrl}/agents");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    using var doc = System.Text.Json.JsonDocument.Parse(json);
                    
                    if (doc.RootElement.TryGetProperty("agents", out var agents))
                    {
                        foreach (var agent in agents.EnumerateArray())
                        {
                            if (agent.TryGetProperty("id", out var idElement) && idElement.GetString() == actorId)
                            {
                                var firstName = agent.TryGetProperty("first_name", out var fn) ? fn.GetString() : "";
                                var lastName = agent.TryGetProperty("last_name", out var ln) ? ln.GetString() : "";
                                var fullName = $"{firstName} {lastName}".Trim();
                                
                                if (!string.IsNullOrEmpty(fullName))
                                {
                                    _cache.Set(cacheKey, fullName, TimeSpan.FromHours(24));
                                    return fullName;
                                }
                            }
                        }
                    }
                }
                else
                {
                    BotLogger.Log($"⚠️ Freshchat /agents API Error: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                BotLogger.Log($"⚠️ Error fetching agent name for {actorId}: {ex.Message}");
            }
            
            return null;
        }

        private async Task<(string? Phone, string? Name)> GetFreshchatUserDetailsAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId)) return (null, null);

            var cacheKey = $"UserDetails_{userId}";
            if (_cache.TryGetValue(cacheKey, out (string? Phone, string? Name) cached) && (!string.IsNullOrEmpty(cached.Phone) || !string.IsNullOrEmpty(cached.Name)))
            {
                return cached;
            }

            try
            {
                var domain = _configuration["WhatsAppSettings:FreshchatDomain"];
                var apiKey = _configuration["WhatsAppSettings:FreshchatApiKey"];
                if (string.IsNullOrEmpty(domain) || string.IsNullOrEmpty(apiKey)) return (null, null);

                var baseUrl = $"https://{domain.TrimEnd('/')}";
                if (!baseUrl.EndsWith("/v2")) baseUrl += "/v2";

                using var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                var response = await client.GetAsync($"{baseUrl}/users/{userId}");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    using var doc = System.Text.Json.JsonDocument.Parse(json);
                    
                    string? phone = null;
                    string? name = null;

                    if (doc.RootElement.TryGetProperty("phone", out var phoneElement) && phoneElement.GetString() != null)
                    {
                        phone = phoneElement.GetString();
                    }
                    if (doc.RootElement.TryGetProperty("first_name", out var fnElement) && fnElement.GetString() != null)
                    {
                        name = fnElement.GetString();
                    }
                    if (doc.RootElement.TryGetProperty("last_name", out var lnElement) && lnElement.GetString() != null)
                    {
                        name = string.IsNullOrEmpty(name) ? lnElement.GetString() : name + " " + lnElement.GetString();
                    }

                    if (!string.IsNullOrEmpty(phone) || !string.IsNullOrEmpty(name))
                    {
                        _cache.Set(cacheKey, (phone, name), TimeSpan.FromHours(24));
                        return (phone, name);
                    }
                }
            }
            catch (Exception ex)
            {
                BotLogger.Log($"⚠️ Error fetching user phone for {userId}: {ex.Message}");
            }

            return (null, null);
        }

        [HttpPost("run-migration")]
        public async Task<IActionResult> RunDataMigration([FromQuery] int days = 14)
        {
            // Fire and forget background task
            _ = Task.Run(async () =>
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<Core.Application.Abstraction.Interfaces.IUnitOfWork>();
                    
                    var cutoff = DateTime.UtcNow.AddDays(-days);
                    var convosToFix = (await unitOfWork.WhatsAppConversations.FindAllAsync(
                        c => c.StartedAt >= cutoff && 
                             !string.IsNullOrEmpty(c.FreshchatConversationId) && 
                             (c.CustomerPhone.StartsWith("Freshchat-") || 
                              string.IsNullOrEmpty(c.AssignedAgentName) || 
                              c.AssignedAgentName.Length > 20 || 
                              c.AssignedAgentName.Contains("???"))
                    )).ToList();

                    BotLogger.Log($"🔧 Starting Data Migration for {convosToFix.Count} conversations (Last {days} days)");

                    int count = 0;
                    foreach (var convo in convosToFix)
                    {
                        var details = await GetConversationDetailsFromFreshchatAsync(convo.FreshchatConversationId);
                        if (details.Phone != null && convo.CustomerPhone.StartsWith("Freshchat-"))
                        {
                            convo.CustomerPhone = details.Phone;
                        }
                        
                        if (details.AgentId != null)
                        {
                            var agentName = await GetFreshchatAgentNameAsync(details.AgentId);
                            if (!string.IsNullOrEmpty(agentName))
                            {
                                convo.AssignedAgentName = agentName;
                            }
                        }

                        unitOfWork.WhatsAppConversations.Update(convo);
                        count++;

                        // Save in batches of 50
                        if (count % 50 == 0)
                        {
                            await unitOfWork.SaveChangesAsync();
                            BotLogger.Log($"🔧 Migration Progress: {count}/{convosToFix.Count}");
                            await Task.Delay(1000); // Small delay to avoid DB/API pressure
                        }
                    }
                    
                    await unitOfWork.SaveChangesAsync();
                    BotLogger.Log($"✅ Data Migration Completed successfully for {count} conversations!");
                }
                catch (Exception ex)
                {
                    BotLogger.Log($"❌ Data Migration Error: {ex.Message}");
                }
            });

            return Ok(new { message = $"Migration started in background for the last {days} days." });
        }

        private async Task<(string? Phone, string? AgentId, string? GroupId)> GetConversationDetailsFromFreshchatAsync(string conversationId)
        {
            if (string.IsNullOrEmpty(conversationId)) return (null, null, null);

            try
            {
                var domain = _configuration["WhatsAppSettings:FreshchatDomain"];
                var apiKey = _configuration["WhatsAppSettings:FreshchatApiKey"];
                if (string.IsNullOrEmpty(domain) || string.IsNullOrEmpty(apiKey)) return (null, null, null);

                var baseUrl = $"https://{domain.TrimEnd('/')}";
                if (!baseUrl.EndsWith("/v2")) baseUrl += "/v2";

                using var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                var response = await client.GetAsync($"{baseUrl}/conversations/{conversationId}");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    using var doc = System.Text.Json.JsonDocument.Parse(json);
                    
                    string? phone = null;
                    string? agentId = null;
                    string? groupId = null;

                    if (doc.RootElement.TryGetProperty("users", out var usersArr) && usersArr.GetArrayLength() > 0)
                    {
                        var userObj = usersArr[0];
                        if (userObj.TryGetProperty("phone", out var pElement) && pElement.GetString() != null)
                        {
                            phone = pElement.GetString();
                        }
                    }

                    if (doc.RootElement.TryGetProperty("assigned_agent_id", out var agentIdElement) && agentIdElement.GetString() != null)
                    {
                        agentId = agentIdElement.GetString();
                    }

                    if (doc.RootElement.TryGetProperty("assigned_group_id", out var groupIdElement) && groupIdElement.GetString() != null)
                    {
                        groupId = groupIdElement.GetString();
                    }

                    return (phone, agentId, groupId);
                }
            }
            catch (Exception ex)
            {
                BotLogger.Log($"⚠️ Failed to fetch conversation details from Freshchat: {ex.Message}");
            }
            return (null, null, null);
        }
        private async Task<byte[]?> DownloadFreshchatMediaAsync(string url)
        {
            if (string.IsNullOrEmpty(url)) return null;
            try
            {
                using var client = _httpClientFactory.CreateClient();
                // 1. Try direct GET without Bearer header (works for S3/CDN pre-signed URLs)
                var response = await client.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadAsByteArrayAsync();
                    BotLogger.Log($"✅ Downloaded media ({data.Length} bytes) from URL");
                    return data;
                }

                // 2. Fallback: Try with Freshchat Bearer header if required by domain
                var apiKey = _configuration["WhatsAppSettings:FreshchatApiKey"];
                if (!string.IsNullOrEmpty(apiKey))
                {
                    using var clientAuth = _httpClientFactory.CreateClient();
                    clientAuth.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);
                    var responseAuth = await clientAuth.GetAsync(url);
                    if (responseAuth.IsSuccessStatusCode)
                    {
                        var data = await responseAuth.Content.ReadAsByteArrayAsync();
                        BotLogger.Log($"✅ Downloaded media ({data.Length} bytes) with Freshchat auth");
                        return data;
                    }
                    BotLogger.Log($"⚠️ Media download failed. Direct: {response.StatusCode}, Auth: {responseAuth.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                BotLogger.Log($"⚠️ Error downloading media from {url}: {ex.Message}");
            }
            return null;
        }
    }
}

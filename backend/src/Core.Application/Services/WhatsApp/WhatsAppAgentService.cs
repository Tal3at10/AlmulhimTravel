using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services;
using Core.Domain.Entities.WhatsApp;
using Core.Domain.Entities.Catalog;
using Core.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace Core.Application.Services.WhatsApp
{
    public class WhatsAppAgentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWhatsAppProvider _whatsAppProvider;
        private readonly IConfiguration _configuration;
        private readonly IAiService _aiService;
        private readonly WhatsAppIntentClassifier _intentClassifier;
        private readonly Core.Application.Abstraction.Services.Reservations.IVoucherProIntegrationService _voucherService;
        private readonly IEmbeddingService _embeddingService;
        private readonly IVectorDbService _vectorDbService;

        public WhatsAppAgentService(IUnitOfWork unitOfWork, IWhatsAppProvider whatsAppProvider, IConfiguration configuration, IAiService aiService, WhatsAppIntentClassifier intentClassifier, Core.Application.Abstraction.Services.Reservations.IVoucherProIntegrationService voucherService, IEmbeddingService embeddingService, IVectorDbService vectorDbService)
        {
            _unitOfWork = unitOfWork;
            _whatsAppProvider = whatsAppProvider;
            _configuration = configuration;
            _aiService = aiService;
            _intentClassifier = intentClassifier;
            _voucherService = voucherService;
            _embeddingService = embeddingService;
            _vectorDbService = vectorDbService;
        }

        public async Task HandleIncomingMessageAsync(string freshchatConversationId, string customerName, string messageContent, string? customerPhone = null, bool botEnabled = true)
        {
            try
            {
            var saudiTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById(System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(System.Runtime.InteropServices.OSPlatform.Windows) ? "Arab Standard Time" : "Asia/Riyadh"));
            var currentOfDay = saudiTime.TimeOfDay;
            bool isWorkingHours = saudiTime.DayOfWeek != DayOfWeek.Friday && 
                                   currentOfDay >= new TimeSpan(10, 0, 0) && 
                                   currentOfDay < new TimeSpan(20, 30, 0);

            var openConversations = await _unitOfWork.WhatsAppConversations
                .FindAllAsync(c => c.FreshchatConversationId == freshchatConversationId && c.Mode != ConversationMode.Closed);
            var conversation = openConversations
                .OrderByDescending(c => c.StartedAt)
                .FirstOrDefault();

            bool sessionExpired = false;
            if (conversation == null)
            {
                var phoneToSave = !string.IsNullOrEmpty(customerPhone) 
                    ? customerPhone 
                    : "Freshchat-" + freshchatConversationId.Substring(0, Math.Min(8, freshchatConversationId.Length));

                conversation = new WhatsAppConversation
                {
                    Id = Guid.NewGuid(),
                    FreshchatConversationId = freshchatConversationId,
                    CustomerPhone = phoneToSave,
                    CustomerName = customerName,
                    Mode = ConversationMode.Bot,
                    StartedAt = DateTime.UtcNow,
                    LastMessageAt = DateTime.UtcNow
                };
                await _unitOfWork.WhatsAppConversations.AddAsync(conversation);
            }
            else
            {
                if (!string.IsNullOrEmpty(customerPhone) && conversation.CustomerPhone.StartsWith("Freshchat-"))
                {
                    conversation.CustomerPhone = customerPhone;
                }
                var referenceTime = conversation.Mode == ConversationMode.Human 
                    ? (conversation.LastAgentMessageAt ?? conversation.LastMessageAt)
                    : conversation.LastMessageAt;
                var timeSinceLastMessage = DateTime.UtcNow - referenceTime;
                // if (conversation.Mode == ConversationMode.Human && timeSinceLastMessage > TimeSpan.FromHours(24))
                // {
                //     conversation.Mode = ConversationMode.Bot;
                //     conversation.Notes = "تم إعادة المحادثة لوضع البوت التلقائي بعد مرور 24 ساعة.";
                // }
                if (conversation.Mode == ConversationMode.Bot && timeSinceLastMessage > TimeSpan.FromHours(4))
                {
                    sessionExpired = true;
                    conversation.Notes = ""; // Reset state to trigger FreshworksMenu
                }
                conversation.CustomerName = customerName ?? conversation.CustomerName;
                conversation.LastMessageAt = DateTime.UtcNow;
                _unitOfWork.WhatsAppConversations.Update(conversation);
            }

            // Clean raw base64 strings for DB storage to prevent SQL Server string truncation
            var contentToSave = messageContent;
            if (!string.IsNullOrEmpty(contentToSave) && contentToSave.Contains("[IMAGE: data:image/"))
            {
                contentToSave = System.Text.RegularExpressions.Regex.Replace(contentToSave, @"\[IMAGE:\s*data:image/[^\]]+\]?", "[صورة مرفقة]", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            }

            var incomingMessage = new WhatsAppMessage
            {
                Id = Guid.NewGuid(),
                ConversationId = conversation.Id,
                Direction = MessageDirection.Inbound,
                SenderType = MessageSender.Customer,
                Content = contentToSave,
                SentAt = DateTime.UtcNow,
                IsRead = conversation.Mode == ConversationMode.Bot
            };
            await _unitOfWork.WhatsAppMessages.AddAsync(incomingMessage);
            await _unitOfWork.SaveChangesAsync();

            if (conversation.Mode == ConversationMode.Human)
            {
                return;
            }

            var responseText = "";
            var isHandoff = false;
            var rawInput = messageContent?.Trim() ?? "";
            if (string.IsNullOrWhiteSpace(rawInput)) return; // Issue 7: Ignore empty messages
            if (!rawInput.Contains("[IMAGE:") && rawInput.Length > 2000) rawInput = rawInput.Substring(0, 2000); // Prevent AI tokens overload for huge text messages (preserve images)
            var input = rawInput;

            
            // Normalize Arabic numerals to English numerals
            input = input.Replace("٠", "0").Replace("١", "1").Replace("٢", "2").Replace("٣", "3")
                         .Replace("٤", "4").Replace("٥", "5").Replace("٦", "6").Replace("٧", "7")
                         .Replace("٨", "8").Replace("٩", "9");
            
            bool isNewConversation = string.IsNullOrEmpty(conversation.Notes);
            var currentState = isNewConversation ? "FreshworksMenu" : "MainMenu";

            // Detect image or voice note messages and route directly to AI Supervisor (Gemini Vision / Groq Whisper)
            bool hasMedia = input.Contains("[IMAGE:") || input.EndsWith(".ogg", StringComparison.OrdinalIgnoreCase) || input.EndsWith(".mp3", StringComparison.OrdinalIgnoreCase) || input == "[MEDIA]";
            if (hasMedia)
            {
                // Parse state from Notes if available
                if (conversation.Notes?.StartsWith("[STATE:") == true)
                {
                    var endIdx = conversation.Notes.IndexOf(']');
                    if (endIdx > 7) currentState = conversation.Notes.Substring(7, endIdx - 7);
                }

                var aiResult = await ProcessWithAISupervisorAsync(rawInput, currentState, conversation);
                Console.WriteLine($"[Media Routing] AI Supervisor Action: {aiResult.Action}, Response: {aiResult.Response}");
                
                // Re-check DB to ensure an agent didn't reply while AI was processing
                var currentDbConv = await _unitOfWork.WhatsAppConversations.FindAsync(c => c.Id == conversation.Id);
                if (currentDbConv != null && currentDbConv.Mode == ConversationMode.Human) return;

                switch (aiResult.Action)
                {
                    case "build_package":
                    case "handle_objection":
                    case "handoff_sales":
                        string salesMsgMedia = !string.IsNullOrWhiteSpace(aiResult.Response) ? aiResult.Response : "أبشر، جاري تحويلك لموظف المبيعات لمتابعة طلبك... 👨‍💼";
                        await TriggerAgentHandoff(freshchatConversationId, conversation, salesMsgMedia, "ab160868-80de-427c-9a60-de78ac3c977d");
                        return;

                    case "show_destinations":
                        currentState = "DestinationsMenu";
                        responseText = await GetDestinationsMenuTextAsync();
                        conversation.Notes = $"[STATE:{currentState}]";
                        _unitOfWork.WhatsAppConversations.Update(conversation);
                        await SendAndSaveResponseAsync(conversation, responseText);
                        return;

                    case "show_packages":
                        var dest = aiResult.Destination;
                        if (!string.IsNullOrEmpty(dest))
                        {
                            responseText = await GetPackagesForSpecificDestAsync(dest, "MainMenu");
                            if (string.IsNullOrWhiteSpace(responseText) || responseText.Contains("عذراً، جاري تحديث باقات") || responseText.Contains("عذراً، لا توجد باقات"))
                            {
                                if (currentState == "WaitingForBookingDetails") 
                                {
                                    await TriggerAgentHandoff(freshchatConversationId, conversation, "تم استلام كافة تفاصيل رحلتك المخصصة. جاري تحويلك الآن لمسؤول المبيعات لإعداد العرض الأنسب لك... 👨‍💼", "ab160868-80de-427c-9a60-de78ac3c977d");
                                    return;
                                }

                                currentState = "WaitingForBookingDetails"; 
                                conversation.Notes = $"[STATE:{currentState}][DEST:{dest}]"; 
                                _unitOfWork.WhatsAppConversations.Update(conversation); 
                                await SendAndSaveResponseAsync(conversation, $"يسعدنا تصميم رحلة مخصصة لك بالكامل لـ ({dest}) بأفضل الأسعار 🌍\n\nكم عدد المسافرين والبالغين للرحلة؟ (وهل يوجد أطفال؟)");
                                return;
                            }
                            else
                            {
                                currentState = "DestinationPackages";
                                conversation.Notes = $"[STATE:{currentState}]";
                                _unitOfWork.WhatsAppConversations.Update(conversation);

                                var finalPackageMsg = responseText;
                                if (!string.IsNullOrWhiteSpace(aiResult.Response))
                                {
                                    finalPackageMsg += "\n\n" + aiResult.Response;
                                }

                                await SendAndSaveResponseAsync(conversation, finalPackageMsg);
                                return;
                            }
                        }

                        else
                        {
                            if (!string.IsNullOrWhiteSpace(aiResult.Response))
                            {
                                await SendAndSaveResponseAsync(conversation, aiResult.Response);
                            }
                            else
                            {
                                await SendAndSaveResponseAsync(conversation, "يرجى تحديد الوجهة التي ترغب بالسفر إليها لنتمكن من عرض الباقات المتاحة 🌍");
                            }
                            return;
                        }

                    case "confirm_booking":
                        var finalMsg = "تم تأكيد طلبك! جاري تحويلك الآن لفريق المبيعات لإكمال الإجراءات 💳";
                        await TriggerAgentHandoff(freshchatConversationId, conversation, finalMsg, "ab160868-80de-427c-9a60-de78ac3c977d");
                        return;

                    case "handoff_flights":
                        await HandleFlightRequestHandoffAsync(freshchatConversationId, conversation, aiResult, rawInput);
                        return;

                    case "handoff_hotels":
                        await HandleHotelRequestHandoffAsync(freshchatConversationId, conversation, aiResult, rawInput);
                        return;

                    case "handoff_visa":
                        var visaFixedMsg = !string.IsNullOrWhiteSpace(aiResult.Response) && (aiResult.Response.Contains("0532737645") || aiResult.Response.Contains("واتساب"))
                            ? aiResult.Response
                            : "لأستخراج الفيزا السياحية يرجى التواصل مع الموظف عبر واتساب فقط\nمن الأحد حتى الخميس\nمن الساعة 4:00 مساء حتى 9:00 مساء\nعلى الرقم\n0532737645";
                        conversation.Notes = "[STATE:MainMenu]";
                        _unitOfWork.WhatsAppConversations.Update(conversation);
                        await SendAndSaveResponseAsync(conversation, visaFixedMsg);
                        return;

                    case "handoff_license":
                        var licenseMsg = !string.IsNullOrWhiteSpace(aiResult.Response) && aiResult.Response.Contains("http")
                            ? aiResult.Response
                            : "لإصدار الرخصة الدولية، حياك الله بزيارتنا في أحد فروعنا:\n\n📍 فرع الهفوف:\nhttps://maps.app.goo.gl/fz8yzS25KZLz6PeZ8\n\n📍 فرع المبرز:\nhttps://maps.app.goo.gl/UcYSDcmsW22uWqNi6";
                        conversation.Notes = "[STATE:MainMenu]";
                        _unitOfWork.WhatsAppConversations.Update(conversation);
                        await SendAndSaveResponseAsync(conversation, licenseMsg);
                        return;

                    case "handoff_transport":
                        var transportMsg = !string.IsNullOrWhiteSpace(aiResult.Response) && aiResult.Response.Contains("0502447741")
                            ? aiResult.Response
                            : "لحجوزات التنقلات والمواصلات، يرجى التواصل مع القسم المختص (الأخ جعفر) عبر الرقم:\n0502447741";
                        conversation.Notes = "[STATE:MainMenu]";
                        _unitOfWork.WhatsAppConversations.Update(conversation);
                        await SendAndSaveResponseAsync(conversation, transportMsg);
                        return;

                    case "handoff_followup":
                        await TriggerAgentHandoff(freshchatConversationId, conversation, "جاري تحويلك لقسم المتابعة... 📋👨‍💼", "00c6ed00-85aa-46c2-bd60-73f52e0168ac");
                        return;

                    case "handoff_support":
                        await TriggerAgentHandoff(freshchatConversationId, conversation, "جاري تحويلك لفريق خدمة العملاء... 👨‍💼", "9f5ef661-5e87-4f7e-a11d-9372bd08a1b4");
                        return;

                    case "ask_details":
                    case "respond":
                    default:
                        if (!string.IsNullOrWhiteSpace(aiResult.Response))
                        {
                            if (aiResult.Action == "ask_details" && !currentState.StartsWith("WaitingFor"))
                                currentState = "WaitingForBookingDetails";
                            conversation.Notes = $"[STATE:{currentState}]";
                            _unitOfWork.WhatsAppConversations.Update(conversation);
                            await SendAndSaveResponseAsync(conversation, aiResult.Response);
                            return;
                        }
                        else
                        {
                            // AI couldn't process the media, show menu
                            await SendAndSaveResponseAsync(conversation, "تم استلام رسالتك 👍\nلخدمتك بشكل أسرع، فضلاً اختر من القائمة أو أرسل (99) للتحدث مع موظف:\n\n" + GetMainMenuText());
                            conversation.Notes = "[STATE:MainMenu]";
                            _unitOfWork.WhatsAppConversations.Update(conversation);
                            await _unitOfWork.SaveChangesAsync();
                            return;
                        }
                }

            }

            // V3: Filter Pure Emojis & Punctuation
            if (System.Text.RegularExpressions.Regex.IsMatch(input, @"^[^\p{L}\p{N}]+$") && !input.Contains("00") && !input.Contains("99"))
            {
                var reply = "كيف يمكنني مساعدتك اليوم؟ 😊\nلإظهار القائمة الرئيسية أرسل 00";
                await SendAndSaveResponseAsync(conversation, reply);
                return;
            }



            if (conversation.Notes?.StartsWith("[STATE:") == true)
            {
                var endIdx = conversation.Notes.IndexOf("]");
                if (endIdx > 7)
                {
                    currentState = conversation.Notes.Substring(7, endIdx - 7);
                }
            }

            // Intercept direct links and package inquiries from website
            bool isWebsiteTemplate = input.Contains("بياناتي:") || input.Contains("- الاسم:") || (input.Contains("الباقة:") && input.Contains("السعر:"));
            if (isWebsiteTemplate || input.StartsWith("تأكيد الطلب رقم") || input.StartsWith("استفسار بخصوص") || input.StartsWith("مرحباً، لدي استفسار جديد") || input.Contains("أود طلب حجز الباقة") || input.Contains("أود طلب حجز"))
            {
                string packageTitle = "";
                if (input.Contains("باقة:"))
                {
                    var idx = input.IndexOf("باقة:");
                    packageTitle = input.Substring(idx + 5).Trim();
                }
                else if (input.Contains("باقة"))
                {
                    var idx = input.IndexOf("باقة");
                    packageTitle = input.Substring(idx + 4).Trim();
                }

                Package? selectedPackage = null;
                if (!string.IsNullOrEmpty(packageTitle))
                {
                    var cleanTitle = packageTitle.Replace("\"", "").Replace("'", "").Trim();
                    var packages = await _unitOfWork.Packages.FindAllAsync(p => p.IsActive && (p.TitleAr.Contains(cleanTitle) || cleanTitle.Contains(p.TitleAr)));
                    selectedPackage = packages.FirstOrDefault();
                }

                var responseTextMsg = "";
                if (selectedPackage != null)
                {
                    responseTextMsg = $"أهلاً بك في سفريات الملحم 👋\n\n" +
                                      $"لقد استلمنا استفسارك بخصوص الباقة المميزة:\n" +
                                      $"🔹 *{selectedPackage.TitleAr}*\n" +
                                      $"📅 المدة: {selectedPackage.Duration}\n" +
                                      $"💰 السعر: {selectedPackage.Price} ر.س\n" +
                                      $"🔗 رابط الباقة على الموقع: https://almulhimtravel.com/package/{selectedPackage.PackageId.Replace(" ", "-")}\n\n" +
                                      $"أبشر! جاري تحويلك الآن للموظف المختص لمتابعة تفاصيل الحجز وتأكيد طلبك 👨‍💼";
                }
                else
                {
                    responseTextMsg = $"أهلاً بك في سفريات الملحم 👋\n\n" +
                                      $"تم استلام رسالتك.\n" +
                                      $"جاري تحويلك للموظف المختص لمتابعة طلبك...\n\n" +
                                      $"⏰ يرجى الانتظار قليلاً وسيتم الرد عليك قريباً.";
                }

                await TriggerAgentHandoff(freshchatConversationId, conversation, responseTextMsg, "ab160868-80de-427c-9a60-de78ac3c977d");
                return;
            }

            // Welcome greeting check for new conversation or greeting message
            if (isNewConversation && input != "0" && input != "00" && input != "99" && !input.StartsWith("99"))
            {
                // Only override if it is purely a greeting or very short generic word without a question.
                if (IsGreeting(input) && !input.Contains("؟") && !input.Contains("?") && input.Split(' ').Length <= 3)
                {
                    input = "start";
                }
            }
            else if (IsGreeting(input) && !input.Contains("؟") && !input.Contains("?"))
            {
                // If it's ONLY a greeting with no extra content, reset to main menu
                if (rawInput.Length <= 20)
                {
                    input = "00";
                }
            }

            // 1. Normalization and Rule-based navigation overrides (Bypass AI for common keywords)
            string normInput = input.Trim().ToLower().Replace("أ", "ا").Replace("إ", "ا").Replace("آ", "ا").Replace("ة", "ه");
            if (normInput == "الرئيسيه" || normInput == "رئيسيه" || normInput == "القائمه الرئيسيه" || normInput == "البدايه" || normInput == "البداية" || normInput == "الرئيسية" || normInput == "رئيسية" || normInput == "القائمة الرئيسية")
            {
                input = "00";
            }
            else if (normInput == "رجوع" || normInput == "السابق" || normInput == "عوده" || normInput == "عودة" || normInput == "ارجع" || normInput == "خلف" || normInput == "ورا" || normInput == "للخلف")
            {
                input = "0";
            }
            else if (normInput == "موظف" || normInput == "تحدث مع موظف" || normInput == "المختص" || normInput == "مساعده" || normInput == "مساعدة" || normInput == "اتصال" || normInput == "مكالمه" || normInput == "مكالمة" || normInput == "الموظف" || normInput == "تحدث مع الموظف")
            {
                input = "99";
            }

            // 2. AI Supervisor for text input and forms
            bool isNumeric = int.TryParse(input, out _);
            bool isWaitingState = currentState == "WaitingForFlightDetails" || 
                                  currentState == "WaitingForCarRentalDetails" || 
                                  currentState == "WaitingForBookingDetails";

            if ((!isNumeric || isWaitingState) && input != "0" && input != "00" && input != "99" && input != "start")
            {
                var aiResult = await ProcessWithAISupervisorAsync(input, currentState, conversation);
                
                // CRITICAL FIX: Re-check DB to ensure an agent didn't reply while AI was processing!
                var currentDbConv = await _unitOfWork.WhatsAppConversations.FindAsync(c => c.Id == conversation.Id);
                if (currentDbConv != null && currentDbConv.Mode == ConversationMode.Human)
                {
                    Console.WriteLine($"🛑 Aborting AI response! An agent replied while AI was processing. ConvID: {freshchatConversationId}");
                    return;
                }
                
                switch (aiResult.Action)
                {
                    case "build_package":
                    case "handle_objection":
                    case "handoff_sales":
                        string salesMsg = !string.IsNullOrWhiteSpace(aiResult.Response) ? aiResult.Response : "أبشر، جاري تحويلك لموظف المبيعات لمتابعة طلبك... 👨‍💼";
                        await TriggerAgentHandoff(freshchatConversationId, conversation, salesMsg, "ab160868-80de-427c-9a60-de78ac3c977d");
                        return;

                    case "show_destinations":
                        currentState = "DestinationsMenu";
                        responseText = await GetDestinationsMenuTextAsync();
                        conversation.Notes = $"[STATE:{currentState}]";
                        _unitOfWork.WhatsAppConversations.Update(conversation);
                        await SendAndSaveResponseAsync(conversation, responseText);
                        return;

                    case "show_packages":
                        var dest = aiResult.Destination;
                        if (!string.IsNullOrEmpty(dest))
                        {
                            responseText = await GetPackagesForSpecificDestAsync(dest, "MainMenu");
                            if (string.IsNullOrWhiteSpace(responseText) || responseText.Contains("عذراً، جاري تحديث باقات") || responseText.Contains("عذراً، لا توجد باقات"))
                            {
                                if (currentState == "WaitingForBookingDetails") 
                                {
                                    // Prevent loop: AI collected details but mistakenly called show_packages again
                                    await TriggerAgentHandoff(freshchatConversationId, conversation, "تم استلام كافة تفاصيل رحلتك المخصصة. جاري تحويلك الآن لمسؤول المبيعات لإعداد العرض الأنسب لك... 👨‍💼", "ab160868-80de-427c-9a60-de78ac3c977d");
                                    return;
                                }

                                currentState = "WaitingForBookingDetails"; 
                                conversation.Notes = $"[STATE:{currentState}][DEST:{dest}]"; 
                                _unitOfWork.WhatsAppConversations.Update(conversation); 
                                bool aiAlreadyAskedQuestion = !string.IsNullOrWhiteSpace(aiResult.Response) && 
                                                             (aiResult.Response.Contains("؟") || aiResult.Response.Contains("?"));

                                var customReply = aiAlreadyAskedQuestion
                                    ? aiResult.Response
                                    : $"يسعدنا تصميم رحلة مخصصة لك بالكامل لـ ({dest}) بأفضل الأسعار 🌍\n\nكم عدد المسافرين وتاريخ السفر التقريبي؟";
                                await SendAndSaveResponseAsync(conversation, customReply);
                                return;
                            }

                            else
                            {
                                currentState = "DestinationPackages";
                                conversation.Notes = $"[STATE:{currentState}]";
                                _unitOfWork.WhatsAppConversations.Update(conversation);
                                await SendAndSaveResponseAsync(conversation, responseText);
                                return;
                            }
                        }
                        else
                        {
                            if (!string.IsNullOrWhiteSpace(aiResult.Response))
                            {
                                await SendAndSaveResponseAsync(conversation, aiResult.Response);
                            }
                            else
                            {
                                await SendAndSaveResponseAsync(conversation, "يرجى تحديد الوجهة التي ترغب بالسفر إليها لنتمكن من عرض الباقات المتاحة 🌍");
                            }
                            return;
                        }

                    case "confirm_booking":
                        // Temporarily disabled VoucherPro integration
                        var finalMsg = "تم تأكيد طلبك! جاري تحويلك الآن لفريق المبيعات لإكمال الإجراءات 💳";
                        await TriggerAgentHandoff(freshchatConversationId, conversation, finalMsg, "ab160868-80de-427c-9a60-de78ac3c977d");
                        return;

                    case "handoff_flights":
                        await HandleFlightRequestHandoffAsync(freshchatConversationId, conversation, aiResult, input);
                        return;

                    case "handoff_hotels":
                        await HandleHotelRequestHandoffAsync(freshchatConversationId, conversation, aiResult, input);
                        return;

                    case "handoff_visa":
                        var visaFixedMsg2 = !string.IsNullOrWhiteSpace(aiResult.Response) && (aiResult.Response.Contains("0532737645") || aiResult.Response.Contains("واتساب"))
                            ? aiResult.Response
                            : "لأستخراج الفيزا السياحية يرجى التواصل مع الموظف عبر واتساب فقط\nمن الأحد حتى الخميس\nمن الساعة 4:00 مساء حتى 9:00 مساء\nعلى الرقم\n0532737645";
                        conversation.Notes = "[STATE:MainMenu]";
                        _unitOfWork.WhatsAppConversations.Update(conversation);
                        await SendAndSaveResponseAsync(conversation, visaFixedMsg2);
                        return;

                    case "handoff_license":
                        var licenseMsg2 = !string.IsNullOrWhiteSpace(aiResult.Response) && aiResult.Response.Contains("http")
                            ? aiResult.Response
                            : "لإصدار الرخصة الدولية، حياك الله بزيارتنا في أحد فروعنا:\n\n📍 فرع الهفوف:\nhttps://maps.app.goo.gl/fz8yzS25KZLz6PeZ8\n\n📍 فرع المبرز:\nhttps://maps.app.goo.gl/UcYSDcmsW22uWqNi6";
                        conversation.Notes = "[STATE:MainMenu]";
                        _unitOfWork.WhatsAppConversations.Update(conversation);
                        await SendAndSaveResponseAsync(conversation, licenseMsg2);
                        return;

                    case "handoff_transport":
                        var transportMsg2 = !string.IsNullOrWhiteSpace(aiResult.Response) && aiResult.Response.Contains("0502447741")
                            ? aiResult.Response
                            : "لحجوزات التنقلات والمواصلات، يرجى التواصل مع القسم المختص (الأخ جعفر) عبر الرقم:\n0502447741";
                        conversation.Notes = "[STATE:MainMenu]";
                        _unitOfWork.WhatsAppConversations.Update(conversation);
                        await SendAndSaveResponseAsync(conversation, transportMsg2);
                        return;

                    case "handoff_followup":
                        var followupMsg = "جاري تحويلك الآن لقسم خدمة العملاء والمتابعة للإفادة بخصوص حجزك... 📋👨‍💼";
                        await TriggerAgentHandoff(freshchatConversationId, conversation, followupMsg, "00c6ed00-85aa-46c2-bd60-73f52e0168ac");
                        return;

                    case "handoff_support":
                        var supportMsg = "جاري تحويلك لفريق خدمة العملاء للمساعدة... 👨‍💼";
                        await TriggerAgentHandoff(freshchatConversationId, conversation, supportMsg, "9f5ef661-5e87-4f7e-a11d-9372bd08a1b4");
                        return;

                    case "ask_details":
                    case "respond":
                    default:
                        if (!string.IsNullOrWhiteSpace(aiResult.Response))
                        {
                            if (aiResult.Action == "ask_details" && !currentState.StartsWith("WaitingFor"))
                            {
                                currentState = "WaitingForBookingDetails";
                            }
                            conversation.Notes = $"[STATE:{currentState}]";
                            _unitOfWork.WhatsAppConversations.Update(conversation);
                            await SendAndSaveResponseAsync(conversation, aiResult.Response);
                            return;
                        }
                        else
                        {
                            await SendAndSaveResponseAsync(conversation, "عذراً عزيزي العميل، يرجى اختيار رقم من القائمة المتاحة لتسهيل طلبك، أو أرسل (99) للتحدث مباشرة مع الموظف.");
                            return;
                        }
                }
            }

            int reprocessCount = 0;
            ReProcess:
            reprocessCount++;
            if (reprocessCount > 3)
            {
                await SendAndSaveResponseAsync(conversation, "عذراً، يبدو أن هناك مشكلة في فهم طلبك. يرجى كتابة (99) للتحدث مع موظف، أو (00) للعودة للقائمة الرئيسية.");
                return;
            }
            if (true) // Keep the block structure to minimize diff disruption
            {
                if (input == "start")
                {
                    currentState = "FreshworksMenu";
                    responseText = GetFreshworksMenuText();
                }
                else if (input == "00") 
                {
                    currentState = "MainMenu";
                    responseText = GetMainMenuText();
                }
                else
                {
                    switch (currentState)
                    {
                        case "WaitingForBookingDetails":
                        case "WaitingForFlightDetails":
                        case "WaitingForCarRentalDetails":
                            // This should never be hit by text (AI Supervisor handles it).
                            // If they got here, they sent a number like "0" or "99", or some weird edge case.
                            // 99 is handoff, handled at the end if we set isHandoff.
                            // 0 goes to previous menu. So let's route to MainMenu for now.
                            currentState = "MainMenu";
                            goto ReProcess;

                        case "FreshworksMenu":
                            var freshConvId = conversation.FreshchatConversationId ?? conversation.Id.ToString();
                            if (input == "1" || input == "2" || input == "3")
                            {
                                var targetGroupId = input == "1" ? "ab160868-80de-427c-9a60-de78ac3c977d" : 
                                                    input == "2" ? "00c6ed00-85aa-46c2-bd60-73f52e0168ac" : 
                                                    "9f5ef661-5e87-4f7e-a11d-9372bd08a1b4";
                                
                                try
                                {
                                    await _whatsAppProvider.AssignConversationToGroupAsync(freshConvId, targetGroupId);
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine($"⚠️ Could not assign to group: {ex.Message}");
                                }
                                
                                if (input == "2")
                                {
                                    // Option 2: Immediate Handoff
                                    responseText = isWorkingHours 
                                        ? "أبشر! جاري تحويلك للمختصين لمتابعة حجزك. ثواني ويكونون معك 👨‍💼"
                                        : "أبشر! سيتواصل معك أحد المختصين خلال أوقات الدوام الرسمي لمتابعة حجزك 👨‍💼";
                                    
                                    await MarkConversationAsHumanAsync(freshConvId);
                                    conversation.Mode = ConversationMode.Human;
                                    conversation.Notes = $"تم اختيار {input}. تحويل مباشر لقسم المتابعة.";
                                    _unitOfWork.WhatsAppConversations.Update(conversation);
                                    await SendAndSaveResponseAsync(conversation, responseText);
                                    return;
                                }
                                else
                                {
                                    // Option 1 & 3: Hybrid mode
                                    if (input == "1")
                                    {
                                        var allMsgs = await _unitOfWork.WhatsAppMessages.FindAllAsync(m => m.ConversationId == conversation.Id);
                                        var custMsgs = allMsgs.Where(m => m.SenderType == MessageSender.Customer 
                                                                       && m.Content != "1" && m.Content != "0" && m.Content != "00" && m.Content != "start" && m.Content != "99"
                                                                       && !IsGreeting(m.Content ?? "")
                                                                       && !(m.Content?.Trim().StartsWith("السلام") == true)
                                                                       && !(m.Content?.Trim().StartsWith("مرحبا") == true)
                                                                       && !(m.Content?.Trim().StartsWith("مساء") == true)
                                                                       && !(m.Content?.Trim().StartsWith("صباح") == true)
                                                                       && !(m.Content?.Trim().StartsWith("هلا") == true)).ToList();
                                        var detailedMsg = custMsgs.LastOrDefault(m => (m.Content?.Trim().Length ?? 0) > 8);

                                        if (detailedMsg != null && !string.IsNullOrWhiteSpace(detailedMsg.Content))
                                        {
                                            var aiResult = await ProcessWithAISupervisorAsync(detailedMsg.Content, "FreshworksMenu", conversation);
                                            switch (aiResult.Action)
                                            {
                                                case "build_package":
                                                case "handle_objection":
                                                case "handoff_sales":
                                                    await TriggerAgentHandoff(freshchatConversationId, conversation, aiResult.Response, "ab160868-80de-427c-9a60-de78ac3c977d");
                                                    return;
                                                case "show_destinations":
                                                    currentState = "DestinationsMenu";
                                                    responseText = await GetDestinationsMenuTextAsync();
                                                    conversation.Notes = $"[STATE:{currentState}]";
                                                    _unitOfWork.WhatsAppConversations.Update(conversation);
                                                    await SendAndSaveResponseAsync(conversation, responseText);
                                                    return;
                                                case "show_packages":
                                                    var dest = aiResult.Destination;
                                                    if (!string.IsNullOrEmpty(dest))
                                                    {
                                                        responseText = await GetPackagesForSpecificDestAsync(dest, "MainMenu");
                                                        currentState = "DestinationPackages";
                                                        conversation.Notes = $"[STATE:{currentState}]";
                                                        _unitOfWork.WhatsAppConversations.Update(conversation);
                                                        if (!string.IsNullOrWhiteSpace(aiResult.Response)) responseText += "\n\n" + aiResult.Response;
                                                        await SendAndSaveResponseAsync(conversation, responseText);
                                                        return;
                                                    }
                                                    break;
                                                case "handoff_flights":
                                                    await HandleFlightRequestHandoffAsync(freshchatConversationId, conversation, aiResult, input);
                                                    return;
                                                case "handoff_hotels":
                                                    await HandleHotelRequestHandoffAsync(freshchatConversationId, conversation, aiResult, input);
                                                    return;
                                                default:
                                                    if (!string.IsNullOrWhiteSpace(aiResult.Response))
                                                    {
                                                        await SendAndSaveResponseAsync(conversation, aiResult.Response);
                                                        return;
                                                    }
                                                    break;
                                            }
                                        }

                                        currentState = "WaitingForBookingDetails";
                                        conversation.Notes = $"[STATE:WaitingForBookingDetails][TARGET:MainMenu]";
                                        responseText = "أبشر! تم تنبيه فريق المبيعات لخدمتك 👨‍💼\nلتجهيز أفضل عرض مخصص لك، لطفاً زوّدنا بالتالي:\n📍 اسم الوجهة (إن وجدت):\n👥 عدد الأشخاص (كبار وأطفال):\n👥 أعمار الاطفال ان وجد:\n📅 تواريخ الرحلة (الوصول والمغادرة):\n✨ أي متطلبات خاصة";
                                    }
                                    else
                                    {
                                        var alertMsg = "تم تنبيه فريق الدعم لخدمتك ✅\nوفي هذه الأثناء، يمكنك تصفح القائمة التالية:";
                                        currentState = "MainMenu";
                                        responseText = $"{alertMsg}\n\n{GetMainMenuText()}";
                                        conversation.Notes = $"تم اختيار {input}. (Hybrid Mode)";
                                    }
                                }

                                break;
                            }
                            else
                            {
                                if (int.TryParse(input, out _))
                                {
                                    var menuText = GetFreshworksMenuText();
                                    responseText = "عذراً، الرقم غير صحيح ❌\n\n" + menuText;
                                }
                                else
                                {
                                    // Natural language text in FreshworksMenu → route to AI Supervisor!
                                    var aiResult = await ProcessWithAISupervisorAsync(rawInput, "FreshworksMenu", conversation);
                                    switch (aiResult.Action)
                                    {
                                        case "build_package":
                                        case "handle_objection":
                                        case "handoff_sales":
                                            await TriggerAgentHandoff(freshchatConversationId, conversation, null, "ab160868-80de-427c-9a60-de78ac3c977d");
                                            return;
                                        case "handoff_support":
                                            await TriggerAgentHandoff(freshchatConversationId, conversation, "جاري تحويلك لفريق خدمة العملاء... 👨‍💼", "9f5ef661-5e87-4f7e-a11d-9372bd08a1b4");
                                            return;
                                        case "handoff_followup":
                                            await TriggerAgentHandoff(freshchatConversationId, conversation, "جاري تحويلك لقسم المتابعة... 📋👨‍💼", "00c6ed00-85aa-46c2-bd60-73f52e0168ac");
                                            return;
                                        case "ask_details":
                                        case "respond":
                                        default:
                                            if (!string.IsNullOrWhiteSpace(aiResult.Response))
                                            {
                                                currentState = aiResult.Action == "ask_details" ? "WaitingForBookingDetails" : "MainMenu";
                                                conversation.Notes = $"[STATE:{currentState}]";
                                                _unitOfWork.WhatsAppConversations.Update(conversation);
                                                await SendAndSaveResponseAsync(conversation, aiResult.Response);
                                                return;
                                            }
                                            else
                                            {
                                                // AI couldn't understand, show menu
                                                currentState = "MainMenu";
                                                responseText = GetMainMenuText();
                                            }
                                            break;
                                    }
                                }
                            }
                            break;

                        case "MainMenu":
                            if (input == "1")
                            {
                                responseText = await GetDestinationsMenuTextAsync();
                                currentState = "DestinationsMenu";
                            }
                            else if (input == "2")
                            {
                                responseText = await GetHoneymoonMenuTextAsync();
                                currentState = "HoneymoonMenu";
                            }
                            else if (input == "3")
                            {
                                responseText = await GetFamilyMenuTextAsync();
                                currentState = "FamilyMenu";
                            }
                            else if (input == "4")
                            {
                                responseText = GetVisaMenuText();
                                currentState = "VisaMenu";
                            }
                            else if (input == "5")
                            {
                                responseText = GetFAQMenuText();
                                currentState = "FAQMenu";
                            }
                            else if (input == "6")
                            {
                                responseText = GetOtherServicesMenuText();
                                currentState = "OtherServicesMenu";
                            }
                            else if (input == "0")
                            {
                                responseText = "أنت بالفعل في القائمة الرئيسية 🏠\n\n" + GetMainMenuText();
                            }
                            else
                            {
                                if (int.TryParse(input, out _))
                                {
                                    responseText = "عفواً، يرجى اختيار رقم من القائمة المتاحة بطريقة صحيحة ❌\nيرجى كتابة رقم من القائمة:\n\n" + GetMainMenuText();
                                }
                                else
                                {
                                    // Natural language text in MainMenu → route to AI Supervisor!
                                    var aiResult = await ProcessWithAISupervisorAsync(rawInput, "MainMenu", conversation);
                                    switch (aiResult.Action)
                                    {
                                        case "build_package":
                                        case "handle_objection":
                                        case "handoff_sales":
                                            await TriggerAgentHandoff(freshchatConversationId, conversation, null, "ab160868-80de-427c-9a60-de78ac3c977d");
                                            return;
                                        case "handoff_support":
                                            await TriggerAgentHandoff(freshchatConversationId, conversation, "جاري تحويلك لفريق خدمة العملاء... 👨‍💼", "9f5ef661-5e87-4f7e-a11d-9372bd08a1b4");
                                            return;
                                        case "handoff_followup":
                                            await TriggerAgentHandoff(freshchatConversationId, conversation, "جاري تحويلك لقسم المتابعة... 📋👨‍💼", "00c6ed00-85aa-46c2-bd60-73f52e0168ac");
                                            return;
                                        case "ask_details":
                                        case "respond":
                                        default:
                                            if (!string.IsNullOrWhiteSpace(aiResult.Response))
                                            {
                                                currentState = aiResult.Action == "ask_details" ? "WaitingForBookingDetails" : currentState;
                                                conversation.Notes = $"[STATE:{currentState}]";
                                                _unitOfWork.WhatsAppConversations.Update(conversation);
                                                await SendAndSaveResponseAsync(conversation, aiResult.Response);
                                                return;
                                            }
                                            else
                                            {
                                                responseText = "عفواً، يرجى اختيار رقم من القائمة المتاحة بطريقة صحيحة.\nأو للتحدث مع الموظف وشرح طلبك بالتفصيل، أرسل رقم (99).";
                                            }
                                            break;
                                    }
                                }
                            }
                            break;
                            
                        case "DestinationsMenu":
                        case "HoneymoonMenu":
                        case "FamilyMenu":
                            if (input == "0")
                            {
                                responseText = GetMainMenuText();
                                currentState = "MainMenu";
                            }
                            else if (int.TryParse(input, out int destIndex))
                            {
                                var dests = await _unitOfWork.Destinations.FindAllAsync(d => d.IsActive);
                                var activeDests = dests.OrderBy(d => d.SortOrder).ToList();
                                
                                if (destIndex >= 1 && destIndex <= activeDests.Count)
                                {
                                    var selectedDest = activeDests[destIndex - 1];
                                    var packageText = await GetDestinationPackagesTextAsync(selectedDest, currentState);
                                    
                                    if (string.IsNullOrWhiteSpace(packageText))
                                    {
                                        currentState = "WaitingForBookingDetails";
                                        conversation.Notes = $"[STATE:{currentState}][DEST:{selectedDest.NameAr}]";
                                        _unitOfWork.WhatsAppConversations.Update(conversation);
                                        
                                        var customMsg = $"يسعدنا تصميم رحلة مخصصة لك بالكامل لـ ({selectedDest.NameAr}) بأفضل الأسعار 🌍\n\nكم عدد المسافرين والبالغين للرحلة؟ (وهل يوجد أطفال؟)";
                                        await SendAndSaveResponseAsync(conversation, customMsg);
                                        return;
                                    }
                                    else
                                    {
                                        responseText = packageText;
                                        string nextState = currentState == "HoneymoonMenu" ? "HoneymoonPackages" :
                                                           currentState == "FamilyMenu" ? "FamilyPackages" : 
                                                           "DestinationPackages";
                                                           
                                        currentState = nextState;
                                        conversation.Notes = $"[STATE:{currentState}][DEST:{selectedDest.NameAr}]";
                                    }
                                }
                                else if (destIndex == activeDests.Count + 1)
                                {
                                    currentState = "WaitingForBookingDetails"; conversation.Notes = $"[STATE:{currentState}]"; _unitOfWork.WhatsAppConversations.Update(conversation); await SendAndSaveResponseAsync(conversation, GetBookingPreHandoffForm()); return;
                                }

                                else
                                {
                                    var currentMenuText = currentState == "HoneymoonMenu" ? await GetHoneymoonMenuTextAsync() : 
                                                          currentState == "FamilyMenu" ? await GetFamilyMenuTextAsync() : 
                                                          await GetDestinationsMenuTextAsync();
                                    responseText = "عفواً، يرجى اختيار رقم من القائمة المتاحة بطريقة صحيحة ❌\n\n" + currentMenuText;
                                }
                            }
                            else
                            {
                                if (!int.TryParse(input, out _))
                                {
                                    responseText = "عفواً، يرجى اختيار رقم من القائمة المتاحة بطريقة صحيحة.\nأو للتحدث مع الموظف وشرح طلبك بالتفصيل، أرسل رقم (99).";
                                }
                                else
                                {
                                    var currentMenuText = currentState == "HoneymoonMenu" ? await GetHoneymoonMenuTextAsync() : 
                                                          currentState == "FamilyMenu" ? await GetFamilyMenuTextAsync() : 
                                                          await GetDestinationsMenuTextAsync();
                                    responseText = "عفواً، يرجى كتابة رقم الوجهة ❌\n\n" + currentMenuText;
                                }
                            }
                            break;

                        case "VisaMenu":
                            if (input == "0")
                            {
                                responseText = GetMainMenuText();
                                currentState = "MainMenu";
                            }
                            else if (int.TryParse(input, out int visaIndex) && visaIndex >= 1 && visaIndex <= 5)
                            {
                                responseText = GetVisaDetailText(visaIndex);
                                currentState = "VisaDetails";
                                conversation.Notes = $"[STATE:VisaDetails][VISA_ID:{visaIndex}]";
                            }
                            else
                            {
                                if (!int.TryParse(input, out _))
                                {
                                    responseText = "عفواً، يرجى اختيار رقم من القائمة المتاحة بطريقة صحيحة.\nأو للتحدث مع الموظف، أرسل رقم (99).";
                                }
                                else
                                {
                                    responseText = "عفواً، يرجى اختيار رقم من القائمة المتاحة بطريقة صحيحة ❌\n\n" + GetVisaMenuText();
                                }
                            }
                            break;

                        case "FAQMenu":
                            if (input == "0")
                            {
                                responseText = GetMainMenuText();
                                currentState = "MainMenu";
                            }
                            else if (int.TryParse(input, out int faqIndex) && faqIndex >= 1 && faqIndex <= 5)
                            {
                                responseText = GetFAQAnswerText(faqIndex);
                                currentState = "FAQAnswer";
                            }
                            else
                            {
                                if (!int.TryParse(input, out _))
                                {
                                    responseText = "عفواً، يرجى اختيار رقم السؤال من القائمة ❌\nأو للتحدث مع الموظف، أرسل رقم (99).\n\n" + GetFAQMenuText();
                                }
                                else
                                {
                                    responseText = "الرقم غير صحيح ❌\n\n" + GetFAQMenuText();
                                }
                            }
                            break;

                        case "DestinationPackages":
                            if (input == "0") { responseText = await GetDestinationsMenuTextAsync(); currentState = "DestinationsMenu"; }
                            else if (input == "99") { isHandoff = true; }
                            else 
                            {
                                var destMatch = System.Text.RegularExpressions.Regex.Match(conversation.Notes ?? "", @"\[DEST:([^\]]+)\]");
                                var destInfo = destMatch.Success ? $"[DEST:{destMatch.Groups[1].Value}]" : "";
                                currentState = "WaitingForBookingDetails";
                                conversation.Notes = $"[STATE:{currentState}]{destInfo}";
                                _unitOfWork.WhatsAppConversations.Update(conversation);
                                await SendAndSaveResponseAsync(conversation, GetBookingPreHandoffForm());
                                return;
                            }
                            break;

                        case "CustomPackageOffer":
                            if (input == "0") { responseText = await GetDestinationsMenuTextAsync(); currentState = "DestinationsMenu"; }
                            else if (input == "99") { isHandoff = true; }
                            else 
                            {
                                var destMatch = System.Text.RegularExpressions.Regex.Match(conversation.Notes ?? "", @"\[DEST:([^\]]+)\]");
                                var destInfo = destMatch.Success ? $"[DEST:{destMatch.Groups[1].Value}]" : "";
                                currentState = "WaitingForBookingDetails";
                                conversation.Notes = $"[STATE:{currentState}]{destInfo}";
                                _unitOfWork.WhatsAppConversations.Update(conversation);
                                await SendAndSaveResponseAsync(conversation, GetBookingPreHandoffForm());
                                return;
                            }
                            break;

                        case "HoneymoonPackages":
                            if (input == "0") { responseText = await GetHoneymoonMenuTextAsync(); currentState = "HoneymoonMenu"; }
                            else if (input == "99") { isHandoff = true; }
                            else 
                            {
                                var destMatch = System.Text.RegularExpressions.Regex.Match(conversation.Notes ?? "", @"\[DEST:([^\]]+)\]");
                                var destInfo = destMatch.Success ? $"[DEST:{destMatch.Groups[1].Value}]" : "";
                                currentState = "WaitingForBookingDetails";
                                conversation.Notes = $"[STATE:{currentState}]{destInfo}";
                                _unitOfWork.WhatsAppConversations.Update(conversation);
                                await SendAndSaveResponseAsync(conversation, GetBookingPreHandoffForm());
                                return;
                            }
                            break;

                        case "FamilyPackages":
                            if (input == "0") { responseText = await GetFamilyMenuTextAsync(); currentState = "FamilyMenu"; }
                            else if (input == "99") { isHandoff = true; }
                            else 
                            {
                                var destMatch = System.Text.RegularExpressions.Regex.Match(conversation.Notes ?? "", @"\[DEST:([^\]]+)\]");
                                var destInfo = destMatch.Success ? $"[DEST:{destMatch.Groups[1].Value}]" : "";
                                currentState = "WaitingForBookingDetails";
                                conversation.Notes = $"[STATE:{currentState}]{destInfo}";
                                _unitOfWork.WhatsAppConversations.Update(conversation);
                                await SendAndSaveResponseAsync(conversation, GetBookingPreHandoffForm());
                                return;
                            }
                            break;

                        case "VisaDetails":
                            if (input == "0") { responseText = GetVisaMenuText(); currentState = "VisaMenu"; }
                            else
                            { 
                                var visaFixedMsg = "لأستخراج الفيزا السياحية يرجى التواصل مع الموظف المختص عبر واتساب فقط 📱\n" +
                                                   "📞 الرقم: 0532737645\n" +
                                                   "⏰ أوقات العمل: من الأحد حتى الخميس (من 4:00 مساءً حتى 9:00 مساءً)\n\n" +
                                                   "━━━━━━━━━━━━━━━\n👈 0 للرجوع | 00 للرئيسية";
                                await SendAndSaveResponseAsync(conversation, visaFixedMsg);
                                return;
                            }
                            break;


                        case "FAQAnswer":
                            if (input == "0") { responseText = GetFAQMenuText(); currentState = "FAQMenu"; }
                            else if (input == "99") { isHandoff = true; }
                            else 
                            { 
                                responseText = "عذراً، يرجى اختيار أحد الخيارات التالية:\n👈 اكتب 0 للرجوع للأسئلة\n👈 00 للرئيسية\n👈 99 للمزيد من الاستفسارات مع موظف"; 
                            }
                            break;

                        case "OtherServicesMenu":
                            if (input == "0" || input == "00")
                            {
                                responseText = GetMainMenuText();
                                currentState = "MainMenu";
                            }
                            else if (input == "99")
                            {
                                isHandoff = true;
                            }
                            else if (input == "1") // Transfers
                            {
                                responseText = "الانتقالات من وإلى المطار 🚗\n\nبرجاء التواصل مع رقم الحجوزات أو الاستفسارات بخصوص الانتقالات:\nجعفر: 0502447741\n━━━━━━━━━━━━━━━\n👈 0 للرجوع | 00 للرئيسية";
                                currentState = "OtherServicesMenu_Transfers";
                            }
                            else if (input == "2") // Hotels and Flights
                            {
                                currentState = "WaitingForBookingDetails"; conversation.Notes = $"[STATE:{currentState}]"; _unitOfWork.WhatsAppConversations.Update(conversation); await SendAndSaveResponseAsync(conversation, GetBookingPreHandoffForm()); return;
                                return;
                            }
                            else if (input == "3") // Licenses
                            {
                                responseText = "🚗 متطلبات الرخصة الدولية:\n\n- صورة شخصية\n- صورة الجواز\n- صورة الرخصة السعودية\n- النوع: دفتر\n- مدة الصلاحية: سنة\n\n━━━━━━━━━━━━━━━\n👈 0 للرجوع | 00 للرئيسية";
                                currentState = "OtherServicesMenu_Details";
                            }
                            else if (input == "4") // Workers
                            {
                                await TriggerAgentHandoff(freshchatConversationId, conversation, "لخدمتك بشكل أسرع، فضلاً اترك تفاصيل طلبك وسيقوم الموظف المختص بالتواصل معك فوراً:");
                                return;
                            }
                            else
                            {
                                responseText = "عذراً، الخيار غير صحيح. يرجى اختيار رقم من القائمة المتاحة لتسهيل طلبك.";
                            }
                            break;



                        default:
                            responseText = GetMainMenuText();
                            currentState = "MainMenu";
                            break;
                    }
                }
            }

            if (input == "99" && !isHandoff)
            {
                isHandoff = true;
            }

            if (isHandoff)
            {
                string? handoffForm = null;

                if (currentState == "VisaDetails" || currentState == "VisaMenu")
                {
                    var visaFixedMsg = "لأستخراج الفيزا السياحية يرجى التواصل مع الموظف المختص عبر واتساب فقط 📱\n" +
                                       "📞 الرقم: 0532737645\n" +
                                       "⏰ أوقات العمل: من الأحد حتى الخميس (من 4:00 مساءً حتى 9:00 مساءً)\n\n" +
                                       "━━━━━━━━━━━━━━━\n👈 0 للرجوع | 00 للرئيسية";
                    await SendAndSaveResponseAsync(conversation, visaFixedMsg);
                    return;
                }

                if (currentState == "DestinationsMenu" || currentState == "DestinationPackages" || 
                         currentState == "HoneymoonMenu" || currentState == "HoneymoonPackages" || 
                         currentState == "FamilyMenu" || currentState == "FamilyPackages" || 
                         currentState == "OtherServicesMenu_Details")
                {
                    // Check if customer already provided prior details in notes or messages:
                    var allMsgs = await _unitOfWork.WhatsAppMessages.FindAllAsync(m => m.ConversationId == conversation.Id);
                    var custMsgs = allMsgs.Where(m => m.SenderType == MessageSender.Customer && m.Content != "99" && m.Content != "0" && m.Content != "00" && m.Content != "start").ToList();
                    bool hasPriorDetails = (conversation.Notes != null && conversation.Notes.Contains("[DEST:")) || 
                                           custMsgs.Any(m => (m.Content?.Trim().Length ?? 0) > 8);

                    if (hasPriorDetails)
                    {
                        var salesMsg = "أبشر! تم رفع تفاصيل طلبك لمسؤول المبيعات لمتابعة الحجز والتأكيد معك... 👨‍💼";
                        await TriggerAgentHandoff(freshchatConversationId, conversation, salesMsg, "ab160868-80de-427c-9a60-de78ac3c977d");
                        return;
                    }

                    currentState = "WaitingForBookingDetails";
                    conversation.Notes = $"[STATE:{currentState}]";
                    _unitOfWork.WhatsAppConversations.Update(conversation);
                    await SendAndSaveResponseAsync(conversation, GetBookingPreHandoffForm());
                    return;
                }

                await TriggerAgentHandoff(freshchatConversationId, conversation, handoffForm);
                return;
            }
            else
            {
                if (currentState == "VisaDetails" && conversation.Notes != null && conversation.Notes.Contains("[VISA_ID:"))
                {
                    // Preserve the VISA_ID note set during the switch
                }
                else
                {
                    conversation.Notes = $"[STATE:{currentState}]";
                }
            }
            
            _unitOfWork.WhatsAppConversations.Update(conversation);
            await SendAndSaveResponseAsync(conversation, responseText);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CRITICAL] Error in HandleIncomingMessageAsync: {ex.Message}\n{ex.StackTrace}");
                // Write error to log file for server debugging
                try
                {
                    var logDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "logs");
                    if (!Directory.Exists(logDir)) Directory.CreateDirectory(logDir);
                    var logFile = Path.Combine(logDir, "bot-errors.log");
                    var logEntry = $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] [HandleIncomingMessageAsync] {ex.GetType().Name}: {ex.Message}\nStackTrace: {ex.StackTrace}\n{(ex.InnerException != null ? $"InnerException: {ex.InnerException.Message}\n" : "")}---\n";
                    File.AppendAllText(logFile, logEntry);
                }
                catch { /* ignore logging failure */ }
                try
                {
                    var openConversations = await _unitOfWork.WhatsAppConversations
                        .FindAllAsync(c => c.FreshchatConversationId == freshchatConversationId && c.Mode != ConversationMode.Closed);
                    var conversation = openConversations.OrderByDescending(c => c.StartedAt).FirstOrDefault();
                    if (conversation != null)
                    {
                        conversation.Mode = ConversationMode.Human;
                        conversation.Notes = "[STATE:HumanHandoff] تم تحويل المحادثة لوضع الموظف بسبب خطأ غير متوقع.";
                        _unitOfWork.WhatsAppConversations.Update(conversation);
                        
                        var fallbackMsg = "سيتم التواصل معك من قبل أحد موظفينا في أقرب وقت لمساعدتك. 🌸";
                        try
                        {
                            await _whatsAppProvider.SendTextMessageAsync(freshchatConversationId, fallbackMsg);
                        }
                        catch (Exception provEx)
                        {
                            Console.WriteLine($"⚠️ Could not send error fallback message via provider: {provEx.Message}");
                        }
                        
                        var outboundMessage = new WhatsAppMessage
                        {
                            Id = Guid.NewGuid(),
                            ConversationId = conversation.Id,
                            Direction = MessageDirection.Outbound,
                            SenderType = MessageSender.Bot,
                            Content = fallbackMsg,
                            SentAt = DateTime.UtcNow,
                            IsRead = true
                        };
                        await _unitOfWork.WhatsAppMessages.AddAsync(outboundMessage);
                        await _unitOfWork.SaveChangesAsync();
                    }
                }
                catch (Exception dbEx)
                {
                    Console.WriteLine($"[CRITICAL] Error saving exception fallback: {dbEx.Message}");
                }
            }
        }

        private async Task SendAndSaveResponseAsync(WhatsAppConversation conversation, string text)
        {
            var sanitizedText = SanitizeBotResponse(text);
            if (string.IsNullOrWhiteSpace(sanitizedText)) return;

            var destinationId = conversation.FreshchatConversationId ?? conversation.Id.ToString();
            try
            {
                await _whatsAppProvider.SendTextMessageAsync(destinationId, sanitizedText);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Could not send live WhatsApp message: {ex.Message}");
            }

            var outboundMessage = new WhatsAppMessage
            {
                Id = Guid.NewGuid(),
                ConversationId = conversation.Id,
                Direction = MessageDirection.Outbound,
                SenderType = MessageSender.Bot,
                Content = sanitizedText,
                SentAt = DateTime.UtcNow,
                IsRead = true
            };
            await _unitOfWork.WhatsAppMessages.AddAsync(outboundMessage);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task MarkConversationAsHumanAsync(string freshchatConversationId, string notes = "", string assignedAgentName = "")
        {
            var openConversations = await _unitOfWork.WhatsAppConversations
                .FindAllAsync(c => c.FreshchatConversationId == freshchatConversationId && c.Mode != ConversationMode.Closed);
            
            var conversation = openConversations.OrderByDescending(c => c.StartedAt).FirstOrDefault();
            if (conversation != null)
            {
                conversation.Mode = ConversationMode.Human;
                conversation.LastMessageAt = DateTime.UtcNow;
                conversation.LastAgentMessageAt = DateTime.UtcNow;
                _unitOfWork.WhatsAppConversations.Update(conversation);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        // --- Text Helpers ---

        private string GetMainMenuText()
        {
            return "اختر القسم الذي تبحث عنه:\n\n" +
                   "1️⃣ - *الوجهات والباقات السياحية*\n" +
                   "2️⃣ - *عروض وبرامج شهر العسل*\n" +
                   "3️⃣ - *رحلات عائلية ومجموعات*\n" +
                   "4️⃣ - *خدمات التأشيرات والفيزا*\n" +
                   "5️⃣ - *الأسئلة الشائعة والاستفسارات*\n" +
                   "6️⃣ - *خدمات أخرى*\n\n" +
                   "👈 فضلاً، اكتب رقم الخدمة المطلوبة:";
        }

        private string GetOtherServicesMenuText()
        {
            return "خيارات الخدمات الأخرى:\n\n" +
                   "1️⃣ - *الانتقالات من وإلى المطار وتأجير السيارات*\n" +
                   "2️⃣ - *حجز الفنادق والطيران*\n" +
                   "3️⃣ - *استخراج الرخصة الدولية*\n" +
                   "4️⃣ - *الأيدي العاملة*\n\n" +
                   "━━━━━━━━━━━━━━━\n" +
                   "👈 اكتب رقم الخدمة\n" +
                   "👈 0 للرجوع | 00 للرئيسية";
        }

        private string GetBookingPreHandoffForm()
        {
            return "مرحبًا بك عميلنا العزيز، معك فريق سفريات الملحم.\n\nلطفًا زوّدنا بالمعلومات التالية لتجهيز أفضل عرض لك:\n- اسم الدولة او الوجهه:\n- عدد الأشخاص:\n- اعمار الاطفال ان وجد:\n- تواريخ الرحلة: (الوصول والمغادرة)\n- أي متطلبات خاصة او تفاصيل حاب نعرفها؟";
        }

        private async Task TriggerAgentHandoff(string conversationId, WhatsAppConversation conversation, string? customMessage = null, string? targetGroupId = null)
        {
            var saudiTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById(System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(System.Runtime.InteropServices.OSPlatform.Windows) ? "Arab Standard Time" : "Asia/Riyadh"));
            var currentOfDay = saudiTime.TimeOfDay;
            bool isWorkingHours = saudiTime.DayOfWeek != DayOfWeek.Friday && 
                                   currentOfDay >= new TimeSpan(10, 0, 0) && 
                                   currentOfDay < new TimeSpan(20, 30, 0);

            var workingHoursNotice = isWorkingHours 
                ? "أبشر! جاري تحويلك للمختصين. ثواني ويكونون معك 👨‍💼"
                : "أبشر! سيتواصل معك أحد المختصين خلال أوقات الدوام الرسمي (من السبت للخميس، 10 صباحاً إلى 8:30 مساءً) 👨‍💼";

            string finalMessage;
            if (!string.IsNullOrEmpty(customMessage))
            {
                finalMessage = customMessage;
                if (!isWorkingHours && !customMessage.Contains("أوقات الدوام") && !customMessage.Contains("الدوام الرسمي") && !customMessage.Contains("ساعات العمل"))
                {
                    finalMessage += "\n\n" + "💡 علماً بأننا حالياً خارج أوقات الدوام الرسمي. سيتواصل معك أحد المختصين خلال ساعات العمل (السبت - الخميس، 10 صباحاً إلى 8:30 مساءً).";
                }
            }
            else
            {
                finalMessage = workingHoursNotice;
            }

            try
            {
                // Immediately switch to Human mode to prevent the bot from replying if the customer sends another message
                conversation.Mode = ConversationMode.Human;
                _unitOfWork.WhatsAppConversations.Update(conversation);
                await _unitOfWork.SaveChangesAsync();
                // 1. Send combined handoff + security notice in one clean message
                var securityNotice = "⚠️ *تنبيه أمني لعملائنا:*\nالتعاملات المالية والحجوزات تتم حصراً عبر هذا الرقم الرسمي لـ *سفريات الملحم* عبر قنوات الدفع المعتمدة فقط (حسابات الشركة البنكية، روابط تابي/تمارا، أو بالفروع).";
                var combinedHandoffMessage = !string.IsNullOrWhiteSpace(finalMessage)
                    ? $"{finalMessage}\n\n━━━━━━━━━━━━━━━\n{securityNotice}"
                    : securityNotice;

                await _whatsAppProvider.SendTextMessageAsync(conversationId, combinedHandoffMessage);

                // 3. Generate and send AI summary as a Private Note for the agent
                try
                {
                    var messages = await _unitOfWork.WhatsAppMessages.FindAllAsync(m => m.ConversationId == conversation.Id);
                    var orderedMsgs = messages.OrderBy(m => m.SentAt).ToList();

                    // Only summarize messages from the CURRENT active topic/session (ignore old sessions before start / 00 / menu options)
                    int lastResetIndex = -1;
                    for (int i = 0; i < orderedMsgs.Count; i++)
                    {
                        var m = orderedMsgs[i];
                        if (m.SenderType == MessageSender.Customer)
                        {
                            var contentClean = m.Content?.Trim().ToLower() ?? "";
                            if (contentClean == "start" || contentClean == "00" || contentClean == "الرئيسية" || contentClean == "الرئيسيه")
                            {
                                lastResetIndex = i;
                            }
                        }
                    }

                    if (lastResetIndex >= 0)
                    {
                        orderedMsgs = orderedMsgs.Skip(lastResetIndex).ToList();
                    }

                    var recentMessages = orderedMsgs.TakeLast(15).ToList();
                    
                    if (recentMessages.Any())
                    {
                        var historyText = string.Join("\n", recentMessages.Select(m => $"{(m.SenderType == MessageSender.Customer ? "العميل" : "البوت")}: {m.Content}"));
                        var summaryPrompt = @"أنت مساعد ذكي لموظفي خدمة العملاء في شركة سفريات الملحم. 
المحادثة المرفقة قد تحتوي على استفسارات قديمة وجديدة متداخلة لنفس العميل.
تجاهل تماماً أي وجهات أو حجوزات قديمة في بداية المحادثة، وركز حصراً واستخرج بيانات ""أحدث طلب أو وجهة"" تحدث عنها العميل في رسائله الأخيرة.
صغ بيانات الطلب الأخير حصراً في البطاقة التالية:

📋 *ملخص طلب العميل:*
━━━━━━━
🌍 الوجهة: [اسم الوجهة الأخيرة أو غير محدد]
👥 المسافرون: [عدد الأشخاص والبالغين والأطفال أو غير محدد]
📅 التاريخ: [تاريخ أو شهر السفر الأخير أو غير محدد]
⏱️ المدة: [عدد الأيام أو غير محدد]
💰 الميزانية: [الميزانية أو غير محدد]
✈️ الطيران: [حالة الحجز، مطار المغادرة، درجة السفر كـ بزنس/اقتصادي إن ذكرت، أو غير محدد]
🏨 الفنادق: [فئة الفنادق إن ذكرت أو غير محدد]
📌 ملاحظات: [أي تفاصيل أو طلبات خاصة من العميل بخصوص رحلته الأخيرة]
━━━━━━━

تنبه حازم وصارم جداً:
- أخرج البطاقة بالشكل أعلاه بالضبط دون إضافة أي كلام قبلها أو بعده.
- اقرأ المحادثة المرفقة واستخرج جميع البيانات التي ذكرها العميل في رسائله (مثل الوجهة، عدد المسافرين والأطفال، التواريخ، الطيران، الفنادق، الميزانية). لا تكتب (غير محدد) لأي بند إذا كان العميل قد ذكره في أي رسالة سابقة بالمحادثة. اكتب (غير محدد) فقط للبنوك التي لم يذكرها العميل إطلاقاً.

المحادثة:
" + historyText;
                        
                        var aiResponse = await _aiService.GenerateResponseAsync("لخص المحادثة بدقة بناء على كلام العميل فقط", new List<ChatMessage>(), summaryPrompt);
                        
                        var privateNote = aiResponse.Text;
                        await _whatsAppProvider.SendPrivateNoteAsync(conversationId, privateNote);
                    }
                }
                catch (Exception noteEx)
                {
                    Console.WriteLine($"⚠️ Could not generate/send Private Note: {noteEx.Message}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Could not send handoff message or private note via provider: {ex.Message}");
            }
            
            // Smart queue routing for default handoffs:
            if (string.IsNullOrEmpty(targetGroupId))
            {
                bool isBookingContext = conversation.Notes != null && 
                    (conversation.Notes.Contains("Booking") || 
                     conversation.Notes.Contains("Dest") || 
                     conversation.Notes.Contains("Package") || 
                     conversation.Notes.Contains("Honeymoon") || 
                     conversation.Notes.Contains("Family") ||
                     conversation.Notes.Contains("تم اختيار 1"));

                targetGroupId = isBookingContext 
                    ? "ab160868-80de-427c-9a60-de78ac3c977d"  // Sales Queue for any booking/package inquiries!
                    : "9f5ef661-5e87-4f7e-a11d-9372bd08a1b4"; // Customer Support Queue for general inquiries!
            }

            try
            {
                await _whatsAppProvider.AssignConversationToGroupAsync(conversationId, targetGroupId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Could not assign to group: {ex.Message}");
            }

            // Always set conversation to Human mode so the bot stops responding
            conversation.Mode = ConversationMode.Human;
            _unitOfWork.WhatsAppConversations.Update(conversation);
            
            // Save the handoff message in the local database message list
            var outboundMessage = new WhatsAppMessage
            {
                Id = Guid.NewGuid(),
                ConversationId = conversation.Id,
                Direction = MessageDirection.Outbound,
                SenderType = MessageSender.Bot,
                Content = finalMessage,
                SentAt = DateTime.UtcNow,
                IsRead = true
            };
            await _unitOfWork.WhatsAppMessages.AddAsync(outboundMessage);
            await _unitOfWork.SaveChangesAsync();
        }

        private async Task<string> GetDestinationsMenuTextAsync()
        {
            var dests = await _unitOfWork.Destinations.FindAllAsync(d => d.IsActive);
            var activeDests = dests.OrderBy(d => d.SortOrder).ToList();
            
            var sb = new StringBuilder();
            sb.AppendLine("🌍 جميع وجهاتنا السياحية المتاحة:");
            sb.AppendLine();
            
            int i;
            for (i = 0; i < activeDests.Count; i++)
            {
                sb.AppendLine($"{GetDigitEmoji(i + 1)} - *{activeDests[i].NameAr}*");
            }
            sb.AppendLine($"{GetDigitEmoji(i + 1)} - *وجهة أخرى (تصميم باقة خاصة)*");
            
            sb.AppendLine("\n━━━━━━━━━━━━━━━");
            sb.AppendLine("👈 اكتب رقم الوجهة لعرض الباقات");
            sb.AppendLine("👈 0 للرجوع | 00 للرئيسية");
            
            return sb.ToString();
        }

        private async Task<string?> GetDestinationPackagesTextAsync(Destination dest, string backState)
        {
            var packages = await _unitOfWork.Packages.FindAllAsync(p => p.IsActive && p.DestinationId == dest.Id);
            var topPackages = packages.OrderBy(p => p.Price).Take(3).ToList();
            
            if (!topPackages.Any())
            {
                return null;
            }

            var sb = new StringBuilder();
            sb.AppendLine($"✨ أفضل باقاتنا لـ {dest.NameAr}:");
            sb.AppendLine();
            
            foreach (var p in topPackages)
            {
                sb.AppendLine($"🔹 {p.TitleAr}");
                sb.AppendLine($"📅 {p.Duration} | 💰 {p.Price} ر.س");
                sb.AppendLine($"🔗 https://almulhimtravel.com/package/{p.PackageId.Replace(" ", "-")}");
                sb.AppendLine();
            }
            sb.AppendLine($"💡 لتصفح كل العروض المتاحة لـ {dest.NameAr}:");
            sb.AppendLine($"https://almulhimtravel.com/destinations?destName={dest.NameAr}");

            sb.AppendLine("\n━━━━━━━━━━━━━━━");
            sb.AppendLine("👈 0 للرجوع | 00 للرئيسية\n👈 99 للتحدث مع موظف للحجز أو الاستفسار");
            
            return sb.ToString();
        }


        private async Task<string> GetPackagesForSpecificDestAsync(string destName, string backState)
        {
            string searchTerm = destName.ToLowerInvariant()
                .Replace("أ", "ا").Replace("إ", "ا").Replace("آ", "ا").Replace("ة", "ه");

            // Handle common spelling variations for countries and popular city aliases
            if (searchTerm.Contains("تايلند") || searchTerm.Contains("تايلاند") || searchTerm.Contains("بوكيت") || searchTerm.Contains("بانكوك") || searchTerm.Contains("باتايا")) searchTerm = "تايلند";
            else if (searchTerm.Contains("اندونيسيا") || searchTerm.Contains("بالي") || searchTerm.Contains("جاكرتا") || searchTerm.Contains("بونشاك")) searchTerm = "إندونيسيا".Replace("إ", "ا");
            else if (searchTerm.Contains("طرابزون") || searchTerm.Contains("اوزنجول") || searchTerm.Contains("اوزونجول") || searchTerm.Contains("اسطنبول") || searchTerm.Contains("انطاليا") || searchTerm.Contains("الشمال التركي") || searchTerm.Contains("بورصه") || searchTerm.Contains("بورصة") || searchTerm.Contains("صبنجا") || searchTerm.Contains("سبانجا")) searchTerm = "تركيا";
            else if (searchTerm.Contains("كوالالمبور") || searchTerm.Contains("لنكاوي") || searchTerm.Contains("بينانج") || searchTerm.Contains("سيلانجور")) searchTerm = "ماليزيا";
            else if (searchTerm.Contains("باكو") || searchTerm.Contains("قوبا") || searchTerm.Contains("غابالا") || searchTerm.Contains("قيلين") || searchTerm.Contains("اذربيجان")) searchTerm = "أذربيجان".Replace("أ", "ا");
            else if (searchTerm.Contains("تبليسي") || searchTerm.Contains("باتومي") || searchTerm.Contains("جورجيا")) searchTerm = "جورجيا";
            else if (searchTerm.Contains("موسكو") || searchTerm.Contains("سان بطرسبرغ") || searchTerm.Contains("روسيا")) searchTerm = "روسيا";
            else if (searchTerm.Contains("لندن") || searchTerm.Contains("بريطانيا")) searchTerm = "لندن";
            else if (searchTerm.Contains("باريس") || searchTerm.Contains("فرنسا")) searchTerm = "فرنسا";
            else if (searchTerm.Contains("مدريد") || searchTerm.Contains("برشلونه") || searchTerm.Contains("برشلونة") || searchTerm.Contains("ماربيا") || searchTerm.Contains("اسبانيا")) searchTerm = "اسبانيا";
            else if (searchTerm.Contains("ميونخ") || searchTerm.Contains("برلين") || searchTerm.Contains("فرانكفورت") || searchTerm.Contains("المانيا")) searchTerm = "المانيا";
            else if (searchTerm.Contains("فيينا") || searchTerm.Contains("سالزبورغ") || searchTerm.Contains("زيلامسي") || searchTerm.Contains("النمسا")) searchTerm = "النمسا";
            else if (searchTerm.Contains("براغ") || searchTerm.Contains("كارلوفي") || searchTerm.Contains("التشيك")) searchTerm = "التشيك";
            else if (searchTerm.Contains("سراييفو") || searchTerm.Contains("البوسنه") || searchTerm.Contains("البوسنة")) searchTerm = "البوسنه";

            var dests = await _unitOfWork.Destinations.FindAllAsync(d => d.IsActive);
            
            var dest = dests.FirstOrDefault(d => 
                (d.NameAr != null && d.NameAr.Replace("أ", "ا").Replace("إ", "ا").Replace("آ", "ا").Replace("ة", "ه").Contains(searchTerm)) || 
                (d.NameEn != null && d.NameEn.ToLowerInvariant().Contains(searchTerm)) || 
                (d.Slug != null && d.Slug.ToLowerInvariant().Contains(searchTerm)));
            
            if (dest == null)
            {
                // Deep Search Logic: Look in package titles, destination, and features
                var packages = await _unitOfWork.Packages.FindAllAsync(p => p.IsActive, p => p.Destination, p => p.Features);
                packages = packages.Where(p => 
                    (p.TitleAr != null && p.TitleAr.Replace("أ", "ا").Replace("إ", "ا").Replace("آ", "ا").Replace("ة", "ه").Contains(searchTerm)) || 
                    (p.TitleEn != null && p.TitleEn.ToLowerInvariant().Contains(searchTerm)) ||
                    (p.Destination != null && p.Destination.NameAr != null && p.Destination.NameAr.Replace("أ", "ا").Replace("إ", "ا").Replace("آ", "ا").Replace("ة", "ه").Contains(searchTerm)) ||
                    (p.Features != null && p.Features.Any(f => f.Text.Replace("أ", "ا").Replace("إ", "ا").Replace("آ", "ا").Replace("ة", "ه").Contains(searchTerm)))
                ).ToList();
                     
                if (packages.Any())
                {
                    var topPackages = packages.OrderBy(p => p.Price).Take(3).ToList();
                    var sb = new System.Text.StringBuilder();
                    sb.AppendLine($"✨ أفضل باقاتنا التي تتضمن ({destName}) (ملاحظة: الأسعار الموضحة لشخصين 👥):");
                    sb.AppendLine();
                    foreach (var p in topPackages)
                    {
                        sb.AppendLine($"🔹 {p.TitleAr}");
                        sb.AppendLine($"📅 {p.Duration} | 💰 {p.Price} ر.س");
                        sb.AppendLine($"🔗 https://almulhimtravel.com/package/{p.PackageId.Replace(" ", "-")}");
                        sb.AppendLine();
                    }
                    sb.AppendLine($"\n━━━━━━━━━━━━━━━\n👈 0 للرجوع | 00 للرئيسية\n👈 99 للتحدث مع موظف للحجز المباشر");
                    return sb.ToString();
                }

                return $"عذراً، لا توجد باقات جاهزة حالياً لـ {destName}.\nلكن يسعدنا تجهيز باقة مخصصة لك (Custom) بأفضل الأسعار! ✨\n\n━━━━━━━━━━━━━━━\n👈 اكتب (99) للتحدث مع موظف المبيعات وتصميم باقتك الان.\n👈 0 للرجوع | 00 للرئيسية";
            }
            
            return await GetDestinationPackagesTextAsync(dest, backState);
        }

        private string GetFreshworksMenuText()
        {
            return "مرحباً بك! أنا المساعد الذكي لسفريات الملحم 🤖\n\n" +
                   "لخدمتك بشكل أسرع، يرجى اختيار أحد الأقسام التالية:\n\n" +
                   "1️⃣ - للحجوزات الجديدة (عروض، باقات، طيران) ✈️\n" +
                   "2️⃣ - لمتابعة حجز سابق 📋\n" +
                   "3️⃣ - لخدمة العملاء والاستفسارات 📞\n\n" +
                   "فضلاً، اكتب رقم الخدمة المطلوبة: ✍️";
        }

        private bool IsGreeting(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return false;

            // Ignore image tags when considering if it's just a greeting
            var textWithoutImage = System.Text.RegularExpressions.Regex.Replace(text, @"\[IMAGE:\s*.*?\]", "", System.Text.RegularExpressions.RegexOptions.IgnoreCase).Trim();

            var clean = textWithoutImage.ToLowerInvariant()
                .Replace("أ", "ا").Replace("إ", "ا").Replace("آ", "ا")
                .Replace("ة", "ه").Replace("ى", "ي");
                
            string[] greetings = { 
                "السلام عليكم", "سلام", "مرحبا", "هلا", "اهلين", "اهلا", 
                "صباح الخير", "مساء الخير", "hi", "hello", "hey", "هاي" 
            };
            
            bool containsGreeting = greetings.Any(g => clean.Contains(g));
            if (containsGreeting)
            {
                var wordCount = clean.Split(new[] { ' ', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries).Length;
                if (wordCount <= 3) return true;
            }
            
            return false;
        }

        private async Task<string> GetHoneymoonMenuTextAsync()
        {
            var dests = await _unitOfWork.Destinations.FindAllAsync(d => d.IsActive);
            var activeDests = dests.OrderBy(d => d.SortOrder).ToList();
            
            var sb = new StringBuilder();
            sb.AppendLine("💕 ألف مبروك! نوفر لك أفضل الوجهات الرومانسية المخصصة لشهر العسل.");
            sb.AppendLine("اختر الوجهة المفضلة لك:");
            sb.AppendLine();
            
            int i;
            for (i = 0; i < activeDests.Count; i++)
            {
                sb.AppendLine($"{GetDigitEmoji(i + 1)} - *{activeDests[i].NameAr}*");
            }
            sb.AppendLine($"{GetDigitEmoji(i + 1)} - *وجهة أخرى (تصميم باقة خاصة)*");
            
            sb.AppendLine("\n━━━━━━━━━━━━━━━");
            sb.AppendLine("👈 اكتب رقم الوجهة لعرض الباقات");
            sb.AppendLine("👈 0 للرجوع | 00 للرئيسية");
            
            return sb.ToString();
        }

        private async Task<string> GetFamilyMenuTextAsync()
        {
            var dests = await _unitOfWork.Destinations.FindAllAsync(d => d.IsActive);
            var activeDests = dests.OrderBy(d => d.SortOrder).ToList();
            
            var sb = new StringBuilder();
            sb.AppendLine("👨‍👩‍👧‍👦 رحلات عائلية متكاملة بفعاليات تناسب جميع الأعمار:");
            sb.AppendLine("اختر الوجهة المناسبة لعائلتك:");
            sb.AppendLine();
            
            int i;
            for (i = 0; i < activeDests.Count; i++)
            {
                sb.AppendLine($"{GetDigitEmoji(i + 1)} - *{activeDests[i].NameAr}*");
            }
            sb.AppendLine($"{GetDigitEmoji(i + 1)} - *وجهة أخرى (تصميم باقة خاصة)*");
            
            sb.AppendLine("\n━━━━━━━━━━━━━━━");
            sb.AppendLine("👈 اكتب رقم الوجهة لعرض الباقات");
            sb.AppendLine("👈 0 للرجوع | 00 للرئيسية");
            
            return sb.ToString();
        }

        private string GetVisaMenuText()
        {
            return "🛂 خدمات استخراج التأشيرات:\nاختر الدولة لعرض المتطلبات:\n\n" +
                   "1️⃣ - *تأشيرة الشنغن (دول أوروبا)*\n" +
                   "2️⃣ - *تأشيرة بريطانيا*\n" +
                   "3️⃣ - *تأشيرة أمريكا*\n" +
                   "4️⃣ - *تأشيرات دول آسيا (فيتنام، الهند، وغيرها)*\n" +
                   "5️⃣ - *تأشيرة اليابان*\n\n" +
                   "━━━━━━━━━━━━━━━\n" +
                   "👈 0 للرجوع | 00 للرئيسية";
        }

        private string GetVisaDetailText(int visaId)
        {
            var detail = visaId switch
            {
                1 => "🇪🇺 تأشيرة الشنغن (أوروبا):\n\nالمتطلبات الأساسية:\n- تعبئة نموذج الطلب وحجز الموعد\n- حجز الطيران والفندق\n- ترجمة الهوية وبطاقة العائلة\n- تأمين السفر\n\nأما من طريقك (في موعد المقابلة):\n- كشف حساب بنكي 3 شهور إنجليزي (اللي ينزل فيه الراتب ولا يقل عن 20 ألف)\n- تعريف بالراتب إنجليزي\n- صور شخصية",
                2 => "🇬🇧 تأشيرة بريطانيا:\n\nالمتطلبات الأساسية:\n- صورة من الجواز الأصلي\n- صورة شخصية خلفية بيضاء",
                3 => "🇺🇸 تأشيرة أمريكا:\n\nتشمل تجهيز الملف وتعبئة النموذج وحجز الموعد للمقابلة.\n- تعتمد الموافقة على المقابلة الشخصية في السفارة.",
                4 => "🌏 تأشيرات آسيا:\n\nنوفر استخراج التأشيرات لدول آسيا مثل (فيتنام، الهند، الصين وغيرها).\n- الإجراءات سريعة والمتطلبات بسيطة في معظمها.",
                5 => "🇯🇵 تأشيرة اليابان:\n\nالمتطلبات الأساسية:\n- صورة شخصية مقاس الجواز وصورة الجواز بشكل واضح\n- بطاقة الأحوال وصورة التذكرة\n- كشف الحساب البنكي أو تعريف الراتب بالإنجليزي\n- تواريخ السفر والعودة ومطار الوصول\n- رقم الجوال، الايميل، جهة العمل، والمسمى الوظيفي\n\n➖ مدة الاستخراج 10 أيام\n➖ صلاحيتها 3 أشهر",
                _ => "عذراً، الخدمة غير متوفرة حالياً."
            };

            string contactSection = "\n━━━━━━━━━━━━━━━\nلاستخراج الفيزا السياحية يرجى التواصل مع الموظف المختص عبر واتساب مباشرةً 📱\n📞 الرقم: 0532737645\n⏰ أوقات العمل: من الأحد إلى الخميس، من 4:00 مساءً حتى 9:00 مساءً\n\n👈 اكتب 0 للرجوع | 00 للرئيسية";

            return detail + contactSection;

        }

        private string GetFAQMenuText()
        {
            return "❓ الأسئلة الشائعة:\n\n1 - هل الأسعار شاملة الطيران؟\n2 - ما هي طرق الدفع المتاحة؟\n3 - هل يوجد مرشد سياحي؟\n4 - ما هي سياسة الإلغاء؟\n5 - وين موقعكم وكيف أتواصل معكم؟\n\n━━━━━━━━━━━━━━━\n👈 اكتب رقم السؤال\n👈 0 للرجوع | 00 للرئيسية";
        }

        private string GetFAQAnswerText(int questionId)
        {
            var answer = questionId switch
            {
                1 => "أسعار الباقات السياحية تشمل الإقامة والتنقلات والبرنامج السياحي.\nتذاكر الطيران الدولي عادةً غير مشمولة ويتم حجزها بشكل منفصل حسب التاريخ لضمان أفضل سعر لك.",
                2 => "نقبل: تحويل بنكي، وبطاقات مدى وفيزا وماستركارد.\nكما تتوفر لدينا خدمات التقسيط عبر تابي وتمارا.\n\n(ولكن الأفضل دائماً الاستفادة من الخصم الخاص بالدفع الكاش أو الحوالة البنكية 💵).",
                3 => "نعم، معظم باقاتنا تتضمن مرشد سياحي متحدث بالعربية ومواصلات خاصة طوال فترة البرنامج.",
                4 => "سياسة الإلغاء:\n- حجز مسترد (أعلى تكلفة)\n- حجز غير مسترد (أقل تكلفة)\n\nكلما كان الحجز مبكراً كلما حصلت على شروط وأسعار أفضل.",
                5 => "📍 المملكة العربية السعودية\n📞 واتساب: +966535727771\n🌐 almulhimtravel.com\n⏰ أوقات الدوام: السبت - الخميس، 10 ص - 8:30 م",
                _ => "لا يوجد إجابة."
            };
            return answer + "\n\n━━━━━━━━━━━━━━━\n👈 99 للمزيد من الاستفسارات مع موظف\n👈 0 للرجوع للأسئلة | 00 للرئيسية";
        }



        public async Task<Core.Application.Services.WhatsApp.Models.AISupervisorResult> ProcessWithAISupervisorAsync(string userInput, string currentState, WhatsAppConversation conversation)
        {
            // Build conversation history from last 10 messages (optimized prompt window)
            var historyText = "";
            try
            {
                var allMessages = await _unitOfWork.WhatsAppMessages
                    .FindAllAsync(m => m.ConversationId == conversation.Id);
                var recentMessages = allMessages
                    .OrderByDescending(m => m.SentAt)
                    .Take(16)
                    .Reverse()
                    .ToList();

                var historyLines = new List<string>();
                foreach (var msg in recentMessages)
                {
                    string role;
                    if (msg.SenderType == MessageSender.Customer) role = "العميل";
                    else if (msg.SenderType == MessageSender.Human) role = "الموظف البشري";
                    else role = "أنت (البوت)";

                    var cleanContent = System.Text.RegularExpressions.Regex.Replace(
                        msg.Content ?? "", 
                        @"\[IMAGE:[\s\S]*?(\]|$)", 
                        "[صورة مرفقة]");

                    if (cleanContent.Length > 1000) cleanContent = cleanContent.Substring(0, 1000) + "...";

                    historyLines.Add($"{role}: {cleanContent}");
                }
                historyText = string.Join("\n", historyLines);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Could not load conversation history for supervisor: {ex.Message}");
            }

            string packagesKnowledge = "";
            try
            {
                var textForEmbedding = System.Text.RegularExpressions.Regex.Replace(
                    userInput ?? "", 
                    @"\[IMAGE:[\s\S]*?(\]|$)", 
                    "", 
                    System.Text.RegularExpressions.RegexOptions.Singleline).Trim();

                // Token & Cost Optimization: Skip expensive embedding calls for short/numeric/greeting inputs
                bool isShortOrNumeric = textForEmbedding.Length < 6 || int.TryParse(textForEmbedding, out _);
                if (!isShortOrNumeric)
                {
                    var queryVector = await _embeddingService.GetEmbeddingAsync(textForEmbedding);
                    var searchResults = await _vectorDbService.SearchAsync(queryVector, topK: 3, filterType: null, queryText: textForEmbedding);

                    if (searchResults.Any())
                    {
                        var pkgList = searchResults.Select(r => r.Text);
                        packagesKnowledge = "معلومات متعلقة بطلب العميل (باقات ورؤوس أقلام):\n" + string.Join("\n\n", pkgList);
                    }
                }
            }
            catch { }


            var sbPrompt = new System.Text.StringBuilder();
            sbPrompt.AppendLine("أنت المشرف الذكي (Super AI Agent) لبوت واتساب سفريات الملحم.");
            sbPrompt.AppendLine($"التاريخ الحالي للنظام: {DateTime.UtcNow:yyyy-MM-dd} (السنة الحالية: {DateTime.UtcNow.Year}). جميع التواريخ التي يذكرها أو يطلبها العميل تخص السنة الحالية {DateTime.UtcNow.Year} أو السنة القادمة.");
            sbPrompt.AppendLine("مهمتك مراجعة المحادثة كاملة واتخاذ القرار الصحيح. لا تقم أبداً بتأليف باقات أو أسعار من خيالك، نحن لدينا قاعدة بيانات جاهزة.");
            sbPrompt.AppendLine();
            sbPrompt.AppendLine("قاعدة المعرفة الخاصة بنا:");
            sbPrompt.AppendLine(WhatsAppKnowledgeBase.Content);
            sbPrompt.AppendLine();
            sbPrompt.AppendLine(@"الخيارات المتاحة للقرار (Action):
- ""show_packages"": اختر هذا الخيار لعرض الباقات السياحية الجاهزة عند استفسار العميل عن باقات أو عروض وجهة معينة (وليس لطلبات تذاكر الطيران المنفردة). **تنبيه صارم:** إذا كانت باقات الوجهة قد عُرضت للعميل سابقاً في سياق المحادثة أو كان العميل يزودك بتواريخ/عدد أيام/أشخاص أو يطلب باقة مخصصة، يُمنع منعاً باتاً اختيار ""show_packages"" مرة أخرى! اختر ""ask_details"" واسأله مباشرة عن المعلومة التالية الناقصة.
- ""ask_details"": اختر هذا الخيار إذا طلب العميل تفاصيل باقة أو تصميم رحلة أو تذاكر طيران أو فنادق، واسأله بلطف عن البيانات الناقصة فقط دون تكرار.
- ""handoff_sales"": لحجوزات الباقات السياحية بعد استيفاء البيانات الأساسية أو بطلب صريح من العميل. **يُمنع استخدامه من أول رسالة قبل معرفة التفاصيل**.
- ""show_destinations"": لاستكشاف الوجهات المتاحة بشكل عام.
- ""handoff_flights"": لحجوزات تذاكر الطيران المستقلة فقط (بدون بكج سياحي). إذا كان العميل قد حدد مطار المغادرة والوجهة وموعد السفر، اختر ""handoff_flights"" فوراً لتحويله لمسؤول التذاكر. وإذا كانت بيانات التذكرة ناقصة، استخدم أولاً ""ask_details"" لسؤاله عن (مطار المغادرة والوصول، تواريخ الذهاب والعودة، وعدد المسافرين).
- ""handoff_hotels"": لحجوزات الفنادق المستقلة فقط (بدون طيران أو بكج). (تنبيه هام: استخدم هذا الإجراء فقط بعد أن تستخدم الإجراء ""ask_details"" لسؤال العميل عن: المدينة، تاريخ الدخول والخروج، وعدد الأشخاص. يُمنع التحويل قبل جمع هذه المعلومات).
- ""handoff_visa"": لطلبات استخراج التأشيرات والفيزا المستقلة فقط (بدون باقة أو طيران). **تنبيه حاسم وصارم:** إذا كان العميل يصمم أو يستفسر عن باقة سياحية أو طيران وسأل سؤالاً فرعياً عن التأشيرة (مثل: كم مدة استخراجها، شروطها، هل تحتاج فيزا)، يُمنع منعاً باتاً اختيار ""handoff_visa""! أجب على سؤاله مباشرة باستخدام ""respond"" أو ""ask_details"" من واقع قاعدة المعرفة واستمر في مسار الباقة دون تحويل للفيزا.
- ""handoff_license"": لاستخراج الرخص الدولية (رخصة القيادة الدولية).
- ""handoff_transport"": لخدمات المواصلات، تأجير السيارات، والتوصيل والاستقبال من وإلى المطارات (مطار الدمام، الهفوف، الرياض) لجميع المشاوير بما في ذلك توصيل العوائل والعمالة المنزلية/الخادمات مع الأخ جعفر (0502447741).
- ""handoff_support"": للشكاوى الفنية والتنسيق.
- ""handoff_followup"": إذا كان العميل يستفسر عن حجز قائم مسبقاً لمتابعة رحلته.
- ""respond"": للرد المباشر والإجابة على استفسارات العميل وتزويده بالمعلومات مع سؤاله عن تفاصيل رحلته. (إذا سأل عن رحلات الكروز البحرية Cruise، استخدم ask_details لسؤاله عن الوجهة البحرية وموعد السفر وعدد الأشخاص ونوع الكابينة).

الأسئلة الـ 5 الأساسية لتجميع طلب العميل (اسأل سؤال واحد فقط في كل رسالة):
1. 👥 **عدد المسافرين** (كم شخص بالغ وأطفال وأعمارهم؟).
2. 📅 **تاريخ السفر** (متى تبون تسافرون تقريباً؟).
3. ✈️ **مطار المغادرة** (من أي مطار تفضلون المغادرة؟). ⚠️ إذا قال العميل ""شامل كل شيء"" أو ""بكج كامل"" أو ""مع الطيران""، فهذا يعني أنه يريد الوكالة تحجز الطيران، فلا تسأله ""هل تم حجز الطيران؟"" أبداً.
4. 🏨 **فئة الفنادق** (4 نجوم أم 5 نجوم أم شقق فندقية؟).
5. 💰 **الميزانية** (هل في ميزانية تقديرية؟).

0. قاعدة الاستخلاص الفوري ومنع التكرار البات (Strict Zero-Redundancy & Entity Extraction):
- افحص رسالة العميل وتاريخ المحادثة كاملاً واستخرج العناصر الـ 5 (الوجهة، التواريخ والمدة، عدد الأشخاص والأطفال، الطيران، الفنادق والميزانية).
- أي معلومة ذكرها العميل في أي رسالة سابقة أو في رسالته الحالية، تُعتبر مكتملة ومسجلة فوراً، ويُمنع منعاً باتاً السؤال عنها أو تكرار الاستفسار عنها بأي صيغة!
- اسأل فقط عن العناصر المتبقية والناقصة حصراً.
- في حال قام العميل بتعديل أي بيان أو غير رأيه (مثل تغيير الوجهة أو التواريخ أو عدد الأشخاص)، اعتمد فوراً أحدث معلومة ذكرها وتجاهل القديمة.
- إذا كان العميل قد ذكر كافة تفاصيل الرحلة كاملة في رسالته، لا تسأله أي سؤال إضافي، واختر إجراء ""handoff_sales"" فوراً لتوليد ملخص الحجز وتحويله للمبيعات.

1. منع الديباجات والمقدمات والتلخيص نهائياً (Zero Preamble & Zero Echoing): يُمنع منعاً باتاً البدء بعبارات تمهيدية أو تلخيصية مثل (أبشر، تمام، حياك الله، أهلاً بك، لتجهيز أفضل عرض لـ...، لتصميم باقة لـ...، بناءً على طلبك...، لشخصين وطفل...، يسعدنا...). ويُمنع تكرار أو إعادة نطق ما ذكره العميل. أول كلمة في ردك يجب أن تكون السؤال مباشرة بدون أي مقدمة. (مثال صحيح: ""من أي مطار تفضلون المغادرة؟"") (مثال خاطئ ممنوع: ""لتجهيز أفضل عرض لتايلند لشخصين وطفل، من أي مطار تفضلون المغادرة؟"").

2. عدم إعادة عرض الباقات الجاهزة (No Duplicate Packages): إذا عُرضت الباقات الجاهزة للعميل مسبقاً في المحادثة، لا تكرر إرسال الباقات مرة أخرى أبداً! اطرح السؤال التالي فوراً لتجميع بقية التواريخ والتفاصيل.

3. منع تكرار أو تلخيص كلام العميل (No Echoing / No Recapping): يُمنع منعاً باتاً إعادة نطق وتكرار الإجابات التي قدمها العميل. العميل يعرف ما كتبه، وكافة هذه البيانات تصل للموظف تلقائياً في بطاقة ملخص خاصة صامتة.
4. الإيجاز والتركيز (سؤال واحد فقط أو سؤالين كحد أقصى): يُمنع منعاً باتاً طرح أكثر من سؤالين في الرسالة الواحدة! العميل يكره القوائم الطويلة. اسأله خطوة بخطوة. (مثال صحيح: ""كم عدد الأشخاص وتاريخ السفر التقريبي؟"" - مثال خاطئ: ""وما هي الوجهة المفضلة وكم عدد الأشخاص وتاريخ السفر؟"" هذه 3 أسئلة!).
5. استيعاب الكلمات والمفردات الشائعة (Smart Entity Resolution):
- العبارات الفردية مثل (أنا لحالي، بنت لحالي، لوحدي، شخص واحد، بمفردي) تعني تلقائياً وبدقة: [عدد البالغين: 1، الأطفال: 0]، ويُمنع منعاً باتاً سؤال العميل مجدداً عن عدد البالغين أو الأطفال إذا ذكر أياً منها!
- العبارات الثنائية مثل (شخصين، زوجين، أنا وزوجي، أنا وزوجتي، شهر عسل) تعني تلقائياً: [عدد البالغين: 2، الأطفال: 0].
- الكلمات البسيطة المباشرة مثل (مزيج، الرياض، لا، شقق، 4 نجوم، كبار، اي نعم، سبتمبر) هي إجابات كاملة وصحيحة! افهمها واعتبرها إجابة واطرح السؤال التالي المتبقي فوراً، ولا تكرر نفس السؤال إذا أجاب العميل عليه.
- عبارات الشمول مثل (شامل كل شيء، شامل كل شي، بكج كامل، مع الطيران، شامل الطيران، الحجز شامل) تعني أن العميل يريد من الوكالة حجز كل شيء (طيران + فنادق + جولات). يُمنع منعاً باتاً سؤاله ""هل تم حجز الطيران الدولي؟""! اسأله فقط عن مطار المغادرة وتاريخ السفر.

6. الاستيعاب المرن غير الخطي للأسئلة (Non-linear Slot Extraction): إذا كنت تسأل العميل عن الفنادق وأجابك بمعلومة تخص الطيران أو موعد السفر (أو العكس)، سجّل المعلومة التي ذكرها فوراً في خانتها واعتبرها مكتملة، واطرح السؤال التالي المتبقي بلباقة دون إعادة السؤال السابق أبداً لمنع حلقات التكرار.

7. استخلاص درجات السفر (Business Class & Economy): إذا ذكر العميل درجة السفر (درجة رجال الأعمال، بزنس، Business Class، أو سياحية Economy)، سجّل الدرجة فوراً في خانة ""cabin_class""، ويُمنع منعاً باتاً السؤال مجدداً عن درجة السفر أو تخيير العميل بينهما إذا كان قد حددها مسبقاً! وإذا لم يحددها وسأل عن الفرق، وضح أن الباقات الأساسية اقتصادية مع إمكانية الترقية لدرجة رجال الأعمال.

8. الاحتفاظ بالوجهة (Destination Memory): بمجرد أن يذكر العميل اسم مدينة أو دولة (مثل تركيا أو بالي)، احتفظ بها في خانة ""destination"" طوال المحادثة ولا تنسها أو تحذفها أبداً حتى لو لم يكتمل الحجز.

9. استكمال الأسئلة الـ 5 كاملة: لا تحول العميل لموظف المبيعات فور إجابته عن التواريخ والعدد فقط، بل اسأله خطوة بخطوة عن الباقي (الطيران، الفنادق، الميزانية).

10. الانسحاب الصامت: عند اختيار ""handoff_sales""، لا تكرر بيانات الرحلة للعميل، بل اترك الرد قصيراً جداً أو فارغاً. وإذا رأيت رسالة من ""الموظف البشري""، اختر ""handoff_sales"" فوراً واترك الرد فارغاً تماماً.

11. خدمات تجديد عقود العمالة المنزلية والمعاملات: نحن نوفر كافة معاملات وتجديد عقود العمالة المنزلية (مثل الفلبينية وغيرها). عند استفسار العميل عن تجديد عقد عاملة أو أي معاملة رسمية، أكد توفر الخدمة مباشرة وزوده برقم مسؤول المعاملات والعقود المباشر عبر واتساب (0532737645) واختر إجراء ""handoff_visa"" ليتم تحويل المحادثة له فوراً.

12. الوجهات المخصصة ومنع الروابط الوهمية (Zero Fake Packages): الباقات الجاهزة المتاحة للعرض الفوري هي المسجلة في النظام فقط. لأي وجهة أخرى (مثل سويسرا، النمسا، إيطاليا، فرنسا، ألمانيا، المالديف... إلخ)، يُمنع منعاً باتاً اختراع باقات أو أسعار أو روابط pkg- من خيالك! استخدم دائماً إجراء ""ask_details"" لسؤال العميل عن التواريخ والأشخاص لتصميم بكج مخصص له عبر المبيعات.

13. استفسارات التوظيف والتدريب التعاوني والشراكات (Jobs & Training & B2B): نحن نرحب بجميع الكفاءات والشركاء وطلاب الجامعات. عند استفسار العميل عن وظائف شاغرة، تدريب صيفي أو تعاوني، أو شراكات تجارية، أجب بلطف بتقديم البريد الإلكتروني الرسمي للإدارة (almulhim_travel@yahoo.com) مع التوضيح بإمكانية إرسال السيرة الذاتية (CV) أو عرض الشراكة وسيتم التواصل معه من الإدارة، واختر إجراء ""handoff_support"" ليتم تحويل المحادثة للدعم الإداري.

14. استفسارات التوصيل للمطار ونقل العمالة والمشاوير (Airport Transfers & Transport): إذا طلب العميل خدمة توصيل أو استقبال من/إلى المطار (مثل مطار الدمام، الهفوف، الرياض) أو توصيل خادمة/عمالة أو عائلة، أكد توفر الخدمة فوراً وزوده برقم مسؤول المواصلات والتوصيل (الأخ جعفر: 0502447741) واختر إجراء ""handoff_transport"".

15. استفسارات التأشيرات ومنع التخمين (No Guessing on Visas): إذا سأل العميل عن مدة استخراج الفيزا أو شروطها دون تحديد اسم الدولة (مثل: ""كم مدة استخراج الفيزا"")، **يُمنع منعاً باتاً افتراض أنها شنغن أو ذكر أي مدة من خيالك**! اسأله فوراً: ""لأي دولة أو وجهة ترغب باستخراج التأشيرة؟"". وعند تحديد الدولة، التزم بمدد قاعدة المعرفة (الإلكترونية مثل بريطانيا وفيتنام خلال ساعات إلى 3-5 أيام، والشنغن وأمريكا تعتمد على حجز موعد البصمة بالسفارة).

الرد يجب أن يكون حصراً بصيغة JSON كالتالي:
{
  ""action"": ""..."",
  ""response"": ""..."",
  ""parameters"": {
     ""destination"": ""..."",
     ""check_in"": ""YYYY-MM-DD"",
     ""duration_days"": 5,
     ""adults"": 2,
     ""children"": 0,
     ""cabin_class"": ""Business / Economy / unspecified"",
     ""max_budget"": 5000
  }
}");
            var systemPrompt = sbPrompt.ToString();

            try
            {
                var sbUser = new System.Text.StringBuilder();
                if (!string.IsNullOrWhiteSpace(packagesKnowledge))
                {
                    sbUser.AppendLine($"=== معلومات إضافية من قاعدة البيانات ===\n{packagesKnowledge}\n");
                }
                if (!string.IsNullOrWhiteSpace(historyText))
                {
                    sbUser.AppendLine($"=== تاريخ المحادثة ===\n{historyText}\n");
                }
                sbUser.AppendLine($"الحالة الحالية للعميل (Current State): {currentState}");
                
                string menuOptions = currentState switch
                {
                    "FreshworksMenu" => GetFreshworksMenuText(),
                    "MainMenu" => GetMainMenuText(),
                    "DestinationsMenu" => await GetDestinationsMenuTextAsync(),
                    "HoneymoonMenu" => await GetHoneymoonMenuTextAsync(),
                    "FamilyMenu" => await GetFamilyMenuTextAsync(),
                    "VisaMenu" => GetVisaMenuText(),
                    "FAQMenu" => GetFAQMenuText(),
                    _ => ""
                };
                if (!string.IsNullOrEmpty(menuOptions))
                {
                    sbUser.AppendLine($"خيارات القائمة المعروضة حالياً أمامه:\n{menuOptions}");
                }

                sbUser.AppendLine($"الرسالة الحالية من العميل: \"{userInput}\"");

                var userMessage = sbUser.ToString();

                int maxRetries = 3;
                for (int attempt = 1; attempt <= maxRetries; attempt++)
                {
                    try
                    {
                        var response = await _aiService.GenerateResponseAsync(userMessage, new List<ChatMessage>(), systemPrompt);
                        var text = response.Text?.Trim() ?? "";
                        Console.WriteLine($"[AI Supervisor] Attempt {attempt} Raw Output Text: {text}");
                        
                        // Robust JSON Extraction to prevent LLM conversational hallucinations
                        text = text.Replace("```json", "").Replace("```", "").Trim();
                        int firstBrace = text.IndexOf('{');
                        int lastBrace = text.LastIndexOf('}');
                        
                        if (firstBrace >= 0 && lastBrace > firstBrace)
                        {
                            text = text.Substring(firstBrace, lastBrace - firstBrace + 1);
                        }

                        using var doc = System.Text.Json.JsonDocument.Parse(text);
                        var root = doc.RootElement;
                        
                        Core.Application.Services.WhatsApp.Models.PackageParameters? pkgParams = null;
                        if (root.TryGetProperty("parameters", out var pElement) && pElement.ValueKind == JsonValueKind.Object)
                        {
                            pkgParams = new Core.Application.Services.WhatsApp.Models.PackageParameters
                            {
                                Destination = pElement.TryGetProperty("destination", out var d) ? d.GetString() ?? "" : "",
                                CheckIn = pElement.TryGetProperty("check_in", out var c) ? c.GetString() ?? "" : "",
                                DurationDays = pElement.TryGetProperty("duration_days", out var dd) && dd.ValueKind == JsonValueKind.Number ? dd.GetInt32() : 0,
                                Adults = pElement.TryGetProperty("adults", out var ad) && ad.ValueKind == JsonValueKind.Number ? ad.GetInt32() : 2,
                                Children = pElement.TryGetProperty("children", out var ch) && ch.ValueKind == JsonValueKind.Number ? ch.GetInt32() : 0,
                                CabinClass = pElement.TryGetProperty("cabin_class", out var cc) ? cc.GetString() ?? "" : "",
                                MaxBudget = pElement.TryGetProperty("max_budget", out var mb) && mb.ValueKind == JsonValueKind.Number ? mb.GetDecimal() : 0
                            };
                        }

                        var rawResponseText = root.TryGetProperty("response", out var res) ? res.GetString() ?? "" : "";
                        
                        // Failsafe post-processing 0: Sanitize JSON leaks
                        rawResponseText = SanitizeBotResponse(rawResponseText);
                        
                        // Failsafe post-processing 0.5: Loop Breaker
                        var recentBotMessages = (await _unitOfWork.WhatsAppMessages
                            .FindAllAsync(m => m.ConversationId == conversation.Id && m.SenderType == MessageSender.Bot))
                            .OrderByDescending(m => m.SentAt)
                            .Take(6)
                            .ToList();

                        int repeatCount = recentBotMessages.Count(m => 
                            !string.IsNullOrEmpty(m.Content) && 
                            !string.IsNullOrEmpty(rawResponseText) &&
                            m.Content.Trim() == rawResponseText.Trim());

                        if (repeatCount >= 2)
                        {
                            Console.WriteLine($"🔄 LOOP DETECTED! Bot repeated same message {repeatCount + 1}x. Forcing handoff.");
                            return new Core.Application.Services.WhatsApp.Models.AISupervisorResult
                            {
                                Action = "handoff_sales",
                                Response = ""
                            };
                        }

                        // Failsafe post-processing 1: Clean any stray punctuation / filler headers cleanly without chopping words
                        rawResponseText = rawResponseText.TrimStart('!', '،', ',', '.', ':', '-', ' ', '\n', '\r');

                        // Pass 1: Strip greeting/filler words at start (أبشر، تمام، حياك الله، أهلاً بك، يسعدنا...)
                        rawResponseText = System.Text.RegularExpressions.Regex.Replace(
                            rawResponseText, 
                            @"^(أبشر\s*(طال\s*عمرك)?|سم\s*(طال\s*عمرك)?|تمام|حياك\s*الله|أهلاً?\s*بك|اهلاً?\s*بك|يسعدنا)[،\.!؟\n\s]+", 
                            "", 
                            System.Text.RegularExpressions.RegexOptions.IgnoreCase).Trim();

                        // Pass 2: HARD Direct Question Extractor — if there is any preamble before the question, extract ONLY the question
                        if (rawResponseText.Contains("؟") || rawResponseText.Contains("?"))
                        {
                            var qMatch = System.Text.RegularExpressions.Regex.Match(
                                rawResponseText,
                                @"(من\s+أي\s+مطار|كم\s+عدد|تاريخ\s+السفر|متى\s+تبون|متى\s+موعد|هل\s+تفضلون|هل\s+تم|في\s+أي\s+مدينة|ما\s+هي\s+فئة|ما\s+هو\s+تاريخ)[^؟\?]*[؟\?]",
                                System.Text.RegularExpressions.RegexOptions.Singleline | System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                            if (qMatch.Success)
                            {
                                rawResponseText = qMatch.Value.Trim();
                            }
                        }

                        // Pass 3: Strip any remaining recap preamble sentences
                        rawResponseText = System.Text.RegularExpressions.Regex.Replace(
                            rawResponseText, 
                            @"^(لتجهيز|لتصميم|بناءً?\s*على|بما\s+أن[^\s]*)\s+[^؟\?]*[،,\.:]\s*", 
                            "", 
                            System.Text.RegularExpressions.RegexOptions.IgnoreCase).Trim();

                        // Pass 4: HARD Multi-Question Cutter — if AI joined 2+ questions with "، وهل/وما/وكم/ومن/وأي/وكيف/ومتى", keep only the first question
                        {
                            var mqMatch = System.Text.RegularExpressions.Regex.Match(
                                rawResponseText,
                                @"[،,]\s*و(هل|ما\s|كم\s|من\s|أي\s|كيف\s|متى\s)");
                            if (mqMatch.Success)
                            {
                                rawResponseText = rawResponseText.Substring(0, mqMatch.Index).TrimEnd('،', ',', ' ') + "؟";
                            }
                        }

                        rawResponseText = rawResponseText.TrimStart('!', '،', ',', '.', ':', '-', ' ', '\n', '\r');

                        var action = root.TryGetProperty("action", out var act) ? act.GetString() ?? "respond" : "respond";
                        var targetDest = pkgParams?.Destination ?? "";

                        // ✅ [NEW] Destination Catcher (Safeguard)
                        if (string.IsNullOrWhiteSpace(targetDest))
                        {
                            var knownDests = new[] { "تايلند", "تايلاند", "بوكيت", "بانكوك", "باتايا", "اندونيسيا", "إندونيسيا", "بالي", "جاكرتا", "بونشاك", "طرابزون", "اوزنجول", "اسطنبول", "انطاليا", "الشمال التركي", "بورصه", "بورصة", "صبنجا", "سبانجا", "تركيا", "كوالالمبور", "لنكاوي", "بينانج", "سيلانجور", "ماليزيا", "باكو", "قوبا", "غابالا", "قيلين", "اذربيجان", "أذربيجان", "تبليسي", "باتومي", "جورجيا", "موسكو", "سان بطرسبرغ", "روسيا", "لندن", "بريطانيا", "باريس", "فرنسا", "مدريد", "برشلونه", "برشلونة", "ماربيا", "اسبانيا", "ميونخ", "برلين", "فرانكفورت", "المانيا", "فيينا", "سالزبورغ", "زيلامسي", "النمسا", "براغ", "كارلوفي", "التشيك", "سراييفو", "البوسنه", "البوسنة" };
                            var cleanInput = (userInput ?? "").Replace("أ", "ا").Replace("إ", "ا").Replace("آ", "ا").Replace("ة", "ه");
                            
                            foreach (var kw in knownDests)
                            {
                                if (cleanInput.Contains(kw))
                                {
                                    targetDest = kw;
                                    break;
                                }
                            }
                        }

                        bool packagesAlreadySentForThisDest = !string.IsNullOrEmpty(historyText) && !string.IsNullOrEmpty(targetDest) &&
                            (historyText.Contains($"أفضل باقاتنا لـ {targetDest}") || 
                             historyText.Contains($"almulhimtravel.com/package") ||
                             (historyText.Contains("أفضل باقاتنا") && historyText.Contains(targetDest)));

                        // Failsafe post-processing 2: Prevent repeating show_packages ONLY if packages for THIS SPECIFIC destination were already sent in history
                        if (action == "show_packages" && packagesAlreadySentForThisDest)
                        {
                            action = "ask_details";
                        }

                        return new Core.Application.Services.WhatsApp.Models.AISupervisorResult
                        {
                            Action = action,
                            Response = rawResponseText,
                            Destination = pkgParams?.Destination ?? "",
                            Parameters = pkgParams
                        };
                    }
                    catch (Exception parseEx)
                    {
                        Console.WriteLine($"[AI Supervisor] Attempt {attempt} Failed: {parseEx.Message}");
                        if (attempt == maxRetries)
                        {
                            return new Core.Application.Services.WhatsApp.Models.AISupervisorResult
                            {
                                Action = "handoff_sales",
                                Response = "أهلاً بك! تم استلام رسالتك وتفاصيل طلبك، وجاري تحويلك للمختصين لمساعدتك فوراً 👨‍💼"
                            };
                        }
                    }
                }
                
                return new Core.Application.Services.WhatsApp.Models.AISupervisorResult
                {
                    Action = "handoff_sales",
                    Response = "أهلاً بك! تم استلام رسالتك وتفاصيل طلبك، وجاري تحويلك للمختصين لمساعدتك فوراً 👨‍💼"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"AI Supervisor Error: {ex.Message}");
                return new Core.Application.Services.WhatsApp.Models.AISupervisorResult
                {
                    Action = "handoff_sales",
                    Response = "أهلاً بك! تم استلام رسالتك وتفاصيل طلبك، وجاري تحويلك للمختصين لمساعدتك فوراً 👨‍💼"
                };
            }
        }

        private async Task<string> HandleDynamicPackagingAsync(Core.Application.Services.WhatsApp.Models.PackageParameters? parameters, WhatsAppConversation conversation)
        {
            if (parameters == null || string.IsNullOrEmpty(parameters.Destination))
                return "يرجى تحديد الوجهة التي ترغب بالسفر إليها (مثل: أبي أسافر دبي) لنتمكن من تجهيز البكج المناسب لك 🌍";

            int duration = parameters.DurationDays > 0 ? parameters.DurationDays : 5;
            decimal estimatedCostPerDay = 800m; 
            decimal totalBudget = parameters.MaxBudget > 0 ? parameters.MaxBudget : (duration * estimatedCostPerDay * parameters.Adults);

            var voucherText = $"🎉 *عرض حصري تم تجهيزه لك خصيصاً!* 🎉\n\n" +
                              $"📍 الوجهة: {parameters.Destination}\n" +
                              $"📅 المدة: {duration} أيام\n" +
                              $"👥 الأشخاص: {parameters.Adults} بالغين" + (parameters.Children > 0 ? $" و {parameters.Children} أطفال\n" : "\n") +
                              $"🏨 الفنادق: 4 نجوم ممتازة\n" +
                              $"🚗 المواصلات: سيارة خاصة طوال الرحلة\n\n" +
                              $"💰 *السعر الإجمالي المخفض:* {totalBudget} ريال سعودي\n\n" +
                              $"هل السعر مناسب لك لنبدأ في إجراءات الحجز وإصدار الفواتشر؟ 📝\n" +
                              $"أرسل (نعم) للحجز، أو أخبرني إذا كان السعر (غالي) لنقوم بتعديله لك!";

            return voucherText;
        }

        private async Task<string> HandlePricingObjectionAsync(Core.Application.Services.WhatsApp.Models.PackageParameters? parameters, string aiResponse, WhatsAppConversation conversation)
        {
            var text = !string.IsNullOrEmpty(aiResponse) ? aiResponse : "ولا يهمك، راحتك تهمنا! يمكننا تقليل التكلفة لك بما يتناسب مع ميزانيتك.";
            text += "\n\n✨ *العرض المعدل الجديد:* ✨\n" +
                    $"تم تخفيض السعر بنسبة 15% من خلال استبدال الفنادق إلى 3 نجوم اقتصادية وتقليص الجولات.\n\n" +
                    $"هل أصبح السعر الآن مناسباً لنعتمد الحجز؟ أرسل (نعم) للتأكيد.";
            return text;
        }

        private async Task HandleFlightRequestHandoffAsync(string freshchatConversationId, WhatsAppConversation conversation, Core.Application.Services.WhatsApp.Models.AISupervisorResult aiResult, string input)
        {
            var msgs = await _unitOfWork.WhatsAppMessages.FindAllAsync(m => m.ConversationId == conversation.Id);
            var allText = string.Join(" ", msgs.Select(m => m.Content ?? "")) + " " + input;
            
            bool hasAirport = allText.Contains("مطار") || allText.Contains("الرياض") || allText.Contains("جدة") || 
                              allText.Contains("الدمام") || allText.Contains("الهفوف") || allText.Contains("الاحساء") || 
                              allText.Contains("الأحساء") || allText.Contains("المدينة") || allText.Contains("القصيم") || 
                              allText.Contains("من ");
            
            bool customerUnsureOrSkippedAirport = allText.Contains("ما حددت") || allText.Contains("ماحددت") || 
                                                  allText.Contains("ما اعرف") || allText.Contains("ماعرف") || 
                                                  allText.Contains("اي مطار") || allText.Contains("أي مطار") || 
                                                  allText.Contains("مو محدد") || allText.Contains("غير محدد") || 
                                                  allText.Contains("عادي") || allText.Contains("ماعندي");

            bool alreadyAskedOnce = conversation.Notes?.Contains("WaitingForFlightDetails") == true;
            
            bool hasDate = allText.Contains("سبتمبر") || allText.Contains("اكتوبر") || allText.Contains("أكتوبر") || 
                           allText.Contains("نوفمبر") || allText.Contains("ديسمبر") || allText.Contains("يناير") || 
                           allText.Contains("فبراير") || allText.Contains("مارس") || allText.Contains("ابريل") || 
                           allText.Contains("أبريل") || allText.Contains("مايو") || allText.Contains("يونيو") || 
                           allText.Contains("يوليو") || allText.Contains("اغسطس") || allText.Contains("أغسطس") || 
                           allText.Contains("يوم") || allText.Contains("شهر") || allText.Contains("تاريخ") || 
                           System.Text.RegularExpressions.Regex.IsMatch(allText, @"\d{1,2}[/-]\d{1,2}");

            // If missing details and not already asked once and customer hasn't expressed uncertainty -> ask once
            if ((!hasAirport && !customerUnsureOrSkippedAirport && !alreadyAskedOnce) && !hasDate)
            {
                string askFlightText = !string.IsNullOrWhiteSpace(aiResult.Response) && (aiResult.Response.Contains("؟") || aiResult.Response.Contains("مطار"))
                    ? aiResult.Response
                    : "من أي مطار تفضلون المغادرة وتاريخ السفر التقريبي؟ ✈️";

                conversation.Notes = "[STATE:WaitingForFlightDetails]";
                _unitOfWork.WhatsAppConversations.Update(conversation);
                await SendAndSaveResponseAsync(conversation, askFlightText);
                return;
            }

            var flightMsg = !string.IsNullOrWhiteSpace(aiResult.Response) && !aiResult.Response.Contains("؟")
                ? aiResult.Response
                : "تم استلام وتجهيز طلب تذاكر الطيران الخاص بكم ✅\nجاري تحويلكم لمسؤول التذاكر لمطابقة وتزويدكم بأفضل أسعار الرحلات... ✈️👨‍✈️";
            await TriggerAgentHandoff(freshchatConversationId, conversation, flightMsg, "ab160868-80de-427c-9a60-de78ac3c977d");
        }

        private async Task HandleHotelRequestHandoffAsync(string freshchatConversationId, WhatsAppConversation conversation, Core.Application.Services.WhatsApp.Models.AISupervisorResult aiResult, string input)
        {
            var msgs = await _unitOfWork.WhatsAppMessages.FindAllAsync(m => m.ConversationId == conversation.Id);
            var allText = string.Join(" ", msgs.Select(m => m.Content ?? "")) + " " + input;

            bool hasDateOrCity = allText.Contains("دخول") || allText.Contains("خروج") || allText.Contains("ليالي") || 
                                 allText.Contains("ايام") || allText.Contains("أيام") || allText.Contains("تاريخ") ||
                                 System.Text.RegularExpressions.Regex.IsMatch(allText, @"\d{1,2}[/-]\d{1,2}");

            if (!hasDateOrCity)
            {
                string askHotelText = !string.IsNullOrWhiteSpace(aiResult.Response) && (aiResult.Response.Contains("؟") || aiResult.Response.Contains("فندق"))
                    ? aiResult.Response
                    : "في أي مدينة تفضل الإقامة وتواريخ الدخول والخروج؟ 🏨";

                conversation.Notes = "[STATE:WaitingForBookingDetails]";
                _unitOfWork.WhatsAppConversations.Update(conversation);
                await SendAndSaveResponseAsync(conversation, askHotelText);
                return;
            }

            var hotelMsg = !string.IsNullOrWhiteSpace(aiResult.Response) && !aiResult.Response.Contains("؟")
                ? aiResult.Response
                : "تم استلام طلب الفندق الخاص بكم ✅\nجاري تحويلكم للموظف المختص لتأكيد الحجز بأفضل سعر... 🏨👨‍💼";
            await TriggerAgentHandoff(freshchatConversationId, conversation, hotelMsg, "ab160868-80de-427c-9a60-de78ac3c977d");
        }

        private string GetDigitEmoji(int number)
        {
            return number switch
            {
                0 => "0️⃣",
                1 => "1️⃣",
                2 => "2️⃣",
                3 => "3️⃣",
                4 => "4️⃣",
                5 => "5️⃣",
                6 => "6️⃣",
                7 => "7️⃣",
                8 => "8️⃣",
                9 => "9️⃣",
                10 => "🔟",
                _ => number.ToString()
            };
        }

        private static string SanitizeBotResponse(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return text;
            
            var cleaned = text.Replace("```json", "").Replace("```", "").Trim();

            // 1. If it contains JSON markers ("action": or "response": or starts with {)
            if (cleaned.Contains("\"action\":") || cleaned.Contains("\"response\":") || cleaned.StartsWith("{"))
            {
                // A. Try standard JSON Document parse first
                try
                {
                    var jsonToTry = cleaned;
                    int firstBrace = jsonToTry.IndexOf('{');
                    int lastBrace = jsonToTry.LastIndexOf('}');
                    if (firstBrace >= 0 && lastBrace > firstBrace)
                    {
                        jsonToTry = jsonToTry.Substring(firstBrace, lastBrace - firstBrace + 1);
                    }

                    using var doc = System.Text.Json.JsonDocument.Parse(jsonToTry);
                    if (doc.RootElement.ValueKind == System.Text.Json.JsonValueKind.Object)
                    {
                        if (doc.RootElement.TryGetProperty("response", out var resVal) && resVal.ValueKind == System.Text.Json.JsonValueKind.String)
                        {
                            var resStr = resVal.GetString();
                            if (!string.IsNullOrWhiteSpace(resStr)) return resStr.Trim();
                        }
                    }
                }
                catch
                {
                    // B. Fallback: Robust Regex extraction of "response": "..." (handles multiline and escaped quotes)
                    var match = System.Text.RegularExpressions.Regex.Match(
                        cleaned,
                        @"""response""\s*:\s*""((?:[^""\\]|\\.)*)""",
                        System.Text.RegularExpressions.RegexOptions.Singleline);

                    if (match.Success && match.Groups[1].Value.Length > 0)
                    {
                        var extracted = match.Groups[1].Value
                            .Replace("\\\"", "\"")
                            .Replace("\\n", "\n")
                            .Replace("\\r", "")
                            .Replace("\\t", " ")
                            .Trim();

                        if (!string.IsNullOrWhiteSpace(extracted))
                        {
                            return extracted;
                        }
                    }
                }

                // C. Secondary Regex: Strip leading JSON headers and trailing JSON footers
                cleaned = System.Text.RegularExpressions.Regex.Replace(
                    cleaned,
                    @"^\s*\{\s*""action""\s*:\s*""[^""]*""\s*,\s*""response""\s*:\s*""",
                    "",
                    System.Text.RegularExpressions.RegexOptions.Singleline);

                cleaned = System.Text.RegularExpressions.Regex.Replace(
                    cleaned,
                    @"""\s*,?\s*""parameters""\s*:\s*\{[\s\S]*$",
                    "",
                    System.Text.RegularExpressions.RegexOptions.Singleline);

                cleaned = System.Text.RegularExpressions.Regex.Replace(
                    cleaned,
                    @"""\s*\}\s*$",
                    "",
                    System.Text.RegularExpressions.RegexOptions.Singleline);

                cleaned = cleaned.Replace("\\n", "\n").Replace("\\r", "").Replace("\\t", " ").Trim();
            }

            // 2. Final safety check: If the text STILL looks like raw code or broken JSON (e.g. starts with { or contains "action":)
            if (cleaned.StartsWith("{") || cleaned.Contains("\"action\":") || cleaned.Contains("\"parameters\":") || cleaned.Trim() == "{" || cleaned.Trim() == "{\n   \"")
            {
                return "أهلاً بك! كيف يمكنني مساعدتك في حجز أو تخطيط رحلتك اليوم؟ 🌍";
            }

            return cleaned;
        }
    }
}

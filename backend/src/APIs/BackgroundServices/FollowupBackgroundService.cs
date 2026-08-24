using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services;
using Core.Domain.Enums;
using APIs.Helpers;

namespace APIs.BackgroundServices
{
    public class FollowupBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public FollowupBackgroundService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    BotLogger.Log("🔍 Running FollowupBackgroundService radar...");
                    using var scope = _serviceProvider.CreateScope();
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                    var whatsappProvider = scope.ServiceProvider.GetRequiredService<IWhatsAppProvider>();

                    var threshold = DateTime.UtcNow.AddHours(-3);
                    var oldLimit = DateTime.UtcNow.AddHours(-4);

                    // Find conversations that have been idle between 3 to 4 hours
                    var droppedConversations = await unitOfWork.WhatsAppConversations.FindAllAsync(c => 
                        c.Mode == ConversationMode.Bot && 
                        c.LastMessageAt <= threshold &&
                        c.LastMessageAt >= oldLimit &&
                        c.Notes != null && c.Notes.Contains("BuildingPackage"));

                    foreach (var conv in droppedConversations)
                    {
                        if (conv.Notes != null && !conv.Notes.Contains("[FOLLOWUP_SENT]"))
                        {
                            var followUpMsg = $"مرحباً بك مجدداً {conv.CustomerName ?? ""} 🌹\n" +
                                              $"لاحظت أنك لم ترد بعد إرسال العرض الأخير، هل الميزانية غير مناسبة لنقوم بتعديلها لك أو اقتراح وجهة أخرى؟ 🌍\n" +
                                              $"أنا هنا لمساعدتك، فقط أخبرني بما يناسبك!";

                            // Send Message
                            await whatsappProvider.SendTextMessageAsync(conv.CustomerPhone, followUpMsg);

                            // Save Outbound Message to DB
                            var outMsg = new Core.Domain.Entities.WhatsApp.WhatsAppMessage
                            {
                                Id = Guid.NewGuid(),
                                ConversationId = conv.Id,
                                Direction = MessageDirection.Outbound,
                                SenderType = MessageSender.Bot,
                                Content = followUpMsg,
                                SentAt = DateTime.UtcNow
                            };
                            await unitOfWork.WhatsAppMessages.AddAsync(outMsg);

                            conv.Notes += "[FOLLOWUP_SENT]";
                            unitOfWork.WhatsAppConversations.Update(conv);
                        }
                    }

                    await unitOfWork.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    BotLogger.Log($"⚠️ Error in FollowupBackgroundService: {ex.Message}");
                }

                // Run every 30 minutes
                await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
            }
        }
    }
}

using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services;
using Core.Domain.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Shared.Services
{
    public class WhatsAppRetargetingService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<WhatsAppRetargetingService> _logger;

        public WhatsAppRetargetingService(IServiceProvider serviceProvider, ILogger<WhatsAppRetargetingService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("WhatsAppRetargetingService is starting.");

            // Run periodically every 1 hour
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessAbandonedConversationsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while executing WhatsApp retargeting.");
                }

                // Wait for 1 hour before running again
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }

        private async Task ProcessAbandonedConversationsAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var whatsAppProvider = scope.ServiceProvider.GetRequiredService<IWhatsAppProvider>();

            // Find conversations abandoned for more than 24 hours
            var cutoffTime = DateTime.UtcNow.AddHours(-24);
            
            var abandonedConversations = await unitOfWork.WhatsAppConversations.FindAllAsync(
                c => c.Mode == ConversationMode.Bot && 
                     c.LastMessageAt <= cutoffTime,
                cancellationToken);

            // Filter in memory for notes to avoid translation issues in EF Core for null/Contains
            var conversationsToRetarget = abandonedConversations
                .Where(c => c.Notes == null || !c.Notes.Contains("[RETARGETED]"))
                .ToList();

            if (!conversationsToRetarget.Any())
                return;

            _logger.LogInformation("Found {Count} abandoned WhatsApp conversations for retargeting.", conversationsToRetarget.Count);

            foreach (var conversation in conversationsToRetarget)
            {
                if (cancellationToken.IsCancellationRequested) break;

                try
                {
                    if (string.IsNullOrEmpty(conversation.FreshchatConversationId))
                    {
                        _logger.LogWarning("Conversation {ConversationId} has no FreshchatConversationId. Skipping retargeting.", conversation.Id);
                        continue;
                    }

                    var msg = "مرحباً بك مجدداً من سفريات الملحم 👋\n" +
                              "لاحظنا أنك كنت تستفسر بالأمس ولم تكمل محادثتك.. نأمل أن يكون المانع خيراً! 😊\n\n" +
                              "إذا كان لديك أي سؤال إضافي أو تحتاج مساعدة في اختيار رحلتك القادمة، فريقنا متواجد هنا لخدمتك دائماً.\n" +
                              "هل تحب أن نربطك الآن بأحد موظفينا لمساعدتك؟ (اكتب 99 للتحدث مع الموظف)";

                    await whatsAppProvider.SendTextMessageAsync(conversation.FreshchatConversationId, msg);

                    conversation.Notes = (conversation.Notes ?? "") + " [RETARGETED]";
                    unitOfWork.WhatsAppConversations.Update(conversation);
                    await unitOfWork.SaveChangesAsync(cancellationToken);
                    
                    _logger.LogInformation("Sent retargeting message to conversation {ConversationId}", conversation.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send retargeting message to conversation {ConversationId}", conversation.Id);
                }
                
                // Small delay to prevent rate-limiting from Freshchat API
                await Task.Delay(500, cancellationToken);
            }
        }
    }
}

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
    public class PostSaleFollowUpService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<PostSaleFollowUpService> _logger;

        public PostSaleFollowUpService(IServiceProvider serviceProvider, ILogger<PostSaleFollowUpService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("PostSaleFollowUpService is starting.");

            // Run periodically every day at a specific time, but for simplicity, we check every 6 hours
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessPreFlightRemindersAsync(stoppingToken);
                    await ProcessPostTripFeedbackAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while executing post-sale follow ups.");
                }

                await Task.Delay(TimeSpan.FromHours(6), stoppingToken);
            }
        }

        private async Task ProcessPreFlightRemindersAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var whatsAppProvider = scope.ServiceProvider.GetRequiredService<IWhatsAppProvider>();

            var tomorrow = DateTime.UtcNow.AddDays(1).Date;
            
            var packageBookings = await unitOfWork.PackageBookings.FindAllAsync(
                pb => pb.Booking.Status == BookingStatus.Confirmed && pb.StartDate.Date == tomorrow,
                pb => pb.Booking, pb => pb.Package);

            foreach (var pb in packageBookings)
            {
                var phone = pb.Booking.User?.Phone ?? pb.Booking.GuestPhone;
                if (!string.IsNullOrEmpty(phone) && !HasFollowUpNote(pb.Booking, "PRE_FLIGHT"))
                {
                    var msg = $"مرحباً بك من سفريات الملحم ✈️\n" +
                              $"نود تذكيرك بأن موعد انطلاق رحلتك في باقة ({pb.Package.TitleAr}) سيكون غداً!\n" +
                              $"نتمنى لك رحلة سعيدة وآمنة، ولا تتردد في التواصل معنا لأي استفسار.\n" +
                              $"رقم الحجز: {pb.Booking.ReferenceNumber}";

                    await whatsAppProvider.SendTextMessageAsync(phone, msg);
                    MarkFollowUpSent(pb.Booking, "PRE_FLIGHT");
                    unitOfWork.Bookings.Update(pb.Booking);
                }
            }
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        private async Task ProcessPostTripFeedbackAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var whatsAppProvider = scope.ServiceProvider.GetRequiredService<IWhatsAppProvider>();

            var twoDaysAgo = DateTime.UtcNow.AddDays(-2).Date;
            
            var packageBookings = await unitOfWork.PackageBookings.FindAllAsync(
                pb => pb.Booking.Status == BookingStatus.Confirmed,
                pb => pb.Booking, pb => pb.Package);

            foreach (var pb in packageBookings)
            {
                int durationDays = 5; 
                if (!string.IsNullOrEmpty(pb.Package.Duration) && int.TryParse(new string(pb.Package.Duration.TakeWhile(char.IsDigit).ToArray()), out int days))
                {
                    durationDays = days > 0 ? days : 5;
                }

                var endDate = pb.StartDate.AddDays(durationDays).Date;
                
                if (endDate == twoDaysAgo)
                {
                    var phone = pb.Booking.User?.Phone ?? pb.Booking.GuestPhone;
                    if (!string.IsNullOrEmpty(phone) && !HasFollowUpNote(pb.Booking, "FEEDBACK"))
                    {
                        var msg = $"حمداً لله على سلامتكم! 🌸\n" +
                                  $"نتمنى أن تكون رحلتكم في ({pb.Package.TitleAr}) مع سفريات الملحم قد نالت إعجابكم.\n" +
                                  $"يهمنا جداً معرفة رأيك لتقييم خدمتنا وتطويرها:\n" +
                                  $"https://almulhimtravel.com/feedback/{pb.Booking.ReferenceNumber}\n\n" +
                                  $"ننتظر تواصلكم في رحلاتكم القادمة! 🌍";

                        await whatsAppProvider.SendTextMessageAsync(phone, msg);
                        MarkFollowUpSent(pb.Booking, "FEEDBACK");
                        unitOfWork.Bookings.Update(pb.Booking);
                    }
                }
            }
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        private bool HasFollowUpNote(Core.Domain.Entities.Reservations.Booking booking, string tag)
        {
            return booking.SpecialRequests != null && booking.SpecialRequests.Contains($"[{tag}]");
        }

        private void MarkFollowUpSent(Core.Domain.Entities.Reservations.Booking booking, string tag)
        {
            booking.SpecialRequests = (booking.SpecialRequests ?? "") + $" [{tag}]";
        }
    }
}

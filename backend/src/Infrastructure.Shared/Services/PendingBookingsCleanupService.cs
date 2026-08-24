using Core.Application.Abstraction.Interfaces;
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
    public class PendingBookingsCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<PendingBookingsCleanupService> _logger;

        public PendingBookingsCleanupService(IServiceProvider serviceProvider, ILogger<PendingBookingsCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("PendingBookingsCleanupService is starting.");

            // Run periodically (e.g., every 5 minutes)
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupPendingBookingsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while executing pending bookings cleanup.");
                }

                // Wait for 5 minutes before running again
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }

        private async Task CleanupPendingBookingsAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

            // Find bookings that have been pending for more than 15 minutes
            var cutoffTime = DateTime.UtcNow.AddMinutes(-15);
            
            var pendingBookings = await unitOfWork.Bookings.FindAllAsync(
                b => b.Status == BookingStatus.Pending && b.CreatedAt <= cutoffTime,
                cancellationToken);

            var bookingsToCancel = pendingBookings.ToList();
            if (!bookingsToCancel.Any())
                return;

            _logger.LogInformation("Found {Count} pending bookings older than 15 minutes to cancel.", bookingsToCancel.Count);

            await unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                foreach (var booking in bookingsToCancel)
                {
                    booking.Status = BookingStatus.Cancelled;
                    booking.CancelledAt = DateTime.UtcNow;
                    
                    unitOfWork.Bookings.Update(booking);
                }

                await unitOfWork.SaveChangesAsync(cancellationToken);
                await unitOfWork.CommitTransactionAsync(cancellationToken);
                
                _logger.LogInformation("Successfully cancelled {Count} abandoned bookings.", bookingsToCancel.Count);
            }
            catch (Exception ex)
            {
                await unitOfWork.RollbackTransactionAsync(cancellationToken);
                _logger.LogError(ex, "Failed to cancel abandoned bookings during transaction commit.");
                throw;
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.Interfaces;
using Core.Domain.Entities.Reservations;
using Core.Domain.Enums;
using FluentAssertions;
using Infrastructure.Shared.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Almulhem.Travel.UnitTests.Services
{
    public class PendingBookingsCleanupServiceTests
    {
        private readonly Mock<IServiceProvider> _mockServiceProvider;
        private readonly Mock<IServiceScopeFactory> _mockServiceScopeFactory;
        private readonly Mock<IServiceScope> _mockServiceScope;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<ILogger<PendingBookingsCleanupService>> _mockLogger;
        private readonly PendingBookingsCleanupService _sut;

        public PendingBookingsCleanupServiceTests()
        {
            _mockServiceProvider = new Mock<IServiceProvider>();
            _mockServiceScopeFactory = new Mock<IServiceScopeFactory>();
            _mockServiceScope = new Mock<IServiceScope>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockLogger = new Mock<ILogger<PendingBookingsCleanupService>>();

            // Setup scoping
            _mockServiceProvider.Setup(x => x.GetService(typeof(IServiceScopeFactory))).Returns(_mockServiceScopeFactory.Object);
            _mockServiceScopeFactory.Setup(x => x.CreateScope()).Returns(_mockServiceScope.Object);
            _mockServiceScope.Setup(x => x.ServiceProvider).Returns(_mockServiceProvider.Object);
            
            // Resolve UnitOfWork
            _mockServiceProvider.Setup(x => x.GetService(typeof(IUnitOfWork))).Returns(_mockUnitOfWork.Object);

            _sut = new PendingBookingsCleanupService(_mockServiceProvider.Object, _mockLogger.Object);
        }

        private async Task InvokeCleanupMethodAsync()
        {
            var method = typeof(PendingBookingsCleanupService).GetMethod("CleanupPendingBookingsAsync", BindingFlags.NonPublic | BindingFlags.Instance);
            var task = (Task)method.Invoke(_sut, new object[] { CancellationToken.None });
            await task;
        }

        [Fact]
        public async Task CleanupPendingBookingsAsync_WithAbandonedBookings_CancelsBookings()
        {
            // Arrange
            var oldPendingBooking = new Booking 
            { 
                Id = Guid.NewGuid(), 
                Status = BookingStatus.Pending, 
                CreatedAt = DateTime.UtcNow.AddMinutes(-20) 
            };
            
            var bookingsRepoMock = new Mock<IGenericRepository<Booking>>();
            bookingsRepoMock.Setup(r => r.FindAllAsync(It.IsAny<Expression<Func<Booking, bool>>>(), It.IsAny<CancellationToken>()))
                            .ReturnsAsync(new List<Booking> { oldPendingBooking });

            _mockUnitOfWork.Setup(u => u.Bookings).Returns(bookingsRepoMock.Object);

            // Act
            await InvokeCleanupMethodAsync();

            // Assert
            bookingsRepoMock.Verify(r => r.Update(It.Is<Booking>(b => b.Id == oldPendingBooking.Id && b.Status == BookingStatus.Cancelled)), Times.Once);
            _mockUnitOfWork.Verify(u => u.BeginTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            _mockUnitOfWork.Verify(u => u.CommitTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task CleanupPendingBookingsAsync_WithoutAbandonedBookings_DoesNothing()
        {
            // Arrange
            var bookingsRepoMock = new Mock<IGenericRepository<Booking>>();
            bookingsRepoMock.Setup(r => r.FindAllAsync(It.IsAny<Expression<Func<Booking, bool>>>(), It.IsAny<CancellationToken>()))
                            .ReturnsAsync(new List<Booking>()); // Empty list

            _mockUnitOfWork.Setup(u => u.Bookings).Returns(bookingsRepoMock.Object);

            // Act
            await InvokeCleanupMethodAsync();

            // Assert
            bookingsRepoMock.Verify(r => r.Update(It.IsAny<Booking>()), Times.Never);
            _mockUnitOfWork.Verify(u => u.BeginTransactionAsync(It.IsAny<CancellationToken>()), Times.Never);
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Reservations;
using Core.Application.Services.Reservations;
using Core.Domain.Entities.Reservations;
using Core.Domain.Enums;
using FluentAssertions;
using Moq;
using Xunit;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace Almulhem.Travel.UnitTests.Services
{
    public class PaymentServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IVoucherProIntegrationService> _mockVoucherPro;
        private readonly Mock<ILogger<PaymentService>> _mockLogger;
        private readonly Mock<IConfiguration> _mockConfig;
        private readonly PaymentService _sut; // System Under Test

        public PaymentServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockMapper = new Mock<IMapper>();
            _mockVoucherPro = new Mock<IVoucherProIntegrationService>();
            _mockLogger = new Mock<ILogger<PaymentService>>();
            _mockConfig = new Mock<IConfiguration>();

            // Setup basic UnitOfWork mocks to avoid null references
            _mockUnitOfWork.Setup(u => u.Payments).Returns(new Mock<IGenericRepository<Payment>>().Object);
            _mockUnitOfWork.Setup(u => u.Bookings).Returns(new Mock<IGenericRepository<Booking>>().Object);
            _mockUnitOfWork.Setup(u => u.LoyaltyTransactions).Returns(new Mock<IGenericRepository<Core.Domain.Entities.Identity.LoyaltyTransaction>>().Object);

            _sut = new PaymentService(
                _mockUnitOfWork.Object, 
                _mockMapper.Object, 
                _mockVoucherPro.Object, 
                _mockLogger.Object, 
                _mockConfig.Object);
        }

        [Fact]
        public async Task CreatePendingPaymentAsync_WhenBookingExists_ReturnsSuccessWithPaymentId()
        {
            // Arrange
            var bookingId = Guid.NewGuid();
            var transactionId = "TXN-12345";
            var amount = 100m;
            var currency = "SAR";

            var bookingMock = new Booking { Id = bookingId, Status = BookingStatus.Pending };

            var bookingRepoMock = new Mock<IGenericRepository<Booking>>();
            bookingRepoMock.Setup(repo => repo.GetByIdAsync(bookingId, It.IsAny<CancellationToken>()))
                           .ReturnsAsync(bookingMock);

            var paymentRepoMock = new Mock<IGenericRepository<Payment>>();

            _mockUnitOfWork.Setup(u => u.Bookings).Returns(bookingRepoMock.Object);
            _mockUnitOfWork.Setup(u => u.Payments).Returns(paymentRepoMock.Object);

            // Act
            var result = await _sut.CreatePendingPaymentAsync(bookingId, transactionId, amount, currency);

            // Assert
            result.IsSuccess.Should().BeTrue();
            result.Data.Should().NotBeEmpty();
            
            paymentRepoMock.Verify(repo => repo.AddAsync(It.Is<Payment>(p => 
                p.BookingId == bookingId && 
                p.TransactionId == transactionId &&
                p.Amount == amount &&
                p.Currency == currency &&
                p.Status == PaymentStatus.Pending
            ), It.IsAny<CancellationToken>()), Times.Once);

            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task CreatePendingPaymentAsync_WhenBookingNotFound_ReturnsFailure()
        {
            // Arrange
            var bookingId = Guid.NewGuid();
            var bookingRepoMock = new Mock<IGenericRepository<Booking>>();
            bookingRepoMock.Setup(repo => repo.GetByIdAsync(bookingId, It.IsAny<CancellationToken>()))
                           .ReturnsAsync((Booking)null); // Booking not found

            _mockUnitOfWork.Setup(u => u.Bookings).Returns(bookingRepoMock.Object);

            // Act
            var result = await _sut.CreatePendingPaymentAsync(bookingId, "TXN-1", 100, "SAR");

            // Assert
            result.IsSuccess.Should().BeFalse();
            result.Errors.Should().Contain("Booking not found");
            
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task CompletePaymentAsync_WhenPaymentNotFound_ReturnsFailure()
        {
            // Arrange
            var transactionId = "TXN-NOT-FOUND";
            var paymentRepoMock = new Mock<IGenericRepository<Payment>>();
            paymentRepoMock.Setup(repo => repo.FindAllAsync(It.IsAny<Expression<Func<Payment, bool>>>(), It.IsAny<CancellationToken>()))
                           .ReturnsAsync(new List<Payment>()); // Empty list

            _mockUnitOfWork.Setup(u => u.Payments).Returns(paymentRepoMock.Object);

            // Act
            var result = await _sut.CompletePaymentAsync(transactionId);

            // Assert
            result.IsSuccess.Should().BeFalse();
            result.Errors.Should().Contain("Payment not found");
        }
    }
}

using AutoMapper;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Reservations;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Reservations;
using Core.Domain.Entities.Reservations;
using Core.Domain.Entities.Identity;
using Core.Domain.Enums;

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Core.Application.Services.Reservations
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IVoucherProIntegrationService _voucherProIntegrationService;
        private readonly ILogger<PaymentService> _logger;
        private readonly IConfiguration _configuration;

        public PaymentService(IUnitOfWork unitOfWork, IMapper mapper, IVoucherProIntegrationService voucherProIntegrationService, ILogger<PaymentService> logger, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _voucherProIntegrationService = voucherProIntegrationService;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<Result<Guid>> CreatePendingPaymentAsync(Guid bookingId, string transactionId, decimal amount, string currency, CancellationToken cancellationToken = default)
        {
            var booking = await _unitOfWork.Bookings.GetByIdAsync(bookingId, cancellationToken);
            if (booking == null) return Result<Guid>.Failure("Booking not found");

            var payment = new Payment
            {
                Id = Guid.NewGuid(),
                BookingId = bookingId,
                Amount = amount,
                Currency = currency,
                Method = PaymentMethod.CreditCard,
                Status = PaymentStatus.Pending,
                TransactionId = transactionId,
                CreatedAt = DateTime.UtcNow,
                CardBrand = "Moyasar",
                CardLast4 = ""
            };

            await _unitOfWork.Payments.AddAsync(payment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<Guid>.Success(payment.Id);
        }

        public async Task<Result> CompletePaymentAsync(string transactionId, CancellationToken cancellationToken = default)
        {
            var payments = await _unitOfWork.Payments.FindAllAsync(p => p.TransactionId == transactionId, cancellationToken);
            var payment = payments.FirstOrDefault();
            if (payment == null) return Result.Failure("Payment not found");

            if (payment.Status == PaymentStatus.Completed) return Result.Success();

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                payment.Status = PaymentStatus.Completed;
                payment.PaidAt = DateTime.UtcNow;
                _unitOfWork.Payments.Update(payment);
                
                var booking = await _unitOfWork.Bookings.GetByIdAsync(payment.BookingId, cancellationToken);
                if (booking != null && booking.Status != BookingStatus.Confirmed)
                {
                    booking.Status = BookingStatus.Confirmed;
                    booking.ConfirmedAt = DateTime.UtcNow;
                    _unitOfWork.Bookings.Update(booking);

                    // Award points
                    if (booking.UserId.HasValue)
                    {
                        var user = await _unitOfWork.Users.GetByIdAsync(booking.UserId.Value, cancellationToken);
                        if (user != null)
                        {
                            decimal cashbackPercentage = 0.01m;
                            if (user.LoyaltyPoints >= 2000 && user.LoyaltyPoints < 5000) cashbackPercentage = 0.015m;
                            else if (user.LoyaltyPoints >= 5000 && user.LoyaltyPoints < 10000) cashbackPercentage = 0.02m;
                            else if (user.LoyaltyPoints >= 10000) cashbackPercentage = 0.03m;

                            int pointsToAdd = (int)Math.Round(booking.TotalAmount * cashbackPercentage * 100);
                            if (pointsToAdd > 0)
                            {
                                user.LoyaltyPoints += pointsToAdd;
                                _unitOfWork.Users.Update(user);

                                var loyaltyTx = new LoyaltyTransaction
                                {
                                    Id = Guid.NewGuid(),
                                    UserId = user.Id,
                                    Points = pointsToAdd,
                                    Type = "Earned",
                                    Description = $"كسب نقاط مقابل الحجز رقم {booking.ReferenceNumber}",
                                    CreatedAt = DateTime.UtcNow
                                };
                                await _unitOfWork.LoyaltyTransactions.AddAsync(loyaltyTx, cancellationToken);
                            }
                        }
                    }
                    
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    await _unitOfWork.CommitTransactionAsync(cancellationToken);

                    // Voucher
                    _ = Task.Run(() => _voucherProIntegrationService.ProcessBookingVoucherAsync(booking, CancellationToken.None));
                }
                else
                {
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    await _unitOfWork.CommitTransactionAsync(cancellationToken);
                }

                return Result.Success();
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return Result.Failure($"Failed to complete payment: {ex.Message}");
            }
        }

        public async Task<Result<PaymentDto>> ProcessPaymentAsync(
            Guid bookingId,
            CreatePaymentDto dto,
            CancellationToken cancellationToken = default)
        {
            try
            {
                // Verify booking exists
                var booking = await _unitOfWork.Bookings.GetByIdAsync(bookingId, cancellationToken);
                if (booking == null)
                    return Result<PaymentDto>.Failure("Booking not found");

                // Get all completed payments for this booking
                var completedPayments = await _unitOfWork.Payments
                    .FindAllAsync(p => p.BookingId == bookingId && p.Status == PaymentStatus.Completed, cancellationToken);

                var totalPaid = completedPayments.Sum(p => p.Amount);
                if (totalPaid >= booking.TotalAmount)
                    return Result<PaymentDto>.Failure("Booking is already fully paid");

                var remainingAmount = booking.TotalAmount - totalPaid;
                if (dto.Amount > remainingAmount)
                    return Result<PaymentDto>.Failure($"Payment amount {dto.Amount} exceeds remaining balance of {remainingAmount}");

                // Security Enforcement:
                bool isSimulationMode = (_configuration["PaymentSettings:SimulationMode"] ?? "").ToLower() == "true";
                if (!isSimulationMode)
                {
                    return Result<PaymentDto>.Failure("Payment Simulation is strictly disabled in this environment. Please use the real Payment Gateways via PaymentsController.");
                }

                // Create payment record
                var payment = new Payment
                {
                    Id = Guid.NewGuid(),
                    BookingId = bookingId,
                    Amount = dto.Amount,
                    Currency = "SAR",
                    Method = dto.PaymentMethod,
                    Status = PaymentStatus.Pending,
                    CardLast4 = dto.PaymentMethod == PaymentMethod.Wallet ? "" : "4242",
                    CardBrand = dto.PaymentMethod == PaymentMethod.Wallet ? "Wallet" : "Visa",
                    CreatedAt = DateTime.UtcNow
                };

                // TODO: Integrate with actual payment gateway (Moyasar, Tap, etc.)
                // For now, simulate successful payment
                payment.Status = PaymentStatus.Completed;
                payment.TransactionId = $"TXN-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
                payment.PaidAt = DateTime.UtcNow;

                // Update booking status if fully paid
                bool isFullyPaid = (totalPaid + dto.Amount) >= booking.TotalAmount;
                if (isFullyPaid)
                {
                    booking.Status = BookingStatus.Confirmed;
                    booking.ConfirmedAt = DateTime.UtcNow;
                }

                // Save changes in transaction
                await _unitOfWork.BeginTransactionAsync(cancellationToken);
                try
                {
                    await _unitOfWork.Payments.AddAsync(payment, cancellationToken);
                    
                    if (isFullyPaid)
                    {
                        _unitOfWork.Bookings.Update(booking);

                        // Award loyalty points if booking belongs to a registered user
                        if (booking.UserId.HasValue)
                        {
                            var user = await _unitOfWork.Users.GetByIdAsync(booking.UserId.Value, cancellationToken);
                            if (user != null)
                            {
                                decimal cashbackPercentage = 0.01m; // Amateur (default)
                                if (user.LoyaltyPoints >= 2000 && user.LoyaltyPoints < 5000)
                                    cashbackPercentage = 0.015m;
                                else if (user.LoyaltyPoints >= 5000 && user.LoyaltyPoints < 10000)
                                    cashbackPercentage = 0.02m;
                                else if (user.LoyaltyPoints >= 10000)
                                    cashbackPercentage = 0.03m;

                                int pointsToAdd = (int)Math.Round(booking.TotalAmount * cashbackPercentage * 100);
                                if (pointsToAdd > 0)
                                {
                                    user.LoyaltyPoints += pointsToAdd;
                                    _unitOfWork.Users.Update(user);

                                    var loyaltyTx = new LoyaltyTransaction
                                    {
                                        Id = Guid.NewGuid(),
                                        UserId = user.Id,
                                        Points = pointsToAdd,
                                        Type = "Earned",
                                        Description = $"كسب نقاط مقابل الحجز رقم {booking.ReferenceNumber}",
                                        CreatedAt = DateTime.UtcNow
                                    };
                                    await _unitOfWork.LoyaltyTransactions.AddAsync(loyaltyTx, cancellationToken);
                                }
                            }
                        }
                    }

                    await _unitOfWork.CommitTransactionAsync(cancellationToken);

                    // Auto-generate and send Voucher Pro PDF in background task if confirmed
                    if (booking.Status == BookingStatus.Confirmed)
                    {
                        _ = Task.Run(() => _voucherProIntegrationService.ProcessBookingVoucherAsync(booking, CancellationToken.None));
                    }
                }
                catch
                {
                    await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                    throw;
                }

                var paymentDto = _mapper.Map<PaymentDto>(payment);
                return Result<PaymentDto>.Success(paymentDto, "Payment processed successfully");
            }
            catch (Exception ex)
            {
                return Result<PaymentDto>.Failure($"Error processing payment: {ex.Message}");
            }
        }

        public async Task<Result<PaymentDto>> GetByBookingIdAsync(
            Guid bookingId,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var payment = await _unitOfWork.Payments
                    .FindAsync(p => p.BookingId == bookingId, cancellationToken);

                if (payment == null)
                    return Result<PaymentDto>.Failure("Payment not found for this booking");

                var paymentDto = _mapper.Map<PaymentDto>(payment);
                return Result<PaymentDto>.Success(paymentDto);
            }
            catch (Exception ex)
            {
                return Result<PaymentDto>.Failure($"Error retrieving payment: {ex.Message}");
            }
        }

        public async Task<Result> RefundPaymentAsync(
            Guid paymentId,
            decimal amount,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var payment = await _unitOfWork.Payments.GetByIdAsync(paymentId, cancellationToken);

                if (payment == null)
                    return Result.Failure("Payment not found");

                if (payment.Status != PaymentStatus.Completed)
                    return Result.Failure("Only completed payments can be refunded");

                if (amount > payment.Amount)
                    return Result.Failure("Refund amount cannot exceed payment amount");

                // TODO: Integrate with actual payment gateway for refund
                // For now, simulate successful refund
                payment.Status = PaymentStatus.Refunded;

                // Update booking status
                var booking = await _unitOfWork.Bookings.GetByIdAsync(payment.BookingId, cancellationToken);
                if (booking != null)
                {
                    booking.Status = BookingStatus.Cancelled;
                    booking.CancelledAt = DateTime.UtcNow;
                    _unitOfWork.Bookings.Update(booking);
                }

                _unitOfWork.Payments.Update(payment);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("Payment refunded successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error refunding payment: {ex.Message}");
            }
        }
    }
}

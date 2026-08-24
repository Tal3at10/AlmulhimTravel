using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Reservations;

namespace Core.Application.Abstraction.Services.Reservations
{
    public interface IPaymentService
    {
        Task<Result<PaymentDto>> ProcessPaymentAsync(Guid bookingId, CreatePaymentDto dto, CancellationToken cancellationToken = default);
        Task<Result<PaymentDto>> GetByBookingIdAsync(Guid bookingId, CancellationToken cancellationToken = default);
        Task<Result> RefundPaymentAsync(Guid paymentId, decimal amount, CancellationToken cancellationToken = default);
        Task<Result<Guid>> CreatePendingPaymentAsync(Guid bookingId, string transactionId, decimal amount, string currency, CancellationToken cancellationToken = default);
        Task<Result> CompletePaymentAsync(string transactionId, CancellationToken cancellationToken = default);
    }
}

using System;
using System.Threading;
using System.Threading.Tasks;

namespace Core.Application.Abstraction.Services
{
    public class PaymentSessionResult
    {
        public string PaymentId { get; set; } = string.Empty;
        public string PaymentUrl { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
    }

    public class PaymentStatusResult
    {
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string ReceiptUrl { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string InvoiceId { get; set; } = string.Empty;
    }

    public interface IPaymentGateway
    {
        Task<PaymentSessionResult> CreatePaymentSessionAsync(decimal amount, string currency, string description, string callbackUrl, CancellationToken ct = default);
        Task<PaymentStatusResult> VerifyPaymentAsync(string paymentId, CancellationToken ct = default);
    }
}

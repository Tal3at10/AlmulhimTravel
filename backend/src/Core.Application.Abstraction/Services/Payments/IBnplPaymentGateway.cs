using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.DTOs.Payments;

namespace Core.Application.Abstraction.Services.Payments;

public interface IBnplPaymentGateway
{
    string ProviderName { get; }
    Task<PaymentSessionResult> CreateCheckoutSessionAsync(BnplPaymentRequest request, CancellationToken ct = default);
    Task<PaymentStatusResult> VerifyPaymentAsync(string paymentId, CancellationToken ct = default);
}

using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.DTOs.Payments;
using Core.Application.Abstraction.Services;
using Core.Application.Abstraction.Services.Payments;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Shared.Services.Payments;

public class TamaraPaymentService : IBnplPaymentGateway
{
    private readonly HttpClient _httpClient;
    private readonly TamaraSettings _settings;
    private readonly ILogger<TamaraPaymentService> _logger;

    public string ProviderName => "Tamara";

    public TamaraPaymentService(
        HttpClient httpClient,
        IOptions<TamaraSettings> options,
        ILogger<TamaraPaymentService> logger)
    {
        _httpClient = httpClient;
        _settings = options.Value;
        _logger = logger;
    }

    public async Task<PaymentSessionResult> CreateCheckoutSessionAsync(BnplPaymentRequest request, CancellationToken ct = default)
    {
        try
        {
            var payload = new
            {
                order_reference_id = request.OrderId,
                total_amount = new
                {
                    amount = request.TotalAmount,
                    currency = request.Currency
                },
                description = request.Description,
                country_code = "SA",
                payment_type = "PAY_BY_INSTALMENTS",
                instalments = 3,
                consumer = new
                {
                    first_name = request.Customer.FirstName,
                    last_name = request.Customer.LastName,
                    phone_number = request.Customer.Phone,
                    email = request.Customer.Email
                },
                merchant_url = new
                {
                    success = $"{request.CallbackUrl}?status=success",
                    failure = $"{request.CallbackUrl}?status=failure",
                    cancel = $"{request.CallbackUrl}?status=cancel",
                    notification = "https://your-domain.com/api/payments/tamara/webhook"
                }
            };

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{_settings.BaseUrl}/checkout");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.MerchantToken);
            requestMessage.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(requestMessage, ct);
            var responseContent = await response.Content.ReadAsStringAsync(ct);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Tamara checkout failed: {Content}", responseContent);
                return new PaymentSessionResult { Status = "Failed" };
            }

            using var doc = JsonDocument.Parse(responseContent);
            var root = doc.RootElement;
            var checkoutUrl = root.GetProperty("checkout_url").GetString() ?? string.Empty;
            var orderId = root.GetProperty("order_id").GetString() ?? string.Empty;

            return new PaymentSessionResult
            {
                PaymentId = orderId,
                PaymentUrl = checkoutUrl,
                Status = "Initiated"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Tamara checkout session");
            return new PaymentSessionResult { Status = "Error" };
        }
    }

    public async Task<PaymentStatusResult> VerifyPaymentAsync(string paymentId, CancellationToken ct = default)
    {
        // To be fully implemented when keys are available
        return await Task.FromResult(new PaymentStatusResult { Status = "Verified", Message = "Sandbox Verification" });
    }
}

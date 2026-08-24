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

public class TabbyPaymentService : IBnplPaymentGateway
{
    private readonly HttpClient _httpClient;
    private readonly TabbySettings _settings;
    private readonly ILogger<TabbyPaymentService> _logger;

    public string ProviderName => "Tabby";

    public TabbyPaymentService(
        HttpClient httpClient,
        IOptions<TabbySettings> options,
        ILogger<TabbyPaymentService> logger)
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
                payment = new
                {
                    amount = request.TotalAmount,
                    currency = request.Currency,
                    description = request.Description,
                    buyer = new
                    {
                        phone = request.Customer.Phone,
                        email = request.Customer.Email,
                        name = $"{request.Customer.FirstName} {request.Customer.LastName}"
                    },
                    order = new
                    {
                        reference_id = request.OrderId,
                        items = request.Items
                    }
                },
                lang = "ar",
                merchant_code = _settings.MerchantCode,
                merchant_urls = new
                {
                    success = $"{request.CallbackUrl}?status=success",
                    cancel = $"{request.CallbackUrl}?status=cancel",
                    failure = $"{request.CallbackUrl}?status=failure"
                }
            };

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{_settings.BaseUrl}/api/v2/checkout");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.PublicKey);
            requestMessage.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(requestMessage, ct);
            var responseContent = await response.Content.ReadAsStringAsync(ct);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Tabby checkout failed: {Content}", responseContent);
                return new PaymentSessionResult { Status = "Failed" };
            }

            using var doc = JsonDocument.Parse(responseContent);
            var root = doc.RootElement;
            var paymentId = root.GetProperty("payment").GetProperty("id").GetString() ?? string.Empty;
            var webUrl = root.GetProperty("configuration").GetProperty("available_products").GetProperty("installments")[0].GetProperty("web_url").GetString() ?? string.Empty;

            return new PaymentSessionResult
            {
                PaymentId = paymentId,
                PaymentUrl = webUrl,
                Status = "Initiated"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Tabby checkout session");
            return new PaymentSessionResult { Status = "Error" };
        }
    }

    public async Task<PaymentStatusResult> VerifyPaymentAsync(string paymentId, CancellationToken ct = default)
    {
        // To be fully implemented when keys are available
        return await Task.FromResult(new PaymentStatusResult { Status = "Verified", Message = "Sandbox Verification" });
    }
}

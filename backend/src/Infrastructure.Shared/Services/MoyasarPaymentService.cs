using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.Services;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Shared.Services
{
    public class MoyasarPaymentService : IPaymentGateway
    {
        private readonly HttpClient _httpClient;
        private readonly MoyasarSettings _settings;
        private readonly ILogger<MoyasarPaymentService> _logger;

        public MoyasarPaymentService(HttpClient httpClient, IOptions<MoyasarSettings> options, ILogger<MoyasarPaymentService> logger)
        {
            _httpClient = httpClient;
            _settings = options.Value;
            _logger = logger;

            // Setup Base Address and Basic Auth
            _httpClient.BaseAddress = new Uri("https://api.moyasar.com/v1/");
            
            var authValue = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_settings.SecretKey}:"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<PaymentSessionResult> CreatePaymentSessionAsync(decimal amount, string currency, string description, string callbackUrl, CancellationToken ct = default)
        {
            try
            {
                // Moyasar uses minor units (Halalas for SAR). So 100 SAR = 10000 Halalas.
                long amountInMinorUnits = (long)Math.Round(amount * 100, 0);

                var payload = new
                {
                    amount = amountInMinorUnits,
                    currency = currency,
                    description = description,
                    success_url = string.IsNullOrEmpty(callbackUrl) ? _settings.CallbackUrl : callbackUrl,
                    back_url = string.IsNullOrEmpty(callbackUrl) ? _settings.CallbackUrl : callbackUrl,
                    // If creating a session for the embedded form or just an invoice
                    // Wait, Moyasar requires a specific source for direct payments.
                    // If we just want to create an invoice/session that the user pays on Moyasar hosted page:
                    // We create an Invoice.
                };

                // Moyasar Invoice API: https://api.moyasar.com/v1/invoices
                var jsonPayload = JsonSerializer.Serialize(payload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                _logger.LogInformation("Sending request to Moyasar to create invoice for {Amount} {Currency}", amount, currency);
                var response = await _httpClient.PostAsync("invoices", content, ct);
                
                var responseString = await response.Content.ReadAsStringAsync(ct);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Failed to create Moyasar payment session. Status: {StatusCode}, Response: {Response}", response.StatusCode, responseString);
                    throw new Exception($"Moyasar Error: {responseString}");
                }

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;

                var invoiceId = root.GetProperty("id").GetString() ?? string.Empty;
                var invoiceUrl = root.GetProperty("url").GetString() ?? string.Empty;
                var status = root.GetProperty("status").GetString() ?? string.Empty;

                return new PaymentSessionResult
                {
                    PaymentId = invoiceId,
                    PaymentUrl = invoiceUrl,
                    Status = status,
                    TransactionId = invoiceId
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating Moyasar payment session");
                throw;
            }
        }

        public async Task<PaymentStatusResult> VerifyPaymentAsync(string paymentId, CancellationToken ct = default)
        {
            try
            {
                // For direct payments it's /v1/payments/{id}
                // For invoices it's /v1/invoices/{id}
                // If paymentId starts with 'inv_', it's an invoice. Else, it's a direct payment.
                string endpoint = paymentId.StartsWith("inv_") ? $"invoices/{paymentId}" : $"payments/{paymentId}";

                var response = await _httpClient.GetAsync(endpoint, ct);
                var responseString = await response.Content.ReadAsStringAsync(ct);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Failed to verify Moyasar payment. Status: {StatusCode}, Response: {Response}", response.StatusCode, responseString);
                    throw new Exception($"Moyasar Error: {responseString}");
                }

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;

                var status = root.GetProperty("status").GetString() ?? string.Empty;
                decimal amount = root.GetProperty("amount").GetDecimal() / 100m; // Convert back from minor units
                var currency = root.GetProperty("currency").GetString() ?? string.Empty;
                
                string receiptUrl = "";
                if (root.TryGetProperty("receipt_url", out var rUrl) && rUrl.ValueKind == JsonValueKind.String)
                {
                    receiptUrl = rUrl.GetString() ?? "";
                }

                // If it's a payment, it might belong to an invoice
                string invoiceId = paymentId.StartsWith("inv_") ? paymentId : "";
                if (string.IsNullOrEmpty(invoiceId) && root.TryGetProperty("invoice_id", out var invUrl) && invUrl.ValueKind == JsonValueKind.String)
                {
                    invoiceId = invUrl.GetString() ?? "";
                }

                return new PaymentStatusResult
                {
                    Status = status,
                    Amount = amount,
                    Currency = currency,
                    ReceiptUrl = receiptUrl,
                    InvoiceId = invoiceId,
                    Message = $"Payment {status}"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying Moyasar payment {PaymentId}", paymentId);
                throw;
            }
        }
    }
}

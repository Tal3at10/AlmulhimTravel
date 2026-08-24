using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Core.Application.Abstraction.Services;
using Core.Application.Abstraction.DTOs.Payments;
using Core.Application.Abstraction.Services.Payments;
using System.Collections.Generic;
using System.Linq;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    public class PaymentsController : BaseApiController
    {
        private readonly ILogger<PaymentsController> _logger;
        private readonly IPaymentGateway _paymentGateway;
        private readonly IEnumerable<IBnplPaymentGateway> _bnplGateways;
        private readonly IServiceManager _serviceManager;

        public PaymentsController(
            ILogger<PaymentsController> logger, 
            IPaymentGateway paymentGateway, 
            IEnumerable<IBnplPaymentGateway> bnplGateways,
            IServiceManager serviceManager)
        {
            _logger = logger;
            _paymentGateway = paymentGateway;
            _bnplGateways = bnplGateways;
            _serviceManager = serviceManager;
        }

        [HttpPost("initiate")]
        [Authorize]
        public async Task<IActionResult> InitiatePayment([FromBody] PaymentRequestDto request)
        {
            _logger.LogInformation("Initiating Moyasar payment for amount {Amount} {Currency}", request.Amount, request.Currency);
            
            try
            {
                var result = await _paymentGateway.CreatePaymentSessionAsync(request.Amount, request.Currency, request.Description, request.CallbackUrl);
                
                if (Guid.TryParse(request.ReferenceId, out Guid bookingId))
                {
                    await _serviceManager.Payments.CreatePendingPaymentAsync(bookingId, result.PaymentId, request.Amount, request.Currency);
                }
                
                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        paymentId = result.PaymentId,
                        status = result.Status,
                        paymentUrl = result.PaymentUrl,
                        transactionId = result.TransactionId
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("verify")]
        [Authorize]
        public async Task<IActionResult> VerifyPayment([FromBody] PaymentVerificationDto request)
        {
            _logger.LogInformation("Verifying payment {PaymentId}", request.PaymentId);
            
            try
            {
                var result = await _paymentGateway.VerifyPaymentAsync(request.PaymentId);
                
                if (result.Status == "paid")
                {
                    string targetTransactionId = !string.IsNullOrEmpty(result.InvoiceId) ? result.InvoiceId : request.PaymentId;
                    await _serviceManager.Payments.CompletePaymentAsync(targetTransactionId);
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        status = result.Status,
                        message = result.Message,
                        receiptUrl = result.ReceiptUrl,
                        amount = result.Amount,
                        currency = result.Currency
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{provider}/checkout")]
        [Authorize]
        public async Task<IActionResult> InitiateBnplPayment(string provider, [FromBody] BnplPaymentRequest request)
        {
            _logger.LogInformation("Initiating BNPL payment via {Provider} for amount {Amount} {Currency}", provider, request.TotalAmount, request.Currency);
            
            var gateway = _bnplGateways.FirstOrDefault(g => g.ProviderName.Equals(provider, StringComparison.OrdinalIgnoreCase));
            if (gateway == null)
            {
                return BadRequest(new { success = false, message = $"BNPL provider '{provider}' is not supported." });
            }

            try
            {
                var result = await gateway.CreateCheckoutSessionAsync(request);
                
                if (Guid.TryParse(request.OrderId, out Guid bookingId))
                {
                    // This creates a pending payment in db for InstallmentPayment
                    await _serviceManager.Payments.CreatePendingPaymentAsync(bookingId, result.PaymentId, request.TotalAmount, request.Currency);
                }
                
                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        paymentId = result.PaymentId,
                        status = result.Status,
                        paymentUrl = result.PaymentUrl
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{provider}/verify/{paymentId}")]
        [Authorize]
        public async Task<IActionResult> VerifyBnplPayment(string provider, string paymentId)
        {
            _logger.LogInformation("Verifying BNPL payment {PaymentId} via {Provider}", paymentId, provider);
            
            var gateway = _bnplGateways.FirstOrDefault(g => g.ProviderName.Equals(provider, StringComparison.OrdinalIgnoreCase));
            if (gateway == null)
            {
                return BadRequest(new { success = false, message = $"BNPL provider '{provider}' is not supported." });
            }

            try
            {
                var result = await gateway.VerifyPaymentAsync(paymentId);
                
                // Real logic will complete payment on verified status
                if (result.Status == "Verified" || result.Status == "paid")
                {
                    await _serviceManager.Payments.CompletePaymentAsync(paymentId);
                }

                return Ok(new
                {
                    success = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}

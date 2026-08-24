using Core.Application.Abstraction.Services.Reservations;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace APIs.Controllers
{
    [Route("api/customer-rfp")]
    public class CustomerRfpController : BaseApiController
    {
        private readonly IVoucherProIntegrationService _integrationService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWhatsAppProvider _whatsAppProvider;
        private readonly ILogger<CustomerRfpController> _logger;

        public CustomerRfpController(
            IVoucherProIntegrationService integrationService, 
            IUnitOfWork unitOfWork, 
            IWhatsAppProvider whatsAppProvider,
            ILogger<CustomerRfpController> logger)
        {
            _integrationService = integrationService;
            _unitOfWork = unitOfWork;
            _whatsAppProvider = whatsAppProvider;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitRequest([FromBody] CreateCustomerRequestDto request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.Destination) || string.IsNullOrEmpty(request.ClientName))
            {
                return BadRequest("Destination and ClientName are required.");
            }

            var requestId = await _integrationService.CreateCustomerRequestAsync(request, cancellationToken);
            if (requestId == null)
            {
                return StatusCode(500, "Failed to submit request to VoucherPro integration.");
            }

            try
            {
                var admins = await _unitOfWork.Users.FindAllAsync(u => u.Role == "Admin");
                foreach (var admin in admins)
                {
                    if (!string.IsNullOrEmpty(admin.Phone))
                    {
                        var phoneStr = admin.Phone.StartsWith("+") ? admin.Phone : ((admin.CountryCode ?? "") + admin.Phone);
                        var message = $"🔔 *طلب تفصيل باقة جديد!*\n\n" +
                                      $"*العميل:* {request.ClientName}\n" +
                                      $"*الجوال:* {request.PhoneNumber ?? "غير متوفر"}\n" +
                                      $"*الوجهة:* {request.Destination}\n" +
                                      $"*المدة:* {request.Nights} ليالي\n" +
                                      $"*البالغين:* {request.Adults} | *الأطفال:* {request.Children}\n" +
                                      (request.Budget.HasValue ? $"*الميزانية:* {request.Budget} ريال\n" : "") +
                                      (request.ExpectedArrivalDate.HasValue ? $"*تاريخ السفر المتوقع:* {request.ExpectedArrivalDate.Value:yyyy-MM-dd}\n" : "") +
                                      (string.IsNullOrWhiteSpace(request.SpecialRequirements) ? "" : $"\n*متطلبات إضافية:*\n{request.SpecialRequirements}\n") +
                                      $"\nللإطلاع يرجى زيارة لوحة تحكم الإدارة (قسم الطلبات).";

                        await _whatsAppProvider.SendTextMessageAsync(phoneStr, message);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send WhatsApp notifications for new RFP {RequestId}", requestId);
            }

            return Ok(new { success = true, message = "Request submitted successfully", voucherProRequestId = requestId });
        }
    }
}

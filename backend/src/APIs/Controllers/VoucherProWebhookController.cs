using Microsoft.AspNetCore.Mvc;
using Core.Application.Abstraction.Interfaces;
using Core.Domain.Entities.Reservations;
using Core.Domain.Enums;
using Core.Application.Abstraction.Services;

namespace APIs.Controllers
{
    [Route("api/webhooks/voucherpro")]
    [ApiController]
    public class VoucherProWebhookController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWhatsAppProvider _whatsAppProvider;

        public VoucherProWebhookController(IUnitOfWork unitOfWork, IWhatsAppProvider whatsAppProvider)
        {
            _unitOfWork = unitOfWork;
            _whatsAppProvider = whatsAppProvider;
        }

        [HttpPost("quotation-accepted")]
        public async Task<IActionResult> QuotationAccepted([FromBody] QuotationAcceptedWebhookPayload payload, CancellationToken cancellationToken)
        {
            // Create a pending Booking for this customer with the Admin's Markup Price
            var booking = new Booking
            {
                Id = Guid.NewGuid(),
                ReferenceNumber = $"ALM-{new Random().Next(10000, 99999)}",
                VoucherProRequestId = payload.CustomerRequestId,
                VoucherReference = payload.VoucherReference,
                Type = BookingType.Package,
                Status = BookingStatus.Pending,
                TotalAmount = payload.CustomerSellingPrice,
                Currency = "SAR",
                CreatedAt = DateTime.UtcNow,
                GuestFirstName = payload.ClientName ?? "Guest",
                GuestLastName = "",
                GuestEmail = payload.Email ?? "",
                GuestPhone = payload.PhoneNumber ?? "",
                GuestCountryCode = "SA",
                ExtractedJsonData = payload.ExtractedData
            };

            await _unitOfWork.Bookings.AddAsync(booking);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Try to find an active Freshchat conversation for this phone
            var cleanedPhone = (payload.PhoneNumber ?? "").Replace("+", "").Replace(" ", "").Replace("-", "").Trim();
            if (!string.IsNullOrEmpty(cleanedPhone))
            {
                var conversations = await _unitOfWork.WhatsAppConversations.FindAllAsync(
                    c => c.CustomerPhone.Contains(cleanedPhone) || cleanedPhone.Contains(c.CustomerPhone),
                    cancellationToken
                );

                var activeConv = conversations
                    .Where(c => !string.IsNullOrEmpty(c.FreshchatConversationId))
                    .OrderByDescending(c => c.LastMessageAt)
                    .FirstOrDefault();

                if (activeConv != null)
                {
                    // For now, assume the frontend will have a /checkout/[id] route
                    var checkoutUrl = $"https://www.almulhimtravel.com/checkout/{booking.Id}";
                    var message = $"مرحباً {payload.ClientName}، 👋\n\n" +
                                  $"تم تجهيز عرض السعر لرحلتك إلى {payload.Destination} بنجاح!\n" +
                                  $"السعر النهائي: *{payload.CustomerSellingPrice} SAR*\n\n" +
                                  $"يمكنك الاطلاع على تفاصيل العرض وإتمام الدفع بأمان عبر الرابط التالي:\n" +
                                  $"{checkoutUrl}\n\n";

                    if (!string.IsNullOrEmpty(payload.AdminMessage))
                    {
                        message += $"ملاحظات فريقنا:\n{payload.AdminMessage}\n\n";
                    }

                    message += $"نتمنى لك رحلة سعيدة! ✈️🏖️";

                    await _whatsAppProvider.SendTextMessageAsync(activeConv.FreshchatConversationId, message);
                }
            }

            return Ok(new { success = true, bookingId = booking.Id });
        }
    }

    public class QuotationAcceptedWebhookPayload
    {
        public int CustomerRequestId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string Destination { get; set; } = string.Empty;
        public decimal CustomerSellingPrice { get; set; }
        public string? AdminMessage { get; set; }
        public string VoucherReference { get; set; } = string.Empty;
        public string? ExtractedData { get; set; }
    }
}

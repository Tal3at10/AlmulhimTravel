using System;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.DTOs.Reservations;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Reservations;
using Core.Domain.Entities.Reservations;
using Core.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    public class InstallmentsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVoucherProIntegrationService _voucherProIntegrationService;

        public InstallmentsController(IUnitOfWork unitOfWork, IVoucherProIntegrationService voucherProIntegrationService)
        {
            _unitOfWork = unitOfWork;
            _voucherProIntegrationService = voucherProIntegrationService;
        }

        [HttpPost("create-session")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateSession([FromBody] CreateInstallmentSessionDto dto, CancellationToken cancellationToken)
        {
            var booking = await _unitOfWork.Bookings.GetByIdAsync(dto.BookingId, cancellationToken);
            if (booking == null)
            {
                return NotFound(new { message = "الحجز غير موجود" });
            }

            var installment = new InstallmentPayment
            {
                Id = Guid.NewGuid(),
                BookingId = dto.BookingId,
                Provider = dto.Provider,
                TotalMonths = 4,
                MonthlyAmount = Math.Round(dto.Amount / 4, 2),
                Status = "Pending",
                TransactionReference = Guid.NewGuid().ToString().Substring(0, 12),
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.InstallmentPayments.AddAsync(installment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Redirect sandbox URL
            var redirectUrl = $"/installments-sandbox?provider={dto.Provider.ToLower()}&bookingId={dto.BookingId}&amount={dto.Amount}&ref={booking.ReferenceNumber}";

            return Ok(new { redirectUrl });
        }

        [HttpPost("confirm")]
        [AllowAnonymous]
        public async Task<IActionResult> Confirm([FromBody] ConfirmInstallmentDto dto, CancellationToken cancellationToken)
        {
            var booking = await _unitOfWork.Bookings.GetByIdAsync(dto.BookingId, cancellationToken);
            if (booking == null)
            {
                return NotFound(new { message = "الحجز غير موجود" });
            }

            var installment = await _unitOfWork.InstallmentPayments
                .FindAsync(ip => ip.BookingId == dto.BookingId && ip.Status == "Pending", cancellationToken);

            if (installment == null)
            {
                return NotFound(new { message = "لم يتم العثور على دفعة تقسيط معلقة لهذا الحجز" });
            }

            if (dto.Status.Equals("Approved", StringComparison.OrdinalIgnoreCase))
            {
                installment.Status = "Approved";
                booking.Status = BookingStatus.Confirmed;
                booking.ConfirmedAt = DateTime.UtcNow;

                _unitOfWork.InstallmentPayments.Update(installment);
                _unitOfWork.Bookings.Update(booking);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Process voucher before returning response
                await _voucherProIntegrationService.ProcessBookingVoucherAsync(booking, cancellationToken);

                return Ok(new { message = "تم تأكيد الحجز والدفع بالتقسيط بنجاح!" });
            }
            else
            {
                installment.Status = "Cancelled";
                booking.Status = BookingStatus.Cancelled;
                booking.CancelledAt = DateTime.UtcNow;

                _unitOfWork.InstallmentPayments.Update(installment);
                _unitOfWork.Bookings.Update(booking);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Ok(new { message = "تم إلغاء عملية الدفع بالتقسيط وإلغاء الحجز." });
            }
        }
    }
}

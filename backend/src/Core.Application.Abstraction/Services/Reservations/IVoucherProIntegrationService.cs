using System;
using System.Threading;
using System.Threading.Tasks;
using Core.Domain.Entities.Reservations;

namespace Core.Application.Abstraction.Services.Reservations
{
    public interface IVoucherProIntegrationService
    {
        /// <summary>
        /// توليد وإرسال الفاوتشر تلقائياً بناءً على بيانات الحجز المؤكد (طيران أو فندق)
        /// </summary>
        Task ProcessBookingVoucherAsync(Booking booking, CancellationToken cancellationToken = default);

        /// <summary>
        /// إنشاء طلب عميل جديد (RFP) في نظام VoucherPro
        /// </summary>
        Task<int?> CreateCustomerRequestAsync(CreateCustomerRequestDto requestDto, CancellationToken cancellationToken = default);
    }

    public class CreateCustomerRequestDto
    {
        public string ClientName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string Destination { get; set; } = string.Empty;
        public int Nights { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }
        public decimal? Budget { get; set; }
        public DateTime? ExpectedArrivalDate { get; set; }
        public string? SpecialRequirements { get; set; }
    }
}

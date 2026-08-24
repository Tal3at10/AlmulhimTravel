using Core.Domain.Enums;

namespace Core.Application.Abstraction.DTOs.Reservations
{
    public class PaymentDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "SAR";
        public PaymentMethod PaymentMethod { get; set; }
        public PaymentStatus Status { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? TransactionId { get; set; }
    }

    public class CreatePaymentDto
    {
        public Guid BookingId { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
    }

    public class PaymentResultDto
    {
        public bool IsSuccess { get; set; }
        public string? TransactionId { get; set; }
        public string? Message { get; set; }
        public PaymentStatus Status { get; set; }
    }
}

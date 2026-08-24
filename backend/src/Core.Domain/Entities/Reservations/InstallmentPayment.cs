using System;

namespace Core.Domain.Entities.Reservations
{
    public class InstallmentPayment
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public string Provider { get; set; } = string.Empty; // "Tabby", "Tamara"
        public int TotalMonths { get; set; }
        public decimal MonthlyAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public string? TransactionReference { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Booking Booking { get; set; } = null!;
    }
}

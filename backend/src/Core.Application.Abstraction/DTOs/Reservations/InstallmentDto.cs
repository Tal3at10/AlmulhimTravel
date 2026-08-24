using System;

namespace Core.Application.Abstraction.DTOs.Reservations
{
    public class CreateInstallmentSessionDto
    {
        public Guid BookingId { get; set; }
        public string Provider { get; set; } = string.Empty; // "Tabby" or "Tamara"
        public decimal Amount { get; set; }
    }

    public class ConfirmInstallmentDto
    {
        public Guid BookingId { get; set; }
        public string Status { get; set; } = string.Empty; // "Approved" or "Cancelled"
    }
}

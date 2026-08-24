using System;

namespace Core.Domain.Entities.Reservations
{
    public class BookingAddon
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public string AddonType { get; set; } = string.Empty; // "Insurance", "eSIM", "Transfer", "Driver"
        public string Provider { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? DetailsJson { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Booking Booking { get; set; } = null!;
    }
}

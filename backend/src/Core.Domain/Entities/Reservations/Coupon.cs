using System;

namespace Core.Domain.Entities.Reservations
{
    public class Coupon
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string DiscountType { get; set; } = string.Empty; // "Percentage", "Flat"
        public decimal Value { get; set; }
        public decimal? MaxDiscount { get; set; }
        public decimal MinBookingAmount { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public int UsageLimit { get; set; }
        public int UsageCount { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

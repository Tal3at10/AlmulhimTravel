using System;

namespace Core.Application.Abstraction.DTOs.Reservations
{
    public class VerifyCouponRequest
    {
        public string Code { get; set; } = string.Empty;
        public decimal BookingAmount { get; set; }
    }

    public class VerifyCouponResponse
    {
        public bool IsValid { get; set; }
        public string Code { get; set; } = string.Empty;
        public string DiscountType { get; set; } = string.Empty; // "Percentage", "Flat"
        public decimal Value { get; set; }
        public decimal? MaxDiscount { get; set; }
        public decimal MinBookingAmount { get; set; }
        public decimal CalculatedDiscount { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}

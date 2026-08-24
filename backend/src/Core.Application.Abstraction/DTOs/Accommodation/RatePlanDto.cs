namespace Core.Application.Abstraction.DTOs.Accommodation
{
    public class RatePlanDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public string Currency { get; set; } = "SAR";
        public bool IsRefundable { get; set; }
        public bool IncludesBreakfast { get; set; }
        public bool FreeCancellation { get; set; }
        public DateTime? CancellationDeadline { get; set; }
        public int AvailableRooms { get; set; }
    }
}

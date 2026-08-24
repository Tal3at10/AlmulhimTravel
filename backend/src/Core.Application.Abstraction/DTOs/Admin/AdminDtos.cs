namespace Core.Application.Abstraction.DTOs.Admin
{
    /// <summary>
    /// Dashboard Statistics DTO
    /// </summary>
    public class DashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalBookings { get; set; }
        public int TotalPackages { get; set; }
        public int TotalDestinations { get; set; }
        public int TotalHotels { get; set; }
        public int ActivePackages { get; set; }
        public int PendingBookings { get; set; }
        public int ConfirmedBookings { get; set; }
        public int CancelledBookings { get; set; }
        public int NewUsersThisMonth { get; set; }
        public int BookingsThisMonth { get; set; }
    }

    /// <summary>
    /// Recent booking for dashboard display
    /// </summary>
    public class RecentBookingDto
    {
        public Guid Id { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string BookingType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}

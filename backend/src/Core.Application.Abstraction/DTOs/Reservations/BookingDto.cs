using Core.Application.Abstraction.DTOs.Common;
using Core.Domain.Enums;

namespace Core.Application.Abstraction.DTOs.Reservations
{
    public class BookingListDto
    {
        public Guid Id { get; set; }
        public string BookingNumber { get; set; } = string.Empty;
        public BookingType BookingType { get; set; }
        public BookingStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "SAR";
        public DateTime BookingDate { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
    }

    public class BookingDetailDto
    {
        public Guid Id { get; set; }
        public string BookingNumber { get; set; } = string.Empty;
        public string? VoucherReference { get; set; }
        public BookingType BookingType { get; set; }
        public BookingStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "SAR";
        public DateTime BookingDate { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string? SpecialRequests { get; set; }
        public HotelBookingDto? HotelBooking { get; set; }
        public FlightBookingDto? FlightBooking { get; set; }
        public PackageBookingDto? PackageBooking { get; set; }
        public PaymentDto? Payment { get; set; }
    }

    public class CreateBookingDto
    {
        public BookingType BookingType { get; set; }
        public Guid? UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string? SpecialRequests { get; set; }
        public CreateHotelBookingDto? HotelBooking { get; set; }
        public CreateFlightBookingDto? FlightBooking { get; set; }
        public CreatePackageBookingDto? PackageBooking { get; set; }
    }

    public class BookingSearchQuery : PagedQuery
    {
        public Guid? UserId { get; set; }
        public BookingType? BookingType { get; set; }
        public BookingStatus? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? BookingNumber { get; set; }
        public string? CustomerEmail { get; set; }
    }

    public class BookingConfirmationDto
    {
        public Guid Id { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
        public string? VoucherReference { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}

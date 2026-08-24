using System.ComponentModel.DataAnnotations;

namespace Core.Application.Abstraction.DTOs.Reservations
{
    public class HotelBookingDto
    {
        public Guid Id { get; set; }
        public Guid HotelId { get; set; }
        public string HotelName { get; set; } = string.Empty;
        public Guid RoomId { get; set; }
        public string RoomName { get; set; } = string.Empty;
        public Guid RatePlanId { get; set; }
        public string RatePlanName { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfNights { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal RoomPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class CreateHotelBookingDto
    {
        public Guid HotelId { get; set; }

        public Guid RoomId { get; set; }

        public Guid RatePlanId { get; set; }

        [Required(ErrorMessage = "CheckInDate is required")]
        public DateTime CheckInDate { get; set; }

        [Required(ErrorMessage = "CheckOutDate is required")]
        public DateTime CheckOutDate { get; set; }

        [Range(1, 20, ErrorMessage = "NumberOfGuests must be between 1 and 20")]
        public int NumberOfGuests { get; set; }

        // Guest Info (for non-registered users)
        [Required(ErrorMessage = "GuestFirstName is required")]
        [StringLength(100)]
        public string GuestFirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "GuestLastName is required")]
        [StringLength(100)]
        public string GuestLastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "GuestEmail is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string GuestEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "GuestPhone is required")]
        public string GuestPhone { get; set; } = string.Empty;

        public string? GuestCountryCode { get; set; }
        public string? SpecialRequests { get; set; }
        public bool LateCheckIn { get; set; }
        public bool AirportTransfer { get; set; }
        public Guid? UserId { get; set; }
        public bool UseWallet { get; set; } = false;

        // Dynamic GDS Hotel Fields
        public string? HotelName { get; set; }
        public string? RoomName { get; set; }
        public decimal? RoomPrice { get; set; }
        public string? HotelImage { get; set; }
    }
}

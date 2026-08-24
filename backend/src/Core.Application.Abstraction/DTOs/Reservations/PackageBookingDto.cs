using System.ComponentModel.DataAnnotations;

namespace Core.Application.Abstraction.DTOs.Reservations
{
    public class PackageBookingDto
    {
        public Guid Id { get; set; }
        public Guid PackageId { get; set; }
        public string PackageName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int NumberOfTravelers { get; set; }
        public decimal PackagePrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class CreatePackageBookingDto
    {
        [Required(ErrorMessage = "PackageId is required")]
        public Guid PackageId { get; set; }

        [Required(ErrorMessage = "StartDate is required")]
        public DateTime StartDate { get; set; }

        [Range(1, 50, ErrorMessage = "NumberOfTravelers must be between 1 and 50")]
        public int NumberOfTravelers { get; set; }

        // Guest Info
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
        public Guid? UserId { get; set; }
        public bool UseWallet { get; set; } = false;
    }
}

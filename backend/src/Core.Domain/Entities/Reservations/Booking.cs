using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Identity;
using Core.Domain.Entities.Accommodation;
using Core.Domain.Entities.Catalog;
using Core.Domain.Entities.Aviation;
using Core.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Core.Domain.Entities.Reservations
{
    public class Booking
    {
        public Guid Id { get; set; }
        public string ReferenceNumber { get; set; } // "ALM-88293"
        public string? VoucherReference { get; set; } // "V-2026-..." (From VoucherPro)
        public int? VoucherProRequestId { get; set; } // Request ID in VoucherPro System
        public string? ExtractedJsonData { get; set; } // JSON extracted from PDF via AI
        public Guid? UserId { get; set; }
        public BookingType Type { get; set; } // Hotel, Flight, Package
        public BookingStatus Status { get; set; } // Pending, Confirmed, Cancelled
        public decimal TotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal ServiceFee { get; set; }
        public string Currency { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public DateTime? CancelledAt { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }

        // Guest Info (for non-registered users)
        public string GuestFirstName { get; set; }
        public string GuestLastName { get; set; }
        public string GuestEmail { get; set; }
        public string GuestPhone { get; set; }
        public string GuestCountryCode { get; set; }
        public string SpecialRequests { get; set; }
        public bool LateCheckIn { get; set; }
        public bool AirportTransfer { get; set; }

        // Navigation
        public User User { get; set; }
        public HotelBooking HotelBooking { get; set; }
        public FlightBooking FlightBooking { get; set; }
        public PackageBooking PackageBooking { get; set; }
        public Payment Payment { get; set; }
        public ICollection<BookingAddon> BookingAddons { get; set; } = new List<BookingAddon>();
        public ICollection<InstallmentPayment> InstallmentPayments { get; set; } = new List<InstallmentPayment>();
    }
}


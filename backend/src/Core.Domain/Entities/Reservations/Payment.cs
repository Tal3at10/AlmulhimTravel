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
    public class Payment
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public PaymentMethod Method { get; set; }
        public PaymentStatus Status { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string TransactionId { get; set; }
        public string CardLast4 { get; set; } // "4532"
        public string CardBrand { get; set; } // "Visa", "Mastercard", "Mada"
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }

        public Booking Booking { get; set; }
    }
}


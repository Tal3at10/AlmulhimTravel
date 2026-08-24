using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Identity;
using Core.Domain.Entities.Accommodation;
using Core.Domain.Entities.Catalog;
using Core.Domain.Entities.Aviation;

namespace Core.Domain.Entities.Reservations
{
    public class PackageBooking
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Guid PackageId { get; set; }
        public DateTime StartDate { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }

        public Booking Booking { get; set; }
        public Package Package { get; set; }
    }
}


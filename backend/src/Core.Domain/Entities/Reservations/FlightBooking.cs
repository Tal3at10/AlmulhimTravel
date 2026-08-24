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
    public class FlightBooking
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Guid FlightScheduleId { get; set; }
        public string Class { get; set; } // "economy", "business"
        public DateTime DepartureDate { get; set; }
        public DateTime? ReturnDate { get; set; }

        public Booking Booking { get; set; }
        public FlightSchedule FlightSchedule { get; set; }
        public ICollection<FlightPassenger> Passengers { get; set; }
    }
}


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
    public class FlightPassenger
    {
        public Guid Id { get; set; }
        public Guid FlightBookingId { get; set; }
        public string Title { get; set; } // "?????", "??????"
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PassportNumber { get; set; }
        public string Nationality { get; set; }
        public DateTime PassportExpiry { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string SeatNumber { get; set; }

        public FlightBooking FlightBooking { get; set; }
    }
}


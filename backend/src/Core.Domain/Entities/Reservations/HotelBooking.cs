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
    public class HotelBooking
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Guid HotelId { get; set; }
        public Guid RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int Nights { get; set; }
        public int Guests { get; set; }
        public int RoomQuantity { get; set; }

        public Booking Booking { get; set; }
        public Hotel Hotel { get; set; }
        public Room Room { get; set; }
    }
}


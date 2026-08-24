using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Entities.Aviation
{
    public class Seat
    {
        public Guid Id { get; set; }
        public Guid FlightScheduleId { get; set; }
        public string SeatNumber { get; set; } // "3A", "12F"
        public int Row { get; set; }
        public string Column { get; set; } // "A", "B", "C"
        public string Class { get; set; } // "business", "economy"
        public decimal ExtraPrice { get; set; } // Window seats cost extra
        public bool IsOccupied { get; set; }
        public bool IsWindow { get; set; }
        public bool IsAisle { get; set; }

        public FlightSchedule FlightSchedule { get; set; }
    }
}

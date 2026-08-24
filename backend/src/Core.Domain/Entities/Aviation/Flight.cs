using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Entities.Aviation
{
    public class Flight
    {
        public Guid Id { get; set; }
        public string FlightNumber { get; set; } // "SV-101"
        public Guid AirlineId { get; set; }
        public Guid DepartureAirportId { get; set; }
        public Guid ArrivalAirportId { get; set; }
        public TimeSpan DepartureTime { get; set; }
        public TimeSpan ArrivalTime { get; set; }
        public string Duration { get; set; } // "6? 30?"
        public int DurationMinutes { get; set; }
        public int Stops { get; set; } // 0, 1, 2
        public string StopCity { get; set; } // "???"
        public decimal EconomyPrice { get; set; }
        public decimal? EconomyOriginalPrice { get; set; }
        public decimal BusinessPrice { get; set; }
        public decimal? BusinessOriginalPrice { get; set; }
        public bool IsActive { get; set; }

        // Navigation
        public Airline Airline { get; set; }
        public Airport DepartureAirport { get; set; }
        public Airport ArrivalAirport { get; set; }
        public ICollection<FlightSchedule> Schedules { get; set; }
    }

}

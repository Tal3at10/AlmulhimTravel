using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Core.Domain.Entities.Aviation
{
    public class FlightSchedule
    {
        public Guid Id { get; set; }
        public Guid FlightId { get; set; }
        public DateTime Date { get; set; }
        public int EconomySeatsAvailable { get; set; }
        public int BusinessSeatsAvailable { get; set; }
        public bool IsActive { get; set; }

        [Timestamp]
        public byte[]? RowVersion { get; set; }

        public Flight Flight { get; set; }
        public ICollection<Seat> Seats { get; set; }
    }

}

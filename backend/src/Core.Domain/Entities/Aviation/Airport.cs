using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Entities.Aviation
{
    public class Airport
    {
        public Guid Id { get; set; }
        public string Code { get; set; } // "RUH", "LHR", "DXB"
        public string NameAr { get; set; }
        public string NameEn { get; set; }
        public string CityAr { get; set; }
        public string CityEn { get; set; }
        public string Country { get; set; }
        public bool IsActive { get; set; }

        public ICollection<Flight> DepartureFlights { get; set; }
        public ICollection<Flight> ArrivalFlights { get; set; }
    }

}

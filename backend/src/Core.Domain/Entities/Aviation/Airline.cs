using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Entities.Aviation
{
    public class Airline
    {
        public Guid Id { get; set; }
        public string Code { get; set; } // "SV", "EK", "QR"
        public string NameAr { get; set; }
        public string NameEn { get; set; }
        public string LogoUrl { get; set; }
        public bool IsActive { get; set; }

        public ICollection<Flight> Flights { get; set; }
    }
}

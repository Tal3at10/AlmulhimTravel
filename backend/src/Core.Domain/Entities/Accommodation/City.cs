using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Catalog;

namespace Core.Domain.Entities.Accommodation
{
    public class City
    {
        public Guid Id { get; set; }
        public string NameAr { get; set; }
        public string NameEn { get; set; }
        public string Country { get; set; }

        public ICollection<Hotel> Hotels { get; set; }
    }
}


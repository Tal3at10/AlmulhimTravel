using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Catalog;

namespace Core.Domain.Entities.Accommodation
{
    public class Amenity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; } // "Wifi", "Car", "Dumbbell", etc.

        public ICollection<HotelAmenity> HotelAmenities { get; set; }
    }
}


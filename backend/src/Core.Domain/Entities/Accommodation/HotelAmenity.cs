using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Catalog;

namespace Core.Domain.Entities.Accommodation
{
    public class HotelAmenity // Many-to-Many
    {
        public Guid HotelId { get; set; }
        public Guid AmenityId { get; set; }

        public Hotel Hotel { get; set; }
        public Amenity Amenity { get; set; }
    }
}


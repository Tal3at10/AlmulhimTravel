using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Catalog;

namespace Core.Domain.Entities.Accommodation
{
    public class Room
    {
        public Guid Id { get; set; }
        public Guid HotelId { get; set; }
        public string Name { get; set; }
        public string NameEn { get; set; }
        public string ImageUrl { get; set; }
        public int MaxGuests { get; set; }
        public string BedType { get; set; } // "???? ????", "2 ???? ????"
        public string Size { get; set; } // "35 ?²"
        public int AvailableCount { get; set; }
        public bool IsActive { get; set; }

        // Navigation
        public Hotel Hotel { get; set; }
        public ICollection<RoomFeature> Features { get; set; }
        public ICollection<RatePlan> RatePlans { get; set; }
    }
}


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Catalog;

namespace Core.Domain.Entities.Accommodation
{
    public class Hotel
    {
        public Guid Id { get; set; }
        public string HotelId { get; set; } // "hilton-london"
        public string Name { get; set; }
        public string NameEn { get; set; }
        public int Stars { get; set; } // 1-5
        public decimal Rating { get; set; } // 9.2
        public int ReviewCount { get; set; }
        public string RatingText { get; set; } // "?????", "??? ????"
        public string Address { get; set; }
        public string Location { get; set; } // "??????? ????"
        public string Distance { get; set; } // "0.5 ?? ?? ??????"
        public Guid? CityId { get; set; }
        public string Description { get; set; }
        public string MainImageUrl { get; set; }
        public string DayImageUrl { get; set; }
        public string NightImageUrl { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public bool IsActive { get; set; }

        // Navigation
        public City City { get; set; }
        public ICollection<HotelImage> Images { get; set; }
        public ICollection<HotelAmenity> Amenities { get; set; }
        public ICollection<HotelBadge> Badges { get; set; }
        public ICollection<HotelHighlight> Highlights { get; set; }
        public ICollection<Room> Rooms { get; set; }
        public ICollection<PackageHotel> PackageHotels { get; set; }
    }

}


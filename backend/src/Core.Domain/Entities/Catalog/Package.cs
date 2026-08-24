using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Accommodation;

namespace Core.Domain.Entities.Catalog
{
    public class Package
    {
        public Guid Id { get; set; }
        public string PackageId { get; set; } = string.Empty; // "malaysia-luxury"
        public Guid DestinationId { get; set; }
        public string TitleAr { get; set; } = string.Empty;
        public string? TitleEn { get; set; }
        public string? Subtitle { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; } = string.Empty; // "?.?"
        public string Duration { get; set; } = string.Empty; // "8 ???? / 7 ?????"
        public int DurationDays { get; set; }
        public int DurationNights { get; set; }
        public string ImageUrl { get; set; } = string.Empty; // Main package image
        public string? VideoUrl { get; set; }
        public string? Vibe { get; set; } // "tropical", "cultural", "urban", "mountain", "arctic", "luxury"
        public decimal Rating { get; set; }
        public bool IsOffer { get; set; }
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public int FeaturedOrder { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation
        public Destination Destination { get; set; }
        public ICollection<PackageItinerary> Itineraries { get; set; }
        public ICollection<PackageHotel> PackageHotels { get; set; }
        public ICollection<PackageFeature> Features { get; set; }
    }
}


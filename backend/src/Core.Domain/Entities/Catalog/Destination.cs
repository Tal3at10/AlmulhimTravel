using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Accommodation;

namespace Core.Domain.Entities.Catalog
{
    public class Destination
    {
        public Guid Id { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string? NameEn { get; set; }
        public string? Slug { get; set; } // "malaysia", "turkey"
        public string Country { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
        public bool IsFeatured { get; set; }
        public int FeaturedOrder { get; set; }

        // Navigation
        public ICollection<Package> Packages { get; set; }
        public ICollection<Hotel> Hotels { get; set; }
        public ICollection<CustomerVideo> CustomerVideos { get; set; }
    }
}


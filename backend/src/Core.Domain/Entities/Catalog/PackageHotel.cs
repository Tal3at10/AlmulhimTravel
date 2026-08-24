using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Accommodation;

namespace Core.Domain.Entities.Catalog
{
    public class PackageHotel // Many-to-Many with embedded hotel data
    {
        public Guid Id { get; set; } // Primary key
        public Guid PackageId { get; set; }
        
        // Embedded hotel information (no foreign key to Hotels table)
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int Stars { get; set; }
        public int NightsCount { get; set; }
        public string DayImageUrl { get; set; } = string.Empty;
        public string NightImageUrl { get; set; } = string.Empty;
        public int SortOrder { get; set; }

        // Navigation
        public Package Package { get; set; }
    }
}


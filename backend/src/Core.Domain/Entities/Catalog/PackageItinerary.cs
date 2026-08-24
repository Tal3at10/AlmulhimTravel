using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Accommodation;

namespace Core.Domain.Entities.Catalog
{
    public class PackageItinerary
    {
        public Guid Id { get; set; }
        public Guid PackageId { get; set; }
        public int Day { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }

        // Navigation
        public Package Package { get; set; }
    }
}


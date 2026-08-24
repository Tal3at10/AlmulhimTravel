using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Accommodation;

namespace Core.Domain.Entities.Catalog
{
    public class CustomerVideo
    {
        public Guid Id { get; set; }
        public Guid DestinationId { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string? Location { get; set; } // "??????????", "??????"
        public string? Date { get; set; } // "?????? 2024"
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }

        // Navigation
        public Destination Destination { get; set; }
    }
}


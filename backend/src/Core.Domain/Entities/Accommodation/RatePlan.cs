using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Catalog;

namespace Core.Domain.Entities.Accommodation
{
    public class RatePlan
    {
        public Guid Id { get; set; }
        public Guid RoomId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string TaxInfo { get; set; } // "???? ??????? ???????"
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public bool IsActive { get; set; }

        public Room Room { get; set; }
    }
}


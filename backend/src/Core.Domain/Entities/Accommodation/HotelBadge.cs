using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Catalog;

namespace Core.Domain.Entities.Accommodation
{
    public class HotelBadge
    {
        public Guid Id { get; set; }
        public Guid HotelId { get; set; }
        public string Text { get; set; } // "??? ?????", "????? ?????"
        public string Type { get; set; } // "deal", "feature"

        public Hotel Hotel { get; set; }
    }
}


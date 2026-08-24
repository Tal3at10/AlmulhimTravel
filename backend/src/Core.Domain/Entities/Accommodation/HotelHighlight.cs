using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Catalog;

namespace Core.Domain.Entities.Accommodation
{
    public class HotelHighlight
    {
        public Guid Id { get; set; }
        public Guid HotelId { get; set; }
        public string Text { get; set; }

        public Hotel Hotel { get; set; }
    }
}


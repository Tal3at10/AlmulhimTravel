using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Reservations;
using Core.Domain.Entities.Accommodation;
using Core.Domain.Entities.Catalog;
using Core.Domain.Enums;

namespace Core.Domain.Entities.Identity
{
    public class UserFavorite
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public FavoriteType Type { get; set; }
        public Guid? HotelId { get; set; }
        public Guid? PackageId { get; set; }
        public DateTime CreatedAt { get; set; }

        public User User { get; set; }
        public Hotel Hotel { get; set; }
        public Package Package { get; set; }
    }
}


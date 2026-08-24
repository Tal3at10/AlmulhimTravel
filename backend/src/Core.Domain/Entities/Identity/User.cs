using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Reservations;
using Core.Domain.Entities.Accommodation;
using Core.Domain.Entities.Catalog;

namespace Core.Domain.Entities.Identity
{
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Phone { get; set; }
        public string CountryCode { get; set; } // +966, +971, etc.
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
        public string Role { get; set; } = "User"; // "Admin" | "User"
        public string SecurityStamp { get; set; } = Guid.NewGuid().ToString(); // Changes on password change to invalidate all tokens
        public decimal WalletBalance { get; set; }
        public int LoyaltyPoints { get; set; }

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        // Navigation
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<UserFavorite> Favorites { get; set; }
        public ICollection<WalletTransaction> WalletTransactions { get; set; } = new List<WalletTransaction>();
        public ICollection<LoyaltyTransaction> LoyaltyTransactions { get; set; } = new List<LoyaltyTransaction>();
    }
}



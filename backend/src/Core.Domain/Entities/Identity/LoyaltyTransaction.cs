using System;

namespace Core.Domain.Entities.Identity
{
    public class LoyaltyTransaction
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public int Points { get; set; }
        public string Type { get; set; } // Earned, Redeemed, Expired
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation
        public User User { get; set; }
    }
}

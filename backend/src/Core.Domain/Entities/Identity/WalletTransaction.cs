using System;

namespace Core.Domain.Entities.Identity
{
    public class WalletTransaction
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } // Purchase, Refund, Deposit, PointsConversion
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation
        public User User { get; set; }
    }
}

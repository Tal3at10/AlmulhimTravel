using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Domain.Entities.Identity;

namespace Core.Application.Abstraction.Services.Identity
{
    public interface IWalletService
    {
        Task<decimal> GetBalanceAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<int> GetLoyaltyPointsAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<string> GetLoyaltyTierAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<int> GetPointsToNextTierAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<WalletTransaction>> GetWalletTransactionsAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<LoyaltyTransaction>> GetLoyaltyTransactionsAsync(Guid userId, CancellationToken cancellationToken = default);
        
        Task CreditWalletAsync(Guid userId, decimal amount, string type, string description, CancellationToken cancellationToken = default);
        Task DebitWalletAsync(Guid userId, decimal amount, string type, string description, CancellationToken cancellationToken = default);
        Task ConvertPointsToWalletAsync(Guid userId, int points, CancellationToken cancellationToken = default);
        
        Task ProcessLoyaltyPointsForBookingAsync(Guid userId, decimal bookingAmount, string bookingReference, CancellationToken cancellationToken = default);
    }
}

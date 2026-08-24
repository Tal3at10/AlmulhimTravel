using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Identity;
using Core.Domain.Entities.Identity;

namespace Core.Application.Services.Identity
{
    public class WalletService : IWalletService
    {
        private readonly IUnitOfWork _unitOfWork;

        public WalletService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<decimal> GetBalanceAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            return user.WalletBalance;
        }

        public async Task<int> GetLoyaltyPointsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            return user.LoyaltyPoints;
        }

        public async Task<string> GetLoyaltyTierAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            return GetTierName(user.LoyaltyPoints);
        }

        public async Task<int> GetPointsToNextTierAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            int points = user.LoyaltyPoints;
            if (points < 2000)
                return 2000 - points;
            if (points < 5000)
                return 5000 - points;
            if (points < 10000)
                return 10000 - points;

            return 0; // Highest tier
        }

        public async Task<IReadOnlyList<WalletTransaction>> GetWalletTransactionsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var transactions = await _unitOfWork.WalletTransactions.FindAllAsync(
                t => t.UserId == userId,
                cancellationToken
            );
            return transactions.OrderByDescending(t => t.CreatedAt).ToList();
        }

        public async Task<IReadOnlyList<LoyaltyTransaction>> GetLoyaltyTransactionsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var transactions = await _unitOfWork.LoyaltyTransactions.FindAllAsync(
                t => t.UserId == userId,
                cancellationToken
            );
            return transactions.OrderByDescending(t => t.CreatedAt).ToList();
        }

        public async Task CreditWalletAsync(Guid userId, decimal amount, string type, string description, CancellationToken cancellationToken = default)
        {
            if (amount <= 0)
                throw new ArgumentException("Amount to credit must be greater than zero", nameof(amount));

            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            user.WalletBalance += amount;

            var transaction = new WalletTransaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = amount,
                Type = type,
                Description = description,
                CreatedAt = DateTime.UtcNow
            };

            _unitOfWork.Users.Update(user);
            await _unitOfWork.WalletTransactions.AddAsync(transaction, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task DebitWalletAsync(Guid userId, decimal amount, string type, string description, CancellationToken cancellationToken = default)
        {
            if (amount <= 0)
                throw new ArgumentException("Amount to debit must be greater than zero", nameof(amount));

            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            if (user.WalletBalance < amount)
                throw new InvalidOperationException("Insufficient wallet balance");

            user.WalletBalance -= amount;

            var transaction = new WalletTransaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = -amount,
                Type = type,
                Description = description,
                CreatedAt = DateTime.UtcNow
            };

            _unitOfWork.Users.Update(user);
            await _unitOfWork.WalletTransactions.AddAsync(transaction, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task ConvertPointsToWalletAsync(Guid userId, int points, CancellationToken cancellationToken = default)
        {
            if (points < 500)
                throw new InvalidOperationException("Minimum conversion threshold is 500 points");

            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            if (user.LoyaltyPoints < points)
                throw new InvalidOperationException("Insufficient loyalty points");

            decimal cashAmount = points / 100m;

            user.LoyaltyPoints -= points;
            user.WalletBalance += cashAmount;

            var loyaltyTx = new LoyaltyTransaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Points = -points,
                Type = "Redeemed",
                Description = "تحويل نقاط إلى رصيد المحفظة",
                CreatedAt = DateTime.UtcNow
            };

            var walletTx = new WalletTransaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = cashAmount,
                Type = "PointsConversion",
                Description = $"تحويل {points} نقطة ولاء إلى رصيد المحفظة",
                CreatedAt = DateTime.UtcNow
            };

            _unitOfWork.Users.Update(user);
            await _unitOfWork.LoyaltyTransactions.AddAsync(loyaltyTx, cancellationToken);
            await _unitOfWork.WalletTransactions.AddAsync(walletTx, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task ProcessLoyaltyPointsForBookingAsync(Guid userId, decimal bookingAmount, string bookingReference, CancellationToken cancellationToken = default)
        {
            if (bookingAmount <= 0)
                return;

            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            decimal cashbackPercentage = GetCashbackPercentage(user.LoyaltyPoints);
            int pointsToAdd = (int)Math.Round(bookingAmount * cashbackPercentage * 100);

            if (pointsToAdd <= 0)
                return;

            user.LoyaltyPoints += pointsToAdd;

            var loyaltyTx = new LoyaltyTransaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Points = pointsToAdd,
                Type = "Earned",
                Description = $"كسب نقاط مقابل الحجز رقم {bookingReference}",
                CreatedAt = DateTime.UtcNow
            };

            _unitOfWork.Users.Update(user);
            await _unitOfWork.LoyaltyTransactions.AddAsync(loyaltyTx, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        private static string GetTierName(int points)
        {
            if (points < 2000)
                return "Amateur";
            if (points < 5000)
                return "Expert";
            if (points < 10000)
                return "Traveler";
            return "Ambassador";
        }

        private static decimal GetCashbackPercentage(int points)
        {
            if (points < 2000)
                return 0.01m; // 1%
            if (points < 5000)
                return 0.015m; // 1.5%
            if (points < 10000)
                return 0.02m; // 2%
            return 0.03m; // 3%
        }
    }
}

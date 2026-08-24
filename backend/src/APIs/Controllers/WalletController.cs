using System;
using System.Collections.Generic;
using System.Threading;
using Core.Application.Abstraction.DTOs.Wallet;
using System.Threading.Tasks;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    [Authorize] // Requires authentication for all wallet endpoints
    public class WalletController : BaseApiController
    {
        private readonly IServiceManager _serviceManager;

        public WalletController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetWalletDetails(CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();

                var balance = await _serviceManager.Wallet.GetBalanceAsync(userId, cancellationToken);
                var points = await _serviceManager.Wallet.GetLoyaltyPointsAsync(userId, cancellationToken);
                var tier = await _serviceManager.Wallet.GetLoyaltyTierAsync(userId, cancellationToken);
                var pointsToNext = await _serviceManager.Wallet.GetPointsToNextTierAsync(userId, cancellationToken);
                var walletTransactions = await _serviceManager.Wallet.GetWalletTransactionsAsync(userId, cancellationToken);
                var loyaltyTransactions = await _serviceManager.Wallet.GetLoyaltyTransactionsAsync(userId, cancellationToken);

                // Translate tier names to Arabic for the frontend presentation
                string tierAr = tier switch
                {
                    "Amateur" => "هاوي",
                    "Expert" => "دبره",
                    "Traveler" => "رحّال",
                    "Ambassador" => "سفير",
                    _ => tier
                };

                return Ok(new
                {
                    Balance = balance,
                    LoyaltyPoints = points,
                    LoyaltyTier = tier,
                    LoyaltyTierAr = tierAr,
                    PointsToNextTier = pointsToNext,
                    WalletTransactions = walletTransactions,
                    LoyaltyTransactions = loyaltyTransactions
                });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "User not found" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Failed to load wallet: {ex.Message}" });
            }
        }

        [HttpPost("convert")]
        public async Task<IActionResult> ConvertPoints([FromBody] ConvertPointsRequestDto request, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _serviceManager.Wallet.ConvertPointsToWalletAsync(userId, request.Points, cancellationToken);
                
                return Ok(new { message = $"تم تحويل {request.Points} نقطة إلى رصيد المحفظة بنجاح" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "User not found" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Failed to convert points: {ex.Message}" });
            }
        }
    }
}

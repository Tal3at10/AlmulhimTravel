using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers.Admin
{
    /// <summary>
    /// Admin Dashboard Controller
    /// Provides statistics and overview data for the admin dashboard
    /// </summary>
    public class AdminDashboardController : AdminBaseController
    {
        private readonly IServiceManager _serviceManager;

        public AdminDashboardController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        /// <summary>
        /// Get dashboard statistics overview
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats(CancellationToken cancellationToken)
        {
            var stats = await _serviceManager.AdminDashboard.GetStatsAsync(cancellationToken);
            return HandleResult(stats);
        }

        /// <summary>
        /// Get recent bookings for dashboard
        /// </summary>
        [HttpGet("recent-bookings")]
        public async Task<IActionResult> GetRecentBookings([FromQuery] int count = 10, CancellationToken cancellationToken = default)
        {
            var bookings = await _serviceManager.AdminDashboard.GetRecentBookingsAsync(count, cancellationToken);
            return HandleResult(bookings);
        }
    }
}

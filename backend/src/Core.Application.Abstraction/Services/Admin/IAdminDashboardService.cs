using Core.Application.Abstraction.DTOs.Admin;
using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.Services.Admin
{
    /// <summary>
    /// Admin Dashboard Service Interface
    /// Provides statistics and overview data
    /// </summary>
    public interface IAdminDashboardService
    {
        Task<Result<DashboardStatsDto>> GetStatsAsync(CancellationToken cancellationToken = default);
        Task<Result<List<RecentBookingDto>>> GetRecentBookingsAsync(int count = 10, CancellationToken cancellationToken = default);
    }
}

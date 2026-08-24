using Core.Application.Abstraction.DTOs.Admin;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Admin;
using Core.Domain.Enums;

namespace Core.Application.Services.Admin
{
    /// <summary>
    /// Admin Dashboard Service Implementation
    /// Provides aggregated statistics and overview data for admin dashboard
    /// Uses only IGenericRepository methods (no direct EF Core dependency)
    /// </summary>
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdminDashboardService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<DashboardStatsDto>> GetStatsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var now = DateTime.UtcNow;
                var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

                var stats = new DashboardStatsDto
                {
                    TotalUsers = await _unitOfWork.Users.CountAsync(cancellationToken),
                    TotalBookings = await _unitOfWork.Bookings.CountAsync(cancellationToken),
                    TotalPackages = await _unitOfWork.Packages.CountAsync(cancellationToken),
                    TotalDestinations = await _unitOfWork.Destinations.CountAsync(cancellationToken),
                    TotalHotels = await _unitOfWork.Hotels.CountAsync(cancellationToken),
                    ActivePackages = await _unitOfWork.Packages.CountAsync(p => p.IsActive, cancellationToken),
                    PendingBookings = await _unitOfWork.Bookings.CountAsync(b => b.Status == BookingStatus.Pending, cancellationToken),
                    ConfirmedBookings = await _unitOfWork.Bookings.CountAsync(b => b.Status == BookingStatus.Confirmed, cancellationToken),
                    CancelledBookings = await _unitOfWork.Bookings.CountAsync(b => b.Status == BookingStatus.Cancelled, cancellationToken),
                    NewUsersThisMonth = await _unitOfWork.Users.CountAsync(u => u.CreatedAt >= startOfMonth, cancellationToken),
                    BookingsThisMonth = await _unitOfWork.Bookings.CountAsync(b => b.CreatedAt >= startOfMonth, cancellationToken)
                };

                return Result<DashboardStatsDto>.Success(stats, "Dashboard stats retrieved successfully");
            }
            catch (Exception ex)
            {
                return Result<DashboardStatsDto>.Failure($"Failed to retrieve dashboard stats: {ex.Message}");
            }
        }

        public async Task<Result<List<RecentBookingDto>>> GetRecentBookingsAsync(int count = 10, CancellationToken cancellationToken = default)
        {
            try
            {
                // Use repository pagination to get recent bookings
                var (bookings, totalCount) = await _unitOfWork.Bookings.GetPagedAsync(
                    pageNumber: 1,
                    pageSize: count,
                    predicate: null,
                    orderBy: q => q.OrderByDescending(b => b.CreatedAt),
                    b => b.User!
                );

                var result = bookings.Select(b => new RecentBookingDto
                {
                    Id = b.Id,
                    ReferenceNumber = b.ReferenceNumber ?? "",
                    CustomerName = b.User != null
                        ? $"{b.User.FirstName} {b.User.LastName}"
                        : $"{b.GuestFirstName} {b.GuestLastName}",
                    CustomerEmail = b.User != null
                        ? b.User.Email
                        : b.GuestEmail ?? "",
                    BookingType = b.Type.ToString(),
                    Status = b.Status.ToString(),
                    TotalAmount = b.TotalAmount,
                    Currency = b.Currency ?? "ر.س",
                    CreatedAt = b.CreatedAt
                }).ToList();

                return Result<List<RecentBookingDto>>.Success(result, "Recent bookings retrieved successfully");
            }
            catch (Exception ex)
            {
                return Result<List<RecentBookingDto>>.Failure($"Failed to retrieve recent bookings: {ex.Message}");
            }
        }
    }
}

using Core.Application.Abstraction.DTOs.Aviation;
using Core.Application.Abstraction.DTOs.Common;

namespace Core.Application.Abstraction.Services.Aviation
{
    public interface IFlightService
    {
        Task<Result<PaginatedResult<FlightCardDto>>> SearchAsync(FlightSearchQuery query, CancellationToken cancellationToken = default);
        Task<Result<FlightDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<FlightDetailDto>> GetScheduleDetailsAsync(Guid scheduleId, CancellationToken cancellationToken = default);
        Task<Result<List<SeatDto>>> GetAvailableSeatsAsync(Guid scheduleId, string cabinClass, CancellationToken cancellationToken = default);
    }
}

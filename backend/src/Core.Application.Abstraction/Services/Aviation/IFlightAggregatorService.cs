using Core.Application.Abstraction.DTOs.Aviation;
using Core.Application.Abstraction.DTOs.Reservations;

namespace Core.Application.Abstraction.Services.Aviation;

public interface IFlightAggregatorService
{
    Task<List<FlightCardDto>> SearchAsync(FlightSearchQuery query, CancellationToken ct = default);
    Task<FlightDetailDto?> GetDetailsAsync(string flightId, string providerName, FlightSearchQuery query, CancellationToken ct = default);
    Task<FlightBookingDto?> CreateBookingAsync(FlightBookingRequest request, CancellationToken ct = default);
}

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.DTOs.Locations;

namespace Core.Application.Abstraction.Services;

public interface ILocationsService
{
    Task<List<LocationSuggestionDto>> SearchHotelsAsync(string query, CancellationToken cancellationToken = default);
    Task<List<LocationSuggestionDto>> SearchFlightsAsync(string query, CancellationToken cancellationToken = default);
}

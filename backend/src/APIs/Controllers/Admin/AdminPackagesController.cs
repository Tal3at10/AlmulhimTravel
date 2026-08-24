using Core.Application.Abstraction.DTOs.Catalog;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers.Admin
{
    /// <summary>
    /// Admin Packages Controller
    /// Full CRUD for managing travel packages
    /// </summary>
    public class AdminPackagesController : AdminBaseController
    {
        private readonly IServiceManager _serviceManager;

        public AdminPackagesController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PackageSearchQuery query, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.SearchAsync(query, cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.GetByIdAsync(id, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePackageDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.CreateAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePackageDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.UpdateAsync(id, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.DeleteAsync(id, cancellationToken);
            return HandleResult(result);
        }

        // Itinerary Management
        [HttpGet("{packageId}/itinerary")]
        public async Task<IActionResult> GetItinerary(Guid packageId, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.GetItineraryAsync(packageId, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("{packageId}/itinerary")]
        public async Task<IActionResult> AddItineraryItem(Guid packageId, [FromBody] PackageItineraryDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.AddItineraryItemAsync(packageId, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("itinerary/{itemId}")]
        public async Task<IActionResult> UpdateItineraryItem(Guid itemId, [FromBody] PackageItineraryDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.UpdateItineraryItemAsync(itemId, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpDelete("itinerary/{itemId}")]
        public async Task<IActionResult> DeleteItineraryItem(Guid itemId, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.DeleteItineraryItemAsync(itemId, cancellationToken);
            return HandleResult(result);
        }

        // Hotel Management
        [HttpGet("{packageId}/hotels")]
        public async Task<IActionResult> GetHotels(Guid packageId, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.GetHotelsAsync(packageId, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("{packageId}/hotels")]
        public async Task<IActionResult> AddHotel(Guid packageId, [FromBody] CreatePackageHotelDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.AddHotelAsync(packageId, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("{packageId}/hotels/{hotelId}")]
        public async Task<IActionResult> UpdateHotel(Guid packageId, Guid hotelId, [FromBody] UpdatePackageHotelDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.UpdateHotelAsync(packageId, hotelId, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpDelete("{packageId}/hotels/{hotelId}")]
        public async Task<IActionResult> DeleteHotel(Guid packageId, Guid hotelId, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Packages.DeleteHotelAsync(packageId, hotelId, cancellationToken);
            return HandleResult(result);
        }
    }
}

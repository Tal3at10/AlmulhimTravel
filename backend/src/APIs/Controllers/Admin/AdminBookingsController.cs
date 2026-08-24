using Core.Application.Abstraction.DTOs.Reservations;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers.Admin
{
    /// <summary>
    /// Admin Bookings Controller
    /// Manage and oversee all bookings
    /// </summary>
    public class AdminBookingsController : AdminBaseController
    {
        private readonly IServiceManager _serviceManager;

        public AdminBookingsController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] BookingSearchQuery query, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Bookings.GetAllAsync(query, cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Bookings.GetByIdAsync(id, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpPut("{id}/confirm")]
        public async Task<IActionResult> Confirm(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Bookings.ConfirmBookingAsync(id, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancel(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Bookings.CancelBookingAsync(id, cancellationToken);
            return HandleResult(result);
        }
    }
}

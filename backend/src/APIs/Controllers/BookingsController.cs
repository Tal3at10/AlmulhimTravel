using Core.Application.Abstraction.DTOs.Reservations;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    public class BookingsController : BaseApiController
    {
        private readonly IServiceManager _serviceManager;

        public BookingsController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpPost("hotel")]
        [AllowAnonymous] // Guest bookings allowed
        public async Task<IActionResult> CreateHotelBooking([FromBody] CreateHotelBookingDto dto, CancellationToken cancellationToken)
        {
            if (!dto.UserId.HasValue || dto.UserId == Guid.Empty)
            {
                dto.UserId = GetCurrentUserIdOrNull();
            }
            var result = await _serviceManager.Bookings.CreateHotelBookingAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("flight")]
        [AllowAnonymous] // Guest bookings allowed
        public async Task<IActionResult> CreateFlightBooking([FromBody] CreateFlightBookingDto dto, CancellationToken cancellationToken)
        {
            if (!dto.UserId.HasValue || dto.UserId == Guid.Empty)
            {
                dto.UserId = GetCurrentUserIdOrNull();
            }
            var result = await _serviceManager.Bookings.CreateFlightBookingAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("package")]
        [AllowAnonymous] // Guest bookings allowed
        public async Task<IActionResult> CreatePackageBooking([FromBody] CreatePackageBookingDto dto, CancellationToken cancellationToken)
        {
            if (!dto.UserId.HasValue || dto.UserId == Guid.Empty)
            {
                dto.UserId = GetCurrentUserIdOrNull();
            }
            var result = await _serviceManager.Bookings.CreatePackageBookingAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("lookup")]
        [AllowAnonymous] // Anyone can lookup with reference + email
        public async Task<IActionResult> Lookup([FromQuery] string reference, [FromQuery] string email, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Bookings.GetByReferenceAsync(reference, email, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous] // Allow viewing proposal details by ID for the payment magic link
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Bookings.GetByIdAsync(id, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpGet("my")]
        [Authorize] // Requires authentication
        public async Task<IActionResult> GetMyBookings(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _serviceManager.Bookings.GetUserBookingsAsync(userId, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("{id}/cancel")]
        [Authorize] // Requires authentication
        public async Task<IActionResult> Cancel(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Bookings.CancelBookingAsync(id, cancellationToken);
            return HandleResult(result);
        }

#if DEBUG
        [HttpPost("confirm-test/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmTest(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Bookings.ConfirmBookingAsync(id, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("cancel-test/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> CancelTest(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Bookings.CancelBookingAsync(id, cancellationToken);
            return HandleResult(result);
        }
#endif

        [HttpGet("voucher/{referenceNumber}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetVoucher(string referenceNumber, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Bookings.GetByReferenceAsync(referenceNumber, "");
            if (result.IsSuccess && result.Data != null && !string.IsNullOrEmpty(result.Data.VoucherReference))
            {
                var url = $"https://voucherpro.runasp.net/api/v1/vouchersend/view/{result.Data.VoucherReference}";
                return Redirect(url);
            }
            return NotFound("Voucher not found");
        }
    }
}

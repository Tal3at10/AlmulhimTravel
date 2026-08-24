using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.DTOs.Reservations;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [Route("api/[controller]")]
    public class CouponsController : BaseApiController
    {
        private readonly IServiceManager _serviceManager;

        public CouponsController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet("verify")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyCoupon([FromQuery] string code, [FromQuery] decimal amount, CancellationToken cancellationToken)
        {
            var request = new VerifyCouponRequest
            {
                Code = code,
                BookingAmount = amount
            };
            var result = await _serviceManager.Coupons.VerifyCouponAsync(request, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost("use")]
        [AllowAnonymous]
        public async Task<IActionResult> UseCoupon([FromQuery] string code, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Coupons.UseCouponAsync(code, cancellationToken);
            return HandleResult(result);
        }
    }
}

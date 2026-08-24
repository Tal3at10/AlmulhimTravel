using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Reservations;

namespace Core.Application.Abstraction.Services.Reservations
{
    public interface ICouponService
    {
        Task<Result<VerifyCouponResponse>> VerifyCouponAsync(VerifyCouponRequest request, CancellationToken cancellationToken = default);
        Task<Result> UseCouponAsync(string code, CancellationToken cancellationToken = default);
    }
}

using System;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Reservations;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Reservations;
using Core.Domain.Entities.Reservations;

namespace Core.Application.Services.Reservations
{
    public class CouponService : ICouponService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CouponService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<VerifyCouponResponse>> VerifyCouponAsync(VerifyCouponRequest request, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(request.Code))
            {
                return Result<VerifyCouponResponse>.Failure("كود الكوبون غير صالح");
            }

            var coupon = await _unitOfWork.Coupons.FindAsync(c => c.Code.ToUpper() == request.Code.Trim().ToUpper(), cancellationToken);

            if (coupon == null)
            {
                return Result<VerifyCouponResponse>.Failure("الكوبون غير موجود أو غير صالح");
            }

            if (!coupon.IsActive)
            {
                return Result<VerifyCouponResponse>.Failure("هذا الكوبون لم يعد نشطاً");
            }

            var now = DateTime.UtcNow;
            if (now < coupon.ValidFrom || now > coupon.ValidTo)
            {
                return Result<VerifyCouponResponse>.Failure("هذا الكوبون منتهي الصلاحية أو غير صالح في الوقت الحالي");
            }

            if (coupon.UsageCount >= coupon.UsageLimit)
            {
                return Result<VerifyCouponResponse>.Failure("تم الوصول للحد الأقصى لاستخدام هذا الكوبون");
            }

            if (request.BookingAmount < coupon.MinBookingAmount)
            {
                return Result<VerifyCouponResponse>.Failure($"الحد الأدنى لتطبيق هذا الكوبون هو {coupon.MinBookingAmount} ر.س.");
            }

            // Calculate discount
            decimal discount = 0;
            if (coupon.DiscountType.Equals("Percentage", StringComparison.OrdinalIgnoreCase))
            {
                discount = request.BookingAmount * (coupon.Value / 100);
                if (coupon.MaxDiscount.HasValue && discount > coupon.MaxDiscount.Value)
                {
                    discount = coupon.MaxDiscount.Value;
                }
            }
            else if (coupon.DiscountType.Equals("Flat", StringComparison.OrdinalIgnoreCase))
            {
                discount = coupon.Value;
                if (discount > request.BookingAmount)
                {
                    discount = request.BookingAmount;
                }
            }

            return Result<VerifyCouponResponse>.Success(new VerifyCouponResponse
            {
                IsValid = true,
                Code = coupon.Code,
                DiscountType = coupon.DiscountType,
                Value = coupon.Value,
                MaxDiscount = coupon.MaxDiscount,
                MinBookingAmount = coupon.MinBookingAmount,
                CalculatedDiscount = Math.Round(discount, 2),
                Message = "تم تطبيق الكوبون بنجاح!"
            });
        }

        public async Task<Result> UseCouponAsync(string code, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                return Result.Failure("كود الكوبون فارغ");
            }

            var coupon = await _unitOfWork.Coupons.FindAsync(c => c.Code.ToUpper() == code.Trim().ToUpper(), cancellationToken);

            if (coupon == null)
            {
                return Result.Failure("الكوبون غير موجود");
            }

            coupon.UsageCount += 1;
            _unitOfWork.Coupons.Update(coupon);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}

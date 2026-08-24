using Core.Application.Abstraction.DTOs.Reservations;
using FluentValidation;

namespace Core.Application.Validators.Reservations
{
    public class CreatePackageBookingDtoValidator : AbstractValidator<CreatePackageBookingDto>
    {
        public CreatePackageBookingDtoValidator()
        {
            RuleFor(x => x.PackageId)
                .NotEmpty().WithMessage("Package ID is required");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start date is required")
                .GreaterThanOrEqualTo(DateTime.Today).WithMessage("Start date must be today or in the future")
                .LessThanOrEqualTo(DateTime.Today.AddYears(1)).WithMessage("Start date must be within one year");

            RuleFor(x => x.NumberOfTravelers)
                .GreaterThan(0).WithMessage("Number of travelers must be at least 1")
                .LessThanOrEqualTo(20).WithMessage("Number of travelers cannot exceed 20");
        }
    }
}

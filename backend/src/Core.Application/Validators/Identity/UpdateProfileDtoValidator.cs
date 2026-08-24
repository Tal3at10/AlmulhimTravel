using Core.Application.Abstraction.DTOs.Identity;
using FluentValidation;

namespace Core.Application.Validators.Identity
{
    public class UpdateProfileDtoValidator : AbstractValidator<UpdateProfileDto>
    {
        public UpdateProfileDtoValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required")
                .MinimumLength(2).WithMessage("Full name must be at least 2 characters")
                .MaximumLength(100).WithMessage("Full name must not exceed 100 characters")
                .Matches(@"^[\p{L}\s'-]+$").WithMessage("Full name contains invalid characters")
                .Must(NotContainXss).WithMessage("Full name contains potentially dangerous content");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is required")
                .Matches(@"^\+?[0-9]{9,15}$").WithMessage("Phone number must be in a valid format (e.g., 5XXXXXXXX or 01XXXXXXXXX)");
        }

        private bool NotContainXss(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return true;

            var xssPatterns = new[] { @"<script", @"javascript:", @"onerror=", @"onload=", @"<iframe" };
            var lowerValue = value.ToLower();
            return !xssPatterns.Any(pattern => lowerValue.Contains(pattern));
        }
    }
}

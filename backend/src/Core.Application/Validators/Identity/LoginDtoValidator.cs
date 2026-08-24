using Core.Application.Abstraction.DTOs.Identity;
using FluentValidation;

namespace Core.Application.Validators.Identity
{
    /// <summary>
    /// Validator for LoginDto with XSS protection
    /// </summary>
    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        public LoginDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(100).WithMessage("Email must not exceed 100 characters")
                .Must(NotContainXss).WithMessage("Email contains potentially dangerous content");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MaximumLength(100).WithMessage("Password must not exceed 100 characters");
        }

        private bool NotContainXss(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return true;

            var xssPatterns = new[]
            {
                @"<script",
                @"javascript:",
                @"onerror=",
                @"onload=",
                @"<iframe"
            };

            var lowerValue = value.ToLower();
            return !xssPatterns.Any(pattern => lowerValue.Contains(pattern));
        }
    }
}

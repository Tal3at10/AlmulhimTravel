using Core.Application.Abstraction.DTOs.Identity;
using FluentValidation;
using System.Text.RegularExpressions;

namespace Core.Application.Validators.Identity
{
    /// <summary>
    /// Validator for RegisterDto with XSS protection and business rules
    /// </summary>
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            // Email validation
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(100).WithMessage("Email must not exceed 100 characters")
                .Must(BeValidEmail).WithMessage("Email contains invalid characters")
                .Must(NotContainXss).WithMessage("Email contains potentially dangerous content");

            // Password validation
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters")
                .MaximumLength(100).WithMessage("Password must not exceed 100 characters")
                .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter")
                .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter")
                .Matches(@"[0-9]").WithMessage("Password must contain at least one number")
                .Matches(@"[\W_]").WithMessage("Password must contain at least one special character");

            // Full Name validation
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required")
                .MinimumLength(2).WithMessage("Full name must be at least 2 characters")
                .MaximumLength(100).WithMessage("Full name must not exceed 100 characters")
                .Matches(@"^[\p{L}\s'-]+$").WithMessage("Full name contains invalid characters")
                .Must(NotContainXss).WithMessage("Full name contains potentially dangerous content");

            // Phone Number validation
            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is required")
                .Matches(@"^\+?[0-9]{9,15}$").WithMessage("Phone number must be in a valid format (e.g., 5XXXXXXXX or 01XXXXXXXXX)")
                .Must(NotContainXss).WithMessage("Phone number contains potentially dangerous content");
        }

        private bool BeValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            // Additional email validation beyond EmailAddress()
            return !email.Contains("..") && !email.StartsWith(".") && !email.EndsWith(".");
        }

        private bool NotContainXss(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return true;

            // Check for common XSS patterns
            var xssPatterns = new[]
            {
                @"<script",
                @"javascript:",
                @"onerror=",
                @"onload=",
                @"onclick=",
                @"<iframe",
                @"<object",
                @"<embed",
                @"eval\(",
                @"expression\("
            };

            var lowerValue = value.ToLower();
            return !xssPatterns.Any(pattern => lowerValue.Contains(pattern));
        }
    }
}

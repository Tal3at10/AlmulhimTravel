using Core.Application.Abstraction.DTOs.Reservations;
using FluentValidation;

namespace Core.Application.Validators.Reservations
{
    public class CreateFlightBookingDtoValidator : AbstractValidator<CreateFlightBookingDto>
    {
        public CreateFlightBookingDtoValidator()
        {
            RuleFor(x => x.OutboundFlightId)
                .NotEmpty().When(x => string.IsNullOrEmpty(x.FlightNumber)).WithMessage("Outbound flight is required");

            RuleFor(x => x.CabinClass)
                .NotEmpty().WithMessage("Cabin class is required")
                .Must(BeValidCabinClass).WithMessage("Invalid cabin class. Must be 'Economy', 'Premium Economy', 'Business', or 'First Class'");

            RuleFor(x => x.Passengers)
                .NotEmpty().WithMessage("At least one passenger is required")
                .Must(x => x.Count >= 1 && x.Count <= 9).WithMessage("Number of passengers must be between 1 and 9");

            RuleForEach(x => x.Passengers)
                .SetValidator(new CreateFlightPassengerDtoValidator());
        }

        private bool BeValidCabinClass(string cabinClass)
        {
            var validClasses = new[] 
            { 
                "Economy", "Business", "First", "Premium_Economy", "PremiumEconomy",
                "economy", "business", "first", "premium_economy", "premiumeconomy",
                "first_class", "first class", "first-class", "First_Class", "First Class", "First-Class",
                "premium economy", "premium-economy", "Premium Economy", "Premium-Economy"
            };
            return validClasses.Contains(cabinClass);
        }
    }

    public class CreateFlightPassengerDtoValidator : AbstractValidator<CreateFlightPassengerDto>
    {
        public CreateFlightPassengerDtoValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .MinimumLength(2).WithMessage("First name must be at least 2 characters")
                .MaximumLength(50).WithMessage("First name must not exceed 50 characters")
                .Matches(@"^[\p{L}\s'-]+$").WithMessage("First name contains invalid characters")
                .Must(NotContainXss).WithMessage("First name contains potentially dangerous content");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .MinimumLength(2).WithMessage("Last name must be at least 2 characters")
                .MaximumLength(50).WithMessage("Last name must not exceed 50 characters")
                .Matches(@"^[\p{L}\s'-]+$").WithMessage("Last name contains invalid characters")
                .Must(NotContainXss).WithMessage("Last name contains potentially dangerous content");

            RuleFor(x => x.PassportNumber)
                .NotEmpty().WithMessage("Passport number is required")
                .MinimumLength(6).WithMessage("Passport number must be at least 6 characters")
                .MaximumLength(20).WithMessage("Passport number must not exceed 20 characters")
                .Matches(@"^[A-Z0-9]+$").WithMessage("Passport number must contain only uppercase letters and numbers");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty().WithMessage("Date of birth is required")
                .LessThan(DateTime.Today).WithMessage("Date of birth must be in the past")
                .GreaterThan(DateTime.Today.AddYears(-120)).WithMessage("Invalid date of birth");

            RuleFor(x => x.Nationality)
                .NotEmpty().WithMessage("Nationality is required")
                .MinimumLength(2).WithMessage("Nationality must be at least 2 characters")
                .MaximumLength(50).WithMessage("Nationality must not exceed 50 characters")
                .Matches(@"^[\p{L}\s]+$").WithMessage("Nationality contains invalid characters");

            RuleFor(x => x.PassengerType)
                .NotEmpty().WithMessage("Passenger type is required")
                .Must(BeValidPassengerType).WithMessage("Invalid passenger type. Must be 'Adult', 'Child', or 'Infant'");
        }

        private bool BeValidPassengerType(string type)
        {
            var validTypes = new[] { "Adult", "Child", "Infant", "adult", "child", "infant" };
            return validTypes.Contains(type);
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

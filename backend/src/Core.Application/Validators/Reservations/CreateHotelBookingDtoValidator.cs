using Core.Application.Abstraction.DTOs.Reservations;
using FluentValidation;

namespace Core.Application.Validators.Reservations
{
    public class CreateHotelBookingDtoValidator : AbstractValidator<CreateHotelBookingDto>
    {
        public CreateHotelBookingDtoValidator()
        {
            RuleFor(x => x.HotelId)
                .NotEmpty().When(x => string.IsNullOrEmpty(x.HotelName)).WithMessage("Hotel ID is required");

            RuleFor(x => x.RoomId)
                .NotEmpty().When(x => string.IsNullOrEmpty(x.HotelName)).WithMessage("Room ID is required");

            RuleFor(x => x.RatePlanId)
                .NotEmpty().When(x => string.IsNullOrEmpty(x.HotelName)).WithMessage("Rate plan ID is required");

            RuleFor(x => x.CheckInDate)
                .NotEmpty().WithMessage("Check-in date is required")
                .GreaterThanOrEqualTo(DateTime.Today).WithMessage("Check-in date must be today or in the future");

            RuleFor(x => x.CheckOutDate)
                .NotEmpty().WithMessage("Check-out date is required")
                .GreaterThan(x => x.CheckInDate).WithMessage("Check-out date must be after check-in date");

            RuleFor(x => x.NumberOfGuests)
                .GreaterThan(0).WithMessage("Number of guests must be at least 1")
                .LessThanOrEqualTo(10).WithMessage("Number of guests cannot exceed 10");

            // Business rule: Maximum stay duration
            RuleFor(x => x)
                .Must(x => (x.CheckOutDate - x.CheckInDate).TotalDays <= 30)
                .WithMessage("Maximum stay duration is 30 nights");
        }
    }
}

namespace Core.Application.Abstraction.DTOs.Payments;

public class PaymentRequestDto
{
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public string Description { get; set; } = string.Empty;
    public string ReferenceId { get; set; } = string.Empty;
    public string CallbackUrl { get; set; } = string.Empty;
}

public class PaymentVerificationDto
{
    public string PaymentId { get; set; } = string.Empty;
}

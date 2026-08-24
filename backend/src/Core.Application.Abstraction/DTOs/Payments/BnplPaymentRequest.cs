using System.Collections.Generic;

namespace Core.Application.Abstraction.DTOs.Payments;

public class BnplCustomerDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

public class BnplOrderItemDto
{
    public string Title { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string ReferenceId { get; set; } = string.Empty;
}

public class BnplPaymentRequest
{
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "SAR";
    public string OrderId { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CallbackUrl { get; set; } = string.Empty;
    public BnplCustomerDto Customer { get; set; } = new BnplCustomerDto();
    public List<BnplOrderItemDto> Items { get; set; } = new List<BnplOrderItemDto>();
}

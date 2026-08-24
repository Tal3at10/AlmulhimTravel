namespace Core.Application.Services.WhatsApp.Models;

public class ComponentCost
{
    public string Type { get; set; } = string.Empty; // "Flight", "Hotel", "Transfer", "Visa"
    public string Description { get; set; } = string.Empty; // e.g. "Flight from JED to IST"
    public decimal NetPrice { get; set; } // The actual B2B cost (e.g. 200.00)
    public string Currency { get; set; } = "SAR"; // e.g. "USD" or "SAR"
    public bool IsConfirmed { get; set; } // True if API returned confirmed rate, False if estimated from Rate Card
}

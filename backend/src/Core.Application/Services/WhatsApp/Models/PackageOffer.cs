using System.Collections.Generic;
using System.Linq;

namespace Core.Application.Services.WhatsApp.Models;

public class PackageOffer
{
    public string OfferId { get; set; } = string.Empty; // Unique ID for the quote
    public string CustomerName { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public int Nights { get; set; }
    public int PaxCount { get; set; }
    
    public List<ComponentCost> Components { get; set; } = new List<ComponentCost>();
    
    // The total Net Price from all components (Opaque internal cost)
    public decimal TotalNetPrice => Components.Sum(c => c.NetPrice);
    
    // The margin to add (e.g., fixed amount or percentage calculated externally)
    public decimal AgencyMargin { get; set; }
    
    // The OPAQUE total price shown to the customer
    public decimal RetailPrice => TotalNetPrice + AgencyMargin;
    
    public string Currency { get; set; } = "SAR";
    
    public bool IsValid { get; set; } = true; // False if hold expired
}

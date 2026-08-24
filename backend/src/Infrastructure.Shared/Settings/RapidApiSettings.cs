namespace Infrastructure.Shared.Settings;

/// <summary>
/// RapidAPI configuration settings for multiple travel APIs
/// </summary>
public class RapidApiSettings
{
    public string ApiKey { get; set; } = string.Empty;
    public string BookingHost { get; set; } = "booking-com15.p.rapidapi.com";
    public string TripadvisorHost { get; set; } = "tripadvisor16.p.rapidapi.com";
    public string HotelsComHost { get; set; } = "hotels-com-provider.p.rapidapi.com";
    public string PricelineHost { get; set; } = "priceline-com2.p.rapidapi.com";
    public string MakCorpsHost { get; set; } = "manthankool-makcorps-hotel-price-comparison-v1.p.rapidapi.com";
    public string AeroDataBoxHost { get; set; } = "aerodatabox.p.rapidapi.com";
}

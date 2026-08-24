namespace Infrastructure.Shared.Settings;

/// <summary>
/// Amadeus API configuration settings
/// </summary>
public class AmadeusSettings
{
    public string ApiKey { get; set; } = string.Empty;
    public string ApiSecret { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://test.api.amadeus.com";
}

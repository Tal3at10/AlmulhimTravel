namespace Infrastructure.Shared.Settings;

public class HotelbedsSettings
{
    public string ApiKey { get; set; } = string.Empty;
    public string ApiSecret { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api.test.hotelbeds.com/hotel-api/1.0";
    public string SecureBaseUrl { get; set; } = "https://api.test.hotelbeds.com/secure-api/1.0";
}

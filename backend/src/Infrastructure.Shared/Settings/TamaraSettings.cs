namespace Infrastructure.Shared.Settings;

public class TamaraSettings
{
    public string MerchantToken { get; set; } = string.Empty;
    public string NotificationToken { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api-sandbox.tamara.co";
}

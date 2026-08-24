namespace Infrastructure.Shared.Settings;

public class TabbySettings
{
    public string MerchantCode { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public string PublicKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api.tabby.ai";
}

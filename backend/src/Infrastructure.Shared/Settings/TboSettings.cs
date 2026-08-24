namespace Infrastructure.Shared.Settings;

public class TboSettings
{
    public string ClientId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public bool IsTestMode { get; set; } = true;
}

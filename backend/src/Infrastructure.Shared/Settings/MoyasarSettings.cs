namespace Infrastructure.Shared.Settings
{
    public class MoyasarSettings
    {
        public string SecretKey { get; set; } = string.Empty;
        public string PublishableKey { get; set; } = string.Empty;
        public string CallbackUrl { get; set; } = "http://localhost:5173/booking-success";
        public bool IsTestMode { get; set; } = true;
    }
}

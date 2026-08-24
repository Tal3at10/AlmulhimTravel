namespace Infrastructure.Shared.Settings
{
    /// <summary>
    /// JWT Configuration Settings
    /// </summary>
    public class JwtSettings
    {
        public string SecretKey { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public int ExpirationInDays { get; set; }
        public int RefreshTokenExpirationInDays { get; set; }
    }
}

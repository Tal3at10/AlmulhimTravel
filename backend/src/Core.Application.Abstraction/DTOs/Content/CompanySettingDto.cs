namespace Core.Application.Abstraction.DTOs.Content
{
    /// <summary>
    /// DTO for reading company settings (key-value pairs from DB)
    /// </summary>
    public class CompanySettingDto
    {
        public Guid Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string? ValueEn { get; set; }
    }

    /// <summary>
    /// DTO for updating a single company setting value
    /// Frontend sends: { "value": "some new value" }
    /// </summary>
    public class UpdateCompanySettingDto
    {
        public string Value { get; set; } = string.Empty;
        public string? ValueEn { get; set; }
    }
}

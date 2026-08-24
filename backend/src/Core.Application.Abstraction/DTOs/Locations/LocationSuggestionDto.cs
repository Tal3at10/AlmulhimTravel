namespace Core.Application.Abstraction.DTOs.Locations;

public class LocationSuggestionDto
{
    public string Code { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string? CityAr { get; set; }
    public string? CityEn { get; set; }
    public string Country { get; set; } = string.Empty;
}

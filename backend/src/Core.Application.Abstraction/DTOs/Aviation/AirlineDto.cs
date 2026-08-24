namespace Core.Application.Abstraction.DTOs.Aviation
{
    public class AirlineDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
    }
}

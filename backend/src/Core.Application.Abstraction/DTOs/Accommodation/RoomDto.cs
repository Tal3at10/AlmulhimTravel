namespace Core.Application.Abstraction.DTOs.Accommodation
{
    public class RoomCardDto
    {
        public Guid Id { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public int MaxOccupancy { get; set; }
        public decimal Size { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> Features { get; set; } = new();
        public List<RatePlanDto> RatePlans { get; set; } = new();
    }

    public class RoomDetailDto
    {
        public Guid Id { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string DescriptionAr { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        public int MaxOccupancy { get; set; }
        public decimal Size { get; set; }
        public string BedType { get; set; } = string.Empty;
        public string ViewType { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public List<RoomFeatureDto> Features { get; set; } = new();
        public List<RatePlanDto> RatePlans { get; set; } = new();
    }

    public class RoomFeatureDto
    {
        public string Name { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
    }
}

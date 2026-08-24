namespace Infrastructure.Shared.Services;


    public class CreateVoucherDto
    {
        public string ClientName { get; set; } = "";
        public string ReferenceNumber { get; set; } = "";
        public string PackageCode { get; set; } = "";
        public string TourName { get; set; } = "";
        public decimal TotalPrice { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }
        public string Notes { get; set; } = "";
        public List<CreateVoucherHotelDto> HotelBookings { get; set; } = new();
        public List<CreateVoucherFlightDto> Flights { get; set; } = new();
    }

    public class CreateVoucherHotelDto
    {
        public string HotelNameSnapshot { get; set; } = "";
        public string CityNameSnapshot { get; set; } = "";
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NightsCount { get; set; }
        public string RoomType { get; set; } = "";
        public string BreakfastType { get; set; } = "";
        public int RoomCount { get; set; }
        public int StarRating { get; set; }
    }

    public class CreateVoucherFlightDto
    {
        public DateTime FlightDate { get; set; }
        public string FromLocation { get; set; } = "";
        public string ToLocation { get; set; } = "";
        public int TravelersCount { get; set; }
        public int WeightPerPerson { get; set; }
    }

    public class VoucherResponseDto
    {
        public int Id { get; set; }
        public string ReferenceNumber { get; set; } = "";
        public string Status { get; set; } = "";
    }

    public class ExtractedVoucherDto
    {
        public string? ClientName { get; set; }
        public string? Destination { get; set; }
        public int? Nights { get; set; }
        public decimal? TotalPrice { get; set; }
        public List<ExtractedHotelDto>? Hotels { get; set; }
        public List<ExtractedFlightDto>? Flights { get; set; }
        public string? Notes { get; set; }
    }

    public class ExtractedHotelDto
    {
        public string? HotelName { get; set; }
        public string? CityName { get; set; }
        public int? Nights { get; set; }
        public string? RoomType { get; set; }
        public string? BreakfastType { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
    }

    public class ExtractedFlightDto
    {
        public string? FromLocation { get; set; }
        public string? ToLocation { get; set; }
        public DateTime? FlightDate { get; set; }
        public string? FlightNumber { get; set; }
        public int? TravelersCount { get; set; }
    }

    

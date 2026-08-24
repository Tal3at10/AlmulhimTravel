namespace Core.Application.Abstraction.DTOs.Aviation
{
    public class SeatDto
    {
        public Guid Id { get; set; }
        public string SeatNumber { get; set; } = string.Empty;
        public string SeatClass { get; set; } = string.Empty; // Economy, Business
        public bool IsAvailable { get; set; }
        public bool IsWindowSeat { get; set; }
        public bool IsAisleSeat { get; set; }
        public decimal ExtraCharge { get; set; }
    }

    public class SeatMapDto
    {
        public Guid FlightId { get; set; }
        public string FlightNumber { get; set; } = string.Empty;
        public List<SeatRowDto> Rows { get; set; } = new();
    }

    public class SeatRowDto
    {
        public int RowNumber { get; set; }
        public List<SeatDto> Seats { get; set; } = new();
    }
}

using System.Collections.Generic;

namespace Core.Application.Services.WhatsApp.Models
{
    public class PackageParameters
    {
        public string Destination { get; set; } = "";
        public string CheckIn { get; set; } = "";
        public int DurationDays { get; set; } = 0;
        public int Adults { get; set; } = 2;
        public int Children { get; set; } = 0;
        public decimal MaxBudget { get; set; } = 0;
        public List<string> MissingFields { get; set; } = new();
        // Enhanced summary fields (optional - null if not provided by AI)
        public bool? FlightBooked { get; set; }
        public string? HotelPreference { get; set; }
        public string? SpecialNotes { get; set; }
    }

    public class AISupervisorResult
    {
        public string Action { get; set; } = "";
        public string Response { get; set; } = "";
        public string Destination { get; set; } = "";
        public string NextState { get; set; } = "";
        public PackageParameters? Parameters { get; set; }
    }
}

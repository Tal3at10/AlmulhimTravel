using System.Text.Json;

namespace APIs.Models
{
    /// <summary>
    /// Detailed error information for debugging and logging
    /// </summary>
    public class ErrorDetails
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Details { get; set; }
        public string? TraceId { get; set; }
        public string? Path { get; set; }
        public DateTime Timestamp { get; set; }
        public Dictionary<string, string[]>? ValidationErrors { get; set; }

        public ErrorDetails()
        {
            Timestamp = DateTime.UtcNow;
        }

        public override string ToString()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            });
        }
    }
}

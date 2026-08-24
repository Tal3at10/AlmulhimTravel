namespace APIs.Models
{
    /// <summary>
    /// Unified API Response wrapper for consistent response structure
    /// </summary>
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Message { get; set; }
        public List<string>? Errors { get; set; }
        public DateTime Timestamp { get; set; }
        public string? TraceId { get; set; }

        public ApiResponse()
        {
            Timestamp = DateTime.UtcNow;
        }

        public static ApiResponse<T> SuccessResponse(T data, string? message = null)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Data = data,
                Message = message
            };
        }

        public static ApiResponse<T> ErrorResponse(string error, string? traceId = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Errors = new List<string> { error },
                TraceId = traceId
            };
        }

        public static ApiResponse<T> ErrorResponse(List<string> errors, string? traceId = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Errors = errors,
                TraceId = traceId
            };
        }
    }

    /// <summary>
    /// Non-generic API Response for operations without data
    /// </summary>
    public class ApiResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public List<string>? Errors { get; set; }
        public DateTime Timestamp { get; set; }
        public string? TraceId { get; set; }

        public ApiResponse()
        {
            Timestamp = DateTime.UtcNow;
        }

        public static ApiResponse SuccessResponse(string? message = null)
        {
            return new ApiResponse
            {
                Success = true,
                Message = message
            };
        }

        public static ApiResponse ErrorResponse(string error, string? traceId = null)
        {
            return new ApiResponse
            {
                Success = false,
                Errors = new List<string> { error },
                TraceId = traceId
            };
        }

        public static ApiResponse ErrorResponse(List<string> errors, string? traceId = null)
        {
            return new ApiResponse
            {
                Success = false,
                Errors = errors,
                TraceId = traceId
            };
        }
    }
}

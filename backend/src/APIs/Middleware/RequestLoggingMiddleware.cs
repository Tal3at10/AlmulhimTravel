using System.Diagnostics;

namespace APIs.Middleware
{
    /// <summary>
    /// Middleware to log HTTP requests and responses
    /// Tracks request duration and logs important information
    /// </summary>
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestLoggingMiddleware> _logger;

        public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();
            var requestPath = context.Request.Path;
            var requestMethod = context.Request.Method;
            var traceId = context.TraceIdentifier;

            try
            {
                _logger.LogInformation(
                    "HTTP {Method} {Path} started - TraceId: {TraceId}",
                    requestMethod,
                    requestPath,
                    traceId
                );

                await _next(context);

                stopwatch.Stop();

                var statusCode = context.Response.StatusCode;
                var logLevel = statusCode >= 500 ? LogLevel.Error :
                              statusCode >= 400 ? LogLevel.Warning :
                              LogLevel.Information;

                _logger.Log(
                    logLevel,
                    "HTTP {Method} {Path} responded {StatusCode} in {ElapsedMs}ms - TraceId: {TraceId}",
                    requestMethod,
                    requestPath,
                    statusCode,
                    stopwatch.ElapsedMilliseconds,
                    traceId
                );
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                _logger.LogError(
                    ex,
                    "HTTP {Method} {Path} failed after {ElapsedMs}ms - TraceId: {TraceId}",
                    requestMethod,
                    requestPath,
                    stopwatch.ElapsedMilliseconds,
                    traceId
                );
                throw;
            }
        }
    }

    public static class RequestLoggingMiddlewareExtensions
    {
        public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder app)
        {
            return app.UseMiddleware<RequestLoggingMiddleware>();
        }
    }
}

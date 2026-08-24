using System.Net;
using System.Text.Json;
using APIs.Models;
using Core.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace APIs.Middleware
{
    /// <summary>
    /// Global Exception Handling Middleware
    /// Catches all unhandled exceptions and returns consistent error responses
    /// </summary>
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;
        private readonly IHostEnvironment _environment;

        public GlobalExceptionMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionMiddleware> logger,
            IHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            var traceId = context.TraceIdentifier;
            var path = context.Request.Path;

            var errorDetails = new ErrorDetails
            {
                TraceId = traceId,
                Path = path,
                Timestamp = DateTime.UtcNow
            };

            // Handle different exception types
            switch (exception)
            {
                // Domain Exceptions
                case EntityNotFoundException notFoundEx:
                    errorDetails.StatusCode = (int)HttpStatusCode.NotFound;
                    errorDetails.Message = notFoundEx.Message;
                    errorDetails.Details = _environment.IsDevelopment() ? notFoundEx.StackTrace : null;
                    break;

                case ValidationException validationEx:
                    errorDetails.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorDetails.Message = "Validation failed";
                    errorDetails.Details = _environment.IsDevelopment() ? validationEx.Message : null;
                    errorDetails.ValidationErrors = validationEx.Errors;
                    break;

                case DuplicateEntityException duplicateEx:
                    errorDetails.StatusCode = (int)HttpStatusCode.Conflict;
                    errorDetails.Message = duplicateEx.Message;
                    errorDetails.Details = _environment.IsDevelopment() ? duplicateEx.StackTrace : null;
                    break;

                case BusinessRuleViolationException businessEx:
                    errorDetails.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorDetails.Message = businessEx.Message;
                    errorDetails.Details = _environment.IsDevelopment() ? businessEx.StackTrace : null;
                    break;

                case InsufficientResourceException resourceEx:
                    errorDetails.StatusCode = (int)HttpStatusCode.Conflict;
                    errorDetails.Message = resourceEx.Message;
                    errorDetails.Details = _environment.IsDevelopment() ? resourceEx.StackTrace : null;
                    break;

                // Framework Exceptions
                case UnauthorizedAccessException:
                    errorDetails.StatusCode = (int)HttpStatusCode.Unauthorized;
                    errorDetails.Message = "Unauthorized access";
                    errorDetails.Details = _environment.IsDevelopment() ? exception.Message : null;
                    break;

                case KeyNotFoundException:
                    errorDetails.StatusCode = (int)HttpStatusCode.NotFound;
                    errorDetails.Message = "Resource not found";
                    errorDetails.Details = _environment.IsDevelopment() ? exception.Message : null;
                    break;

                case ArgumentNullException:
                case ArgumentException:
                    errorDetails.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorDetails.Message = "Invalid request parameters";
                    errorDetails.Details = _environment.IsDevelopment() ? exception.Message : null;
                    break;

                case InvalidOperationException:
                    errorDetails.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorDetails.Message = "Invalid operation";
                    errorDetails.Details = _environment.IsDevelopment() ? exception.Message : null;
                    break;

                case DbUpdateException dbEx:
                    errorDetails.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorDetails.Message = "Database operation failed";
                    errorDetails.Details = _environment.IsDevelopment() ? dbEx.InnerException?.Message ?? dbEx.Message : null;
                    _logger.LogError(dbEx, "Database error occurred");
                    break;

                case TimeoutException:
                    errorDetails.StatusCode = (int)HttpStatusCode.RequestTimeout;
                    errorDetails.Message = "Request timeout";
                    errorDetails.Details = _environment.IsDevelopment() ? exception.Message : null;
                    break;

                case OperationCanceledException:
                    errorDetails.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorDetails.Message = "Operation was cancelled";
                    errorDetails.Details = _environment.IsDevelopment() ? exception.Message : null;
                    break;

                default:
                    errorDetails.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorDetails.Message = "An internal server error occurred";
                    errorDetails.Details = _environment.IsDevelopment() ? exception.Message : "Please contact support if the problem persists";
                    
                    // Log full stack trace for unexpected errors
                    _logger.LogError(exception, "Unexpected error: {Message}\nStackTrace: {StackTrace}", 
                        exception.Message, exception.StackTrace);
                    break;
            }

            context.Response.StatusCode = errorDetails.StatusCode;

            // Create consistent error response
            var response = new
            {
                success = false,
                message = errorDetails.Message,
                errors = new[] { errorDetails.Message },
                details = errorDetails.Details,
                validationErrors = errorDetails.ValidationErrors,
                traceId = errorDetails.TraceId,
                path = errorDetails.Path,
                timestamp = errorDetails.Timestamp
            };

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = _environment.IsDevelopment()
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
        }
    }

    /// <summary>
    /// Extension method to register the middleware
    /// </summary>
    public static class GlobalExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
        {
            return app.UseMiddleware<GlobalExceptionMiddleware>();
        }
    }
}

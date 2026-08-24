using System.Net;
using System.Text.Json;
using APIs.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Middleware
{
    /// <summary>
    /// Middleware to handle Model Validation errors
    /// Converts ModelState errors to consistent error response
    /// </summary>
    public class ValidationExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ValidationExceptionMiddleware> _logger;

        public ValidationExceptionMiddleware(RequestDelegate next, ILogger<ValidationExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            await _next(context);

            // Check if response is a validation problem
            if (context.Response.StatusCode == (int)HttpStatusCode.BadRequest)
            {
                var endpoint = context.GetEndpoint();
                if (endpoint != null)
                {
                    // Response already written, skip
                    return;
                }
            }
        }
    }

    /// <summary>
    /// Configure ModelState validation to return consistent error format
    /// </summary>
    public static class ValidationConfiguration
    {
        public static IServiceCollection ConfigureValidationErrors(this IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var errors = context.ModelState
                        .Where(e => e.Value?.Errors.Count > 0)
                        .SelectMany(e => e.Value!.Errors.Select(x => x.ErrorMessage))
                        .ToList();

                    var errorResponse = new
                    {
                        success = false,
                        message = "Validation failed",
                        errors = errors,
                        traceId = context.HttpContext.TraceIdentifier,
                        timestamp = DateTime.UtcNow
                    };

                    return new BadRequestObjectResult(errorResponse);
                };
            });

            return services;
        }
    }
}

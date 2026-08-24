using Core.Application;
using Infrastructure.Persistence;
using Infrastructure.Shared;
using Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using APIs.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.FileProviders;
using System.Text;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Microsoft.Extensions.Caching.Memory;
var builder = WebApplication.CreateBuilder(args);

// Enforce TLS 1.2 and TLS 1.3 for PCI-DSS compliance
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ConfigureHttpsDefaults(listenOptions =>
    {
        listenOptions.SslProtocols = System.Security.Authentication.SslProtocols.Tls12 | System.Security.Authentication.SslProtocols.Tls13;
    });
});

// Add environment variables to configuration (highest priority)
builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddMemoryCache(); // Required for message debouncing logic
builder.Services.AddResponseCaching(); // Required for high performance endpoints

// Add FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

// Configure Model Validation Errors
builder.Services.ConfigureValidationErrors();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token."
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add Application Services (AutoMapper, Services)
builder.Services.AddApplicationServices();

// Add HttpContextAccessor and CurrentUserService
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<Core.Application.Abstraction.Interfaces.ICurrentUserService, APIs.Services.CurrentUserService>();

// Add Shared Services (JWT Token Service)
builder.Services.AddSharedServices(builder.Configuration);

// Add Persistence Services (DbContext, UnitOfWork, Repositories)
builder.Services.AddPersistenceServices(builder.Configuration);

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured. Set it via environment variable: JwtSettings__SecretKey");

// Validate JWT secret key strength
if (string.IsNullOrWhiteSpace(secretKey) || secretKey.Length < 32)
{
    throw new InvalidOperationException(
        $"JWT SecretKey must be at least 32 characters long. Current length: {secretKey?.Length ?? 0}. " +
        "Set a secure key via environment variable: JwtSettings__SecretKey");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Append("Token-Expired", "true");
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = async context =>
        {
            // Validate SecurityStamp to invalidate tokens after password change
            var userIdClaim = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            var securityStampClaim = context.Principal?.FindFirst("SecurityStamp");
            
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                // If token has no SecurityStamp claim (old token), reject it
                if (securityStampClaim == null || string.IsNullOrEmpty(securityStampClaim.Value))
                {
                    context.Fail("Token is outdated - please login again");
                    return;
                }

                var cache = context.HttpContext.RequestServices.GetRequiredService<Microsoft.Extensions.Caching.Memory.IMemoryCache>();
                var cacheKey = $"UserSecurityStamp_{userId}";
                
                if (!cache.TryGetValue(cacheKey, out string? dbSecurityStamp))
                {
                    var dbContext = context.HttpContext.RequestServices.GetRequiredService<Infrastructure.Persistence.Data.AlmulhemDbContext>();
                    var user = await dbContext.Users.FindAsync(userId);
                    
                    // If user not found, reject token
                    if (user == null)
                    {
                        context.Fail("User not found");
                        return;
                    }
                    
                    dbSecurityStamp = user.SecurityStamp;
                    
                    // Cache for 5 minutes
                    cache.Set(cacheKey, dbSecurityStamp, TimeSpan.FromMinutes(5));
                }
                
                // If SecurityStamp doesn't match, reject token (password changed)
                if (dbSecurityStamp != securityStampClaim.Value)
                {
                    context.Fail("Token has been revoked - password was changed");
                    return;
                }
            }
        }
    };
});

builder.Services.AddAuthorization();

// Add Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("AuthLimiter", opt =>
    {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0;
    });
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// Add CORS - reads allowed origins from configuration (appsettings.json / environment variables)
var allowedOrigins = builder.Configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>() 
    ?? Array.Empty<string>();

if (allowedOrigins.Length == 0)
{
    throw new InvalidOperationException(
        "No CORS origins configured. Set CorsSettings:AllowedOrigins in appsettings.json or via environment variables.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()
              .WithExposedHeaders("Token-Expired");
    });
});

// Add Health Checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AlmulhemDbContext>("database");

// Add API Response Compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});
builder.Services.AddHostedService<APIs.BackgroundServices.FollowupBackgroundService>();
// builder.Services.AddHostedService<APIs.BackgroundServices.SocialMediaScraperBackgroundService>(); // Disabled as requested

var app = builder.Build();

// PCI-DSS / Security Headers Middleware
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    await next();
});

// Log AI configuration on startup
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    var config = app.Services.GetRequiredService<IConfiguration>();
    
    logger.LogInformation("=== AI Configuration Check ===");
    logger.LogInformation("Groq API Key: {HasKey}", !string.IsNullOrEmpty(config["AiSettings:GroqApiKey"]) ? "Configured" : "MISSING");
    logger.LogInformation("Gemini API Key: {HasKey}", !string.IsNullOrEmpty(config["AiSettings:GeminiApiKey"]) ? "Configured" : "MISSING");
    logger.LogInformation("OpenRouter API Key: {HasKey}", !string.IsNullOrEmpty(config["AiSettings:OpenRouterApiKey"]) ? "Configured" : "MISSING");
    logger.LogInformation("HuggingFace API Key: {HasKey}", !string.IsNullOrEmpty(config["AiSettings:HuggingFaceApiKey"]) ? "Configured" : "MISSING");
    logger.LogInformation("==============================");
    
    // Initialize FileLogger
    Infrastructure.Shared.Services.FileLogger.Log("Application started - AI services initialized");
}

// Populate InMemory Vector DB for RAG on startup
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        logger.LogInformation("Starting RAG Vector DB Sync on startup...");
        var ragService = scope.ServiceProvider.GetRequiredService<Core.Application.Abstraction.Services.IRagDataIngestionService>();
        await ragService.SyncPackagesKnowledgeAsync();
        logger.LogInformation("RAG Vector DB Sync completed successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to sync RAG Vector DB on startup.");
    }
}

// Auto-migrate database on startup
// Safely applies only pending migrations (idempotent - won't re-apply existing ones)
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<AlmulhemDbContext>();
    var logger = services.GetRequiredService<ILogger<Program>>();
    
    try
    {
        var pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync();
        if (pendingMigrations.Any())
        {
            logger.LogInformation("Applying {Count} pending migrations...", pendingMigrations.Count());
            await dbContext.Database.MigrateAsync();
            logger.LogInformation("Database migrated successfully.");
        }
        else
        {
            logger.LogInformation("Database is up to date.");
        }

        // Seed database with initial data
        await AlmulhemSeeder.SeedAsync(dbContext, logger);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}

// Configure the HTTP request pipeline.

// Global Exception Handler (MUST be first)
app.UseGlobalExceptionHandler();

// Request Logging
app.UseRequestLogging();

// Enable Swagger in Development ONLY (security: don't expose API surface in production)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Security Headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    // Allow React/Vite apps to work properly (inline scripts, eval for dev, fonts, images)
    context.Response.Headers.Append("Content-Security-Policy", 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://assets.duffel.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.duffel.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https: http:; " +
        "connect-src 'self' https: http:; " +
        "media-src 'self' blob: data: https://res.cloudinary.com https://cdn.pixabay.com https://almulhimtravel.com https://*.almulhimtravel.com; " +
        "frame-src 'self' https://player.cloudinary.com https://maps.google.com https://www.google.com https://js.stripe.com;");
    await next();
});

// Use CORS - reads allowed origins from configuration
app.UseCors("AllowFrontend");

// Enable Rate Limiting
app.UseRateLimiter();

// Add Response Caching Middleware
app.UseResponseCaching();

// Response Compression (MUST be before static files)
app.UseResponseCompression();

// SEO: Dynamic Meta Tag Injection for SPA pages
// Intercepts index.html responses and injects page-specific meta tags (title, description,
// canonical, OG tags, JSON-LD) by querying the database based on the request path.
// This makes every page fully crawlable by search engines without requiring SSR/Next.js.
app.UseSeoMetaInjection();

// Serve Frontend static files (React build output in wwwroot/)
app.UseDefaultFiles(); // Serves index.html as default
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Cache static files for 30 days to improve Lighthouse "Use efficient cache lifetimes"
        ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=2592000");
    }
});  // Serves CSS, JS, images from wwwroot/

// Explicit admin file serving - bypasses UseStaticFiles which has issues on this host
var adminWebRoot = Path.Combine(app.Environment.WebRootPath, "admin");
app.MapGet("/admin/assets/{fileName}", (string fileName) =>
{
    var filePath = Path.Combine(adminWebRoot, "assets", fileName);
    if (!File.Exists(filePath)) return Results.NotFound();
    
    var contentType = Path.GetExtension(fileName).ToLowerInvariant() switch
    {
        ".js" => "application/javascript",
        ".css" => "text/css",
        ".svg" => "image/svg+xml",
        ".png" => "image/png",
        ".jpg" or ".jpeg" => "image/jpeg",
        ".gif" => "image/gif",
        ".woff" => "font/woff",
        ".woff2" => "font/woff2",
        ".ttf" => "font/ttf",
        ".json" => "application/json",
        ".map" => "application/json",
        _ => "application/octet-stream"
    };
    
    return Results.File(filePath, contentType);
});

app.MapGet("/admin/favicon.svg", () =>
{
    var filePath = Path.Combine(adminWebRoot, "favicon.svg");
    if (!File.Exists(filePath)) return Results.NotFound();
    return Results.File(filePath, "image/svg+xml");
});


// Authentication & Authorization (MUST be before MapControllers)
app.UseAuthentication();
app.UseAuthorization();

// Health Check endpoint
app.MapHealthChecks("/health");

app.MapControllers();

// Admin SPA Fallback: Any /admin route that doesn't match an API route or static file → serve admin index.html
// Skip static file extensions to prevent serving HTML instead of JS/CSS
app.MapFallback("admin/{**slug}", context =>
{
    // Don't serve HTML fallback for static asset requests
    var path = context.Request.Path.Value ?? "";
    var staticExtensions = new[] { ".js", ".css", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".json", ".woff", ".woff2", ".ttf", ".eot", ".map" };
    if (staticExtensions.Any(ext => path.EndsWith(ext, StringComparison.OrdinalIgnoreCase)))
    {
        context.Response.StatusCode = 404;
        return Task.CompletedTask;
    }
    
    context.Response.ContentType = "text/html";
    return context.Response.SendFileAsync(
        Path.Combine(app.Environment.WebRootPath, "admin", "index.html"));
});

// SPA Fallback: Any request that doesn't match an API route or static file → serve index.html
// This handles React Router client-side routing (e.g., /about, /hotels, /flights)
app.MapFallbackToFile("index.html");

app.Run();

// For Integration Testing
public partial class Program { }


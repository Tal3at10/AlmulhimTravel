using Core.Application.Abstraction.Services;
using Core.Application.Abstraction.Services.Identity;
using Core.Application.Abstraction.Services.Reservations;
using Core.Application.Abstraction.Services.Aviation;
using Core.Application.Abstraction.Services.Payments;
using Infrastructure.Shared.Services;
using Infrastructure.Shared.Services.Payments;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using Polly;
using Polly.Extensions.Http;

namespace Infrastructure.Shared
{
    public static class DependencyInjection
    {
        private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .OrResult(msg => msg.StatusCode == System.Net.HttpStatusCode.NotFound)
                .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
        }

        private static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30));
        }

        public static IServiceCollection AddSharedServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDistributedSqlServerCache(options =>
            {
                options.ConnectionString = configuration.GetConnectionString("DefaultConnection") ?? configuration.GetConnectionString("AlmulhimDb");
                options.SchemaName = "dbo";
                options.TableName = "CacheStore";
            });

            // Initialize EncryptionHelper
            var encryptionKey = configuration["EncryptionSettings:Key"];
            if (string.IsNullOrEmpty(encryptionKey))
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                if (env == "Production")
                {
                    throw new InvalidOperationException("EncryptionSettings:Key is missing but required in Production environment!");
                }
                encryptionKey = "AlMulhimTravelSecureKey2026!Pass";
            }
            Core.Domain.Helpers.EncryptionHelper.Initialize(encryptionKey);
            // Configure JWT Settings
            services.Configure<JwtSettings>(options =>
            {
                var jwtSection = configuration.GetSection("JwtSettings");
                options.SecretKey = jwtSection["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is required");
                options.Issuer = jwtSection["Issuer"] ?? throw new InvalidOperationException("JWT Issuer is required");
                options.Audience = jwtSection["Audience"] ?? throw new InvalidOperationException("JWT Audience is required");
                options.ExpirationInDays = int.Parse(jwtSection["ExpirationInDays"] ?? "7");
                options.RefreshTokenExpirationInDays = int.Parse(jwtSection["RefreshTokenExpirationInDays"] ?? "30");
            });

            // Configure Amadeus Settings
            services.Configure<AmadeusSettings>(configuration.GetSection("AmadeusSettings"));

            // Configure Hotelbeds Settings
            services.Configure<HotelbedsSettings>(configuration.GetSection("Hotelbeds"));

            // Configure Duffel Settings
            services.Configure<DuffelSettings>(configuration.GetSection("DuffelSettings"));

            // Configure RapidAPI Settings
            services.Configure<RapidApiSettings>(configuration.GetSection("RapidApiSettings"));

            // Configure TBO Settings
            services.Configure<TboSettings>(configuration.GetSection("TboSettings"));

            // Configure Sabre Settings
            services.Configure<SabreSettings>(configuration.GetSection("SabreSettings"));

            // Configure Moyasar Settings
            services.Configure<MoyasarSettings>(configuration.GetSection("Moyasar"));

            // Configure Tabby & Tamara Settings
            services.Configure<TabbySettings>(configuration.GetSection("Tabby"));
            services.Configure<TamaraSettings>(configuration.GetSection("Tamara"));

            // Configure Payment General Settings
            services.Configure<PaymentSettings>(configuration.GetSection("Payment"));

            // Register HttpClient for Amadeus
            services.AddHttpClient("Amadeus", client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            // Register HttpClient for RapidAPI
            services.AddHttpClient("RapidApi", client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            // Register JWT Token Service
            services.AddScoped<IJwtTokenService, JwtTokenService>();

            // Register Password Hasher
            services.AddScoped<IPasswordHasher, PasswordHasher>();

            // Register Amadeus Service
            services.AddScoped<IAmadeusService, AmadeusService>();

            // Register Hotel Providers
            services.AddHttpClient("RateHawk", client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            services.AddHttpClient("Hotelbeds", client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            services.AddHttpClient("DuffelStays", client =>
            {
                client.Timeout = TimeSpan.FromSeconds(130);
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            services.AddHttpClient("TboHotels", client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            services.AddHttpClient("TboFlights", client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            services.AddHttpClient("Sabre", client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            services.AddScoped<IHotelProvider, RateHawkService>();
            services.AddScoped<IHotelProvider, HotelbedsService>();
            services.AddScoped<IHotelProvider, DuffelStaysService>();
            services.AddScoped<IHotelProvider, TboHotelService>();
            services.AddScoped<IHotelProvider, MockHotelProvider>();
            
            services.AddScoped<IFlightProvider, TboFlightService>();
            services.AddScoped<IFlightProvider, SabreFlightService>();
            services.AddScoped<IHotelAggregatorService, HotelAggregatorService>();
            services.AddScoped<IFlightAggregatorService, FlightAggregatorService>();

            // Register Duffel Service
            services.AddScoped<IDuffelService, DuffelService>();

            // Register RapidAPI Hotel Service
            services.AddScoped<IRapidApiHotelService, RapidApiHotelService>();

            // Register Hotel Comparison Service (Trivago-style price comparison)
            services.AddScoped<IHotelComparisonService, HotelComparisonService>();
            services.AddScoped<IAiService, AiOrchestratorService>();
            services.AddScoped<ILocationsService, LocationsService>();
            services.AddScoped<IEmailService, SendGridEmailService>();

            // Register AI Services (individual providers)
            services.AddHttpClient<GroqAiService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(15);
            });
            services.AddHttpClient<Gpt4oMiniAiService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(15);
            });
            services.AddHttpClient<OpenRouterAiService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(15);
            });
            services.AddHttpClient<CerebrasAiService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(15);
            });
            services.AddHttpClient<GeminiAiService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(20);
            });
            services.AddHttpClient<HuggingFaceAiService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(15);
            });

            // Register AI Orchestrator (Fallback Chain)
            services.AddScoped<IAiService, AiOrchestratorService>();

            // Register RAG Services
            services.AddHttpClient<IEmbeddingService, OpenRouterEmbeddingService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
            });
            services.AddSingleton<IVectorDbService, InMemoryVectorDbService>();

            // Register WhatsApp Provider
            services.AddHttpClient<IWhatsAppProvider, FreshchatWhatsAppProvider>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
            });

            // Register VoucherPro Settings & Typed HttpClient
            services.Configure<VoucherProSettings>(configuration.GetSection("VoucherProSettings"));
            services.AddHttpClient<IVoucherProIntegrationService, VoucherProIntegrationService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
            });

            // Register Moyasar Payment Service
            services.AddHttpClient<IPaymentGateway, MoyasarPaymentService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
            });

            services.AddHttpClient<TabbyPaymentService>();
            services.AddScoped<IBnplPaymentGateway, TabbyPaymentService>();

            services.AddHttpClient<TamaraPaymentService>();
            services.AddScoped<IBnplPaymentGateway, TamaraPaymentService>();

            // Register Background Services conditionally to avoid affecting real users during local testing
            if (configuration.GetValue<bool>("EnableBackgroundServices", true))
            {
                services.AddHostedService<PendingBookingsCleanupService>();
                // services.AddHostedService<WhatsAppRetargetingService>(); // EMERGENCY STOP: Prevent mass messages on restart
                services.AddHostedService<PostSaleFollowUpService>();
            }

            return services;
        }
    }
}

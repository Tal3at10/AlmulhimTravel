using Core.Application.Abstraction.Services;
using Core.Application.Services.ServiceManager;
using Core.Application.Services.WhatsApp;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Core.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Register AutoMapper
            services.AddAutoMapper(typeof(DependencyInjection).Assembly);

            // Register Service Manager (Lazy initialization of all services)
            services.AddScoped<IServiceManager, ServiceManager>();

            // Register FluentValidation Validators
            services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

            // Register WhatsApp Agent Service
            services.AddScoped<WhatsAppAgentService>();
            services.AddScoped<WhatsAppIntentClassifier>();
            services.AddScoped<IRagDataIngestionService, RagDataIngestionService>();

            return services;
        }
    }
}

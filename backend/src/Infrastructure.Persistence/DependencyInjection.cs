using Core.Application.Abstraction.Interfaces;
using Infrastructure.Persistence.Data;
using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Persistence
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Register Interceptor
            services.AddScoped<Infrastructure.Persistence.Interceptors.AuditInterceptor>();

            // Register DbContext
            services.AddDbContext<AlmulhemDbContext>((sp, options) =>
            {
                var auditInterceptor = sp.GetRequiredService<Infrastructure.Persistence.Interceptors.AuditInterceptor>();
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
                       .AddInterceptors(auditInterceptor);
            });

            // Register Unit of Work
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Register Generic Repository (optional - if you want to use it directly)
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

            return services;
        }
    }
}

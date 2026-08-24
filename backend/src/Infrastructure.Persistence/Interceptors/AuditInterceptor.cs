using Core.Domain.Entities.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.Interfaces;

namespace Infrastructure.Persistence.Interceptors
{
    public class AuditInterceptor : SaveChangesInterceptor
    {
        private readonly ICurrentUserService _currentUserService;

        public AuditInterceptor(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            if (eventData.Context != null)
            {
                AddAuditLogs(eventData.Context);
            }
            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            if (eventData.Context != null)
            {
                AddAuditLogs(eventData.Context);
            }
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private void AddAuditLogs(DbContext context)
        {
            context.ChangeTracker.DetectChanges();

            var auditEntries = new List<AuditLog>();

            // Get current user id
            var userId = _currentUserService.UserId ?? "System";

            foreach (var entry in context.ChangeTracker.Entries())
            {
                if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                {
                    continue;
                }

                var entityName = entry.Metadata.Name;
                var primaryKey = GetPrimaryKeyValue(entry);

                var auditLog = new AuditLog
                {
                    UserId = userId,
                    EntityName = entityName,
                    EntityId = primaryKey,
                    Action = entry.State.ToString(),
                    Timestamp = DateTime.UtcNow
                };

                var oldValues = new Dictionary<string, object>();
                var newValues = new Dictionary<string, object>();

                foreach (var property in entry.Properties)
                {
                    if (property.IsTemporary) continue;

                    string propertyName = property.Metadata.Name;

                    switch (entry.State)
                    {
                        case EntityState.Added:
                            newValues[propertyName] = property.CurrentValue!;
                            break;

                        case EntityState.Deleted:
                            oldValues[propertyName] = property.OriginalValue!;
                            break;

                        case EntityState.Modified:
                            if (property.IsModified)
                            {
                                oldValues[propertyName] = property.OriginalValue!;
                                newValues[propertyName] = property.CurrentValue!;
                            }
                            break;
                    }
                }

                if (oldValues.Count > 0) auditLog.OldValues = JsonSerializer.Serialize(oldValues);
                if (newValues.Count > 0) auditLog.NewValues = JsonSerializer.Serialize(newValues);

                auditEntries.Add(auditLog);
            }

            foreach (var auditEntry in auditEntries)
            {
                context.Set<AuditLog>().Add(auditEntry);
            }
        }

        private string GetPrimaryKeyValue(EntityEntry entry)
        {
            var keyName = entry.Metadata.FindPrimaryKey()?.Properties.Select(x => x.Name).SingleOrDefault();
            if (keyName != null)
            {
                return entry.Property(keyName).CurrentValue?.ToString() ?? "Unknown";
            }
            return "Unknown";
        }
    }
}

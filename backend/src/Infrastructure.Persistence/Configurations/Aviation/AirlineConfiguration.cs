using Core.Domain.Entities.Aviation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class AirlineConfiguration : IEntityTypeConfiguration<Airline>
    {
        public void Configure(EntityTypeBuilder<Airline> builder)
        {
            builder.ToTable("Airlines");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Code)
                .IsRequired()
                .HasMaxLength(10);

            builder.HasIndex(a => a.Code)
                .IsUnique();

            builder.Property(a => a.NameAr)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(a => a.NameEn)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(a => a.LogoUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(a => a.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            // Relationships
            builder.HasMany(a => a.Flights)
                .WithOne(f => f.Airline)
                .HasForeignKey(f => f.AirlineId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

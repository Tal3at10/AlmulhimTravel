using Core.Domain.Entities.Aviation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class AirportConfiguration : IEntityTypeConfiguration<Airport>
    {
        public void Configure(EntityTypeBuilder<Airport> builder)
        {
            builder.ToTable("Airports");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Code)
                .IsRequired()
                .HasMaxLength(10);

            builder.HasIndex(a => a.Code)
                .IsUnique();

            builder.Property(a => a.NameAr)
                .IsRequired()
                .HasMaxLength(300);

            builder.Property(a => a.NameEn)
                .IsRequired()
                .HasMaxLength(300);

            builder.Property(a => a.CityAr)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(a => a.CityEn)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(a => a.Country)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.HasIndex(a => new { a.CityEn, a.Country });

            // Relationships
            builder.HasMany(a => a.DepartureFlights)
                .WithOne(f => f.DepartureAirport)
                .HasForeignKey(f => f.DepartureAirportId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(a => a.ArrivalFlights)
                .WithOne(f => f.ArrivalAirport)
                .HasForeignKey(f => f.ArrivalAirportId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

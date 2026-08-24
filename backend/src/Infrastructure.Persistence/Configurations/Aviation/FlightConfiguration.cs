using Core.Domain.Entities.Aviation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class FlightConfiguration : IEntityTypeConfiguration<Flight>
    {
        public void Configure(EntityTypeBuilder<Flight> builder)
        {
            builder.ToTable("Flights");

            builder.HasKey(f => f.Id);

            builder.Property(f => f.FlightNumber)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasIndex(f => f.FlightNumber);

            builder.Property(f => f.AirlineId)
                .IsRequired();

            builder.HasIndex(f => f.AirlineId);

            builder.Property(f => f.DepartureAirportId)
                .IsRequired();

            builder.Property(f => f.ArrivalAirportId)
                .IsRequired();

            builder.HasIndex(f => new { f.DepartureAirportId, f.ArrivalAirportId });

            builder.Property(f => f.DepartureTime)
                .IsRequired();

            builder.Property(f => f.ArrivalTime)
                .IsRequired();

            builder.Property(f => f.Duration)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(f => f.DurationMinutes)
                .IsRequired();

            builder.Property(f => f.Stops)
                .IsRequired();

            builder.HasIndex(f => f.Stops);

            builder.Property(f => f.StopCity)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(f => f.EconomyPrice)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.HasIndex(f => f.EconomyPrice);

            builder.Property(f => f.EconomyOriginalPrice)
                .HasColumnType("decimal(18,2)");

            builder.Property(f => f.BusinessPrice)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(f => f.BusinessOriginalPrice)
                .HasColumnType("decimal(18,2)");

            builder.Property(f => f.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            // Relationships
            builder.HasMany(f => f.Schedules)
                .WithOne(fs => fs.Flight)
                .HasForeignKey(fs => fs.FlightId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

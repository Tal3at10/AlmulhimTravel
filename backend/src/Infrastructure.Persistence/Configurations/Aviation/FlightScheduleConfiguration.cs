using Core.Domain.Entities.Aviation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class FlightScheduleConfiguration : IEntityTypeConfiguration<FlightSchedule>
    {
        public void Configure(EntityTypeBuilder<FlightSchedule> builder)
        {
            builder.ToTable("FlightSchedules");

            builder.HasKey(fs => fs.Id);

            builder.Property(fs => fs.FlightId)
                .IsRequired();

            builder.Property(fs => fs.Date)
                .IsRequired();

            builder.HasIndex(fs => new { fs.FlightId, fs.Date, fs.IsActive });

            builder.Property(fs => fs.EconomySeatsAvailable)
                .IsRequired();

            builder.Property(fs => fs.BusinessSeatsAvailable)
                .IsRequired();

            builder.Property(fs => fs.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            // Relationships
            builder.HasMany(fs => fs.Seats)
                .WithOne(s => s.FlightSchedule)
                .HasForeignKey(s => s.FlightScheduleId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

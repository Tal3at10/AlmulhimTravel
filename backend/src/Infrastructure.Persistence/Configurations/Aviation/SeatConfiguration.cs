using Core.Domain.Entities.Aviation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class SeatConfiguration : IEntityTypeConfiguration<Seat>
    {
        public void Configure(EntityTypeBuilder<Seat> builder)
        {
            builder.ToTable("Seats");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.FlightScheduleId)
                .IsRequired();

            builder.Property(s => s.SeatNumber)
                .IsRequired()
                .HasMaxLength(10);

            builder.HasIndex(s => new { s.FlightScheduleId, s.SeatNumber })
                .IsUnique();

            builder.Property(s => s.Row)
                .IsRequired();

            builder.Property(s => s.Column)
                .IsRequired()
                .HasMaxLength(5);

            builder.Property(s => s.Class)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(s => s.ExtraPrice)
                .IsRequired()
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0);

            builder.Property(s => s.IsOccupied)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(s => s.IsWindow)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(s => s.IsAisle)
                .IsRequired()
                .HasDefaultValue(false);
        }
    }
}

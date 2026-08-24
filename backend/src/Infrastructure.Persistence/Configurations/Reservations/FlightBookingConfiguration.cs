using Core.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class FlightBookingConfiguration : IEntityTypeConfiguration<FlightBooking>
    {
        public void Configure(EntityTypeBuilder<FlightBooking> builder)
        {
            builder.ToTable("FlightBookings");

            builder.HasKey(fb => fb.Id);

            builder.Property(fb => fb.BookingId)
                .IsRequired();

            builder.Property(fb => fb.FlightScheduleId)
                .IsRequired();

            builder.Property(fb => fb.Class)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(fb => fb.DepartureDate)
                .IsRequired();

            builder.Property(fb => fb.ReturnDate)
                .IsRequired(false);

            // Relationships
            builder.HasOne(fb => fb.FlightSchedule)
                .WithMany()
                .HasForeignKey(fb => fb.FlightScheduleId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(fb => fb.Passengers)
                .WithOne(fp => fp.FlightBooking)
                .HasForeignKey(fp => fp.FlightBookingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

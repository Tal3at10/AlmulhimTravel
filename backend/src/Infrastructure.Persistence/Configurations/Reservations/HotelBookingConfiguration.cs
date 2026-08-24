using Core.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class HotelBookingConfiguration : IEntityTypeConfiguration<HotelBooking>
    {
        public void Configure(EntityTypeBuilder<HotelBooking> builder)
        {
            builder.ToTable("HotelBookings");

            builder.HasKey(hb => hb.Id);

            builder.Property(hb => hb.BookingId)
                .IsRequired();

            builder.Property(hb => hb.HotelId)
                .IsRequired();

            builder.Property(hb => hb.RoomId)
                .IsRequired();

            builder.Property(hb => hb.CheckInDate)
                .IsRequired();

            builder.Property(hb => hb.CheckOutDate)
                .IsRequired();

            builder.Property(hb => hb.Nights)
                .IsRequired();

            builder.Property(hb => hb.Guests)
                .IsRequired();

            builder.Property(hb => hb.RoomQuantity)
                .IsRequired()
                .HasDefaultValue(1);

            // Relationships
            builder.HasOne(hb => hb.Hotel)
                .WithMany()
                .HasForeignKey(hb => hb.HotelId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(hb => hb.Room)
                .WithMany()
                .HasForeignKey(hb => hb.RoomId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

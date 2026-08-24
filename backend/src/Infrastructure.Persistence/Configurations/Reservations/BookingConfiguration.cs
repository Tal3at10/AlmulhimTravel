using Core.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            builder.ToTable("Bookings");

            builder.HasKey(b => b.Id);

            builder.Property(b => b.ReferenceNumber)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasIndex(b => b.ReferenceNumber)
                .IsUnique();

            builder.Property(b => b.UserId)
                .IsRequired(false);

            builder.HasIndex(b => b.UserId);

            builder.Property(b => b.Type)
                .IsRequired();

            builder.Property(b => b.Status)
                .IsRequired();

            builder.HasIndex(b => b.Status);

            builder.Property(b => b.TotalAmount)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(b => b.TaxAmount)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(b => b.ServiceFee)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(b => b.Currency)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(b => b.CreatedAt)
                .IsRequired();

            builder.HasIndex(b => b.CreatedAt);

            builder.Property(b => b.ConfirmedAt)
                .IsRequired(false);

            builder.Property(b => b.CancelledAt)
                .IsRequired(false);

            builder.Property(b => b.RowVersion)
                .IsRowVersion();

            // Guest Info
            builder.Property(b => b.GuestFirstName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(b => b.GuestLastName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(b => b.GuestEmail)
                .IsRequired()
                .HasMaxLength(255);

            builder.HasIndex(b => b.GuestEmail);

            builder.Property(b => b.GuestPhone)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(b => b.GuestCountryCode)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(b => b.SpecialRequests)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(b => b.LateCheckIn)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(b => b.AirportTransfer)
                .IsRequired()
                .HasDefaultValue(false);

            // Relationships
            builder.HasOne(b => b.HotelBooking)
                .WithOne(hb => hb.Booking)
                .HasForeignKey<HotelBooking>(hb => hb.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(b => b.FlightBooking)
                .WithOne(fb => fb.Booking)
                .HasForeignKey<FlightBooking>(fb => fb.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(b => b.PackageBooking)
                .WithOne(pb => pb.Booking)
                .HasForeignKey<PackageBooking>(pb => pb.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(b => b.Payment)
                .WithOne(p => p.Booking)
                .HasForeignKey<Payment>(p => p.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

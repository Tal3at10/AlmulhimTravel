using Core.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PackageBookingConfiguration : IEntityTypeConfiguration<PackageBooking>
    {
        public void Configure(EntityTypeBuilder<PackageBooking> builder)
        {
            builder.ToTable("PackageBookings");

            builder.HasKey(pb => pb.Id);

            builder.Property(pb => pb.BookingId)
                .IsRequired();

            builder.Property(pb => pb.PackageId)
                .IsRequired();

            builder.Property(pb => pb.StartDate)
                .IsRequired();

            builder.Property(pb => pb.Adults)
                .IsRequired();

            builder.Property(pb => pb.Children)
                .IsRequired()
                .HasDefaultValue(0);

            // Relationships
            builder.HasOne(pb => pb.Package)
                .WithMany()
                .HasForeignKey(pb => pb.PackageId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

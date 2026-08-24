using Core.Domain.Entities.Reservations;
using Core.Domain.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class FlightPassengerConfiguration : IEntityTypeConfiguration<FlightPassenger>
    {
        public void Configure(EntityTypeBuilder<FlightPassenger> builder)
        {
            builder.ToTable("FlightPassengers");

            builder.HasKey(fp => fp.Id);

            builder.Property(fp => fp.FlightBookingId)
                .IsRequired();

            builder.Property(fp => fp.Title)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(fp => fp.FirstName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(fp => fp.LastName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(fp => fp.PassportNumber)
                .IsRequired()
                .HasMaxLength(200)
                .HasConversion(
                    v => EncryptionHelper.Encrypt(v),
                    v => EncryptionHelper.Decrypt(v)
                );

            builder.Property(fp => fp.Nationality)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(fp => fp.PassportExpiry)
                .IsRequired();

            builder.Property(fp => fp.DateOfBirth)
                .IsRequired();

            builder.Property(fp => fp.SeatNumber)
                .IsRequired()
                .HasMaxLength(10);

            builder.HasIndex(fp => fp.FlightBookingId);
        }
    }
}

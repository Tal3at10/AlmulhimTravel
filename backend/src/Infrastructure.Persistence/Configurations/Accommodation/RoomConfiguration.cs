using Core.Domain.Entities.Accommodation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.ToTable("Rooms");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.HotelId)
                .IsRequired();

            builder.Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(r => r.NameEn)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(r => r.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(r => r.MaxGuests)
                .IsRequired();

            builder.Property(r => r.BedType)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(r => r.Size)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(r => r.AvailableCount)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(r => r.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.HasIndex(r => r.HotelId);

            // Relationships
            builder.HasMany(r => r.Features)
                .WithOne(rf => rf.Room)
                .HasForeignKey(rf => rf.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.RatePlans)
                .WithOne(rp => rp.Room)
                .HasForeignKey(rp => rp.RoomId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

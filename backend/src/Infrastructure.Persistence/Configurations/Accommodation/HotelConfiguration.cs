using Core.Domain.Entities.Accommodation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class HotelConfiguration : IEntityTypeConfiguration<Hotel>
    {
        public void Configure(EntityTypeBuilder<Hotel> builder)
        {
            builder.ToTable("Hotels");

            builder.HasKey(h => h.Id);

            builder.Property(h => h.HotelId)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(h => h.HotelId)
                .IsUnique();

            builder.Property(h => h.Name)
                .IsRequired()
                .HasMaxLength(300);

            builder.Property(h => h.NameEn)
                .IsRequired()
                .HasMaxLength(300);

            builder.Property(h => h.Stars)
                .IsRequired();

            builder.HasIndex(h => h.Stars);

            builder.Property(h => h.Rating)
                .IsRequired()
                .HasColumnType("decimal(3,2)");

            builder.HasIndex(h => h.Rating);

            builder.Property(h => h.ReviewCount)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(h => h.RatingText)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(h => h.Address)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(h => h.Location)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(h => h.Distance)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(h => h.Description)
                .IsRequired()
                .HasMaxLength(3000);

            builder.Property(h => h.MainImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(h => h.DayImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(h => h.NightImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(h => h.Latitude)
                .HasColumnType("decimal(10,8)");

            builder.Property(h => h.Longitude)
                .HasColumnType("decimal(11,8)");

            builder.Property(h => h.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.HasIndex(h => h.IsActive)
                .HasFilter("IsActive = 1");

            builder.HasIndex(h => h.CityId);

            // Composite index for hotel search optimization (CityId, Stars, Rating, IsActive)
            // Note: EF Core doesn't support INCLUDE clause directly, but SQL Server will optimize this
            builder.HasIndex(h => new { h.CityId, h.Stars, h.Rating, h.IsActive });

            // Relationships
            builder.HasMany(h => h.Images)
                .WithOne(i => i.Hotel)
                .HasForeignKey(i => i.HotelId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(h => h.Amenities)
                .WithOne(ha => ha.Hotel)
                .HasForeignKey(ha => ha.HotelId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(h => h.Badges)
                .WithOne(b => b.Hotel)
                .HasForeignKey(b => b.HotelId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(h => h.Highlights)
                .WithOne(hl => hl.Hotel)
                .HasForeignKey(hl => hl.HotelId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(h => h.Rooms)
                .WithOne(r => r.Hotel)
                .HasForeignKey(r => r.HotelId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

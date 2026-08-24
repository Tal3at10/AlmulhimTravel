using Core.Domain.Entities.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PackageConfiguration : IEntityTypeConfiguration<Package>
    {
        public void Configure(EntityTypeBuilder<Package> builder)
        {
            builder.ToTable("Packages");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.PackageId)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(p => p.PackageId)
                .IsUnique();

            builder.Property(p => p.DestinationId)
                .IsRequired();

            builder.HasIndex(p => p.DestinationId);

            builder.Property(p => p.TitleAr)
                .IsRequired()
                .HasMaxLength(300);

            builder.Property(p => p.TitleEn)
                .HasMaxLength(300);

            builder.Property(p => p.Subtitle)
                .HasMaxLength(500);

            builder.Property(p => p.Price)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.HasIndex(p => p.Price);

            builder.Property(p => p.Currency)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(p => p.Duration)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.DurationDays)
                .IsRequired();

            builder.Property(p => p.DurationNights)
                .IsRequired();

            builder.Property(p => p.VideoUrl)
                .HasMaxLength(500);

            builder.Property(p => p.Vibe)
                .HasMaxLength(50);

            builder.Property(p => p.Rating)
                .IsRequired()
                .HasColumnType("decimal(3,2)");

            builder.HasIndex(p => p.Rating);

            builder.Property(p => p.IsOffer)
                .IsRequired()
                .HasDefaultValue(false);

            builder.HasIndex(p => p.IsOffer);

            builder.Property(p => p.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(p => p.CreatedAt)
                .IsRequired();

            // Relationships
            builder.HasMany(p => p.Itineraries)
                .WithOne(i => i.Package)
                .HasForeignKey(i => i.PackageId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(p => p.PackageHotels)
                .WithOne(ph => ph.Package)
                .HasForeignKey(ph => ph.PackageId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(p => p.Features)
                .WithOne(f => f.Package)
                .HasForeignKey(f => f.PackageId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

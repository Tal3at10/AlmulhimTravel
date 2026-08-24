using Core.Domain.Entities.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PackageItineraryConfiguration : IEntityTypeConfiguration<PackageItinerary>
    {
        public void Configure(EntityTypeBuilder<PackageItinerary> builder)
        {
            builder.ToTable("PackageItineraries");

            builder.HasKey(pi => pi.Id);

            builder.Property(pi => pi.PackageId)
                .IsRequired();

            builder.Property(pi => pi.Day)
                .IsRequired();

            builder.HasIndex(pi => new { pi.PackageId, pi.Day });

            builder.Property(pi => pi.Title)
                .IsRequired()
                .HasMaxLength(300);

            builder.Property(pi => pi.Description)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(pi => pi.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(pi => pi.Latitude)
                .HasColumnType("decimal(10,8)");

            builder.Property(pi => pi.Longitude)
                .HasColumnType("decimal(11,8)");
        }
    }
}

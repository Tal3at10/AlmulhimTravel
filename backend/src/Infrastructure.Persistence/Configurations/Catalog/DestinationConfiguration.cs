using Core.Domain.Entities.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class DestinationConfiguration : IEntityTypeConfiguration<Destination>
    {
        public void Configure(EntityTypeBuilder<Destination> builder)
        {
            builder.ToTable("Destinations");

            builder.HasKey(d => d.Id);

            builder.Property(d => d.NameAr)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(d => d.NameEn)
                .HasMaxLength(200);

            builder.Property(d => d.Slug)
                .HasMaxLength(100);

            builder.HasIndex(d => d.Slug)
                .IsUnique();

            builder.Property(d => d.Country)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(d => d.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(d => d.Description)
                .HasMaxLength(2000);

            builder.Property(d => d.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(d => d.SortOrder)
                .IsRequired()
                .HasDefaultValue(0);

            builder.HasIndex(d => d.SortOrder);

            // Relationships
            builder.HasMany(d => d.Packages)
                .WithOne(p => p.Destination)
                .HasForeignKey(p => p.DestinationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(d => d.Hotels)
                .WithMany()
                .UsingEntity(j => j.ToTable("DestinationHotels"));

            builder.HasMany(d => d.CustomerVideos)
                .WithOne(cv => cv.Destination)
                .HasForeignKey(cv => cv.DestinationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

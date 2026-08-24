using Core.Domain.Entities.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PackageHotelConfiguration : IEntityTypeConfiguration<PackageHotel>
    {
        public void Configure(EntityTypeBuilder<PackageHotel> builder)
        {
            builder.ToTable("PackageHotels");

            builder.HasKey(ph => ph.Id);

            builder.Property(ph => ph.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(ph => ph.Location)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(ph => ph.Stars)
                .IsRequired();

            builder.Property(ph => ph.NightsCount)
                .IsRequired();

            builder.Property(ph => ph.DayImageUrl)
                .HasMaxLength(500);

            builder.Property(ph => ph.NightImageUrl)
                .HasMaxLength(500);

            builder.Property(ph => ph.SortOrder)
                .IsRequired()
                .HasDefaultValue(0);

            // Relationship with Package only (no Hotel foreign key)
            builder.HasOne(ph => ph.Package)
                .WithMany(p => p.PackageHotels)
                .HasForeignKey(ph => ph.PackageId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

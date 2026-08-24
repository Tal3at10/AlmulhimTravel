using Core.Domain.Entities.Accommodation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class CityConfiguration : IEntityTypeConfiguration<City>
    {
        public void Configure(EntityTypeBuilder<City> builder)
        {
            builder.ToTable("Cities");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.NameAr)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(c => c.NameEn)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(c => c.Country)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(c => new { c.NameEn, c.Country });

            // Relationships
            builder.HasMany(c => c.Hotels)
                .WithOne(h => h.City)
                .HasForeignKey(h => h.CityId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}

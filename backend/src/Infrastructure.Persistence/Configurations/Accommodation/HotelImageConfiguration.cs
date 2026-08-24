using Core.Domain.Entities.Accommodation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class HotelImageConfiguration : IEntityTypeConfiguration<HotelImage>
    {
        public void Configure(EntityTypeBuilder<HotelImage> builder)
        {
            builder.ToTable("HotelImages");

            builder.HasKey(hi => hi.Id);

            builder.Property(hi => hi.HotelId)
                .IsRequired();

            builder.Property(hi => hi.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(hi => hi.SortOrder)
                .IsRequired()
                .HasDefaultValue(0);

            builder.HasIndex(hi => new { hi.HotelId, hi.SortOrder });
        }
    }
}

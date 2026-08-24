using Core.Domain.Entities.Accommodation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class HotelAmenityConfiguration : IEntityTypeConfiguration<HotelAmenity>
    {
        public void Configure(EntityTypeBuilder<HotelAmenity> builder)
        {
            builder.ToTable("HotelAmenities");

            builder.HasKey(ha => new { ha.HotelId, ha.AmenityId });

            // Indexes for filtering
            builder.HasIndex(ha => ha.AmenityId);
        }
    }
}

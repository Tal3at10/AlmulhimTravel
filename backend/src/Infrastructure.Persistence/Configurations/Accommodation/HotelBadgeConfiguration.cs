using Core.Domain.Entities.Accommodation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class HotelBadgeConfiguration : IEntityTypeConfiguration<HotelBadge>
    {
        public void Configure(EntityTypeBuilder<HotelBadge> builder)
        {
            builder.ToTable("HotelBadges");

            builder.HasKey(hb => hb.Id);

            builder.Property(hb => hb.HotelId)
                .IsRequired();

            builder.Property(hb => hb.Text)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(hb => hb.Type)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasIndex(hb => hb.HotelId);
        }
    }
}

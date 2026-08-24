using Core.Domain.Entities.Accommodation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class HotelHighlightConfiguration : IEntityTypeConfiguration<HotelHighlight>
    {
        public void Configure(EntityTypeBuilder<HotelHighlight> builder)
        {
            builder.ToTable("HotelHighlights");

            builder.HasKey(hh => hh.Id);

            builder.Property(hh => hh.HotelId)
                .IsRequired();

            builder.Property(hh => hh.Text)
                .IsRequired()
                .HasMaxLength(300);

            builder.HasIndex(hh => hh.HotelId);
        }
    }
}

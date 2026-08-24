using Core.Domain.Entities.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class HeroSlideConfiguration : IEntityTypeConfiguration<HeroSlide>
    {
        public void Configure(EntityTypeBuilder<HeroSlide> builder)
        {
            builder.ToTable("HeroSlides");

            builder.HasKey(hs => hs.Id);

            builder.Property(hs => hs.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(hs => hs.TitleAr)
                .HasMaxLength(300);

            builder.Property(hs => hs.TitleEn)
                .HasMaxLength(300);

            builder.Property(hs => hs.SortOrder)
                .IsRequired()
                .HasDefaultValue(0);

            builder.HasIndex(hs => hs.SortOrder);

            builder.Property(hs => hs.IsActive)
                .IsRequired()
                .HasDefaultValue(true);
        }
    }
}

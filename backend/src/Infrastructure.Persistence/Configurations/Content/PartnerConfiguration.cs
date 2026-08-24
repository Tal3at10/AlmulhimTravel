using Core.Domain.Entities.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PartnerConfiguration : IEntityTypeConfiguration<Partner>
    {
        public void Configure(EntityTypeBuilder<Partner> builder)
        {
            builder.ToTable("Partners");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(p => p.LogoUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(p => p.WebsiteUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(p => p.SortOrder)
                .IsRequired()
                .HasDefaultValue(0);

            builder.HasIndex(p => p.SortOrder);

            builder.Property(p => p.IsActive)
                .IsRequired()
                .HasDefaultValue(true);
        }
    }
}

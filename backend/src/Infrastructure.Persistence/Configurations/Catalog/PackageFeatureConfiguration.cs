using Core.Domain.Entities.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PackageFeatureConfiguration : IEntityTypeConfiguration<PackageFeature>
    {
        public void Configure(EntityTypeBuilder<PackageFeature> builder)
        {
            builder.ToTable("PackageFeatures");

            builder.HasKey(pf => pf.Id);

            builder.Property(pf => pf.PackageId)
                .IsRequired();

            builder.Property(pf => pf.Text)
                .IsRequired()
                .HasMaxLength(200);

            builder.HasIndex(pf => pf.PackageId);
        }
    }
}

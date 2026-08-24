using Core.Domain.Entities.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class CompanySettingConfiguration : IEntityTypeConfiguration<CompanySetting>
    {
        public void Configure(EntityTypeBuilder<CompanySetting> builder)
        {
            builder.ToTable("CompanySettings");

            builder.HasKey(cs => cs.Id);

            builder.Property(cs => cs.Key)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(cs => cs.Key)
                .IsUnique();

            builder.Property(cs => cs.Value)
                .IsRequired()
                .HasMaxLength(5000);

            builder.Property(cs => cs.ValueEn)
                .IsRequired()
                .HasMaxLength(5000);
        }
    }
}

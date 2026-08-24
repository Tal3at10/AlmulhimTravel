using Core.Domain.Entities.Accommodation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class RatePlanConfiguration : IEntityTypeConfiguration<RatePlan>
    {
        public void Configure(EntityTypeBuilder<RatePlan> builder)
        {
            builder.ToTable("RatePlans");

            builder.HasKey(rp => rp.Id);

            builder.Property(rp => rp.RoomId)
                .IsRequired();

            builder.Property(rp => rp.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(rp => rp.Price)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.HasIndex(rp => rp.Price);

            builder.Property(rp => rp.OriginalPrice)
                .HasColumnType("decimal(18,2)");

            builder.Property(rp => rp.TaxInfo)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(rp => rp.ValidFrom)
                .IsRequired();

            builder.Property(rp => rp.ValidTo)
                .IsRequired();

            builder.Property(rp => rp.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.HasIndex(rp => new { rp.RoomId, rp.ValidFrom, rp.ValidTo, rp.IsActive });
        }
    }
}

using Core.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class CouponConfiguration : IEntityTypeConfiguration<Coupon>
    {
        public void Configure(EntityTypeBuilder<Coupon> builder)
        {
            builder.ToTable("Coupons");
            builder.HasKey(c => c.Id);
            
            builder.Property(c => c.Code)
                .IsRequired()
                .HasMaxLength(50);
                
            builder.HasIndex(c => c.Code)
                .IsUnique();
                
            builder.Property(c => c.DiscountType)
                .IsRequired()
                .HasMaxLength(50);
                
            builder.Property(c => c.Value)
                .IsRequired()
                .HasColumnType("decimal(18,2)");
                
            builder.Property(c => c.MaxDiscount)
                .IsRequired(false)
                .HasColumnType("decimal(18,2)");
                
            builder.Property(c => c.MinBookingAmount)
                .IsRequired()
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0.00);
        }
    }
}

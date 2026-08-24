using Core.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable("Payments");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.BookingId)
                .IsRequired();

            builder.Property(p => p.Method)
                .IsRequired();

            builder.Property(p => p.Status)
                .IsRequired();

            builder.HasIndex(p => p.Status);

            builder.Property(p => p.Amount)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(p => p.Currency)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(p => p.TransactionId)
                .IsRequired()
                .HasMaxLength(200);

            builder.HasIndex(p => p.TransactionId)
                .IsUnique();

            builder.Property(p => p.CardLast4)
                .IsRequired()
                .HasMaxLength(4);

            builder.Property(p => p.CardBrand)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(p => p.CreatedAt)
                .IsRequired();

            builder.Property(p => p.PaidAt)
                .IsRequired(false);

            builder.Property(p => p.RowVersion)
                .IsRowVersion();

            builder.HasIndex(p => p.CreatedAt);
        }
    }
}

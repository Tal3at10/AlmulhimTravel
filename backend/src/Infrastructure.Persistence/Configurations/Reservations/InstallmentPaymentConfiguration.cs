using Core.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class InstallmentPaymentConfiguration : IEntityTypeConfiguration<InstallmentPayment>
    {
        public void Configure(EntityTypeBuilder<InstallmentPayment> builder)
        {
            builder.ToTable("InstallmentPayments");
            builder.HasKey(ip => ip.Id);

            builder.Property(ip => ip.Provider)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(ip => ip.TotalMonths)
                .IsRequired();

            builder.Property(ip => ip.MonthlyAmount)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(ip => ip.Status)
                .IsRequired()
                .HasMaxLength(50)
                .HasDefaultValue("Pending");

            builder.Property(ip => ip.TransactionReference)
                .IsRequired(false)
                .HasMaxLength(200);

            builder.HasOne(ip => ip.Booking)
                .WithMany(b => b.InstallmentPayments)
                .HasForeignKey(ip => ip.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

using Core.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class WalletTransactionConfiguration : IEntityTypeConfiguration<WalletTransaction>
    {
        public void Configure(EntityTypeBuilder<WalletTransaction> builder)
        {
            builder.ToTable("WalletTransactions");

            builder.HasKey(wt => wt.Id);

            builder.Property(wt => wt.Amount)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(wt => wt.Type)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(wt => wt.Description)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(wt => wt.CreatedAt)
                .IsRequired();

            // Relationship: User -> WalletTransactions (Cascade Delete)
            builder.HasOne(wt => wt.User)
                .WithMany(u => u.WalletTransactions)
                .HasForeignKey(wt => wt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

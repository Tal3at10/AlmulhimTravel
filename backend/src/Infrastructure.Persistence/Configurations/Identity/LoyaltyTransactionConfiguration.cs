using Core.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class LoyaltyTransactionConfiguration : IEntityTypeConfiguration<LoyaltyTransaction>
    {
        public void Configure(EntityTypeBuilder<LoyaltyTransaction> builder)
        {
            builder.ToTable("LoyaltyTransactions");

            builder.HasKey(lt => lt.Id);

            builder.Property(lt => lt.Points)
                .IsRequired();

            builder.Property(lt => lt.Type)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(lt => lt.Description)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(lt => lt.CreatedAt)
                .IsRequired();

            // Relationship: User -> LoyaltyTransactions (Cascade Delete)
            builder.HasOne(lt => lt.User)
                .WithMany(u => u.LoyaltyTransactions)
                .HasForeignKey(lt => lt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

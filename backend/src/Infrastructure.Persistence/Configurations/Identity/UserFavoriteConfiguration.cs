using Core.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class UserFavoriteConfiguration : IEntityTypeConfiguration<UserFavorite>
    {
        public void Configure(EntityTypeBuilder<UserFavorite> builder)
        {
            builder.ToTable("UserFavorites");

            builder.HasKey(uf => uf.Id);

            builder.Property(uf => uf.UserId)
                .IsRequired();

            builder.Property(uf => uf.Type)
                .IsRequired();

            builder.Property(uf => uf.HotelId)
                .IsRequired(false);

            builder.Property(uf => uf.PackageId)
                .IsRequired(false);

            builder.Property(uf => uf.CreatedAt)
                .IsRequired();

            // Indexes
            builder.HasIndex(uf => new { uf.UserId, uf.Type, uf.HotelId });
            builder.HasIndex(uf => new { uf.UserId, uf.Type, uf.PackageId });

            // Relationships
            builder.HasOne(uf => uf.Hotel)
                .WithMany()
                .HasForeignKey(uf => uf.HotelId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(uf => uf.Package)
                .WithMany()
                .HasForeignKey(uf => uf.PackageId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

using Core.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class BookingAddonConfiguration : IEntityTypeConfiguration<BookingAddon>
    {
        public void Configure(EntityTypeBuilder<BookingAddon> builder)
        {
            builder.ToTable("BookingAddons");
            builder.HasKey(ba => ba.Id);

            builder.Property(ba => ba.AddonType)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(ba => ba.Provider)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(ba => ba.Price)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(ba => ba.DetailsJson)
                .IsRequired(false);

            builder.HasOne(ba => ba.Booking)
                .WithMany(b => b.BookingAddons)
                .HasForeignKey(ba => ba.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

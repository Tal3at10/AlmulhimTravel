using Core.Domain.Entities.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class CustomerVideoConfiguration : IEntityTypeConfiguration<CustomerVideo>
    {
        public void Configure(EntityTypeBuilder<CustomerVideo> builder)
        {
            builder.ToTable("CustomerVideos");

            builder.HasKey(cv => cv.Id);

            builder.Property(cv => cv.DestinationId)
                .IsRequired();

            builder.Property(cv => cv.ThumbnailUrl)
                .HasMaxLength(500);

            builder.Property(cv => cv.VideoUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(cv => cv.CustomerName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(cv => cv.Location)
                .HasMaxLength(200);

            builder.Property(cv => cv.Date)
                .HasMaxLength(50);

            builder.Property(cv => cv.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(cv => cv.SortOrder)
                .IsRequired()
                .HasDefaultValue(0);

            builder.HasIndex(cv => new { cv.DestinationId, cv.SortOrder });
        }
    }
}

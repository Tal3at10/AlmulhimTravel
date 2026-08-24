using Core.Domain.Entities.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class TestimonialConfiguration : IEntityTypeConfiguration<Testimonial>
    {
        public void Configure(EntityTypeBuilder<Testimonial> builder)
        {
            builder.ToTable("Testimonials");

            builder.HasKey(t => t.Id);

            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(t => t.ImageUrl)
                .HasMaxLength(500);

            builder.Property(t => t.Text)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(t => t.Rating)
                .IsRequired();

            builder.Property(t => t.Destination)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(t => t.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(t => t.SortOrder)
                .IsRequired()
                .HasDefaultValue(0);

            builder.HasIndex(t => t.SortOrder);
        }
    }
}

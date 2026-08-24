using Core.Domain.Entities.Accommodation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class RoomFeatureConfiguration : IEntityTypeConfiguration<RoomFeature>
    {
        public void Configure(EntityTypeBuilder<RoomFeature> builder)
        {
            builder.ToTable("RoomFeatures");

            builder.HasKey(rf => rf.Id);

            builder.Property(rf => rf.RoomId)
                .IsRequired();

            builder.Property(rf => rf.Text)
                .IsRequired()
                .HasMaxLength(200);

            builder.HasIndex(rf => rf.RoomId);
        }
    }
}

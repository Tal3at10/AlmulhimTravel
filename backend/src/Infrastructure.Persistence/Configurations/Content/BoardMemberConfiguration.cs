using Core.Domain.Entities.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class BoardMemberConfiguration : IEntityTypeConfiguration<BoardMember>
    {
        public void Configure(EntityTypeBuilder<BoardMember> builder)
        {
            builder.ToTable("BoardMembers");

            builder.HasKey(bm => bm.Id);

            builder.Property(bm => bm.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(bm => bm.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(bm => bm.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(bm => bm.SortOrder)
                .IsRequired()
                .HasDefaultValue(0);

            builder.HasIndex(bm => bm.SortOrder);

            builder.Property(bm => bm.IsChairman)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(bm => bm.IsCEO)
                .IsRequired()
                .HasDefaultValue(false);
        }
    }
}

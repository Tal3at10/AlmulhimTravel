using Core.Domain.Enums;

namespace Core.Application.Abstraction.DTOs.Identity
{
    public class UserFavoriteDto
    {
        public Guid Id { get; set; }
        public FavoriteType FavoriteType { get; set; }
        public Guid ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string ItemImageUrl { get; set; } = string.Empty;
        public decimal? ItemPrice { get; set; }
        public DateTime AddedAt { get; set; }
    }

    public class AddFavoriteDto
    {
        public FavoriteType FavoriteType { get; set; }
        public Guid ItemId { get; set; }
    }
}

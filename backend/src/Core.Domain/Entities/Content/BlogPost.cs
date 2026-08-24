using System;

namespace Core.Domain.Entities.Content
{
    public class BlogPost
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string CoverImageUrl { get; set; }
        public string Content { get; set; }
        public string ShortDescription { get; set; }
        public string Tags { get; set; } 
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

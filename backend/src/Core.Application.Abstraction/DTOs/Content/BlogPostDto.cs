using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Application.Abstraction.DTOs.Content
{
    public class BlogPostDto
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

    public class CreateBlogPostDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        public string Slug { get; set; }

        public string CoverImageUrl { get; set; }

        [Required]
        public string Content { get; set; }

        public string ShortDescription { get; set; }
        public string Tags { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public bool IsPublished { get; set; }
    }

    public class UpdateBlogPostDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        public string Slug { get; set; }

        public string CoverImageUrl { get; set; }

        [Required]
        public string Content { get; set; }

        public string ShortDescription { get; set; }
        public string Tags { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public bool IsPublished { get; set; }
    }
}

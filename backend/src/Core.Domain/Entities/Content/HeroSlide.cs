using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Entities.Content
{
    public class HeroSlide
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? TitleAr { get; set; }
        public string? TitleEn { get; set; }
        public string? SubtitleAr { get; set; }
        public string? SubtitleEn { get; set; }
        public string? VideoUrl { get; set; }
        public string? ButtonText { get; set; }
        public string? ButtonLink { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }
}

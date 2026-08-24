using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Entities.Content
{
    public class BoardMember
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? NameEn { get; set; }
        public string Title { get; set; }
        public string? TitleEn { get; set; }
        public string ImageUrl { get; set; }
        public string? Bio { get; set; }
        public string? TwitterHandle { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public bool IsChairman { get; set; }
        public bool IsCEO { get; set; }
    }

}

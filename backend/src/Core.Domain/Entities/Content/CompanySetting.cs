using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Entities.Content
{
    public class CompanySetting
    {
        public Guid Id { get; set; }
        public string Key { get; set; } // "chairman_message", "vision", "mission"
        public string Value { get; set; }
        public string ValueEn { get; set; }
    }

}

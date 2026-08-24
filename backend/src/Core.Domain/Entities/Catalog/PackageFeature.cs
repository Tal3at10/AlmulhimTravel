using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Entities.Accommodation;

namespace Core.Domain.Entities.Catalog
{
    public class PackageFeature
    {
        public Guid Id { get; set; }
        public Guid PackageId { get; set; }
        public string Text { get; set; } // "?????", "????? 5 ????", "????? ????"

        public Package Package { get; set; }
    }
}


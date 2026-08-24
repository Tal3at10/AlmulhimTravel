using Infrastructure.Persistence.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace APIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdsController : ControllerBase
    {
        private readonly AlmulhemDbContext _context;

        public AdsController(AlmulhemDbContext context)
        {
            _context = context;
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveAds()
        {
            var ads = await _context.PromotionalAds
                .Where(a => a.IsActive)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new
                {
                    a.Id,
                    a.ImageUrl,
                    a.Destination,
                    a.Price,
                    a.Platform,
                    a.CreatedAt
                })
                .Take(10)
                .ToListAsync();

            return Ok(ads);
        }
    }
}

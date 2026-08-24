using Infrastructure.Persistence.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace APIs.Controllers
{
    /// <summary>
    /// Generates a dynamic sitemap.xml from the database.
    /// Includes all static pages, active packages, published blog posts, and active destinations.
    /// This replaces the old static sitemap.xml file.
    /// </summary>
    [ApiController]
    public class SitemapController : ControllerBase
    {
        private readonly AlmulhemDbContext _db;
        private const string BASE_URL = "https://almulhimtravel.com";

        public SitemapController(AlmulhemDbContext db)
        {
            _db = db;
        }

        [HttpGet("sitemap.xml")]
        [Produces("application/xml")]
        [ResponseCache(Duration = 3600)] // Cache for 1 hour
        public async Task<IActionResult> GetSitemap(CancellationToken cancellationToken)
        {
            var urls = new List<SitemapUrl>();

            // ─── Static Pages ───
            urls.Add(new SitemapUrl($"{BASE_URL}/", "daily", "1.0"));
            urls.Add(new SitemapUrl($"{BASE_URL}/destinations", "daily", "0.9"));
            urls.Add(new SitemapUrl($"{BASE_URL}/offers", "daily", "0.9"));
            urls.Add(new SitemapUrl($"{BASE_URL}/blog", "daily", "0.8"));
            urls.Add(new SitemapUrl($"{BASE_URL}/about", "monthly", "0.7"));
            urls.Add(new SitemapUrl($"{BASE_URL}/contact", "monthly", "0.7"));
            urls.Add(new SitemapUrl($"{BASE_URL}/privacy", "yearly", "0.3"));
            urls.Add(new SitemapUrl($"{BASE_URL}/terms", "yearly", "0.3"));

            // ─── Dynamic: All Active Packages ───
            var packages = await _db.Packages
                .AsNoTracking()
                .Where(p => p.IsActive)
                .Select(p => new { p.PackageId, p.CreatedAt })
                .ToListAsync(cancellationToken);

            foreach (var pkg in packages)
            {
                urls.Add(new SitemapUrl(
                    $"{BASE_URL}/package/{pkg.PackageId}",
                    "weekly",
                    "0.8",
                    pkg.CreatedAt
                ));
            }

            // ─── Dynamic: All Published Blog Posts ───
            var posts = await _db.BlogPosts
                .AsNoTracking()
                .Where(p => p.IsPublished)
                .Select(p => new { p.Slug, p.UpdatedAt })
                .ToListAsync(cancellationToken);

            foreach (var post in posts)
            {
                urls.Add(new SitemapUrl(
                    $"{BASE_URL}/blog/{post.Slug}",
                    "monthly",
                    "0.7",
                    post.UpdatedAt
                ));
            }

            // ─── Dynamic: Destination Landing Pages ───
            var destinations = await _db.Destinations
                .AsNoTracking()
                .Where(d => d.IsActive)
                .Select(d => new { d.NameAr })
                .ToListAsync(cancellationToken);

            foreach (var dest in destinations)
            {
                urls.Add(new SitemapUrl(
                    $"{BASE_URL}/destinations?destName={Uri.EscapeDataString(dest.NameAr)}",
                    "weekly",
                    "0.8"
                ));
            }

            // ─── Generate XML ───
            var xml = GenerateSitemapXml(urls);
            return Content(xml, "application/xml", Encoding.UTF8);
        }

        private static string GenerateSitemapXml(List<SitemapUrl> urls)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            sb.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

            foreach (var url in urls)
            {
                sb.AppendLine("  <url>");
                sb.AppendLine($"    <loc>{EscapeXml(url.Location)}</loc>");

                if (url.LastModified.HasValue)
                    sb.AppendLine($"    <lastmod>{url.LastModified.Value:yyyy-MM-dd}</lastmod>");

                if (!string.IsNullOrEmpty(url.ChangeFrequency))
                    sb.AppendLine($"    <changefreq>{url.ChangeFrequency}</changefreq>");

                if (!string.IsNullOrEmpty(url.Priority))
                    sb.AppendLine($"    <priority>{url.Priority}</priority>");

                sb.AppendLine("  </url>");
            }

            sb.AppendLine("</urlset>");
            return sb.ToString();
        }

        private static string EscapeXml(string value)
        {
            return value
                .Replace("&", "&amp;")
                .Replace("<", "&lt;")
                .Replace(">", "&gt;")
                .Replace("\"", "&quot;")
                .Replace("'", "&apos;");
        }

        private record SitemapUrl(
            string Location,
            string? ChangeFrequency = null,
            string? Priority = null,
            DateTime? LastModified = null
        );
    }
}

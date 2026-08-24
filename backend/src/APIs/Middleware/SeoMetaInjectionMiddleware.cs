using Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.RegularExpressions;

namespace APIs.Middleware
{
    /// <summary>
    /// Middleware that intercepts SPA fallback responses and injects dynamic SEO meta tags
    /// into the index.html template. This ensures crawlers receive proper titles, descriptions,
    /// canonical URLs, Open Graph tags, and JSON-LD structured data for every page.
    /// </summary>
    public class SeoMetaInjectionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<SeoMetaInjectionMiddleware> _logger;

        private const string SITE_URL = "https://almulhimtravel.com";
        private const string SITE_NAME = "الملحم للسفر والسياحة";
        private const string DEFAULT_OG_IMAGE = "https://almulhimtravel.com/logo.png";

        // File extensions that should NOT be processed
        private static readonly HashSet<string> StaticExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".js", ".css", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".ico",
            ".json", ".woff", ".woff2", ".ttf", ".eot", ".map", ".webp",
            ".mp4", ".webm", ".xml", ".txt", ".pdf"
        };

        public SeoMetaInjectionMiddleware(RequestDelegate next, ILogger<SeoMetaInjectionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value ?? "/";

            // Skip API routes, admin routes, and static files
            if (path.StartsWith("/api/", StringComparison.OrdinalIgnoreCase) ||
                path.StartsWith("/admin", StringComparison.OrdinalIgnoreCase) ||
                path.StartsWith("/health", StringComparison.OrdinalIgnoreCase) ||
                IsStaticFile(path))
            {
                await _next(context);
                return;
            }

            // Capture the original response body
            var originalBody = context.Response.Body;
            using var newBody = new MemoryStream();
            context.Response.Body = newBody;

            await _next(context);

            // Only process HTML responses (SPA fallback)
            var contentType = context.Response.ContentType ?? "";
            if (context.Response.StatusCode == 200 && contentType.Contains("text/html", StringComparison.OrdinalIgnoreCase))
            {
                newBody.Seek(0, SeekOrigin.Begin);
                var html = await new StreamReader(newBody).ReadToEndAsync();

                // Only inject if this is our SPA index.html (has the placeholder)
                if (html.Contains("<!--SEO_META_PLACEHOLDER-->"))
                {
                    try
                    {
                        using var scope = context.RequestServices.CreateScope();
                        var db = scope.ServiceProvider.GetRequiredService<AlmulhemDbContext>();
                        var meta = await ResolveMeta(db, path);

                        html = InjectMeta(html, meta, path);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "SEO meta injection failed for path: {Path}", path);
                        // Remove placeholder even if injection fails
                        html = html.Replace("<!--SEO_META_PLACEHOLDER-->", "");
                    }
                }

                var bytes = Encoding.UTF8.GetBytes(html);
                context.Response.Body = originalBody;
                context.Response.ContentLength = bytes.Length;
                await context.Response.Body.WriteAsync(bytes);
            }
            else
            {
                newBody.Seek(0, SeekOrigin.Begin);
                await newBody.CopyToAsync(originalBody);
                context.Response.Body = originalBody;
            }
        }

        private static bool IsStaticFile(string path)
        {
            var ext = Path.GetExtension(path);
            return !string.IsNullOrEmpty(ext) && StaticExtensions.Contains(ext);
        }

        private async Task<PageMeta> ResolveMeta(AlmulhemDbContext db, string path)
        {
            // Route: /package/{packageId}
            var packageMatch = Regex.Match(path, @"^/package/(.+)$", RegexOptions.IgnoreCase);
            if (packageMatch.Success)
            {
                var packageId = packageMatch.Groups[1].Value;
                packageId = System.Web.HttpUtility.UrlDecode(packageId); // Decode for Arabic URLs
                
                var pkg = await db.Packages
                    .AsNoTracking()
                    .Include(p => p.Destination)
                    .FirstOrDefaultAsync(p => p.PackageId == packageId && p.IsActive);

                if (pkg != null)
                {
                    var destName = pkg.Destination?.NameAr ?? "";
                    return new PageMeta
                    {
                        Title = $"{pkg.TitleAr} | {SITE_NAME}",
                        Description = $"احجز باقة {pkg.TitleAr} بسعر {pkg.Price} {pkg.Currency} - {pkg.Duration}. {pkg.Subtitle ?? $"رحلة مميزة إلى {destName} مع الملحم للسفر والسياحة."}",
                        OgImage = pkg.ImageUrl ?? DEFAULT_OG_IMAGE,
                        OgType = "product",
                        Keywords = $"باقة {destName}, سفر إلى {destName}, {pkg.TitleAr}, رحلات {destName}, عروض سياحية",
                        JsonLd = GeneratePackageSchema(pkg, destName)
                    };
                }
            }

            // Route: /blog/{slug}
            var blogMatch = Regex.Match(path, @"^/blog/(.+)$", RegexOptions.IgnoreCase);
            if (blogMatch.Success)
            {
                var slug = blogMatch.Groups[1].Value;
                slug = System.Web.HttpUtility.UrlDecode(slug); // Decode for Arabic URLs
                
                var post = await db.BlogPosts
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.Slug == slug && p.IsPublished);

                if (post != null)
                {
                    return new PageMeta
                    {
                        Title = post.MetaTitle ?? $"{post.Title} | مدونة {SITE_NAME}",
                        Description = post.MetaDescription ?? post.ShortDescription,
                        OgImage = post.CoverImageUrl ?? DEFAULT_OG_IMAGE,
                        OgType = "article",
                        Keywords = post.Tags ?? "",
                        JsonLd = GenerateArticleSchema(post)
                    };
                }
            }

            // Route: /destinations (with ?destName= filter)
            if (path.Equals("/destinations", StringComparison.OrdinalIgnoreCase) ||
                path.Equals("/offers", StringComparison.OrdinalIgnoreCase))
            {
                return new PageMeta
                {
                    Title = $"أفضل باقات السفر والعروض السياحية | {SITE_NAME}",
                    Description = "اكتشف أفضل عروض وباقات السفر حول العالم - رحلات إلى تركيا، ماليزيا، جورجيا، المالديف وأكثر. أسعار منافسة وخدمة متميزة مع الملحم للسفر والسياحة.",
                    Keywords = "باقات سياحية, عروض سفر, سفر إلى تركيا, شهر عسل, رحلات ماليزيا, أفضل عروض سياحية"
                };
            }

            // Route: /blog
            if (path.Equals("/blog", StringComparison.OrdinalIgnoreCase))
            {
                return new PageMeta
                {
                    Title = $"مدونة السفر والسياحة | {SITE_NAME}",
                    Description = "اقرأ أحدث المقالات والنصائح حول السفر والسياحة وأفضل الوجهات العالمية. دليلك الشامل لرحلة لا تُنسى مع مدونة الملحم للسفر.",
                    Keywords = "مدونة سفر, نصائح سياحية, دليل سفر, أفضل وجهات سياحية"
                };
            }

            // Route: /about
            if (path.Equals("/about", StringComparison.OrdinalIgnoreCase))
            {
                return new PageMeta
                {
                    Title = $"عن الملحم للسفر والسياحة | أكثر من 30 عاماً من التميز",
                    Description = "تعرف على شركة الملحم للسفر والسياحة، أكثر من 30 عاماً من الخبرة في صناعة السفر. شريك رؤية 2030، عضو IATA، مرخص من وزارة السياحة.",
                    Keywords = "شركة الملحم, عن الملحم, سياحة السعودية, وكالة سفر"
                };
            }

            // Route: /contact
            if (path.Equals("/contact", StringComparison.OrdinalIgnoreCase))
            {
                return new PageMeta
                {
                    Title = $"تواصل معنا | {SITE_NAME}",
                    Description = "تواصل مع شركة الملحم للسفر والسياحة. فريقنا متاح على مدار الساعة: +966535727771. زورونا في الهفوف والمبرز، المملكة العربية السعودية.",
                    Keywords = "تواصل الملحم, رقم الملحم, فروع الملحم, حجز سياحي"
                };
            }

            // Default: Homepage
            return new PageMeta
            {
                Title = $"{SITE_NAME} | خيارك الأول لرحلات لا تُنسى",
                Description = "الملحم للسفر والسياحة - أفضل باقات السفر وعروض الرحلات السياحية إلى تركيا، ماليزيا، جورجيا والمالديف. حجوزات طيران وفنادق بأسعار منافسة منذ 1993.",
                Keywords = "سياحة, سفر, حجوزات, فنادق, طيران, عروض سفر, باقات سياحية, سفر إلى تركيا, شهر عسل في تركيا, أفضل باقات سياحية"
            };
        }

        private static string InjectMeta(string html, PageMeta meta, string path)
        {
            var canonicalUrl = $"{SITE_URL}{path}";
            var sb = new StringBuilder();

            // Dynamic title (will override the static one via React Helmet, but crawlers see this first)
            sb.AppendLine($"    <title>{meta.Title}</title>");
            sb.AppendLine($"    <meta name=\"description\" content=\"{EscapeAttr(meta.Description)}\" />");
            if (!string.IsNullOrEmpty(meta.Keywords))
                sb.AppendLine($"    <meta name=\"keywords\" content=\"{EscapeAttr(meta.Keywords)}\" />");
            sb.AppendLine($"    <link rel=\"canonical\" href=\"{canonicalUrl}\" />");

            // hreflang
            sb.AppendLine($"    <link rel=\"alternate\" hreflang=\"ar\" href=\"{canonicalUrl}\" />");
            sb.AppendLine($"    <link rel=\"alternate\" hreflang=\"x-default\" href=\"{canonicalUrl}\" />");

            // Open Graph
            sb.AppendLine($"    <meta property=\"og:type\" content=\"{meta.OgType}\" />");
            sb.AppendLine($"    <meta property=\"og:title\" content=\"{EscapeAttr(meta.Title)}\" />");
            sb.AppendLine($"    <meta property=\"og:description\" content=\"{EscapeAttr(meta.Description)}\" />");
            sb.AppendLine($"    <meta property=\"og:url\" content=\"{canonicalUrl}\" />");
            sb.AppendLine($"    <meta property=\"og:site_name\" content=\"{SITE_NAME}\" />");
            sb.AppendLine($"    <meta property=\"og:locale\" content=\"ar_SA\" />");
            sb.AppendLine($"    <meta property=\"og:image\" content=\"{meta.OgImage}\" />");

            // Twitter Card
            sb.AppendLine($"    <meta name=\"twitter:card\" content=\"summary_large_image\" />");
            sb.AppendLine($"    <meta name=\"twitter:title\" content=\"{EscapeAttr(meta.Title)}\" />");
            sb.AppendLine($"    <meta name=\"twitter:description\" content=\"{EscapeAttr(meta.Description)}\" />");
            sb.AppendLine($"    <meta name=\"twitter:image\" content=\"{meta.OgImage}\" />");

            // JSON-LD
            if (!string.IsNullOrEmpty(meta.JsonLd))
            {
                sb.AppendLine($"    <script type=\"application/ld+json\">{meta.JsonLd}</script>");
            }

            return html.Replace("<!--SEO_META_PLACEHOLDER-->", sb.ToString());
        }

        private static string GeneratePackageSchema(Core.Domain.Entities.Catalog.Package pkg, string destName)
        {
            return $$"""
            {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": "{{EscapeJson(pkg.TitleAr)}}",
                "description": "{{EscapeJson(pkg.Subtitle ?? $"باقة سفر إلى {destName}")}}",
                "image": "{{pkg.ImageUrl ?? ""}}",
                "brand": {"@type": "Organization", "name": "الملحم للسفر والسياحة"},
                "offers": {
                    "@type": "Offer",
                    "price": "{{pkg.Price}}",
                    "priceCurrency": "SAR",
                    "availability": "https://schema.org/InStock",
                    "seller": {"@type": "TravelAgency", "name": "الملحم للسفر والسياحة", "url": "https://almulhimtravel.com"}
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "{{pkg.Rating}}",
                    "bestRating": "5",
                    "worstRating": "1",
                    "ratingCount": "85"
                }
            }
            """;
        }

        private static string GenerateArticleSchema(Core.Domain.Entities.Content.BlogPost post)
        {
            var datePublished = post.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ssZ");
            var dateModified = post.UpdatedAt.ToString("yyyy-MM-ddTHH:mm:ssZ");

            return $$"""
            {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": "{{EscapeJson(post.Title)}}",
                "description": "{{EscapeJson(post.ShortDescription ?? "")}}",
                "image": "{{post.CoverImageUrl ?? ""}}",
                "datePublished": "{{datePublished}}",
                "dateModified": "{{dateModified}}",
                "author": {"@type": "Organization", "name": "الملحم للسفر والسياحة"},
                "publisher": {
                    "@type": "Organization",
                    "name": "الملحم للسفر والسياحة",
                    "logo": {"@type": "ImageObject", "url": "https://almulhimtravel.com/logo.png"}
                },
                "mainEntityOfPage": "https://almulhimtravel.com/blog/{{post.Slug}}"
            }
            """;
        }

        private static string EscapeAttr(string value)
        {
            if (string.IsNullOrEmpty(value)) return "";
            return value.Replace("\"", "&quot;").Replace("<", "&lt;").Replace(">", "&gt;");
        }

        private static string EscapeJson(string value)
        {
            if (string.IsNullOrEmpty(value)) return "";
            return value.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "");
        }

        private class PageMeta
        {
            public string Title { get; set; } = "";
            public string Description { get; set; } = "";
            public string Keywords { get; set; } = "";
            public string OgImage { get; set; } = DEFAULT_OG_IMAGE;
            public string OgType { get; set; } = "website";
            public string? JsonLd { get; set; }
        }
    }

    public static class SeoMetaInjectionMiddlewareExtensions
    {
        public static IApplicationBuilder UseSeoMetaInjection(this IApplicationBuilder app)
        {
            return app.UseMiddleware<SeoMetaInjectionMiddleware>();
        }
    }
}

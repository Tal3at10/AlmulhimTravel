namespace Core.Application.Validators.Common
{
    /// <summary>
    /// Common validation helper methods for XSS protection and security
    /// </summary>
    public static class ValidationHelpers
    {
        /// <summary>
        /// Check if string contains XSS attack patterns
        /// </summary>
        public static bool NotContainXss(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return true;

            // Common XSS patterns to block
            var xssPatterns = new[]
            {
                @"<script",
                @"</script",
                @"javascript:",
                @"onerror=",
                @"onload=",
                @"onclick=",
                @"onmouseover=",
                @"onfocus=",
                @"<iframe",
                @"</iframe",
                @"<object",
                @"<embed",
                @"<applet",
                @"eval\(",
                @"expression\(",
                @"vbscript:",
                @"data:text/html"
            };

            var lowerValue = value.ToLower();
            return !xssPatterns.Any(pattern => lowerValue.Contains(pattern));
        }

        /// <summary>
        /// Check if string contains SQL injection patterns
        /// Note: EF Core uses parameterized queries by default, but this adds extra layer
        /// </summary>
        public static bool NotContainSqlInjection(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return true;

            // Common SQL injection patterns
            var sqlPatterns = new[]
            {
                @"';",
                @"--;",
                @"/*",
                @"*/",
                @"xp_",
                @"sp_",
                @"exec(",
                @"execute(",
                @"union select",
                @"drop table",
                @"insert into",
                @"delete from",
                @"update set"
            };

            var lowerValue = value.ToLower();
            return !sqlPatterns.Any(pattern => lowerValue.Contains(pattern));
        }

        /// <summary>
        /// Sanitize string by removing dangerous characters
        /// </summary>
        public static string Sanitize(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return string.Empty;

            // Remove HTML tags
            value = System.Text.RegularExpressions.Regex.Replace(value, @"<[^>]*>", string.Empty);

            // Remove script tags content
            value = System.Text.RegularExpressions.Regex.Replace(value, @"<script[^>]*>.*?</script>", string.Empty, System.Text.RegularExpressions.RegexOptions.IgnoreCase);

            // Encode special characters
            value = System.Net.WebUtility.HtmlEncode(value);

            return value;
        }
    }
}

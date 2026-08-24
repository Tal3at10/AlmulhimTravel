using System.Net.Http.Headers;
using System.Text.Json;
using Core.Application.Abstraction.DTOs.Locations;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
namespace Infrastructure.Shared.Services
{
    /// <summary>
    /// API for smart autocomplete search suggestions (flights and hotels) using Duffel Places API
    /// </summary>
    
    public class LocationsService : ILocationsService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<LocationsService> _logger;

        private static readonly Dictionary<string, string> ArabicToEnglishTranslations = new(StringComparer.OrdinalIgnoreCase)
        {
            { "الرياض", "Riyadh" },
            { "جده", "Jeddah" },
            { "جدة", "Jeddah" },
            { "الدمام", "Dammam" },
            { "دبي", "Dubai" },
            { "سنغافورة", "Singapore" },
            { "سنغافوره", "Singapore" },
            { "سنغ", "Singapore" },
            { "لندن", "London" },
            { "باريس", "Paris" },
            { "اسطنبول", "Istanbul" },
            { "إسطنبول", "Istanbul" },
            { "كوالالمبور", "Kuala Lumpur" },
            { "القاهرة", "Cairo" },
            { "القاهره", "Cairo" },
            { "نيويورك", "New York" },
            { "بانكوك", "Bangkok" },
            { "روما", "Rome" },
            { "موسكو", "Moscow" },
            { "تبليسي", "Tbilisi" },
            { "ماليه", "Male" },
            { "المالديف", "Maldives" },
            { "مدريد", "Madrid" },
            { "برشلونة", "Barcelona" },
            { "طوكيو", "Tokyo" },
            { "ميونيخ", "Munich" },
            { "جنيف", "Geneva" },
            { "زيورخ", "Zurich" },
            { "فرانكفورت", "Frankfurt" },
            { "برلين", "Berlin" },
            { "أمستردام", "Amsterdam" },
            { "فيينا", "Vienna" },
            { "بروكسل", "Brussels" },
            { "أثينا", "Athens" },
            { "ميلان", "Milan" }
        };

        private static readonly List<object> LocalAirportsFallback = new()
        {
            new { code = "RUH", nameAr = "مطار الملك خالد الدولي", nameEn = "King Khalid International", cityAr = "الرياض", cityEn = "Riyadh", country = "السعودية" },
            new { code = "JED", nameAr = "مطار الملك عبدالعزيز الدولي", nameEn = "King Abdulaziz International", cityAr = "جدة", cityEn = "Jeddah", country = "السعودية" },
            new { code = "DMM", nameAr = "مطار الملك فهد الدولي", nameEn = "King Fahd International", cityAr = "الدمام", cityEn = "Dammam", country = "السعودية" },
            new { code = "DXB", nameAr = "مطار دبي الدولي", nameEn = "Dubai International", cityAr = "دبي", cityEn = "Dubai", country = "الإمارات" },
            new { code = "AUH", nameAr = "مطار أبوظبي الدولي", nameEn = "Abu Dhabi International", cityAr = "أبوظبي", cityEn = "Abu Dhabi", country = "الإمارات" },
            new { code = "IST", nameAr = "مطار إسطنبول", nameEn = "Istanbul Airport", cityAr = "إسطنبول", cityEn = "Istanbul", country = "تركيا" },
            new { code = "LHR", nameAr = "مطار هيثرو", nameEn = "Heathrow", cityAr = "لندن", cityEn = "London", country = "المملكة المتحدة" },
            new { code = "CDG", nameAr = "مطار شارل ديغول", nameEn = "Charles de Gaulle", cityAr = "باريس", cityEn = "Paris", country = "فرنسا" },
            new { code = "KUL", nameAr = "مطار كوالالمبور الدولي", nameEn = "Kuala Lumpur International", cityAr = "كوالالمبور", cityEn = "Kuala Lumpur", country = "ماليزيا" },
            new { code = "SIN", nameAr = "مطار شانغي", nameEn = "Changi", cityAr = "سنغافورة", cityEn = "Singapore", country = "سنغافورة" },
            new { code = "BKK", nameAr = "مطار سوفارنابومي", nameEn = "Suvarnabhumi", cityAr = "بانكوك", cityEn = "Bangkok", country = "تايلند" },
            new { code = "TBS", nameAr = "مطار تبليسي الدولي", nameEn = "Tbilisi International", cityAr = "تبليسي", cityEn = "Tbilisi", country = "جورجيا" },
            new { code = "CAI", nameAr = "مطار القاهرة الدولي", nameEn = "Cairo International", cityAr = "القاهرة", cityEn = "Cairo", country = "مصر" }
        };

        private static readonly List<object> LocalHotelsFallback = new()
        {
            new { code = "RUH", nameAr = "الرياض", nameEn = "Riyadh", country = "السعودية" },
            new { code = "JED", nameAr = "جدة", nameEn = "Jeddah", country = "السعودية" },
            new { code = "DXB", nameAr = "دبي", nameEn = "Dubai", country = "الإمارات" },
            new { code = "IST", nameAr = "إسطنبول", nameEn = "Istanbul", country = "تركيا" },
            new { code = "LON", nameAr = "لندن", nameEn = "London", country = "المملكة المتحدة" },
            new { code = "PAR", nameAr = "باريس", nameEn = "Paris", country = "فرنسا" },
            new { code = "KUL", nameAr = "كوالالمبور", nameEn = "Kuala Lumpur", country = "ماليزيا" },
            new { code = "BKK", nameAr = "بانكوك", nameEn = "Bangkok", country = "تايلند" },
            new { code = "CAI", nameAr = "القاهرة", nameEn = "Cairo", country = "مصر" },
            new { code = "SIN", nameAr = "سنغافورة", nameEn = "Singapore", country = "سنغافورة" },
            new { code = "NYC", nameAr = "نيويورك", nameEn = "New York", country = "الولايات المتحدة" }
        };

        public LocationsService(
            IHttpClientFactory httpClientFactory,
            IConfiguration config,
            ILogger<LocationsService> logger)
        {
            _httpClient = httpClientFactory.CreateClient();
            _config = config;
            _logger = logger;
        }

        /// <summary>
        /// Search hotel destinations dynamically using Duffel Places API
        /// </summary>
        
        public async Task<List<LocationSuggestionDto>> SearchHotelsAsync(string query, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return LocalHotelsFallback.Select(x => MapToDto(x)).ToList();
            }

            var cleanQuery = query.Trim();
            
            // Match locally first
            var localResults = LocalHotelsFallback.Where(h =>
            {
                var dict = (dynamic)h;
                return dict.nameAr.Contains(cleanQuery) ||
                       dict.nameEn.Contains(cleanQuery, StringComparison.OrdinalIgnoreCase) ||
                       dict.country.Contains(cleanQuery);
            }).ToList();

            try
            {
                var apiKey = _config["DuffelSettings:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                {
                    _logger.LogWarning("DuffelSettings API Key not configured, returning local hotel suggestions");
                    return localResults.Select(x => MapToDto(x)).ToList();
                }

                // Translate Arabic queries to English for Duffel lookup
                var searchKeyword = cleanQuery;
                if (ArabicToEnglishTranslations.TryGetValue(cleanQuery, out var translated))
                {
                    searchKeyword = translated;
                }
                else if (ContainsArabic(cleanQuery))
                {
                    // Fallback search locally if it's Arabic and not translated yet
                    return localResults.Select(x => MapToDto(x)).ToList();
                }

                var url = $"https://api.duffel.com/places/suggestions?query={Uri.EscapeDataString(searchKeyword)}";
                var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
                request.Headers.Add("Duffel-Version", "v2");
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await _httpClient.SendAsync(request, cancellationToken);
                if (!response.IsSuccessStatusCode)
                {
                    var errorResponse = await response.Content.ReadAsStringAsync(cancellationToken);
                    _logger.LogWarning("Duffel Places API returned status: {StatusCode} - {Error}", response.StatusCode, errorResponse);
                    return localResults.Select(x => MapToDto(x)).ToList();
                }

                var json = await response.Content.ReadAsStringAsync(cancellationToken);
                using var doc = JsonDocument.Parse(json);
                
                var apiResults = new List<object>();
                if (doc.RootElement.TryGetProperty("data", out var data) && data.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in data.EnumerateArray())
                    {
                        var type = item.TryGetProperty("type", out var t) ? t.GetString() : "";
                        // For hotels, we prefer cities
                        if (type == "city" || type == "airport")
                        {
                            var code = item.TryGetProperty("iata_code", out var c) ? c.GetString() : 
                                       (item.TryGetProperty("iata_city_code", out var icc) ? icc.GetString() : "");
                            var name = item.TryGetProperty("name", out var n) ? n.GetString() : "";
                            var cityName = item.TryGetProperty("city_name", out var cn) ? cn.GetString() : name;
                            var countryName = item.TryGetProperty("country_name", out var con) ? con.GetString() : "";

                            if (!string.IsNullOrEmpty(code))
                            {
                                var arabicCity = TranslateToArabic(cityName);
                                var arabicCountry = TranslateToArabic(countryName);

                                apiResults.Add(new
                                {
                                    code = code,
                                    nameAr = arabicCity,
                                    nameEn = cityName,
                                    country = arabicCountry
                                });
                            }
                        }
                    }
                }

                var combined = localResults.Concat(apiResults)
                    .GroupBy(x => ((dynamic)x).code)
                    .Select(g => g.First())
                    .ToList();

                return combined.Select(x => MapToDto(x)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling Duffel Places hotel search for: {Query}", cleanQuery);
                return localResults.Select(x => MapToDto(x)).ToList();
            }
        }

        /// <summary>
        /// Search airports and cities for flight offers using Duffel Places API
        /// </summary>
        
        public async Task<List<LocationSuggestionDto>> SearchFlightsAsync(string query, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return LocalAirportsFallback.Select(x => MapToDto(x)).ToList();
            }

            var cleanQuery = query.Trim();

            var localResults = LocalAirportsFallback.Where(a =>
            {
                var dict = (dynamic)a;
                return dict.code.Contains(cleanQuery, StringComparison.OrdinalIgnoreCase) ||
                       dict.cityAr.Contains(cleanQuery) ||
                       dict.cityEn.Contains(cleanQuery, StringComparison.OrdinalIgnoreCase) ||
                       dict.nameAr.Contains(cleanQuery);
            }).ToList();

            try
            {
                var apiKey = _config["DuffelSettings:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                {
                    _logger.LogWarning("DuffelSettings API Key not configured, returning local airport suggestions");
                    return localResults.Select(x => MapToDto(x)).ToList();
                }

                var searchKeyword = cleanQuery;
                if (ArabicToEnglishTranslations.TryGetValue(cleanQuery, out var translated))
                {
                    searchKeyword = translated;
                }
                else if (ContainsArabic(cleanQuery))
                {
                    return localResults.Select(x => MapToDto(x)).ToList();
                }

                var url = $"https://api.duffel.com/places/suggestions?query={Uri.EscapeDataString(searchKeyword)}";
                var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
                request.Headers.Add("Duffel-Version", "v2");
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await _httpClient.SendAsync(request, cancellationToken);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Duffel locations API returned status: {StatusCode}", response.StatusCode);
                    return localResults.Select(x => MapToDto(x)).ToList();
                }

                var json = await response.Content.ReadAsStringAsync(cancellationToken);
                using var doc = JsonDocument.Parse(json);
                
                var apiResults = new List<object>();
                if (doc.RootElement.TryGetProperty("data", out var data) && data.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in data.EnumerateArray())
                    {
                        var code = item.TryGetProperty("iata_code", out var c) ? c.GetString() : "";
                        var name = item.TryGetProperty("name", out var n) ? n.GetString() : "";
                        var type = item.TryGetProperty("type", out var t) ? t.GetString() : "";
                        var cityName = item.TryGetProperty("city_name", out var cn) ? cn.GetString() : name;
                        var countryName = item.TryGetProperty("country_name", out var con) ? con.GetString() : "";

                        if (!string.IsNullOrEmpty(code))
                        {
                            var arabicCity = TranslateToArabic(cityName);
                            var arabicCountry = TranslateToArabic(countryName);

                            apiResults.Add(new
                            {
                                code = code,
                                nameAr = type == "airport" ? $"مطار {name}" : arabicCity,
                                nameEn = name,
                                cityAr = arabicCity,
                                cityEn = cityName,
                                country = arabicCountry
                            });
                        }
                    }
                }

                var combined = localResults.Concat(apiResults)
                    .GroupBy(x => ((dynamic)x).code)
                    .Select(g => g.First())
                    .ToList();

                return combined.Select(x => MapToDto(x)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling Duffel location search for: {Query}", cleanQuery);
                return localResults.Select(x => MapToDto(x)).ToList();
            }
        }

                private static LocationSuggestionDto MapToDto(object obj)
        {
            var dict = (dynamic)obj;
            return new LocationSuggestionDto
            {
                Code = dict.code,
                NameAr = dict.nameAr,
                NameEn = dict.nameEn,
                CityAr = HasProperty(obj, "cityAr") ? dict.cityAr : null,
                CityEn = HasProperty(obj, "cityEn") ? dict.cityEn : null,
                Country = HasProperty(obj, "country") ? dict.country : string.Empty
            };
        }

        private static bool HasProperty(object obj, string propertyName)
        {
            return obj.GetType().GetProperty(propertyName) != null;
        }

        private static bool ContainsArabic(string text)
        {
            return text.Any(c => c >= 0x0600 && c <= 0x06FF);
        }

        private static string TranslateToArabic(string englishText)
        {
            if (string.IsNullOrEmpty(englishText)) return "";
            
            var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "Saudi Arabia", "السعودية" },
                { "Riyadh", "الرياض" },
                { "Jeddah", "جدة" },
                { "Dammam", "الدمام" },
                { "United Arab Emirates", "الإمارات" },
                { "Dubai", "دبي" },
                { "Abu Dhabi", "أبوظبي" },
                { "Turkey", "تركيا" },
                { "Istanbul", "إسطنبول" },
                { "United Kingdom", "المملكة المتحدة" },
                { "London", "لندن" },
                { "France", "فرنسا" },
                { "Paris", "باريس" },
                { "Malaysia", "ماليزيا" },
                { "Kuala Lumpur", "كوالالمبور" },
                { "Singapore", "سنغافورة" },
                { "Thailand", "تايلند" },
                { "Bangkok", "بانكوك" },
                { "Egypt", "مصر" },
                { "Cairo", "القاهرة" },
                { "Russia", "روسيا" },
                { "Moscow", "موسكو" },
                { "Georgia", "جورجيا" },
                { "Tbilisi", "تبليسي" },
                { "Maldives", "المالديف" },
                { "Male", "ماليه" },
                { "United States", "الولايات المتحدة" },
                { "New York", "نيويورك" },
                { "Italy", "إيطاليا" },
                { "Rome", "روما" },
                { "Spain", "إسبانيا" },
                { "Madrid", "مدريد" },
                { "Barcelona", "برشلونة" },
                { "Germany", "ألمانيا" },
                { "Munich", "ميونيخ" },
                { "Frankfurt", "فرانكفورت" },
                { "Switzerland", "سويسرا" },
                { "Geneva", "جنيف" },
                { "Zurich", "زيورخ" },
                { "Netherlands", "هولندا" },
                { "Amsterdam", "أمستردام" }
            };

            return dict.TryGetValue(englishText.Trim(), out var arabic) ? arabic : englishText;
        }
    }
}


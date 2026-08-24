using System.Text.RegularExpressions;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Shared.Services;

/// <summary>
/// Service for comparing hotel prices across multiple providers (Trivago-style)
/// Groups same hotels from different providers and shows price comparison
/// </summary>
public class HotelComparisonService : IHotelComparisonService
{
    private readonly IRapidApiHotelService _rapidApiService;
    private readonly IAmadeusService _amadeusService;
    private readonly ILogger<HotelComparisonService> _logger;

    // Provider display info
    private static readonly Dictionary<string, (string DisplayName, string Logo, string Color)> ProviderInfo = new()
    {
        { "booking", ("Booking.com", "https://cf.bstatic.com/static/img/favicon/favicon-32x32.png", "#003580") },
        { "tripadvisor", ("Tripadvisor", "https://static.tacdn.com/img2/branding/rebrand/TA_logo_primary.png", "#00AF87") },
        { "hotels.com", ("Hotels.com", "https://www.hotels.com/favicon.ico", "#D32F2F") },
        { "priceline", ("Priceline", "https://www.priceline.com/favicon.ico", "#0066CC") },
        { "amadeus", ("Amadeus", "https://amadeus.com/favicon.ico", "#005EB8") },
    };

    public HotelComparisonService(
        IRapidApiHotelService rapidApiService,
        IAmadeusService amadeusService,
        ILogger<HotelComparisonService> logger)
    {
        _rapidApiService = rapidApiService;
        _amadeusService = amadeusService;
        _logger = logger;
    }

    public async Task<List<HotelComparisonResultDto>> SearchAndCompareAsync(
        string destination,
        string checkIn,
        string checkOut,
        int adults = 2,
        int rooms = 1,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Starting hotel comparison search for {Destination}", destination);

        // Fetch from all providers in parallel
        var allHotels = await _rapidApiService.SearchAllProvidersAsync(
            destination, checkIn, checkOut, adults, rooms, cancellationToken);

        _logger.LogInformation("Retrieved {Count} hotels from all providers", allHotels.Count);

        // Group hotels by similarity (same hotel from different providers)
        var groupedHotels = GroupSimilarHotels(allHotels);

        _logger.LogInformation("Grouped into {Count} unique hotels", groupedHotels.Count);

        // Calculate number of nights for total price
        var nights = CalculateNights(checkIn, checkOut);

        // Transform to comparison results
        var results = groupedHotels.Select(group => CreateComparisonResult(group, nights)).ToList();

        // Sort by lowest price (hotels with prices first)
        results = results
            .OrderBy(h => h.LowestPrice == null)
            .ThenBy(h => h.LowestPrice ?? decimal.MaxValue)
            .ToList();

        return results;
    }

    /// <summary>
    /// Group hotels by similarity (name + location matching)
    /// </summary>
    private List<List<Core.Application.Abstraction.DTOs.RapidApi.NormalizedHotelDto>> GroupSimilarHotels(
        List<Core.Application.Abstraction.DTOs.RapidApi.NormalizedHotelDto> hotels)
    {
        var groups = new List<List<Core.Application.Abstraction.DTOs.RapidApi.NormalizedHotelDto>>();
        var used = new HashSet<string>();

        foreach (var hotel in hotels)
        {
            if (used.Contains(hotel.Id)) continue;

            var group = new List<Core.Application.Abstraction.DTOs.RapidApi.NormalizedHotelDto> { hotel };
            used.Add(hotel.Id);

            var normalizedName = NormalizeName(hotel.Name);

            // Find similar hotels from other providers
            foreach (var other in hotels)
            {
                if (used.Contains(other.Id)) continue;
                if (other.Provider == hotel.Provider) continue; // Different provider only

                var otherNormalizedName = NormalizeName(other.Name);

                // Check if names are similar
                if (AreSimilarNames(normalizedName, otherNormalizedName))
                {
                    // Additional check: if coordinates are available, verify they're close
                    if (hotel.Latitude.HasValue && other.Latitude.HasValue)
                    {
                        var distance = CalculateDistance(
                            hotel.Latitude.Value, hotel.Longitude!.Value,
                            other.Latitude.Value, other.Longitude!.Value);

                        // If more than 1km apart, probably different hotels
                        if (distance > 1.0) continue;
                    }

                    group.Add(other);
                    used.Add(other.Id);
                    _logger.LogDebug("Matched hotels: '{Hotel1}' ({Provider1}) with '{Hotel2}' ({Provider2})",
                        hotel.Name, hotel.Provider, other.Name, other.Provider);
                }
            }

            groups.Add(group);
        }

        return groups;
    }

    /// <summary>
    /// Normalize hotel name for comparison
    /// </summary>
    private static string NormalizeName(string name)
    {
        if (string.IsNullOrEmpty(name)) return "";

        // Convert to lowercase
        var normalized = name.ToLowerInvariant();

        // Remove common suffixes
        var suffixesToRemove = new[] { "hotel", "hotels", "resort", "resorts", "suites", "suite", 
            "inn", "lodge", "hostel", "motel", "apartments", "apartment", "residence", "residences",
            "فندق", "فنادق", "منتجع", "شقق", "شقة", "نزل" };

        foreach (var suffix in suffixesToRemove)
        {
            normalized = Regex.Replace(normalized, $@"\b{suffix}\b", "", RegexOptions.IgnoreCase);
        }

        // Remove special characters and extra spaces
        normalized = Regex.Replace(normalized, @"[^\w\s\u0600-\u06FF]", ""); // Keep Arabic chars
        normalized = Regex.Replace(normalized, @"\s+", " ").Trim();

        return normalized;
    }

    /// <summary>
    /// Check if two normalized names are similar
    /// </summary>
    private static bool AreSimilarNames(string name1, string name2)
    {
        if (string.IsNullOrEmpty(name1) || string.IsNullOrEmpty(name2)) return false;

        // Exact match after normalization
        if (name1 == name2) return true;

        // One contains the other (for cases like "Hilton" vs "Hilton London")
        if (name1.Contains(name2) || name2.Contains(name1))
        {
            // Only if the shorter name is at least 5 chars (to avoid false positives)
            var shorter = name1.Length < name2.Length ? name1 : name2;
            if (shorter.Length >= 5) return true;
        }

        // Calculate Levenshtein distance for fuzzy matching
        var distance = LevenshteinDistance(name1, name2);
        var maxLength = Math.Max(name1.Length, name2.Length);
        var similarity = 1.0 - (double)distance / maxLength;

        // 80% similarity threshold
        return similarity >= 0.8;
    }

    /// <summary>
    /// Levenshtein distance for fuzzy string matching
    /// </summary>
    private static int LevenshteinDistance(string s1, string s2)
    {
        var n = s1.Length;
        var m = s2.Length;
        var d = new int[n + 1, m + 1];

        if (n == 0) return m;
        if (m == 0) return n;

        for (var i = 0; i <= n; i++) d[i, 0] = i;
        for (var j = 0; j <= m; j++) d[0, j] = j;

        for (var i = 1; i <= n; i++)
        {
            for (var j = 1; j <= m; j++)
            {
                var cost = s1[i - 1] == s2[j - 1] ? 0 : 1;
                d[i, j] = Math.Min(
                    Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                    d[i - 1, j - 1] + cost);
            }
        }

        return d[n, m];
    }

    /// <summary>
    /// Calculate distance between two coordinates in km (Haversine formula)
    /// </summary>
    private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371; // Earth's radius in km

        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return R * c;
    }

    private static double ToRadians(double degrees) => degrees * Math.PI / 180;

    /// <summary>
    /// Calculate number of nights between dates
    /// </summary>
    private static int CalculateNights(string checkIn, string checkOut)
    {
        if (DateTime.TryParse(checkIn, out var inDate) && DateTime.TryParse(checkOut, out var outDate))
        {
            return (int)(outDate - inDate).TotalDays;
        }
        return 1;
    }

    /// <summary>
    /// Create a comparison result from a group of matched hotels
    /// </summary>
    private HotelComparisonResultDto CreateComparisonResult(
        List<Core.Application.Abstraction.DTOs.RapidApi.NormalizedHotelDto> group,
        int nights)
    {
        // Use the first hotel with best data as the "primary"
        var primary = group
            .OrderByDescending(h => h.MainPhotoUrl != null)
            .ThenByDescending(h => h.Rating ?? 0)
            .First();

        // Create offers from all providers
        var offers = group.Select(h => CreateProviderOffer(h, nights)).ToList();

        // Find lowest price
        var offersWithPrice = offers.Where(o => o.HasPrice && o.PricePerNight > 0).ToList();
        var lowestPriceOffer = offersWithPrice.MinBy(o => o.PricePerNight ?? decimal.MaxValue);

        // Combine photos from all providers
        var allPhotos = group
            .Where(h => h.PhotoUrls != null)
            .SelectMany(h => h.PhotoUrls!)
            .Distinct()
            .ToList();

        if (allPhotos.Count == 0 && primary.MainPhotoUrl != null)
        {
            allPhotos.Add(primary.MainPhotoUrl);
        }

        // Combine facilities from all providers
        var allFacilities = group
            .Where(h => h.Facilities != null)
            .SelectMany(h => h.Facilities!)
            .Distinct()
            .Take(10)
            .ToList();

        // Best rating from all providers
        var bestRating = group.Where(h => h.Rating.HasValue).MaxBy(h => h.Rating);
        var totalReviews = group.Where(h => h.ReviewCount.HasValue).Sum(h => h.ReviewCount ?? 0);

        return new HotelComparisonResultDto(
            Id: primary.Id,
            HotelName: primary.Name,
            NormalizedName: NormalizeName(primary.Name),
            City: primary.City,
            Address: primary.Address,
            Latitude: primary.Latitude,
            Longitude: primary.Longitude,
            StarRating: group.Max(h => h.StarRating),
            Rating: bestRating?.Rating,
            ReviewCount: totalReviews > 0 ? totalReviews : null,
            MainPhotoUrl: primary.MainPhotoUrl ?? allPhotos.FirstOrDefault(),
            PhotoUrls: allPhotos,
            Facilities: allFacilities.Count > 0 ? allFacilities : null,
            Offers: offers.OrderBy(o => o.PricePerNight ?? decimal.MaxValue).ToList(),
            LowestPrice: lowestPriceOffer?.PricePerNight,
            LowestPriceCurrency: lowestPriceOffer?.Currency,
            LowestPriceProvider: lowestPriceOffer?.Provider
        );
    }

    /// <summary>
    /// Create a provider offer from a hotel
    /// </summary>
    private ProviderOfferDto CreateProviderOffer(
        Core.Application.Abstraction.DTOs.RapidApi.NormalizedHotelDto hotel,
        int nights)
    {
        var hasInfo = ProviderInfo.TryGetValue(hotel.Provider, out var info);
        var displayName = hasInfo ? info.DisplayName : "Unknown";
        var logo = hasInfo ? info.Logo : "";
        var color = hasInfo ? info.Color : "#666";

        return new ProviderOfferDto(
            Provider: hotel.Provider,
            ProviderDisplayName: displayName,
            ProviderLogo: logo,
            ProviderColor: color,
            PricePerNight: hotel.PricePerNight,
            TotalPrice: hotel.PricePerNight.HasValue ? hotel.PricePerNight.Value * nights : null,
            Currency: hotel.Currency,
            RoomType: hotel.RoomType,
            BookingUrl: hotel.BookingUrl,
            HasPrice: hotel.PricePerNight.HasValue && hotel.PricePerNight.Value > 0,
            ProviderRating: hotel.Rating,
            ProviderReviewCount: hotel.ReviewCount
        );
    }
}

using System;

namespace Core.Application.Abstraction.Utils;

public static class MatchingAlgorithms
{
    private const double EarthRadiusKm = 6371.0;

    /// <summary>
    /// Calculates the Haversine distance between two coordinates in kilometers.
    /// </summary>
    public static double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
    {
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);

        lat1 = ToRadians(lat1);
        lat2 = ToRadians(lat2);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2) * Math.Cos(lat1) * Math.Cos(lat2);
        
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return EarthRadiusKm * c;
    }

    private static double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180.0;
    }

    /// <summary>
    /// Calculates the Levenshtein distance similarity percentage between two strings.
    /// Returns a value between 0.0 and 1.0, where 1.0 is a perfect match.
    /// </summary>
    public static double CalculateStringSimilarity(string source, string target)
    {
        if (string.IsNullOrEmpty(source) && string.IsNullOrEmpty(target)) return 1.0;
        if (string.IsNullOrEmpty(source) || string.IsNullOrEmpty(target)) return 0.0;
        if (source == target) return 1.0;

        source = source.ToLowerInvariant().Trim();
        target = target.ToLowerInvariant().Trim();
        
        int stepsToSame = ComputeLevenshteinDistance(source, target);
        return 1.0 - ((double)stepsToSame / Math.Max(source.Length, target.Length));
    }

    private static int ComputeLevenshteinDistance(string source, string target)
    {
        var n = source.Length;
        var m = target.Length;
        var d = new int[n + 1, m + 1];

        if (n == 0) return m;
        if (m == 0) return n;

        for (var i = 0; i <= n; d[i, 0] = i++) { }
        for (var j = 0; j <= m; d[0, j] = j++) { }

        for (var i = 1; i <= n; i++)
        {
            for (var j = 1; j <= m; j++)
            {
                var cost = (target[j - 1] == source[i - 1]) ? 0 : 1;
                d[i, j] = Math.Min(
                    Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                    d[i - 1, j - 1] + cost);
            }
        }
        return d[n, m];
    }
}

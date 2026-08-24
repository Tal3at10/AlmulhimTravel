using System.Collections.Generic;

namespace Core.Application.Abstraction.Services;

public static class CityCoordinatesMapper
{
    private static readonly Dictionary<string, (double Latitude, double Longitude)> _cityCoordinates = new(StringComparer.OrdinalIgnoreCase)
    {
        { "RUH", (24.7136, 46.6753) },    // Riyadh
        { "DXB", (25.2048, 55.2708) },    // Dubai
        { "JED", (21.4858, 39.1925) },    // Jeddah
        { "IST", (41.0082, 28.9784) },    // Istanbul
        { "SIN", (1.3521, 103.8198) },    // Singapore
        { "LHR", (51.5074, -0.1278) },    // London
        { "CDG", (48.8566, 2.3522) },     // Paris
        { "CAI", (30.0444, 31.2357) },    // Cairo
        { "DOH", (25.2854, 51.5310) },    // Doha
        { "KWI", (29.3759, 47.9774) },    // Kuwait City
        { "MCT", (23.5859, 58.4059) },    // Muscat
        { "BAH", (26.2285, 50.5860) },    // Manama
        { "MED", (24.4672, 39.6111) },    // Medina
        { "AMM", (31.9454, 35.9284) },    // Amman
        { "BEY", (33.8938, 35.5018) },    // Beirut
        { "AYT", (36.8969, 30.7133) },    // Antalya
        { "JFK", (40.7128, -74.0060) },   // New York
        { "LAX", (34.0522, -118.2437) },  // Los Angeles
        { "BKK", (13.7563, 100.5018) },   // Bangkok
        { "KUL", (3.1390, 101.6869) },    // Kuala Lumpur
        { "MLE", (4.1755, 73.5093) },     // Male (Maldives)
        { "CMB", (6.9271, 79.8612) },     // Colombo
        { "HKG", (22.3193, 114.1694) },   // Hong Kong
        { "NRT", (35.6762, 139.6503) },   // Tokyo
        { "ICN", (37.5665, 126.9780) },   // Seoul
        { "FRA", (50.1109, 8.6821) },     // Frankfurt
        { "MUC", (48.1351, 11.5820) },    // Munich
        { "FCO", (41.9028, 12.4964) },    // Rome
        { "MXP", (45.4642, 9.1900) },     // Milan
        { "MAD", (40.4168, -3.7038) },    // Madrid
        { "BCN", (41.3879, 2.1699) },     // Barcelona
        { "AMS", (52.3676, 4.9041) },     // Amsterdam
        { "ZRH", (47.3769, 8.5417) },     // Zurich
        { "GVA", (46.2044, 6.1432) },     // Geneva
        { "VIE", (48.2082, 16.3738) },    // Vienna
        { "PRG", (50.0755, 14.4378) },    // Prague
        { "BUD", (47.4979, 19.0402) },    // Budapest
        { "ATH", (37.9838, 23.7275) },    // Athens
        { "YYZ", (43.6510, -79.3470) },   // Toronto
        { "YVR", (49.2827, -123.1207) },  // Vancouver
        { "SYD", (-33.8688, 151.2093) },  // Sydney
        { "MEL", (-37.8136, 144.9631) },  // Melbourne
        { "AKL", (-36.8485, 174.7633) },  // Auckland
    };

    /// <summary>
    /// Gets coordinates for an IATA city code. Returns default test coordinates if not found.
    /// </summary>
    public static (double Latitude, double Longitude) GetCoordinates(string cityCode)
    {
        if (_cityCoordinates.TryGetValue(cityCode, out var coords))
        {
            return coords;
        }

        // Default to London if not found
        return (51.5074, -0.1278);
    }
}

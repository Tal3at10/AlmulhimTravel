namespace Infrastructure.Shared.Services;

public static class HotelbedsDestinationMapper
{
    private static readonly Dictionary<string, string> _iataToHotelbeds = new(StringComparer.OrdinalIgnoreCase)
    {
        { "DXB", "DXB" }, // Dubai
        { "RUH", "RUH" }, // Riyadh
        { "JED", "JED" }, // Jeddah
        { "IST", "IST" }, // Istanbul
        { "CAI", "CAI" }, // Cairo
        { "LHR", "LON" }, // London Heathrow -> London
        { "LGW", "LON" }, // London Gatwick -> London
        { "CDG", "PAR" }, // Paris Charles de Gaulle -> Paris
        { "ORY", "PAR" }, // Paris Orly -> Paris
        { "TBS", "TBS" }, // Tbilisi
        { "DOH", "DOH" }, // Doha
        { "AUH", "AUH" }, // Abu Dhabi
        { "KWI", "KWI" }, // Kuwait
        { "MCT", "MCT" }, // Muscat
        { "AMM", "AMM" }, // Amman
        { "BEY", "BEY" }, // Beirut
        { "CMN", "CAS" }, // Casablanca
        { "JFK", "NYC" }, // New York JFK -> NYC
        { "EWR", "NYC" }, // Newark -> NYC
        { "LAX", "LAX" }, // Los Angeles
        { "BKK", "BKK" }, // Bangkok
        { "KUL", "KUL" }, // Kuala Lumpur
        { "SIN", "SIN" }, // Singapore
        { "HKG", "HKG" }, // Hong Kong
        { "NRT", "TYO" }, // Tokyo Narita -> Tokyo
        { "HND", "TYO" }, // Tokyo Haneda -> Tokyo
        { "FRA", "FRA" }, // Frankfurt
        { "MUC", "MUC" }, // Munich
        { "AMS", "AMS" }, // Amsterdam
        { "FCO", "ROM" }, // Rome
        { "MXP", "MIL" }, // Milan
        { "MAD", "MAD" }, // Madrid
        { "BCN", "BCN" }  // Barcelona
    };

    public static string GetDestinationCode(string iataCode)
    {
        if (string.IsNullOrWhiteSpace(iataCode))
            return "DXB"; // Default fallback

        if (_iataToHotelbeds.TryGetValue(iataCode, out var hotelbedsCode))
        {
            return hotelbedsCode;
        }

        // If not found in mapping, try using the IATA code directly
        return iataCode;
    }
}

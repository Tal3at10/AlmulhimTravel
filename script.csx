using System;
using System.IO;
using System.Text.RegularExpressions;

var filePath = @"E:\Projects\AlMulhim-Travel\backend\src\Infrastructure.Shared\Services\HotelAggregatorService.cs";
var content = File.ReadAllText(filePath);

var usingStatement = "using Core.Application.Utils;\n";
if (!content.Contains("using Core.Application.Utils;")) {
    content = usingStatement + content;
}

var oldLogic = @"        // Basic Deduplication based on exact name or location (In a real scenario, use geocoordinates and normalized names)
        var grouped = allHotels.GroupBy(h => h.Name.ToLowerInvariant());
        var uniqueHotels = new List<HotelSearchResultDto>();

        foreach (var group in grouped)
        {
            // Pick the cheapest one
            var bestOption = group.OrderBy(h => h.Price).First();
            uniqueHotels.Add(bestOption);
        }";

var newLogic = @"        var uniqueHotels = new List<HotelSearchResultDto>();
        var unassignedHotels = new List<HotelSearchResultDto>(allHotels);

        while (unassignedHotels.Any())
        {
            var current = unassignedHotels.First();
            unassignedHotels.RemoveAt(0);

            var group = new List<HotelSearchResultDto> { current };

            // Find all matches for the current hotel
            for (int i = unassignedHotels.Count - 1; i >= 0; i--)
            {
                var candidate = unassignedHotels[i];
                bool isMatch = false;

                // Try to match by Geography if available (Distance < 0.5 KM)
                if (current.Latitude.HasValue && current.Longitude.HasValue &&
                    candidate.Latitude.HasValue && candidate.Longitude.HasValue)
                {
                    var distance = MatchingAlgorithms.CalculateHaversineDistance(
                        current.Latitude.Value, current.Longitude.Value,
                        candidate.Latitude.Value, candidate.Longitude.Value);
                        
                    if (distance < 0.5)
                    {
                        // Double check with name similarity > 70% to avoid matching different hotels in the same block
                        var similarity = MatchingAlgorithms.CalculateStringSimilarity(current.Name, candidate.Name);
                        if (similarity >= 0.70) isMatch = true;
                    }
                }
                else
                {
                    // Fallback to name similarity > 85%
                    var similarity = MatchingAlgorithms.CalculateStringSimilarity(current.Name, candidate.Name);
                    if (similarity >= 0.85) isMatch = true;
                }

                if (isMatch)
                {
                    group.Add(candidate);
                    unassignedHotels.RemoveAt(i);
                }
            }

            // Pick the cheapest one
            var bestOption = group.OrderBy(h => h.Price).First();
            uniqueHotels.Add(bestOption);
        }";

content = content.Replace(oldLogic, newLogic);
File.WriteAllText(filePath, content);
Console.WriteLine("Done.");

using System.Net.Http.Headers;
using System.Text.Json;
using Core.Application.Abstraction.DTOs.RapidApi;
using Core.Application.Abstraction.Services;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Shared.Services;

/// <summary>
/// RapidAPI integration service for Booking.com and Tripadvisor
/// </summary>
public partial class RapidApiHotelService
{

    public async Task<List<NormalizedHotelDto>> SearchAllProvidersAsync(
        string destination,
        string checkIn,
        string checkOut,
        int adults = 2,
        int rooms = 1,
        CancellationToken cancellationToken = default)
    {
        var results = new List<NormalizedHotelDto>();

        _logger.LogInformation("Starting multi-provider search for {Destination} from ALL 4 providers", destination);

        // Search ALL providers in parallel for maximum speed
        var bookingTask = SearchBookingHotelsAsync(destination, checkIn, checkOut, adults, rooms, cancellationToken);
        var tripadvisorLocationTask = GetTripadvisorLocationIdAsync(destination, cancellationToken);
        var hotelsComTask = SearchHotelsComAsync(destination, checkIn, checkOut, adults, rooms, cancellationToken);
        var pricelineTask = SearchPricelineHotelsAsync(destination, checkIn, checkOut, adults, rooms, cancellationToken);

        // Wait for location ID first for Tripadvisor
        await Task.WhenAll(bookingTask, tripadvisorLocationTask, hotelsComTask, pricelineTask);

        var bookingResults = await bookingTask;
        var tripadvisorLocationId = await tripadvisorLocationTask;
        var hotelsComResults = await hotelsComTask;
        var pricelineResults = await pricelineTask;

        _logger.LogInformation("Provider results - Booking: {Booking}, Hotels.com: {HotelsCom}, Priceline: {Priceline}", 
            bookingResults.Count, hotelsComResults.Count, pricelineResults.Count);

        // Add Booking.com results
        foreach (var hotel in bookingResults)
        {
            results.Add(new NormalizedHotelDto(
                Id: $"booking_{hotel.HotelId}",
                Provider: "booking",
                Name: hotel.Name,
                Address: hotel.Address,
                City: hotel.City,
                Latitude: hotel.Latitude,
                Longitude: hotel.Longitude,
                StarRating: hotel.StarRating,
                Rating: hotel.ReviewScore,
                ReviewCount: hotel.ReviewCount,
                MainPhotoUrl: hotel.MainPhotoUrl,
                PhotoUrls: hotel.PhotoUrls,
                PricePerNight: hotel.PricePerNight,
                Currency: hotel.Currency,
                RoomType: null,
                Facilities: hotel.Facilities,
                BookingUrl: hotel.BookingUrl
            ));
        }

        // Add Hotels.com results
        results.AddRange(hotelsComResults);

        // Add Priceline results
        results.AddRange(pricelineResults);

        // Add Tripadvisor results if we got a location ID
        if (!string.IsNullOrEmpty(tripadvisorLocationId))
        {
            _logger.LogInformation("Tripadvisor location ID: {LocationId}", tripadvisorLocationId);
            var tripadvisorResults = await SearchTripadvisorHotelsAsync(tripadvisorLocationId, cancellationToken);
            
            _logger.LogInformation("Tripadvisor returned {Count} hotels", tripadvisorResults.Count);
            
            foreach (var hotel in tripadvisorResults)
            {
                var tripadvisorUrl = $"https://www.tripadvisor.com/Hotel_Review-g{tripadvisorLocationId}-d{hotel.LocationId}";
                
                results.Add(new NormalizedHotelDto(
                    Id: $"tripadvisor_{hotel.LocationId}",
                    Provider: "tripadvisor",
                    Name: hotel.Name,
                    Address: hotel.Address,
                    City: destination,
                    Latitude: hotel.Latitude,
                    Longitude: hotel.Longitude,
                    StarRating: 0,
                    Rating: double.TryParse(hotel.Rating, out var r) ? r * 2 : null,
                    ReviewCount: hotel.NumReviews,
                    MainPhotoUrl: hotel.PhotoUrl,
                    PhotoUrls: hotel.Photos?.Select(p => p.Large ?? p.Medium ?? p.Small ?? "").ToList(),
                    PricePerNight: null,
                    Currency: null,
                    RoomType: null,
                    Facilities: null,
                    BookingUrl: tripadvisorUrl
                ));
            }
        }
        else
        {
            _logger.LogWarning("Could not get Tripadvisor location ID for {Destination}", destination);
        }

        _logger.LogInformation("Combined search found {Count} hotels from ALL providers for {Destination}",
            results.Count, destination);

        // Sort by price (cheapest first)
        return results.OrderBy(h => h.PricePerNight ?? decimal.MaxValue).ToList();
    }

}


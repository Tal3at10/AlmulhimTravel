using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.DTOs.Hotels;
using Core.Application.Abstraction.Services;

namespace Infrastructure.Shared.Services
{
    public class MockHotelProvider : IHotelProvider
    {
        public string ProviderName => "MockProvider";

        public Task<List<HotelSearchResultDto>> SearchAsync(HotelSearchQuery query, CancellationToken ct = default)
        {
            var results = new List<HotelSearchResultDto>
            {
                new HotelSearchResultDto(
                    "MOCK-1", "Grand Plaza Resort & Spa", ProviderName, 5, 9.2m, 340, "Superb", "Downtown Dubai", "1.2 km from center",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                    new List<string> { "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" },
                    120.50m, 150.00m, 20, 1, 2, "Deluxe King Room",
                    new List<string> { "Top Choice", "Breakfast Included" },
                    new List<string> { "Free WiFi", "Pool", "Spa", "Gym" },
                    query.Currency ?? "USD", 25.2048, 55.2708
                ),
                new HotelSearchResultDto(
                    "MOCK-2", "Royal City Center Hotel", ProviderName, 4, 8.5m, 120, "Very Good", "City Center", "0.5 km from center",
                    "https://images.unsplash.com/photo-1551882547-ff40c0dfe09a?auto=format&fit=crop&w=800&q=80",
                    new List<string> { "https://images.unsplash.com/photo-1551882547-ff40c0dfe09a?auto=format&fit=crop&w=800&q=80" },
                    85.00m, 90.00m, 5, 1, 2, "Standard Room",
                    new List<string> { "Best Value" },
                    new List<string> { "Free WiFi", "Restaurant", "Bar" },
                    query.Currency ?? "USD", 25.2048, 55.2708
                ),
                new HotelSearchResultDto(
                    "MOCK-3", "Oasis Boutique Hotel", ProviderName, 5, 9.5m, 890, "Exceptional", "Beachfront", "5 km from center",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
                    new List<string> { "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" },
                    150.00m, 200.00m, 25, 1, 2, "Suite with Sea View",
                    new List<string> { "Beachfront", "Luxury" },
                    new List<string> { "Free WiFi", "Pool", "Beach Access", "Spa" },
                    query.Currency ?? "USD", 25.2048, 55.2708
                )
            };
            return Task.FromResult(results);
        }

        public Task<HotelDetailDto?> GetDetailsAsync(string hotelId, HotelSearchQuery query, CancellationToken ct = default)
        {
            var details = new HotelDetailDto(
                hotelId, hotelId == "MOCK-1" ? "Grand Plaza Resort & Spa" : "Royal City Center Hotel", ProviderName, 5, 9.2m, 340, "Superb", "Downtown Dubai", "Main St 123",
                "Experience luxury and comfort in the heart of the city.",
                new List<string>
                {
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1542314831-c6a4d14d8373?auto=format&fit=crop&w=800&q=80"
                },
                25.2048, 55.2708, "14:00", "12:00",
                new List<string> { "Free WiFi", "Swimming Pool", "Spa", "Gym" },
                new List<string> { "City View", "Near Metro" },
                new List<string> { }.Select(x => new RoomTypeDto("", "", new List<string>(), 0, "", "", new List<string>(), new List<RatePlanDto>())).ToList()
            );
            return Task.FromResult<HotelDetailDto?>(details);
        }

        public Task<List<RoomTypeDto>> GetRoomsAsync(string hotelId, HotelSearchQuery query, CancellationToken ct = default)
        {
            var rooms = new List<RoomTypeDto>
            {
                new RoomTypeDto(
                    "ROOM-1", "Deluxe King Room", new List<string> { "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" },
                    2, "1 King Bed", "45 sqm", new List<string> { "Air Conditioning", "TV", "Mini Bar" },
                    new List<RatePlanDto>
                    {
                        new RatePlanDto("RATE-1", "Standard Rate", "ROOM_ONLY", 120.50m, 150.00m, 20, true, "Free cancellation up to 24 hours", 5)
                    }
                )
            };
            return Task.FromResult(rooms);
        }

        public Task<BookingConfirmationDto?> CreateBookingAsync(BookingRequest request, CancellationToken ct = default)
        {
            var confirmation = new BookingConfirmationDto(
                "MOCK-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                "PRV-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                "CONFIRMED",
                120.50m,
                "USD"
            );
            return Task.FromResult<BookingConfirmationDto?>(confirmation);
        }

        public Task<BookingStatusDto?> GetBookingStatusAsync(string bookingRef, CancellationToken ct = default)
        {
            var status = new BookingStatusDto(bookingRef, "CONFIRMED", "Your booking is confirmed.");
            return Task.FromResult<BookingStatusDto?>(status);
        }

        public Task<bool> CancelBookingAsync(string bookingRef, CancellationToken ct = default)
        {
            return Task.FromResult(true);
        }
    }
}

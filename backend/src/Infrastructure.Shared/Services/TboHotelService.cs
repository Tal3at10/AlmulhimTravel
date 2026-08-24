using Core.Application.Abstraction.DTOs.Hotels;
using Core.Application.Abstraction.Services;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Shared.Services;

public class TboHotelService : IHotelProvider
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<TboHotelService> _logger;
    private readonly TboSettings _settings;

    public string ProviderName => "TBO";

    public TboHotelService(ILogger<TboHotelService> logger, IHttpClientFactory httpClientFactory, IOptions<TboSettings> settings)
    {
        _logger = logger;
        _settings = settings.Value;
        
        _httpClient = httpClientFactory.CreateClient("TboHotels");
        if (!string.IsNullOrEmpty(_settings.BaseUrl))
        {
            _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
        }
    }

    public Task<List<HotelSearchResultDto>> SearchAsync(HotelSearchQuery query, CancellationToken ct = default)
    {
        _logger.LogInformation("TBO Hotel SearchAsync called for City: {CityCode}", query.CityCode);
        return Task.FromResult(new List<HotelSearchResultDto>());
    }

    public Task<HotelDetailDto?> GetDetailsAsync(string hotelId, HotelSearchQuery query, CancellationToken ct = default)
    {
        return Task.FromResult<HotelDetailDto?>(null);
    }

    public Task<List<RoomTypeDto>> GetRoomsAsync(string hotelId, HotelSearchQuery query, CancellationToken ct = default)
    {
        return Task.FromResult(new List<RoomTypeDto>());
    }

    public Task<BookingConfirmationDto?> CreateBookingAsync(BookingRequest request, CancellationToken ct = default)
    {
        return Task.FromResult<BookingConfirmationDto?>(null);
    }

    public Task<BookingStatusDto?> GetBookingStatusAsync(string bookingRef, CancellationToken ct = default)
    {
        return Task.FromResult<BookingStatusDto?>(null);
    }

    public Task<bool> CancelBookingAsync(string bookingRef, CancellationToken ct = default)
    {
        return Task.FromResult(false);
    }
}

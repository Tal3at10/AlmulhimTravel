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
public partial class RapidApiHotelService : IRapidApiHotelService
{
    private readonly HttpClient _httpClient;
    private readonly RapidApiSettings _settings;
    private readonly ILogger<RapidApiHotelService> _logger;

    // Pre-defined city destination IDs for common cities
    private static readonly Dictionary<string, string> CityDestinationIds = new(StringComparer.OrdinalIgnoreCase)
    {
        { "london", "-2601889" },
        { "لندن", "-2601889" },
        { "dubai", "-782831" },
        { "دبي", "-782831" },
        { "istanbul", "-755070" },
        { "إسطنبول", "-755070" },
        { "paris", "-1456928" },
        { "باريس", "-1456928" },
        { "kuala lumpur", "-2403010" },
        { "كوالالمبور", "-2403010" },
        { "bangkok", "-3414440" },
        { "بانكوك", "-3414440" },
        { "cairo", "-290692" },
        { "القاهرة", "-290692" },
        { "riyadh", "-3170090" },
        { "الرياض", "-3170090" },
        { "jeddah", "-3098808" },
        { "جدة", "-3098808" },
        { "moscow", "-2960561" },
        { "موسكو", "-2960561" },
        { "singapore", "-73635" },
        { "سنغافورة", "-73635" },
        { "new york", "20088325" },
        { "نيويورك", "20088325" },
    };

    public RapidApiHotelService(
        IOptions<RapidApiSettings> settings,
        ILogger<RapidApiHotelService> logger,
        IHttpClientFactory httpClientFactory)
    {
        _settings = settings.Value;
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient("RapidApi");
    }










}


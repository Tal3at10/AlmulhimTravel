using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace APIs.Controllers;

[Route("api/[controller]")]
public class WeatherController : BaseApiController
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WeatherController> _logger;

    public WeatherController(IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<WeatherController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet("{city}")]
    [ResponseCache(Duration = 3600, VaryByQueryKeys = new[] { "city" })] // Cache for 1 hour
    public async Task<IActionResult> GetWeather(string city, CancellationToken cancellationToken)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            
            // Step 1: Geocode city name to get lat/long using Open-Meteo Geocoding API
            var geoUrl = $"https://geocoding-api.open-meteo.com/v1/search?name={Uri.EscapeDataString(city)}&count=1&language=en&format=json";
            var geoResponse = await client.GetAsync(geoUrl, cancellationToken);
            
            if (!geoResponse.IsSuccessStatusCode)
                return BadRequest(new { success = false, message = "Failed to geocode city" });

            var geoContent = await geoResponse.Content.ReadAsStringAsync(cancellationToken);
            using var geoDoc = JsonDocument.Parse(geoContent);
            
            if (!geoDoc.RootElement.TryGetProperty("results", out var results) || results.GetArrayLength() == 0)
                return NotFound(new { success = false, message = "City not found" });

            var location = results[0];
            var lat = location.GetProperty("latitude").GetDouble();
            var lon = location.GetProperty("longitude").GetDouble();

            // Step 2: Get weather using coordinates
            var weatherUrl = $"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true";
            var weatherResponse = await client.GetAsync(weatherUrl, cancellationToken);
            
            if (!weatherResponse.IsSuccessStatusCode)
                return BadRequest(new { success = false, message = "Failed to fetch weather data" });

            var weatherContent = await weatherResponse.Content.ReadAsStringAsync(cancellationToken);
            using var weatherDoc = JsonDocument.Parse(weatherContent);
            var currentWeather = weatherDoc.RootElement.GetProperty("current_weather");
            
            var temp = currentWeather.GetProperty("temperature").GetDouble();
            var weathercode = currentWeather.GetProperty("weathercode").GetInt32();
            
            // Simple mapping of WMO Weather interpretation codes to our UI conditions
            var condition = "Clear";
            var icon = "01d"; // sunny
            
            if (weathercode >= 1 && weathercode <= 3) { condition = "Partly Cloudy"; icon = "02d"; }
            else if (weathercode >= 45 && weathercode <= 48) { condition = "Fog"; icon = "50d"; }
            else if (weathercode >= 51 && weathercode <= 67) { condition = "Rain"; icon = "10d"; }
            else if (weathercode >= 71 && weathercode <= 77) { condition = "Snow"; icon = "13d"; }
            else if (weathercode >= 80 && weathercode <= 82) { condition = "Rain Showers"; icon = "09d"; }
            else if (weathercode >= 95) { condition = "Thunderstorm"; icon = "11d"; }

            return Ok(new
            {
                success = true,
                data = new
                {
                    temp = Math.Round(temp, 1),
                    condition = condition,
                    icon = icon
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching weather for {City}", city);
            return StatusCode(500, new { success = false, message = "Internal server error" });
        }
    }
}

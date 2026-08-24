using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Core.Application.Abstraction.DTOs.Amadeus;
using Core.Application.Abstraction.Services;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Shared.Services;

/// <summary>
/// Duffel API integration service implementation
/// Provides real-time flight data from Duffel as an alternative to Amadeus
/// </summary>
public class DuffelService : IDuffelService
{
    private readonly HttpClient _httpClient;
    private readonly DuffelSettings _settings;
    private readonly ILogger<DuffelService> _logger;

    public DuffelService(
        IOptions<DuffelSettings> settings,
        ILogger<DuffelService> logger,
        IHttpClientFactory httpClientFactory)
    {
        _settings = settings.Value;
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient("Duffel");
        
        // Setup Duffel headers
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ApiKey);
        _httpClient.DefaultRequestHeaders.Add("Duffel-Version", "v2");
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<List<AmadeusFlightOfferDto>> SearchFlightsAsync(
        FlightSearchRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // 1. Prepare Duffel Offer Request payload
            var slices = new List<object>
            {
                new
                {
                    origin = request.Origin,
                    destination = request.Destination,
                    departure_date = request.DepartureDate
                }
            };

            if (!string.IsNullOrEmpty(request.ReturnDate))
            {
                slices.Add(new
                {
                    origin = request.Destination,
                    destination = request.Origin,
                    departure_date = request.ReturnDate
                });
            }

            var passengers = new List<object>();
            for (int i = 0; i < request.Adults; i++)
            {
                passengers.Add(new { type = "adult" });
            }

            string cabinClass = request.TravelClass?.ToLower() switch
            {
                "business" => "business",
                "first" => "first",
                "premium_economy" => "premium_economy",
                _ => "economy"
            };

            var payload = new
            {
                data = new
                {
                    slices = slices,
                    passengers = passengers,
                    cabin_class = cabinClass,
                    return_offers = true // We want the offers immediately in the response
                }
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            // 2. Call Duffel API
            var url = $"{_settings.BaseUrl.TrimEnd('/')}/air/offer_requests";
            var response = await _httpClient.PostAsync(url, jsonContent, cancellationToken);
            var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Duffel flight search failed: {StatusCode} - {Response}", response.StatusCode, responseJson);
                return new List<AmadeusFlightOfferDto>();
            }

            // 3. Parse Duffel response to Amadeus DTOs (to keep frontend working)
            using var doc = JsonDocument.Parse(responseJson);
            var results = new List<AmadeusFlightOfferDto>();

            if (doc.RootElement.TryGetProperty("data", out var data) && 
                data.TryGetProperty("offers", out var offers))
            {
                foreach (var offer in offers.EnumerateArray())
                {
                    var id = offer.GetProperty("id").GetString() ?? "";
                    var totalAmountStr = offer.GetProperty("total_amount").GetString() ?? "0";
                    var currency = offer.GetProperty("total_currency").GetString() ?? "SAR";
                    
                    // Parse slices (itineraries)
                    var flightItineraries = new List<FlightItineraryDto>();
                    if (offer.TryGetProperty("slices", out var offerSlices))
                    {
                        foreach (var slice in offerSlices.EnumerateArray())
                        {
                            var durationIso = slice.GetProperty("duration").GetString() ?? "";
                            var flightSegments = new List<FlightSegmentDto>();

                            if (slice.TryGetProperty("segments", out var offerSegments))
                            {
                                foreach (var segment in offerSegments.EnumerateArray())
                                {
                                    var operatingCarrier = segment.GetProperty("operating_carrier");
                                    var carrierName = operatingCarrier.ValueKind != JsonValueKind.Null ? operatingCarrier.GetProperty("name").GetString() ?? "" : "";
                                    var carrierCode = operatingCarrier.ValueKind != JsonValueKind.Null ? operatingCarrier.GetProperty("iata_code").GetString() ?? "" : "";
                                    var flightNumber = segment.GetProperty("operating_carrier_flight_number").GetString() ?? "";
                                    
                                    var origin = segment.GetProperty("origin");
                                    var destination = segment.GetProperty("destination");
                                    
                                    var depAirport = origin.GetProperty("iata_code").GetString() ?? "";
                                    var arrAirport = destination.GetProperty("iata_code").GetString() ?? "";
                                    
                                    var depTime = segment.GetProperty("departing_at").GetString() ?? "";
                                    var arrTime = segment.GetProperty("arriving_at").GetString() ?? "";
                                    
                                    var duration = segment.GetProperty("duration").GetString() ?? "";
                                    
                                    // Aircraft
                                    var aircraft = segment.TryGetProperty("aircraft", out var ac) && ac.ValueKind != JsonValueKind.Null
                                        ? ac.GetProperty("name").GetString() 
                                        : null;

                                    flightSegments.Add(new FlightSegmentDto(
                                        CarrierCode: carrierCode,
                                        CarrierName: carrierName,
                                        FlightNumber: flightNumber,
                                        DepartureAirport: depAirport,
                                        DepartureTime: depTime,
                                        DepartureTerminal: origin.TryGetProperty("terminal", out var dt) && dt.ValueKind != JsonValueKind.Null ? dt.GetString() : null,
                                        ArrivalAirport: arrAirport,
                                        ArrivalTime: arrTime,
                                        ArrivalTerminal: destination.TryGetProperty("terminal", out var at) && at.ValueKind != JsonValueKind.Null ? at.GetString() : null,
                                        Duration: duration,
                                        Aircraft: aircraft,
                                        NumberOfStops: 0 // Duffel segments are direct
                                    ));
                                }
                            }

                            flightItineraries.Add(new FlightItineraryDto(
                                Duration: durationIso,
                                Segments: flightSegments
                            ));
                        }
                    }

                    results.Add(new AmadeusFlightOfferDto(
                        Id: id,
                        Price: decimal.Parse(totalAmountStr),
                        Currency: currency,
                        NumberOfBookableSeats: 9, // Duffel doesn't always specify this upfront
                        Itineraries: flightItineraries
                    ));
                }
            }

            _logger.LogInformation("Found {Count} flight offers from {Origin} to {Destination} via Duffel",
                results.Count, request.Origin, request.Destination);

            return results.OrderBy(f => f.Price).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching flights via Duffel from {Origin} to {Destination}",
                request.Origin, request.Destination);
            return new List<AmadeusFlightOfferDto>();
        }
    }

    public async Task<string> GetRawOfferAsync(string offerId, CancellationToken cancellationToken = default)
    {
        try
        {
            var url = $"{_settings.BaseUrl.TrimEnd('/')}/air/offers/{offerId}?return_available_services=true";
            var response = await _httpClient.GetAsync(url, cancellationToken);
            var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Duffel get offer failed: {StatusCode} - {Response}", response.StatusCode, responseJson);
                return null;
            }

            return responseJson;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting offer {OfferId} from Duffel", offerId);
            return null;
        }
    }

    public async Task<string> CreateClientKeyAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var url = $"{_settings.BaseUrl.TrimEnd('/')}/identity/component_client_keys";
            // Empty payload for general client key
            var payload = new { };
            var jsonContent = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(url, jsonContent, cancellationToken);
            var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Duffel create client key failed: {StatusCode} - {Response}", response.StatusCode, responseJson);
                return null;
            }

            return responseJson;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Duffel client key");
            return null;
        }
    }

    #region Hotels (Stays)



    public async Task<string> CreateFlightOrderAsync(Core.Application.Abstraction.DTOs.Reservations.CreateFlightBookingDto request, CancellationToken cancellationToken = default)
    {
        try
        {
            var url = $"{_settings.BaseUrl.TrimEnd('/')}/air/orders";
            
            // Map passengers to Duffel's structure
            var passengers = request.Passengers.Select(p => new
            {
                id = p.Id,
                type = p.PassengerType.ToLower() == "child" ? "child" : (p.PassengerType.ToLower() == "infant" ? "infant" : "adult"),
                title = "mr", // simplified
                given_name = p.FirstName,
                family_name = p.LastName,
                born_on = p.DateOfBirth.ToString("yyyy-MM-dd"),
                email = request.GuestEmail,
                phone_number = request.GuestPhone.StartsWith("+") ? request.GuestPhone : "+966500000000",
                gender = "m",
            }).ToList();

            // Construct payload to create a Duffel order using the OutboundFlightId as the selected_offer
            var payload = new
            {
                data = new
                {
                    selected_offers = new[] { request.OfferId ?? request.OutboundFlightId.ToString() },
                    passengers = passengers,
                    payments = new[]
                    {
                        new { type = "balance", currency = "SAR", amount = request.FlightPrice?.ToString() ?? "0" }
                    }
                }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, jsonContent, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogWarning("Duffel Flight Order failed: {StatusCode} - {Error}", response.StatusCode, error);
                throw new InvalidOperationException($"Flight booking failed: {error}");
            }

            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            using var doc = JsonDocument.Parse(json);
            if (doc.RootElement.TryGetProperty("data", out var data) && data.TryGetProperty("booking_reference", out var pnr))
            {
                return pnr.GetString() ?? throw new InvalidOperationException("Flight booking succeeded but no PNR was returned.");
            }

            throw new InvalidOperationException("Flight booking succeeded but response format was unexpected.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Duffel flight order");
            throw;
        }
    }

    public async Task<string> CreateStayOrderAsync(Core.Application.Abstraction.DTOs.Reservations.CreateHotelBookingDto request, CancellationToken cancellationToken = default)
    {
        try
        {
            var url = $"{_settings.BaseUrl.TrimEnd('/')}/stays/bookings";
            
            var payload = new
            {
                data = new
                {
                    quote_id = request.RatePlanId.ToString(), // Assuming RatePlanId is the quote ID
                    guests = new[]
                    {
                        new { given_name = request.GuestFirstName, family_name = request.GuestLastName }
                    },
                    email = request.GuestEmail,
                    phone_number = request.GuestPhone.StartsWith("+") ? request.GuestPhone : "+966500000000"
                }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, jsonContent, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogWarning("Duffel Stay Order failed: {StatusCode} - {Error}", response.StatusCode, error);
                throw new InvalidOperationException($"Hotel booking failed: {error}");
            }

            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            using var doc = JsonDocument.Parse(json);
            if (doc.RootElement.TryGetProperty("data", out var data) && data.TryGetProperty("reference", out var pnr))
            {
                return pnr.GetString() ?? throw new InvalidOperationException("Hotel booking succeeded but no PNR was returned.");
            }

            throw new InvalidOperationException("Hotel booking succeeded but response format was unexpected.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Duffel stay order");
            throw;
        }
    }

    #endregion
}


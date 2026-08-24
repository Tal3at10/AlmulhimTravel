using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services;
using Core.Application.Abstraction.Services.Reservations;
using Core.Domain.Entities.Reservations;
using Core.Domain.Entities.Accommodation;
using Core.Domain.Entities.Aviation;
using Infrastructure.Shared.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Shared.Services
{
    public class VoucherProIntegrationService : IVoucherProIntegrationService
    {
        private readonly HttpClient _httpClient;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWhatsAppProvider _whatsAppProvider;
        private readonly ILogger<VoucherProIntegrationService> _logger;
        private readonly VoucherProSettings _settings;
        private readonly IServiceScopeFactory _scopeFactory;

        private static string? _cachedToken;
        private static DateTime _tokenExpiry = DateTime.MinValue;
        private static readonly SemaphoreSlim _tokenSemaphore = new SemaphoreSlim(1, 1);

        public VoucherProIntegrationService(
            HttpClient httpClient,
            IUnitOfWork unitOfWork,
            IWhatsAppProvider whatsAppProvider,
            IOptions<VoucherProSettings> options,
            ILogger<VoucherProIntegrationService> logger,
            IServiceScopeFactory scopeFactory)
        {
            _httpClient = httpClient;
            _unitOfWork = unitOfWork;
            _whatsAppProvider = whatsAppProvider;
            _logger = logger;
            _settings = options.Value;
            _scopeFactory = scopeFactory;

            _httpClient.BaseAddress = new Uri(_settings.BaseUrl.TrimEnd('/') + "/");
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        public async Task ProcessBookingVoucherAsync(Booking booking, CancellationToken cancellationToken = default)
        {
            try
            {
                _logger.LogInformation("Processing automated voucher for Booking Reference: {ReferenceNumber}", booking.ReferenceNumber);

                // 1. Get Auth Token
                var token = await GetAuthTokenAsync(cancellationToken);
                if (string.IsNullOrEmpty(token))
                {
                    _logger.LogError("Could not authenticate with Voucher Pro API. Aborting voucher creation.");
                    return;
                }

                using var scope = _scopeFactory.CreateScope();
                var scopedUnitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

                // 2. Prepare Voucher Payload based on Booking Type
                var createVoucherDto = await BuildVoucherPayloadAsync(booking, scopedUnitOfWork, cancellationToken);
                if (createVoucherDto == null)
                {
                    _logger.LogWarning("Voucher payload is empty or not supported for Booking Type: {Type}", booking.Type);
                    return;
                }

                // 3. Create Voucher in Voucher Pro
                var voucherDto = await CreateVoucherAsync(createVoucherDto, token, cancellationToken);
                if (voucherDto == null)
                {
                    _logger.LogError("Failed to create voucher record in Voucher Pro API.");
                    return;
                }

                _logger.LogInformation("Voucher created successfully in Voucher Pro. Id: {Id}, Reference: {Reference}", 
                    voucherDto.Id, voucherDto.ReferenceNumber);

                // Save VoucherReference to Booking
                var trackedBooking = await scopedUnitOfWork.Bookings.GetByIdAsync(booking.Id, cancellationToken);
                if (trackedBooking != null)
                {
                    trackedBooking.VoucherReference = voucherDto.ReferenceNumber;
                    scopedUnitOfWork.Bookings.Update(trackedBooking);
                    await scopedUnitOfWork.SaveChangesAsync(cancellationToken);
                }

                // 4. Trigger Email Sending
                var emailSent = await TriggerVoucherEmailAsync(voucherDto.Id, booking.GuestEmail, booking.GuestPhone, token, cancellationToken);
                if (emailSent)
                {
                    _logger.LogInformation("Automated voucher PDF email sent to {Email}.", booking.GuestEmail);
                }
                else
                {
                    _logger.LogWarning("Automated voucher email failed to send.");
                }

                // 5. Send WhatsApp if conversation exists
                await SendWhatsAppNotificationAsync(booking, voucherDto.ReferenceNumber, scopedUnitOfWork, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during automated Voucher Pro integration for Booking {ReferenceNumber}", booking.ReferenceNumber);
            }
        }

        public async Task<int?> CreateCustomerRequestAsync(CreateCustomerRequestDto requestDto, CancellationToken cancellationToken = default)
        {
            try
            {
                var token = await GetAuthTokenAsync(cancellationToken);
                if (string.IsNullOrEmpty(token))
                {
                    _logger.LogError("Could not authenticate with Voucher Pro API. Aborting customer request creation.");
                    return null;
                }

                var content = new StringContent(JsonSerializer.Serialize(requestDto), Encoding.UTF8, "application/json");
                var request = new HttpRequestMessage(HttpMethod.Post, "api/v1.0/integration/customer-requests");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                request.Content = content;

                var response = await _httpClient.SendAsync(request, cancellationToken);
                if (!response.IsSuccessStatusCode)
                {
                    var errorResponse = await response.Content.ReadAsStringAsync(cancellationToken);
                    _logger.LogError("Voucher Pro API failed to create customer request. Code: {Code}, Response: {Response}", 
                        response.StatusCode, errorResponse);
                    return null;
                }

                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
                using var doc = JsonDocument.Parse(responseBody);
                if (doc.RootElement.TryGetProperty("id", out var idElement) && idElement.TryGetInt32(out int id))
                {
                    return id;
                }
                
                // If it succeeds but doesn't have an "id" property, return -1 instead of null
                // so the controller doesn't think it failed and returns 500.
                return -1;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling Voucher Pro API to create customer request");
                return null;
            }
        }

        private async Task<string?> GetAuthTokenAsync(CancellationToken cancellationToken)
        {
            if (!string.IsNullOrEmpty(_cachedToken) && _tokenExpiry > DateTime.UtcNow)
            {
                return _cachedToken;
            }

            await _tokenSemaphore.WaitAsync(cancellationToken);
            try
            {
                // Double check after acquiring the lock
                if (!string.IsNullOrEmpty(_cachedToken) && _tokenExpiry > DateTime.UtcNow)
                {
                    return _cachedToken;
                }

                var loginPayload = new
                {
                    email = _settings.Email,
                    password = _settings.Password
                };

                var content = new StringContent(JsonSerializer.Serialize(loginPayload), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("api/v1.0/auth/login", content, cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Voucher Pro auth failed with status code {Code}", response.StatusCode);
                    return null;
                }

                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
                using var doc = JsonDocument.Parse(responseBody);
                var token = doc.RootElement.GetProperty("token").GetString();

                if (!string.IsNullOrEmpty(token))
                {
                    _cachedToken = token;
                    // Cache token for 7 hours (token expires in 8 hours)
                    _tokenExpiry = DateTime.UtcNow.AddHours(7);
                    return token;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error authenticating with Voucher Pro API");
            }
            finally
            {
                _tokenSemaphore.Release();
            }

            return null;
        }

        private async Task<CreateVoucherDto?> BuildVoucherPayloadAsync(Booking booking, IUnitOfWork unitOfWork, CancellationToken cancellationToken)
        {
            var guestFullName = $"{booking.GuestFirstName} {booking.GuestLastName}".Trim();

            if (booking.Type == Core.Domain.Enums.BookingType.Hotel)
            {
                // Fetch Hotel Booking
                var hotelBooking = await unitOfWork.HotelBookings.FindAsync(hb => hb.BookingId == booking.Id, cancellationToken);
                if (hotelBooking == null) return null;

                // Fetch Hotel details
                var hotel = await unitOfWork.Hotels.GetByIdAsync(hotelBooking.HotelId, cancellationToken);
                if (hotel == null) return null;

                // Fetch Room details
                var room = await unitOfWork.Rooms.GetByIdAsync(hotelBooking.RoomId, cancellationToken);
                if (room == null) return null;

                // Fetch City
                var city = hotel.CityId.HasValue ? await unitOfWork.Cities.GetByIdAsync(hotel.CityId.Value, cancellationToken) : null;

                var hotelSnapshot = new CreateVoucherHotelDto
                {
                    HotelNameSnapshot = hotel.Name,
                    CityNameSnapshot = city?.NameAr ?? hotel.Location ?? "غير محدد",
                    CheckInDate = hotelBooking.CheckInDate,
                    CheckOutDate = hotelBooking.CheckOutDate,
                    NightsCount = hotelBooking.Nights,
                    RoomType = room.Name ?? "غرفة قياسية",
                    BreakfastType = "شامل الإفطار",
                    RoomCount = hotelBooking.RoomQuantity,
                    StarRating = hotel.Stars
                };

                return new CreateVoucherDto
                {
                    ClientName = guestFullName,
                    ReferenceNumber = booking.ReferenceNumber,
                    PackageCode = "HOTEL",
                    TourName = $"حجز فندق - {hotel.Name}",
                    TotalPrice = booking.TotalAmount,
                    ArrivalDate = hotelBooking.CheckInDate,
                    DepartureDate = hotelBooking.CheckOutDate,
                    Notes = booking.SpecialRequests ?? "",
                    HotelBookings = new List<CreateVoucherHotelDto> { hotelSnapshot }
                };
            }
            else if (booking.Type == Core.Domain.Enums.BookingType.Flight)
            {
                // Fetch Flight Booking
                var flightBooking = await unitOfWork.FlightBookings.FindAsync(fb => fb.BookingId == booking.Id, cancellationToken);
                if (flightBooking == null) return null;

                // Fetch Flight passengers
                var passengers = await unitOfWork.FlightPassengers.FindAllAsync(p => p.FlightBookingId == flightBooking.Id, cancellationToken);

                // Fetch Outbound flight schedule
                var schedule = await unitOfWork.FlightSchedules.GetByIdAsync(flightBooking.FlightScheduleId, cancellationToken);
                if (schedule == null) return null;

                // Fetch Flight details
                var flight = await unitOfWork.Flights.GetByIdAsync(schedule.FlightId, cancellationToken);
                if (flight == null) return null;

                // Fetch Airports
                var depAirport = await unitOfWork.Airports.GetByIdAsync(flight.DepartureAirportId, cancellationToken);
                var arrAirport = await unitOfWork.Airports.GetByIdAsync(flight.ArrivalAirportId, cancellationToken);

                var outboundFlight = new CreateVoucherFlightDto
                {
                    FlightDate = flightBooking.DepartureDate,
                    FromLocation = depAirport != null ? $"{depAirport.CityAr} ({depAirport.Code})" : "مطار المغادرة",
                    ToLocation = arrAirport != null ? $"{arrAirport.CityAr} ({arrAirport.Code})" : "مطار الوصول",
                    TravelersCount = passengers.Count(),
                    WeightPerPerson = 20
                };

                var flightsList = new List<CreateVoucherFlightDto> { outboundFlight };

                // Handle return flight if it exists
                if (flightBooking.ReturnDate.HasValue && depAirport != null && arrAirport != null)
                {
                    var returnFlight = new CreateVoucherFlightDto
                    {
                        FlightDate = flightBooking.ReturnDate.Value,
                        FromLocation = $"{arrAirport.CityAr} ({arrAirport.Code})",
                        ToLocation = $"{depAirport.CityAr} ({depAirport.Code})",
                        TravelersCount = passengers.Count(),
                        WeightPerPerson = 20
                    };
                    flightsList.Add(returnFlight);
                }

                var tourName = depAirport != null && arrAirport != null 
                    ? $"حجز طيران - {depAirport.CityAr} إلى {arrAirport.CityAr}"
                    : "حجز طيران مؤكد";

                return new CreateVoucherDto
                {
                    ClientName = guestFullName,
                    ReferenceNumber = booking.ReferenceNumber,
                    PackageCode = "FLIGHT",
                    TourName = tourName,
                    TotalPrice = booking.TotalAmount,
                    ArrivalDate = flightBooking.DepartureDate,
                    DepartureDate = flightBooking.ReturnDate ?? flightBooking.DepartureDate.AddDays(1),
                    Notes = booking.SpecialRequests ?? "",
                    Flights = flightsList
                };
            }
            else if (booking.Type == Core.Domain.Enums.BookingType.Package && !string.IsNullOrEmpty(booking.ExtractedJsonData))
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var extracted = JsonSerializer.Deserialize<ExtractedVoucherDto>(booking.ExtractedJsonData, options);
                
                if (extracted != null)
                {
                    return new CreateVoucherDto
                    {
                        ClientName = guestFullName,
                        ReferenceNumber = booking.ReferenceNumber,
                        PackageCode = "PACKAGE",
                        TourName = $"بكج سياحي - {extracted.Destination ?? "غير محدد"}",
                        TotalPrice = booking.TotalAmount,
                        ArrivalDate = extracted.Hotels?.FirstOrDefault()?.CheckInDate ?? DateTime.UtcNow,
                        DepartureDate = extracted.Hotels?.LastOrDefault()?.CheckOutDate ?? DateTime.UtcNow.AddDays(extracted.Nights ?? 1),
                        Notes = (booking.SpecialRequests + "\n" + extracted.Notes).Trim(),
                        
                        HotelBookings = extracted.Hotels?.Select(h => new CreateVoucherHotelDto
                        {
                            HotelNameSnapshot = h.HotelName ?? "",
                            CityNameSnapshot = h.CityName ?? "",
                            CheckInDate = h.CheckInDate ?? DateTime.UtcNow,
                            CheckOutDate = h.CheckOutDate ?? DateTime.UtcNow.AddDays(1),
                            NightsCount = h.Nights ?? 1,
                            RoomType = h.RoomType ?? "غرفة مزدوجة",
                            BreakfastType = h.BreakfastType ?? "غير محدد",
                            RoomCount = 1,
                            StarRating = 4
                        }).ToList() ?? new List<CreateVoucherHotelDto>(),

                        Flights = extracted.Flights?.Select(f => new CreateVoucherFlightDto
                        {
                            FlightDate = f.FlightDate ?? DateTime.UtcNow,
                            FromLocation = f.FromLocation ?? "",
                            ToLocation = f.ToLocation ?? "",
                            TravelersCount = f.TravelersCount ?? 1,
                            WeightPerPerson = 20
                        }).ToList() ?? new List<CreateVoucherFlightDto>()
                    };
                }
            }

            return null;
        }

        private async Task<VoucherResponseDto?> CreateVoucherAsync(CreateVoucherDto dto, string token, CancellationToken cancellationToken)
        {
            try
            {
                var content = new StringContent(JsonSerializer.Serialize(dto), Encoding.UTF8, "application/json");
                
                var request = new HttpRequestMessage(HttpMethod.Post, "api/v1.0/vouchers");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                request.Content = content;

                var response = await _httpClient.SendAsync(request, cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    var errorResponse = await response.Content.ReadAsStringAsync(cancellationToken);
                    _logger.LogError("Voucher Pro API failed to create voucher. Code: {Code}, Response: {Response}", 
                        response.StatusCode, errorResponse);
                    return null;
                }

                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                return JsonSerializer.Deserialize<VoucherResponseDto>(responseBody, options);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling Voucher Pro API to create voucher");
                return null;
            }
        }

        private async Task<bool> TriggerVoucherEmailAsync(int voucherId, string email, string phone, string token, CancellationToken cancellationToken)
        {
            try
            {
                var sendRequest = new
                {
                    voucherId = voucherId,
                    clientEmail = email,
                    clientPhone = phone,
                    sendEmail = true,
                    sendSms = false,
                    sendWhatsApp = false
                };

                var content = new StringContent(JsonSerializer.Serialize(sendRequest), Encoding.UTF8, "application/json");
                
                var request = new HttpRequestMessage(HttpMethod.Post, "api/v1.0/vouchersend/send");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                request.Content = content;

                var response = await _httpClient.SendAsync(request, cancellationToken);

                if (response.IsSuccessStatusCode)
                {
                    return true;
                }

                var errorResponse = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Voucher Pro Send API failed with code {Code}. Response: {Response}", 
                    response.StatusCode, errorResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling Voucher Pro send API");
            }

            return false;
        }

        private async Task SendWhatsAppNotificationAsync(Booking booking, string referenceNumber, IUnitOfWork unitOfWork, CancellationToken cancellationToken)
        {
            try
            {
                var cleanedPhone = booking.GuestPhone.Replace("+", "").Replace(" ", "").Replace("-", "").Trim();
                if (string.IsNullOrEmpty(cleanedPhone)) return;

                // Try to find conversation in the database by customer phone
                var conversations = await unitOfWork.WhatsAppConversations.FindAllAsync(
                    c => c.CustomerPhone.Contains(cleanedPhone) || cleanedPhone.Contains(c.CustomerPhone),
                    cancellationToken
                );

                var activeConv = conversations
                    .Where(c => !string.IsNullOrEmpty(c.FreshchatConversationId))
                    .OrderByDescending(c => c.LastMessageAt)
                    .FirstOrDefault();

                if (activeConv == null || string.IsNullOrEmpty(activeConv.FreshchatConversationId))
                {
                    _logger.LogInformation("No active WhatsApp conversation found in database for customer phone: {Phone}. Skipping auto WhatsApp message.", booking.GuestPhone);
                    return;
                }

                // Public view link to stream QuestPDF directly in browser
                var voucherUrl = $"{_settings.BaseUrl.TrimEnd('/')}/api/v1.0/vouchersend/view/{referenceNumber}";

                var customerName = $"{booking.GuestFirstName} {booking.GuestLastName}".Trim();
                var whatsappMessage = $"مرحباً عميلنا العزيز {customerName}، 👋\n\n" +
                                      $"تم تأكيد حجزك بنجاح برقم حجز: *{booking.ReferenceNumber}* ✈️🌟\n\n" +
                                      $"تم إصدار فاوتشر رحلتك الإلكتروني الفاخر برقم: *#{referenceNumber}*\n\n" +
                                      $"ويمكنك الاطلاع عليه وتحميله كملف PDF تفاعلي بالضغط على الرابط التالي:\n" +
                                      $"{voucherUrl}\n\n" +
                                      $"نتمنى لك رحلة سعيدة وموفقة! ✈️🏖️\n\n" +
                                      $"مع تحيات،\n" +
                                      $"سفريات الملحم";

                await _whatsAppProvider.SendTextMessageAsync(activeConv.FreshchatConversationId, whatsappMessage);
                _logger.LogInformation("Automated WhatsApp message with voucher link sent successfully to Freshchat Conversation ID: {ConvID}", 
                    activeConv.FreshchatConversationId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while sending automated WhatsApp voucher notification");
            }
        }
    }


}


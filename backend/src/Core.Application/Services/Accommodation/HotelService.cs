using AutoMapper;
using Core.Application.Abstraction.DTOs.Accommodation;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Accommodation;
using Microsoft.EntityFrameworkCore;

namespace Core.Application.Services.Accommodation
{
    public class HotelService : IHotelService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public HotelService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<PaginatedResult<HotelCardDto>>> SearchAsync(
            HotelSearchQuery query,
            CancellationToken cancellationToken = default)
        {
            try
            {
                // Start with active hotels
                var hotelsQuery = _unitOfWork.Hotels.Query(h => h.IsActive).AsNoTracking();

                // Filter by city
                if (query.CityId.HasValue)
                {
                    hotelsQuery = hotelsQuery.Where(h => h.CityId == query.CityId.Value);
                }

                // Filter by minimum stars
                if (query.MinStars.HasValue)
                {
                    hotelsQuery = hotelsQuery.Where(h => h.Stars >= query.MinStars.Value);
                }

                // Filter by minimum rating
                if (query.MinRating.HasValue)
                {
                    hotelsQuery = hotelsQuery.Where(h => h.Rating >= query.MinRating.Value);
                }

                // Get hotels list to apply complex filters
                var hotels = hotelsQuery.ToList();

                // Load related data for each hotel
                var hotelIds = hotels.Select(h => h.Id).ToList();
                foreach (var hotelId in hotelIds)
                {
                    var hotel = await _unitOfWork.Hotels.GetByIdAsync(
                        hotelId,
                        h => h.City,
                        h => h.Rooms,
                        h => h.Amenities,
                        h => h.Badges
                    );

                    if (hotel != null)
                    {
                        // Load rate plans for rooms
                        foreach (var room in hotel.Rooms)
                        {
                            room.RatePlans = (await _unitOfWork.RatePlans
                                .FindAllAsync(rp => rp.RoomId == room.Id && rp.IsActive, cancellationToken))
                                .ToList();
                        }
                    }
                }

                // Filter by price range (based on room rates)
                if (query.MinPrice.HasValue || query.MaxPrice.HasValue)
                {
                    hotels = hotels.Where(h =>
                        h.Rooms.Any(r =>
                            r.RatePlans.Any(rp =>
                            {
                                var meetsMin = !query.MinPrice.HasValue || rp.Price >= query.MinPrice.Value;
                                var meetsMax = !query.MaxPrice.HasValue || rp.Price <= query.MaxPrice.Value;
                                var isValid = rp.IsActive;

                                // Check date range if provided
                                if (query.CheckInDate.HasValue && query.CheckOutDate.HasValue)
                                {
                                    isValid = isValid &&
                                             rp.ValidFrom <= query.CheckInDate.Value &&
                                             rp.ValidTo >= query.CheckOutDate.Value;
                                }

                                return meetsMin && meetsMax && isValid;
                            })
                        )
                    ).ToList();
                }

                // Filter by amenities
                if (query.AmenityIds != null && query.AmenityIds.Any())
                {
                    hotels = hotels.Where(h =>
                        query.AmenityIds.All(amenityId =>
                            h.Amenities.Any(ha => ha.AmenityId == amenityId)
                        )
                    ).ToList();
                }

                // Apply sorting
                hotels = query.SortBy?.ToLower() switch
                {
                    "price" => hotels.OrderBy(h =>
                        h.Rooms.SelectMany(r => r.RatePlans.Where(rp => rp.IsActive))
                               .DefaultIfEmpty()
                               .Min(rp => rp?.Price ?? decimal.MaxValue)
                    ).ToList(),
                    "price-desc" => hotels.OrderByDescending(h =>
                        h.Rooms.SelectMany(r => r.RatePlans.Where(rp => rp.IsActive))
                               .DefaultIfEmpty()
                               .Min(rp => rp?.Price ?? 0)
                    ).ToList(),
                    "rating" => hotels.OrderByDescending(h => h.Rating).ToList(),
                    "stars" => hotels.OrderByDescending(h => h.Stars).ToList(),
                    _ => hotels.OrderByDescending(h => h.Rating).ToList() // Default: recommended
                };

                // Get total count
                var totalCount = hotels.Count;

                // Apply pagination
                var paginatedHotels = hotels
                    .Skip((query.PageNumber - 1) * query.PageSize)
                    .Take(query.PageSize)
                    .ToList();

                var hotelDtos = _mapper.Map<List<HotelCardDto>>(paginatedHotels);
                var paginatedResult = new PaginatedResult<HotelCardDto>(
                    hotelDtos,
                    totalCount,
                    query.PageNumber,
                    query.PageSize
                );

                return Result<PaginatedResult<HotelCardDto>>.Success(paginatedResult);
            }
            catch (Exception ex)
            {
                return Result<PaginatedResult<HotelCardDto>>.Failure($"Error searching hotels: {ex.Message}");
            }
        }

        public async Task<Result<HotelDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var hotel = await _unitOfWork.Hotels.GetByIdAsync(
                    id,
                    h => h.City,
                    h => h.Images,
                    h => h.Amenities,
                    h => h.Badges,
                    h => h.Highlights,
                    h => h.Rooms
                );

                if (hotel == null)
                    return Result<HotelDetailDto>.Failure("Hotel not found");

                // Load amenities details
                foreach (var hotelAmenity in hotel.Amenities)
                {
                    hotelAmenity.Amenity = await _unitOfWork.Amenities.GetByIdAsync(
                        hotelAmenity.AmenityId,
                        cancellationToken
                    );
                }

                // Load room features and rate plans
                foreach (var room in hotel.Rooms.Where(r => r.IsActive))
                {
                    room.Features = (await _unitOfWork.RoomFeatures
                        .FindAllAsync(rf => rf.RoomId == room.Id, cancellationToken))
                        .ToList();

                    room.RatePlans = (await _unitOfWork.RatePlans
                        .FindAllAsync(rp => rp.RoomId == room.Id && rp.IsActive, cancellationToken))
                        .OrderBy(rp => rp.Price)
                        .ToList();
                }

                var hotelDto = _mapper.Map<HotelDetailDto>(hotel);
                return Result<HotelDetailDto>.Success(hotelDto);
            }
            catch (Exception ex)
            {
                return Result<HotelDetailDto>.Failure($"Error retrieving hotel: {ex.Message}");
            }
        }

        public async Task<Result<HotelDetailDto>> GetByHotelIdAsync(string hotelId, CancellationToken cancellationToken = default)
        {
            try
            {
                var hotel = await _unitOfWork.Hotels.FindAsync(
                    h => h.HotelId == hotelId && h.IsActive,
                    h => h.City,
                    h => h.Images,
                    h => h.Amenities,
                    h => h.Badges,
                    h => h.Highlights,
                    h => h.Rooms
                );

                if (hotel == null)
                    return Result<HotelDetailDto>.Failure($"Hotel with ID '{hotelId}' not found");

                // Load amenities details
                foreach (var hotelAmenity in hotel.Amenities)
                {
                    hotelAmenity.Amenity = await _unitOfWork.Amenities.GetByIdAsync(
                        hotelAmenity.AmenityId,
                        cancellationToken
                    );
                }

                // Load room features and rate plans
                foreach (var room in hotel.Rooms.Where(r => r.IsActive))
                {
                    room.Features = (await _unitOfWork.RoomFeatures
                        .FindAllAsync(rf => rf.RoomId == room.Id, cancellationToken))
                        .ToList();

                    room.RatePlans = (await _unitOfWork.RatePlans
                        .FindAllAsync(rp => rp.RoomId == room.Id && rp.IsActive, cancellationToken))
                        .OrderBy(rp => rp.Price)
                        .ToList();
                }

                var hotelDto = _mapper.Map<HotelDetailDto>(hotel);
                return Result<HotelDetailDto>.Success(hotelDto);
            }
            catch (Exception ex)
            {
                return Result<HotelDetailDto>.Failure($"Error retrieving hotel: {ex.Message}");
            }
        }

        public async Task<Result<List<string>>> GetPopularDestinationsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var hotels = await _unitOfWork.Hotels.FindAllAsync(
                    h => h.IsActive,
                    h => h.City
                );

                // Get cities with most hotels
                var popularDestinations = hotels
                    .GroupBy(h => h.City.NameAr)
                    .OrderByDescending(g => g.Count())
                    .Take(10)
                    .Select(g => g.Key)
                    .ToList();

                return Result<List<string>>.Success(popularDestinations);
            }
            catch (Exception ex)
            {
                return Result<List<string>>.Failure($"Error retrieving popular destinations: {ex.Message}");
            }
        }
    }
}

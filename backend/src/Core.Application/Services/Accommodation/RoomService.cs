using AutoMapper;
using Core.Application.Abstraction.DTOs.Accommodation;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Accommodation;

namespace Core.Application.Services.Accommodation
{
    public class RoomService : IRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public RoomService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<RoomCardDto>>> GetAvailableRoomsByHotelAsync(
            Guid hotelId,
            DateTime checkIn,
            DateTime checkOut,
            int guests,
            CancellationToken cancellationToken = default)
        {
            try
            {
                // Verify hotel exists
                var hotelExists = await _unitOfWork.Hotels.ExistsAsync(hotelId, cancellationToken);
                if (!hotelExists)
                    return Result<List<RoomCardDto>>.Failure("Hotel not found");

                // Get all active rooms for the hotel
                var rooms = await _unitOfWork.Rooms.FindAllAsync(
                    r => r.HotelId == hotelId && r.IsActive && r.MaxGuests >= guests,
                    r => r.Features,
                    r => r.RatePlans
                );

                // Filter rooms with available rate plans for the date range
                var availableRooms = rooms.Where(r =>
                    r.RatePlans.Any(rp =>
                        rp.IsActive &&
                        rp.ValidFrom <= checkIn &&
                        rp.ValidTo >= checkOut
                    )
                ).ToList();

                // Filter rate plans to only show valid ones for the date range
                foreach (var room in availableRooms)
                {
                    room.RatePlans = room.RatePlans
                        .Where(rp =>
                            rp.IsActive &&
                            rp.ValidFrom <= checkIn &&
                            rp.ValidTo >= checkOut
                        )
                        .OrderBy(rp => rp.Price)
                        .ToList();
                }

                var roomDtos = _mapper.Map<List<RoomCardDto>>(availableRooms);
                return Result<List<RoomCardDto>>.Success(roomDtos);
            }
            catch (Exception ex)
            {
                return Result<List<RoomCardDto>>.Failure($"Error retrieving available rooms: {ex.Message}");
            }
        }

        public async Task<Result<RoomDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var room = await _unitOfWork.Rooms.GetByIdAsync(
                    id,
                    r => r.Features,
                    r => r.RatePlans,
                    r => r.Hotel
                );

                if (room == null)
                    return Result<RoomDetailDto>.Failure("Room not found");

                var roomDto = _mapper.Map<RoomDetailDto>(room);
                return Result<RoomDetailDto>.Success(roomDto);
            }
            catch (Exception ex)
            {
                return Result<RoomDetailDto>.Failure($"Error retrieving room: {ex.Message}");
            }
        }
    }
}

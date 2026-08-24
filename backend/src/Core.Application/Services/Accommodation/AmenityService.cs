using AutoMapper;
using Core.Application.Abstraction.DTOs.Accommodation;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Accommodation;

namespace Core.Application.Services.Accommodation
{
    public class AmenityService : IAmenityService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AmenityService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<AmenityDto>>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var amenities = await _unitOfWork.Amenities.GetAllAsync(cancellationToken);
                var amenityDtos = _mapper.Map<List<AmenityDto>>(amenities);
                
                return Result<List<AmenityDto>>.Success(amenityDtos);
            }
            catch (Exception ex)
            {
                return Result<List<AmenityDto>>.Failure($"Error retrieving amenities: {ex.Message}");
            }
        }

        public async Task<Result<AmenityDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var amenity = await _unitOfWork.Amenities.GetByIdAsync(id, cancellationToken);

                if (amenity == null)
                    return Result<AmenityDto>.Failure("Amenity not found");

                var amenityDto = _mapper.Map<AmenityDto>(amenity);
                return Result<AmenityDto>.Success(amenityDto);
            }
            catch (Exception ex)
            {
                return Result<AmenityDto>.Failure($"Error retrieving amenity: {ex.Message}");
            }
        }
    }
}

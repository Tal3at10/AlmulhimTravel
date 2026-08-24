using AutoMapper;
using Core.Application.Abstraction.DTOs.Accommodation;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Accommodation;

namespace Core.Application.Services.Accommodation
{
    public class CityService : ICityService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CityService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<CityListDto>>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var cities = await _unitOfWork.Cities.GetAllAsync(
                    c => c.Hotels
                );

                var cityDtos = _mapper.Map<List<CityListDto>>(cities);
                return Result<List<CityListDto>>.Success(cityDtos);
            }
            catch (Exception ex)
            {
                return Result<List<CityListDto>>.Failure($"Error retrieving cities: {ex.Message}");
            }
        }

        public async Task<Result<CityDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var city = await _unitOfWork.Cities.GetByIdAsync(id, cancellationToken);

                if (city == null)
                    return Result<CityDto>.Failure("City not found");

                var cityDto = _mapper.Map<CityDto>(city);
                return Result<CityDto>.Success(cityDto);
            }
            catch (Exception ex)
            {
                return Result<CityDto>.Failure($"Error retrieving city: {ex.Message}");
            }
        }

        public async Task<Result<List<string>>> GetPopularCitiesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var cities = await _unitOfWork.Cities.GetAllAsync(
                    c => c.Hotels
                );

                // Get cities with most hotels
                var popularCities = cities
                    .Where(c => c.Hotels.Any(h => h.IsActive))
                    .OrderByDescending(c => c.Hotels.Count(h => h.IsActive))
                    .Take(10)
                    .Select(c => c.NameAr)
                    .ToList();

                return Result<List<string>>.Success(popularCities);
            }
            catch (Exception ex)
            {
                return Result<List<string>>.Failure($"Error retrieving popular cities: {ex.Message}");
            }
        }
    }
}

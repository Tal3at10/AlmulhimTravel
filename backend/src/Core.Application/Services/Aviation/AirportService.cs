using AutoMapper;
using Core.Application.Abstraction.DTOs.Aviation;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Aviation;

namespace Core.Application.Services.Aviation
{
    public class AirportService : IAirportService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AirportService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<AirportDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var airports = await _unitOfWork.Airports
                    .FindAllAsync(a => a.IsActive, cancellationToken);

                var sortedAirports = airports.OrderBy(a => a.NameAr).ToList();
                var airportDtos = _mapper.Map<List<AirportDto>>(sortedAirports);
                
                return Result<List<AirportDto>>.Success(airportDtos);
            }
            catch (Exception ex)
            {
                return Result<List<AirportDto>>.Failure($"Error retrieving airports: {ex.Message}");
            }
        }

        public async Task<Result<List<AirportDto>>> GetPopularAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                // Get airports with most flights (departure + arrival)
                var airports = await _unitOfWork.Airports.GetAllAsync(
                    a => a.DepartureFlights,
                    a => a.ArrivalFlights
                );

                var popularAirports = airports
                    .Where(a => a.IsActive)
                    .OrderByDescending(a => 
                        a.DepartureFlights.Count(f => f.IsActive) + 
                        a.ArrivalFlights.Count(f => f.IsActive)
                    )
                    .Take(10)
                    .ToList();

                var airportDtos = _mapper.Map<List<AirportDto>>(popularAirports);
                return Result<List<AirportDto>>.Success(airportDtos);
            }
            catch (Exception ex)
            {
                return Result<List<AirportDto>>.Failure($"Error retrieving popular airports: {ex.Message}");
            }
        }

        public async Task<Result<AirportDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var airport = await _unitOfWork.Airports.GetByIdAsync(id, cancellationToken);

                if (airport == null)
                    return Result<AirportDto>.Failure("Airport not found");

                var airportDto = _mapper.Map<AirportDto>(airport);
                return Result<AirportDto>.Success(airportDto);
            }
            catch (Exception ex)
            {
                return Result<AirportDto>.Failure($"Error retrieving airport: {ex.Message}");
            }
        }

        public async Task<Result<AirportDto>> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
        {
            try
            {
                var airport = await _unitOfWork.Airports
                    .FindAsync(a => a.Code == code && a.IsActive, cancellationToken);

                if (airport == null)
                    return Result<AirportDto>.Failure($"Airport with code '{code}' not found");

                var airportDto = _mapper.Map<AirportDto>(airport);
                return Result<AirportDto>.Success(airportDto);
            }
            catch (Exception ex)
            {
                return Result<AirportDto>.Failure($"Error retrieving airport: {ex.Message}");
            }
        }

        public async Task<Result<List<AirportDto>>> SearchAsync(string query, CancellationToken cancellationToken = default)
        {
            try
            {
                var airports = await _unitOfWork.Airports
                    .FindAllAsync(a => a.IsActive, cancellationToken);

                // Search in code, name (AR/EN), and city (AR/EN)
                var searchResults = airports
                    .Where(a =>
                        a.Code.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        a.NameAr.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        a.NameEn.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        a.CityAr.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        a.CityEn.Contains(query, StringComparison.OrdinalIgnoreCase)
                    )
                    .OrderBy(a => a.NameAr)
                    .Take(20)
                    .ToList();

                var airportDtos = _mapper.Map<List<AirportDto>>(searchResults);
                return Result<List<AirportDto>>.Success(airportDtos);
            }
            catch (Exception ex)
            {
                return Result<List<AirportDto>>.Failure($"Error searching airports: {ex.Message}");
            }
        }
    }
}

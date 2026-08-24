using AutoMapper;
using Core.Application.Abstraction.DTOs.Aviation;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Aviation;

namespace Core.Application.Services.Aviation
{
    public class AirlineService : IAirlineService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AirlineService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<AirlineDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var airlines = await _unitOfWork.Airlines
                    .FindAllAsync(a => a.IsActive, cancellationToken);

                var airlineDtos = _mapper.Map<List<AirlineDto>>(airlines);
                return Result<List<AirlineDto>>.Success(airlineDtos);
            }
            catch (Exception ex)
            {
                return Result<List<AirlineDto>>.Failure($"Error retrieving airlines: {ex.Message}");
            }
        }

        public async Task<Result<AirlineDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var airline = await _unitOfWork.Airlines.GetByIdAsync(id, cancellationToken);

                if (airline == null)
                    return Result<AirlineDto>.Failure("Airline not found");

                var airlineDto = _mapper.Map<AirlineDto>(airline);
                return Result<AirlineDto>.Success(airlineDto);
            }
            catch (Exception ex)
            {
                return Result<AirlineDto>.Failure($"Error retrieving airline: {ex.Message}");
            }
        }

        public async Task<Result<AirlineDto>> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
        {
            try
            {
                var airline = await _unitOfWork.Airlines
                    .FindAsync(a => a.Code == code && a.IsActive, cancellationToken);

                if (airline == null)
                    return Result<AirlineDto>.Failure($"Airline with code '{code}' not found");

                var airlineDto = _mapper.Map<AirlineDto>(airline);
                return Result<AirlineDto>.Success(airlineDto);
            }
            catch (Exception ex)
            {
                return Result<AirlineDto>.Failure($"Error retrieving airline: {ex.Message}");
            }
        }
    }
}

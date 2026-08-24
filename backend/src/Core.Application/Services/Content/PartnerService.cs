using AutoMapper;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Content;
using Core.Domain.Entities.Content;

namespace Core.Application.Services.Content
{
    public class PartnerService : IPartnerService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PartnerService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<PartnerDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var partners = await _unitOfWork.Partners
                    .FindAllAsync(p => p.IsActive, cancellationToken);

                var sortedPartners = partners.OrderBy(p => p.SortOrder).ToList();
                var partnerDtos = _mapper.Map<List<PartnerDto>>(sortedPartners);
                return Result<List<PartnerDto>>.Success(partnerDtos);
            }
            catch (Exception ex)
            {
                return Result<List<PartnerDto>>.Failure($"Error retrieving partners: {ex.Message}");
            }
        }

        public async Task<Result<PartnerDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var partner = await _unitOfWork.Partners.GetByIdAsync(id, cancellationToken);
                
                if (partner == null)
                    return Result<PartnerDto>.Failure("Partner not found");

                var partnerDto = _mapper.Map<PartnerDto>(partner);
                return Result<PartnerDto>.Success(partnerDto);
            }
            catch (Exception ex)
            {
                return Result<PartnerDto>.Failure($"Error retrieving partner: {ex.Message}");
            }
        }

        public async Task<Result<PartnerDto>> CreateAsync(CreatePartnerDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var partner = _mapper.Map<Partner>(dto);
                partner.Id = Guid.NewGuid();

                await _unitOfWork.Partners.AddAsync(partner, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var partnerDto = _mapper.Map<PartnerDto>(partner);
                return Result<PartnerDto>.Success(partnerDto, "Partner created successfully");
            }
            catch (Exception ex)
            {
                return Result<PartnerDto>.Failure($"Error creating partner: {ex.Message}");
            }
        }

        public async Task<Result<PartnerDto>> UpdateAsync(Guid id, CreatePartnerDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var partner = await _unitOfWork.Partners.GetByIdAsync(id, cancellationToken);
                
                if (partner == null)
                    return Result<PartnerDto>.Failure("Partner not found");

                _mapper.Map(dto, partner);
                _unitOfWork.Partners.Update(partner);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var partnerDto = _mapper.Map<PartnerDto>(partner);
                return Result<PartnerDto>.Success(partnerDto, "Partner updated successfully");
            }
            catch (Exception ex)
            {
                return Result<PartnerDto>.Failure($"Error updating partner: {ex.Message}");
            }
        }

        public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var partner = await _unitOfWork.Partners.GetByIdAsync(id, cancellationToken);
                
                if (partner == null)
                    return Result.Failure("Partner not found");

                _unitOfWork.Partners.Delete(partner);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("Partner deleted successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting partner: {ex.Message}");
            }
        }
    }
}

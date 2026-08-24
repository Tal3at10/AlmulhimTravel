using AutoMapper;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Content;

namespace Core.Application.Services.Content
{
    public class CompanySettingService : ICompanySettingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CompanySettingService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<CompanySettingDto>> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
        {
            try
            {
                var setting = await _unitOfWork.CompanySettings
                    .FindAsync(s => s.Key == key, cancellationToken);
                
                if (setting == null)
                    return Result<CompanySettingDto>.Failure($"Setting with key '{key}' not found");

                var settingDto = _mapper.Map<CompanySettingDto>(setting);
                return Result<CompanySettingDto>.Success(settingDto);
            }
            catch (Exception ex)
            {
                return Result<CompanySettingDto>.Failure($"Error retrieving setting: {ex.Message}");
            }
        }

        public async Task<Result<List<CompanySettingDto>>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var settings = await _unitOfWork.CompanySettings
                    .GetAllAsync(cancellationToken);

                var settingDtos = _mapper.Map<List<CompanySettingDto>>(settings);
                
                return Result<List<CompanySettingDto>>.Success(settingDtos);
            }
            catch (Exception ex)
            {
                return Result<List<CompanySettingDto>>.Failure($"Error retrieving settings: {ex.Message}");
            }
        }

        public async Task<Result<CompanySettingDto>> UpdateAsync(string key, UpdateCompanySettingDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var setting = await _unitOfWork.CompanySettings
                    .FindAsync(s => s.Key == key, cancellationToken);
                
                if (setting == null)
                {
                    // Auto-create setting if it doesn't exist
                    setting = new Core.Domain.Entities.Content.CompanySetting
                    {
                        Id = Guid.NewGuid(),
                        Key = key,
                        Value = dto.Value,
                        ValueEn = dto.ValueEn
                    };
                    await _unitOfWork.CompanySettings.AddAsync(setting, cancellationToken);
                }
                else
                {
                    setting.Value = dto.Value;
                    if (dto.ValueEn != null)
                        setting.ValueEn = dto.ValueEn;
                    _unitOfWork.CompanySettings.Update(setting);
                }
                
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var settingDto = _mapper.Map<CompanySettingDto>(setting);
                return Result<CompanySettingDto>.Success(settingDto, "Setting updated successfully");
            }
            catch (Exception ex)
            {
                return Result<CompanySettingDto>.Failure($"Error updating setting: {ex.Message}");
            }
        }
    }
}

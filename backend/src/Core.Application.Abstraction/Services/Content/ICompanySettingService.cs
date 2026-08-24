using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;

namespace Core.Application.Abstraction.Services.Content
{
    public interface ICompanySettingService
    {
        Task<Result<CompanySettingDto>> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
        Task<Result<List<CompanySettingDto>>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Result<CompanySettingDto>> UpdateAsync(string key, UpdateCompanySettingDto dto, CancellationToken cancellationToken = default);
    }
}

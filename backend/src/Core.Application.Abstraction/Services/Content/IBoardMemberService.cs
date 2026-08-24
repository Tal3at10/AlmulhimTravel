using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;

namespace Core.Application.Abstraction.Services.Content
{
    public interface IBoardMemberService
    {
        Task<Result<List<BoardMemberDto>>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Result<BoardMemberDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<BoardMemberDto>> GetChairmanAsync(CancellationToken cancellationToken = default);
        Task<Result<BoardMemberDto>> GetCEOAsync(CancellationToken cancellationToken = default);
        Task<Result<BoardMemberDto>> CreateAsync(CreateBoardMemberDto dto, CancellationToken cancellationToken = default);
        Task<Result<BoardMemberDto>> UpdateAsync(Guid id, CreateBoardMemberDto dto, CancellationToken cancellationToken = default);
        Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}

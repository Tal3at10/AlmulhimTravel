using AutoMapper;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Content;
using Core.Domain.Entities.Content;

namespace Core.Application.Services.Content
{
    public class BoardMemberService : IBoardMemberService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BoardMemberService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<BoardMemberDto>>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var members = await _unitOfWork.BoardMembers
                    .GetAllAsync(cancellationToken);

                var sortedMembers = members.OrderBy(m => m.SortOrder).ToList();
                var memberDtos = _mapper.Map<List<BoardMemberDto>>(sortedMembers);
                return Result<List<BoardMemberDto>>.Success(memberDtos);
            }
            catch (Exception ex)
            {
                return Result<List<BoardMemberDto>>.Failure($"Error retrieving board members: {ex.Message}");
            }
        }

        public async Task<Result<BoardMemberDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var member = await _unitOfWork.BoardMembers.GetByIdAsync(id, cancellationToken);
                
                if (member == null)
                    return Result<BoardMemberDto>.Failure("Board member not found");

                var memberDto = _mapper.Map<BoardMemberDto>(member);
                return Result<BoardMemberDto>.Success(memberDto);
            }
            catch (Exception ex)
            {
                return Result<BoardMemberDto>.Failure($"Error retrieving board member: {ex.Message}");
            }
        }

        public async Task<Result<BoardMemberDto>> GetChairmanAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var chairman = await _unitOfWork.BoardMembers
                    .FindAsync(m => m.IsChairman, cancellationToken);
                
                if (chairman == null)
                    return Result<BoardMemberDto>.Failure("Chairman not found");

                var chairmanDto = _mapper.Map<BoardMemberDto>(chairman);
                return Result<BoardMemberDto>.Success(chairmanDto);
            }
            catch (Exception ex)
            {
                return Result<BoardMemberDto>.Failure($"Error retrieving chairman: {ex.Message}");
            }
        }

        public async Task<Result<BoardMemberDto>> GetCEOAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var ceo = await _unitOfWork.BoardMembers
                    .FindAsync(m => m.IsCEO, cancellationToken);
                
                if (ceo == null)
                    return Result<BoardMemberDto>.Failure("CEO not found");

                var ceoDto = _mapper.Map<BoardMemberDto>(ceo);
                return Result<BoardMemberDto>.Success(ceoDto);
            }
            catch (Exception ex)
            {
                return Result<BoardMemberDto>.Failure($"Error retrieving CEO: {ex.Message}");
            }
        }

        public async Task<Result<BoardMemberDto>> CreateAsync(CreateBoardMemberDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var member = _mapper.Map<BoardMember>(dto);
                member.Id = Guid.NewGuid();

                await _unitOfWork.BoardMembers.AddAsync(member, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var memberDto = _mapper.Map<BoardMemberDto>(member);
                return Result<BoardMemberDto>.Success(memberDto, "Board member created successfully");
            }
            catch (Exception ex)
            {
                return Result<BoardMemberDto>.Failure($"Error creating board member: {ex.Message}");
            }
        }

        public async Task<Result<BoardMemberDto>> UpdateAsync(Guid id, CreateBoardMemberDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var member = await _unitOfWork.BoardMembers.GetByIdAsync(id, cancellationToken);
                
                if (member == null)
                    return Result<BoardMemberDto>.Failure("Board member not found");

                _mapper.Map(dto, member);
                _unitOfWork.BoardMembers.Update(member);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var memberDto = _mapper.Map<BoardMemberDto>(member);
                return Result<BoardMemberDto>.Success(memberDto, "Board member updated successfully");
            }
            catch (Exception ex)
            {
                return Result<BoardMemberDto>.Failure($"Error updating board member: {ex.Message}");
            }
        }

        public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var member = await _unitOfWork.BoardMembers.GetByIdAsync(id, cancellationToken);
                
                if (member == null)
                    return Result.Failure("Board member not found");

                _unitOfWork.BoardMembers.Delete(member);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("Board member deleted successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting board member: {ex.Message}");
            }
        }
    }
}

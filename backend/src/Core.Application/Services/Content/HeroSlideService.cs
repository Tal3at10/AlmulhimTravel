using AutoMapper;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Content;
using Core.Domain.Entities.Content;

namespace Core.Application.Services.Content
{
    public class HeroSlideService : IHeroSlideService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public HeroSlideService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<HeroSlideDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var slides = await _unitOfWork.HeroSlides
                    .FindAllAsync(h => h.IsActive, cancellationToken);

                var sortedSlides = slides.OrderBy(h => h.SortOrder).ToList();
                var slideDtos = _mapper.Map<List<HeroSlideDto>>(sortedSlides);
                return Result<List<HeroSlideDto>>.Success(slideDtos);
            }
            catch (Exception ex)
            {
                var fullError = ex.InnerException != null 
                    ? $"{ex.Message} --> Inner: {ex.InnerException.Message}" 
                    : ex.Message;
                return Result<List<HeroSlideDto>>.Failure($"Error retrieving hero slides: {fullError}");
            }
        }

        public async Task<Result<HeroSlideDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var slide = await _unitOfWork.HeroSlides.GetByIdAsync(id, cancellationToken);
                
                if (slide == null)
                    return Result<HeroSlideDto>.Failure("Hero slide not found");

                var slideDto = _mapper.Map<HeroSlideDto>(slide);
                return Result<HeroSlideDto>.Success(slideDto);
            }
            catch (Exception ex)
            {
                return Result<HeroSlideDto>.Failure($"Error retrieving hero slide: {ex.Message}");
            }
        }

        public async Task<Result<HeroSlideDto>> CreateAsync(CreateHeroSlideDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var slide = _mapper.Map<HeroSlide>(dto);
                slide.Id = Guid.NewGuid();

                await _unitOfWork.HeroSlides.AddAsync(slide, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var slideDto = _mapper.Map<HeroSlideDto>(slide);
                return Result<HeroSlideDto>.Success(slideDto, "Hero slide created successfully");
            }
            catch (Exception ex)
            {
                return Result<HeroSlideDto>.Failure($"Error creating hero slide: {ex.Message}");
            }
        }

        public async Task<Result<HeroSlideDto>> UpdateAsync(Guid id, CreateHeroSlideDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var slide = await _unitOfWork.HeroSlides.GetByIdAsync(id, cancellationToken);
                
                if (slide == null)
                    return Result<HeroSlideDto>.Failure("Hero slide not found");

                _mapper.Map(dto, slide);
                _unitOfWork.HeroSlides.Update(slide);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var slideDto = _mapper.Map<HeroSlideDto>(slide);
                return Result<HeroSlideDto>.Success(slideDto, "Hero slide updated successfully");
            }
            catch (Exception ex)
            {
                return Result<HeroSlideDto>.Failure($"Error updating hero slide: {ex.Message}");
            }
        }

        public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var slide = await _unitOfWork.HeroSlides.GetByIdAsync(id, cancellationToken);
                
                if (slide == null)
                    return Result.Failure("Hero slide not found");

                _unitOfWork.HeroSlides.Delete(slide);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("Hero slide deleted successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting hero slide: {ex.Message}");
            }
        }

        public async Task<Result> ReorderAsync(Dictionary<Guid, int> sortOrders, CancellationToken cancellationToken = default)
        {
            try
            {
                foreach (var (id, sortOrder) in sortOrders)
                {
                    var slide = await _unitOfWork.HeroSlides.GetByIdAsync(id, cancellationToken);
                    if (slide != null)
                    {
                        slide.SortOrder = sortOrder;
                        _unitOfWork.HeroSlides.Update(slide);
                    }
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result.Success("Hero slides reordered successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error reordering hero slides: {ex.Message}");
            }
        }
    }
}

using AutoMapper;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Content;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Content;
using Core.Domain.Entities.Content;

namespace Core.Application.Services.Content
{
    public class TestimonialService : ITestimonialService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TestimonialService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<TestimonialDto>>> GetAllActiveAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var testimonials = await _unitOfWork.Testimonials
                    .FindAllAsync(t => t.IsActive, cancellationToken);

                var sortedTestimonials = testimonials.OrderBy(t => t.SortOrder).ToList();
                var testimonialDtos = _mapper.Map<List<TestimonialDto>>(sortedTestimonials);
                return Result<List<TestimonialDto>>.Success(testimonialDtos);
            }
            catch (Exception ex)
            {
                return Result<List<TestimonialDto>>.Failure($"Error retrieving testimonials: {ex.Message}");
            }
        }

        public async Task<Result<TestimonialDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var testimonial = await _unitOfWork.Testimonials.GetByIdAsync(id, cancellationToken);
                
                if (testimonial == null)
                    return Result<TestimonialDto>.Failure("Testimonial not found");

                var testimonialDto = _mapper.Map<TestimonialDto>(testimonial);
                return Result<TestimonialDto>.Success(testimonialDto);
            }
            catch (Exception ex)
            {
                return Result<TestimonialDto>.Failure($"Error retrieving testimonial: {ex.Message}");
            }
        }

        public async Task<Result<TestimonialDto>> CreateAsync(CreateTestimonialDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var testimonial = _mapper.Map<Testimonial>(dto);
                testimonial.Id = Guid.NewGuid();

                await _unitOfWork.Testimonials.AddAsync(testimonial, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var testimonialDto = _mapper.Map<TestimonialDto>(testimonial);
                return Result<TestimonialDto>.Success(testimonialDto, "Testimonial created successfully");
            }
            catch (Exception ex)
            {
                return Result<TestimonialDto>.Failure($"Error creating testimonial: {ex.Message}");
            }
        }

        public async Task<Result<TestimonialDto>> UpdateAsync(Guid id, CreateTestimonialDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var testimonial = await _unitOfWork.Testimonials.GetByIdAsync(id, cancellationToken);
                
                if (testimonial == null)
                    return Result<TestimonialDto>.Failure("Testimonial not found");

                _mapper.Map(dto, testimonial);
                _unitOfWork.Testimonials.Update(testimonial);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var testimonialDto = _mapper.Map<TestimonialDto>(testimonial);
                return Result<TestimonialDto>.Success(testimonialDto, "Testimonial updated successfully");
            }
            catch (Exception ex)
            {
                return Result<TestimonialDto>.Failure($"Error updating testimonial: {ex.Message}");
            }
        }

        public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var testimonial = await _unitOfWork.Testimonials.GetByIdAsync(id, cancellationToken);
                
                if (testimonial == null)
                    return Result.Failure("Testimonial not found");

                _unitOfWork.Testimonials.Delete(testimonial);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("Testimonial deleted successfully");
            }
            catch (Exception ex)
            {
                return Result.Failure($"Error deleting testimonial: {ex.Message}");
            }
        }
    }
}

using Core.Application.Abstraction.DTOs.Catalog;
using Core.Application.Abstraction.DTOs.Content;
using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers.Admin
{
    /// <summary>
    /// Admin CMS Controller
    /// Manages all website content (Hero Slides, Testimonials, Partners, Board Members, Settings, Videos)
    /// </summary>
    public class AdminCmsController : AdminBaseController
    {
        private readonly IServiceManager _serviceManager;

        public AdminCmsController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        // ==================== HERO SLIDES ====================

        [HttpGet("hero-slides")]
        public async Task<IActionResult> GetHeroSlides(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.HeroSlides.GetAllActiveAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("hero-slides/{id}")]
        public async Task<IActionResult> GetHeroSlide(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.HeroSlides.GetByIdAsync(id, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpPost("hero-slides")]
        public async Task<IActionResult> CreateHeroSlide([FromBody] CreateHeroSlideDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.HeroSlides.CreateAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("hero-slides/{id}")]
        public async Task<IActionResult> UpdateHeroSlide(Guid id, [FromBody] CreateHeroSlideDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.HeroSlides.UpdateAsync(id, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpDelete("hero-slides/{id}")]
        public async Task<IActionResult> DeleteHeroSlide(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.HeroSlides.DeleteAsync(id, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("hero-slides/reorder")]
        public async Task<IActionResult> ReorderHeroSlides([FromBody] Dictionary<Guid, int> sortOrders, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.HeroSlides.ReorderAsync(sortOrders, cancellationToken);
            return HandleResult(result);
        }

        // ==================== TESTIMONIALS ====================

        [HttpGet("testimonials")]
        public async Task<IActionResult> GetTestimonials(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Testimonials.GetAllActiveAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("testimonials/{id}")]
        public async Task<IActionResult> GetTestimonial(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Testimonials.GetByIdAsync(id, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpPost("testimonials")]
        public async Task<IActionResult> CreateTestimonial([FromBody] CreateTestimonialDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Testimonials.CreateAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("testimonials/{id}")]
        public async Task<IActionResult> UpdateTestimonial(Guid id, [FromBody] CreateTestimonialDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Testimonials.UpdateAsync(id, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpDelete("testimonials/{id}")]
        public async Task<IActionResult> DeleteTestimonial(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Testimonials.DeleteAsync(id, cancellationToken);
            return HandleResult(result);
        }

        // ==================== PARTNERS ====================

        [HttpGet("partners")]
        public async Task<IActionResult> GetPartners(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Partners.GetAllActiveAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("partners/{id}")]
        public async Task<IActionResult> GetPartner(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Partners.GetByIdAsync(id, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpPost("partners")]
        public async Task<IActionResult> CreatePartner([FromBody] CreatePartnerDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Partners.CreateAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("partners/{id}")]
        public async Task<IActionResult> UpdatePartner(Guid id, [FromBody] CreatePartnerDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Partners.UpdateAsync(id, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpDelete("partners/{id}")]
        public async Task<IActionResult> DeletePartner(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.Partners.DeleteAsync(id, cancellationToken);
            return HandleResult(result);
        }

        // ==================== BOARD MEMBERS ====================

        [HttpGet("board-members")]
        public async Task<IActionResult> GetBoardMembers(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BoardMembers.GetAllAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("board-members/{id}")]
        public async Task<IActionResult> GetBoardMember(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BoardMembers.GetByIdAsync(id, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpPost("board-members")]
        public async Task<IActionResult> CreateBoardMember([FromBody] CreateBoardMemberDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BoardMembers.CreateAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("board-members/{id}")]
        public async Task<IActionResult> UpdateBoardMember(Guid id, [FromBody] CreateBoardMemberDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BoardMembers.UpdateAsync(id, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpDelete("board-members/{id}")]
        public async Task<IActionResult> DeleteBoardMember(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.BoardMembers.DeleteAsync(id, cancellationToken);
            return HandleResult(result);
        }

        // ==================== COMPANY SETTINGS ====================

        [HttpGet("settings")]
        public async Task<IActionResult> GetSettings(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.CompanySettings.GetAllAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("settings/{key}")]
        public async Task<IActionResult> UpdateSetting(string key, [FromBody] UpdateCompanySettingDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.CompanySettings.UpdateAsync(key, dto, cancellationToken);
            return HandleResult(result);
        }

        // ==================== CUSTOMER VIDEOS ====================

        [HttpGet("customer-videos")]
        public async Task<IActionResult> GetCustomerVideos(CancellationToken cancellationToken)
        {
            var result = await _serviceManager.CustomerVideos.GetAllActiveAsync(cancellationToken);
            return HandleResult(result);
        }

        [HttpGet("customer-videos/{id}")]
        public async Task<IActionResult> GetCustomerVideo(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.CustomerVideos.GetByIdAsync(id, cancellationToken);
            return HandleNotFoundResult(result);
        }

        [HttpPost("customer-videos")]
        public async Task<IActionResult> CreateCustomerVideo([FromBody] CreateCustomerVideoDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.CustomerVideos.CreateAsync(dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpPut("customer-videos/{id}")]
        public async Task<IActionResult> UpdateCustomerVideo(Guid id, [FromBody] UpdateCustomerVideoDto dto, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.CustomerVideos.UpdateAsync(id, dto, cancellationToken);
            return HandleResult(result);
        }

        [HttpDelete("customer-videos/{id}")]
        public async Task<IActionResult> DeleteCustomerVideo(Guid id, CancellationToken cancellationToken)
        {
            var result = await _serviceManager.CustomerVideos.DeleteAsync(id, cancellationToken);
            return HandleResult(result);
        }
    }
}

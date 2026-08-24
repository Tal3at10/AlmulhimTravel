using AutoMapper;
using Core.Application.Abstraction.DTOs.Content;
using Core.Domain.Entities.Content;

namespace Core.Application.Mappings
{
    public class ContentMappingProfile : Profile
    {
        public ContentMappingProfile()
        {
            // HeroSlide Mappings
            CreateMap<HeroSlide, HeroSlideDto>().ReverseMap();
            CreateMap<CreateHeroSlideDto, HeroSlide>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

            // Testimonial Mappings
            CreateMap<Testimonial, TestimonialDto>()
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.CustomerTitle, opt => opt.MapFrom(src => src.Destination))
                .ForMember(dest => dest.CustomerImage, opt => opt.MapFrom(src => src.ImageUrl))
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Text))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.UtcNow));
            
            CreateMap<CreateTestimonialDto, Testimonial>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.CustomerName))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.CustomerImage))
                .ForMember(dest => dest.Text, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.Destination, opt => opt.MapFrom(src => src.CustomerTitle))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.SortOrder, opt => opt.MapFrom(src => 0));

            // Partner Mappings
            CreateMap<Partner, PartnerDto>()
                .ForMember(dest => dest.Website, opt => opt.MapFrom(src => src.WebsiteUrl));
            CreateMap<CreatePartnerDto, Partner>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WebsiteUrl, opt => opt.MapFrom(src => src.Website))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

            // BoardMember Mappings
            CreateMap<BoardMember, BoardMemberDto>()
                .ForMember(dest => dest.NameAr, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.NameEn, opt => opt.MapFrom(src => src.NameEn ?? src.Name))
                .ForMember(dest => dest.PositionAr, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.PositionEn, opt => opt.MapFrom(src => src.TitleEn ?? src.Title));
            
            CreateMap<CreateBoardMemberDto, BoardMember>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.NameAr))
                .ForMember(dest => dest.NameEn, opt => opt.MapFrom(src => src.NameEn))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.PositionAr))
                .ForMember(dest => dest.TitleEn, opt => opt.MapFrom(src => src.PositionEn))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.IsChairman, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.IsCEO, opt => opt.MapFrom(src => false));

            // CompanySetting Mappings
            CreateMap<CompanySetting, CompanySettingDto>();

            // BlogPost Mappings
            CreateMap<BlogPost, BlogPostDto>();
            CreateMap<CreateBlogPostDto, BlogPost>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
            CreateMap<UpdateBlogPostDto, BlogPost>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
        }
    }
}

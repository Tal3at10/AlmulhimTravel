using AutoMapper;
using Core.Application.Abstraction.DTOs.Identity;
using Core.Application.Helpers;
using Core.Domain.Entities.Identity;
using Core.Domain.Enums;

namespace Core.Application.Mappings
{
    public class IdentityMappingProfile : Profile
    {
        public IdentityMappingProfile()
        {
            // User Mappings
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => 
                    $"{src.FirstName} {src.LastName}"))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => 
                    $"{src.CountryCode}{src.Phone}"))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role ?? "User"))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
                .ForMember(dest => dest.LastLoginAt, opt => opt.MapFrom(src => src.LastLoginAt));

            CreateMap<RegisterDto, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => StringHelper.GetFirstName(src.FullName)))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => StringHelper.GetLastName(src.FullName)))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.CountryCode, opt => opt.MapFrom(src => "+966"))
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

            CreateMap<UpdateProfileDto, User>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => StringHelper.GetFirstName(src.FullName)))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => StringHelper.GetLastName(src.FullName)))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Email, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.CountryCode, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.LastLoginAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.Ignore())
                .ForMember(dest => dest.Bookings, opt => opt.Ignore())
                .ForMember(dest => dest.Favorites, opt => opt.Ignore());

            // UserFavorite Mappings
            CreateMap<UserFavorite, UserFavoriteDto>()
                .ForMember(dest => dest.FavoriteType, opt => opt.MapFrom(src => 
                    src.HotelId.HasValue ? FavoriteType.Hotel : FavoriteType.Package))
                .ForMember(dest => dest.ItemId, opt => opt.MapFrom(src => 
                    src.HotelId ?? src.PackageId ?? Guid.Empty))
                .ForMember(dest => dest.ItemName, opt => opt.MapFrom(src => 
                    src.Hotel != null ? src.Hotel.Name : (src.Package != null ? src.Package.TitleAr : "")))
                .ForMember(dest => dest.ItemImageUrl, opt => opt.MapFrom(src => 
                    src.Hotel != null ? src.Hotel.MainImageUrl : (src.Package != null ? src.Package.VideoUrl : "")))
                .ForMember(dest => dest.ItemPrice, opt => opt.MapFrom(src => 
                    src.Package != null ? (decimal?)src.Package.Price : null))
                .ForMember(dest => dest.AddedAt, opt => opt.MapFrom(src => src.CreatedAt));

            CreateMap<AddFavoriteDto, UserFavorite>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.HotelId, opt => opt.MapFrom(src => 
                    src.FavoriteType == FavoriteType.Hotel ? src.ItemId : (Guid?)null))
                .ForMember(dest => dest.PackageId, opt => opt.MapFrom(src => 
                    src.FavoriteType == FavoriteType.Package ? src.ItemId : (Guid?)null))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}

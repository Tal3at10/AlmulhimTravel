using AutoMapper;
using Core.Application.Abstraction.DTOs.Accommodation;
using Core.Domain.Entities.Accommodation;

namespace Core.Application.Mappings
{
    public class AccommodationMappingProfile : Profile
    {
        public AccommodationMappingProfile()
        {
            // City Mappings
            CreateMap<City, CityDto>();
            CreateMap<City, CityListDto>()
                .ForMember(dest => dest.HotelsCount, opt => opt.MapFrom(src => src.Hotels.Count));

            // Amenity Mappings
            CreateMap<Amenity, AmenityDto>();

            // Hotel Mappings
            CreateMap<Hotel, HotelCardDto>()
                .ForMember(dest => dest.CityName, opt => opt.MapFrom(src => src.City.NameAr))
                .ForMember(dest => dest.StartingPrice, opt => opt.MapFrom(src => 
                    src.Rooms.SelectMany(r => r.RatePlans).Min(rp => rp.Price)))
                .ForMember(dest => dest.Badges, opt => opt.MapFrom(src => 
                    src.Badges.Select(b => b.Text).ToList()))
                .ForMember(dest => dest.TopAmenities, opt => opt.MapFrom(src => 
                    src.Amenities.Take(4).Select(ha => ha.Amenity.Name).ToList()));

            CreateMap<Hotel, HotelDetailDto>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => 
                    src.Images.OrderBy(i => i.SortOrder)))
                .ForMember(dest => dest.Amenities, opt => opt.MapFrom(src => 
                    src.Amenities.Select(ha => ha.Amenity)))
                .ForMember(dest => dest.Badges, opt => opt.MapFrom(src => 
                    src.Badges.Select(b => new HotelBadgeDto 
                    { 
                        Name = b.Text, 
                        Icon = "", 
                        Color = b.Type 
                    })))
                .ForMember(dest => dest.Highlights, opt => opt.MapFrom(src => 
                    src.Highlights.Select(h => new HotelHighlightDto 
                    { 
                        Title = h.Text, 
                        Description = "", 
                        Icon = "" 
                    })))
                .ForMember(dest => dest.Rooms, opt => opt.MapFrom(src => src.Rooms));

            // HotelImage Mappings
            CreateMap<HotelImage, HotelImageDto>()
                .ForMember(dest => dest.Caption, opt => opt.MapFrom(src => ""));

            // Room Mappings
            CreateMap<Room, RoomCardDto>()
                .ForMember(dest => dest.MaxOccupancy, opt => opt.MapFrom(src => src.MaxGuests))
                .ForMember(dest => dest.Size, opt => opt.MapFrom(src => decimal.Parse(src.Size.Replace(" م²", "").Replace(" ", ""))))
                .ForMember(dest => dest.Features, opt => opt.MapFrom(src => 
                    src.Features.Select(f => f.Text).ToList()))
                .ForMember(dest => dest.RatePlans, opt => opt.MapFrom(src => src.RatePlans));

            CreateMap<Room, RoomDetailDto>()
                .ForMember(dest => dest.MaxOccupancy, opt => opt.MapFrom(src => src.MaxGuests))
                .ForMember(dest => dest.Size, opt => opt.MapFrom(src => decimal.Parse(src.Size.Replace(" م²", "").Replace(" ", ""))))
                .ForMember(dest => dest.DescriptionAr, opt => opt.MapFrom(src => ""))
                .ForMember(dest => dest.DescriptionEn, opt => opt.MapFrom(src => ""))
                .ForMember(dest => dest.ViewType, opt => opt.MapFrom(src => ""))
                .ForMember(dest => dest.Features, opt => opt.MapFrom(src => 
                    src.Features.Select(f => new RoomFeatureDto 
                    { 
                        Name = f.Text, 
                        Icon = "" 
                    })))
                .ForMember(dest => dest.RatePlans, opt => opt.MapFrom(src => src.RatePlans));

            // RatePlan Mappings
            CreateMap<RatePlan, RatePlanDto>()
                .ForMember(dest => dest.PricePerNight, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => "SAR"))
                .ForMember(dest => dest.IsRefundable, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.IncludesBreakfast, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.FreeCancellation, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.CancellationDeadline, opt => opt.MapFrom(src => (DateTime?)null))
                .ForMember(dest => dest.AvailableRooms, opt => opt.MapFrom(src => 5));
        }
    }
}

using AutoMapper;
using Core.Application.Abstraction.DTOs.Catalog;
using Core.Domain.Entities.Catalog;

namespace Core.Application.Mappings
{
    public class CatalogMappingProfile : Profile
    {
        public CatalogMappingProfile()
        {
            // Destination Mappings
            CreateMap<Destination, DestinationDto>();
            CreateMap<Destination, DestinationListDto>()
                .ForMember(dest => dest.PackagesCount, opt => opt.MapFrom(src => src.Packages.Count));
            CreateMap<CreateDestinationDto, Destination>();
            CreateMap<UpdateDestinationDto, Destination>();

            // Package Mappings
            CreateMap<Package, PackageCardDto>()
                .ForMember(dest => dest.Features, opt => opt.MapFrom(src => src.Features.Select(f => f.Text).ToList()))
                .ForMember(dest => dest.DestinationName, opt => opt.MapFrom(src => src.Destination.NameAr));

            CreateMap<Package, PackageDetailDto>()
                .ForMember(dest => dest.DestinationSlug, opt => opt.MapFrom(src => src.Destination.Slug))
                .ForMember(dest => dest.Features, opt => opt.MapFrom(src => src.Features.Select(f => f.Text).ToList()))
                .ForMember(dest => dest.Itineraries, opt => opt.MapFrom(src => src.Itineraries.OrderBy(i => i.Day)))
                .ForMember(dest => dest.Hotels, opt => opt.MapFrom(src => src.PackageHotels));
            
            CreateMap<CreatePackageDto, Package>()
                .ForMember(dest => dest.Features, opt => opt.Ignore())
                .ForMember(dest => dest.Itineraries, opt => opt.Ignore())
                .ForMember(dest => dest.PackageHotels, opt => opt.Ignore());
            
            CreateMap<UpdatePackageDto, Package>()
                .ForMember(dest => dest.Features, opt => opt.Ignore())
                .ForMember(dest => dest.Itineraries, opt => opt.Ignore())
                .ForMember(dest => dest.PackageHotels, opt => opt.Ignore());

            // PackageItinerary Mappings
            CreateMap<PackageItinerary, PackageItineraryDto>();
            CreateMap<PackageItineraryDto, PackageItinerary>()
                .ForMember(dest => dest.Package, opt => opt.Ignore());

            // PackageHotel Mappings (embedded data, no Hotel navigation)
            CreateMap<PackageHotel, PackageHotelDto>();

            // CustomerVideo Mappings
            CreateMap<CustomerVideo, CustomerVideoDto>();
            CreateMap<CreateCustomerVideoDto, CustomerVideo>();
            CreateMap<UpdateCustomerVideoDto, CustomerVideo>();
        }
    }
}

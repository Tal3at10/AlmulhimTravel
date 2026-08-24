using Core.Application.Abstraction.Services.Content;
using Core.Application.Abstraction.Services.Catalog;
using Core.Application.Abstraction.Services.Accommodation;
using Core.Application.Abstraction.Services.Aviation;
using Core.Application.Abstraction.Services.Reservations;
using Core.Application.Abstraction.Services.Identity;
using Core.Application.Abstraction.Services.Admin;

namespace Core.Application.Abstraction.Services
{
    /// <summary>
    /// Service Manager - Central access point for all business logic services
    /// Implements Service Manager Design Pattern for Clean Architecture
    /// </summary>
    public interface IServiceManager
    {
        // Content Services
        IHeroSlideService HeroSlides { get; }
        ITestimonialService Testimonials { get; }
        IPartnerService Partners { get; }
        IBoardMemberService BoardMembers { get; }
        ICompanySettingService CompanySettings { get; }
        IBlogPostService BlogPosts { get; }

        // Catalog Services
        IDestinationService Destinations { get; }
        IPackageService Packages { get; }
        ICustomerVideoService CustomerVideos { get; }

        // Accommodation Services
        ICityService Cities { get; }
        IHotelService Hotels { get; }
        IRoomService Rooms { get; }
        IAmenityService Amenities { get; }

        // Aviation Services
        IAirlineService Airlines { get; }
        IAirportService Airports { get; }
        IFlightService Flights { get; }

        // Reservations Services
        IBookingService Bookings { get; }
        IPaymentService Payments { get; }
        ICouponService Coupons { get; }

        // Identity Services
        IUserService Users { get; }
        IAuthService Auth { get; }
        IUserFavoriteService UserFavorites { get; }
        IWalletService Wallet { get; }

        // Admin Services
        IAdminDashboardService AdminDashboard { get; }
    }
}


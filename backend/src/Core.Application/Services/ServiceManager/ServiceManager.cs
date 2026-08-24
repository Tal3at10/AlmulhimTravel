using AutoMapper;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services;
using Core.Application.Abstraction.Services.Content;
using Core.Application.Abstraction.Services.Catalog;
using Core.Application.Abstraction.Services.Accommodation;
using Core.Application.Abstraction.Services.Aviation;
using Core.Application.Abstraction.Services.Reservations;
using Core.Application.Abstraction.Services.Identity;
using Core.Application.Abstraction.Services.Admin;
using Core.Application.Services.Admin;
using Core.Application.Services.Content;
using Core.Application.Services.Catalog;
using Core.Application.Services.Accommodation;
using Core.Application.Services.Aviation;
using Core.Application.Services.Reservations;
using Core.Application.Services.Identity;

namespace Core.Application.Services.ServiceManager
{
    /// <summary>
    /// Service Manager Implementation - Lazy initialization of all services
    /// Provides centralized access to business logic services
    /// </summary>
    public class ServiceManager : IServiceManager
    {
        private readonly Lazy<IHeroSlideService> _heroSlides;
        private readonly Lazy<ITestimonialService> _testimonials;
        private readonly Lazy<IPartnerService> _partners;
        private readonly Lazy<IBoardMemberService> _boardMembers;
        private readonly Lazy<ICompanySettingService> _companySettings;
        private readonly Lazy<IBlogPostService> _blogPosts;
        
        private readonly Lazy<IDestinationService> _destinations;
        private readonly Lazy<IPackageService> _packages;
        private readonly Lazy<ICustomerVideoService> _customerVideos;
        
        private readonly Lazy<ICityService> _cities;
        private readonly Lazy<IHotelService> _hotels;
        private readonly Lazy<IRoomService> _rooms;
        private readonly Lazy<IAmenityService> _amenities;
        
        private readonly Lazy<IAirlineService> _airlines;
        private readonly Lazy<IAirportService> _airports;
        private readonly Lazy<IFlightService> _flights;
        
        private readonly Lazy<IBookingService> _bookings;
        private readonly Lazy<IPaymentService> _payments;
        private readonly Lazy<ICouponService> _coupons;
        
        private readonly Lazy<IUserService> _users;
        private readonly Lazy<IAuthService> _auth;
        private readonly Lazy<IUserFavoriteService> _userFavorites;
        private readonly Lazy<IWalletService> _wallet;
        
        private readonly Lazy<IAdminDashboardService> _adminDashboard;

        public ServiceManager(
            IUnitOfWork unitOfWork, 
            IMapper mapper, 
            IJwtTokenService jwtTokenService, 
            IPasswordHasher passwordHasher, 
            IVoucherProIntegrationService voucherProIntegrationService, 
            IDuffelService duffelService,
            Microsoft.Extensions.Caching.Distributed.IDistributedCache cache,
            Microsoft.Extensions.Logging.ILogger<Reservations.PaymentService> paymentLogger,
            Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            // Content Services ✅
            _heroSlides = new Lazy<IHeroSlideService>(() => new HeroSlideService(unitOfWork, mapper));
            _testimonials = new Lazy<ITestimonialService>(() => new TestimonialService(unitOfWork, mapper));
            _partners = new Lazy<IPartnerService>(() => new PartnerService(unitOfWork, mapper));
            _boardMembers = new Lazy<IBoardMemberService>(() => new BoardMemberService(unitOfWork, mapper));
            _companySettings = new Lazy<ICompanySettingService>(() => new CompanySettingService(unitOfWork, mapper));
            _blogPosts = new Lazy<IBlogPostService>(() => new BlogPostService(unitOfWork, mapper));
            
            // Catalog Services ✅
            _destinations = new Lazy<IDestinationService>(() => new DestinationService(unitOfWork, mapper));
            _packages = new Lazy<IPackageService>(() => new PackageService(unitOfWork, mapper));
            _customerVideos = new Lazy<ICustomerVideoService>(() => new CustomerVideoService(unitOfWork, mapper));
            
            // Accommodation Services ✅
            _cities = new Lazy<ICityService>(() => new CityService(unitOfWork, mapper));
            _hotels = new Lazy<IHotelService>(() => new HotelService(unitOfWork, mapper));
            _rooms = new Lazy<IRoomService>(() => new RoomService(unitOfWork, mapper));
            _amenities = new Lazy<IAmenityService>(() => new AmenityService(unitOfWork, mapper));
            
            // Aviation Services ✅
            _airlines = new Lazy<IAirlineService>(() => new AirlineService(unitOfWork, mapper));
            _airports = new Lazy<IAirportService>(() => new AirportService(unitOfWork, mapper));
            _flights = new Lazy<IFlightService>(() => new FlightService(unitOfWork, mapper));
            
            // Reservations Services ✅
            _bookings = new Lazy<IBookingService>(() => new BookingService(unitOfWork, mapper, voucherProIntegrationService, duffelService));
            _payments = new Lazy<IPaymentService>(() => new PaymentService(unitOfWork, mapper, voucherProIntegrationService, paymentLogger, configuration));
            _coupons = new Lazy<ICouponService>(() => new CouponService(unitOfWork));
            
            // Identity Services ✅
            _users = new Lazy<IUserService>(() => new UserService(unitOfWork, mapper, passwordHasher));
            _auth = new Lazy<IAuthService>(() => new AuthService(unitOfWork, mapper, jwtTokenService, passwordHasher, cache));
            _userFavorites = new Lazy<IUserFavoriteService>(() => new UserFavoriteService(unitOfWork, mapper));
            _wallet = new Lazy<IWalletService>(() => new WalletService(unitOfWork));
            
            // Admin Services ✅
            _adminDashboard = new Lazy<IAdminDashboardService>(() => new AdminDashboardService(unitOfWork));
        }

        // Content Services
        public IHeroSlideService HeroSlides => _heroSlides.Value;
        public ITestimonialService Testimonials => _testimonials.Value;
        public IPartnerService Partners => _partners.Value;
        public IBoardMemberService BoardMembers => _boardMembers.Value;
        public ICompanySettingService CompanySettings => _companySettings.Value;
        public IBlogPostService BlogPosts => _blogPosts.Value;

        // Catalog Services
        public IDestinationService Destinations => _destinations.Value;
        public IPackageService Packages => _packages.Value;
        public ICustomerVideoService CustomerVideos => _customerVideos.Value;

        // Accommodation Services
        public ICityService Cities => _cities.Value;
        public IHotelService Hotels => _hotels.Value;
        public IRoomService Rooms => _rooms.Value;
        public IAmenityService Amenities => _amenities.Value;

        // Aviation Services
        public IAirlineService Airlines => _airlines.Value;
        public IAirportService Airports => _airports.Value;
        public IFlightService Flights => _flights.Value;

        // Reservations Services
        public IBookingService Bookings => _bookings.Value;
        public IPaymentService Payments => _payments.Value;
        public ICouponService Coupons => _coupons.Value;

        // Identity Services
        public IUserService Users => _users.Value;
        public IAuthService Auth => _auth.Value;
        public IUserFavoriteService UserFavorites => _userFavorites.Value;
        public IWalletService Wallet => _wallet.Value;

        // Admin Services
        public IAdminDashboardService AdminDashboard => _adminDashboard.Value;
    }
}

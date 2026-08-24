using Core.Domain.Entities.Identity;
using Core.Domain.Entities.Catalog;
using Core.Domain.Entities.Accommodation;
using Core.Domain.Entities.Aviation;
using Core.Domain.Entities.Reservations;
using Core.Domain.Entities.Content;
using Core.Domain.Entities.WhatsApp;

namespace Core.Application.Abstraction.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        // Identity
        IGenericRepository<User> Users { get; }
        IGenericRepository<UserFavorite> UserFavorites { get; }
        IGenericRepository<WalletTransaction> WalletTransactions { get; }
        IGenericRepository<LoyaltyTransaction> LoyaltyTransactions { get; }

        // Catalog
        IGenericRepository<Destination> Destinations { get; }
        IGenericRepository<Package> Packages { get; }
        IGenericRepository<PackageItinerary> PackageItineraries { get; }
        IGenericRepository<PackageFeature> PackageFeatures { get; }
        IGenericRepository<PackageHotel> PackageHotels { get; }
        IGenericRepository<CustomerVideo> CustomerVideos { get; }

        // Accommodation
        IGenericRepository<City> Cities { get; }
        IGenericRepository<Hotel> Hotels { get; }
        IGenericRepository<Room> Rooms { get; }
        IGenericRepository<RatePlan> RatePlans { get; }
        IGenericRepository<HotelImage> HotelImages { get; }
        IGenericRepository<Amenity> Amenities { get; }
        IGenericRepository<HotelAmenity> HotelAmenities { get; }
        IGenericRepository<HotelBadge> HotelBadges { get; }
        IGenericRepository<HotelHighlight> HotelHighlights { get; }
        IGenericRepository<RoomFeature> RoomFeatures { get; }

        // Aviation
        IGenericRepository<Airline> Airlines { get; }
        IGenericRepository<Airport> Airports { get; }
        IGenericRepository<Flight> Flights { get; }
        IGenericRepository<FlightSchedule> FlightSchedules { get; }
        IGenericRepository<Seat> Seats { get; }

        // Reservations
        IGenericRepository<Booking> Bookings { get; }
        IGenericRepository<HotelBooking> HotelBookings { get; }
        IGenericRepository<FlightBooking> FlightBookings { get; }
        IGenericRepository<FlightPassenger> FlightPassengers { get; }
        IGenericRepository<PackageBooking> PackageBookings { get; }
        IGenericRepository<Payment> Payments { get; }
        IGenericRepository<Coupon> Coupons { get; }
        IGenericRepository<BookingAddon> BookingAddons { get; }
        IGenericRepository<InstallmentPayment> InstallmentPayments { get; }

        // Content
        IGenericRepository<HeroSlide> HeroSlides { get; }
        IGenericRepository<Testimonial> Testimonials { get; }
        IGenericRepository<Partner> Partners { get; }
        IGenericRepository<BoardMember> BoardMembers { get; }
        IGenericRepository<CompanySetting> CompanySettings { get; }
        IGenericRepository<BlogPost> BlogPosts { get; }

        // WhatsApp
        IGenericRepository<WhatsAppConversation> WhatsAppConversations { get; }
        IGenericRepository<WhatsAppMessage> WhatsAppMessages { get; }
        IGenericRepository<WhatsAppKnowledge> WhatsAppKnowledge { get; }

        // Unit of Work Methods
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        Task BeginTransactionAsync(CancellationToken cancellationToken = default);
        Task CommitTransactionAsync(CancellationToken cancellationToken = default);
        Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
    }
}

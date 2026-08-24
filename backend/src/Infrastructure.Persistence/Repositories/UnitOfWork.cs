using Core.Application.Abstraction.Interfaces;
using Core.Domain.Entities.Identity;
using Core.Domain.Entities.Catalog;
using Core.Domain.Entities.Accommodation;
using Core.Domain.Entities.Aviation;
using Core.Domain.Entities.Reservations;
using Core.Domain.Entities.Content;
using Core.Domain.Entities.WhatsApp;
using Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AlmulhemDbContext _context;
        private IDbContextTransaction? _transaction;

        // Identity
        private IGenericRepository<User>? _users;
        private IGenericRepository<UserFavorite>? _userFavorites;
        private IGenericRepository<WalletTransaction>? _walletTransactions;
        private IGenericRepository<LoyaltyTransaction>? _loyaltyTransactions;

        // Catalog
        private IGenericRepository<Destination>? _destinations;
        private IGenericRepository<Package>? _packages;
        private IGenericRepository<PackageItinerary>? _packageItineraries;
        private IGenericRepository<PackageFeature>? _packageFeatures;
        private IGenericRepository<PackageHotel>? _packageHotels;
        private IGenericRepository<CustomerVideo>? _customerVideos;

        // Accommodation
        private IGenericRepository<City>? _cities;
        private IGenericRepository<Hotel>? _hotels;
        private IGenericRepository<Room>? _rooms;
        private IGenericRepository<RatePlan>? _ratePlans;
        private IGenericRepository<HotelImage>? _hotelImages;
        private IGenericRepository<Amenity>? _amenities;
        private IGenericRepository<HotelAmenity>? _hotelAmenities;
        private IGenericRepository<HotelBadge>? _hotelBadges;
        private IGenericRepository<HotelHighlight>? _hotelHighlights;
        private IGenericRepository<RoomFeature>? _roomFeatures;

        // Aviation
        private IGenericRepository<Airline>? _airlines;
        private IGenericRepository<Airport>? _airports;
        private IGenericRepository<Flight>? _flights;
        private IGenericRepository<FlightSchedule>? _flightSchedules;
        private IGenericRepository<Seat>? _seats;

        // Reservations
        private IGenericRepository<Booking>? _bookings;
        private IGenericRepository<HotelBooking>? _hotelBookings;
        private IGenericRepository<FlightBooking>? _flightBookings;
        private IGenericRepository<FlightPassenger>? _flightPassengers;
        private IGenericRepository<PackageBooking>? _packageBookings;
        private IGenericRepository<Payment>? _payments;
        private IGenericRepository<Coupon>? _coupons;
        private IGenericRepository<BookingAddon>? _bookingAddons;
        private IGenericRepository<InstallmentPayment>? _installmentPayments;

        // Content
        private IGenericRepository<HeroSlide>? _heroSlides;
        private IGenericRepository<Testimonial>? _testimonials;
        private IGenericRepository<Partner>? _partners;
        private IGenericRepository<BoardMember>? _boardMembers;
        private IGenericRepository<CompanySetting>? _companySettings;
        private IGenericRepository<BlogPost>? _blogPosts;

        // WhatsApp
        private IGenericRepository<WhatsAppConversation>? _whatsappConversations;
        private IGenericRepository<WhatsAppMessage>? _whatsappMessages;
        private IGenericRepository<WhatsAppKnowledge>? _whatsappKnowledge;

        public UnitOfWork(AlmulhemDbContext context)
        {
            _context = context;
        }

        #region Identity Repositories

        public IGenericRepository<User> Users
        {
            get { return _users ??= new GenericRepository<User>(_context); }
        }

        public IGenericRepository<UserFavorite> UserFavorites
        {
            get { return _userFavorites ??= new GenericRepository<UserFavorite>(_context); }
        }

        public IGenericRepository<WalletTransaction> WalletTransactions
        {
            get { return _walletTransactions ??= new GenericRepository<WalletTransaction>(_context); }
        }

        public IGenericRepository<LoyaltyTransaction> LoyaltyTransactions
        {
            get { return _loyaltyTransactions ??= new GenericRepository<LoyaltyTransaction>(_context); }
        }

        #endregion

        #region Catalog Repositories

        public IGenericRepository<Destination> Destinations
        {
            get { return _destinations ??= new GenericRepository<Destination>(_context); }
        }

        public IGenericRepository<Package> Packages
        {
            get { return _packages ??= new GenericRepository<Package>(_context); }
        }

        public IGenericRepository<PackageItinerary> PackageItineraries
        {
            get { return _packageItineraries ??= new GenericRepository<PackageItinerary>(_context); }
        }

        public IGenericRepository<PackageFeature> PackageFeatures
        {
            get { return _packageFeatures ??= new GenericRepository<PackageFeature>(_context); }
        }

        public IGenericRepository<PackageHotel> PackageHotels
        {
            get { return _packageHotels ??= new GenericRepository<PackageHotel>(_context); }
        }

        public IGenericRepository<CustomerVideo> CustomerVideos
        {
            get { return _customerVideos ??= new GenericRepository<CustomerVideo>(_context); }
        }

        #endregion

        #region Accommodation Repositories

        public IGenericRepository<City> Cities
        {
            get { return _cities ??= new GenericRepository<City>(_context); }
        }

        public IGenericRepository<Hotel> Hotels
        {
            get { return _hotels ??= new GenericRepository<Hotel>(_context); }
        }

        public IGenericRepository<Room> Rooms
        {
            get { return _rooms ??= new GenericRepository<Room>(_context); }
        }

        public IGenericRepository<RatePlan> RatePlans
        {
            get { return _ratePlans ??= new GenericRepository<RatePlan>(_context); }
        }

        public IGenericRepository<HotelImage> HotelImages
        {
            get { return _hotelImages ??= new GenericRepository<HotelImage>(_context); }
        }

        public IGenericRepository<Amenity> Amenities
        {
            get { return _amenities ??= new GenericRepository<Amenity>(_context); }
        }

        public IGenericRepository<HotelAmenity> HotelAmenities
        {
            get { return _hotelAmenities ??= new GenericRepository<HotelAmenity>(_context); }
        }

        public IGenericRepository<HotelBadge> HotelBadges
        {
            get { return _hotelBadges ??= new GenericRepository<HotelBadge>(_context); }
        }

        public IGenericRepository<HotelHighlight> HotelHighlights
        {
            get { return _hotelHighlights ??= new GenericRepository<HotelHighlight>(_context); }
        }

        public IGenericRepository<RoomFeature> RoomFeatures
        {
            get { return _roomFeatures ??= new GenericRepository<RoomFeature>(_context); }
        }

        #endregion

        #region Aviation Repositories

        public IGenericRepository<Airline> Airlines
        {
            get { return _airlines ??= new GenericRepository<Airline>(_context); }
        }

        public IGenericRepository<Airport> Airports
        {
            get { return _airports ??= new GenericRepository<Airport>(_context); }
        }

        public IGenericRepository<Flight> Flights
        {
            get { return _flights ??= new GenericRepository<Flight>(_context); }
        }

        public IGenericRepository<FlightSchedule> FlightSchedules
        {
            get { return _flightSchedules ??= new GenericRepository<FlightSchedule>(_context); }
        }

        public IGenericRepository<Seat> Seats
        {
            get { return _seats ??= new GenericRepository<Seat>(_context); }
        }

        #endregion

        #region Reservations Repositories

        public IGenericRepository<Booking> Bookings
        {
            get { return _bookings ??= new GenericRepository<Booking>(_context); }
        }

        public IGenericRepository<HotelBooking> HotelBookings
        {
            get { return _hotelBookings ??= new GenericRepository<HotelBooking>(_context); }
        }

        public IGenericRepository<FlightBooking> FlightBookings
        {
            get { return _flightBookings ??= new GenericRepository<FlightBooking>(_context); }
        }

        public IGenericRepository<FlightPassenger> FlightPassengers
        {
            get { return _flightPassengers ??= new GenericRepository<FlightPassenger>(_context); }
        }

        public IGenericRepository<PackageBooking> PackageBookings
        {
            get { return _packageBookings ??= new GenericRepository<PackageBooking>(_context); }
        }

        public IGenericRepository<Payment> Payments
        {
            get { return _payments ??= new GenericRepository<Payment>(_context); }
        }

        public IGenericRepository<Coupon> Coupons
        {
            get { return _coupons ??= new GenericRepository<Coupon>(_context); }
        }

        public IGenericRepository<BookingAddon> BookingAddons
        {
            get { return _bookingAddons ??= new GenericRepository<BookingAddon>(_context); }
        }

        public IGenericRepository<InstallmentPayment> InstallmentPayments
        {
            get { return _installmentPayments ??= new GenericRepository<InstallmentPayment>(_context); }
        }

        #endregion

        #region Content Repositories

        public IGenericRepository<HeroSlide> HeroSlides
        {
            get { return _heroSlides ??= new GenericRepository<HeroSlide>(_context); }
        }

        public IGenericRepository<Testimonial> Testimonials
        {
            get { return _testimonials ??= new GenericRepository<Testimonial>(_context); }
        }

        public IGenericRepository<Partner> Partners
        {
            get { return _partners ??= new GenericRepository<Partner>(_context); }
        }

        public IGenericRepository<BoardMember> BoardMembers
        {
            get { return _boardMembers ??= new GenericRepository<BoardMember>(_context); }
        }

        public IGenericRepository<CompanySetting> CompanySettings
        {
            get { return _companySettings ??= new GenericRepository<CompanySetting>(_context); }
        }

        public IGenericRepository<BlogPost> BlogPosts
        {
            get { return _blogPosts ??= new GenericRepository<BlogPost>(_context); }
        }

        #endregion

        #region WhatsApp Repositories

        public IGenericRepository<WhatsAppConversation> WhatsAppConversations
        {
            get { return _whatsappConversations ??= new GenericRepository<WhatsAppConversation>(_context); }
        }

        public IGenericRepository<WhatsAppMessage> WhatsAppMessages
        {
            get { return _whatsappMessages ??= new GenericRepository<WhatsAppMessage>(_context); }
        }

        public IGenericRepository<WhatsAppKnowledge> WhatsAppKnowledge
        {
            get { return _whatsappKnowledge ??= new GenericRepository<WhatsAppKnowledge>(_context); }
        }

        #endregion

        #region Unit of Work Methods

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        }

        public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                await SaveChangesAsync(cancellationToken);
                if (_transaction != null)
                {
                    await _transaction.CommitAsync(cancellationToken);
                }
            }
            catch
            {
                await RollbackTransactionAsync(cancellationToken);
                throw;
            }
            finally
            {
                if (_transaction != null)
                {
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
        }

        public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync(cancellationToken);
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        #endregion

        #region Dispose

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }

        #endregion
    }
}

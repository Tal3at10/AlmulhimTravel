using Core.Domain.Entities.Identity;
using Core.Domain.Entities.Catalog;
using Core.Domain.Entities.Accommodation;
using Core.Domain.Entities.Aviation;
using Core.Domain.Entities.Reservations;
using Core.Domain.Entities.Content;
using Core.Domain.Entities.WhatsApp;
using Core.Domain.Entities.System;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Infrastructure.Persistence.Data
{
    public class AlmulhemDbContext : DbContext
    {
        public AlmulhemDbContext(DbContextOptions<AlmulhemDbContext> options) : base(options)
        {
        }

        // Identity
        public DbSet<User> Users { get; set; }
        public DbSet<UserFavorite> UserFavorites { get; set; }
        public DbSet<WalletTransaction> WalletTransactions { get; set; }
        public DbSet<LoyaltyTransaction> LoyaltyTransactions { get; set; }

        // Catalog
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<PackageItinerary> PackageItineraries { get; set; }
        public DbSet<PackageFeature> PackageFeatures { get; set; }
        public DbSet<PackageHotel> PackageHotels { get; set; }
        public DbSet<CustomerVideo> CustomerVideos { get; set; }

        // Accommodation
        public DbSet<City> Cities { get; set; }
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RatePlan> RatePlans { get; set; }
        public DbSet<HotelImage> HotelImages { get; set; }
        public DbSet<Amenity> Amenities { get; set; }
        public DbSet<HotelAmenity> HotelAmenities { get; set; }
        public DbSet<HotelBadge> HotelBadges { get; set; }
        public DbSet<HotelHighlight> HotelHighlights { get; set; }
        public DbSet<RoomFeature> RoomFeatures { get; set; }

        // Aviation
        public DbSet<Airline> Airlines { get; set; }
        public DbSet<Airport> Airports { get; set; }
        public DbSet<Flight> Flights { get; set; }
        public DbSet<FlightSchedule> FlightSchedules { get; set; }
        public DbSet<Seat> Seats { get; set; }

        // Reservations
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<HotelBooking> HotelBookings { get; set; }
        public DbSet<FlightBooking> FlightBookings { get; set; }
        public DbSet<FlightPassenger> FlightPassengers { get; set; }
        public DbSet<PackageBooking> PackageBookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        
        // Marketing / Social Media
        public DbSet<Core.Domain.Entities.PromotionalAd> PromotionalAds { get; set; }
        public DbSet<BookingAddon> BookingAddons { get; set; }
        public DbSet<InstallmentPayment> InstallmentPayments { get; set; }

        // Content
        public DbSet<HeroSlide> HeroSlides { get; set; }
        public DbSet<Testimonial> Testimonials { get; set; }
        public DbSet<Partner> Partners { get; set; }
        public DbSet<BoardMember> BoardMembers { get; set; }
        public DbSet<CompanySetting> CompanySettings { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }

        // WhatsApp
        public DbSet<WhatsAppConversation> WhatsAppConversations { get; set; }
        public DbSet<WhatsAppMessage> WhatsAppMessages { get; set; }
        public DbSet<WhatsAppKnowledge> WhatsAppKnowledge { get; set; }
        // System
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply all configurations from the assembly
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}

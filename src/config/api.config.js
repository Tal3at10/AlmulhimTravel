/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,

  // API Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },

    // Wallet
    WALLET: {
      GET: '/wallet',
      CONVERT: '/wallet/convert',
    },

    // Users
    USERS: {
      PROFILE: '/users/me',
      UPDATE_PROFILE: '/users/me',
      CHANGE_PASSWORD: '/users/change-password',
      FAVORITES: '/users/favorites',
      ADD_FAVORITE: (type, id) => `/users/favorites/${type}/${id}`,
      REMOVE_FAVORITE: (id) => `/users/favorites/${id}`,
    },

    // Packages
    PACKAGES: {
      FEATURED: '/packages/featured',
      ALL: '/packages',
      BY_ID: (id) => `/packages/${encodeURIComponent(id)}`,
    },

    // Destinations
    DESTINATIONS: {
      FEATURED: '/destinations/featured',
      ALL: '/destinations',
      BY_SLUG: (slug) => `/destinations/${encodeURIComponent(slug)}`,
      VIDEOS: (id) => `/destinations/${encodeURIComponent(id)}/videos`,
    },

    // Hotels
    HOTELS: {
      SEARCH: '/hotels/search',
      BY_ID: (id) => `/hotels/${id}`,
      ROOMS: (id) => `/hotels/${id}/rooms`,
      POPULAR_DESTINATIONS: '/hotels/destinations/popular',
    },

    // Flights
    FLIGHTS: {
      SEARCH: '/flights/search',
      BY_ID: (id) => `/flights/${id}`,
      POPULAR_AIRPORTS: '/flights/airports/popular',
    },

    // Bookings
    BOOKINGS: {
      CREATE_HOTEL: '/bookings/hotel',
      CREATE_FLIGHT: '/bookings/flight',
      CREATE_PACKAGE: '/bookings/package',
      LOOKUP: '/bookings/lookup',
      MY_BOOKINGS: '/bookings/my',
      CANCEL: (id) => `/bookings/${id}/cancel`,
    },

    // Payments
    PAYMENTS: {
      INITIATE: '/payments/initiate',
      VERIFY: '/payments/verify',
    },

    // CMS
    CMS: {
      HERO_SLIDES: '/cms/hero-slides',
      TESTIMONIALS: '/cms/testimonials',
      PARTNERS: '/cms/partners',
      BOARD_MEMBERS: '/cms/board-members',
      SETTINGS: (key) => `/cms/settings/${key}`,
      CUSTOMER_VIDEOS: '/cms/customer-videos',
    },

    // Blog Posts (Public)
    BLOG_POSTS: {
      ALL: '/blogposts',
      BY_SLUG: (slug) => `/blogposts/${slug}`,
    },

    // Duffel - Real-time Hotels & Flights
    DUFFEL: {
      // Hotels (Currently mapped to amadeus route in backend which wraps DuffelService)
      HOTELS: {
        SEARCH: '/amadeus/hotels/search',
        BY_CITY: (cityCode) => `/amadeus/hotels/by-city/${cityCode}`,
        OFFERS: (hotelId) => `/amadeus/hotels/${hotelId}/offers`,
        CITIES: '/hotels/destinations/popular',
      },
      // Flights
      FLIGHTS: {
        SEARCH: '/amadeus/flights/search',
        AIRPORTS: '/amadeus/flights/airports',
        CLASSES: '/amadeus/flights/classes',
      },
    },

    // RapidAPI - Multi-Provider Search (Booking.com, Tripadvisor)
    RAPIDAPI: {
      HOTELS: {
        SEARCH: '/amadeus/hotels/search',
        BOOKING_SEARCH: '/rapidapi/hotels/booking/search',
        DESTINATIONS: '/rapidapi/hotels/destinations',
        DETAILS: (hotelId) => `/rapidapi/hotels/${hotelId}`,
      },
    },

    // Hotel Comparison (Trivago-style)
    COMPARISON: {
      SEARCH: '/hotels/compare/search',
      PROVIDERS: '/hotels/compare/providers',
      DESTINATIONS: '/hotels/compare/destinations',
    },

    // Autocomplete Locations
    LOCATIONS: {
      HOTELS: '/locations/hotels',
      FLIGHTS: '/locations/flights',
    },
  },
};

export default API_CONFIG;

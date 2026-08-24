/**
 * API Service
 * Centralized service for all API calls
 */

import axios from '../lib/axios';
import { API_CONFIG } from '../config/api.config';

const apiService = {
  // ==================== AUTH ====================
  auth: {
    register: (data) => axios.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data),
    login: (data) => axios.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data),
    logout: () => axios.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT),
    forgotPassword: (email) => axios.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
    resetPassword: (data) => axios.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, data),
  },

  // ==================== USERS ====================
  users: {
    getProfile: () => axios.get(API_CONFIG.ENDPOINTS.USERS.PROFILE),
    updateProfile: (data) => axios.put(API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE, data),
    changePassword: (data) => axios.post(API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD, data),
    getFavorites: () => axios.get(API_CONFIG.ENDPOINTS.USERS.FAVORITES),
    addFavorite: (type, id) => axios.post(API_CONFIG.ENDPOINTS.USERS.ADD_FAVORITE(type, id)),
    removeFavorite: (id) => axios.delete(API_CONFIG.ENDPOINTS.USERS.REMOVE_FAVORITE(id)),
  },

  // ==================== PACKAGES ====================
  packages: {
    getFeatured: (count = 10) => axios.get(`${API_CONFIG.ENDPOINTS.PACKAGES.FEATURED}?count=${count}`),
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return axios.get(`${API_CONFIG.ENDPOINTS.PACKAGES.ALL}?${queryString}`);
    },
    getById: (id) => axios.get(API_CONFIG.ENDPOINTS.PACKAGES.BY_ID(id)),
  },

  // ==================== DESTINATIONS ====================
  destinations: {
    getFeatured: (count = 8) => axios.get(`${API_CONFIG.ENDPOINTS.DESTINATIONS.FEATURED}?count=${count}`),
    getAll: () => axios.get(API_CONFIG.ENDPOINTS.DESTINATIONS.ALL),
    getBySlug: (slug) => axios.get(API_CONFIG.ENDPOINTS.DESTINATIONS.BY_SLUG(slug)),
    getVideos: (id) => axios.get(API_CONFIG.ENDPOINTS.DESTINATIONS.VIDEOS(id)),
  },

  // ==================== HOTELS ====================
  hotels: {
    search: (params) => {
      const queryString = new URLSearchParams(params).toString();
      return axios.get(`${API_CONFIG.ENDPOINTS.HOTELS.SEARCH}?${queryString}`);
    },
    getById: (id, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return axios.get(`${API_CONFIG.ENDPOINTS.HOTELS.BY_ID(id)}?${queryString}`);
    },
    getRooms: (id, params) => {
      const queryString = new URLSearchParams(params).toString();
      return axios.get(`${API_CONFIG.ENDPOINTS.HOTELS.ROOMS(id)}?${queryString}`);
    },
    getPopularDestinations: () => axios.get(API_CONFIG.ENDPOINTS.HOTELS.POPULAR_DESTINATIONS),
  },

  // ==================== FLIGHTS ====================
  flights: {
    search: (params) => {
      const queryString = new URLSearchParams(params).toString();
      return axios.get(`${API_CONFIG.ENDPOINTS.FLIGHTS.SEARCH}?${queryString}`);
    },
    getById: (id) => axios.get(API_CONFIG.ENDPOINTS.FLIGHTS.BY_ID(id)),
    getPopularAirports: () => axios.get(API_CONFIG.ENDPOINTS.FLIGHTS.POPULAR_AIRPORTS),
  },

  // ==================== BOOKINGS ====================
  bookings: {
    createHotel: (data) => axios.post(API_CONFIG.ENDPOINTS.BOOKINGS.CREATE_HOTEL, data),
    createFlight: (data) => axios.post(API_CONFIG.ENDPOINTS.BOOKINGS.CREATE_FLIGHT, data),
    createPackage: (data) => axios.post(API_CONFIG.ENDPOINTS.BOOKINGS.CREATE_PACKAGE, data),
    lookup: (reference, email) => {
      const params = new URLSearchParams({ reference, email }).toString();
      return axios.get(`${API_CONFIG.ENDPOINTS.BOOKINGS.LOOKUP}?${params}`);
    },
    getById: (id) => axios.get(`/api/Bookings/${id}`),
    confirm: (id) => axios.post(`/api/Bookings/confirm-test/${id}`),
    getMyBookings: () => axios.get(API_CONFIG.ENDPOINTS.BOOKINGS.MY_BOOKINGS),
    cancel: (id) => axios.post(API_CONFIG.ENDPOINTS.BOOKINGS.CANCEL(id)),
  },

  // ==================== CUSTOMER RFP ====================
  rfp: {
    submit: (data) => axios.post('/customer-rfp', data),
  },

  // ==================== PAYMENTS ====================
  payments: {
    initiate: (data) => axios.post(API_CONFIG.ENDPOINTS.PAYMENTS.INITIATE, data),
    verify: (paymentId) => axios.post(API_CONFIG.ENDPOINTS.PAYMENTS.VERIFY, { paymentId }),
  },

  // ==================== CMS ====================
  cms: {
    getHeroSlides: () => axios.get(API_CONFIG.ENDPOINTS.CMS.HERO_SLIDES),
    getTestimonials: () => axios.get(API_CONFIG.ENDPOINTS.CMS.TESTIMONIALS),
    getPartners: () => axios.get(API_CONFIG.ENDPOINTS.CMS.PARTNERS),
    getBoardMembers: () => axios.get(API_CONFIG.ENDPOINTS.CMS.BOARD_MEMBERS),
    getSetting: (key) => axios.get(API_CONFIG.ENDPOINTS.CMS.SETTINGS(key)),
    getCustomerVideos: (destination = null) => {
      const params = destination ? `?destination=${encodeURIComponent(destination)}` : '';
      // Optional widget: don't show global error toast if the destination isn't found
      return axios.get(`${API_CONFIG.ENDPOINTS.CMS.CUSTOMER_VIDEOS}${params}`, { suppressErrorToast: true });
    },
  },

  // ==================== BLOG POSTS (Public) ====================
  blogPosts: {
    getAll: () => axios.get(API_CONFIG.ENDPOINTS.BLOG_POSTS.ALL),
    getBySlug: (slug) => axios.get(API_CONFIG.ENDPOINTS.BLOG_POSTS.BY_SLUG(slug)),
  },

  // ==================== DUFFEL (Real-time Flights & Hotels) ====================
  duffel: {
    // Hotels - Real-time search from Duffel Stays
    hotels: {
      /**
       * Search hotels with prices
       * @param {Object} params - { cityCode, checkIn, checkOut, adults, rooms }
       */
      search: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return axios.get(`${API_CONFIG.ENDPOINTS.DUFFEL.HOTELS.SEARCH}?${queryString}`);
      },

      /**
       * Get hotels by city code
       * @param {string} cityCode - IATA city code (LON, DXB, etc.)
       * @param {number} radius - Search radius in KM
       */
      getByCity: (cityCode, radius = 50) => {
        return axios.get(`${API_CONFIG.ENDPOINTS.DUFFEL.HOTELS.BY_CITY(cityCode)}?radius=${radius}`);
      },

      /**
       * Get hotel offers/pricing
       * @param {string} hotelId - Duffel hotel ID
       * @param {Object} params - { checkIn, checkOut, adults, rooms }
       */
      getOffers: (hotelId, params) => {
        const queryString = new URLSearchParams(params).toString();
        return axios.get(`${API_CONFIG.ENDPOINTS.DUFFEL.HOTELS.OFFERS(hotelId)}?${queryString}`);
      },

      /**
       * Get list of supported cities
       */
      getCities: () => axios.get(API_CONFIG.ENDPOINTS.DUFFEL.HOTELS.CITIES),

        /**
         * Get full hotel details
         */
        getDetails: (hotelId, params) => {
          const queryString = new URLSearchParams(params).toString();
          return axios.get(API_CONFIG.ENDPOINTS.DUFFEL.HOTELS.OFFERS(hotelId) + '?' + queryString);
        },
    },

    // Flights - Real-time search from Duffel Flights
    flights: {
      /**
       * Search flights
       * @param {Object} params - { origin, destination, departureDate, returnDate?, adults, travelClass }
       */
      search: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return axios.get(`${API_CONFIG.ENDPOINTS.DUFFEL.FLIGHTS.SEARCH}?${queryString}`);
      },

      /**
       * Get list of airports
       */
      getAirports: () => axios.get(API_CONFIG.ENDPOINTS.DUFFEL.FLIGHTS.AIRPORTS),

      /**
       * Get travel classes
       */
      getClasses: () => axios.get(API_CONFIG.ENDPOINTS.DUFFEL.FLIGHTS.CLASSES),
    },
  },

  // ==================== RAPIDAPI / COMPARISON REMOVED ====================
  // All integrations now strictly use Duffel for consistency.

  // ==================== LOCATIONS ====================
  locations: {
    searchHotels: (query) => axios.get(API_CONFIG.ENDPOINTS.LOCATIONS.HOTELS, { params: { query } }),
    searchFlights: (query) => axios.get(API_CONFIG.ENDPOINTS.LOCATIONS.FLIGHTS, { params: { query } }),
  },
};

export default apiService;

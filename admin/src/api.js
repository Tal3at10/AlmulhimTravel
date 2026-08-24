import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.DEV
    ? '/api'
    : '/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Arabic error messages mapping
const arabicErrorMessages = {
    // Validation errors
    'TitleAr is required': 'العنوان بالعربية مطلوب',
    'TitleEn is required': 'العنوان بالإنجليزية مطلوب',
    'NameAr is required': 'الاسم بالعربية مطلوب',
    'NameEn is required': 'الاسم بالإنجليزية مطلوب',
    'Slug is required': 'الرابط المختصر (Slug) مطلوب',
    'ImageUrl is required': 'رابط الصورة مطلوب',
    'CustomerName is required': 'اسم العميل مطلوب',
    'VideoUrl is required': 'رابط الفيديو مطلوب',
    'Content is required': 'المحتوى مطلوب',
    'Description is required': 'الوصف مطلوب',
    'Country is required': 'الدولة مطلوبة',
    'DestinationId is required': 'الوجهة مطلوبة',
    'Price is required': 'السعر مطلوب',
    'Duration is required': 'المدة مطلوبة',
    
    // URL validation errors
    'Invalid URL format': 'صيغة الرابط غير صحيحة',
    'Invalid ImageUrl URL': 'رابط الصورة غير صالح',
    'Invalid VideoUrl format': 'رابط الفيديو غير صالح',
    'Invalid CustomerImage URL': 'صورة العميل غير صالحة',
    'Invalid ThumbnailUrl format': 'صورة المعاينة غير صالحة',
    
    // Format errors
    'Slug must be lowercase letters, numbers, and hyphens only': 'الرابط المختصر يجب أن يحتوي فقط على حروف صغيرة وأرقام وشرطات',
    'Rating must be between 1 and 5': 'التقييم يجب أن يكون بين 1 و 5',
    
    // Database errors
    'Validation failed': 'فشل التحقق من البيانات',
    'An error occurred while saving the entity changes': 'حدث خطأ أثناء حفظ البيانات',
    'See the inner exception for details': 'تفاصيل الخطأ في السجل الداخلي',
    
    // General errors
    'Not found': 'العنصر غير موجود',
    'Already exists': 'العنصر موجود بالفعل',
    'Unauthorized': 'غير مصرح - يرجى تسجيل الدخول مرة أخرى',
    'Forbidden': 'ليس لديك صلاحية لهذا الإجراء',
    'Bad request': 'طلب غير صالح',
    'Server error': 'خطأ في الخادم - يرجى المحاولة لاحقاً',
    'Network error': 'خطأ في الاتصال - يرجى التحقق من الإنترنت',
};

// Translate error message to Arabic
function translateErrorMessage(message) {
    if (!message) return 'حدث خطأ غير معروف';
    
    // Check direct mapping
    if (arabicErrorMessages[message]) {
        return arabicErrorMessages[message];
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(arabicErrorMessages)) {
        if (message.includes(key)) {
            return value;
        }
    }
    
    // Return original if no translation found (but wrapped in Arabic context)
    return message;
}

// Extract all errors from response
function extractErrors(errorData) {
    const errors = [];
    
    if (!errorData) return errors;
    
    // Handle array of errors
    if (Array.isArray(errorData.errors)) {
        errorData.errors.forEach(err => {
            if (typeof err === 'string') {
                errors.push(translateErrorMessage(err));
            } else if (err.message) {
                errors.push(translateErrorMessage(err.message));
            }
        });
    }
    
    // Handle single error message
    if (errorData.message) {
        errors.push(translateErrorMessage(errorData.message));
    }
    
    // Handle title error
    if (errorData.title && errorData.title !== 'One or more validation errors occurred.') {
        errors.push(translateErrorMessage(errorData.title));
    }
    
    return errors.length > 0 ? errors : ['حدث خطأ أثناء معالجة الطلب'];
}

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — handle errors and unwrap data
api.interceptors.response.use(
    (response) => {
        // Unwrap backend Result<T> if present
        if (response.data && response.data.isSuccess !== undefined) {
            response.data = response.data.data;
        }
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const errorData = error.response?.data;
        
        // Handle 401 - Unauthorized
        if (status === 401) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            toast.error('انتهت الجلسة - يرجى تسجيل الدخول مرة أخرى');
            window.location.href = '/admin/login';
            return Promise.reject(error);
        }
        
        // Handle 403 - Forbidden
        if (status === 403) {
            toast.error('ليس لديك صلاحية لهذا الإجراء');
            return Promise.reject(error);
        }
        
        // Handle 400 - Validation errors
        if (status === 400) {
            const errors = extractErrors(errorData);
            
            // Show detailed error toast
            if (errors.length === 1) {
                toast.error(errors[0], {
                    duration: 5000,
                    icon: '⚠️',
                });
            } else {
                // Multiple errors - show list
                const errorList = errors.slice(0, 3).join('\n• ');
                const moreText = errors.length > 3 ? `\n... و ${errors.length - 3} أخطاء أخرى` : '';
                toast.error(`⚠️ تم العثور على ${errors.length} أخطاء:\n• ${errorList}${moreText}`, {
                    duration: 6000,
                });
            }
            
            // Attach translated errors to error object for components
            error.translatedErrors = errors;
            return Promise.reject(error);
        }
        
        // Handle 500 - Server errors
        if (status === 500) {
            const message = errorData?.message || 'حدث خطأ في الخادم';
            toast.error(translateErrorMessage(message), {
                duration: 5000,
                icon: '🔥',
            });
            return Promise.reject(error);
        }
        
        // Network errors
        if (!status) {
            toast.error('خطأ في الاتصال - يرجى التحقق من الإنترنت', {
                duration: 4000,
                icon: '📡',
            });
            return Promise.reject(error);
        }
        
        // Default error handling
        const defaultMessage = errorData?.message || 'حدث خطأ غير متوقع';
        toast.error(translateErrorMessage(defaultMessage), {
            duration: 4000,
        });
        
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authAPI = {
    login: (data) => api.post('/admin/auth/login', data),
    verify: () => api.get('/admin/auth/verify'),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/admin/admindashboard/stats'),
    getRecentBookings: (count = 10) => api.get(`/admin/admindashboard/recent-bookings?count=${count}`),
};

// CMS API
export const cmsAPI = {
    // Hero Slides
    getHeroSlides: () => api.get('/admin/admincms/hero-slides'),
    getHeroSlide: (id) => api.get(`/admin/admincms/hero-slides/${id}`),
    createHeroSlide: (data) => api.post('/admin/admincms/hero-slides', data),
    updateHeroSlide: (id, data) => api.put(`/admin/admincms/hero-slides/${id}`, data),
    deleteHeroSlide: (id) => api.delete(`/admin/admincms/hero-slides/${id}`),

    // Testimonials
    getTestimonials: () => api.get('/admin/admincms/testimonials'),
    createTestimonial: (data) => api.post('/admin/admincms/testimonials', data),
    updateTestimonial: (id, data) => api.put(`/admin/admincms/testimonials/${id}`, data),
    deleteTestimonial: (id) => api.delete(`/admin/admincms/testimonials/${id}`),

    // Partners
    getPartners: () => api.get('/admin/admincms/partners'),
    createPartner: (data) => api.post('/admin/admincms/partners', data),
    updatePartner: (id, data) => api.put(`/admin/admincms/partners/${id}`, data),
    deletePartner: (id) => api.delete(`/admin/admincms/partners/${id}`),

    // Board Members
    getBoardMembers: () => api.get('/admin/admincms/board-members'),
    createBoardMember: (data) => api.post('/admin/admincms/board-members', data),
    updateBoardMember: (id, data) => api.put(`/admin/admincms/board-members/${id}`, data),
    deleteBoardMember: (id) => api.delete(`/admin/admincms/board-members/${id}`),

    // Settings
    getSettings: () => api.get('/admin/admincms/settings'),
    updateSetting: (key, data) => api.put(`/admin/admincms/settings/${key}`, data),

    // Customer Videos
    getCustomerVideos: () => api.get('/admin/admincms/customer-videos'),
    createCustomerVideo: (data) => api.post('/admin/admincms/customer-videos', data),
    updateCustomerVideo: (id, data) => api.put(`/admin/admincms/customer-videos/${id}`, data),
    deleteCustomerVideo: (id) => api.delete(`/admin/admincms/customer-videos/${id}`),

    // Blog Posts
    getBlogPosts: () => api.get('/admin/adminblogposts'),
    createBlogPost: (data) => api.post('/admin/adminblogposts', data),
    updateBlogPost: (id, data) => api.put(`/admin/adminblogposts/${id}`, data),
    deleteBlogPost: (id) => api.delete(`/admin/adminblogposts/${id}`),
};

// Destinations API
export const destinationsAPI = {
    getAll: () => api.get('/admin/admindestinations'),
    getById: (id) => api.get(`/admin/admindestinations/${id}`),
    create: (data) => api.post('/admin/admindestinations', data),
    update: (id, data) => api.put(`/admin/admindestinations/${id}`, data),
    delete: (id) => api.delete(`/admin/admindestinations/${id}`),
};

// Packages API
export const packagesAPI = {
    getAll: (params) => api.get('/admin/adminpackages', { params }),
    getById: (id) => api.get(`/admin/adminpackages/${id}`),
    create: (data) => api.post('/admin/adminpackages', data),
    update: (id, data) => api.put(`/admin/adminpackages/${id}`, data),
    delete: (id) => api.delete(`/admin/adminpackages/${id}`),
    // Itinerary Management
    getItinerary: (packageId) => api.get(`/admin/adminpackages/${packageId}/itinerary`),
    addItineraryItem: (packageId, data) => api.post(`/admin/adminpackages/${packageId}/itinerary`, data),
    updateItineraryItem: (itemId, data) => api.put(`/admin/adminpackages/itinerary/${itemId}`, data),
    deleteItineraryItem: (itemId) => api.delete(`/admin/adminpackages/itinerary/${itemId}`),
    // Hotel Management
    getHotels: (packageId) => api.get(`/admin/adminpackages/${packageId}/hotels`),
    addHotel: (packageId, data) => api.post(`/admin/adminpackages/${packageId}/hotels`, data),
    updateHotel: (packageId, hotelId, data) => api.put(`/admin/adminpackages/${packageId}/hotels/${hotelId}`, data),
    deleteHotel: (packageId, hotelId) => api.delete(`/admin/adminpackages/${packageId}/hotels/${hotelId}`),
};

// Bookings API
export const bookingsAPI = {
    getAll: (params) => api.get('/admin/adminbookings', { params }),
    getById: (id) => api.get(`/admin/adminbookings/${id}`),
    confirm: (id) => api.put(`/admin/adminbookings/${id}/confirm`),
    cancel: (id) => api.put(`/admin/adminbookings/${id}/cancel`),
};

// Users API
export const usersAPI = {
    getAll: () => api.get('/admin/adminusers'),
    getById: (id) => api.get(`/admin/adminusers/${id}`),
    toggleActive: (id) => api.put(`/admin/adminusers/${id}/toggle-active`),
};

// WhatsApp API
export const whatsappAPI = {
    // Bot Kill Switch
    getBotStatus: () => api.get('/admin/whatsapp/bot-status'),
    toggleBot: (enabled) => api.post('/admin/whatsapp/bot-toggle', { enabled }),

    // Knowledge Base
    getKnowledge: () => api.get('/admin/whatsapp/knowledge'),
    addKnowledge: (data) => api.post('/admin/whatsapp/knowledge', data),
    updateKnowledge: (id, data) => api.put(`/admin/whatsapp/knowledge/${id}`, data),
    deleteKnowledge: (id) => api.delete(`/admin/whatsapp/knowledge/${id}`),
    
    // Conversations
    getConversations: (page = 1, pageSize = 50) => api.get(`/admin/whatsapp/conversations?page=${page}&pageSize=${pageSize}`),
    getConversationDetails: (id) => api.get(`/admin/whatsapp/conversations/${id}`),
    takeoverConversation: (id) => api.post(`/admin/whatsapp/conversations/${id}/takeover`),
    releaseConversation: (id) => api.post(`/admin/whatsapp/conversations/${id}/release`),
    sendMessage: (id, data) => api.post(`/admin/whatsapp/conversations/${id}/send`, data),
};

// Customer Requests API
export const customerRequestsAPI = {
    getAll: () => api.get('/v1/CustomerRequests'),
    getById: (id) => api.get(`/v1/CustomerRequests/${id}`),
    create: (data) => api.post('/v1/CustomerRequests', data),
    sendToAgents: (id, data) => api.post(`/v1/CustomerRequests/${id}/send-to-agents`, data),
};

// Quotations API
export const quotationsAPI = {
    getCompare: (requestId) => api.get(`/v1/Quotations/compare/${requestId}`),
    accept: (id, data) => api.post(`/v1/Quotations/${id}/accept`, data),
    reject: (id, reason) => api.post(`/v1/Quotations/${id}/reject`, { reason }),
};

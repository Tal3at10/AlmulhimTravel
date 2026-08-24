import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Calendar, Users, MapPin, SlidersHorizontal, X,
    Star, Check, ChevronDown, Map, Wifi, Car, Dumbbell,
    Waves, Coffee, Sparkles, AlertCircle, BarChart3, Building2
} from 'lucide-react';
import HotelComparisonCard from '../components/hotels/HotelComparisonCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Footer from '../components/layout/Footer';
import apiService from '../services/api.service';

// Sort options
const sortOptions = [
    { id: 'price-low', label: 'السعر: من الأقل' },
    { id: 'price-high', label: 'السعر: من الأعلى' },
    { id: 'rating', label: 'التقييم الأعلى' },
    { id: 'offers', label: 'أكثر العروض' },
];

// Popular filters
const popularFilters = [
    { id: 'breakfast', label: 'إفطار مشمول', icon: Coffee },
    { id: 'free-cancel', label: 'إلغاء مجاني', icon: Check },
    { id: 'pool', label: 'مسبح', icon: Waves },
    { id: 'gym', label: 'صالة رياضية', icon: Dumbbell },
    { id: 'parking', label: 'موقف سيارات', icon: Car },
    { id: 'wifi', label: 'واي فاي مجاني', icon: Wifi },
];

/**
 * Hotel Price Comparison Page (Trivago-style)
 * Searches hotels from multiple providers and shows price comparison
 */
const HotelPriceComparison = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Data state
    const [hotels, setHotels] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [providers, setProviders] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Filter state
    const [sortBy, setSortBy] = useState('price-low');
    const [selectedStars, setSelectedStars] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedProviders, setSelectedProviders] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Search form state
    const [destination, setDestination] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [rooms, setRooms] = useState(1);

    // Fetch destinations and providers on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [destResponse, provResponse] = await Promise.all([
                    apiService.comparison.getDestinations(),
                    apiService.comparison.getProviders(),
                ]);

                if (destResponse?.success && destResponse.data) {
                    setDestinations(destResponse.data);
                }
                if (provResponse?.success && provResponse.data) {
                    setProviders(provResponse.data);
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
            }
        };
        fetchInitialData();
    }, []);

    // Initialize from URL params
    useEffect(() => {
        const dest = searchParams.get('destination') || 'لندن';
        const checkInParam = searchParams.get('checkIn');
        const checkOutParam = searchParams.get('checkOut');
        const guestsParam = searchParams.get('guests');
        const roomsParam = searchParams.get('rooms');

        setDestination(dest);

        // Set default dates if not provided (tomorrow and day after)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 4);

        setCheckIn(checkInParam || tomorrow.toISOString().split('T')[0]);
        setCheckOut(checkOutParam || dayAfter.toISOString().split('T')[0]);
        if (guestsParam) setGuests(Number(guestsParam));
        if (roomsParam) setRooms(Number(roomsParam));
    }, [searchParams]);

    // Search hotels with price comparison
    const searchHotels = useCallback(async () => {
        if (!destination || !checkIn || !checkOut) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            console.log('Calling Hotel Comparison API:', { destination, checkIn, checkOut, guests, rooms });

            const response = await apiService.comparison.search({
                destination,
                checkIn,
                checkOut,
                adults: guests,
                rooms,
            });

            console.log('Comparison API Response:', response);

            if (response?.success && response.data) {
                setHotels(response.data);
                setMeta(response.meta);
            } else {
                setHotels([]);
                setError('لا توجد فنادق متاحة لهذه الوجهة');
            }
        } catch (err) {
            console.error('Error searching hotels:', err);
            setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
            setHotels([]);
        } finally {
            setLoading(false);
        }
    }, [destination, checkIn, checkOut, guests, rooms]);

    // Auto-search when params are ready
    useEffect(() => {
        if (destination && checkIn && checkOut && !hasSearched) {
            searchHotels();
        }
    }, [destination, checkIn, checkOut, hasSearched, searchHotels]);

    // Handle search button click
    const handleSearch = () => {
        // Update URL
        setSearchParams({
            destination,
            checkIn,
            checkOut,
            guests: guests.toString(),
            rooms: rooms.toString(),
        });

        // Force new search
        setHasSearched(false);
    };

    // Sort hotels
    const sortedHotels = [...hotels].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return (a.lowestPrice || Infinity) - (b.lowestPrice || Infinity);
            case 'price-high':
                return (b.lowestPrice || 0) - (a.lowestPrice || 0);
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'offers':
                return (b.offers?.length || 0) - (a.offers?.length || 0);
            default:
                return 0;
        }
    });

    // Filter hotels by stars and providers
    const filteredHotels = sortedHotels.filter(hotel => {
        // Star filter
        if (selectedStars.length > 0 && !selectedStars.includes(hotel.starRating)) {
            return false;
        }
        // Provider filter
        if (selectedProviders.length > 0) {
            const hotelProviders = hotel.offers?.map(o => o.provider) || [];
            if (!selectedProviders.some(p => hotelProviders.includes(p))) {
                return false;
            }
        }
        return true;
    });

    // Calculate nights
    const calculateNights = () => {
        if (!checkIn || !checkOut) return 1;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    };

    // Filter sidebar component
    const FilterSidebar = ({ isMobile = false }) => (
        <div className={`${isMobile ? '' : 'lg:sticky lg:top-28'} space-y-6`}>
            {/* Map Widget */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="h-32 bg-slate-200 relative">
                    <img
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80"
                        alt="Map"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <button className="bg-white text-[#071428] px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2">
                            <Map className="w-4 h-4" />
                            عرض الخريطة
                        </button>
                    </div>
                </div>
            </div>

            {/* Destinations */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-[#071428] mb-4">المدن المتاحة</h3>
                <div className="flex flex-wrap gap-2">
                    {destinations.slice(0, 8).map((dest) => (
                        <button
                            key={dest.code}
                            onClick={() => {
                                setDestination(dest.nameAr);
                                setHasSearched(false);
                            }}
                            className={`px-3 py-1 text-sm rounded-full transition-all ${destination === dest.nameAr
                                ? 'bg-[#071428] text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {dest.nameAr}
                        </button>
                    ))}
                </div>
            </div>

            {/* Provider Filter */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-[#071428] mb-4">المزودين</h3>
                <div className="space-y-2">
                    {providers.map((provider) => (
                        <label
                            key={provider.id}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={selectedProviders.includes(provider.id)}
                                onChange={() =>
                                    setSelectedProviders((prev) =>
                                        prev.includes(provider.id)
                                            ? prev.filter((p) => p !== provider.id)
                                            : [...prev, provider.id]
                                    )
                                }
                                className="w-5 h-5 rounded border-slate-300 text-[#071428] focus:ring-[#C9A227]"
                            />
                            <div
                                className="w-6 h-6 rounded flex items-center justify-center"
                                style={{ backgroundColor: provider.color }}
                            >
                                <img
                                    src={provider.logo}
                                    alt={provider.name}
                                    className="w-4 h-4 object-contain"
                                />
                            </div>
                            <span className="text-sm text-slate-600 group-hover:text-[#071428] transition-colors">
                                {provider.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Star Rating */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-[#071428] mb-4">تصنيف النجوم</h3>
                <div className="flex flex-wrap gap-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <button
                            key={star}
                            onClick={() =>
                                setSelectedStars((prev) =>
                                    prev.includes(star)
                                        ? prev.filter((s) => s !== star)
                                        : [...prev, star]
                                )
                            }
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${selectedStars.includes(star)
                                ? 'bg-[#071428] text-white border-[#071428]'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-[#C9A227]'
                                }`}
                        >
                            <span className="text-sm font-medium">{star}</span>
                            <Star className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Popular Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-[#071428] mb-4">فلاتر شائعة</h3>
                <div className="space-y-3">
                    {popularFilters.map((filter) => (
                        <label
                            key={filter.id}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={selectedFilters.includes(filter.id)}
                                onChange={() =>
                                    setSelectedFilters((prev) =>
                                        prev.includes(filter.id)
                                            ? prev.filter((f) => f !== filter.id)
                                            : [...prev, filter.id]
                                    )
                                }
                                className="w-5 h-5 rounded border-slate-300 text-[#071428] focus:ring-[#C9A227]"
                            />
                            <filter.icon className="w-4 h-4 text-slate-600 font-medium group-hover:text-[#C9A227] transition-colors" />
                            <span className="text-sm text-slate-600 group-hover:text-[#071428] transition-colors">
                                {filter.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-[#fdfbf7] min-h-screen pt-24">
            {/* Search Bar */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <BarChart3 className="w-6 h-6 text-[#C9A227]" />
                        <h2 className="text-lg font-bold text-[#071428]">بحث الفنادق</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Destination */}
                        <div className="flex-1 min-w-[200px] relative">
                            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 font-medium" />
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                list="destinations-list"
                                className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C9A227]"
                                placeholder="المدينة (مثل: لندن، دبي)"
                            />
                            <datalist id="destinations-list">
                                {destinations.map((dest) => (
                                    <option key={dest.code} value={dest.nameAr}>
                                        {dest.nameEn}
                                    </option>
                                ))}
                            </datalist>
                        </div>

                        {/* Check-in */}
                        <div className="relative">
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 font-medium" />
                            <input
                                type="date"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="pr-10 pl-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C9A227]"
                            />
                        </div>

                        {/* Check-out */}
                        <div className="relative">
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 font-medium" />
                            <input
                                type="date"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="pr-10 pl-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C9A227]"
                            />
                        </div>

                        {/* Guests */}
                        <div className="relative">
                            <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 font-medium" />
                            <select
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                                className="pr-10 pl-8 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C9A227] appearance-none bg-white"
                            >
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <option key={n} value={n}>
                                        {n} ضيوف
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 font-medium pointer-events-none" />
                        </div>

                        {/* Rooms */}
                        <div className="relative">
                            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 font-medium" />
                            <select
                                value={rooms}
                                onChange={(e) => setRooms(Number(e.target.value))}
                                className="pr-10 pl-8 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C9A227] appearance-none bg-white"
                            >
                                {[1, 2, 3, 4].map((n) => (
                                    <option key={n} value={n}>
                                        {n} غرفة
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 font-medium pointer-events-none" />
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="btn-primary flex items-center gap-2"
                        >
                            {loading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                            <span className="hidden sm:inline">ابحث</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Results Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#071428] mb-2">
                        {destination}: {loading ? '...' : `${filteredHotels.length} فندق متاح`}
                    </h1>
                    <p className="text-slate-700 font-medium">
                        {checkIn} - {checkOut} • {calculateNights()} ليالي • {guests} ضيوف
                    </p>

                    {/* Meta Stats */}
                    {meta && (
                        <div className="flex flex-wrap gap-3 mt-3">
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                <BarChart3 className="w-3 h-3" />
                                {meta.hotelsWithPrices} فندق بأسعار
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                <Building2 className="w-3 h-3" />
                                {meta.hotelsWithMultipleOffers} فندق بعروض متعددة
                            </span>
                            {meta.priceRange?.lowest && (
                                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    الأسعار من {meta.priceRange.lowest?.toLocaleString()} $
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-700">{error}</p>
                    </motion.div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:block lg:w-72 flex-shrink-0">
                        <FilterSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                        {/* Sorting Bar */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-[#C9A227]" />
                                    <span className="text-sm text-slate-600">ترتيب حسب:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setSortBy(option.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === option.id
                                                ? 'bg-[#071428] text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <LoadingSpinner size="lg" />
                                <p className="mt-4 text-slate-700 font-medium">
                                    جاري البحث في Booking.com و Tripadvisor و Amadeus...
                                </p>
                            </div>
                        )}

                        {/* No Results */}
                        {!loading && hasSearched && filteredHotels.length === 0 && !error && (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🏨</div>
                                <h3 className="text-xl font-bold text-[#071428] mb-2">
                                    لا توجد فنادق متاحة
                                </h3>
                                <p className="text-slate-700 font-medium mb-6">
                                    جرب تغيير تواريخ البحث أو المدينة
                                </p>
                            </div>
                        )}

                        {/* Hotel Cards */}
                        {!loading && filteredHotels.length > 0 && (
                            <div className="space-y-4">
                                {filteredHotels.map((hotel, index) => (
                                    <motion.div
                                        key={hotel.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <HotelComparisonCard
                                            hotel={hotel}
                                            checkIn={checkIn}
                                            checkOut={checkOut}
                                            guests={guests}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="btn-primary flex items-center gap-2 shadow-xl"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    الفلاتر والترتيب
                </button>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                            onClick={() => setShowMobileFilters(false)}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[85vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-[#071428]">الفلاتر</h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
                                >
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>
                            <div className="p-4">
                                <FilterSidebar isMobile />
                            </div>
                            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4">
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="btn-primary w-full"
                                >
                                    عرض {filteredHotels.length} نتيجة
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default HotelPriceComparison;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, MapPin, Heart, Check, ChevronDown, ChevronUp,
    ExternalLink, Award, TrendingDown, Building2
} from 'lucide-react';

// Provider logos and colors
const PROVIDER_INFO = {
    booking: {
        logo: 'https://cf.bstatic.com/static/img/favicon/favicon-32x32.png',
        name: 'Booking.com',
        color: '#003580',
        bgColor: 'bg-[#003580]',
        textColor: 'text-white',
    },
    tripadvisor: {
        logo: 'https://static.tacdn.com/img2/branding/rebrand/TA_logo_primary.png',
        name: 'Tripadvisor',
        color: '#00AF87',
        bgColor: 'bg-[#00AF87]',
        textColor: 'text-white',
    },
    amadeus: {
        logo: 'https://amadeus.com/favicon.ico',
        name: 'Amadeus',
        color: '#005EB8',
        bgColor: 'bg-[#005EB8]',
        textColor: 'text-white',
    },
};

/**
 * Hotel Comparison Card
 * Shows a hotel with prices from multiple providers for comparison
 */
const HotelComparisonCard = ({ hotel, checkIn, checkOut, guests }) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [showAllOffers, setShowAllOffers] = useState(false);
    const [redirectInfo, setRedirectInfo] = useState(null); // { provider, providerName, hotelName, url }

    // Get rating info
    const getRatingColor = (rating) => {
        if (rating >= 9) return 'bg-green-600';
        if (rating >= 8) return 'bg-green-500';
        if (rating >= 7) return 'bg-yellow-500';
        return 'bg-orange-500';
    };

    const getRatingText = (rating) => {
        if (rating >= 9) return 'ممتاز';
        if (rating >= 8) return 'جيد جداً';
        if (rating >= 7) return 'جيد';
        return 'مقبول';
    };

    // Get offers with prices (sorted by price)
    const offersWithPrice = hotel.offers?.filter(o => o.hasPrice) || [];
    const offersWithoutPrice = hotel.offers?.filter(o => !o.hasPrice) || [];
    const allOffers = [...offersWithPrice, ...offersWithoutPrice];

    // Best deal (lowest price)
    const bestDeal = offersWithPrice[0];

    // Calculate savings vs highest price
    const highestPrice = offersWithPrice.length > 1
        ? Math.max(...offersWithPrice.map(o => o.pricePerNight || 0))
        : null;
    const savings = highestPrice && bestDeal
        ? Math.round(((highestPrice - bestDeal.pricePerNight) / highestPrice) * 100)
        : 0;

    // Calculate nights
    const calculateNights = () => {
        if (!checkIn || !checkOut) return 1;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    };
    const nights = calculateNights();

    // Handle booking click (navigate to local checkout)
    const handleBookNow = (offer) => {
        const params = new URLSearchParams({
            type: 'hotel',
            hotelId: hotel.id || hotel.hotelId || '00000000-0000-0000-0000-000000000000',
            roomId: '00000000-0000-0000-0000-000000000000',
            offerId: offer.offerId || '00000000-0000-0000-0000-000000000000',
            hotelName: hotel.hotelName,
            roomName: offer.roomType || 'غرفة قياسية',
            price: (offer.pricePerNight || 0).toString(),
            currency: offer.currency || 'SAR',
            checkIn: checkIn || '',
            checkOut: checkOut || '',
            guests: (guests || 1).toString(),
            image: hotel.mainPhotoUrl || ''
        });
        navigate(`/checkout?${params.toString()}`);
    };

    // Close redirect modal
    const closeRedirectModal = () => {
        setRedirectInfo(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group w-full"
        >
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-64 lg:w-72 h-48 md:h-auto md:min-h-[200px] flex-shrink-0">
                    <img
                        src={hotel.mainPhotoUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80'}
                        alt={hotel.hotelName}
                        className="w-full h-full object-cover"
                    />

                    {/* Favorite Button */}
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600 font-medium'}`} />
                    </button>

                    {/* Best Deal Badge */}
                    {savings > 10 && (
                        <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 z-10">
                            <TrendingDown className="w-3 h-3" />
                            وفّر {savings}%
                        </div>
                    )}

                    {/* Provider Count Badge */}
                    {allOffers.length > 1 && (
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs z-10">
                            {allOffers.length} مزودين
                        </div>
                    )}

                    {/* Star Rating Overlay */}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded flex items-center gap-1 z-10">
                        {[...Array(Math.min(hotel.starRating || 0, 5))].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#C9A227] text-[#C9A227]" />
                        ))}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 md:p-5 min-w-0 overflow-hidden">
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="mb-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-bold text-xl text-[#071428] mb-1 line-clamp-1">
                                        {hotel.hotelName}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                        <MapPin className="w-4 h-4 text-[#C9A227]" />
                                        <span>{hotel.city || 'موقع ممتاز'}</span>
                                    </div>
                                </div>

                                {/* Rating */}
                                {hotel.rating && (
                                    <div className="flex items-center gap-2">
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-slate-700">{getRatingText(hotel.rating)}</p>
                                            <p className="text-xs text-slate-700 font-medium">{hotel.reviewCount?.toLocaleString()} تقييم</p>
                                        </div>
                                        <div className={`${getRatingColor(hotel.rating)} text-white text-lg font-bold px-3 py-2 rounded-lg`}>
                                            {hotel.rating.toFixed(1)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Facilities */}
                            {hotel.facilities && hotel.facilities.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {hotel.facilities.slice(0, 4).map((facility, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                            <Check className="w-3 h-3 text-green-600" />
                                            {facility}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price Comparison Section */}
                        <div className="mt-auto">
                            {/* Best Deal Highlight */}
                            {bestDeal && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 md:p-4 mb-3">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: PROVIDER_INFO[bestDeal.provider]?.color || '#666' }}
                                            >
                                                <img
                                                    src={PROVIDER_INFO[bestDeal.provider]?.logo}
                                                    alt={bestDeal.providerDisplayName}
                                                    className="w-6 h-6 object-contain"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-semibold text-[#071428] text-sm md:text-base">{bestDeal.providerDisplayName}</span>
                                                    <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                                                        <Award className="w-3 h-3" />
                                                        أفضل سعر
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-700 font-medium truncate">{bestDeal.roomType || 'غرفة قياسية'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="text-left">
                                                <div className="text-xl md:text-2xl font-bold text-green-700">
                                                    {bestDeal.pricePerNight?.toLocaleString()}
                                                    <span className="text-sm font-normal mr-1">{bestDeal.currency === 'USD' ? '$' : bestDeal.currency || 'ر.س'}</span>
                                                </div>
                                                <p className="text-xs text-slate-700 font-medium">{nights > 1 ? `إجمالي ${nights} ليالي` : 'إجمالي الإقامة'}</p>
                                            </div>

                                            <button
                                                onClick={() => handleBookNow(bestDeal)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-5 py-2 md:py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm md:text-base whitespace-nowrap"
                                            >
                                                احجز الآن
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Other Offers */}
                            {allOffers.length > 1 && (
                                <div>
                                    <button
                                        onClick={() => setShowAllOffers(!showAllOffers)}
                                        className="w-full flex items-center justify-between text-sm text-slate-600 hover:text-[#071428] py-2 transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            عرض جميع الأسعار ({allOffers.length} عروض)
                                        </span>
                                        {showAllOffers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>

                                    <AnimatePresence>
                                        {showAllOffers && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-2 pt-2">
                                                    {allOffers.slice(1).map((offer, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-8 h-8 rounded flex items-center justify-center"
                                                                    style={{ backgroundColor: PROVIDER_INFO[offer.provider]?.color || '#666' }}
                                                                >
                                                                    <img
                                                                        src={PROVIDER_INFO[offer.provider]?.logo}
                                                                        alt={offer.providerDisplayName}
                                                                        className="w-5 h-5 object-contain"
                                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-sm text-[#071428]">{offer.providerDisplayName}</span>
                                                                    {offer.roomType && (
                                                                        <p className="text-xs text-slate-700 font-medium">{offer.roomType}</p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                {offer.hasPrice ? (
                                                                    <div className="text-left">
                                                                        <span className="font-bold text-[#071428]">
                                                                            {offer.pricePerNight?.toLocaleString()}
                                                                            <span className="text-xs font-normal mr-1">{offer.currency === 'USD' ? '$' : offer.currency || 'ر.س'}</span>
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-sm text-slate-600 font-medium">السعر غير متاح</span>
                                                                )}

                                                                <button
                                                                    onClick={() => handleBookNow(offer)}
                                                                    className="text-[#071428] hover:text-[#C9A227] border border-[#071428] hover:border-[#C9A227] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                                                                >
                                                                    احجز
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* No Price Available */}
                            {!bestDeal && (
                                <div className="text-center py-4 bg-slate-50 rounded-lg">
                                    <p className="text-slate-700 font-medium">الأسعار غير متاحة حالياً</p>
                                    <p className="text-xs text-slate-600 font-medium mt-1">جرب البحث في تواريخ أخرى</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Redirect Modal */}
            <AnimatePresence>
                {redirectInfo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
                        onClick={closeRedirectModal}
                    >
                        <div className="text-center px-6 max-w-lg">
                            {/* Logos */}
                            <div className="flex items-center justify-center gap-6 mb-8">
                                {/* Company Logo */}
                                <div className="w-16 h-16 rounded-xl bg-[#071428] flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">الملحم</span>
                                </div>

                                {/* Arrows */}
                                <div className="flex items-center gap-1 text-slate-300">
                                    <motion.span
                                        animate={{ x: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                    >
                                        ‹
                                    </motion.span>
                                    <motion.span
                                        animate={{ x: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                    >
                                        ‹
                                    </motion.span>
                                    <motion.span
                                        animate={{ x: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                    >
                                        ‹
                                    </motion.span>
                                </div>

                                {/* Provider Logo */}
                                <div
                                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: redirectInfo.providerColor || '#666' }}
                                >
                                    <img
                                        src={redirectInfo.providerLogo}
                                        alt={redirectInfo.providerName}
                                        className="w-10 h-10 object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Text */}
                            <p className="text-slate-600 text-lg mb-2">
                                عثرت على عرض رائع على <span className="font-bold text-[#071428]">{redirectInfo.providerName}</span>
                            </p>
                            <p className="text-slate-700 font-medium mb-6">
                                يتم توجيهك الآن إلى موقع <span className="font-semibold">{redirectInfo.providerName}</span>
                            </p>

                            {/* Hotel Name */}
                            <div className="border-t border-slate-200 pt-6">
                                <h3 className="text-xl font-bold text-[#071428]">
                                    {redirectInfo.hotelName}
                                </h3>
                            </div>

                            {/* Loading indicator */}
                            <div className="mt-8">
                                <motion.div
                                    className="w-48 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden"
                                >
                                    <motion.div
                                        className="h-full bg-[#C9A227]"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 2, ease: 'linear' }}
                                    />
                                </motion.div>
                            </div>

                            {/* Cancel button */}
                            <button
                                onClick={closeRedirectModal}
                                className="mt-6 text-sm text-slate-600 font-medium hover:text-slate-600 transition-colors"
                            >
                                إلغاء
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default HotelComparisonCard;

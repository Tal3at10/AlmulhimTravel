import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Shield, ArrowLeft } from 'lucide-react';

// Provider logos and info
const PROVIDER_INFO = {
    booking: {
        logo: 'https://cf.bstatic.com/static/img/favicon/favicon-32x32.png',
        name: 'Booking.com',
        color: '#003580',
        domain: 'booking.com',
    },
    'booking.com': {
        logo: 'https://cf.bstatic.com/static/img/favicon/favicon-32x32.png',
        name: 'Booking.com',
        color: '#003580',
        domain: 'booking.com',
    },
    tripadvisor: {
        logo: 'https://static.tacdn.com/img2/brand_refresh/Tripadvisor_logoset_solid_green.svg',
        name: 'Tripadvisor',
        color: '#00AF87',
        domain: 'tripadvisor.com',
    },
    'hotels.com': {
        logo: 'https://a.travel-assets.com/egds/marks/hotels.svg',
        name: 'Hotels.com',
        color: '#D32F2F',
        domain: 'hotels.com',
    },
    hotelscom: {
        logo: 'https://a.travel-assets.com/egds/marks/hotels.svg',
        name: 'Hotels.com',
        color: '#D32F2F',
        domain: 'hotels.com',
    },
    priceline: {
        logo: 'https://www.priceline.com/assets/images/favicons/favicon-32x32.png',
        name: 'Priceline',
        color: '#0068EF',
        domain: 'priceline.com',
    },
    amadeus: {
        logo: 'https://amadeus.com/favicon.ico',
        name: 'Amadeus',
        color: '#005EB8',
        domain: 'amadeus.com',
    },
    expedia: {
        logo: 'https://a.travel-assets.com/egds/marks/expedia.svg',
        name: 'Expedia',
        color: '#00355F',
        domain: 'expedia.com',
    },
};

/**
 * ExternalRedirect - A beautiful redirect page like Trivago
 * Shows user they're being redirected to external booking site
 */
const ExternalRedirect = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);
    const [redirecting, setRedirecting] = useState(false);

    // Get parameters from URL
    const provider = searchParams.get('provider') || 'booking';
    const hotelName = searchParams.get('name') || 'الفندق';
    const bookingUrl = searchParams.get('url') ? decodeURIComponent(searchParams.get('url')) : null;
    const price = searchParams.get('price');
    const currency = searchParams.get('currency') || 'USD';

    // Get provider info
    const providerInfo = PROVIDER_INFO[provider.toLowerCase()] || {
        logo: null,
        name: provider,
        color: '#666',
        domain: provider,
    };

    useEffect(() => {
        if (!bookingUrl) {
            navigate(-1);
            return;
        }

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setRedirecting(true);
                    // Open in new tab and go back
                    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
                    setTimeout(() => navigate(-1), 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [bookingUrl, navigate]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleRedirectNow = () => {
        if (bookingUrl) {
            window.open(bookingUrl, '_blank', 'noopener,noreferrer');
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full"
            >
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#071428] to-[#003366] px-6 py-8 text-center">
                        {/* Logos */}
                        <div className="flex items-center justify-center gap-6 mb-6">
                            {/* AlMulhim Logo */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg"
                            >
                                <span className="text-[#071428] font-bold text-lg">الملحم</span>
                            </motion.div>

                            {/* Animated Arrows */}
                            <div className="flex items-center gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ x: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.2,
                                            delay: i * 0.2,
                                        }}
                                        className="text-[#C9A227] text-2xl"
                                    >
                                        ‹
                                    </motion.div>
                                ))}
                            </div>

                            {/* Provider Logo */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ backgroundColor: providerInfo.color }}
                            >
                                {providerInfo.logo ? (
                                    <img
                                        src={providerInfo.logo}
                                        alt={providerInfo.name}
                                        className="w-10 h-10 object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `<span class="text-white font-bold text-sm">${providerInfo.name.charAt(0)}</span>`;
                                        }}
                                    />
                                ) : (
                                    <span className="text-white font-bold text-lg">
                                        {providerInfo.name.charAt(0)}
                                    </span>
                                )}
                            </motion.div>
                        </div>

                        {/* Title */}
                        <motion.h1
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-white text-xl font-bold mb-2"
                        >
                            عثرت على عرض رائع على{' '}
                            <span className="text-[#C9A227]">الملحم للسفر</span>
                        </motion.h1>

                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-300"
                        >
                            يتم توجيهك الآن إلى موقع{' '}
                            <span className="text-white font-semibold">{providerInfo.name}</span>
                        </motion.p>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-8">
                        {/* Hotel Name */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mb-6"
                        >
                            <h2 className="text-2xl font-bold text-[#071428] mb-2">
                                {hotelName}
                            </h2>
                            {price && (
                                <p className="text-lg text-green-600 font-semibold">
                                    {parseFloat(price).toLocaleString()} {currency === 'USD' ? '$' : currency}
                                    <span className="text-sm text-slate-700 font-medium font-normal mr-1">/ ليلة</span>
                                </p>
                            )}
                        </motion.div>

                        {/* Progress Bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mb-6"
                        >
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#C9A227] to-[#E8D48A]"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 3, ease: 'linear' }}
                                />
                            </div>
                            <p className="text-center text-sm text-slate-700 font-medium mt-2">
                                {redirecting ? (
                                    <span className="text-green-600">جاري الفتح...</span>
                                ) : (
                                    <>التوجيه خلال <span className="font-bold text-[#071428]">{countdown}</span> ثواني</>
                                )}
                            </p>
                        </motion.div>

                        {/* Security Note */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
                        >
                            <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <p className="text-sm text-green-700">
                                ستفتح صفحة الحجز في نافذة جديدة. أكمل حجزك مباشرة على موقع{' '}
                                <span className="font-semibold">{providerInfo.name}</span> الآمن.
                            </p>
                        </motion.div>

                        {/* Buttons */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-3"
                        >
                            <button
                                onClick={handleRedirectNow}
                                className="flex-1 bg-gradient-to-r from-[#071428] to-[#003366] text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                            >
                                <span>انتقل الآن</span>
                                <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleGoBack}
                                className="flex-1 bg-slate-100 text-slate-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>رجوع</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                        <p className="text-xs text-slate-600 font-medium text-center">
                            سيتم إتمام الحجز والدفع على موقع {providerInfo.name} مباشرة.
                            الملحم للسفر لا يتحمل مسؤولية أي معاملات تتم على المواقع الخارجية.
                        </p>
                    </div>
                </div>

                {/* Domain indicator */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-center mt-4"
                >
                    <p className="text-sm text-slate-700 font-medium">
                        <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            سيتم فتح: {providerInfo.domain}
                        </span>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ExternalRedirect;

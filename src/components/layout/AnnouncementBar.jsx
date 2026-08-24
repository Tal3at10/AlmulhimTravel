import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api.service';

const FALLBACK_OFFERS = [
  {
    text: "🔥 عروض الصيف الكبرى: احجز باقة تركيا 5 ليالي بـ 3,999 ر.س شامل الفندق الفاخر والجولات السياحية! 🏨🌟",
    link: "/destinations?search=تركيا"
  },
  {
    text: "🌟 اكتشف سحر القوقاز: باقة أذربيجان المذهلة 6 أيام بـ 2,499 ر.س فقط! 🏔️✨",
    link: "/destinations?search=أذربيجان"
  },
  {
    text: "❄️ شتاء روسيا الأسطوري: احجز باقتك الفاخرة لزيارة موسكو وسانت بطرسبرغ بأسعار استثنائية! 🏰🌨️",
    link: "/destinations?search=روسيا"
  }
];

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [offers, setOffers] = useState(FALLBACK_OFFERS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('announcement_dismissed');
    if (isDismissed === 'true') {
      setIsVisible(false);
      return;
    }

    const fetchFeaturedPackages = async () => {
      try {
        const response = await apiService.packages.getFeatured(10);
        if (Array.isArray(response) && response.length > 0) {
          const dynamicOffers = response.map(pkg => {
            // Remove flight terms safely from duration/description
            const cleanDuration = (pkg.duration || '').replace(/شامل الطيران/g, '').replace(/\+ طيران/g, '').trim();
            const cleanTitle = (pkg.titleAr || '').replace(/شامل الطيران/g, '').replace(/\+ طيران/g, '').trim();
            return {
              text: `🔥 عرض خاص: احجز باقة ${cleanTitle} - ${cleanDuration || 'رحلة فاخرة'} بـ ${pkg.price?.toLocaleString('ar-SA') || pkg.price} ر.س فقط! 🌟`,
              link: `/package/${pkg.packageId || pkg.id}`
            };
          });
          setOffers(dynamicOffers);
        }
      } catch (error) {
        console.warn('Could not fetch featured packages for announcement bar, using fallback premium offers.', error);
      } finally {
        setTimeout(() => setIsVisible(true), 500);
      }
    };

    fetchFeaturedPackages();
  }, []);

  // Handle auto-rotation
  useEffect(() => {
    if (!isVisible || offers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 5000); // Rotate every 5s
    return () => clearInterval(interval);
  }, [isVisible, offers.length]);

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem('announcement_dismissed', 'true');
  };

  const currentOffer = offers[currentIndex] || FALLBACK_OFFERS[0];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="relative bg-[#071428] bg-gradient-to-r from-[#051121] via-[#152e52] to-[#051121] text-white z-[60] border-b border-[#C9A227]/60 shadow-lg overflow-hidden"
        >
          <div className="container mx-auto px-3 py-1 flex items-center justify-between min-h-[36px] sm:min-h-[38px] text-[11px] sm:text-xs font-semibold select-none">
            {/* Subtle Royal Golden Glow Behind Text */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.12)_0%,transparent_70%)] pointer-events-none" />
            {/* Right spacer for centering alignment on desktop */}
            <div className="hidden sm:block w-8" />

            {/* Announcement Message Content */}
            <div className="flex-1 relative flex items-center justify-center min-h-[24px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex items-center justify-center gap-1.5 text-center px-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227] animate-pulse hidden xs:inline shrink-0" />
                  <Link 
                    to={currentOffer.link}
                    className="hover:underline flex flex-wrap items-center justify-center gap-1 transition-all duration-300 hover:text-amber-200 decoration-amber-400 text-[11px] sm:text-xs md:text-sm leading-relaxed py-0.5"
                  >
                    <span>{currentOffer.text}</span>
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#C9A227] to-[#DFBA44] hover:from-[#DFBA44] hover:to-[#C9A227] text-[#071428] rounded-full px-3 py-1 text-[10px] sm:text-xs font-black transition-all mr-1.5 shrink-0 whitespace-nowrap shadow-sm shadow-amber-500/10 hover:scale-105">
                      <span className="shrink-0 whitespace-nowrap">احجز الآن</span>
                      <ArrowLeft className="w-3 h-3 text-[#071428] stroke-[3] shrink-0" />
                    </span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dismiss Button - Left Side in RTL */}
            <button
              onClick={handleDismiss}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer flex-shrink-0"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBar;

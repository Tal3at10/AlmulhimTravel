import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api.service';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getOptimizedImageUrl } from '../../utils/image';
import useIsMobile from '../../hooks/useIsMobile';

const FALLBACK_DESTINATIONS = [
  { id: 'f1', nameAr: 'فرنسا', nameEn: 'France', imageUrl: '/moscow-hero.jpg', descriptionAr: 'أناقة لا متناهية، أجواء باريس الحالمة وجمال الريف الفرنسي الفاخر.' },
  { id: 'f2', nameAr: 'سويسرا', nameEn: 'Switzerland', imageUrl: '/malaysia-hero.jpg', descriptionAr: 'قمم جبال الألب المغطاة بالثلوج وبحيرات نقية وقرى خيالية.' },
  { id: 'f3', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', imageUrl: '/tourism.jpg', descriptionAr: 'عراقة الضيافة البريطانية والتسوق الراقي في قلب الضباب.' },
  { id: 'f4', nameAr: 'إيطاليا', nameEn: 'Italy', imageUrl: '/moscow-hero.jpg', descriptionAr: 'الفن المعماري الفاخر، روائع روما وقنوات فينيسيا الساحرة.' },
  { id: 'f5', nameAr: 'اليابان', nameEn: 'Japan', imageUrl: '/malaysia-hero.jpg', descriptionAr: 'تلاقٍ مذهل بين المستقبل التقني والتقاليد اليابانية العريقة.' },
  { id: 'f6', nameAr: 'إسبانيا', nameEn: 'Spain', imageUrl: '/tourism.jpg', descriptionAr: 'روح حيوية وتاريخ أندلسي عريق وشواطئ مشمسة راقية.' }
];

const DestinationsInteractive = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchDestinations = async () => {
      // 1. Attempt to load cached data instantly (0ms)
      try {
        const cached = localStorage.getItem('cache_destinations');
        if (cached) {
          setDestinations(JSON.parse(cached));
          setLoading(false);
        }
      } catch (e) {
        console.warn('Error reading destinations cache:', e);
      }

      try {
        const response = await apiService.destinations.getFeatured(8);
        if (Array.isArray(response) && response.length > 0) {
          const apiDests = response.filter(d => d && d.nameAr);
          const combined = [...apiDests];
          while (combined.length < 8) {
            combined.push(FALLBACK_DESTINATIONS[combined.length % FALLBACK_DESTINATIONS.length]);
          }
          const finalDests = combined.slice(0, 8);
          setDestinations(finalDests);
          localStorage.setItem('cache_destinations', JSON.stringify(finalDests));
        } else {
          // If response is empty or error, make sure we have fallback data
          const fallbacks = [...FALLBACK_DESTINATIONS, ...FALLBACK_DESTINATIONS].slice(0, 8);
          setDestinations(fallbacks);
        }
      } catch (error) {
        console.error('Error fetching destinations, using fallbacks:', error);
        if (destinations.length === 0) {
          const fallbacks = [...FALLBACK_DESTINATIONS, ...FALLBACK_DESTINATIONS].slice(0, 8);
          setDestinations(fallbacks);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading && destinations.length === 0) {
    return (
      <section className="py-16 bg-[#fdfbf7]">
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  // Define Bento grid coordinates classes
  const getGridClasses = (index) => {
    switch (index) {
      case 0: return 'lg:col-span-2 lg:row-span-2 h-[350px] lg:h-[460px]'; // Giant 2x2 Card
      case 1: return 'lg:col-span-1 lg:row-span-2 h-[350px] lg:h-[460px]'; // Tall 1x2 Card
      case 2: return 'lg:col-span-1 lg:row-span-1 h-[220px]'; // Square 1x1 Card
      case 3: return 'lg:col-span-1 lg:row-span-1 h-[220px]'; // Square 1x1 Card
      case 4: return 'lg:col-span-1 lg:row-span-1 h-[220px]'; // Square 1x1 Card
      case 5: return 'lg:col-span-2 lg:row-span-1 h-[220px]'; // Wide 2x1 Card
      case 6: return 'lg:col-span-1 lg:row-span-1 h-[220px]'; // Square 1x1 Card
      case 7: return 'lg:col-span-2 lg:row-span-1 h-[220px]'; // Wide 2x1 Card
      default: return 'lg:col-span-1 lg:row-span-1 h-[220px]';
    }
  };

  return (
    <section className="py-24 bg-[#fdfbf7] relative overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-16 px-4">
        <span className="text-[#C9A227] text-xs font-black tracking-widest uppercase block mb-3">وجهات سفر تفوق الخيال</span>
        <h2 className="text-3xl md:text-5xl font-black text-[#071428] font-serif">وجهاتنا السياحية المميزة</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-5" />
      </div>

      {/* Bento Grid Container */}
      <div className="max-w-[92%] xl:max-w-[85%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
          {destinations.map((dest, idx) => {
            const gridClass = getGridClasses(idx);
            return (
              <motion.div
                key={dest.id || idx}
                className={`relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl group transition-all duration-500 border border-slate-200/50 bg-slate-900 ${gridClass}`}
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={isMobile ? { duration: 0 } : { duration: 0.6, delay: idx * 0.1 }}
              >
                {/* Image */}
                <img
                  src={getOptimizedImageUrl(dest.imageUrl, idx === 0 || idx === 5 ? 1200 : 800, 75) || '/tourism.jpg'}
                  alt={dest.nameAr}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7] group-hover:brightness-[0.75]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/tourism.jpg';
                  }}
                  loading="lazy"
                />

                {/* Royal Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071428]/95 via-[#071428]/40 to-transparent opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-transparent to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end text-right z-10">
                  {/* Floating Micro-Badge */}
                  <div className="flex items-center gap-1.5 text-[#C9A227] mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black tracking-widest uppercase">{dest.nameEn}</span>
                  </div>

                  {/* Title */}
                  <h3 className={`font-black text-white group-hover:text-[#C9A227] transition-colors leading-tight mb-2 font-serif ${
                    idx === 0 ? 'text-3xl lg:text-4xl' : 'text-2xl'
                  }`}>
                    {dest.nameAr}
                  </h3>

                  {/* Description (Visible always on big cards, on hover for smaller) */}
                  <p className={`text-slate-200/90 text-xs font-semibold leading-relaxed mb-4 line-clamp-2 transition-all ${
                    idx === 0 || idx === 1 || idx === 5 ? 'opacity-100 max-h-12' : 'lg:opacity-0 lg:group-hover:opacity-100'
                  }`}>
                    {dest.descriptionAr || `اكتشف أفضل البرامج والخدمات السياحية المعدة خصيصاً لك في ${dest.nameAr}.`}
                  </p>

                  {/* Explore Button */}
                  <div className="flex justify-start">
                    <Link to={`/destinations?destName=${encodeURIComponent(dest.nameAr)}`}>
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-white group-hover:text-[#C9A227] transition-all">
                        <span>استكشف الباقات</span>
                        <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Premium Golden Top Highlight Line */}
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            );
          })}

          {/* CTA Card - The final 1x1 grid item */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl group transition-all duration-500 border-2 border-dashed border-[#C9A227]/40 bg-[#071428] h-[220px] lg:col-span-1 lg:row-span-1"
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={isMobile ? { duration: 0 } : { duration: 0.6, delay: 8 * 0.1 }}
          >
            {/* Ambient Background Gold Glow */}
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.15),transparent_60%)] pointer-events-none" />

            <div className="absolute inset-0 p-6 flex flex-col justify-between text-right z-10">
              <div className="bg-[#C9A227]/10 w-10 h-10 rounded-full flex items-center justify-center border border-[#C9A227]/20 self-start">
                <Sparkles className="w-5 h-5 text-[#C9A227] animate-pulse" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white mb-2 font-serif group-hover:text-[#C9A227] transition-all">
                  وجهتك القادمة بانتظارك
                </h3>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-4">
                  تصفح برامجنا المتكاملة في أكثر من 60 وجهة سياحية حول العالم مصممة للرفاهية التامة.
                </p>
              </div>

              <div className="flex justify-start">
                <Link to="/offers" className="inline-flex items-center gap-2 bg-[#C9A227] text-[#071428] px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-amber-500/10 group-hover:bg-[#DFBA44] transition-all">
                  <span>كل الوجهات</span>
                  <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DestinationsInteractive;

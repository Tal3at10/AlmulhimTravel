import { useState, useMemo, useEffect, useRef } from 'react';
import React from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, Plane, Banknote, Calendar, ChevronDown, X, MapPin, Hotel, SlidersHorizontal } from 'lucide-react';
import CommercialPackageCard from '../components/packages/CommercialPackageCard';
import OptimizedVideo from '../components/ui/OptimizedVideo';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Footer from '../components/layout/Footer';
import SEO from '../components/ui/SEO';
import apiService from '../services/api.service';
import { getOptimizedImageUrl, getOptimizedImageSrcSet } from '../utils/image';
import PromoBanner from '../components/ui/PromoBanner';
import useIsMobile from '../hooks/useIsMobile';
import { normalizeArabicText } from '../utils/arabic';

// Hero Package Card Component (Full Width)
const HeroPackageCard = ({ pkg }) => {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef(null);

  const isInView = useInView(cardRef, { amount: 0.5 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsActive(isInView);
    }
  }, [isInView, isMobile]);

  const handleMouseEnter = () => {
    if (!isMobile) setIsActive(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsActive(false);
  };

  return (
    <Link to={`/package/${pkg.packageId}`}>
      <motion.div
        ref={cardRef}
        className="relative h-[340px] md:h-[450px] rounded-3xl overflow-hidden group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.01 }}
      >
        {pkg.video ? (
          <OptimizedVideo
            src={pkg.video}
            poster={pkg.image}
            isActive={isActive}
            playOnMobile={true}
            forceAutoplay={true}
            className="absolute inset-0"
          />
        ) : (
          <img
            src={getOptimizedImageUrl(pkg.image, 1200, 75)}
            srcSet={pkg.image ? getOptimizedImageSrcSet(pkg.image, [600, 900, 1200], 75) : undefined}
            sizes="(max-width: 768px) 100vw, 80vw"
            alt={pkg.title}
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/90 via-black/50 to-transparent md:to-transparent" />

        <div className="absolute inset-0 flex items-end md:items-center justify-start p-5 md:p-12">
          <div className="text-start max-w-xl md:max-w-4xl w-full mb-2 md:mb-0">
            <span className="inline-block bg-[#C9A227] text-white text-sm px-4 py-1 rounded-full mb-4">
              الباقة المميزة
            </span>
            <h2 className="text-2xl leading-tight md:text-5xl font-serif font-bold text-white mb-3 md:mb-4">
              {pkg.title}
            </h2>
            <div className="flex items-center gap-3 md:gap-6 text-sm md:text-base text-white/80 mb-4 md:mb-6">
              <span className="flex items-center gap-1 md:gap-2">
                <Clock className="w-5 h-5" />
                {pkg.duration}
              </span>
              <span className="flex items-center gap-2">
                <Hotel className="w-5 h-5" />
                إقامة فندقية
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-end md:items-center gap-3 md:gap-4">
              <span className="text-2xl md:text-3xl font-bold text-[#C9A227]">
                {pkg.price} <span className="text-sm md:text-lg">ر.س</span>
              </span>
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-xl font-semibold group-hover:bg-[#C9A227] transition-colors duration-300">
                استكشف الباقة
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

// Constants
const categories = [
  { id: 'all', label: 'الكل' },
  { id: 'asia', label: 'آسيا' },
  { id: 'europe', label: 'أوروبا' },
  { id: 'islands', label: 'جزر' },
  { id: 'honeymoon', label: 'شهر عسل' },
  { id: 'cruise', label: 'كروز' },
];

const durationOptions = [
  { id: 'all', label: 'الكل', min: 0, max: 1000 },
  { id: 'short', label: '1-6 أيام', min: 0, max: 6 },
  { id: 'medium', label: '7-12 يوم', min: 7, max: 12 },
  { id: 'long', label: 'أكثر من 12 يوم', min: 13, max: 1000 },
];

const destinationNames = {
  'malaysia': 'ماليزيا',
  'turkey': 'تركيا',
  'dubai': 'دبي',
  'moscow': 'موسكو',
  'london': 'لندن',
  'georgia': 'جورجيا',
  'thailand': 'تايلاند',
  'vietnam': 'فيتنام',
  'maldives': 'المالديف',
  'mauritius': 'موريشيوس',
  'azerbaijan': 'أذربيجان',
  'indonesia': 'إندونيسيا',
  'sarajevo': 'سراييفو',
  'phuket': 'بوكيت',
  'bali': 'بالي',
};

const AllPackages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDestName, setActiveDestName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // API State
  const [packagesData, setPackagesData] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [MIN_PRICE, setMIN_PRICE] = useState(0);
  const [MAX_PRICE, setMAX_PRICE] = useState(20000);

  const priceDropdownRef = useRef(null);
  const durationDropdownRef = useRef(null);
  const destinationDropdownRef = useRef(null);

  const inferDestinationName = (pkg) => {
    if (pkg.destinationName && pkg.destinationName.trim().length > 0) {
      return pkg.destinationName.trim();
    }
    const text = `${pkg.titleAr || ''} ${pkg.subtitle || ''} ${pkg.titleEn || ''}`.toLowerCase();
    
    if (text.includes('تركيا') || text.includes('اسطنبول') || text.includes('إسطنبول') || text.includes('طرابزون') || text.includes('اوزنجول') || text.includes('turkey')) return 'تركيا';
    if (text.includes('ماليزيا') || text.includes('كوالالمبور') || text.includes('لنكاوي') || text.includes('بينانج') || text.includes('malaysia')) return 'ماليزيا';
    if (text.includes('إندونيسيا') || text.includes('اندونيسيا') || text.includes('بالي') || text.includes('بونشاك') || text.includes('indonesia') || text.includes('bali')) return 'إندونيسيا';
    if (text.includes('أذربيجان') || text.includes('اذربيجان') || text.includes('باكو') || text.includes('azerbaijan') || text.includes('baku')) return 'أذربيجان';
    if (text.includes('جورجيا') || text.includes('تبليسي') || text.includes('باتومي') || text.includes('georgia')) return 'جورجيا';
    if (text.includes('تايلاند') || text.includes('تايلند') || text.includes('بوكيت') || text.includes('بانكوك') || text.includes('thailand')) return 'تايلاند';
    if (text.includes('المالديف') || text.includes('مالديف') || text.includes('maldives')) return 'المالديف';
    if (text.includes('موسكو') || text.includes('روسيا') || text.includes('russia')) return 'موسكو';
    if (text.includes('لندن') || text.includes('بريطانيا') || text.includes('london')) return 'لندن';
    if (text.includes('البوسنة') || text.includes('سراييفو') || text.includes('bosnia')) return 'البوسنة';
    if (text.includes('سويسرا') || text.includes('switzerland')) return 'سويسرا';
    if (text.includes('إيطاليا') || text.includes('ايطاليا') || text.includes('italy')) return 'إيطاليا';
    if (text.includes('فيتنام') || text.includes('vietnam')) return 'فيتنام';
    if (text.includes('موريشيوس') || text.includes('mauritius')) return 'موريشيوس';
    
    return '';
  };

  // Fetch packages and destinations from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pkgsRes, destsRes] = await Promise.all([
          apiService.packages.getAll({ pageSize: 200 }),
          apiService.destinations.getAll().catch(() => [])
        ]);

        if (pkgsRes && Array.isArray(pkgsRes.items)) {
          const enrichedPackages = pkgsRes.items.map(p => ({
            ...p,
            destinationName: inferDestinationName(p)
          }));
          setPackagesData(enrichedPackages);

          // Calculate price range from actual data
          const prices = enrichedPackages.map(p => p.price);
          if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setMIN_PRICE(minPrice);
            setMAX_PRICE(maxPrice);
            setPriceRange([minPrice, maxPrice]);
          }
        }

        if (Array.isArray(destsRes)) {
          setAllDestinations(destsRes);
        }
      } catch (error) {
        console.error('Error fetching packages or destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll to top of window when filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory, activeDestName, selectedDuration, priceRange]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(e.target)) {
        setShowPriceDropdown(false);
      }
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(e.target)) {
        setShowDurationDropdown(false);
      }
      if (destinationDropdownRef.current && !destinationDropdownRef.current.contains(e.target)) {
        setShowDestinationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const destNameParam = searchParams.get('destName');
    const destinationParam = searchParams.get('destination'); // legacy support
    const searchParam = searchParams.get('search');

    if (searchParam) {
      setSearchQuery(searchParam);
      setActiveDestName(null);
      setActiveCategory('all');
    } else if (destNameParam) {
      setSearchQuery('');
      setActiveDestName(destNameParam);
      setActiveCategory('all');
    } else if (destinationParam && destinationNames[destinationParam]) {
      setSearchQuery('');
      setActiveDestName(destinationNames[destinationParam]);
      setActiveCategory('all');
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveDestName(null);
    if (searchParams.has('destination') || searchParams.has('destName')) {
      setSearchParams({});
    }
  };

  const clearDestinationFilter = () => {
    setActiveDestName(null);
    setShowDestinationDropdown(false);
    setSearchParams({});
  };

  const setDestinationFilter = (destName) => {
    if (!destName) return;
    setActiveDestName(destName);
    setActiveCategory('all');
    setShowDestinationDropdown(false);
    setSearchParams({ destName });
  };

  const resetFilters = () => {
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSelectedDuration('all');
  };

  const hasActiveFilters = priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE || selectedDuration !== 'all';

  const destinationOptions = useMemo(() => {
    const names = new Set();
    for (const d of allDestinations) {
      if (d.nameAr?.trim()) names.add(d.nameAr.trim());
    }
    for (const p of packagesData) {
      const name = p.destinationName?.trim();
      if (name) names.add(name);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b, 'ar'));
  }, [packagesData, allDestinations]);

  const filteredPackages = useMemo(() => {
    let result = packagesData;

    // Text search filter (from Home search bar)
    if (searchQuery) {
      const q = normalizeArabicText(searchQuery);
      result = result.filter(p =>
        normalizeArabicText(p.titleAr).includes(q) ||
        normalizeArabicText(p.destinationName).includes(q) ||
        normalizeArabicText(p.subtitle).includes(q) ||
        p.titleEn?.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }

    if (activeDestName) {
      const targetDest = normalizeArabicText(activeDestName);
      if (targetDest) {
        result = result.filter(p => {
          const pkgDest = normalizeArabicText(p.destinationName);
          const pkgTitle = normalizeArabicText(p.titleAr);
          const pkgSubtitle = normalizeArabicText(p.subtitle);

          const destMatch = pkgDest ? (pkgDest === targetDest || pkgDest.includes(targetDest) || targetDest.includes(pkgDest)) : false;
          const titleMatch = pkgTitle ? pkgTitle.includes(targetDest) : false;
          const subtitleMatch = pkgSubtitle ? pkgSubtitle.includes(targetDest) : false;

          return Boolean(destMatch || titleMatch || subtitleMatch);
        });
      }
    } else if (activeCategory !== 'all') {
      if (activeCategory === 'asia') {
        const asiaCountries = ['ماليزيا', 'تايلاند', 'تايلند', 'فيتنام', 'بوكيت', 'فوكيت', 'بالي', 'إندونيسيا', 'اندونيسيا', 'الصين', 'الهند', 'سنغافورة', 'اليابان'];
        result = result.filter(p => {
          const pkgDest = normalizeArabicText(p.destinationName);
          const pkgTitle = normalizeArabicText(p.titleAr);
          const pkgSubtitle = normalizeArabicText(p.subtitle);
          return asiaCountries.some(c => {
            const nc = normalizeArabicText(c);
            return (pkgDest && pkgDest.includes(nc)) || (pkgTitle && pkgTitle.includes(nc)) || (pkgSubtitle && pkgSubtitle.includes(nc));
          });
        });
      } else if (activeCategory === 'europe') {
        const europeCountries = ['سراييفو', 'جورجيا', 'موسكو', 'لندن', 'تركيا', 'اسطنبول', 'إسطنبول', 'اذربيجان', 'أذربيجان', 'البوسنة', 'البوسنه', 'سويسرا', 'فرنسا', 'إيطاليا', 'ايطاليا', 'النمسا', 'المانيا', 'ألمانيا', 'اسبانيا', 'إسبانيا'];
        result = result.filter(p => {
          const pkgDest = normalizeArabicText(p.destinationName);
          const pkgTitle = normalizeArabicText(p.titleAr);
          const pkgSubtitle = normalizeArabicText(p.subtitle);
          return europeCountries.some(c => {
            const nc = normalizeArabicText(c);
            return (pkgDest && pkgDest.includes(nc)) || (pkgTitle && pkgTitle.includes(nc)) || (pkgSubtitle && pkgSubtitle.includes(nc));
          });
        });
      } else if (activeCategory === 'islands') {
        const islandCountries = ['المالديف', 'موريشيوس', 'بوكيت', 'فوكيت', 'بالي', 'جزيرة', 'جزر'];
        result = result.filter(p => {
          const pkgDest = normalizeArabicText(p.destinationName);
          const pkgTitle = normalizeArabicText(p.titleAr);
          const pkgSubtitle = normalizeArabicText(p.subtitle);
          return (
            p.vibe === 'islands' ||
            islandCountries.some(c => {
              const nc = normalizeArabicText(c);
              return (pkgDest && pkgDest.includes(nc)) || (pkgTitle && pkgTitle.includes(nc)) || (pkgSubtitle && pkgSubtitle.includes(nc));
            })
          );
        });
      } else if (activeCategory === 'honeymoon') {
        result = result.filter(p => {
          const pkgTitle = normalizeArabicText(p.titleAr);
          const pkgSubtitle = normalizeArabicText(p.subtitle);
          return (
            p.vibe === 'honeymoon' ||
            pkgTitle.includes('شهر عسل') ||
            pkgSubtitle.includes('شهر عسل') ||
            pkgTitle.includes('عرسان') ||
            pkgSubtitle.includes('عرسان') ||
            p.features?.some(f => normalizeArabicText(f).includes('شهر عسل'))
          );
        });
      } else if (activeCategory === 'cruise') {
        result = result.filter(p => {
          const pkgTitle = normalizeArabicText(p.titleAr);
          const pkgSubtitle = normalizeArabicText(p.subtitle);
          return (
            p.vibe === 'cruise' ||
            pkgTitle.includes('كروز') ||
            pkgSubtitle.includes('كروز') ||
            pkgTitle.includes('بحرية') ||
            p.features?.some(f => normalizeArabicText(f).includes('كروز'))
          );
        });
      }
    }

    result = result.filter(p => {
      const price = p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (selectedDuration !== 'all') {
      const durationOption = durationOptions.find(d => d.id === selectedDuration);
      if (durationOption) {
        result = result.filter(p => {
          // Extract days from duration string like "7 أيام / 6 ليالي" or use DurationDays if available
          const days = p.durationDays || parseInt(p.duration?.split(' ')[0]) || 0;
          return days >= durationOption.min && days <= durationOption.max;
        });
      }
    }

    return result;
  }, [packagesData, activeCategory, activeDestName, searchQuery, priceRange, selectedDuration, MIN_PRICE, MAX_PRICE]);

  const renderFilters = () => (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Destination Filter */}
      <div className="bg-white p-5 rounded-2xl border border-[#C9A227]/10 shadow-md">
        <h4 className="font-serif font-black text-slate-800 mb-3 text-sm flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#C9A227]" />
          وجهتك السياحية
        </h4>
        <div className="relative mb-3">
          <select
            value={activeDestName || ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val) setDestinationFilter(val);
              else clearDestinationFilter();
            }}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-750 outline-none focus:border-[#C9A227] transition-all"
          >
            <option value="">جميع الوجهات</option>
            {destinationOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        {/* Quick destination tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {destinationOptions.slice(0, 5).map((name) => (
            <button
              key={name}
              onClick={() => activeDestName === name ? clearDestinationFilter() : setDestinationFilter(name)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                activeDestName === name
                  ? 'bg-[#071428] border-[#C9A227] text-[#C9A227]'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="bg-white p-5 rounded-2xl border border-[#C9A227]/10 shadow-md">
        <h4 className="font-serif font-black text-slate-800 mb-3 text-sm flex items-center gap-2">
          <Banknote className="w-5 h-5 text-[#C9A227]" />
          الميزانية المقدرة (ر.س)
        </h4>
        <div className="flex items-center justify-between mb-4 text-xs font-bold">
          <span className="bg-[#071428]/5 px-2.5 py-1.5 rounded-lg text-[#071428]">{priceRange[0].toLocaleString()} ر.س</span>
          <span className="text-slate-400 font-medium">إلى</span>
          <span className="bg-[#071428]/5 px-2.5 py-1.5 rounded-lg text-[#071428]">{priceRange[1].toLocaleString()} ر.س</span>
        </div>
        
        <div className="relative h-2 bg-slate-100 rounded-full mb-6 mt-4">
          <div
            className="absolute h-full bg-gradient-to-r from-[#C9A227] to-[#DFBA44] rounded-full"
            style={{
              left: `${((priceRange[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
              right: `${100 - ((priceRange[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={105}
            value={priceRange[0]}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val < priceRange[1]) setPriceRange([val, priceRange[1]]);
            }}
            className="absolute w-full h-full opacity-0 cursor-pointer pointer-events-auto"
            style={{ zIndex: 30 }}
          />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={105}
            value={priceRange[1]}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val > priceRange[0]) setPriceRange([priceRange[0], val]);
            }}
            className="absolute w-full h-full opacity-0 cursor-pointer pointer-events-auto"
            style={{ zIndex: 30 }}
          />
          <div
            className="absolute w-5 h-5 bg-[#071428] rounded-full border-2 border-white shadow-md -translate-y-1/2 top-1/2 -ml-2.5"
            style={{ left: `${((priceRange[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`, pointerEvents: 'none', zIndex: 40 }}
          />
          <div
            className="absolute w-5 h-5 bg-[#071428] rounded-full border-2 border-white shadow-md -translate-y-1/2 top-1/2 -ml-2.5"
            style={{ left: `${((priceRange[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`, pointerEvents: 'none', zIndex: 40 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
          <span>{MIN_PRICE.toLocaleString()} ر.س</span>
          <span>{MAX_PRICE.toLocaleString()} ر.س</span>
        </div>
      </div>

      {/* Duration Filter */}
      <div className="bg-white p-5 rounded-2xl border border-[#C9A227]/10 shadow-md">
        <h4 className="font-serif font-black text-slate-800 mb-3 text-sm flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#C9A227]" />
          مدة الرحلة
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {durationOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedDuration(option.id)}
              className={`px-2 py-2.5 rounded-xl border text-[11px] font-bold text-center transition-all ${
                selectedDuration === option.id
                  ? 'bg-[#071428] border-[#C9A227] text-[#C9A227] shadow-sm'
                  : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50 text-slate-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="bg-white p-5 rounded-2xl border border-[#C9A227]/10 shadow-md">
        <h4 className="font-serif font-black text-slate-800 mb-3 text-sm flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#C9A227]" />
          تصنيف الرحلة
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeCategory === cat.id && !activeDestName
                  ? 'bg-[#071428]/5 border-[#C9A227]/30 text-[#071428]'
                  : 'bg-white border-slate-200/60 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.label}</span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                activeCategory === cat.id && !activeDestName
                  ? 'border-[#C9A227] bg-[#C9A227]'
                  : 'border-slate-300 bg-white'
              }`}>
                {activeCategory === cat.id && !activeDestName && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Clear all button */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full bg-red-50 hover:bg-red-100 text-red-500 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          مسح جميع الفلاتر
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen">
      <SEO
        title={activeDestName ? `باقات السفر إلى ${activeDestName}` : "عروض باقات السفر"}
        description={`اكتشف أفضل ${activeDestName ? `عروض السفر والرحلات إلى ${activeDestName}` : 'الباقات السياحية حول العالم'} بأفضل الأسعار وأرقى الخدمات مع الملحم للسياحة.`}
        keywords={activeDestName ? `باقات ${activeDestName}, حجز ${activeDestName}, سياحة في ${activeDestName}` : "عروض سفر, باقات سياحية, رحلات, حجز طيران وفنادق"}
      />
      {/* Hero Section with Slow Ken Burns Animation */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <motion.img
          src="/tourism.jpg"
          alt="عروض الباقات السياحية"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          animate={isMobile ? undefined : { scale: [1, 1.06] }}
          transition={isMobile ? undefined : { duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[#071428]/75 backdrop-blur-[1.5px]" />

        <div className="relative z-10 text-center px-4 pt-24 md:pt-32">
          <motion.h1
            className="text-5xl md:text-7xl font-serif text-white mb-4 font-black tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#C9A227]">رحلات</span> تفوق الخيال
          </motion.h1>
          <motion.p
            className="text-xl text-white/80 font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {loading ? 'جاري التحميل...' : `اكتشف أكثر من ${packagesData.length} وجهة حول العالم`}
          </motion.p>
        </div>
      </section>

      {loading ? (
        <div className="container mx-auto px-4 py-8 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-[400px] shadow-sm overflow-hidden animate-pulse">
                <div className="h-[220px] bg-slate-200"></div>
                <div className="p-4 space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-8 bg-slate-200 rounded w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Active Filter Badges on Top */}
          {(activeDestName || searchQuery) && (
            <div className="container mx-auto px-4 pt-8">
              <div className="flex flex-wrap items-center gap-3">
                {activeDestName && (
                  <div className="flex items-center gap-2 bg-[#071428] text-white px-4 py-1.5 rounded-full border border-[#C9A227]/25 text-xs font-bold">
                    <span className="text-[#C9A227]">الوجهة:</span>
                    <span>{activeDestName}</span>
                    <button onClick={clearDestinationFilter} className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"><X className="w-2.5 h-2.5" /></button>
                  </div>
                )}
                {searchQuery && (
                  <div className="flex items-center gap-2 bg-[#071428] text-white px-4 py-1.5 rounded-full border border-[#C9A227]/25 text-xs font-bold">
                    <span className="text-[#C9A227]">بحث:</span>
                    <span>{searchQuery}</span>
                    <button onClick={() => { setSearchQuery(''); setSearchParams({}); }} className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"><X className="w-2.5 h-2.5" /></button>
                  </div>
                )}
              </div>
            </div>
          )}

          <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Right Column: Sticky Sidebar filters (Desktop only) */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-[#C9A227]/15 shadow-lg">
                    <h3 className="text-lg font-serif font-black text-[#071428] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-[#C9A227]" />
                      تصفية النتائج
                    </h3>
                    {renderFilters()}
                  </div>
                </div>
              </div>

              {/* Left Column: Packages grid and headers */}
              <div className="lg:col-span-3 space-y-8">
                {/* Header with Title and count */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-right">
                    <h2 className="text-xl font-serif text-slate-800 font-black">
                      {activeDestName
                        ? `باقات ${activeDestName}`
                        : activeCategory === 'all'
                          ? 'جميع الباقات السياحية'
                          : categories.find(c => c.id === activeCategory)?.label}
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-1">تصفح وقارن بين أفضل العروض الحصرية</p>
                  </div>
                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className="bg-[#C9A227]/10 text-[#071428] px-4 py-1.5 rounded-xl text-xs font-black">
                      {filteredPackages.length} باقة متاحة
                    </span>
                    {/* Mobile filter button */}
                    <button
                      onClick={() => setIsDrawerOpen(true)}
                      className="lg:hidden flex items-center gap-1.5 bg-[#071428] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-[#C9A227]" />
                      تصفية
                    </button>
                  </div>
                </div>

                {/* Mobile Categories horizontal scroll */}
                <div className="lg:hidden flex items-center gap-2 overflow-x-auto flex-nowrap pb-2 scrollbar-none -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${activeCategory === cat.id && !activeDestName
                        ? 'bg-[#071428] text-[#C9A227] shadow-md border border-[#C9A227]/30'
                        : 'bg-white text-slate-700 hover:bg-[#071428]/5 shadow-sm border border-slate-200/60'
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Featured Package (Hero Card) - Hidden on mobile */}
                {filteredPackages.length > 0 && !activeDestName && activeCategory === 'all' && !isMobile && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HeroPackageCard pkg={{
                      ...filteredPackages[0],
                      title: filteredPackages[0].titleAr,
                      price: filteredPackages[0].price,
                      duration: filteredPackages[0].duration,
                      image: filteredPackages[0].imageUrl,
                      packageId: filteredPackages[0].packageId,
                      video: filteredPackages[0].videoUrl,
                    }} />
                  </motion.div>
                )}

                {/* Packages Grid */}
                {filteredPackages.length === 0 ? (
                  <motion.div
                    className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-serif text-slate-800 mb-2 font-black">لا توجد نتائج مطابقة</h3>
                    <p className="text-slate-500 font-semibold mb-6">جرب تغيير خيارات التصفية أو مسح الفلاتر للبدء من جديد</p>
                    <button
                      onClick={() => {
                        setActiveCategory('all');
                        setActiveDestName(null);
                        resetFilters();
                        setSearchParams({});
                      }}
                      className="bg-[#C9A227] text-[#071428] px-6 py-3 rounded-xl font-black text-xs shadow-md hover:shadow-lg transition-all"
                    >
                      عرض جميع الباقات
                    </button>
                  </motion.div>
                ) : (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* If we have a featured package and we are on the main page (and not mobile), we skip the first package. Otherwise we render all packages */}
                    {(activeDestName || activeCategory !== 'all' || isMobile ? filteredPackages : filteredPackages.slice(1)).map((pkg, idx) => (
                      <React.Fragment key={pkg.packageId || pkg.id || idx}>
                        {/* Insert PromoBanner inside grid */}
                        {idx === 3 && (
                          <div className="col-span-full my-4">
                            <PromoBanner
                              theme="gold"
                              titleAr="تابع أقوى عروض الحجز الفوري 🌟"
                              subtitleAr="تواصل معنا الآن مباشرة عبر الواتساب للاستفسار عن أقوى عروض الحجز الفوري والخصومات الحصرية المتاحة حالياً!"
                              ctaTextAr="تواصل لمعرفة العروض"
                              badgeTextAr="عروض مميزة"
                              whatsappMsg="مرحباً سفريات الملحم، أود الاستفسار عن عروض الحجز الفوري المتاحة حالياً والخصومات المخصصة لي!"
                            />
                          </div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                        >
                          <CommercialPackageCard
                            title={pkg.titleAr}
                            price={pkg.price}
                            duration={pkg.duration}
                            image={pkg.imageUrl}
                            packageId={pkg.packageId}
                            features={pkg.features || []}
                            rating={pkg.rating || 4.5}
                            isOffer={pkg.isOffer}
                            location={pkg.subtitle || pkg.destination?.nameAr}
                          />
                        </motion.div>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Floating Filter Button for Mobile/Tablet */}
          <div className="lg:hidden fixed bottom-6 left-6 z-[150]">
            <motion.button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-[#071428] text-white flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#C9A227]/30 shadow-2xl font-black text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C9A227]" />
              تصفية النتائج
            </motion.button>
          </div>

          {/* Mobile/Tablet Filter Drawer */}
          <AnimatePresence>
            {isDrawerOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsDrawerOpen(false)}
                  className="fixed inset-0 bg-black z-[200]"
                />
                {/* Drawer */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-full w-[85vw] max-w-[380px] bg-[#fdfbf7] z-[201] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
                  dir="rtl"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <h3 className="text-lg font-serif font-black text-[#071428] flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-[#C9A227]" />
                        تصفية العروض
                      </h3>
                      <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-slate-500" />
                      </button>
                    </div>
                    
                    {renderFilters()}
                  </div>
                  
                  {/* Drawer Footer Actions */}
                  <div className="pt-4 border-t border-slate-200 mt-6 flex gap-3 bg-[#fdfbf7] sticky bottom-0">
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex-1 bg-[#071428] text-[#C9A227] py-3.5 rounded-xl font-black text-xs text-center shadow-md border border-[#C9A227]/25"
                    >
                      تطبيق الفلاتر ({filteredPackages.length})
                    </button>
                    <button
                      onClick={() => {
                        resetFilters();
                        setIsDrawerOpen(false);
                      }}
                      className="px-4 py-3.5 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors text-xs font-bold"
                    >
                      إعادة تعيين
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}

      <Footer />
    </div>
  );
};

export default AllPackages;

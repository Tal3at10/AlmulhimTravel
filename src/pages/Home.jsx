import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Calendar, Users, Building2, Plane, PlaneTakeoff, PlaneLanding, Globe, Award, Sparkles } from 'lucide-react';
const CommercialPackageCard = React.lazy(() => import('../components/packages/CommercialPackageCard'));
const StatsSection = React.lazy(() => import('../components/stats/StatsSection'));
const WhyChooseUs = React.lazy(() => import('../components/features/WhyChooseUs'));
const PartnersSection = React.lazy(() => import('../components/home/PartnersSection'));
const TestimonialsSection = React.lazy(() => import('../components/testimonials/TestimonialsSection'));
const CTABanner = React.lazy(() => import('../components/home/CTABanner'));
import Footer from '../components/layout/Footer';
import DestinationsInteractive from '../components/home/DestinationsInteractive';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEO from '../components/ui/SEO';
const PromoBanner = React.lazy(() => import('../components/ui/PromoBanner'));
import CustomDatePicker from '../components/ui/CustomDatePicker';
import apiService from '../services/api.service';
import { useDebounce } from '../hooks/useDebounce';
import { getOptimizedImageUrl, getOptimizedImageSrcSet } from '../utils/image';

const FALLBACK_HERO_SLIDES = [
  {
    imageUrl: '/moscow-hero.webp',
    titleAr: 'اكتشف العالم بمعايير رفاهية لا تُضاهى — تجربة سفر استثنائية مصممة خصيصاً لك',
    videoUrl: 'https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236352/13550049_3840_2160_60fps_optimized_cqtcqw.mp4'
  },
  {
    imageUrl: '/malaysia-hero.webp',
    titleAr: 'بوابتك نحو الفخامة والتميز — رحلات صُممت بعناية لتتجاوز سقف توقعاتك',
    videoUrl: 'https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236321/13446157_3840_2160_60fps_optimized_qqar8p.mp4'
  },
  {
    imageUrl: '/tourism.jpg',
    titleAr: 'اصنع ذكريات لا تُنسى — وجهات سياحية مختارة بعناية لعشاق الرقي والجمال',
    videoUrl: 'https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236303/13874845_3840_2160_30fps_optimized_turylc.mp4'
  }
];

const HOTEL_DESTINATIONS = [
  { code: "RUH", nameAr: "الرياض", nameEn: "Riyadh", country: "السعودية" },
  { code: "JED", nameAr: "جدة", nameEn: "Jeddah", country: "السعودية" },
  { code: "DXB", nameAr: "دبي", nameEn: "Dubai", country: "الإمارات" },
  { code: "IST", nameAr: "إسطنبول", nameEn: "Istanbul", country: "تركيا" },
  { code: "LON", nameAr: "لندن", nameEn: "London", country: "المملكة المتحدة" },
  { code: "PAR", nameAr: "باريس", nameEn: "Paris", country: "فرنسا" },
  { code: "KUL", nameAr: "كوالالمبور", nameEn: "Kuala Lumpur", country: "ماليزيا" },
  { code: "BKK", nameAr: "بانكوك", nameEn: "Bangkok", country: "تايلند" },
  { code: "CAI", nameAr: "القاهرة", nameEn: "Cairo", country: "مصر" },
  { code: "SIN", nameAr: "سنغافورة", nameEn: "Singapore", country: "سنغافورة" },
  { code: "NYC", nameAr: "نيويورك", nameEn: "New York", country: "الولايات المتحدة" },
];

const FLIGHT_AIRPORTS = [
  { code: "RUH", nameAr: "مطار الملك خالد الدولي", nameEn: "King Khalid International", cityAr: "الرياض", cityEn: "Riyadh", country: "السعودية" },
  { code: "JED", nameAr: "مطار الملك عبدالعزيز الدولي", nameEn: "King Abdulaziz International", cityAr: "جدة", cityEn: "Jeddah", country: "السعودية" },
  { code: "DMM", nameAr: "مطار الملك فهد الدولي", nameEn: "King Fahd International", cityAr: "الدمام", cityEn: "Dammam", country: "السعودية" },
  { code: "DXB", nameAr: "مطار دبي الدولي", nameEn: "Dubai International", cityAr: "دبي", cityEn: "Dubai", country: "الإمارات" },
  { code: "AUH", nameAr: "مطار أبوظبي الدولي", nameEn: "Abu Dhabi International", cityAr: "أبوظبي", cityEn: "Abu Dhabi", country: "الإمارات" },
  { code: "IST", nameAr: "مطار إسطنبول", nameEn: "Istanbul Airport", cityAr: "إسطنبول", cityEn: "Istanbul", country: "تركيا" },
  { code: "SAW", nameAr: "مطار صبيحة كوكجن", nameEn: "Sabiha Gokcen", cityAr: "إسطنبول", cityEn: "Istanbul", country: "تركيا" },
  { code: "LHR", nameAr: "مطار هيثرو", nameEn: "Heathrow", cityAr: "لندن", cityEn: "London", country: "المملكة المتحدة" },
  { code: "CDG", nameAr: "مطار شارل ديغول", nameEn: "Charles de Gaulle", cityAr: "باريس", cityEn: "Paris", country: "فرنسا" },
  { code: "FCO", nameAr: "مطار فيوميتشينو", nameEn: "Fiumicino", cityAr: "روما", cityEn: "Rome", country: "إيطاليا" },
  { code: "SVO", nameAr: "مطار شيريميتيفو", nameEn: "Sheremetyevo", cityAr: "موسكو", cityEn: "Moscow", country: "روسيا" },
  { code: "KUL", nameAr: "مطار كوالالمبور الدولي", nameEn: "Kuala Lumpur International", cityAr: "كوالالمبور", cityEn: "Kuala Lumpur", country: "ماليزيا" },
  { code: "SIN", nameAr: "مطار شانغي", nameEn: "Changi", cityAr: "سنغافورة", cityEn: "Singapore", country: "سنغافورة" },
  { code: "BKK", nameAr: "مطار سوفارنابومي", nameEn: "Suvarnabhumi", cityAr: "بانكوك", cityEn: "Bangkok", country: "تايلند" },
  { code: "SGN", nameAr: "مطار تان سون نهات", nameEn: "Tan Son Nhat", cityAr: "هو تشي منه", cityEn: "Ho Chi Minh", country: "فيتنام" },
  { code: "TBS", nameAr: "مطار تبليسي الدولي", nameEn: "Tbilisi International", cityAr: "تبليسي", cityEn: "Tbilisi", country: "جورجيا" },
  { code: "MLE", nameAr: "مطار فيلانا الدولي", nameEn: "Velana International", cityAr: "ماليه", cityEn: "Male", country: "المالديف" },
  { code: "CAI", nameAr: "مطار القاهرة الدولي", nameEn: "Cairo International", cityAr: "القاهرة", cityEn: "Cairo", country: "مصر" },
];

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('packages');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setVideoLoaded(false);
    setVideoError(false);
  }, [currentSlide]);

  const getHeroVideoUrl = (url) => {
    if (!url) return '';
    const isMobile = heroWidth <= 800;
    if (isMobile && url.includes('res.cloudinary.com')) {
      return url.replace('w_1920', 'w_600');
    }
    return url;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 35, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
      },
    },
  };

  // API Data State
  const [heroSlides, setHeroSlides] = useState(FALLBACK_HERO_SLIDES);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroWidth, setHeroWidth] = useState(typeof window !== 'undefined' ? (window.innerWidth > 768 ? 1920 : 800) : 1200);

  // Update hero width on resize for adaptive loading
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setHeroWidth(window.innerWidth > 768 ? 1920 : 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hotel search state
  const [hotelDestination, setHotelDestination] = useState('');
  const [packageSearchQuery, setPackageSearchQuery] = useState('');
  const [hotelCityCode, setHotelCityCode] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelChildren, setHotelChildren] = useState(0);
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelPopoverOpen, setHotelPopoverOpen] = useState(false);

  // Autocomplete suggestions state
  const [hotelDestFocused, setHotelDestFocused] = useState(false);
  const [flightFromFocused, setFlightFromFocused] = useState(false);
  const [flightToFocused, setFlightToFocused] = useState(false);
  const [pkgOriginFocused, setPkgOriginFocused] = useState(false);
  const [pkgDestFocused, setPkgDestFocused] = useState(false);

  const hotelDestRef = useRef(null);
  const flightFromRef = useRef(null);
  const flightToRef = useRef(null);
  const pkgOriginRef = useRef(null);
  const pkgDestRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (hotelDestRef.current && !hotelDestRef.current.contains(e.target)) {
        setHotelDestFocused(false);
      }
      if (flightFromRef.current && !flightFromRef.current.contains(e.target)) {
        setFlightFromFocused(false);
      }
      if (flightToRef.current && !flightToRef.current.contains(e.target)) {
        setFlightToFocused(false);
      }
      if (pkgOriginRef.current && !pkgOriginRef.current.contains(e.target)) {
        setPkgOriginFocused(false);
      }
      if (pkgDestRef.current && !pkgDestRef.current.contains(e.target)) {
        setPkgDestFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Flight search state
  const [flightFrom, setFlightFrom] = useState('');
  const [flightTo, setFlightTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [flightAdults, setFlightAdults] = useState(1);
  const [flightChildren, setFlightChildren] = useState(0);
  const [flightInfants, setFlightInfants] = useState(0);
  const [flightClass, setFlightClass] = useState('economy');
  const [flightPopoverOpen, setFlightPopoverOpen] = useState(false);
  const [flightType, setFlightType] = useState('roundtrip'); // 'roundtrip' or 'oneway'

  // Visa Search state
  const [visaCountry, setVisaCountry] = useState('');

  const [packageType, setPackageType] = useState('static'); // 'static' or 'dynamic'
  const [dynamicPkgSearch, setDynamicPkgSearch] = useState({
    origin: 'RUH',
    destination: 'DXB',
    departureDate: '',
    returnDate: '',
    adults: 2,
    children: 0,
    rooms: 1
  });
  const [packagePopoverOpen, setPackagePopoverOpen] = useState(false);

  // Autocomplete dynamic suggestions state
  const [hotelSuggestions, setHotelSuggestions] = useState(HOTEL_DESTINATIONS);
  const [flightFromSuggestions, setFlightFromSuggestions] = useState(FLIGHT_AIRPORTS);
  const [flightToSuggestions, setFlightToSuggestions] = useState(FLIGHT_AIRPORTS);
  const [pkgOriginSuggestions, setPkgOriginSuggestions] = useState(FLIGHT_AIRPORTS);
  const [pkgDestSuggestions, setPkgDestSuggestions] = useState(FLIGHT_AIRPORTS);

  const [loadingHotels, setLoadingHotels] = useState(false);
  const [loadingFlightFrom, setLoadingFlightFrom] = useState(false);
  const [loadingFlightTo, setLoadingFlightTo] = useState(false);
  const [loadingPkgOrigin, setLoadingPkgOrigin] = useState(false);
  const [loadingPkgDest, setLoadingPkgDest] = useState(false);

  const debouncedHotelQuery = useDebounce(hotelDestination, 300);
  const debouncedFlightFromQuery = useDebounce(flightFrom, 300);
  const debouncedFlightToQuery = useDebounce(flightTo, 300);
  const debouncedPkgOriginQuery = useDebounce(dynamicPkgSearch.origin, 300);
  const debouncedPkgDestQuery = useDebounce(dynamicPkgSearch.destination, 300);

  // Hotel suggestions effect
  useEffect(() => {
    let active = true;
    const fetchHotels = async () => {
      if (!debouncedHotelQuery || debouncedHotelQuery.trim().length < 2) {
        setHotelSuggestions(HOTEL_DESTINATIONS);
        return;
      }
      setLoadingHotels(true);
      try {
        const response = await apiService.locations.searchHotels(debouncedHotelQuery);
        if (active) {
          if (response?.success) {
            setHotelSuggestions(response.data);
          } else if (response?.data?.success) {
            setHotelSuggestions(response.data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching hotels suggestions:', err);
      } finally {
        if (active) setLoadingHotels(false);
      }
    };
    fetchHotels();
    return () => { active = false; };
  }, [debouncedHotelQuery]);

  // Flight From suggestions effect
  useEffect(() => {
    let active = true;
    const fetchFlights = async () => {
      if (!debouncedFlightFromQuery || debouncedFlightFromQuery.trim().length < 2) {
        setFlightFromSuggestions(FLIGHT_AIRPORTS);
        return;
      }
      const matched = FLIGHT_AIRPORTS.find(a => a.code === debouncedFlightFromQuery);
      if (matched) return;

      setLoadingFlightFrom(true);
      try {
        const response = await apiService.locations.searchFlights(debouncedFlightFromQuery);
        if (active) {
          if (response?.success) {
            setFlightFromSuggestions(response.data);
          } else if (response?.data?.success) {
            setFlightFromSuggestions(response.data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching flight from suggestions:', err);
      } finally {
        if (active) setLoadingFlightFrom(false);
      }
    };
    fetchFlights();
    return () => { active = false; };
  }, [debouncedFlightFromQuery]);

  // Flight To suggestions effect
  useEffect(() => {
    let active = true;
    const fetchFlights = async () => {
      if (!debouncedFlightToQuery || debouncedFlightToQuery.trim().length < 2) {
        setFlightToSuggestions(FLIGHT_AIRPORTS);
        return;
      }
      const matched = FLIGHT_AIRPORTS.find(a => a.code === debouncedFlightToQuery);
      if (matched) return;

      setLoadingFlightTo(true);
      try {
        const response = await apiService.locations.searchFlights(debouncedFlightToQuery);
        if (active) {
          if (response?.success) {
            setFlightToSuggestions(response.data);
          } else if (response?.data?.success) {
            setFlightToSuggestions(response.data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching flight to suggestions:', err);
      } finally {
        if (active) setLoadingFlightTo(false);
      }
    };
    fetchFlights();
    return () => { active = false; };
  }, [debouncedFlightToQuery]);

  // Package Origin suggestions effect
  useEffect(() => {
    let active = true;
    const fetchFlights = async () => {
      if (!debouncedPkgOriginQuery || debouncedPkgOriginQuery.trim().length < 2) {
        setPkgOriginSuggestions(FLIGHT_AIRPORTS);
        return;
      }
      const matched = FLIGHT_AIRPORTS.find(a => a.code === debouncedPkgOriginQuery);
      if (matched) return;

      setLoadingPkgOrigin(true);
      try {
        const response = await apiService.locations.searchFlights(debouncedPkgOriginQuery);
        if (active) {
          if (response?.success) {
            setPkgOriginSuggestions(response.data);
          } else if (response?.data?.success) {
            setPkgOriginSuggestions(response.data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching package origin suggestions:', err);
      } finally {
        if (active) setLoadingPkgOrigin(false);
      }
    };
    fetchFlights();
    return () => { active = false; };
  }, [debouncedPkgOriginQuery]);

  // Package Destination suggestions effect
  useEffect(() => {
    let active = true;
    const fetchFlights = async () => {
      if (!debouncedPkgDestQuery || debouncedPkgDestQuery.trim().length < 2) {
        setPkgDestSuggestions(FLIGHT_AIRPORTS);
        return;
      }
      const matched = FLIGHT_AIRPORTS.find(a => a.code === debouncedPkgDestQuery);
      if (matched) return;

      setLoadingPkgDest(true);
      try {
        const response = await apiService.locations.searchFlights(debouncedPkgDestQuery);
        if (active) {
          if (response?.success) {
            setPkgDestSuggestions(response.data);
          } else if (response?.data?.success) {
            setPkgDestSuggestions(response.data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching package destination suggestions:', err);
      } finally {
        if (active) setLoadingPkgDest(false);
      }
    };
    fetchFlights();
    return () => { active = false; };
  }, [debouncedPkgDestQuery]);

  // Fetch hero slides and featured packages on mount with Stale-While-Revalidate Caching Layer
  useEffect(() => {
    // 1. Attempt to load cached data instantly (0ms)
    try {
      const cachedSlides = localStorage.getItem('cache_hero_slides');
      const cachedPackages = localStorage.getItem('cache_featured_packages');
      
      if (cachedSlides) {
        setHeroSlides(JSON.parse(cachedSlides));
        setCurrentSlide(0);
      }
      if (cachedPackages) {
        setPackages(JSON.parse(cachedPackages));
        setLoading(false);
      }
    } catch (e) {
      console.warn('Unable to load cache:', e);
    }

    const fetchData = async () => {
      // Only show spinner if there is no cache loaded
      const hasCache = localStorage.getItem('cache_featured_packages') !== null;
      if (!hasCache) {
        setLoading(true);
      }

      const [slidesResult, packagesResult] = await Promise.allSettled([
        apiService.cms.getHeroSlides(),
        apiService.packages.getFeatured(8),
      ]);

      // Handle hero slides
      if (slidesResult.status === 'fulfilled') {
        const slidesResponse = slidesResult.value;
        if (Array.isArray(slidesResponse) && slidesResponse.length > 0) {
          const mappedSlides = slidesResponse.map((slide, idx) => {
            const fallback = FALLBACK_HERO_SLIDES[idx % FALLBACK_HERO_SLIDES.length];
            return {
              imageUrl: slide.imageUrl || slide.ImageUrl || fallback.imageUrl,
              titleAr: slide.titleAr || slide.TitleAr || fallback.titleAr,
              videoUrl: slide.videoUrl || slide.VideoUrl || fallback.videoUrl
            };
          });
          setHeroSlides(mappedSlides);
          try {
            localStorage.setItem('cache_hero_slides', JSON.stringify(mappedSlides));
          } catch (e) {
            console.error('Cache write failed:', e);
          }
        }
      } else {
        console.error('Error fetching hero slides, using optimized local fallbacks:', slidesResult.reason);
      }

      // Handle featured packages
      if (packagesResult.status === 'fulfilled') {
        const packagesResponse = packagesResult.value;
        if (Array.isArray(packagesResponse)) {
          setPackages(packagesResponse);
          try {
            localStorage.setItem('cache_featured_packages', JSON.stringify(packagesResponse));
          } catch (e) {
            console.error('Cache write failed:', e);
          }
        }
      } else {
        console.error('Error fetching featured packages:', packagesResult.reason);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        return nextSlide >= heroSlides.length ? 0 : nextSlide;
      });
    }, 6000); // 6s timer for luxury experience
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Handle click outside of popovers to close them
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.popover-container')) {
        setHotelPopoverOpen(false);
        setFlightPopoverOpen(false);
        setPackagePopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getHotelNights = () => {
    if (!checkIn || !checkOut) return 0;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    if (isNaN(d1) || isNaN(d2)) return 0;
    const diffTime = d2 - d1;
    return Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  };

  const getPackageNights = () => {
    if (!dynamicPkgSearch.departureDate || !dynamicPkgSearch.returnDate) return 0;
    const d1 = new Date(dynamicPkgSearch.departureDate);
    const d2 = new Date(dynamicPkgSearch.returnDate);
    if (isNaN(d1) || isNaN(d2)) return 0;
    const diffTime = d2 - d1;
    return Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  };

  const formatNights = (n) => {
    if (n <= 0) return '';
    if (n === 1) return 'ليلة واحدة';
    if (n === 2) return 'ليلتين';
    if (n >= 3 && n <= 10) return `${n} ليالٍ`;
    return `${n} ليلة`;
  };

  const handleSwapFlights = () => {
    const temp = flightFrom;
    setFlightFrom(flightTo);
    setFlightTo(temp);
  };

  const handleSwapPackages = () => {
    setDynamicPkgSearch(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  const handleHotelSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (hotelDestination) params.set('destination', hotelDestination);
    if (hotelCityCode) params.set('cityCode', hotelCityCode);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('guests', (hotelAdults + hotelChildren).toString());
    params.set('rooms', hotelRooms.toString());
    params.set('adults', hotelAdults.toString());
    navigate(`/hotels?${params.toString()}`);
  };

  const handleFlightSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (flightFrom) params.set('from', flightFrom);
    if (flightTo) params.set('to', flightTo);
    if (departureDate) params.set('departure', departureDate);
    if (returnDate) params.set('return', returnDate);
    params.set('passengers', (flightAdults + flightChildren + flightInfants).toString());
    params.set('adults', flightAdults.toString());
    params.set('children', flightChildren.toString());
    params.set('infants', flightInfants.toString());
    if (flightClass) params.set('class', flightClass);
    navigate(`/flights?${params.toString()}`);
  };

  const handlePackageSearch = () => {
    if (packageSearchQuery.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(packageSearchQuery.trim())}`);
    } else {
      navigate('/destinations');
    }
  };

  const handleDynamicPackageSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams({
      origin: dynamicPkgSearch.origin,
      destination: dynamicPkgSearch.destination,
      departureDate: dynamicPkgSearch.departureDate,
      returnDate: dynamicPkgSearch.returnDate,
      adults: dynamicPkgSearch.adults.toString(),
      children: dynamicPkgSearch.children.toString(),
      rooms: dynamicPkgSearch.rooms.toString()
    });
    navigate(`/flight-hotel-packages?${params.toString()}`);
  };

  return (
    <div>
      <SEO
        title="الرئيسية"
        description="الملحم للسفر والسياحة - ضيافتك الفاخرة منذ 1993. اكتشف العالم بمعايير رفاهية لا تُضاهى مع أفضل عروض وباقات السفر والتأشيرات المعتمدة."
        keywords="سياحة, سفر, حجوزات, فنادق, طيران, عروض سفر, باقات سياحية, الملحم للسياحة, تاشيرة شنجن"
      />
      {/* Elevated Hero Section (75vh, Premium Slider & Tabbed Search) */}
      <section className="min-h-[75vh] md:min-h-[80vh] relative flex flex-col bg-[#071428] pb-16">
        {/* Background Ken Burns Slider */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <motion.img
                src={getOptimizedImageUrl(heroSlides[currentSlide]?.imageUrl, heroWidth, 70)}
                srcSet={getOptimizedImageSrcSet(heroSlides[currentSlide]?.imageUrl, [800, 1200, 1920], 70)}
                sizes="100vw"
                alt={heroSlides[currentSlide]?.titleAr || "Hero Background"}
                fetchPriority="high"
                loading="eager"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6.5, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover brightness-[0.75]"
              />
              
              {/* Optional Background Video - Desktop Only */}
              {heroSlides[currentSlide]?.videoUrl && !videoError && heroWidth > 800 && (
                <video
                  key={heroSlides[currentSlide].videoUrl}
                  src={getHeroVideoUrl(heroSlides[currentSlide].videoUrl)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onPlay={() => setVideoLoaded(true)}
                  onCanPlay={() => setVideoLoaded(true)}
                  onError={() => setVideoError(true)}
                  className={`absolute inset-0 w-full h-full object-cover brightness-[0.6] z-10 transition-opacity duration-700 ${
                    videoLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
              
              {/* Luxury Navy & Gold Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#071428]/85 via-black/35 to-[#071428] z-20" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center relative z-10 pt-32 md:pt-48 pb-12">
          <motion.div
            className="text-center px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-3 tracking-tight drop-shadow-[0_4px_12px_rgba(7,20,40,0.4)]"
            >
              <span className="text-white">الملحم</span> <span className="text-[#C9A227]">للـسـفـر والسياحة</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-slate-300 font-extrabold uppercase tracking-widest mb-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C9A227] animate-pulse" />
              <span>ضيافتك الفاخرة منذ 1993</span>
              <Sparkles className="w-4 h-4 text-[#C9A227] animate-pulse" />
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="w-20 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mb-5"
            ></motion.div>
            <motion.p 
              variants={itemVariants}
              className="text-base md:text-xl text-white/95 leading-relaxed font-bold max-w-2xl md:max-w-none md:whitespace-nowrap mx-auto drop-shadow-md bg-black/20 md:bg-transparent p-2 md:p-0 rounded-lg backdrop-blur-[2px] md:backdrop-blur-none"
            >
              {heroSlides[currentSlide]?.titleAr || 'اكتشف العالم بمعايير رفاهية لا تُضاهى'}
            </motion.p>
          </motion.div>
        </div>

        {/* Segmented Search Bar - Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-30 pb-12"
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-[#071428]/75 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 shadow-2xl">
              {/* Category Segmented Tabs */}
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-4 border-b border-white/10 pb-3">
                <button
                  onClick={() => setActiveTab('packages')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs md:text-sm font-black transition-all ${activeTab === 'packages' ? 'bg-[#C9A227] text-[#071428]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                >
                  <Globe className="w-4 h-4" />
                  <span>باقات السفر</span>
                </button>

                <button
                  onClick={() => setActiveTab('visas')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs md:text-sm font-black transition-all ${activeTab === 'visas' ? 'bg-[#C9A227] text-[#071428]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                >
                  <Award className="w-4 h-4" />
                  <span>التأشيرات</span>
                </button>

                {/* <button
                  onClick={() => setActiveTab('flights')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs md:text-sm font-black transition-all ${activeTab === 'flights' ? 'bg-[#C9A227] text-[#071428]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                >
                  <PlaneTakeoff className="w-4 h-4" />
                  <span>الطيران</span>
                </button>

                <button
                  onClick={() => setActiveTab('hotels')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs md:text-sm font-black transition-all ${activeTab === 'hotels' ? 'bg-[#C9A227] text-[#071428]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>الفنادق</span>
                </button> */}
              </div>

              {/* Dynamic Form Content */}
              <div className="transition-all duration-300">
                {/* 1. Packages Tab */}
                {activeTab === 'packages' && (
                  <div className="space-y-4">
                    {/* Toggle button - hidden temporarily */}
                    <div className="hidden justify-start gap-4 text-xs font-bold mb-1 border-b border-white/5 pb-2">
                      <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="packageType"
                          checked={packageType === 'static'}
                          onChange={() => setPackageType('static')}
                          className="text-[#C9A227] focus:ring-[#C9A227]/30"
                        />
                        <span>عروض الملحم الجاهزة</span>
                      </label>
                      <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="packageType"
                          checked={packageType === 'dynamic'}
                          onChange={() => setPackageType('dynamic')}
                          className="text-[#C9A227] focus:ring-[#C9A227]/30"
                        />
                        <span className="text-[#C9A227] font-black flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          تصميم باقة طيران + فندق (وفر 10%)
                        </span>
                      </label>
                    </div>

                    {packageType === 'static' ? (
                      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                        <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 border border-white/5">
                          <MapPin className="w-4.5 h-4.5 text-[#C9A227]" />
                          <input
                            type="text"
                            value={packageSearchQuery}
                            onChange={(e) => setPackageSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePackageSearch()}
                            placeholder="إلى أين تريد السفر؟ (تركيا، روسيا، أذربيجان...)"
                            className="bg-transparent text-white placeholder-slate-400 text-sm font-bold focus:outline-none w-full text-right"
                          />
                        </div>
                        <button
                          onClick={handlePackageSearch}
                          className="bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] font-black px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shrink-0 shadow-lg shadow-[#C9A227]/10 whitespace-nowrap"
                        >
                          <Search className="w-4.5 h-4.5" />
                          <span>ابحث عن باقة</span>
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleDynamicPackageSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2.5 items-stretch">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative col-span-1 sm:col-span-2">
                          <div ref={pkgOriginRef} className="relative flex items-center gap-2 bg-white/10 rounded-xl pr-3 pl-3 sm:pl-8 py-2 border border-white/5">
                            <MapPin className="w-4 h-4 text-[#C9A227]" />
                            <input
                              type="text"
                              required
                              value={dynamicPkgSearch.origin}
                              onChange={(e) => setDynamicPkgSearch({...dynamicPkgSearch, origin: e.target.value.toUpperCase()})}
                              onFocus={() => setPkgOriginFocused(true)}
                              placeholder="مطار المغادرة (مثال: RUH)"
                              className="bg-transparent text-white placeholder-slate-400 text-xs font-bold focus:outline-none w-full text-right"
                            />
                            {/* Autocomplete Dropdown */}
                            {pkgOriginFocused && (
                              <div className="absolute top-full right-0 left-0 bg-white border border-slate-200 shadow-2xl rounded-xl mt-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto">
                                <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-100 text-right">مطارات المغادرة المقترحة</div>
                                {loadingPkgOrigin ? (
                                  <div className="p-4 text-center text-xs text-slate-500 font-bold">جاري البحث...</div>
                                ) : pkgOriginSuggestions.length === 0 ? (
                                  <div className="p-4 text-center text-xs text-slate-500">لا توجد نتائج مطابقة</div>
                                ) : (
                                  pkgOriginSuggestions.map((item) => (
                                    <button
                                      key={item.code}
                                      type="button"
                                      onClick={() => {
                                        setDynamicPkgSearch({...dynamicPkgSearch, origin: item.code});
                                        setPkgOriginFocused(false);
                                      }}
                                      className="w-full text-right px-4 py-2 hover:bg-slate-100 flex items-center justify-between border-b border-slate-50 last:border-b-0 cursor-pointer text-slate-700"
                                    >
                                      <div className="flex items-center gap-2 text-right">
                                        <PlaneTakeoff className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                                        <div className="text-right">
                                          <p className="text-xs font-bold text-[#071428]">{item.cityAr || item.nameAr} - {item.nameAr}</p>
                                          <p className="text-[10px] text-slate-500">{item.country} • {item.cityEn || item.nameEn}</p>
                                        </div>
                                      </div>
                                      <span className="text-xs bg-[#071428] text-white px-2 py-0.5 rounded font-black">{item.code}</span>
                                    </button>
                                  ))
                                )}
                              </div>
                            )}
                          </div>

                          {/* Swap Button */}
                          <button
                            type="button"
                            onClick={handleSwapPackages}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] flex items-center justify-center border border-[#071428] transition-transform active:scale-95 shadow-md"
                            title="تبديل الوجهات"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-90 sm:rotate-0">
                              <path d="m7 16-4-4 4-4"/>
                              <path d="M3 12h18"/>
                              <path d="m17 8 4 4-4 4"/>
                            </svg>
                          </button>

                          <div ref={pkgDestRef} className="flex items-center gap-2 bg-white/10 rounded-xl pr-3 sm:pr-8 pl-3 py-2 border border-white/5">
                            <MapPin className="w-4 h-4 text-[#C9A227]" />
                            <input
                              type="text"
                              required
                              value={dynamicPkgSearch.destination}
                              onChange={(e) => setDynamicPkgSearch({...dynamicPkgSearch, destination: e.target.value.toUpperCase()})}
                              onFocus={() => setPkgDestFocused(true)}
                              placeholder="مطار الوصول (مثال: DXB)"
                              className="bg-transparent text-white placeholder-slate-400 text-xs font-bold focus:outline-none w-full text-right"
                            />
                            {/* Autocomplete Dropdown */}
                            {pkgDestFocused && (
                              <div className="absolute top-full right-0 left-0 bg-white border border-slate-200 shadow-2xl rounded-xl mt-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto">
                                <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-100 text-right">مطارات الوصول المقترحة</div>
                                {loadingPkgDest ? (
                                  <div className="p-4 text-center text-xs text-slate-500 font-bold">جاري البحث...</div>
                                ) : pkgDestSuggestions.length === 0 ? (
                                  <div className="p-4 text-center text-xs text-slate-500">لا توجد نتائج مطابقة</div>
                                ) : (
                                  pkgDestSuggestions.map((item) => (
                                    <button
                                      key={item.code}
                                      type="button"
                                      onClick={() => {
                                        setDynamicPkgSearch({...dynamicPkgSearch, destination: item.code});
                                        setPkgDestFocused(false);
                                      }}
                                      className="w-full text-right px-4 py-2 hover:bg-slate-100 flex items-center justify-between border-b border-slate-50 last:border-b-0 cursor-pointer text-slate-700"
                                    >
                                      <div className="flex items-center gap-2 text-right">
                                        <PlaneLanding className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                                        <div className="text-right">
                                          <p className="text-xs font-bold text-[#071428]">{item.cityAr || item.nameAr} - {item.nameAr}</p>
                                          <p className="text-[10px] text-slate-500">{item.country} • {item.cityEn || item.nameEn}</p>
                                        </div>
                                      </div>
                                      <span className="text-xs bg-[#071428] text-white px-2 py-0.5 rounded font-black">{item.code}</span>
                                    </button>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2.5 relative col-span-1 sm:col-span-2">
                          <CustomDatePicker
                            value={dynamicPkgSearch.departureDate}
                            onChange={(val) => {
                              setDynamicPkgSearch(prev => {
                                const update = { ...prev, departureDate: val };
                                if (prev.returnDate && new Date(val) >= new Date(prev.returnDate)) {
                                  const nextDay = new Date(val);
                                  nextDay.setDate(nextDay.getDate() + 1);
                                  update.returnDate = nextDay.toISOString().split('T')[0];
                                }
                                return update;
                              });
                            }}
                            placeholder="تاريخ الذهاب"
                            minDate={new Date().toISOString().split('T')[0]}
                            theme="dark"
                            className="flex-1"
                          />

                          {/* Nights count badge */}
                          {getPackageNights() > 0 && (
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center bg-[#C9A227] text-[#071428] px-2.5 py-0.5 rounded-full text-[9px] font-black shadow-lg border border-[#071428] pointer-events-none">
                              {formatNights(getPackageNights())}
                            </div>
                          )}

                          <CustomDatePicker
                            value={dynamicPkgSearch.returnDate}
                            onChange={(val) => {
                              setDynamicPkgSearch(prev => ({...prev, returnDate: val}));
                            }}
                            placeholder="تاريخ العودة"
                            minDate={dynamicPkgSearch.departureDate || new Date().toISOString().split('T')[0]}
                            theme="dark"
                            className="flex-1"
                          />
                        </div>

                        {/* Guest / Rooms Popover */}
                        <div className="relative popover-container col-span-1">
                          <button
                            type="button"
                            onClick={() => {
                              setPackagePopoverOpen(!packagePopoverOpen);
                              setHotelPopoverOpen(false);
                              setFlightPopoverOpen(false);
                            }}
                            className="w-full h-full flex items-center justify-between gap-1 bg-white/10 rounded-xl px-3 py-2.5 border border-white/5 text-white text-xs font-bold text-right whitespace-nowrap"
                            dir="rtl"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Users className="w-4 h-4 text-[#C9A227] shrink-0" />
                              <span className="whitespace-nowrap truncate">{dynamicPkgSearch.adults + dynamicPkgSearch.children} مسافرين • {dynamicPkgSearch.rooms} غرف</span>
                            </div>
                            <span className="text-slate-400 text-[10px] shrink-0">▼</span>
                          </button>

                          {packagePopoverOpen && (
                            <div className="absolute right-0 top-full mt-2 z-50 w-[90vw] max-w-xs md:w-72 bg-[#071428] border border-white/10 rounded-2xl p-4 shadow-2xl space-y-4">
                              <h4 className="text-xs font-black text-[#C9A227] pb-2 border-b border-white/5">تحديد المسافرين والغرف</h4>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-bold text-white">بالغين</p>
                                  <p className="text-[9px] text-slate-400">بعمر 12 سنة فما فوق</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setDynamicPkgSearch(prev => ({...prev, adults: Math.max(1, prev.adults - 1)}))}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="text-white text-sm font-bold min-w-[16px] text-center">{dynamicPkgSearch.adults}</span>
                                  <button
                                    type="button"
                                    onClick={() => setDynamicPkgSearch(prev => ({...prev, adults: Math.min(10, prev.adults + 1)}))}
                                    className="w-7 h-7 rounded-lg bg-[#C9A227] text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-bold text-white">أطفال</p>
                                  <p className="text-[9px] text-slate-400">بعمر 2 إلى 12 سنة</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setDynamicPkgSearch(prev => ({...prev, children: Math.max(0, prev.children - 1)}))}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="text-white text-sm font-bold min-w-[16px] text-center">{dynamicPkgSearch.children}</span>
                                  <button
                                    type="button"
                                    onClick={() => setDynamicPkgSearch(prev => ({...prev, children: Math.min(6, prev.children + 1)}))}
                                    className="w-7 h-7 rounded-lg bg-[#C9A227] text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-bold text-white">الغرف</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setDynamicPkgSearch(prev => ({...prev, rooms: Math.max(1, prev.rooms - 1)}))}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="text-white text-sm font-bold min-w-[16px] text-center">{dynamicPkgSearch.rooms}</span>
                                  <button
                                    type="button"
                                    onClick={() => setDynamicPkgSearch(prev => ({...prev, rooms: Math.min(4, prev.rooms + 1)}))}
                                    className="w-7 h-7 rounded-lg bg-[#C9A227] text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setPackagePopoverOpen(false)}
                                className="w-full py-2 bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] text-xs font-black rounded-lg transition-colors text-center"
                              >
                                تطبيق التغييرات
                              </button>
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] font-black px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs shadow-lg shadow-[#C9A227]/10 whitespace-nowrap col-span-1"
                        >
                          <Search className="w-4 h-4" />
                          <span>صمم باقتك ووفر</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 2. Hotels Tab */}
                {activeTab === 'hotels' && (
                  <form onSubmit={handleHotelSearch} className="flex flex-col md:flex-row items-stretch gap-2.5">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 items-stretch">
                      <div ref={hotelDestRef} className="relative flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5 border border-white/5 col-span-1 sm:col-span-1">
                        <MapPin className="w-4 h-4 text-[#C9A227]" />
                        <input
                          type="text"
                          required
                          value={hotelDestination}
                          onChange={(e) => setHotelDestination(e.target.value)}
                          onFocus={() => setHotelDestFocused(true)}
                          placeholder="اسم الوجهة أو الفندق"
                          className="bg-transparent text-white placeholder-slate-400 text-xs font-bold focus:outline-none w-full text-right"
                        />
                        {/* Autocomplete Dropdown */}
                        {hotelDestFocused && (
                          <div className="absolute top-full right-0 left-0 bg-white border border-slate-200 shadow-2xl rounded-xl mt-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto">
                            <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-100 text-right">وجهات سياحية مقترحة</div>
                            {loadingHotels ? (
                              <div className="p-4 text-center text-xs text-slate-500 font-bold">جاري البحث...</div>
                            ) : hotelSuggestions.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-500">لا توجد نتائج مطابقة</div>
                            ) : (
                              hotelSuggestions.map((item) => (
                                <button
                                  key={item.code}
                                  type="button"
                                  onClick={() => {
                                    setHotelDestination(item.nameAr);
                                    setHotelCityCode(item.code);
                                    setHotelDestFocused(false);
                                  }}
                                  className="w-full text-right px-4 py-2 hover:bg-slate-100 flex items-center justify-between border-b border-slate-50 last:border-b-0 cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 text-right">
                                    <MapPin className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                                    <div className="text-right">
                                      <p className="text-xs font-bold text-[#071428]">{item.nameAr} ({item.nameEn})</p>
                                      <p className="text-[10px] text-slate-500">{item.country}</p>
                                    </div>
                                  </div>
                                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">{item.code}</span>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Dates container with Nights Badge */}
                      <div className="flex flex-col sm:flex-row gap-2 relative col-span-1 sm:col-span-2">
                        <CustomDatePicker
                          value={checkIn}
                          onChange={(val) => {
                            setCheckIn(val);
                            if (checkOut && new Date(val) >= new Date(checkOut)) {
                              const nextDay = new Date(val);
                              nextDay.setDate(nextDay.getDate() + 1);
                              setCheckOut(nextDay.toISOString().split('T')[0]);
                            }
                          }}
                          placeholder="تاريخ الدخول"
                          minDate={new Date().toISOString().split('T')[0]}
                          theme="dark"
                          className="flex-1"
                        />

                        {getHotelNights() > 0 && (
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center bg-[#C9A227] text-[#071428] px-2.5 py-0.5 rounded-full text-[9px] font-black shadow-lg border border-[#071428] pointer-events-none">
                            {formatNights(getHotelNights())}
                          </div>
                        )}

                        <CustomDatePicker
                          value={checkOut}
                          onChange={(val) => setCheckOut(val)}
                          placeholder="تاريخ الخروج"
                          minDate={checkIn || new Date().toISOString().split('T')[0]}
                          theme="dark"
                          className="flex-1"
                        />
                      </div>

                      {/* Guest / Rooms Popover */}
                      <div className="relative popover-container col-span-1">
                        <button
                          type="button"
                          onClick={() => {
                            setHotelPopoverOpen(!hotelPopoverOpen);
                            setFlightPopoverOpen(false);
                            setPackagePopoverOpen(false);
                          }}
                          className="w-full h-full flex items-center justify-between gap-1 bg-white/10 rounded-xl px-3 py-2.5 border border-white/5 text-white text-xs font-bold text-right whitespace-nowrap"
                          dir="rtl"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Users className="w-4 h-4 text-[#C9A227] shrink-0" />
                            <span className="whitespace-nowrap truncate">{hotelAdults + hotelChildren} نزلاء • {hotelRooms} غرف</span>
                          </div>
                          <span className="text-slate-400 text-[10px] shrink-0">▼</span>
                        </button>

                        {hotelPopoverOpen && (
                          <div className="absolute right-0 top-full mt-2 z-50 w-[90vw] max-w-xs md:w-72 bg-[#071428] border border-white/10 rounded-2xl p-4 shadow-2xl space-y-4">
                            <h4 className="text-xs font-black text-[#C9A227] pb-2 border-b border-white/5">تحديد النزلاء والغرف</h4>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-white">بالغين</p>
                                <p className="text-[9px] text-slate-400">بعمر 18 سنة فما فوق</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => setHotelAdults(Math.max(1, hotelAdults - 1))}
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center transition-colors"
                                >
                                  -
                                </button>
                                <span className="text-white text-sm font-bold min-w-[16px] text-center">{hotelAdults}</span>
                                <button
                                  type="button"
                                  onClick={() => setHotelAdults(Math.min(10, hotelAdults + 1))}
                                  className="w-7 h-7 rounded-lg bg-[#C9A227] text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-white">أطفال</p>
                                <p className="text-[9px] text-slate-400">بعمر 2 إلى 12 سنة</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => setHotelChildren(Math.max(0, hotelChildren - 1))}
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center transition-colors"
                                >
                                  -
                                </button>
                                <span className="text-white text-sm font-bold min-w-[16px] text-center">{hotelChildren}</span>
                                <button
                                  type="button"
                                  onClick={() => setHotelChildren(Math.min(6, hotelChildren + 1))}
                                  className="w-7 h-7 rounded-lg bg-[#C9A227] text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-white">الغرف</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => setHotelRooms(Math.max(1, hotelRooms - 1))}
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center transition-colors"
                                >
                                  -
                                </button>
                                <span className="text-white text-sm font-bold min-w-[16px] text-center">{hotelRooms}</span>
                                <button
                                  type="button"
                                  onClick={() => setHotelRooms(Math.min(4, hotelRooms + 1))}
                                  className="w-7 h-7 rounded-lg bg-[#C9A227] text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setHotelPopoverOpen(false)}
                              className="w-full py-2 bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] text-xs font-black rounded-lg transition-colors text-center"
                            >
                              تطبيق التغييرات
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] font-black px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shrink-0 whitespace-nowrap"
                    >
                      <Search className="w-4.5 h-4.5" />
                      <span>ابحث عن فندق</span>
                    </button>
                  </form>
                )}

                {/* 3. Flights Tab */}
                {activeTab === 'flights' && (
                  <div className="space-y-4">
                    {/* Flight type sub-tabs */}
                    <div className="flex justify-start gap-4 text-xs font-bold mb-1 border-b border-white/5 pb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFlightType('roundtrip');
                        }}
                        className={`pb-1 transition-all ${flightType === 'roundtrip' ? 'text-[#C9A227] border-b-2 border-[#C9A227] font-black' : 'text-slate-400 hover:text-white'}`}
                      >
                        ذهاب وعودة
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFlightType('oneway');
                          setReturnDate(''); // Clear return date when switching to one-way
                        }}
                        className={`pb-1 transition-all ${flightType === 'oneway' ? 'text-[#C9A227] border-b-2 border-[#C9A227] font-black' : 'text-slate-400 hover:text-white'}`}
                      >
                        ذهاب فقط
                      </button>
                    </div>

                    <form onSubmit={handleFlightSearch} className="flex flex-col md:flex-row items-stretch gap-2.5">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-stretch">
                        
                        {/* Origin/Destination with Swap */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative col-span-1 sm:col-span-12 md:col-span-5">
                          <div ref={flightFromRef} className="relative flex items-center gap-2 bg-white/10 rounded-xl pr-3 pl-3 sm:pl-8 py-2.5 border border-white/5">
                            <PlaneTakeoff className="w-4 h-4 text-[#C9A227]" />
                            <input
                              type="text"
                              required
                              value={flightFrom}
                              onChange={(e) => setFlightFrom(e.target.value.toUpperCase())}
                              onFocus={() => setFlightFromFocused(true)}
                              placeholder="مطار المغادرة (مثال: RUH)"
                              className="bg-transparent text-white placeholder-slate-400 text-xs font-bold focus:outline-none w-full text-right"
                            />
                            {/* Autocomplete Dropdown */}
                            {flightFromFocused && (
                              <div className="absolute top-full right-0 left-0 bg-white border border-slate-200 shadow-2xl rounded-xl mt-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto">
                                <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-100 text-right">مطارات مقترحة</div>
                                {loadingFlightFrom ? (
                                  <div className="p-4 text-center text-xs text-slate-500 font-bold">جاري البحث...</div>
                                ) : flightFromSuggestions.length === 0 ? (
                                  <div className="p-4 text-center text-xs text-slate-500">لا توجد نتائج مطابقة</div>
                                ) : (
                                  flightFromSuggestions.map((item) => (
                                    <button
                                      key={item.code}
                                      type="button"
                                      onClick={() => {
                                        setFlightFrom(item.code);
                                        setFlightFromFocused(false);
                                      }}
                                      className="w-full text-right px-4 py-2 hover:bg-slate-100 flex items-center justify-between border-b border-slate-50 last:border-b-0 cursor-pointer text-slate-700"
                                    >
                                      <div className="flex items-center gap-2 text-right">
                                        <PlaneTakeoff className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                                        <div className="text-right">
                                          <p className="text-xs font-bold text-[#071428]">{item.cityAr || item.nameAr} - {item.nameAr}</p>
                                          <p className="text-[10px] text-slate-500">{item.country} • {item.cityEn || item.nameEn}</p>
                                        </div>
                                      </div>
                                      <span className="text-xs bg-[#071428] text-white px-2 py-0.5 rounded font-black">{item.code}</span>
                                    </button>
                                  ))
                                )}
                              </div>
                            )}
                          </div>

                          {/* Swap Button */}
                          <button
                            type="button"
                            onClick={handleSwapFlights}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] flex items-center justify-center border border-[#071428] transition-transform active:scale-95 shadow-md"
                            title="تبديل الوجهات"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-90 sm:rotate-0">
                              <path d="m7 16-4-4 4-4"/>
                              <path d="M3 12h18"/>
                              <path d="m17 8 4 4-4 4"/>
                            </svg>
                          </button>

                          <div ref={flightToRef} className="relative flex items-center gap-2 bg-white/10 rounded-xl pr-3 sm:pr-8 pl-3 py-2.5 border border-white/5">
                            <PlaneLanding className="w-4 h-4 text-[#C9A227]" />
                            <input
                              type="text"
                              required
                              value={flightTo}
                              onChange={(e) => setFlightTo(e.target.value.toUpperCase())}
                              onFocus={() => setFlightToFocused(true)}
                              placeholder="وجهة الوصول (مثال: DXB)"
                              className="bg-transparent text-white placeholder-slate-400 text-xs font-bold focus:outline-none w-full text-right"
                            />
                            {/* Autocomplete Dropdown */}
                            {flightToFocused && (
                              <div className="absolute top-full right-0 left-0 bg-white border border-slate-200 shadow-2xl rounded-xl mt-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto">
                                <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-100 text-right">مطارات مقترحة</div>
                                {loadingFlightTo ? (
                                  <div className="p-4 text-center text-xs text-slate-500 font-bold">جاري البحث...</div>
                                ) : flightToSuggestions.length === 0 ? (
                                  <div className="p-4 text-center text-xs text-slate-500">لا توجد نتائج مطابقة</div>
                                ) : (
                                  flightToSuggestions.map((item) => (
                                    <button
                                      key={item.code}
                                      type="button"
                                      onClick={() => {
                                        setFlightTo(item.code);
                                        setFlightToFocused(false);
                                      }}
                                      className="w-full text-right px-4 py-2 hover:bg-slate-100 flex items-center justify-between border-b border-slate-50 last:border-b-0 cursor-pointer text-slate-700"
                                    >
                                      <div className="flex items-center gap-2 text-right">
                                        <PlaneLanding className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                                        <div className="text-right">
                                          <p className="text-xs font-bold text-[#071428]">{item.cityAr || item.nameAr} - {item.nameAr}</p>
                                          <p className="text-[10px] text-slate-500">{item.country} • {item.cityEn || item.nameEn}</p>
                                        </div>
                                      </div>
                                      <span className="text-xs bg-[#071428] text-white px-2 py-0.5 rounded font-black">{item.code}</span>
                                    </button>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dates layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative col-span-1 sm:col-span-6 md:col-span-4">
                          <CustomDatePicker
                            value={departureDate}
                            onChange={(val) => {
                              setDepartureDate(val);
                              if (returnDate && new Date(val) >= new Date(returnDate)) {
                                setReturnDate('');
                              }
                            }}
                            placeholder="تاريخ الذهاب"
                            minDate={new Date().toISOString().split('T')[0]}
                            theme="dark"
                            className="flex-1"
                          />

                          {flightType === 'roundtrip' ? (
                            <CustomDatePicker
                              value={returnDate}
                              onChange={(val) => setReturnDate(val)}
                              placeholder="تاريخ العودة"
                              minDate={departureDate || new Date().toISOString().split('T')[0]}
                              theme="dark"
                              className="flex-1"
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setFlightType('roundtrip');
                              }}
                              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl px-3 py-2.5 text-[#C9A227] text-xs font-bold transition-all text-center whitespace-nowrap"
                            >
                              <span className="whitespace-nowrap">+ إضافة رحلة العودة</span>
                            </button>
                          )}
                        </div>

                        {/* Passengers / Flight Class Popover */}
                        <div className="relative popover-container col-span-1 sm:col-span-6 md:col-span-3">
                          <button
                            type="button"
                            onClick={() => {
                              setFlightPopoverOpen(!flightPopoverOpen);
                              setHotelPopoverOpen(false);
                              setPackagePopoverOpen(false);
                            }}
                            className="w-full h-full flex items-center justify-between gap-1 bg-white/10 rounded-xl px-3 py-2.5 border border-white/5 text-white text-xs font-bold text-right whitespace-nowrap"
                            dir="rtl"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Users className="w-4 h-4 text-[#C9A227] shrink-0" />
                              <span className="whitespace-nowrap truncate">{flightAdults + flightChildren + flightInfants} مسافرين • {flightClass === 'economy' ? 'اقتصادية' : flightClass === 'business' ? 'أعمال' : 'أولى'}</span>
                            </div>
                            <span className="text-slate-400 text-[10px] shrink-0">▼</span>
                          </button>

                          {flightPopoverOpen && (
                            <div className="absolute right-0 top-full mt-2 z-50 w-[90vw] max-w-xs md:w-72 bg-[#071428] border border-white/10 rounded-2xl p-4 shadow-2xl space-y-4">
                              <h4 className="text-xs font-black text-[#C9A227] pb-2 border-b border-white/5">تحديد المسافرين ودرجة السفر</h4>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-bold text-white">بالغين</p>
                                  <p className="text-[9px] text-slate-400">بعمر 12 سنة فما فوق</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setFlightAdults(Math.max(1, flightAdults - 1))}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="text-white text-sm font-bold min-w-[16px] text-center">{flightAdults}</span>
                                  <button
                                    type="button"
                                    onClick={() => setFlightAdults(Math.min(10, flightAdults + 1))}
                                    className="w-7 h-7 rounded-lg bg-[#C9A227] text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-bold text-white">أطفال</p>
                                  <p className="text-[9px] text-slate-400">بعمر 2 إلى 12 سنة</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setFlightChildren(Math.max(0, flightChildren - 1))}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="text-white text-sm font-bold min-w-[16px] text-center">{flightChildren}</span>
                                  <button
                                    type="button"
                                    onClick={() => setFlightChildren(Math.min(6, flightChildren + 1))}
                                    className="w-7 h-7 rounded-lg bg-[#C9A227] text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-bold text-white">رضع</p>
                                  <p className="text-[9px] text-slate-400">تحت سنتين</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setFlightInfants(Math.max(0, flightInfants - 1))}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="text-white text-sm font-bold min-w-[16px] text-center">{flightInfants}</span>
                                  <button
                                    type="button"
                                    onClick={() => setFlightInfants(Math.min(4, flightInfants + 1))}
                                    className="w-7 h-7 rounded-lg bg-[#C9A227] text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-1.5 pt-2 border-t border-white/5">
                                <label className="block text-[10px] font-bold text-slate-400">درجة السفر</label>
                                <select
                                  value={flightClass}
                                  onChange={(e) => setFlightClass(e.target.value)}
                                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none"
                                >
                                  <option value="economy" className="bg-[#071428]">درجة اقتصادية</option>
                                  <option value="business" className="bg-[#071428]">درجة رجال الأعمال</option>
                                  <option value="first" className="bg-[#071428]">الدرجة الأولى</option>
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={() => setFlightPopoverOpen(false)}
                                className="w-full py-2 bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] text-xs font-black rounded-lg transition-colors text-center"
                              >
                                تطبيق التغييرات
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] font-black px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shrink-0 whitespace-nowrap"
                      >
                        <Search className="w-4.5 h-4.5" />
                        <span>ابحث عن رحلة</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* 4. Visas Tab */}
                {activeTab === 'visas' && (
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                    <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 border border-white/5">
                      <Award className="w-4.5 h-4.5 text-[#C9A227]" />
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            navigate(`/visas?search=${encodeURIComponent(e.target.value)}`);
                          }
                        }}
                        className="bg-transparent text-white text-sm font-bold focus:outline-none w-full text-right"
                      >
                        <option value="" className="bg-[#071428] text-slate-300">تصفح شروط ورسوم التأشيرات حسب الوجهة...</option>
                        <option value="شنجن" className="bg-[#071428] text-white">تأشيرة شنجن الموحدة (أوروبا)</option>
                        <option value="بريطانيا" className="bg-[#071428] text-white">تأشيرة بريطانيا السياحية / الإلكترونية</option>
                        <option value="أمريكا" className="bg-[#071428] text-white">تأشيرة الولايات المتحدة الأمريكية (B1/B2)</option>
                        <option value="تعليم" className="bg-[#071428] text-white">تأشيرة دراسة طلابية (سعوديين)</option>
                        <option value="سياحة" className="bg-[#071428] text-white">تأشيرة سياحية عامة</option>
                      </select>
                    </div>
                    <button
                      onClick={() => navigate('/visas')}
                      className="bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] font-black px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shrink-0 whitespace-nowrap"
                    >
                      <ArrowLeft className="w-4.5 h-4.5" />
                      <span>جميع التأشيرات</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              aria-label={`الانتقال للوجهة ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              className="p-1 outline-none group"
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-[#C9A227] w-8' : 'bg-white/35 group-hover:bg-white/60 w-2.5'}`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* Featured Destinations - White Background */}
      <section className="relative bg-white py-32">
        {/* Smooth Wave Divider Top */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
          <svg className="relative block w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#071428" opacity=".3"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#071428" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#071428"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 pt-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-[#071428]">باقاتنا المميزة</h2>
            <div className="w-20 h-1 bg-[#C9A227] mx-auto mt-6"></div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
                {/* Commercial Package Cards */}
                {packages.map((pkg) => (
                  <CommercialPackageCard
                    key={pkg.id}
                    title={pkg.titleAr}
                    price={pkg.price}
                    duration={pkg.duration}
                    image={pkg.imageUrl}
                    packageId={pkg.packageId}
                    features={pkg.features || []}
                    rating={pkg.rating || 5}
                    isOffer={pkg.isOffer || false}
                    location={pkg.subtitle || pkg.destination?.nameAr}
                  />
                ))}
              </div>
          )}

          {/* View All Packages CTA */}
          <div className="text-center mt-16">
            <Link to="/destinations" className="btn-primary inline-flex items-center gap-3 text-lg">
              <span>عرض جميع الباقات</span>
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-2" />
            </Link>
          </div>
        </div>

        {/* Smooth Wave Divider Bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none rotate-180">
          <svg className="relative block w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#071428" opacity=".3"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#071428" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#071428"></path>
          </svg>
        </div>
      </section>

      {/* Promo Banner Container */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl pt-12 pb-4 relative z-10">
        <PromoBanner
          theme="gold"
          titleAr="ودك تهرب من الحرّ! 🌴☀️"
          subtitleAr="تابع أقوى عروض الحجز الفوري والهروب الممتع إلى الوجهات الباردة والمنعشة 🌊"
          ctaTextAr="تواصل لمعرفة العروض"
          badgeTextAr="عروض مميزة ✨"
          whatsappMsg="مرحباً سفريات الملحم، أود الاستفسار عن عروض الصيف والهروب من الحر والحصول على الخصومات الحصرية المتاحة حالياً!"
        />
      </div>

      <div className="relative z-10">
        {/* Destinations Discovery Section - Eagerly Loaded for LCP/UX */}
        <DestinationsInteractive />
      </div>

      <Suspense fallback={<div className="h-40 flex items-center justify-center"><LoadingSpinner size="md" /></div>}>
        <div className="relative z-10">
        {/* Stats Section */}
        <StatsSection />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Navy Divider Strip */}
        <div className="bg-[#071428] py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/90 text-xl sm:text-2xl md:text-3xl font-medium max-w-4xl mx-auto leading-relaxed">
              أكثر من <span className="text-[#C9A227] font-bold">30 عاماً</span> من الخبرة في صناعة السفر
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Partners Section */}
        <PartnersSection />

        {/* CTA Banner */}
        <CTABanner />

        {/* Footer */}
        <Footer />
        </div>
      </Suspense>
    </div>
  );
};

export default Home;

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, 
  Building2, 
  Calendar, 
  Users, 
  ArrowLeft, 
  Check, 
  X, 
  Loader2, 
  Shield, 
  AlertCircle, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Star,
  DollarSign
} from 'lucide-react';
import apiService from '../services/api.service';
import { useDebounce } from '../hooks/useDebounce';
import CustomDatePicker from '../components/ui/CustomDatePicker';
import SEO from '../components/ui/SEO';
import Footer from '../components/layout/Footer';

// Local flight airports fallback list
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

// City and Airport lists for mapping
const popularAirports = [
  { code: 'RUH', name: 'الرياض (RUH) - مطار الملك خالد', city: 'الرياض', cityCode: 'RUH' },
  { code: 'JED', name: 'جدة (JED) - مطار الملك عبدالعزيز', city: 'جدة', cityCode: 'JED' },
  { code: 'DMM', name: 'الدمام (DMM) - مطار الملك فهد', city: 'الدمام', cityCode: 'RUH' },
  { code: 'DXB', name: 'دبي (DXB) - مطار دبي الدولي', city: 'دبي', cityCode: 'DXB' },
  { code: 'IST', name: 'إسطنبول (IST) - مطار إسطنبول', city: 'إسطنبول', cityCode: 'IST' },
  { code: 'LHR', name: 'لندن (LHR) - مطار هيثرو', city: 'لندن', cityCode: 'LON' },
  { code: 'PAR', name: 'باريس (PAR) - مطار شارل ديغول', city: 'باريس', cityCode: 'PAR' },
  { code: 'CAI', name: 'القاهرة (CAI) - مطار القاهرة', city: 'القاهرة', cityCode: 'CAI' },
  { code: 'MLE', name: 'ماليه (MLE) - مطار فيلانا المالديف', city: 'ماليه', cityCode: 'MLE' },
  { code: 'KUL', name: 'كوالالمبور (KUL) - مطار كوالالمبور', city: 'كوالالمبور', cityCode: 'KUL' }
];

const popularCities = [
  { code: 'DXB', name: 'دبي', country: 'الإمارات' },
  { code: 'IST', name: 'إسطنبول', country: 'تركيا' },
  { code: 'LON', name: 'لندن', country: 'المملكة المتحدة' },
  { code: 'PAR', name: 'باريس', country: 'فرنسا' },
  { code: 'KUL', name: 'كوالالمبور', country: 'ماليزيا' },
  { code: 'TBS', name: 'تبليسي', country: 'جورجيا' },
  { code: 'MOW', name: 'موسكو', country: 'روسيا' },
  { code: 'BKK', name: 'بانكوك', country: 'تايلند' },
  { code: 'MLE', name: 'ماليه (المالديف)', country: 'المالديف' },
  { code: 'CAI', name: 'القاهرة', country: 'مصر' },
  { code: 'RUH', name: 'الرياض', country: 'السعودية' },
  { code: 'JED', name: 'جدة', country: 'السعودية' }
];

function FlightHotelPackages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search parameters states
  const origin = searchParams.get('origin') || 'RUH';
  const destination = searchParams.get('destination') || 'DXB';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const adults = parseInt(searchParams.get('adults') || '2', 10);
  const children = parseInt(searchParams.get('children') || '0', 10);
  const rooms = parseInt(searchParams.get('rooms') || '1', 10);

  // Search panel states
  const [searchPanel, setSearchPanel] = useState({
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    rooms
  });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);

  // Autocomplete dynamic suggestions state
  const [fromSuggestions, setFromSuggestions] = useState(FLIGHT_AIRPORTS);
  const [toSuggestions, setToSuggestions] = useState(FLIGHT_AIRPORTS);
  const [loadingFromSuggestions, setLoadingFromSuggestions] = useState(false);
  const [loadingToSuggestions, setLoadingToSuggestions] = useState(false);

  const debouncedFromQuery = useDebounce(searchPanel.origin, 300);
  const debouncedToQuery = useDebounce(searchPanel.destination, 300);

  // Flight From suggestions effect
  useEffect(() => {
    let active = true;
    const fetchSuggestions = async () => {
      if (!debouncedFromQuery || debouncedFromQuery.trim().length < 2) {
        setFromSuggestions(FLIGHT_AIRPORTS);
        return;
      }
      const matched = FLIGHT_AIRPORTS.find(a => a.code === debouncedFromQuery);
      if (matched) return;

      setLoadingFromSuggestions(true);
      try {
        const response = await apiService.locations.searchFlights(debouncedFromQuery);
        if (active) {
          if (response?.success) {
            setFromSuggestions(response.data);
          } else if (response?.data?.success) {
            setFromSuggestions(response.data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching flight from suggestions:', err);
      } finally {
        if (active) setLoadingFromSuggestions(false);
      }
    };
    fetchSuggestions();
    return () => { active = false; };
  }, [debouncedFromQuery]);

  // Flight To suggestions effect
  useEffect(() => {
    let active = true;
    const fetchSuggestions = async () => {
      if (!debouncedToQuery || debouncedToQuery.trim().length < 2) {
        setToSuggestions(FLIGHT_AIRPORTS);
        return;
      }
      const matched = FLIGHT_AIRPORTS.find(a => a.code === debouncedToQuery);
      if (matched) return;

      setLoadingToSuggestions(true);
      try {
        const response = await apiService.locations.searchFlights(debouncedToQuery);
        if (active) {
          if (response?.success) {
            setToSuggestions(response.data);
          } else if (response?.data?.success) {
            setToSuggestions(response.data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching flight to suggestions:', err);
      } finally {
        if (active) setLoadingToSuggestions(false);
      }
    };
    fetchSuggestions();
    return () => { active = false; };
  }, [debouncedToQuery]);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // UI Flow States
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [error, setError] = useState(null);

  // Filter States
  const [starFilter, setStarFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('low-to-high');

  // Booking Wizard States
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [wizardStep, setWizardStep] = useState(1); // 1: review/customize, 2: passengers, 3: payment
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedRoomOffer, setSelectedRoomOffer] = useState(null);
  const [hotelRoomOffers, setHotelRoomOffers] = useState([]);
  const [loadingRoomOffers, setLoadingRoomOffers] = useState(false);

  // Passenger data state
  const [passengersData, setPassengersData] = useState([]);

  // Card Payment States
  const [cardData, setCardData] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);

  // OTP Verification States
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(300);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (showOTPModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setShowOTPModal(false);
      setIsProcessingBooking(false);
      setOtpError('انتهت صلاحية الرمز، يرجى المحاولة مجدداً.');
    }
    return () => clearInterval(interval);
  }, [showOTPModal, otpTimer]);

  // Handle click outside of popover to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.popover-container')) {
        setPopoverOpen(false);
      }
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setFromFocused(false);
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setToFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSearchNights = () => {
    if (!searchPanel.departureDate || !searchPanel.returnDate) return 0;
    const d1 = new Date(searchPanel.departureDate);
    const d2 = new Date(searchPanel.returnDate);
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

  const handleSwapSearchDestinations = () => {
    setSearchPanel(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  // Run searches when URL search params change
  useEffect(() => {
    if (departureDate && returnDate) {
      fetchPackageElements();
    }
  }, [searchParams]);

  // Build packages list once flights or hotels load
  useEffect(() => {
    if (flights.length > 0 && hotels.length > 0) {
      buildDynamicPackages();
    } else {
      setPackages([]);
      setFilteredPackages([]);
    }
  }, [flights, hotels]);

  // Apply filters
  useEffect(() => {
    let result = [...packages];

    // Star filter
    if (starFilter !== 'all') {
      const stars = parseInt(starFilter, 10);
      result = result.filter(pkg => pkg.hotel.stars === stars);
    }

    // Price sort
    if (priceSort === 'low-to-high') {
      result.sort((a, b) => a.totalPackagePrice - b.totalPackagePrice);
    } else if (priceSort === 'high-to-low') {
      result.sort((a, b) => b.totalPackagePrice - a.totalPackagePrice);
    }

    setFilteredPackages(result);
  }, [packages, starFilter, priceSort]);

  const fetchPackageElements = async () => {
    setLoading(true);
    setError(null);
    try {
      // Find destination IATA city code from destination query
      const foundCity = popularCities.find(c => c.code === destination.toUpperCase() || c.name === destination);
      const destCity = foundCity ? foundCity : { code: destination.toUpperCase(), name: destination };

      // 1. Fetch Flights (Duffel API)
      const flightsResponse = await apiService.amadeus.flights.search({
        origin: origin.toUpperCase(),
        destination: destCity.code,
        departureDate,
        returnDate,
        adults
      });

      // 2. Fetch Hotels (Duffel Stays API)
      const hotelsResponse = await apiService.amadeus.hotels.search({
        cityCode: destCity.code,
        checkIn: departureDate,
        checkOut: returnDate,
        adults,
        rooms
      });

      const flightsList = flightsResponse.data?.success ? flightsResponse.data.data : (flightsResponse.data || []);
      const hotelsList = hotelsResponse.data?.success ? hotelsResponse.data.data : (hotelsResponse.data || []);

      setFlights(flightsList);
      setHotels(hotelsList);

      if (flightsList.length === 0 || hotelsList.length === 0) {
        setError('عذراً، لم نجد رحلات طيران أو فنادق متوافقة مع تواريخ بحثك. يرجى تجربة تواريخ أو وجهات أخرى.');
      }
    } catch (err) {
      console.error('Error fetching package elements:', err);
      setError('حدث خطأ أثناء جلب تفاصيل الطيران والفنادق. يرجى التحقق من المدخلات والمحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const buildDynamicPackages = () => {
    // Pair each hotel with the cheapest flight option by default
    const cheapestFlight = flights[0]; // Already sorted by price in DuffelService
    if (!cheapestFlight) return;

    // Calculate nights count
    const d1 = new Date(departureDate);
    const d2 = new Date(returnDate);
    const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));

    const dynamicPkgs = hotels.map((hotel) => {
      // Total hotel cost
      const totalHotelCost = hotel.pricePerNight * nights * rooms;
      // Total flight cost (per ticket * adults count)
      const totalFlightCost = cheapestFlight.price; // This price is already calculated for total passengers in API

      // Standard combined price
      const standardPrice = totalHotelCost + totalFlightCost;
      
      // Dynamic Package Discount (10% off to motivate package booking!)
      const packageDiscount = Math.round(standardPrice * 0.10);
      const totalPackagePrice = standardPrice - packageDiscount;

      // Mock some premium hotel images for gorgeous UI
      let imageUrl = '/tourism.jpg';
      if (hotel.stars >= 5) {
        imageUrl = '/saudi_student_education.jpg';
      } else if (hotel.stars === 4) {
        imageUrl = '/visa_schengen.jpg';
      }

      return {
        id: `pkg-${hotel.id}-${cheapestFlight.id}`,
        hotel: {
          ...hotel,
          imageUrl,
          nightsCount: nights
        },
        defaultFlight: cheapestFlight,
        standardPrice,
        packageDiscount,
        totalPackagePrice,
        savingsPercentage: 10
      };
    });

    setPackages(dynamicPkgs);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchPanel.departureDate || !searchPanel.returnDate) {
      alert('الرجاء إدخال تواريخ الذهاب والعودة');
      return;
    }
    setSearchParams({
      origin: searchPanel.origin,
      destination: searchPanel.destination,
      departureDate: searchPanel.departureDate,
      returnDate: searchPanel.returnDate,
      adults: searchPanel.adults.toString(),
      children: searchPanel.children.toString(),
      rooms: searchPanel.rooms.toString()
    });
  };

  // Launch booking wizard
  const handleOpenBookingWizard = async (pkg) => {
    setSelectedPackage(pkg);
    setSelectedFlight(pkg.defaultFlight);
    setWizardStep(1);
    setCardData({ name: '', number: '', expiry: '', cvv: '' });
    
    // Prepare passenger inputs list
    const passList = [];
    for (let i = 0; i < adults; i++) {
      passList.push({
        title: 'السيد',
        firstName: '',
        lastName: '',
        passportNumber: '',
        passportExpiry: '',
        dateOfBirth: ''
      });
    }
    setPassengersData(passList);

    // Fetch rooms for the selected hotel
    setLoadingRoomOffers(true);
    try {
      const response = await apiService.amadeus.hotels.getOffers(pkg.hotel.id, {
        checkIn: departureDate,
        checkOut: returnDate,
        adults,
        rooms
      });
      const roomOffersList = response.data?.success ? response.data.data : (response.data || []);
      setHotelRoomOffers(roomOffersList);
      if (roomOffersList.length > 0) {
        setSelectedRoomOffer(roomOffersList[0]);
      }
    } catch (err) {
      console.error('Error fetching room offers:', err);
    } finally {
      setLoadingRoomOffers(false);
    }
  };

  const handleNextStep = () => {
    if (wizardStep === 1) {
      setWizardStep(2);
    } else if (wizardStep === 2) {
      // Check validation
      const invalid = passengersData.some(p => !p.firstName || !p.lastName || !p.passportNumber);
      if (invalid) {
        alert('الرجاء تعبئة بيانات جميع المسافرين بدقة');
        return;
      }
      setWizardStep(3);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!cardData.name || !cardData.number || !cardData.cvv) {
      alert('الرجاء إدخال تفاصيل بطاقة الدفع كاملة');
      return;
    }

    setIsProcessingBooking(true);
    // Simulate contact with bank gateway
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessingBooking(false);
    setShowOTPModal(true);
    setOtpTimer(300);
    setOtpCode('');
    setOtpError('');
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otpCode !== '1234') {
      setOtpError('رمز التحقق غير صحيح، يرجى استخدام 1234 للمحاكاة.');
      return;
    }

    setOtpError('');
    setIsProcessingBooking(true);

    // Simulate database booking creation & Duffel ticket issuance
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessingBooking(false);
    setShowOTPModal(false);
    setSelectedPackage(null);

    // Redirect to success page with booking reference
    const ref = `ALM-PKG-${Math.floor(100000 + Math.random() * 900000)}`;
    const name = `باقة طيران وفندق ديناميكية - ${selectedPackage.hotel.name}`;
    window.location.href = `/booking-success?bookingRef=${ref}&hotelName=${encodeURIComponent(name)}`;
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="pt-header-offset bg-slate-50 min-h-screen dir-rtl text-right">
      <SEO
        title="باقات الطيران والفنادق المشتركة"
        description="صمم باقتك السياحية بالكامل. اختر رحلة الطيران وفندق إقامتك المفضل واحصل على خصم 10% فوري عند الحجز معاً."
      />

      {/* Header section with search summary */}
      <section className="bg-[#071428] text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="bg-[#C9A227]/20 border border-[#C9A227]/30 text-[#C9A227] px-3 py-1.5 rounded-full text-xs font-bold mb-3 inline-block">
                ✈️ باقات طيران + فندق ديناميكية (Dynamic Packaging)
              </span>
              <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 text-white">صمم باقة سفرك الخاصة</h1>
              <p className="text-slate-300 text-sm md:text-base font-semibold">
                اجمع رحلة الطيران مع فندقك المفضل في عملية حجز واحدة ووفر حتى <span className="text-[#C9A227]">10% من التكلفة الكلية</span>!
              </p>
            </div>
            
            {/* Quick summary card */}
            {departureDate && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 text-xs sm:text-sm font-semibold flex items-center gap-4">
                <div className="text-right">
                  <p className="text-slate-400">رحلة الذهاب والعودة</p>
                  <p className="font-bold text-[#C9A227] text-base">{origin} ⇄ {destination}</p>
                </div>
                <div className="h-8 w-[1px] bg-white/20" />
                <div>
                  <p className="text-slate-400">التواريخ والمسافرين</p>
                  <p className="font-bold">{departureDate} • {adults} مسافرين</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main search panel & results */}
      <section className="container mx-auto max-w-6xl px-4 py-8">
        
        {/* Search Panel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 items-end">
            
            {/* Origin/Destination with Swap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative col-span-1 sm:col-span-2">
              <div ref={fromRef} className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2">من (مطار المغادرة)</label>
                <input
                  type="text"
                  required
                  value={searchPanel.origin}
                  onChange={(e) => setSearchPanel({...searchPanel, origin: e.target.value.toUpperCase()})}
                  onFocus={() => setFromFocused(true)}
                  placeholder="مطار المغادرة (مثال: RUH)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A227] text-sm font-bold text-right focus:outline-none"
                />
                {/* Autocomplete Dropdown */}
                {fromFocused && (
                  <div className="absolute top-full right-0 left-0 bg-white border border-slate-200 shadow-2xl rounded-xl mt-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto">
                    <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-100 text-right">مطارات المغادرة المقترحة</div>
                    {loadingFromSuggestions ? (
                      <div className="p-4 text-center text-xs text-slate-500 font-bold">جاري البحث...</div>
                    ) : fromSuggestions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">لا توجد نتائج مطابقة</div>
                    ) : (
                      fromSuggestions.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setSearchPanel({...searchPanel, origin: item.code});
                            setFromFocused(false);
                          }}
                          className="w-full text-right px-4 py-2 hover:bg-slate-100 flex items-center justify-between border-b border-slate-50 last:border-b-0 cursor-pointer text-slate-700"
                        >
                          <div className="flex items-center gap-2 text-right">
                            <Plane className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
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
                onClick={handleSwapSearchDestinations}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#C9A227] hover:bg-[#071428] text-white hover:text-white flex items-center justify-center border border-slate-200 transition-transform active:scale-95 shadow-md mt-3"
                title="تبديل الوجهات"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-90 sm:rotate-0">
                  <path d="m7 16-4-4 4-4"/>
                  <path d="M3 12h18"/>
                  <path d="m17 8 4 4-4 4"/>
                </svg>
              </button>

              <div ref={toRef} className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2">إلى (الوجهة)</label>
                <input
                  type="text"
                  required
                  value={searchPanel.destination}
                  onChange={(e) => setSearchPanel({...searchPanel, destination: e.target.value.toUpperCase()})}
                  onFocus={() => setToFocused(true)}
                  placeholder="الوجهة أو مطار الوصول (مثال: DXB)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A227] text-sm font-bold text-right focus:outline-none"
                />
                {/* Autocomplete Dropdown */}
                {toFocused && (
                  <div className="absolute top-full right-0 left-0 bg-white border border-slate-200 shadow-2xl rounded-xl mt-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto">
                    <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-100 text-right">مطارات الوصول المقترحة</div>
                    {loadingToSuggestions ? (
                      <div className="p-4 text-center text-xs text-slate-500 font-bold">جاري البحث...</div>
                    ) : toSuggestions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">لا توجد نتائج مطابقة</div>
                    ) : (
                      toSuggestions.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setSearchPanel({...searchPanel, destination: item.code});
                            setToFocused(false);
                          }}
                          className="w-full text-right px-4 py-2 hover:bg-slate-100 flex items-center justify-between border-b border-slate-50 last:border-b-0 cursor-pointer text-slate-700"
                        >
                          <div className="flex items-center gap-2 text-right">
                            <Plane className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
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

            {/* Dates container with Nights Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative col-span-1 sm:col-span-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">تاريخ الذهاب</label>
                <CustomDatePicker
                  value={searchPanel.departureDate}
                  onChange={(val) => {
                    setSearchPanel(prev => {
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
                  theme="light"
                />
              </div>

              {/* Nights count badge */}
              {getSearchNights() > 0 && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center bg-[#C9A227] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-lg border border-slate-200 pointer-events-none mt-3">
                  {formatNights(getSearchNights())}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">تاريخ العودة</label>
                <CustomDatePicker
                  value={searchPanel.returnDate}
                  onChange={(val) => {
                    setSearchPanel(prev => ({ ...prev, returnDate: val }));
                  }}
                  placeholder="تاريخ العودة"
                  minDate={searchPanel.departureDate || new Date().toISOString().split('T')[0]}
                  theme="light"
                />
              </div>
            </div>

            {/* Guest / Rooms Popover */}
            <div className="relative popover-container col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-2">الركاب / الغرف</label>
              <button
                type="button"
                onClick={() => setPopoverOpen(!popoverOpen)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A227] text-sm font-bold text-right flex items-center justify-between gap-1 whitespace-nowrap"
                dir="rtl"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Users className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span className="whitespace-nowrap truncate">{searchPanel.adults + searchPanel.children} مسافرين • {searchPanel.rooms} غرف</span>
                </div>
                <span className="text-slate-400 text-[10px] shrink-0">▼</span>
              </button>

              {popoverOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl space-y-4 text-right">
                  <h4 className="text-xs font-black text-[#071428] pb-2 border-b border-slate-100">تحديد المسافرين والغرف</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#071428]">بالغين</p>
                      <p className="text-[9px] text-slate-400 font-bold">بعمر 12 سنة فما فوق</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSearchPanel(prev => ({...prev, adults: Math.max(1, prev.adults - 1)}))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="text-[#071428] text-sm font-bold min-w-[16px] text-center">{searchPanel.adults}</span>
                      <button
                        type="button"
                        onClick={() => setSearchPanel(prev => ({...prev, adults: Math.min(10, prev.adults + 1)}))}
                        className="w-7 h-7 rounded-lg bg-[#C9A227] text-white font-bold text-sm flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#071428]">أطفال</p>
                      <p className="text-[9px] text-slate-400 font-bold">بعمر 2 إلى 12 سنة</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSearchPanel(prev => ({...prev, children: Math.max(0, prev.children - 1)}))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="text-[#071428] text-sm font-bold min-w-[16px] text-center">{searchPanel.children}</span>
                      <button
                        type="button"
                        onClick={() => setSearchPanel(prev => ({...prev, children: Math.min(6, prev.children + 1)}))}
                        className="w-7 h-7 rounded-lg bg-[#C9A227] text-white font-bold text-sm flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#071428]">الغرف</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSearchPanel(prev => ({...prev, rooms: Math.max(1, prev.rooms - 1)}))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#071428] font-bold text-sm flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="text-[#071428] text-sm font-bold min-w-[16px] text-center">{searchPanel.rooms}</span>
                      <button
                        type="button"
                        onClick={() => setSearchPanel(prev => ({...prev, rooms: Math.min(4, prev.rooms + 1)}))}
                        className="w-7 h-7 rounded-lg bg-[#C9A227] text-white font-bold text-sm flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPopoverOpen(false)}
                    className="w-full py-2 bg-[#C9A227] hover:bg-[#B8911F] text-white text-xs font-black rounded-lg transition-colors text-center"
                  >
                    تطبيق التغييرات
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#071428] hover:bg-[#C9A227] text-white hover:text-[#071428] font-bold py-3.5 px-6 rounded-xl transition-all text-sm flex items-center justify-center gap-2 whitespace-nowrap col-span-1"
            >
              <Search className="w-5 h-5" />
              <span>بحث وتصميم الباقة</span>
            </button>
          </form>
        </div>

        {/* Dynamic content view */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#C9A227] animate-spin mb-4" />
            <h3 className="text-xl font-bold text-slate-800">جاري البحث ومقارنة العروض المتاحة...</h3>
            <p className="text-slate-500 text-sm mt-1">نقوم بجلب أحدث أسعار الطيران والفنادق لنوفر لك الباقة الأرخص</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-700 max-w-xl mx-auto">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
            <h4 className="font-bold text-lg mb-1">تنبيه البحث</h4>
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg mb-4 pb-2 border-b">خيارات التصفية</h3>
                
                {/* Star rating filter */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-500 mb-3">تصنيف الفندق</label>
                  <div className="space-y-2.5">
                    {[
                      { val: 'all', label: 'كل التصانيف' },
                      { val: '5', label: '5 نجوم ★★★★★' },
                      { val: '4', label: '4 نجوم ★★★★' }
                    ].map(opt => (
                      <label key={opt.val} className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="stars"
                          checked={starFilter === opt.val}
                          onChange={() => setStarFilter(opt.val)}
                          className="text-[#C9A227] focus:ring-[#C9A227]/30"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price sorting */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-3">ترتيب حسب السعر الكلي</label>
                  <select
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A227] text-xs font-bold"
                  >
                    <option value="low-to-high">السعر: من الأقل للأعلى</option>
                    <option value="high-to-low">السعر: من الأعلى للأقل</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results cards */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                <span>عثرنا على: {filteredPackages.length} باقة طيران وفندق مقترحة</span>
                <span className="text-[#C9A227]">خصم 10% مدمج ومحسوب تلقائياً</span>
              </div>

              {filteredPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow grid md:grid-cols-3 gap-0"
                >
                  {/* Image and Hotel Basic info */}
                  <div className="relative h-48 md:h-full min-h-[180px]">
                    <img
                      src={pkg.hotel.imageUrl}
                      alt={pkg.hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-[#071428]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                      <span>{pkg.hotel.stars} نجوم</span>
                    </div>
                  </div>

                  {/* Flight & Hotel Description */}
                  <div className="p-6 md:col-span-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-[#071428] font-serif">{pkg.hotel.name}</h3>
                          <p className="text-slate-400 text-xs font-bold flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-[#C9A227]" />
                            <span>{pkg.hotel.location} • إقامة لمدة {pkg.hotel.nightsCount} ليالي</span>
                          </p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded">
                          وفر {pkg.packageDiscount.toLocaleString()} ر.س (10%)
                        </span>
                      </div>

                      {/* Flight Details Block */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4 text-[#C9A227] rotate-45" />
                          <div>
                            <p className="text-[#071428]">رحلة ذهاب وعودة مدمجة</p>
                            <p className="text-[10px] text-slate-400">عبر {pkg.defaultFlight.itineraries[0]?.segments[0]?.carrierName || 'خطوط طيران ممتازة'}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-[#071428]">{origin} ⇄ {destination}</p>
                          <p className="text-[10px] text-slate-400">مدة الرحلة {pkg.defaultFlight.itineraries[0]?.duration.replace('PT', '').toLowerCase() || ''}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="flex justify-between items-end border-t pt-4 border-slate-100">
                      <div>
                        <p className="text-slate-400 text-xs font-semibold">السعر الكلي للباقة شامل الضرائب</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[#C9A227] text-2xl font-bold font-serif">{pkg.totalPackagePrice.toLocaleString()} ر.س</span>
                          <span className="text-slate-400 text-sm line-through">{pkg.standardPrice.toLocaleString()} ر.س</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenBookingWizard(pkg)}
                        className="bg-[#C9A227] hover:bg-[#071428] text-white hover:text-white font-bold py-2.5 px-6 rounded-xl transition-all text-xs"
                      >
                        عرض وتخصيص الباقة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center max-w-md mx-auto">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">ابدأ البحث وتصميم باقتك</h3>
            <p className="text-slate-400 text-xs font-bold">يرجى تعبئة مطار المغادرة والوجهة والتواريخ أعلاه للبحث عن أفضل أسعار الفنادق ورحلات الطيران المناسبة.</p>
          </div>
        )}
      </section>

      {/* Booking customize, passenger entry, and payment steps wizard dialog */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071428]/85 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-t-4 border-[#C9A227] overflow-hidden my-8"
          >
            {/* Wizard Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">حجز باقة طيران وفندق ديناميكية</h3>
                <p className="text-xs text-slate-400 mt-0.5">فندق: {selectedPackage.hotel.name} • طيران: {origin} ⇄ {destination}</p>
              </div>
              <button
                onClick={() => setSelectedPackage(null)}
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Progress */}
            <div className="bg-slate-50 px-8 py-3.5 border-b border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400">
              <span className={wizardStep >= 1 ? 'text-[#071428]' : ''}>1. تخصيص ومراجعة</span>
              <ChevronRight className="w-4 h-4" />
              <span className={wizardStep >= 2 ? 'text-[#071428]' : ''}>2. بيانات المسافرين</span>
              <ChevronRight className="w-4 h-4" />
              <span className={wizardStep >= 3 ? 'text-[#071428]' : ''}>3. الدفع والتحقق</span>
            </div>

            {/* Stepper Forms */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              
              {/* Step 1: Customize selected elements */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  {/* Hotel details */}
                  <div className="bg-[#fdfbf7] p-4 rounded-xl border border-[#C9A227]/20">
                    <h4 className="font-bold text-[#071428] text-sm mb-2">الغرفة المتاحة بالفندق</h4>
                    {loadingRoomOffers ? (
                      <div className="flex items-center gap-2 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
                        <span className="text-xs text-slate-500 font-semibold">جاري تحميل الغرف المتاحة...</span>
                      </div>
                    ) : selectedRoomOffer ? (
                      <div className="text-xs font-bold text-slate-600 space-y-1">
                        <p className="text-sm text-[#071428]">{selectedRoomOffer.roomDescription}</p>
                        <p className="text-slate-400">الوجبة: {selectedRoomOffer.boardType === 'ROOM_ONLY' ? 'إقامة فقط' : 'إقامة مع إفطار'}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-semibold">غرفة قياسية مزدوجة (مشمولة في عرض الباقة)</p>
                    )}
                  </div>

                  {/* Flight select */}
                  <div className="bg-[#fdfbf7] p-4 rounded-xl border border-[#C9A227]/20">
                    <h4 className="font-bold text-[#071428] text-sm mb-3">تفاصيل رحلة الطيران المحددة</h4>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 gap-4">
                      <div>
                        <p className="text-sm text-[#071428]">رحلة {selectedFlight.itineraries[0]?.segments[0]?.carrierName}</p>
                        <p className="text-slate-400">الدرجة: {searchParams.get('class') || 'اقتصادية'}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-[#071428]">{origin} ⇄ {destination}</p>
                        <p className="text-slate-400">الرحلة شاملة العودة والضرائب</p>
                      </div>
                    </div>
                  </div>

                  {/* Bundle summary */}
                  <div className="bg-slate-50 p-4 rounded-xl text-xs font-bold text-slate-600 border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-slate-400">المجموع الكلي للباقة (شامل الخصم والضريبة):</p>
                      <p className="text-[#C9A227] text-2xl font-bold font-serif">{selectedPackage.totalPackagePrice.toLocaleString()} ر.س</p>
                    </div>
                    <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                      توفير 10% محتسب!
                    </span>
                  </div>
                </div>
              )}

              {/* Step 2: Passenger Data */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-800 text-sm border-r-4 border-[#C9A227] pr-2 mb-4">بيانات المسافرين (كتابة الاسم بالإنجليزية كما في الجواز)</h4>
                  {passengersData.map((pass, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                      <h5 className="font-bold text-slate-700 text-xs">المسافر #{idx + 1}</h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">اللقب</label>
                          <select
                            value={pass.title}
                            onChange={(e) => {
                              const updated = [...passengersData];
                              updated[idx].title = e.target.value;
                              setPassengersData(updated);
                            }}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          >
                            <option value="السيد">السيد</option>
                            <option value="السيدة">السيدة</option>
                            <option value="الآنسة">الآنسة</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">الاسم الأول</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ali"
                            value={pass.firstName}
                            onChange={(e) => {
                              const updated = [...passengersData];
                              updated[idx].firstName = e.target.value;
                              setPassengersData(updated);
                            }}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-left"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">اسم العائلة</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Al-Mulhim"
                            value={pass.lastName}
                            onChange={(e) => {
                              const updated = [...passengersData];
                              updated[idx].lastName = e.target.value;
                              setPassengersData(updated);
                            }}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-left"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">رقم جواز السفر</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. N123456"
                            value={pass.passportNumber}
                            onChange={(e) => {
                              const updated = [...passengersData];
                              updated[idx].passportNumber = e.target.value;
                              setPassengersData(updated);
                            }}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-left"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">تاريخ انتهاء الجواز</label>
                          <input
                            type="date"
                            required
                            value={pass.passportExpiry}
                            onChange={(e) => {
                              const updated = [...passengersData];
                              updated[idx].passportExpiry = e.target.value;
                              setPassengersData(updated);
                            }}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-left"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Secure Checkout */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-800 text-sm border-r-4 border-[#C9A227] pr-2 mb-4">الدفع الآمن للباقة بالكامل</h4>
                  
                  {/* Pricing recap */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 space-y-2">
                    <div className="flex justify-between">
                      <span>سعر الباقة الإجمالي:</span>
                      <span>{selectedPackage.totalPackagePrice.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ضريبة القيمة المضافة (15% مشمولة):</span>
                      <span>{Math.round(selectedPackage.totalPackagePrice * 0.15).toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-[#C9A227] text-base font-serif">
                      <span>المبلغ المستحق للدفع:</span>
                      <span>{selectedPackage.totalPackagePrice.toLocaleString()} ر.س</span>
                    </div>
                  </div>

                  {/* Card input details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">اسم صاحب البطاقة</label>
                      <input
                        type="text"
                        required
                        value={cardData.name}
                        onChange={(e) => setCardData({...cardData, name: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        placeholder="اسم حامل البطاقة"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">رقم البطاقة</label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        value={cardData.number}
                        onChange={(e) => setCardData({...cardData, number: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-left tracking-widest"
                        placeholder="4000 1234 5678 9012"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">تاريخ الانتهاء</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={cardData.expiry}
                          onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-left"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">الرمز السري (CVV)</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-left"
                          placeholder="***"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Wizard Navigation Footer */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-between gap-4">
              {wizardStep > 1 && (
                <button
                  type="button"
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl"
                >
                  السابق
                </button>
              )}
              <div className="flex-1" />
              {wizardStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-[#071428] hover:bg-[#C9A227] text-white hover:text-[#071428] text-xs font-bold rounded-xl transition-all"
                >
                  المتابعة
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isProcessingBooking}
                  onClick={handlePaymentSubmit}
                  className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] text-xs font-bold rounded-xl transition-all min-w-[120px] flex items-center justify-center gap-2"
                >
                  {isProcessingBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري الدفع...
                    </>
                  ) : (
                    'تأكيد الدفع للباقة'
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 3D Secure Verification Dialog */}
      {showOTPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071428]/90 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-t-4 border-[#C9A227] overflow-hidden text-right dir-rtl"
          >
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  بوابة الدفع الآمنة الموحدة (Mada 3D Secure)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Al-Mulhim travel packages engine</p>
              </div>
            </div>

            <form onSubmit={handleVerifyOTP} className="p-6 space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs font-semibold text-slate-500">
                <div className="flex justify-between">
                  <span>المستفيد:</span>
                  <span className="text-[#071428] font-bold">الملحم للسفر والسياحة</span>
                </div>
                <div className="flex justify-between">
                  <span>الباقة:</span>
                  <span className="text-[#071428]">{selectedPackage.hotel.name} + طيران</span>
                </div>
                <div className="flex justify-between text-[#C9A227] text-sm">
                  <span>المبلغ المطلوب:</span>
                  <span className="font-bold">{selectedPackage.totalPackagePrice.toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 text-center">أدخل رمز الأمان (OTP) المرسل لهاتفك</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center font-bold text-2xl tracking-widest focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none"
                  placeholder="••••"
                  autoFocus
                />
                <p className="text-xs text-center font-semibold text-slate-400">
                  للاختبار والمحاكاة، يرجى إدخال الرمز: <span className="text-[#C9A227] font-bold select-all bg-[#C9A227]/10 px-2 py-0.5 rounded border border-[#C9A227]/30">1234</span>
                </p>
                {otpError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>الصلاحية: <span className="text-red-500 font-bold">{formatTimer(otpTimer)}</span></span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpTimer(300);
                    setOtpCode('');
                    setOtpError('تمت إعادة الإرسال بنجاح (الرمز 1234)');
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  إعادة إرسال الرمز
                </button>
              </div>

              <button
                type="submit"
                disabled={isProcessingBooking}
                className="w-full py-3.5 bg-[#C9A227] hover:bg-[#B8911F] text-white hover:text-[#071428] font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-base"
              >
                {isProcessingBooking ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    جاري إتمام الحجز...
                  </>
                ) : (
                  'تأكيد الدفع وإصدار التذاكر'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default FlightHotelPackages;

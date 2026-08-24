import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Calendar, Users, PlaneTakeoff, PlaneLanding,
  SlidersHorizontal, X, Clock, Filter, ArrowLeftRight, AlertCircle, ChevronDown,
  Tag, Zap, Star, Sunrise, Sun, Sunset, Moon
} from 'lucide-react';
import FlightCard from '../components/flights/FlightCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FlightCardSkeleton } from '../components/ui/Skeleton';
import Footer from '../components/layout/Footer';
import apiService from '../services/api.service';
import { useDebounce } from '../hooks/useDebounce';

// Airport code mapping
const AIRPORT_CODES = {
  'الرياض': 'RUH',
  'riyadh': 'RUH',
  'جدة': 'JED',
  'jeddah': 'JED',
  'الدمام': 'DMM',
  'dammam': 'DMM',
  'دبي': 'DXB',
  'dubai': 'DXB',
  'لندن': 'LHR',
  'london': 'LHR',
  'إسطنبول': 'IST',
  'istanbul': 'IST',
  'باريس': 'CDG',
  'paris': 'CDG',
  'كوالالمبور': 'KUL',
  'kuala lumpur': 'KUL',
  'القاهرة': 'CAI',
  'cairo': 'CAI',
  'بانكوك': 'BKK',
  'bangkok': 'BKK',
  'سنغافورة': 'SIN',
  'singapore': 'SIN',
  'تبليسي': 'TBS',
  'tbilisi': 'TBS',
};

const sortOptions = [
  { id: 'price-low', label: 'السعر: من الأقل' },
  { id: 'price-high', label: 'السعر: من الأعلى' },
  { id: 'duration', label: 'الأقصر مدة' },
  { id: 'departure', label: 'وقت المغادرة' },
];

const travelClasses = [
  { code: 'ECONOMY', nameAr: 'اقتصادية' },
  { code: 'PREMIUM_ECONOMY', nameAr: 'اقتصادية مميزة' },
  { code: 'BUSINESS', nameAr: 'رجال الأعمال' },
  { code: 'FIRST', nameAr: 'الدرجة الأولى' },
];

const FlightResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Data state
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
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
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Filter state
  const [sortBy, setSortBy] = useState('price-low');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedFareType, setSelectedFareType] = useState([]);
  const [departureTimeSlots, setDepartureTimeSlots] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Search form state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromCode, setFromCode] = useState('');
  const [toCode, setToCode] = useState('');

  // Autocomplete dynamic suggestions state
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [loadingFromSuggestions, setLoadingFromSuggestions] = useState(false);
  const [loadingToSuggestions, setLoadingToSuggestions] = useState(false);

  const debouncedFromQuery = useDebounce(from, 300);
  const debouncedToQuery = useDebounce(to, 300);

  // Flight From suggestions effect
  useEffect(() => {
    let active = true;
    const fetchSuggestions = async () => {
      if (!debouncedFromQuery || debouncedFromQuery.trim().length < 2) {
        setFromSuggestions([]);
        return;
      }
      const matched = airports.find(a => a.code === debouncedFromQuery);
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
  }, [debouncedFromQuery, airports]);

  // Flight To suggestions effect
  useEffect(() => {
    let active = true;
    const fetchSuggestions = async () => {
      if (!debouncedToQuery || debouncedToQuery.trim().length < 2) {
        setToSuggestions([]);
        return;
      }
      const matched = airports.find(a => a.code === debouncedToQuery);
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
  }, [debouncedToQuery, airports]);

  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('ECONOMY');

  // Unique airlines from search results
  const [uniqueAirlines, setUniqueAirlines] = useState([]);

  // Fetch airports on mount
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await apiService.duffel.flights.getAirports();
        if (response?.success && response.data) {
          setAirports(response.data);
        }
      } catch (err) {
        console.error('Error fetching airports:', err);
      }
    };
    fetchAirports();
  }, []);

  // Initialize from URL params
  useEffect(() => {
    const fromParam = searchParams.get('from') || 'الرياض';
    const toParam = searchParams.get('to') || 'دبي';
    const depParam = searchParams.get('departure');
    const retParam = searchParams.get('return');
    const passParam = searchParams.get('passengers');
    const classParam = searchParams.get('class');

    setFrom(fromParam);
    setTo(toParam);

    // Set default dates if not provided
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 14);

    setDepartureDate(depParam || tomorrow.toISOString().split('T')[0]);
    setReturnDate(retParam || nextWeek.toISOString().split('T')[0]);
    if (passParam) setPassengers(Number(passParam));
    if (classParam) setTravelClass(classParam);

    // Get airport codes
    const fCode = AIRPORT_CODES[fromParam.toLowerCase()] || AIRPORT_CODES[fromParam] || 'RUH';
    const tCode = AIRPORT_CODES[toParam.toLowerCase()] || AIRPORT_CODES[toParam] || 'DXB';
    setFromCode(fCode);
    setToCode(tCode);
  }, [searchParams]);

  // Search flights
  const searchFlights = useCallback(async () => {
    if (!fromCode || !toCode || !departureDate) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await apiService.duffel.flights.search({
        origin: fromCode,
        destination: toCode,
        departureDate: departureDate,
        returnDate: returnDate || undefined,
        adults: passengers,
        travelClass: travelClass,
      });

      if (response?.success && response.data) {
        // Transform Duffel data to our format
        const transformedFlights = response.data.map((flight) => {
          const outbound = flight.itineraries[0];
          const firstSegment = outbound?.segments[0];
          const lastSegment = outbound?.segments[outbound.segments.length - 1];

          // Calculate total stops
          const totalStops = outbound?.segments.length - 1 || 0;

          // Get stop cities
          const stopCities = outbound?.segments.slice(0, -1).map(seg => seg.arrivalAirport).join(', ');

          return {
            id: flight.id,
            airline: firstSegment?.carrierName || 'Unknown',
            airlineLogo: getAirlineLogo(firstSegment?.carrierCode),
            airlineId: firstSegment?.carrierCode?.toLowerCase(),
            carrierCode: firstSegment?.carrierCode,
            departureTime: formatTime(firstSegment?.departureTime),
            departureCode: firstSegment?.departureAirport,
            departureCity: getCityName(firstSegment?.departureAirport),
            departureTerminal: firstSegment?.departureTerminal,
            arrivalTime: formatTime(lastSegment?.arrivalTime),
            arrivalCode: lastSegment?.arrivalAirport,
            arrivalCity: getCityName(lastSegment?.arrivalAirport),
            arrivalTerminal: lastSegment?.arrivalTerminal,
            duration: formatDuration(outbound?.duration),
            durationMinutes: parseDurationToMinutes(outbound?.duration),
            stops: totalStops,
            stopCity: stopCities || null,
            price: Math.round(flight.price),
            currency: flight.currency,
            class: travelClass.toLowerCase(),
            seatsAvailable: flight.numberOfBookableSeats,
            segments: outbound?.segments || [],
          };
        });

        setFlights(transformedFlights);

        // Extract unique airlines
        const airlines = [...new Set(transformedFlights.map(f => f.carrierCode))].map(code => ({
          id: code?.toLowerCase(),
          name: transformedFlights.find(f => f.carrierCode === code)?.airline || code,
          logo: getAirlineLogo(code),
        }));
        setUniqueAirlines(airlines);

        // Update price range based on results
        if (transformedFlights.length > 0) {
          const prices = transformedFlights.map(f => f.price);
          const maxPrice = Math.max(...prices);
          setPriceRange([0, maxPrice + 1000]);
        }
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, [fromCode, toCode, departureDate, returnDate, passengers, travelClass]);

  // Auto-search when params are ready
  useEffect(() => {
    if (fromCode && toCode && departureDate && !hasSearched) {
      searchFlights();
    }
  }, [fromCode, toCode, departureDate, hasSearched, searchFlights]);

  // Handle search button click
  const handleSearch = () => {
    const fCode = AIRPORT_CODES[from.toLowerCase()] || AIRPORT_CODES[from];
    const tCode = AIRPORT_CODES[to.toLowerCase()] || AIRPORT_CODES[to];

    if (!fCode) {
      setError(`المطار "${from}" غير مدعوم. جرب: الرياض، جدة، دبي، لندن`);
      return;
    }
    if (!tCode) {
      setError(`المطار "${to}" غير مدعوم. جرب: الرياض، جدة، دبي، لندن`);
      return;
    }

    setFromCode(fCode);
    setToCode(tCode);

    // Update URL
    setSearchParams({
      from,
      to,
      departure: departureDate,
      return: returnDate,
      passengers: passengers.toString(),
      class: travelClass,
    });

    setHasSearched(false);
  };

  // Swap origin and destination
  const handleSwap = () => {
    const tempFrom = from;
    const tempCode = fromCode;
    setFrom(to);
    setFromCode(toCode);
    setTo(tempFrom);
    setToCode(tempCode);
  };

  // Helper functions
  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDuration = (duration) => {
    if (!duration) return '--';
    // PT6H30M -> 6س 30د
    const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
    if (match) {
      const hours = match[1];
      const minutes = match[2] || '0';
      return `${hours}س ${minutes}د`;
    }
    return duration;
  };

  const parseDurationToMinutes = (duration) => {
    if (!duration) return 0;
    const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2] || 0);
    }
    return 0;
  };

  const getCityName = (code) => {
    const cityNames = {
      'RUH': 'الرياض', 'JED': 'جدة', 'DMM': 'الدمام',
      'DXB': 'دبي', 'AUH': 'أبوظبي', 'DOH': 'الدوحة',
      'LHR': 'لندن', 'CDG': 'باريس', 'IST': 'إسطنبول',
      'KUL': 'كوالالمبور', 'CAI': 'القاهرة', 'BKK': 'بانكوك',
      'SIN': 'سنغافورة', 'TBS': 'تبليسي', 'FCO': 'روما',
      'SVO': 'موسكو',
    };
    return cityNames[code] || code;
  };

  const getAirlineLogo = (code) => {
    const logos = {
      'SV': 'https://images.kiwi.com/airlines/64/SV.png',
      'EK': 'https://images.kiwi.com/airlines/64/EK.png',
      'QR': 'https://images.kiwi.com/airlines/64/QR.png',
      'BA': 'https://images.kiwi.com/airlines/64/BA.png',
      'TK': 'https://images.kiwi.com/airlines/64/TK.png',
      'MS': 'https://images.kiwi.com/airlines/64/MS.png',
      'GF': 'https://images.kiwi.com/airlines/64/GF.png',
      'FZ': 'https://images.kiwi.com/airlines/64/FZ.png',
      'MH': 'https://images.kiwi.com/airlines/64/MH.png',
      'SQ': 'https://images.kiwi.com/airlines/64/SQ.png',
    };
    return logos[code] || `https://images.kiwi.com/airlines/64/${code}.png`;
  };

  // Handle flight selection
  const handleSelectFlight = (flight) => {
    navigate(`/seat-selection?offerId=${flight.id}&passengers=${passengers}&travelClass=${travelClass}`);
  };

  // Sort and filter flights
  const sortedFlights = useMemo(() => {
    let result = [...flights];

    // Filter by stops
    if (selectedStops.length > 0) {
      result = result.filter(f => selectedStops.includes(f.stops >= 2 ? 2 : f.stops));
    }

    // Filter by airlines
    if (selectedAirlines.length > 0) {
      result = result.filter(f => selectedAirlines.includes(f.airlineId));
    }

    // Filter by price
    result = result.filter(f => f.price >= priceRange[0] && f.price <= priceRange[1]);

    // Filter by Fare Type
    if (selectedFareType.length > 0) {
      result = result.filter(f => 
        (selectedFareType.includes('refundable') && f.isRefundable) ||
        (selectedFareType.includes('non-refundable') && !f.isRefundable)
      );
    }

    // Filter by Time Slots
    if (departureTimeSlots.length > 0) {
      result = result.filter(f => {
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        return departureTimeSlots.some(slot => {
          if (slot === 'early') return hour >= 0 && hour < 6;
          if (slot === 'morning') return hour >= 6 && hour < 12;
          if (slot === 'afternoon') return hour >= 12 && hour < 18;
          if (slot === 'evening') return hour >= 18 && hour <= 24;
          return false;
        });
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-low': return result.sort((a, b) => a.price - b.price);
      case 'price-high': return result.sort((a, b) => b.price - a.price);
      case 'duration': return result.sort((a, b) => a.durationMinutes - b.durationMinutes);
      case 'departure': return result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      default: return result;
    }
  }, [flights, selectedStops, selectedAirlines, priceRange, selectedFareType, departureTimeSlots, sortBy]);

  // Filter Sidebar
  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`${isMobile ? '' : 'sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-4 custom-scrollbar'} space-y-6`}>
      {/* Stops Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-bold text-[#071428] mb-4">عدد التوقفات</h3>
        <div className="space-y-3">
          {[
            { value: 0, label: 'مباشرة' },
            { value: 1, label: 'توقف واحد' },
            { value: 2, label: 'توقفان أو أكثر' },
          ].map((stop) => (
            <label key={stop.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedStops.includes(stop.value)}
                onChange={() => setSelectedStops(prev =>
                  prev.includes(stop.value) ? prev.filter(s => s !== stop.value) : [...prev, stop.value]
                )}
                className="w-5 h-5 rounded border-slate-300 text-[#071428] focus:ring-[#C9A227]"
              />
              <span className="text-sm text-slate-600 group-hover:text-[#071428] transition-colors">
                {stop.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines Filter */}
      {uniqueAirlines.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-bold text-[#071428] mb-4">شركات الطيران</h3>
          <div className="space-y-3">
            {uniqueAirlines.map((airline) => (
              <label key={airline.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedAirlines.includes(airline.id)}
                  onChange={() => setSelectedAirlines(prev =>
                    prev.includes(airline.id) ? prev.filter(a => a !== airline.id) : [...prev, airline.id]
                  )}
                  className="w-5 h-5 rounded border-slate-300 text-[#071428] focus:ring-[#C9A227]"
                />
                <img
                  src={airline.logo}
                  alt={airline.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="text-sm text-slate-600 group-hover:text-[#071428] transition-colors">
                  {airline.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-bold text-[#071428] mb-4">نطاق السعر</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-slate-600">
            <span>{priceRange[0].toLocaleString()} ر.س</span>
            <span>{priceRange[1].toLocaleString()} ر.س</span>
          </div>
          <div className="flex gap-4">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="من"
            />
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="إلى"
            />
          </div>
        </div>
      </div>

      {/* Departure Time */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-bold text-[#071428] mb-4">وقت المغادرة</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'morning', label: 'صباحاً', time: '06:00 - 12:00', icon: <Sunrise className="w-5 h-5" /> },
            { id: 'afternoon', label: 'ظهراً', time: '12:00 - 18:00', icon: <Sun className="w-5 h-5" /> },
            { id: 'evening', label: 'مساءً', time: '18:00 - 00:00', icon: <Sunset className="w-5 h-5" /> },
            { id: 'early', label: 'ليلاً', time: '00:00 - 06:00', icon: <Moon className="w-5 h-5" /> },
          ].map((slot) => (
            <button
              key={slot.id}
              onClick={() => setDepartureTimeSlots(prev => 
                prev.includes(slot.id) ? prev.filter(s => s !== slot.id) : [...prev, slot.id]
              )}
              className={`p-3 border rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                departureTimeSlots.includes(slot.id) 
                  ? 'border-[#C9A227] bg-gradient-to-b from-[#C9A227]/10 to-transparent shadow-sm ring-1 ring-[#C9A227]/30' 
                  : 'border-slate-200 bg-white hover:border-[#C9A227]/40 hover:bg-slate-50 hover:-translate-y-0.5'
              }`}
            >
              <div className={`${departureTimeSlots.includes(slot.id) ? 'text-[#C9A227]' : 'text-slate-400'}`}>
                {slot.icon}
              </div>
              <div className="text-center mt-1">
                <p className={`text-sm font-bold leading-none mb-1 ${departureTimeSlots.includes(slot.id) ? 'text-[#071428]' : 'text-slate-600'}`}>{slot.label}</p>
                <p className="text-[10px] text-slate-400 font-medium leading-none">{slot.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fare Type */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-bold text-[#071428] mb-4">نوع التذكرة</h3>
        <div className="space-y-3">
          {[
            { id: 'refundable', label: 'قابل للاسترداد' },
            { id: 'non-refundable', label: 'غير قابل للاسترداد' },
          ].map((type) => (
            <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedFareType.includes(type.id)}
                onChange={() => setSelectedFareType(prev =>
                  prev.includes(type.id) ? prev.filter(t => t !== type.id) : [...prev, type.id]
                )}
                className="w-5 h-5 rounded border-slate-300 text-[#071428] focus:ring-[#C9A227]"
              />
              <span className="text-sm text-slate-600 group-hover:text-[#071428] transition-colors">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedStops.length > 0 || selectedAirlines.length > 0 || selectedFareType.length > 0 || departureTimeSlots.length > 0) && (
        <button
          onClick={() => { setSelectedStops([]); setSelectedAirlines([]); setSelectedFareType([]); setDepartureTimeSlots([]); }}
          className="w-full text-center text-sm text-red-500 hover:text-red-600 font-medium"
        >
          مسح جميع الفلاتر
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen pt-header-offset">
      {/* Search Bar - Sticky */}
      <div className="sticky top-header-offset z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* From */}
            <div ref={fromRef} className="flex-1 min-w-[150px] relative">
              <PlaneTakeoff className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A227]" />
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onFocus={() => setFromFocused(true)}
                className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C9A227] text-right font-bold"
                placeholder="من (مثل: الرياض)"
              />
              {/* Autocomplete Dropdown */}
              {fromFocused && (
                <div className="absolute top-full right-0 left-0 bg-white border border-slate-200 shadow-2xl rounded-xl mt-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto">
                  <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-100 text-right">مطارات المغادرة المقترحة</div>
                  {loadingFromSuggestions ? (
                    <div className="p-4 text-center text-xs text-slate-500 font-bold">جاري البحث...</div>
                  ) : fromSuggestions.length === 0 ? (
                    [
                      { code: "RUH", nameAr: "مطار الملك خالد الدولي", nameEn: "King Khalid International", cityAr: "الرياض", cityEn: "Riyadh", country: "السعودية" },
                      { code: "JED", nameAr: "مطار الملك عبدالعزيز الدولي", nameEn: "King Abdulaziz International", cityAr: "جدة", cityEn: "Jeddah", country: "السعودية" },
                      { code: "DMM", nameAr: "مطار الملك فهد الدولي", nameEn: "King Fahd International", cityAr: "الدمام", cityEn: "Dammam", country: "السعودية" },
                      { code: "DXB", nameAr: "مطار دبي الدولي", nameEn: "Dubai International", cityAr: "دبي", cityEn: "Dubai", country: "الإمارات" },
                    ].filter(item => 
                      !from ||
                      item.code.includes(from.toUpperCase()) ||
                      item.cityAr.includes(from) || 
                      item.cityEn.toLowerCase().includes(from.toLowerCase())
                    ).map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setFrom(item.code);
                          setFromFocused(false);
                        }}
                        className="w-full text-right px-4 py-2 hover:bg-slate-100 flex items-center justify-between border-b border-slate-50 last:border-b-0 cursor-pointer text-slate-700"
                      >
                        <div className="flex items-center gap-2 text-right">
                          <PlaneTakeoff className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                          <div className="text-right">
                            <p className="text-xs font-bold text-[#071428]">{item.cityAr} - {item.nameAr}</p>
                            <p className="text-[10px] text-slate-500">{item.country} • {item.cityEn}</p>
                          </div>
                        </div>
                        <span className="text-xs bg-[#071428] text-white px-2 py-0.5 rounded font-black">{item.code}</span>
                      </button>
                    ))
                  ) : (
                    fromSuggestions.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setFrom(item.code);
                          setFromFocused(false);
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
              onClick={handleSwap}
              type="button"
              className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <ArrowLeftRight className="w-5 h-5 text-slate-700 font-medium" />
            </button>

            {/* To */}
            <div ref={toRef} className="flex-1 min-w-[150px] relative">
              <PlaneLanding className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A227]" />
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onFocus={() => setToFocused(true)}
                className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C9A227] text-right font-bold"
                placeholder="إلى (مثل: دبي)"
              />
              {/* Autocomplete Dropdown */}
              {toFocused && (
                <div className="absolute top-full right-0 left-0 bg-white border border-slate-200 shadow-2xl rounded-xl mt-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto">
                  <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-100 text-right">مطارات الوصول المقترحة</div>
                  {loadingToSuggestions ? (
                    <div className="p-4 text-center text-xs text-slate-500 font-bold">جاري البحث...</div>
                  ) : toSuggestions.length === 0 ? (
                    [
                      { code: "RUH", nameAr: "مطار الملك خالد الدولي", nameEn: "King Khalid International", cityAr: "الرياض", cityEn: "Riyadh", country: "السعودية" },
                      { code: "JED", nameAr: "مطار الملك عبدالعزيز الدولي", nameEn: "King Abdulaziz International", cityAr: "جدة", cityEn: "Jeddah", country: "السعودية" },
                      { code: "DMM", nameAr: "مطار الملك فهد الدولي", nameEn: "King Fahd International", cityAr: "الدمام", cityEn: "Dammam", country: "السعودية" },
                      { code: "DXB", nameAr: "مطار دبي الدولي", nameEn: "Dubai International", cityAr: "دبي", cityEn: "Dubai", country: "الإمارات" },
                    ].filter(item => 
                      !to ||
                      item.code.includes(to.toUpperCase()) ||
                      item.cityAr.includes(to) || 
                      item.cityEn.toLowerCase().includes(to.toLowerCase())
                    ).map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setTo(item.code);
                          setToFocused(false);
                        }}
                        className="w-full text-right px-4 py-2 hover:bg-slate-100 flex items-center justify-between border-b border-slate-50 last:border-b-0 cursor-pointer text-slate-700"
                      >
                        <div className="flex items-center gap-2 text-right">
                          <PlaneLanding className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                          <div className="text-right">
                            <p className="text-xs font-bold text-[#071428]">{item.cityAr} - {item.nameAr}</p>
                            <p className="text-[10px] text-slate-500">{item.country} • {item.cityEn}</p>
                          </div>
                        </div>
                        <span className="text-xs bg-[#071428] text-white px-2 py-0.5 rounded font-black">{item.code}</span>
                      </button>
                    ))
                  ) : (
                    toSuggestions.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setTo(item.code);
                          setToFocused(false);
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

            {/* Departure */}
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 font-medium" />
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="pr-10 pl-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            {/* Return (optional) */}
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 font-medium" />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="pr-10 pl-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C9A227]"
                placeholder="العودة (اختياري)"
              />
            </div>

            {/* Passengers */}
            <div className="relative">
              <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 font-medium" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="pr-10 pl-8 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C9A227] appearance-none bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>{n} مسافر</option>
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
              <span className="hidden sm:inline">بحث</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#071428] mb-2">
            رحلات من {from} إلى {to}
          </h1>
          <p className="text-slate-700 font-medium">
            {departureDate} • {passengers} مسافر • {loading ? '...' : `${flights.length} رحلة متاحة`}
          </p>
          {fromCode && toCode && (
            <span className="inline-block mt-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              {fromCode} → {toCode} • بيانات حية ومباشرة
            </span>
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

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Quick Sort Buttons */}
            <div className="flex gap-3 mb-6">
              {[
                { id: 'cheapest', label: 'الأرخص', icon: <Tag className="w-5 h-5" />, getValue: () => {
                  if (flights.length === 0) return '';
                  const cheapest = flights.reduce((min, f) => f.price < min.price ? f : min, flights[0]);
                  return cheapest ? `${cheapest.price} ر.س` : '';
                }},
                { id: 'fastest', label: 'الأسرع', icon: <Zap className="w-5 h-5" />, getValue: () => {
                  if (flights.length === 0) return '';
                  const fastest = flights.reduce((min, f) => f.durationMinutes < min.durationMinutes ? f : min, flights[0]);
                  return fastest ? `${Math.floor(fastest.durationMinutes / 60)}h ${fastest.durationMinutes % 60}m` : '';
                }},
                { id: 'recommended', label: 'الأفضل', icon: <Star className="w-5 h-5" />, getValue: () => '\u00A0' },
              ].map(btn => (
                <button key={btn.id}
                  onClick={() => setSortBy(btn.id === 'cheapest' ? 'price-low' : btn.id === 'fastest' ? 'duration' : 'recommended')}
                  className={`flex-1 p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                    sortBy === (btn.id === 'cheapest' ? 'price-low' : btn.id === 'fastest' ? 'duration' : 'recommended')
                      ? 'border-[#C9A227] bg-gradient-to-b from-[#C9A227]/10 to-transparent shadow-sm ring-1 ring-[#C9A227]/30'
                      : 'border-slate-200 bg-white hover:border-[#C9A227]/40 hover:bg-slate-50 hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`mb-1 ${sortBy === (btn.id === 'cheapest' ? 'price-low' : btn.id === 'fastest' ? 'duration' : 'recommended') ? 'text-[#C9A227]' : 'text-slate-400'}`}>
                    {btn.icon}
                  </div>
                  <div className={`text-sm font-bold ${sortBy === (btn.id === 'cheapest' ? 'price-low' : btn.id === 'fastest' ? 'duration' : 'recommended') ? 'text-[#071428]' : 'text-slate-600'}`}>{btn.label}</div>
                  <div className="text-[11px] font-semibold text-slate-500">{btn.getValue()}</div>
                </button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <FlightCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && hasSearched && flights.length === 0 && !error && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">✈️</div>
                <h3 className="text-xl font-bold text-[#071428] mb-2">لا توجد رحلات متاحة</h3>
                <p className="text-slate-700 font-medium mb-6">جرب تغيير تاريخ السفر أو الوجهة</p>
              </div>
            )}

            {/* Flight Cards */}
            {!loading && sortedFlights.length > 0 && (
              <div className="space-y-4">
                {sortedFlights.map((flight, index) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FlightCard
                      flight={{
                        ...flight,
                        isCheapest: flights.length > 0 && flight.price === Math.min(...flights.map(f => f.price)),
                        isFastest: flights.length > 0 && flight.durationMinutes === Math.min(...flights.map(f => f.durationMinutes)),
                      }}
                      onSelect={handleSelectFlight}
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
                  عرض {sortedFlights.length} رحلة
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

export default FlightResults;

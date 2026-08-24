import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, Calendar, Users, MapPin, SlidersHorizontal, X,
  Star, Check, ChevronDown, Map, Wifi, Car, Dumbbell,
  Waves, Coffee, AlertCircle, Sun, CloudRain, Wind, Snowflake, Cloud
} from 'lucide-react';
import HotelResultCard from '../components/hotels/HotelResultCard';
import { HotelCardSkeleton } from '../components/ui/Skeleton';
import Footer from '../components/layout/Footer';
import apiService from '../services/api.service';
import axios from '../lib/axios';
import LeafletMap from '../components/hotels/LeafletMap';

const sortOptions = [
  { id: 'recommended', label: 'الأكثر ملاءمة' },
  { id: 'price-low', label: 'السعر: من الأقل' },
  { id: 'price-high', label: 'السعر: من الأعلى' },
  { id: 'rating', label: 'التقييم الأعلى' },
];

const propertyTypes = [
  { id: 'hotel', label: 'فندق' },
  { id: 'apartment', label: 'شقة فندقية' },
  { id: 'resort', label: 'منتجع' },
  { id: 'hostel', label: 'هوستل' }
];

const amenitiesFilters = [
  { id: 'wifi', label: 'واي فاي مجاني' },
  { id: 'pool', label: 'مسبح' },
  { id: 'parking', label: 'موقف سيارات' },
  { id: 'gym', label: 'صالة رياضية' },
  { id: 'restaurant', label: 'مطعم' }
];

const guestRatingOptions = [
  { id: 'excellent', label: 'ممتاز+ (4.5+)', min: 4.5 },
  { id: 'very-good', label: 'جيد جداً+ (4.0+)', min: 4.0 },
  { id: 'good', label: 'جيد+ (3.5+)', min: 3.5 },
  { id: 'fair', label: 'مقبول+ (3.0+)', min: 3.0 },
];

const travelerTypes = [
  { id: 'family', label: 'عائلة' },
  { id: 'couple', label: 'زوجين' },
  { id: 'solo', label: 'فردي' },
  { id: 'business', label: 'أعمال' },
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data state
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);

  // Search parameters
  const cityCode = searchParams.get('cityCode') || 'TBS';
  const cityName = searchParams.get('destination') || 'تبليسي';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const adults = parseInt(searchParams.get('adults') || '2');

  // Filter state
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [searchName, setSearchName] = useState('');
  
  const [selectedGuestRating, setSelectedGuestRating] = useState(null);
  const [maxDistance, setMaxDistance] = useState(50);
  const [selectedTravelerTypes, setSelectedTravelerTypes] = useState([]);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    fetchHotels();
    fetchWeather();
  }, [cityCode, checkIn, checkOut, adults]);

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      // Temporary fallback parameters if none provided from home
      const ci = checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const co = checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
      
      const response = await apiService.hotels.search({ cityCode, checkIn: ci, checkOut: co, adults });
      if (response.success) {
        setHotels(response.data || []);
      } else {
        throw new Error(response.message || 'فشل في جلب الفنادق');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء البحث عن الفنادق');
      // Set empty hotels on error to show empty state rather than spinning forever
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`/api/weather/${cityName}`);
      if (response && response.data) {
        setWeather(response.data);
      }
    } catch (err) {
      console.error('Weather error:', err);
    }
  };

  const toggleStar = (star) => {
    setSelectedStars(prev => 
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const toggleFilter = (id, list, setList) => {
    setList(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredHotels = useMemo(() => {
    let result = [...hotels];

    // Name Filter
    if (searchName) {
      result = result.filter(h => h.name.toLowerCase().includes(searchName.toLowerCase()));
    }

    // Price Filter
    result = result.filter(h => (parseFloat(h.price) || 0) <= priceRange);

    // Stars Filter
    if (selectedStars.length > 0) {
      result = result.filter(h => selectedStars.includes(Math.floor(parseFloat(h.stars) || 0)));
    }

    // Guest Rating Filter
    if (selectedGuestRating) {
      result = result.filter(h => (parseFloat(h.rating) || 0) >= selectedGuestRating);
    }

    // Distance Filter
    result = result.filter(h => {
      const distStr = h.distance ? String(h.distance) : "0";
      const distNum = parseFloat(distStr.replace(/[^\d.]/g, '')) || 0;
      return distNum <= maxDistance;
    });

    // Features Filter (Amenities)
    if (selectedAmenities.length > 0) {
      result = result.filter(h => 
        h.features && selectedAmenities.some(amenity => h.features.includes(amenity))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // recommended (no explicit sort, or by a complex algorithm)
        break;
    }

    return result;
  }, [hotels, searchName, priceRange, selectedStars, selectedAmenities, sortBy]);

  const getWeatherIcon = (iconCode) => {
    if (!iconCode) return <Sun className="w-5 h-5 text-yellow-500" />;
    if (iconCode.includes('d') || iconCode.includes('n')) { // Simple check for openweathermap/openmeteo icons
      if (iconCode.includes('01') || iconCode.includes('02')) return <Sun className="w-5 h-5 text-yellow-500" />;
      if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className="w-5 h-5 text-blue-400" />;
      if (iconCode.includes('11')) return <CloudRain className="w-5 h-5 text-slate-600" />;
      if (iconCode.includes('13')) return <Snowflake className="w-5 h-5 text-sky-300" />;
      if (iconCode.includes('50')) return <Wind className="w-5 h-5 text-slate-400" />;
    }
    return <Cloud className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] font-cairo pt-20" dir="rtl">
      
      {/* Breadcrumb & Mini Search Header */}
      <div className="bg-[#071428] text-white py-6 border-b border-white/10 shadow-md">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center text-sm text-slate-300 mb-4">
            <Link to="/" className="hover:text-[#C9A227] transition-colors">الرئيسية</Link>
            <span className="mx-2">/</span>
            <span className="text-white">إقامات</span>
            <span className="mx-2">/</span>
            <span className="text-white font-bold">{cityName}</span>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#C9A227]/20 p-2.5 rounded-xl">
                  <MapPin className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">الوجهة</div>
                  <div className="font-bold text-lg">{cityName}</div>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-10 bg-white/10"></div>
              
              <div className="flex items-center gap-3">
                <div className="bg-[#C9A227]/20 p-2.5 rounded-xl">
                  <Calendar className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">التواريخ</div>
                  <div className="font-bold text-sm">{checkIn || 'اليوم'} <span className="text-slate-500 mx-1">إلى</span> {checkOut || 'غداً'}</div>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-white/10"></div>

              <div className="flex items-center gap-3">
                <div className="bg-[#C9A227]/20 p-2.5 rounded-xl">
                  <Users className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">الضيوف والغرف</div>
                  <div className="font-bold text-sm">{adults} ضيوف، 1 غرفة</div>
                </div>
              </div>
            </div>
            <button className="bg-[#C9A227] hover:bg-[#B8911F] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#C9A227]/20 hover:shadow-[#C9A227]/40 w-full md:w-auto">
              تعديل البحث
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center justify-center gap-2 w-full bg-white py-3 rounded-xl shadow-sm border border-slate-200 font-bold text-[#071428]"
          >
            <SlidersHorizontal className="w-5 h-5" />
            تصفية النتائج
          </button>

          {/* Sidebar Filters */}
          <div className={`
            fixed inset-0 z-50 lg:static lg:z-auto lg:block lg:w-64 shrink-0 bg-black/50 lg:bg-transparent
            ${showMobileFilters ? 'block' : 'hidden'}
          `}>
            <div className="absolute lg:relative right-0 top-0 bottom-0 lg:bottom-auto w-80 lg:w-full bg-[#f5f7fa] lg:bg-transparent overflow-y-auto lg:overflow-visible h-full lg:h-auto">
              
              {/* Mobile Header */}
              <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
                <h3 className="font-bold text-lg">تصفية النتائج</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 lg:p-0 space-y-4">
                {/* Map Mini View */}
                <div 
                  className="bg-slate-100 rounded-2xl shadow-sm overflow-hidden border border-slate-200 cursor-pointer relative group transition-all hover:shadow-md h-32"
                  onClick={() => setShowMapModal(true)}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80")' }}
                  ></div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white/95 backdrop-blur-sm text-[#071428] px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg group-hover:bg-[#C9A227] group-hover:text-white transition-all flex items-center gap-2">
                        <Map className="w-5 h-5" />
                        عرض على الخريطة
                    </button>
                  </div>
                </div>

                {/* Weather Mini Widget */}
                {weather && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#071428] text-sm mb-1">الطقس في {cityName}</h4>
                      <div className="text-xs text-slate-500">{weather.condition}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(weather.icon)}
                      <span className="text-xl font-bold text-[#071428]" dir="ltr">{weather.temp}°C</span>
                    </div>
                  </div>
                )}

                {/* Search by Name */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h4 className="font-bold text-[#071428] mb-3 text-sm">البحث بالاسم</h4>
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="ابحث عن اسم فندق..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pr-9 pl-3 text-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h4 className="font-bold text-[#071428] mb-3 text-sm flex justify-between">
                    <span>السعر لليلة</span>
                    <span className="text-xs text-[#C9A227]">حتى {priceRange} ﷼</span>
                  </h4>
                  <input 
                    type="range" 
                    min="100" 
                    max="10000" 
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#C9A227]"
                    dir="ltr"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>100 ﷼</span>
                    <span>10,000+ ﷼</span>
                  </div>
                </div>

                {/* Star Rating Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h4 className="font-bold text-[#071428] mb-3 text-sm">تصنيف النجوم</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(star => (
                      <label key={star} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          selectedStars.includes(star) 
                            ? 'bg-[#C9A227] border-[#C9A227]' 
                            : 'border-slate-300 group-hover:border-[#C9A227]'
                        }`}>
                          {selectedStars.includes(star) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex gap-1">
                          {[...Array(star)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#f5a623] text-[#f5a623]" />
                          ))}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Property Type Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h4 className="font-bold text-[#071428] mb-3 text-sm">نوع مكان الإقامة</h4>
                  <div className="space-y-2">
                    {propertyTypes.map(type => (
                      <label key={type.id} className="flex items-center gap-3 cursor-pointer group text-sm">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          selectedPropertyTypes.includes(type.id) 
                            ? 'bg-[#071428] border-[#071428]' 
                            : 'border-slate-300 group-hover:border-[#071428]'
                        }`}>
                          {selectedPropertyTypes.includes(type.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-slate-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h4 className="font-bold text-[#071428] mb-3 text-sm">المرافق</h4>
                  <div className="space-y-2">
                    {amenitiesFilters.map(amenity => (
                      <label key={amenity.id} className="flex items-center gap-3 cursor-pointer group text-sm">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          selectedAmenities.includes(amenity.id) 
                            ? 'bg-[#071428] border-[#071428]' 
                            : 'border-slate-300 group-hover:border-[#071428]'
                        }`}>
                          {selectedAmenities.includes(amenity.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={selectedAmenities.includes(amenity.id)}
                          onChange={() => toggleFilter(amenity.id, selectedAmenities, setSelectedAmenities)} 
                        />
                        <span className="text-slate-700">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Guest Rating Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h4 className="font-bold text-[#071428] mb-3 text-sm">تقييم الضيوف</h4>
                  <div className="space-y-2">
                    {guestRatingOptions.map(rating => (
                      <label key={rating.id} className="flex items-center gap-3 cursor-pointer group text-sm">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          selectedGuestRating === rating.min 
                            ? 'border-[#071428]' 
                            : 'border-slate-300'
                        }`}>
                          {selectedGuestRating === rating.min && <div className="w-2 h-2 rounded-full bg-[#071428]" />}
                        </div>
                        <input 
                          type="radio" 
                          name="guestRating" 
                          className="hidden" 
                          checked={selectedGuestRating === rating.min}
                          onChange={() => setSelectedGuestRating(rating.min)} 
                        />
                        <span className="text-slate-700">{rating.label}</span>
                      </label>
                    ))}
                    {selectedGuestRating && (
                      <button 
                        onClick={() => setSelectedGuestRating(null)}
                        className="text-xs text-red-500 hover:text-red-600 mt-2 block"
                      >
                        إلغاء التحديد
                      </button>
                    )}
                  </div>
                </div>

                {/* Distance Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h4 className="font-bold text-[#071428] mb-3 text-sm flex justify-between">
                    <span>المسافة من المركز</span>
                    <span className="text-xs text-[#C9A227]">{maxDistance} كم</span>
                  </h4>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    step="1"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full accent-[#C9A227]"
                    dir="ltr"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>1 كم</span>
                    <span>50 كم</span>
                  </div>
                </div>

                {/* Traveler Type Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h4 className="font-bold text-[#071428] mb-3 text-sm">نوع المسافر</h4>
                  <div className="space-y-2">
                    {travelerTypes.map(type => (
                      <label key={type.id} className="flex items-center gap-3 cursor-pointer group text-sm">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          selectedTravelerTypes.includes(type.id) 
                            ? 'bg-[#071428] border-[#071428]' 
                            : 'border-slate-300 group-hover:border-[#071428]'
                        }`}>
                          {selectedTravelerTypes.includes(type.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={selectedTravelerTypes.includes(type.id)}
                          onChange={() => toggleFilter(type.id, selectedTravelerTypes, setSelectedTravelerTypes)} 
                        />
                        <span className="text-slate-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Main Content (Results) */}
          <div className="flex-1">
            
            {/* Results Header & Sorting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#071428]">
                  {cityName}: تم العثور على {filteredHotels.length} مكان إقامة
                </h2>
                <p className="text-sm text-slate-500 mt-1">الأسعار تشمل الضرائب والرسوم</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 font-bold whitespace-nowrap">ترتيب حسب:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm font-bold text-[#071428] focus:outline-none focus:border-[#C9A227] min-w-[160px] cursor-pointer"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Results List */}
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((index) => (
                  <HotelCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center text-center border border-red-100">
                <AlertCircle className="w-12 h-12 mb-3 text-red-400" />
                <p className="font-bold mb-2">{error}</p>
                <button 
                  onClick={fetchHotels}
                  className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  حاول مرة أخرى
                </button>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center">
                <Search className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-[#071428] mb-2">لم نجد أي فنادق مطابقة</h3>
                <p className="text-slate-500">حاول تغيير الفلاتر المحددة أو توسيع نطاق البحث</p>
                <button 
                  onClick={() => {
                    setPriceRange(10000);
                    setSelectedStars([]);
                    setSelectedAmenities([]);
                    setSearchName('');
                  }}
                  className="mt-6 text-[#C9A227] font-bold hover:underline"
                >
                  مسح جميع الفلاتر
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHotels.map(hotel => (
                  <HotelResultCard key={hotel.hotelId} hotel={hotel} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg text-[#071428]">الخريطة - فنادق {cityName}</h3>
              <button onClick={() => setShowMapModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 relative bg-slate-100">
              {/* Replace with actual map component */}
              <LeafletMap 
                hotels={filteredHotels} 
                center={filteredHotels.length > 0 && filteredHotels[0].latitude 
                  ? [filteredHotels[0].latitude, filteredHotels[0].longitude] 
                  : [24.7136, 46.6753]} 
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SearchResults;

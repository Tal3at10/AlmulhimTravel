import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Star, MapPin, Check, Heart, Map as MapIcon, Share2, Info, ChevronRight, ChevronLeft, Calendar, ArrowRight, X } from 'lucide-react';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import apiService from '../services/api.service';
import LeafletMap from '../components/hotels/LeafletMap';

const HotelDetails = () => {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Selected Room/Rate Plan state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRatePlan, setSelectedRatePlan] = useState(null);

  const [roomFilter, setRoomFilter] = useState('all');
  const roomFilterOptions = [
    { id: 'all', label: 'الكل' },
    { id: 'bb', label: 'فطور ومبيت' },
    { id: 'halfboard', label: 'نصف إقامة' },
    { id: 'roomonly', label: 'غرفة فقط' },
    { id: 'refundable', label: 'قابل للاسترداد' },
    { id: 'nonrefundable', label: 'غير قابل للاسترداد' },
  ];

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const adults = searchParams.get('adults') || '2';
  const provider = searchParams.get('provider') || 'Amadeus';

  useEffect(() => {
    fetchHotelDetails();
    fetchHotelRooms();
  }, [hotelId, checkIn, checkOut, adults, provider]);

  const fetchHotelDetails = async () => {
    try {
      const res = await apiService.hotels.getById(hotelId, { provider, checkIn, checkOut, adults });
      if (res.success) {
        setHotel(res.data);
      } else {
        setError('فشل في جلب تفاصيل الفندق');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل التفاصيل');
    }
  };

  const fetchHotelRooms = async () => {
    try {
      const res = await apiService.hotels.getRooms(hotelId, { provider, checkIn, checkOut, adults });
      if (res.success) {
        setRooms(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = () => {
    if (!selectedRoom || !selectedRatePlan) return;
    
    // Navigate to checkout with selected data
    navigate('/checkout', {
      state: {
        hotel,
        room: selectedRoom,
        ratePlan: selectedRatePlan,
        searchParams: { checkIn, checkOut, adults }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#f5f7fa]">
        <LoadingSpinner size="lg" color="#C9A227" />
        <p className="mt-4 font-bold text-[#071428]">جاري تحميل تفاصيل الفندق...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-[#f5f7fa]">
        <p className="text-xl font-bold text-red-600 mb-4">{error || 'الفندق غير موجود'}</p>
        <button onClick={() => navigate(-1)} className="text-[#C9A227] font-bold underline">العودة للنتائج</button>
      </div>
    );
  }

  const images = hotel.images?.length > 0 ? hotel.images : ['https://via.placeholder.com/800x600?text=No+Image'];

  return (
    <div className="min-h-screen bg-[#f5f7fa] font-cairo pt-20" dir="rtl">
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-slate-500">
          <Link to="/" className="hover:text-[#071428] transition-colors">الرئيسية</Link>
          <span className="mx-2">/</span>
          <Link to="/hotels" className="hover:text-[#071428] transition-colors">إقامات</Link>
          <span className="mx-2">/</span>
          <span className="font-bold text-[#071428]">{hotel.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Content (Right Side) */}
          <div className="flex-1 lg:w-2/3">
            
            {/* Header: Name, Rating, Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">فندق</span>
                    <div className="flex gap-0.5">
                      {[...Array(Math.floor(hotel.stars || 4))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#f5a623] text-[#f5a623]" />
                      ))}
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#071428] mb-2">{hotel.name}</h1>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.address || hotel.location}</span>
                    <button className="text-[#C9A227] font-bold hover:underline">عرض على الخريطة</button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <Share2 className="w-5 h-5 text-slate-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <Heart className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6 h-[400px] rounded-2xl overflow-hidden cursor-pointer" onClick={() => setShowGalleryModal(true)}>
              <div className="md:col-span-3 h-[400px]">
                <img src={images[0]} alt="Main" className="w-full h-full object-cover hover:opacity-95 transition-opacity" />
              </div>
              <div className="hidden md:flex flex-col gap-2 h-[400px]">
                {images.slice(1, 3).map((img, idx) => (
                  <div key={idx} className="h-[130px]">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:opacity-95 transition-opacity" />
                  </div>
                ))}
                <div className="h-[130px] relative">
                  <img src={images[3] || images[0]} alt="More" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/60 transition-colors">
                    <span className="text-white font-bold text-lg">+{images.length} صور</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Ratings Box */}
            <div className="bg-white rounded-2xl border p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">تقييمات الضيوف</h3>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Rating Left Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl font-extrabold text-[#071428]">{hotel.rating?.toFixed(1) || '4.0'}</div>
                    <div>
                      <div className="font-bold">{hotel.ratingText || 'جيد جداً'}</div>
                      <div className="text-xs text-slate-500">بناءً على {hotel.reviewCount} تقييم</div>
                    </div>
                  </div>
                  {/* Rating Bars (5 to 1) */}
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-3 mb-2">
                      <span className="text-sm w-4">{star}</span>
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#071428] rounded-full" style={{ width: `${hotel.ratingDistribution?.[star] || (star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2)}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 w-10">{hotel.ratingDistribution?.[star] || (star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2)}%</span>
                    </div>
                  ))}
                </div>
                {/* Detailed Ratings Right Side */}
                <div className="flex-1 border-t md:border-t-0 md:border-r border-slate-200 pt-6 md:pt-0 md:pr-6">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {[
                      { label: 'الموقع', value: hotel.locationRating || 4.5 },
                      { label: 'الراحة', value: hotel.comfortRating || 4.0 },
                      { label: 'الإفطار', value: hotel.breakfastRating || 3.5 },
                      { label: 'الغرفة', value: hotel.roomRating || 3.8 },
                    ].map(item => (
                      <div key={item.label} className="text-center flex flex-col justify-center bg-slate-50 rounded-xl p-3">
                        <div className="text-2xl font-extrabold text-[#071428]">{item.value}</div>
                        <div className="text-[10px] text-slate-500">/5</div>
                        <div className="text-xs font-bold mt-1">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Info & Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
              <h3 className="text-xl font-bold text-[#071428] mb-4">عن الفندق</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {hotel.description || 'فندق متميز يوفر إقامة مريحة ومرافق عصرية تناسب جميع المسافرين.'}
              </p>

              <h4 className="font-bold text-[#071428] mb-3">أهم المرافق</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 mb-6">
                {hotel.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6" id="rooms">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#071428]">الغرف المتاحة</h3>
                
                {/* Dates Edit Mini-bar */}
                <div className="hidden md:flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-sm px-2">
                    <Calendar className="w-4 h-4 text-[#C9A227]" />
                    <span className="font-bold">{checkIn}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="font-bold">{checkOut}</span>
                  </div>
                  <button className="bg-[#071428] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#1a2b49] transition-colors">تعديل</button>
                </div>
              </div>

              {/* Room Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {roomFilterOptions.map(opt => (
                  <button key={opt.id}
                    onClick={() => setRoomFilter(opt.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                      roomFilter === opt.id
                        ? 'bg-[#071428] text-white border-[#071428]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#C9A227]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {rooms.length === 0 ? (
                <div className="text-center py-8 text-slate-500">لا توجد غرف متاحة في هذه التواريخ</div>
              ) : (
                <div className="space-y-6">
                  {rooms.map(room => (
                    <div key={room.roomId} className="border border-slate-200 rounded-2xl overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {/* Room Info Left/Right depending on dir */}
                        <div className="md:w-1/3 bg-slate-50 p-4 border-b md:border-b-0 md:border-l border-slate-200">
                          <img src={room.images?.[0] || images[0]} alt={room.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                          <h4 className="font-bold text-[#071428] text-lg mb-2">{room.name}</h4>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-3">
                            <span className="bg-white px-2 py-1 rounded border border-slate-200">{room.size}</span>
                            <span className="bg-white px-2 py-1 rounded border border-slate-200">{room.bedType}</span>
                            <span className="bg-white px-2 py-1 rounded border border-slate-200">لحد {room.maxGuests} ضيوف</span>
                          </div>
                          <div className="space-y-1">
                            {room.amenities?.slice(0, 4).map((am, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                                <Check className="w-3 h-3 text-green-500" />
                                <span>{am}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rate Plans */}
                        <div className="md:w-2/3 divide-y divide-slate-100">
                          {room.ratePlans?.map(rate => (
                            <div key={rate.rateId} className="p-4 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 hover:bg-slate-50 transition-colors">
                              <div className="flex-1 w-full">
                                <h5 className="font-bold text-[#071428] mb-1">{rate.name}</h5>
                                <div className="text-sm text-slate-600 mb-2">
                                  {rate.boardType === 'BREAKFAST' ? '✅ شامل الإفطار' : '❌ بدون وجبات'}
                                </div>
                                <div className="text-xs font-bold text-green-600 mb-1">
                                  {rate.isRefundable ? rate.cancellationPolicy : 'غير قابل للاسترداد'}
                                </div>
                              </div>
                              <div className="text-left w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
                                <div className="text-right">
                                  {rate.discountPercentage > 0 && (
                                    <div className="text-xs text-slate-400 line-through mb-0.5">{rate.originalPrice} {hotel.currency}</div>
                                  )}
                                  <div className="text-xl font-extrabold text-[#071428]">{rate.price} {hotel.currency}</div>
                                  <div className="text-[10px] text-slate-500">شامل الضرائب لـ 1 ليلة</div>
                                </div>
                                <button 
                                  onClick={() => {
                                    setSelectedRoom(room);
                                    setSelectedRatePlan(rate);
                                    // Smooth scroll to top/sidebar on mobile maybe
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className={`mt-2 px-6 py-2 rounded-xl font-bold text-sm transition-colors ${
                                    selectedRatePlan?.rateId === rate.rateId 
                                      ? 'bg-green-500 text-white shadow-md' 
                                      : 'bg-white border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white'
                                  }`}
                                >
                                  {selectedRatePlan?.rateId === rate.rateId ? 'تم الاختيار' : 'اختيار'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sticky Sidebar (Left Side) */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              
              {/* Guest Ratings Panel */}
              <div className="bg-[#071428] text-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
                  <div>
                    <div className="text-4xl font-extrabold mb-1">{hotel.rating?.toFixed(1) || '0.0'}</div>
                    <div className="font-bold text-[#C9A227]">{hotel.ratingText || 'جيد'}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-slate-300">مبني على</div>
                    <div className="font-bold">{hotel.reviewCount} تقييم حقيقي</div>
                  </div>
                </div>
                
                {/* Mocked Ratings Breakdown matching Almatar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">الموقع</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden"><div className="bg-[#C9A227] w-[95%] h-full"></div></div>
                      <span className="font-bold w-6">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">النظافة</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden"><div className="bg-[#C9A227] w-[90%] h-full"></div></div>
                      <span className="font-bold w-6">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">الراحة</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden"><div className="bg-[#C9A227] w-[88%] h-full"></div></div>
                      <span className="font-bold w-6">4.4</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Widget */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer" onClick={() => window.open(`https://maps.google.com/?q=${hotel.latitude},${hotel.longitude}`)}>
                <div className="h-40 relative bg-slate-100">
                   {hotel.latitude && hotel.longitude ? (
                     <LeafletMap hotels={[hotel]} center={[hotel.latitude, hotel.longitude]} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400">الخريطة غير متوفرة</div>
                   )}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[400]">
                     <div className="bg-white/90 backdrop-blur text-[#071428] px-4 py-2 rounded-lg font-bold text-sm shadow-md flex items-center gap-2">
                       <MapIcon className="w-4 h-4" /> عرض الخريطة
                     </div>
                   </div>
                </div>
                <div className="p-4 text-sm text-slate-600 flex gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#C9A227]" />
                  <span>{hotel.address || hotel.location}</span>
                </div>
              </div>

              {/* Reservation Summary Widget */}
              <div className={`bg-white rounded-2xl shadow-lg border-2 transition-colors duration-300 ${selectedRatePlan ? 'border-[#C9A227]' : 'border-slate-200'} p-6`}>
                <h3 className="font-bold text-[#071428] text-lg mb-4">ملخص الحجز</h3>
                
                {selectedRoom && selectedRatePlan ? (
                  <>
                    <div className="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
                      <div className="font-bold text-sm mb-1">{selectedRoom.name}</div>
                      <div className="text-xs text-slate-500 mb-2">{selectedRatePlan.name} • {adults} ضيوف</div>
                      <div className="flex items-center gap-1 text-xs text-green-600 font-bold">
                        <Check className="w-3 h-3" /> {selectedRatePlan.cancellationPolicy}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-slate-600 font-bold text-sm">الإجمالي لـ 1 ليلة</span>
                      <div className="text-right">
                        {selectedRatePlan.discountPercentage > 0 && (
                           <div className="text-xs text-slate-400 line-through mb-0.5">{selectedRatePlan.originalPrice} {hotel.currency}</div>
                        )}
                        <span className="text-3xl font-extrabold text-[#071428]">{selectedRatePlan.price}</span>
                        <span className="text-sm font-bold text-[#071428] mr-1">{hotel.currency}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-6 text-left">شامل جميع الضرائب والرسوم</p>

                    <button 
                      onClick={handleReserve}
                      className="w-full bg-[#C9A227] hover:bg-[#B8911F] text-white font-bold py-3.5 rounded-xl shadow-md transition-colors text-lg flex items-center justify-center gap-2 group"
                    >
                      حجز الغرفة
                      <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-bold">الرجاء اختيار غرفة وخطة سعر من القائمة لإتمام الحجز</p>
                    <button onClick={() => document.getElementById('rooms')?.scrollIntoView({behavior: 'smooth'})} className="mt-4 text-[#C9A227] font-bold text-sm hover:underline">
                      عرض الغرف المتاحة
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="flex items-center justify-between p-4 text-white">
            <span className="font-bold">{currentImageIndex + 1} / {images.length}</span>
            <button onClick={() => setShowGalleryModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center">
            <button 
              onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <img src={images[currentImageIndex]} alt="Gallery view" className="max-h-full max-w-full object-contain" />
            <button 
              onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
          <div className="h-24 bg-black p-2 flex gap-2 overflow-x-auto">
            {images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 h-full aspect-video border-2 transition-colors ${currentImageIndex === idx ? 'border-[#C9A227]' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HotelDetails;

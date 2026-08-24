import React, { useState } from 'react';
import { Star, MapPin, Heart, ImageIcon } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const HotelResultCard = ({ hotel }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleBooking = (e) => {
    if (e) e.preventDefault();
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    const adults = searchParams.get('adults') || '2';
    
    navigate(`/hotel/${hotel.hotelId}?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&provider=${hotel.provider}`, { 
      state: { hotelName: hotel.name } 
    });
  };

  // Safe fallbacks for data
  const mainImage = hotel.mainImage || (hotel.images?.length > 0 ? hotel.images[0] : null);
  const stars = hotel.stars || 4;
  const ratingValue = hotel.rating ? hotel.rating.toFixed(1) : "0.0";
  const ratingText = hotel.ratingText || 'جيد';
  const reviewCount = hotel.reviewCount || 0;
  const price = hotel.price || 0;
  const originalPrice = hotel.originalPrice || price;
  const discount = hotel.discountPercentage || 0;
  const currency = hotel.currency || 'SAR';
  const location = hotel.location || 'المدينة';
  const distance = hotel.distance || 'مركز المدينة';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden mb-4">
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Right Side: Image Section */}
        <div className="relative md:w-[280px] md:h-auto h-[220px] flex-shrink-0 bg-slate-100 p-2">
          {mainImage ? (
            <img
              src={mainImage}
              alt={hotel.name}
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                if(e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`absolute inset-2 flex-col items-center justify-center text-slate-400 bg-slate-200 rounded-xl ${mainImage ? 'hidden' : 'flex'}`}
          >
            <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
          </div>
          <button
            onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600 font-medium'}`} />
          </button>
        </div>

        {/* Center: Info Section */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <Link to={`/hotel/${hotel.hotelId}`}>
                <h3 className="font-bold text-xl text-[#071428] hover:text-[#8b3dff] transition-colors line-clamp-1 mb-1">
                  {hotel.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">فندق</span>
                <div className="flex gap-0.5">
                  {[...Array(Math.floor(stars))].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#f5a623] text-[#f5a623]" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
            <span className="text-[#071428] font-bold">{location}</span>
            <span>|</span>
            <span className="line-clamp-1">{distance}</span>
          </div>

          {/* Badges/Highlights if available */}
          {hotel.badges && hotel.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {hotel.badges.map((badge, idx) => (
                <span key={idx} className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded">
                  {badge}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-auto pt-4 flex items-center gap-3">
             <div className="bg-[#071428] text-white text-sm font-bold px-2 py-1 rounded-lg">
                {ratingValue}
             </div>
             <span className="text-sm font-bold text-[#071428]">{ratingText}</span>
             <span className="text-xs text-slate-400 font-medium">{reviewCount} تقييم</span>
          </div>
        </div>

        {/* Left Side: Price & Action */}
        <div className="md:w-[240px] p-5 border-t md:border-t-0 md:border-r border-slate-100 flex flex-col justify-between items-end bg-[#fcfcfd]">
          
          <div className="w-full text-right">
            {discount > 0 && (
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-xs text-slate-400 font-medium line-through">
                  {originalPrice.toLocaleString()} {currency}
                </span>
                <span className="bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded text-[10px]">
                  {discount}% خصم
                </span>
              </div>
            )}
            <div className="flex items-baseline justify-end gap-1 mb-1 text-right" dir="rtl">
              <span className="text-sm font-bold text-[#071428] ml-1">الإجمالي</span>
              <span className="text-2xl font-extrabold text-[#071428]">{price.toLocaleString()}</span>
              <span className="text-sm font-bold text-[#071428] mr-1">{currency}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium text-right mb-4">شامل الضرائب والرسوم • {hotel.nights || 1} ليلة محددة</p>
          </div>

          <button 
            onClick={handleBooking}
            className="w-full bg-[#C9A227] hover:bg-[#B8911F] text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors text-sm"
          >
            عرض المتاح
          </button>
        </div>

      </div>
    </div>
  );
};

export default HotelResultCard;

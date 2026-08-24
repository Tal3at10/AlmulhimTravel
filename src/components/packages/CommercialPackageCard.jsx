import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Plane, Hotel, Star, ArrowLeft, Utensils, Car, Shield, Flame, Award, Sparkles } from 'lucide-react';
import { getOptimizedImageUrl, getOptimizedImageSrcSet } from '../../utils/image';
import useIsMobile from '../../hooks/useIsMobile';

const CommercialPackageCard = ({
  title,
  price,
  image,
  duration,
  packageId,
  features = [],
  rating = 4.5,
  isOffer = false,
  location,
  badgeText
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isMobile = useIsMobile();
  // Extract location from title or use provided
  const displayLocation = location || title;

  // Decide on a premium gold/navy badge dynamically if not explicitly provided
  let promoBadge = badgeText;
  let BadgeIcon = Award;
  let badgeColorClass = "bg-[#071428] text-[#C9A227] border border-[#C9A227]/30";

  if (!promoBadge) {
    if (isOffer) {
      promoBadge = "عرض مميز";
      BadgeIcon = Sparkles;
      badgeColorClass = "bg-[#C9A227] bg-gradient-to-r from-[#C9A227] to-[#DFBA44] text-[#071428] font-bold shadow-md shadow-amber-500/10 border-none";
    } else if (rating >= 4.8) {
      promoBadge = "الأكثر مبيعاً";
      BadgeIcon = Award;
      badgeColorClass = "bg-[#071428] bg-gradient-to-r from-[#071428] to-[#122846] text-[#C9A227] border border-[#C9A227]/40 shadow-lg";
    } else if (packageId % 3 === 0) {
      promoBadge = "VIP فاخر";
      BadgeIcon = Shield;
      badgeColorClass = "bg-[#C9A227] text-[#071428] font-extrabold border-none shadow-md shadow-amber-500/10";
    }
  }

  // Check features for standard travel components to display as icons
  const hasFlight = features.some(f => f.includes('طيران') || f.includes('Flight') || f.toLowerCase().includes('flight'));
  const hasHotel = features.some(f => f.includes('فندق') || f.includes('فنادق') || f.includes('Hotel') || f.includes('نجوم'));
  const hasBreakfast = features.some(f => f.includes('فطور') || f.includes('إفطار') || f.includes('فطار') || f.toLowerCase().includes('breakfast') || f.includes('وجبات'));
  const hasTransfers = features.some(f => f.includes('مواصلات') || f.includes('نقل') || f.includes('توصيل') || f.toLowerCase().includes('transfer') || f.includes('سيار'));

  return (
    <Link to={`/package/${packageId}`} className="block h-full">
      <motion.div
        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300 group h-full flex flex-col hover:border-[#C9A227] hover:shadow-[0_12px_30px_rgba(201,162,39,0.12)]"
        whileHover={isMobile ? undefined : { y: -6 }}
      >
        {/* Image Section - Top 50% */}
        <div className="relative h-48 overflow-hidden bg-slate-900">
          {/* Image Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center z-[5]">
              <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-[#C9A227] animate-spin" />
            </div>
          )}
          <img
            src={getOptimizedImageUrl(image, 800, 70) || '/tourism.jpg'}
            srcSet={image ? getOptimizedImageSrcSet(image, [400, 800, 1200], 70) : undefined}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 400px"
            alt={title}
            width={400}
            height={300}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 brightness-95 group-hover:brightness-100 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/tourism.jpg';
              setImageLoaded(true);
            }}
          />

          {/* Premium Badge - Top Right */}
          {promoBadge && (
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold ${badgeColorClass} z-10`}>
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{promoBadge}</span>
            </div>
          )}

          {/* Rating Badge - Top Left */}
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm text-white">
            <Star className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
            <span className="text-xs font-bold">{rating}</span>
          </div>

          {/* Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        </div>

        {/* Details Section - Bottom 50% */}
        <div className="p-5 flex flex-col flex-1">
          {/* Location */}
          <div className="flex items-center gap-1 text-slate-500 text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="truncate flex-1">{displayLocation}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-[#071428] mb-3 line-clamp-2 group-hover:text-[#C9A227] transition-colors leading-snug">
            {title}
          </h3>

          {/* Inclusions & Duration In a row */}
          <div className="flex items-center justify-between bg-slate-50/80 rounded-lg px-3 py-2 mb-4 border border-slate-100/60">
            <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>{duration}</span>
            </div>
            
            {/* Inclusions Icon Group */}
            <div className="flex items-center gap-2 text-slate-400">
              {hasFlight && (
                <div className="group/icon relative" title="شامل الطيران">
                  <Plane className="w-3.5 h-3.5 text-slate-600 hover:text-[#C9A227] transition-colors" />
                </div>
              )}
              {hasHotel && (
                <div className="group/icon relative" title="إقامة فندقية">
                  <Hotel className="w-3.5 h-3.5 text-slate-600 hover:text-[#C9A227] transition-colors" />
                </div>
              )}
              {hasBreakfast && (
                <div className="group/icon relative" title="شامل الإفطار">
                  <Utensils className="w-3.5 h-3.5 text-slate-600 hover:text-[#C9A227] transition-colors" />
                </div>
              )}
              {hasTransfers && (
                <div className="group/icon relative" title="شامل المواصلات">
                  <Car className="w-3.5 h-3.5 text-slate-600 hover:text-[#C9A227] transition-colors" />
                </div>
              )}
            </div>
          </div>

          {/* Features Chips (Cleaned up text fallback) */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {features.slice(0, 3).map((feat, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-medium truncate max-w-full">
                  {feat}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-dashed border-slate-200 mt-auto pt-4"></div>

          {/* Price & Action Footer */}
          <div className="flex items-center justify-between">
            {/* Price */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">يبدأ من</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-[#071428] group-hover:text-[#C9A227] transition-colors">{price}</span>
                <span className="text-xs font-bold text-[#C9A227]">ر.س</span>
              </div>
            </div>

            {/* Action Button */}
            <motion.div
              className="flex items-center justify-center w-9 h-9 bg-[#071428] text-white rounded-full group-hover:bg-[#C9A227] group-hover:text-[#071428] transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4.5 h-4.5 transform group-hover:-translate-x-0.5 transition-transform" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CommercialPackageCard;

import { motion } from 'framer-motion';
import { Plane, Clock, ArrowLeft } from 'lucide-react';

const FlightCard = ({ flight, onSelect }) => {
  const {
    airline,
    airlineLogo,
    departureTime,
    departureCode,
    departureCity,
    arrivalTime,
    arrivalCode,
    arrivalCity,
    duration,
    stops,
    stopCity,
    price,
    originalPrice,
    isCheapest,
    isFastest,
  } = flight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-slate-100 relative overflow-hidden"
    >
      {/* Badges */}
      <div className="absolute top-0 right-0 flex flex-row-reverse gap-1 rounded-bl-xl overflow-hidden z-10">
        {isCheapest && (
          <div className="bg-green-500 text-white text-xs font-bold px-3 py-1">الأرخص 💰</div>
        )}
        {isFastest && (
          <div className="bg-[#071428] text-white text-xs font-bold px-3 py-1">الأسرع ⚡</div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-6 mt-2">
        {/* Airline Info */}
        <div className="flex items-center gap-4 lg:w-40 flex-shrink-0">
          <img
            src={airlineLogo}
            alt={airline}
            className="w-12 h-12 object-contain rounded-lg"
          />
          <div>
            <p className="font-semibold text-[#071428]">{airline}</p>
            <p className="text-xs text-slate-600 font-medium">رحلة مباشرة</p>
          </div>
        </div>

        {/* Flight Journey - Center */}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            {/* Departure */}
            <div className="text-center">
              <p className="text-2xl font-bold text-[#071428]">{departureTime}</p>
              <p className="text-lg font-semibold text-slate-600">{departureCode}</p>
              <p className="text-sm text-slate-600 font-medium">{departureCity}</p>
            </div>

            {/* Journey Line */}
            <div className="flex-1 relative px-4">
              <div className="flex items-center">
                {/* Line */}
                <div className="flex-1 h-[2px] bg-slate-200 relative">
                  {/* Plane Icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1">
                    <Plane className="w-5 h-5 text-[#C9A227] rotate-180" />
                  </div>
                </div>
              </div>
              
              {/* Stop Indicator */}
              {stops > 0 && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#C9A227]"></div>
                  <span className="text-xs text-slate-700 font-medium">
                    {stops === 1 ? 'توقف واحد' : `${stops} توقفات`}
                    {stopCity && ` (${stopCity})`}
                  </span>
                </div>
              )}
              
              {/* Duration */}
              <div className="flex items-center justify-center gap-1 mt-1">
                <Clock className="w-4 h-4 text-slate-600 font-medium" />
                <span className="text-sm text-slate-700 font-medium">{duration}</span>
                {stops === 0 && (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full mr-2">
                    مباشرة
                  </span>
                )}
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <p className="text-2xl font-bold text-[#071428]">{arrivalTime}</p>
              <p className="text-lg font-semibold text-slate-600">{arrivalCode}</p>
              <p className="text-sm text-slate-600 font-medium">{arrivalCity}</p>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex flex-col items-center lg:items-end gap-2 lg:w-44 flex-shrink-0 border-t lg:border-t-0 lg:border-r border-slate-100 pt-4 lg:pt-0 lg:pr-6">
          {originalPrice && (
            <p className="text-sm text-slate-600 font-medium line-through">{originalPrice.toLocaleString()} ر.س</p>
          )}
          <p className="text-2xl font-bold text-[#071428]">
            {price.toLocaleString()} <span className="text-sm font-normal text-slate-700 font-medium">ر.س</span>
          </p>
          <p className="text-xs text-slate-600 font-medium">للشخص الواحد</p>
          <button
            onClick={() => onSelect?.(flight)}
            className="btn-primary w-full lg:w-auto px-6 py-2 text-sm flex flex-nowrap items-center justify-center gap-2 mt-2"
          >
            <span className="whitespace-nowrap shrink-0">اختر الرحلة</span>
            <ArrowLeft className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Star } from 'lucide-react';

const BeforeAfterSlider = ({ hotel }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current || !isDragging.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="relative">
      {/* Hotel Info */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{hotel.name}</h3>
        <p className="text-slate-700 font-medium">{hotel.location}</p>
        <div className="flex justify-center gap-1 mt-2">
          {[...Array(hotel.stars)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#C9A227] text-[#C9A227]" />
          ))}
        </div>
      </div>

      {/* Slider Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-2xl touch-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* Night Image (Background) */}
        <img
          src={hotel.nightImageUrl}
          alt={`${hotel.name} - Night`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Day Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={hotel.dayImageUrl}
            alt={`${hotel.name} - Day`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
          />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Handle Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
            <div className="flex gap-1">
              <Sun className="w-4 h-4 text-[#C9A227]" />
              <Moon className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
          <Sun className="w-5 h-5 text-[#C9A227]" />
          <span className="text-sm font-semibold">نهاراً</span>
        </div>
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
          <Moon className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold text-white">ليلاً</span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-slate-700 font-medium mt-4 text-sm">
        اسحب المؤشر لمشاهدة الفندق نهاراً وليلاً
      </p>
    </div>
  );
};

export default BeforeAfterSlider;

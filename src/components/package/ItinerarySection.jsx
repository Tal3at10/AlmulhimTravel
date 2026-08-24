import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/image';
import useIsMobile from '../../hooks/useIsMobile';

const DayCard = ({ day, index, isActive, onClick, isMobile }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      data-day-index={index}
      initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      animate={isMobile ? { opacity: 1, x: 0 } : (isInView ? { opacity: 1, x: 0 } : {})}
      transition={isMobile ? { duration: 0 } : { duration: 0.5 }}
      onClick={onClick}
      className={`relative cursor-pointer p-6 rounded-2xl transition-all duration-300 ${isActive
          ? 'bg-white shadow-xl border-r-4 border-[#C9A227]'
          : 'bg-white/50 hover:bg-white hover:shadow-lg'
        }`}
    >
      {/* Day Number */}
      <div className="flex items-center gap-4 mb-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isActive
              ? 'bg-[#C9A227] text-white'
              : 'bg-slate-100 text-slate-600'
            }`}
        >
          {day.day}
        </div>
        <div>
          <span className="text-sm text-slate-700 font-medium flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            اليوم {day.day}
          </span>
          <h3 className="font-bold text-[#C9A227] text-lg">{day.title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-700 leading-relaxed font-medium pr-0 sm:pr-16">{day.desc}</p>
    </motion.div>
  );
};

const ItinerarySection = ({ itinerary }) => {
  const [activeDay, setActiveDay] = useState(0);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();

  // Stable scroll-spy: observe cards without layout shift
  // Cards have NO images inside them, so their height is constant.
  // This prevents the infinite feedback loop that caused flickering.
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024 || !itinerary || itinerary.length === 0) return;

    let debounceTimer = null;

    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        let bestRatio = 0;

        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            best = entry;
          }
        });

        if (best) {
          const idx = Number(best.target.dataset.dayIndex);
          if (!isNaN(idx)) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
              setActiveDay(prev => prev !== idx ? idx : prev);
            }, 150);
          }
        }
      },
      {
        threshold: [0.3, 0.5, 0.7, 1.0],
        rootMargin: '-35% 0px -35% 0px'
      }
    );

    const initTimer = setTimeout(() => {
      if (containerRef.current) {
        const cards = containerRef.current.querySelectorAll('[data-day-index]');
        cards.forEach(card => observer.observe(card));
      }
    }, 200);

    return () => {
      observer.disconnect();
      clearTimeout(debounceTimer);
      clearTimeout(initTimer);
    };
  }, [itinerary]);

  // Handle empty or invalid itinerary
  if (!itinerary || itinerary.length === 0) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-800 mb-4">
              برنامج الرحلة
            </h2>
            <p className="text-slate-600 font-medium">لا يوجد برنامج متاح لهذه الباقة حالياً</p>
          </div>
        </div>
      </section>
    );
  }

  // Transform API data to component format
  const transformedItinerary = itinerary.map(item => ({
    day: item.day,
    title: item.title,
    desc: item.description || '',
    image: getOptimizedImageUrl(item.imageUrl || '/placeholder-itinerary.jpg', 800, 75),
    coordinates: {
      lat: item.latitude || 0,
      lng: item.longitude || 0
    }
  }));

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-slate-800 mb-4">
            برنامج الرحلة
          </h2>
          <div className="w-20 h-1 bg-[#C9A227] mx-auto" />
        </motion.div>

        {/* Mobile Layout: Sticky image on top + scrollable cards below */}
        <div className="lg:hidden" ref={containerRef}>
          {/* Sticky image container — height is fixed, never changes card positions */}
          <div className="sticky top-[80px] z-10 mb-4 pt-2 pb-4 bg-slate-50">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.15)] aspect-[16/9] bg-slate-200">
              {transformedItinerary.map((day, index) => (
                Math.abs(activeDay - index) <= 1 ? (
                  <img
                    key={day.day}
                    src={day.image}
                    alt={day.title}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      activeDay === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ) : null
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 right-4 text-white">
                <span className="text-[#C9A227] text-xs font-semibold">
                  اليوم {transformedItinerary[activeDay]?.day}
                </span>
                <h4 className="text-lg font-bold mt-1 text-[#C9A227]">
                  {transformedItinerary[activeDay]?.title}
                </h4>
              </div>
            </div>
          </div>

          {/* Day cards — NO images inside, height is constant */}
          <div className="space-y-4">
            {transformedItinerary.map((day, index) => (
              <DayCard
                key={day.day}
                day={day}
                index={index}
                isActive={activeDay === index}
                onClick={() => setActiveDay(index)}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Desktop Layout: Side-by-side (unchanged) */}
        <div className="hidden lg:flex flex-row gap-8">
          {/* Left - Timeline Cards */}
          <div className="lg:w-1/2 space-y-4">
            {transformedItinerary.map((day, index) => (
              <DayCard
                key={day.day}
                day={day}
                index={index}
                isActive={activeDay === index}
                onClick={() => setActiveDay(index)}
              />
            ))}
          </div>

          {/* Right - Sticky Image/Map */}
          <div className="lg:w-1/2">
            <div className="lg:sticky lg:top-[100px]">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src={transformedItinerary[activeDay].image}
                  alt={transformedItinerary[activeDay].title}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />

                {/* Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-[#C9A227] text-sm font-semibold">
                    اليوم {transformedItinerary[activeDay].day}
                  </span>
                  <h3 className="text-white text-2xl font-bold mt-2">
                    {transformedItinerary[activeDay].title}
                  </h3>
                </div>

                {/* SVG Path Line */}
                <svg
                  className="absolute top-4 right-4 w-32 h-32 opacity-30"
                  viewBox="0 0 100 100"
                >
                  <motion.path
                    d="M10,50 Q30,20 50,50 T90,50"
                    fill="none"
                    stroke="#C9A227"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                  <circle cx="90" cy="50" r="4" fill="#C9A227" />
                </svg>
              </motion.div>

              {/* Day Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {transformedItinerary.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDay(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${activeDay === index
                        ? 'bg-[#C9A227] w-8'
                        : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItinerarySection;

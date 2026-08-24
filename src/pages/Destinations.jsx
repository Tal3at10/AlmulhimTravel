import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEO from '../components/ui/SEO';
import apiService from '../services/api.service';
import { getOptimizedImageUrl, getOptimizedImageSrcSet } from '../utils/image';

// Destination Card Component
const DestinationCard = ({ destination, index }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate(`/destinations?destName=${encodeURIComponent(destination.nameAr)}`);
  };

  return (
    <motion.div
      className="w-full aspect-[4/5] relative rounded-3xl overflow-hidden cursor-pointer group shadow-lg shadow-black/20 border border-white/5"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onClick={handleExplore}
      whileHover={{ y: -6 }}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={getOptimizedImageUrl(destination.imageUrl, 600, 75) || '/tourism.jpg'}
          srcSet={destination.imageUrl ? getOptimizedImageSrcSet(destination.imageUrl, [360, 600, 900], 75) : undefined}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={destination.nameAr}
          width={400}
          height={600}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.7]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/tourism.jpg';
          }}
        />
      </div>

      {/* Royal Navy & Gold Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#071428] via-[#071428]/45 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
        {/* Location Badge */}
        <div className="flex items-center gap-2 text-[#C9A227] mb-2.5">
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-black tracking-wide">
            {destination.packagesCount > 0 
              ? `${destination.packagesCount} باقة متاحة`
              : 'استكشف الباقات'}
          </span>
        </div>

        {/* Destination Name */}
        <h2 className="text-3xl md:text-4xl font-serif font-black text-white mb-1 leading-tight group-hover:text-[#C9A227] transition-all">
          {destination.nameAr}
        </h2>

        {/* English Name */}
        <span className="text-[#C9A227] text-sm font-bold tracking-widest mb-3 uppercase">
          {destination.nameEn}
        </span>

        {/* Description */}
        {destination.descriptionAr && (
          <p className="text-slate-300 text-xs md:text-sm max-w-md mb-5 leading-relaxed font-semibold line-clamp-2">
            {destination.descriptionAr}
          </p>
        )}

        {/* Explore Button */}
        <motion.button
          className="self-start flex items-center gap-2.5 bg-[#C9A227] hover:bg-[#DFBA44] text-[#071428] px-5 py-2.5 rounded-xl font-black transition-all duration-300 text-xs shadow-lg shadow-amber-500/10"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            handleExplore();
          }}
        >
          <span>استكشف الباقات</span>
          <ArrowLeft className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Decorative Corners on Hover */}
      <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-[#C9A227]/40 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-[#C9A227]/40 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

// Vertical Destinations Grid Section
const DestinationsGrid = ({ destinations }) => {
  return (
    <section className="relative bg-[#071428] py-12 border-t border-white/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, #C9A227 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative">
        {/* 3-Column Premium Vertical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <DestinationCard key={destination.id} destination={destination} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Destinations Page
const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await apiService.destinations.getAll();
        if (Array.isArray(response) && response.length > 0) {
          setDestinations(response);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071428] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="min-h-screen bg-[#071428] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-white mb-4">لا توجد وجهات حالياً</h2>
          <p className="text-white/90 font-semibold tracking-wide">يرجى المحاولة لاحقاً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#071428]">
      <SEO
        title="أفضل الوجهات السياحية"
        description="استكشف أفضل الوجهات السياحية حول العالم مع شركة الملحم للسفر والسياحة. نقدم أفضل الباقات والعروض لرحلتك القادمة."
        keywords="الوجهات السياحية, عروض سياحية, السفر إلى العالم, بكجات سياحية, الملحم"
      />

      {/* Compact Header */}
      <section className="pt-32 pb-8 text-center relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-0.5 bg-[#C9A227]" />
              <span className="text-[#C9A227] text-xs font-black tracking-widest uppercase">وجهات سفر تفوق الخيال</span>
              <div className="w-8 h-0.5 bg-[#C9A227]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-3 leading-tight">
              وجهاتنا <span className="text-[#C9A227]">حول العالم</span>
            </h1>
            <p className="text-white/70 font-semibold text-base md:text-lg max-w-xl mx-auto">
              اكتشف أجمل الوجهات السياحية مع باقات مصممة خصيصاً لك
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vertical Destinations Grid Section */}
      <DestinationsGrid destinations={destinations} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Destinations;

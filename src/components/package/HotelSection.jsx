import { motion } from 'framer-motion';
import HotelShowcase from './HotelShowcase';
import useIsMobile from '../../hooks/useIsMobile';

const HotelSection = ({ hotels }) => {
  const isMobile = useIsMobile();
  if (!hotels || hotels.length === 0) return null;
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-slate-800 mb-4">
            الإقامة الفاخرة
          </h2>
          <div className="w-20 h-1 bg-[#C9A227] mx-auto" />
          <p className="text-slate-700 font-medium mt-4 max-w-2xl mx-auto font-medium">
            استمتع بإقامة لا تُنسى في أفخم الفنادق المختارة بعناية
          </p>
        </motion.div>

        {/* Hotels Grid */}
        <div className="space-y-20">
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.name}
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={isMobile ? { duration: 0 } : { delay: index * 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <HotelShowcase hotel={hotel} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelSection;

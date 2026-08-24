import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Car, Headphones, Map } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/image';

const features = [
  {
    id: 1,
    icon: Crown,
    title: 'ضيافة ملكية',
    description: 'إقامة فاخرة في أرقى الفنادق العالمية مع خدمات حصرية تليق بتطلعاتك',
    image: '/assets/home/hotel_luxury.png',
  },
  {
    id: 2,
    icon: Car,
    title: 'أسطول VIP',
    description: 'سيارات فاخرة وليموزين خاصة مجهزة بالكامل لتنقلاتك بأعلى مستويات الرفاهية والراحة',
    image: '/assets/home/limo_vip.png',
  },
  {
    id: 3,
    icon: Headphones,
    title: 'كونسيرج 24/7',
    description: 'فريق دعم ومستشاري سفر سعوديين متخصصين على مدار الساعة لتلبية كافة تطلعاتك فوراً',
    image: '/assets/home/concierge_support.png',
  },
  {
    id: 4,
    icon: Map,
    title: 'رحلات مخصصة',
    description: 'برامج سفر ورحلات عائلية مصممة خصيصاً لتناسب أدق تفاصيل ذوقك واهتماماتك الشخصية',
    image: '/assets/home/custom_trips.png',
  },
];

const WhyChooseUs = () => {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-800 mb-4">
            لماذا تختارنا؟
          </h2>
          <div className="w-20 h-1 bg-[#C9A227] mx-auto" />
        </div>

        {/* Two Column Layout (Desktop). Mobile shows image inside the active card. */}
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - Image Frame (Desktop only) */}
          <div className="hidden md:block md:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeFeature.id}
                  src={getOptimizedImageUrl(activeFeature.image, 800, 75)}
                  alt={activeFeature.title}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Overlay with Title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <motion.div
                key={activeFeature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 right-6 text-white"
              >
                <h3 className="text-2xl font-serif">{activeFeature.title}</h3>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Features List */}
          <div className="order-1 md:order-2 space-y-4">
            {features.map((feature) => {
              const isActive = activeFeature.id === feature.id;
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.id}
                  onViewportEnter={() => setActiveFeature(feature)}
                  viewport={{ margin: "-30% 0px -30% 0px", amount: "some" }}
                  onMouseEnter={() => setActiveFeature(feature)}
                  onClick={() => setActiveFeature(feature)}
                  className={`relative p-6 rounded-xl cursor-pointer transition-colors duration-300 ${isActive
                    ? 'bg-slate-50 shadow-lg'
                    : 'hover:bg-slate-50/50'
                    }`}
                >
                  {/* Gold Line Indicator */}
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 bg-[#C9A227] rounded-full"
                    initial={{ height: 0 }}
                    animate={{ height: isActive ? '60%' : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="flex items-start gap-4 pr-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl transition-colors duration-300 ${isActive
                      ? 'bg-[#C9A227] text-white'
                      : 'bg-slate-100 text-slate-600'
                      }`}>
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h3 className={`text-xl font-serif mb-2 transition-colors duration-300 ${isActive ? 'text-[#C9A227]' : 'text-slate-800'
                        }`}>
                        {feature.title}
                      </h3>
                      <p className="text-slate-700 font-medium text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Mobile preview: show the image inside the active card so users can see it change */}
                  <div className="md:hidden mt-4">
                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.div
                          key={`mobile-img-${feature.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden rounded-2xl shadow-lg"
                        >
                          <div className="relative aspect-[16/9] w-full">
                            <img
                              src={getOptimizedImageUrl(feature.image, 400, 75)}
                              alt={feature.title}
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            <div className="absolute bottom-3 right-4 text-white">
                              <h4 className="text-lg font-serif">{feature.title}</h4>
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

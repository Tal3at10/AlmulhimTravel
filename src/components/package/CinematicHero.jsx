import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { getOptimizedImageUrl, getOptimizedImageSrcSet } from '../../utils/image';

const CinematicHero = ({ hero }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [fontSize, setFontSize] = useState('15vw');

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate optimal font size to fit text on one line
  useEffect(() => {
    const calculateFontSize = () => {
      if (!textRef.current || !containerRef.current) return;
      
      const container = containerRef.current;
      const text = textRef.current;
      const containerWidth = container.offsetWidth * 0.95; // 95% of container width
      
      let size = isMobile ? 12 : 20; // vw units
      text.style.fontSize = `${size}vw`;
      
      // Reduce font size until text fits on one line (allow smaller on mobile)
      while (text.scrollWidth > containerWidth && size > 0.5) {
        size -= 0.5;
        text.style.fontSize = `${size}vw`;
      }
      
      setFontSize(`${size}vw`);
    };

    calculateFontSize();
    window.addEventListener('resize', calculateFontSize);
    return () => window.removeEventListener('resize', calculateFontSize);
  }, [hero.titleAr, hero.title, isMobile]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 15]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const optimizedImageUrl = getOptimizedImageUrl(hero.imageUrl, 1920, 90);

  const ENABLE_TEXT_BALANCE_WRAPPING = false; // Set to false to rollback to single-line font-scaling style

  return (
    <section 
      ref={containerRef} 
      className={`relative ${isMobile ? 'h-screen' : 'h-[200vh]'}`}
    >
      {/* Sticky Container - Only sticky on desktop */}
      <div className={`${isMobile ? 'relative' : 'sticky top-0'} h-screen overflow-hidden`}>
        {/* Image Background */}
        <img
          src={
            optimizedImageUrl ||
            getOptimizedImageUrl('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&q=80', 1920, 90)
          }
          sizes="100vw"
          alt={hero.titleAr || hero.title || 'Package hero image'}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Giant Text with Zoom Effect - Disabled on Mobile */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ 
            scale: isMobile ? 1 : scale, 
            opacity: isMobile ? 1 : opacity 
          }}
        >
          {ENABLE_TEXT_BALANCE_WRAPPING ? (
            <h1
              className="font-semibold font-arabic text-center text-balance max-w-4xl mx-auto px-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight"
              style={{
                textShadow: '0 4px 20px rgba(0,0,0,0.6)',
                direction: 'rtl',
                letterSpacing: '-0.02em',
              }}
            >
              {hero.titleAr || hero.title}
            </h1>
          ) : (
            <h1
              ref={textRef}
              className="font-semibold font-arabic text-center whitespace-nowrap"
              style={{
                color: 'white',
                textShadow: '0 4px 20px rgba(0,0,0,0.6)',
                direction: 'rtl',
                letterSpacing: '-0.02em',
                maxWidth: '95vw',
                fontSize: fontSize,
              }}
            >
              {hero.titleAr || hero.title}
            </h1>
          )}
        </motion.div>

        {/* Subtitle & Info */}
        <motion.div
          className={`absolute ${isMobile ? 'bottom-40' : 'bottom-20'} left-0 right-0 text-center px-4`}
          style={{ opacity: isMobile ? 1 : textOpacity }}
        >
          <p className="text-white/80 text-xl md:text-2xl mb-4 font-arabic max-w-lg mx-auto leading-relaxed">
            {hero.subtitle}
          </p>
          <div className="flex items-center justify-center gap-8 text-white">
            <span className="text-lg">{hero.duration}</span>
            <span className="w-px h-6 bg-white/50" />
            <span className="text-2xl font-bold text-[#C9A227]">
              {hero.price.toLocaleString()} {hero.currency}
            </span>
          </div>
        </motion.div>

        {/* Scroll Indicator - Hide on mobile if already scrolled or just keep static */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: isMobile ? 1 : textOpacity }}
          animate={isMobile ? undefined : { y: [0, 10, 0] }}
          transition={isMobile ? undefined : { duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/80 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CinematicHero;

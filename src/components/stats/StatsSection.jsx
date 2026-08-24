import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Users, Globe, Headphones, ShieldCheck } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

const stats = [
  { icon: Award, value: 33, suffix: '+', label: 'عاماً من الخبرة والريادة (منذ 1993)' },
  { icon: Users, value: 150, suffix: 'k+', label: 'عميل سعيد وثق بخدماتنا' },
  { icon: Globe, value: 65, suffix: '+', label: 'وجهة سياحية حول العالم' },
  { icon: Headphones, value: 24, suffix: '/7', label: 'دعم وكونسيرج على مدار الساعة' },
];

const Counter = ({ value, suffix, inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
      {count}{suffix}
    </span>
  );
};

const FloatingIcon = ({ Icon }) => (
  <div className="relative flex items-center justify-center">
    {/* Soft Breathing Glowing Orb - Simplified for mobile performance to prevent iOS rendering failure */}
    <div
      className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#C9A227]/15 md:bg-[#C9A227]/20 blur-md md:blur-xl md:animate-pulse"
      style={{
        animationDuration: '3s',
      }}
    />
    
    {/* Static Icon with solid gold fallback and hardware acceleration hint */}
    <div className="relative z-10 w-14 h-14 rounded-full bg-[#C9A227] bg-gradient-to-br from-[#C9A227] to-[#B8911F] flex items-center justify-center shadow-lg shadow-[#C9A227]/30 transform-gpu">
      <Icon className="w-7 h-7 text-[#071428]" strokeWidth={2} />
    </div>
  </div>
);

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} className="relative py-28 bg-[#071428] overflow-hidden border-t border-b border-white/5">
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C9A227" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Dotted World Map Background */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#C9A227" />
            </pattern>
          </defs>
          <ellipse cx="500" cy="250" rx="455" ry="220" fill="url(#dots)" />
        </svg>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071428]/80 via-transparent to-[#071428]/95 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={isMobile ? { opacity: 1, y: 0 } : (isInView ? { opacity: 1, y: 0 } : {})}
          transition={isMobile ? { duration: 0 } : { duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-[#C9A227] text-xs md:text-sm font-bold tracking-widest uppercase block mb-3">عقود من التميز والريادة</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">الأرقام تتحدث عن جودتنا</h2>
          <div className="w-16 h-1 bg-[#C9A227] mx-auto mt-4" />
        </motion.div>

        {/* Stats Grid */}
        <div className="relative mb-20">
          {/* Connecting Golden Line */}
          <motion.div
            className="hidden md:block absolute top-1/2 left-0 right-0 h-[1.5px] -translate-y-1/2"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ 
              background: 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.4) 20%, rgba(201, 162, 39, 0.4) 80%, transparent)',
              transformOrigin: 'left',
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                animate={isMobile ? { opacity: 1, y: 0 } : (isInView ? { opacity: 1, y: 0 } : {})}
                transition={isMobile ? { duration: 0 } : { duration: 0.6, delay: index * 0.15 }}
              >
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl py-8 px-6 text-center hover:bg-white/[0.06] hover:border-[#C9A227]/20 transition-all duration-300 flex flex-col items-center justify-center group">
                  {/* Floating Icon */}
                  <div className="flex justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <FloatingIcon Icon={stat.icon} />
                  </div>

                  {/* Counter */}
                  <Counter value={stat.value} suffix={stat.suffix} inView={isInView} />

                  {/* Label */}
                  <p className="mt-3 text-slate-300 font-bold text-sm leading-relaxed max-w-[200px]">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Badges & Accreditations */}
        <motion.div
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={isMobile ? { opacity: 1, y: 0 } : (isInView ? { opacity: 1, y: 0 } : {})}
          transition={isMobile ? { duration: 0 } : { duration: 0.8, delay: 0.6 }}
          className="border-t border-white/10 pt-10"
        >
          <p className="text-center text-slate-400 text-xs font-bold tracking-wider uppercase mb-8">
            شراكات رسمية واعتمادات موثوقة عالمياً ومحلياً
          </p>

          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-80 hover:opacity-100 transition-opacity duration-300">
            {/* IATA SVG Logo */}
            <div className="flex flex-col items-center text-[#C9A227]" title="عضو معتمد لدى الاتحاد الدولي للنقل الجوي">
              <svg viewBox="0 0 200 65" className="h-10 w-auto fill-current">
                <path d="M12.5 10h12v45h-12V10zm25 0h24c8 0 13 4 13 11v1c0 5-3 9-8 10l9 21H61l-8-20h-5v20H37.5V10zm13 11v8h6c3 0 5-1 5-4v-1c0-2-2-3-5-3h-6zm42-11h11l15 45H115l-3-10H98l-3 10H81.5l11-45zm13 25l-5-16-5 16h10zm35-25h25v9h-19v9h17v9h-17v18H128V10z" />
                <circle cx="178" cy="32" r="18" stroke="currentColor" strokeWidth="3" fill="none" />
                <path d="M172 23l9 9-9 9" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
              <span className="text-[10px] text-white/50 font-bold mt-1 uppercase">IATA Member</span>
            </div>

            {/* Saudi Vision 2030 Inspired Logo */}
            <div className="flex flex-col items-center text-[#C9A227]" title="داعم لرؤية المملكة 2030">
              <div className="flex items-center gap-1 font-black text-2xl font-serif text-white tracking-widest">
                <span>VISION</span>
                <span className="text-[#C9A227]">20</span>
                <span className="bg-[#C9A227] text-[#071428] px-1.5 py-0.5 rounded font-sans text-lg">30</span>
              </div>
              <span className="text-[10px] text-white/50 font-bold mt-1">شريك تطلعات المستقبل</span>
            </div>

            {/* Ministry of Tourism Inspired Emblem */}
            <div className="flex flex-col items-center text-[#C9A227]" title="مرخص من وزارة السياحة السعودية">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 60 60" className="w-8 h-8 fill-current animate-pulse" style={{ animationDuration: '4s' }}>
                  <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M30 12v12M30 36v12M12 30h12M36 30h12M17.3 17.3l8.5 8.5M34.2 34.2l8.5 8.5M17.3 42.7l8.5-8.5M34.2 25.8l8.5-8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="30" cy="30" r="4" fill="currentColor"/>
                </svg>
                <div className="text-right">
                  <span className="text-xs font-black text-white block leading-none">وزارة السياحة</span>
                  <span className="text-[9px] text-[#C9A227] font-bold">Ministry of Tourism</span>
                </div>
              </div>
              <span className="text-[9px] text-white/50 font-medium mt-1">ترخيص رقم: ١١٠٠١٣٨٢</span>
            </div>

            {/* Saudi Travel Association Badge */}
            <div className="flex items-center gap-2 text-white/60">
              <ShieldCheck className="w-8 h-8 text-[#C9A227]" />
              <div className="text-right">
                <span className="text-xs font-bold text-white block">حجز آمن 100%</span>
                <span className="text-[9px] text-white/40 block">مضمون وحماية تشفير كاملة</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;

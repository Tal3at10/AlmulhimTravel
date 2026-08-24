import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Send, X } from 'lucide-react';

/**
 * PromoBanner - Redesigned premium promotional banner with background image support
 * and optimized rendering for iOS Safari (no buggy GPU blur elements).
 */
const PromoBanner = ({
  backgroundImage = '/summer-escape.webp',
  titleAr = 'ودك تهرب من الحر! 🌴☀️',
  subtitleAr = 'اكتشف باقاتنا الصيفية الحصرية لوجهات باردة ومنعشة واستمتع بعروض خاصة تفوق التوقعات!',
  ctaTextAr = 'استكشف باقات الصيف',
  badgeTextAr = 'عروض الصيف 2026',
  onClose,
  whatsappRedirect = true,
  whatsappMsg = 'مرحباً، أود الاستفسار عن باقات وعروض الصيف للهروب من الحر!',
  to = '',
  onClick = null
}) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (to) {
      navigate(to);
      return;
    }
    if (whatsappRedirect) {
      const url = `https://wa.me/966535727771?text=${encodeURIComponent(whatsappMsg)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <motion.div
      className="relative rounded-[32px] p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 min-h-[200px] text-white shadow-2xl shadow-[#071428]/25 group bg-[#071428] border border-white/5"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Premium Gradient Overlay - Navy and gold tints for contrast (RTL Correct: from right-to-left) */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#071428]/95 via-[#071428]/80 to-[#071428]/15 z-0 pointer-events-none md:block hidden" />
      {/* Mobile Gradient Overlay - Full coverage vertical gradient for high text readability on mobile viewports */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071428]/95 via-[#071428]/90 to-[#071428]/85 z-0 pointer-events-none md:hidden block" />

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full bg-[#071428]/60 hover:bg-[#C9A227] text-white hover:text-[#071428] border border-white/10 hover:border-[#C9A227] transition-all cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Right side - Icon & Texts */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-right relative z-10 w-full md:w-auto">
        {/* Luxury Gold Icon Box */}
        <div className="p-4.5 rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#DFBA44] text-[#071428] shadow-lg shadow-amber-500/25 flex items-center justify-center group-hover:scale-105 group-hover:rotate-6 transition-all duration-500 shrink-0 border border-[#DFBA44]/30">
          <Sparkles className="w-8 h-8" strokeWidth={2.5} />
        </div>
        
        <div className="flex flex-col items-center md:items-start max-w-2xl">
          {/* Elegant Top Badges removed for cleaner design */}
          
          {/* Main Hook & Subtext */}
          <h3 className="text-2xl md:text-4xl font-serif font-black mb-2.5 text-white leading-tight drop-shadow-[0_2px_4px_rgba(7,20,40,0.5)]">
            {titleAr}
          </h3>
          <p className="text-slate-200 text-xs md:text-base font-semibold leading-relaxed drop-shadow-[0_1px_2px_rgba(7,20,40,0.5)] max-w-xl">
            {subtitleAr}
          </p>
        </div>
      </div>

      {/* Left side - Action Button */}
      <div className="relative z-10 shrink-0 w-full md:w-auto flex justify-center md:justify-end">
        <motion.button
          onClick={handleCTA}
          className="w-full md:w-auto px-8 py-4.5 rounded-2xl flex items-center justify-center gap-3 text-xs md:text-base font-black shadow-xl shadow-amber-500/20 text-[#071428] transition-all cursor-pointer border border-[#C9A227] hover:shadow-amber-500/35"
          style={{
            background: 'linear-gradient(135deg, #C9A227, #DFBA44)',
            color: '#071428'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          <span>{ctaTextAr}</span>
          <Send className="w-4 h-4 transform -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PromoBanner;

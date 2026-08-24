import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Percent, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if popup was already shown or dismissed this session
    const hasBeenShown = sessionStorage.getItem('almulhim_promo_shown');
    if (hasBeenShown) return;

    // Show popup after 12 seconds delay (standard luxury duration)
    const timer = setTimeout(() => {
      triggerPopup();
    }, 12000);

    // Also trigger on Exit Intent (user moves mouse towards top browser bar)
    const handleMouseLeave = (e) => {
      if (e.clientY < 20) {
        triggerPopup();
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const triggerPopup = () => {
    const hasBeenShown = sessionStorage.getItem('almulhim_promo_shown');
    if (!hasBeenShown) {
      setIsOpen(true);
      sessionStorage.setItem('almulhim_promo_shown', 'true');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      // Optional API registration could happen here. 
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          {/* Dark Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#071428]/70 backdrop-blur-md"
          />

          {/* Premium Card Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gradient-to-br from-[#071428] via-[#10243e] to-[#071428] border border-[#C9A227]/30 w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(201,162,39,0.15)] z-10 p-8 text-center text-white"
          >
            {/* Elegant Top Gold Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C9A227]/20 via-[#C9A227] to-[#C9A227]/20" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-white/5 hover:bg-[#C9A227] hover:text-[#071428] transition-colors"
              aria-label="إغلاق العرض"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon Banner */}
            <div className="mx-auto w-16 h-16 rounded-full bg-white/5 border border-[#C9A227]/20 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-[#C9A227]/10 blur-md animate-ping" style={{ animationDuration: '3s' }} />
              <Sparkles className="w-7 h-7 text-[#C9A227]" />
            </div>

            {/* Header */}
            <span className="text-[#C9A227] text-xs font-bold tracking-widest uppercase block mb-2">هدية حصرية لزوارنا الجدد</span>
            <h3 className="text-2xl md:text-3xl font-black mb-3 text-white leading-tight">
              خصم خاص بقيمة <span className="text-[#C9A227]">10%</span> على رحلتك القادمة!
            </h3>
            <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-sm mx-auto mb-6">
              اشترك في قائمتنا البريدية الخاصة الآن واحصل على كود الخصم فوراً بالإضافة لأفضل عروض السفر الموسمية الحصرية.
            </p>

            {/* Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pr-4 pl-12 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all text-right"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Send className="w-4 h-4 transform rotate-180" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C9A227] hover:bg-[#B8911F] text-[#071428] font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-[#C9A227]/10 text-sm flex items-center justify-center gap-2"
                >
                  <span>الحصول على الخصم</span>
                  <Percent className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-400 text-sm font-bold max-w-md mx-auto"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-[#C9A227]" />
                  <span>تهانينا! كود الخصم الخاص بك هو:</span>
                </div>
                <div className="bg-[#071428]/80 text-[#C9A227] select-all border border-[#C9A227]/20 rounded-lg p-2.5 font-mono text-lg tracking-widest my-2 select-all cursor-pointer" title="انقر لنسخ الكود">
                  ALMULHIM2026
                </div>
                <p className="text-xs text-slate-400 font-medium">تم إرسال تفاصيل الخصم لبريدك، استمتع برحلتك الفاخرة!</p>
              </motion.div>
            )}

            {/* Trust Footer */}
            <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-bold border-t border-white/5 pt-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>العرض ساري لغاية ديسمبر 2026</span>
              </div>
              <span className="text-white/10">|</span>
              <span>خاضع للشروط والأحكام</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PromoPopup;

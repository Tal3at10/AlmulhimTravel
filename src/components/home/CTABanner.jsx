import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, MapPin } from 'lucide-react';

const CTABanner = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Parallax Background - bg-scroll on mobile to avoid iOS Safari rendering issues */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed"
        style={{
          backgroundImage: 'url("/malaysia-hero.jpg")'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight font-bold"
        >
          هل أنت جاهز لرحلتك القادمة؟
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-white/80 mb-10 font-medium"
        >
          دعنا نصمم لك تجربة سفر لا تُنسى
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/966535727771"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-3 text-lg w-full sm:w-auto hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-6 h-6" />
            تواصل عبر واتساب
          </a>

          {/* Branches Button */}
          <Link
            to="/contact"
            className="btn-secondary inline-flex items-center justify-center gap-3 text-lg !border-white !text-white hover:!bg-white hover:!text-[#071428] w-full sm:w-auto hover:scale-105 transition-transform"
          >
            <MapPin className="w-6 h-6" />
            فروعنا
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;

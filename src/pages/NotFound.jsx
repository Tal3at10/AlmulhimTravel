import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Phone } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-header-offset bg-gradient-to-b from-[#071428] via-[#071428] to-[#071428] flex items-center justify-center relative overflow-hidden">
      {/* Cloud Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="clouds" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="25" r="8" fill="white" opacity="0.3" />
              <circle cx="20" cy="22" r="10" fill="white" opacity="0.4" />
              <circle cx="30" cy="25" r="7" fill="white" opacity="0.3" />
              <circle cx="40" cy="30" r="9" fill="white" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#clouds)" />
        </svg>
      </div>

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Radar Effect */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Radar Circles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-[#C9A227]"
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{
                scale: [0.5, 2],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Center Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-[#C9A227]/20 blur-xl" />
          </div>

          {/* The Confused Plane */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              y: [-10, 10, -10],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <motion.img
              src="https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/512px/2708.png"
              alt="طيارة تائهة"
              className="w-24 h-24 object-contain"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.5))',
                transform: 'rotate(45deg)',
              }}
              animate={{
                filter: [
                  'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))',
                  'drop-shadow(0 0 40px rgba(212, 175, 55, 0.6))',
                  'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>

          {/* Question Marks */}
          <motion.span
            className="absolute top-4 right-8 text-4xl"
            animate={{
              y: [-5, 5, -5],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.3,
            }}
          >
            ❓
          </motion.span>
          <motion.span
            className="absolute top-8 left-4 text-3xl"
            animate={{
              y: [5, -5, 5],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.6,
            }}
          >
            ❓
          </motion.span>
        </div>

        {/* 404 Number */}
        <motion.h1
          className="text-[10rem] md:text-[14rem] font-bold leading-none"
          style={{
            background: 'linear-gradient(135deg, #C9A227 0%, #f5d77a 50%, #C9A227 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 60px rgba(212, 175, 55, 0.3)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          404
        </motion.h1>

        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-4xl font-serif text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          كابتن.. لقد فقدنا الإشارة!
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-white font-medium text-lg max-w-md mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          يبدو أننا هبطنا في مطار غير موجود على الخريطة، أو أن الرحلة تم إلغاؤها.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Return to Base */}
          <Link to="/">
            <motion.button
              className="btn-primary inline-flex items-center justify-center gap-3 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              العودة للقاعدة
            </motion.button>
          </Link>

          {/* Contact Tower */}
          <Link to="/contact">
            <motion.button
              className="btn-secondary inline-flex items-center justify-center gap-3 text-lg !border-white/50 !text-white hover:!bg-white hover:!text-[#071428]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-5 h-5" />
              تواصل مع البرج
            </motion.button>
          </Link>
        </motion.div>

        {/* Flight Number */}
        <motion.div
          className="mt-12 text-white/40 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="font-mono">رقم الرحلة: ALM-404 | الحالة: </span>
          <span className="text-red-400 font-mono">مفقودة</span>
        </motion.div>
      </div>

      {/* Bottom Clouds */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent" />
    </div>
  );
};

export default NotFound;

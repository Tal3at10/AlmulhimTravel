import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const JetIntro = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [vapors, setVapors] = useState([]);
  const [jetPosition, setJetPosition] = useState({ x: -10, y: 110 });
  const animationRef = useRef(null);
  const vaporIdRef = useRef(0);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('almulhem_visited');
    if (!hasVisited) {
      setShowIntro(true);
    }
  }, []);

  const startDelay = 1500;
  const animationDuration = 4500; // أبطأ شوية

  useEffect(() => {
    if (!showIntro) return;

    const startTime = Date.now() + startDelay;
    let lastVaporTime = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / animationDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      // Jet moves from bottom-left to top-right
      const x = -10 + eased * 120;
      const y = 110 - eased * 120;
      setJetPosition({ x, y });

      // Spawn vapor trail behind the jet - following the diagonal path
      if (now - lastVaporTime > 25 && progress < 1) {
        lastVaporTime = now;

        // Create vapor clouds along the jet's trail (behind it)
        const newVapors = [];
        
        // Main trail - directly behind the jet
        for (let i = 0; i < 3; i++) {
          newVapors.push({
            id: vaporIdRef.current++,
            x: x - 5 + (Math.random() - 0.5) * 10,
            y: y + 5 + (Math.random() - 0.5) * 10,
            size: Math.random() * 12 + 8,
            delay: i * 20,
          });
        }

        // Spread vapors to cover full width - perpendicular to flight path
        // This creates a "sweeping" effect across the screen
        for (let i = 0; i < 4; i++) {
          const spread = (Math.random() - 0.5) * 80;
          newVapors.push({
            id: vaporIdRef.current++,
            // Spread perpendicular to the diagonal (45 degree) path
            x: x + spread * 0.7,
            y: y + spread * 0.7,
            size: Math.random() * 15 + 10,
            delay: Math.random() * 50,
          });
        }

        setVapors((prev) => [...prev, ...newVapors]);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          sessionStorage.setItem('almulhem_visited', 'true');
          setIsComplete(true);
        }, 1000);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showIntro]);

  if (!showIntro || isComplete) return null;

  return (
    <AnimatePresence>
      {/* SVG Mask Layer - z-[60] عشان يغطي الهيدر */}
      <div className="fixed inset-0 z-[60] pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <mask id="vaporMask">
              <rect width="100%" height="100%" fill="white" />
              {vapors.map((vapor) => (
                <motion.circle
                  key={vapor.id}
                  cx={`${vapor.x}%`}
                  cy={`${vapor.y}%`}
                  initial={{ r: 0 }}
                  animate={{ r: vapor.size * 1.2 + '%' }}
                  transition={{
                    duration: 1.5,
                    delay: vapor.delay / 1000,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  fill="black"
                />
              ))}
            </mask>
            <linearGradient
              id="overlayGradient"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#0d5c63" />
              <stop offset="50%" stopColor="#14919b" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
          </defs>

          <rect
            width="100%"
            height="100%"
            fill="url(#overlayGradient)"
            mask="url(#vaporMask)"
          />
        </svg>

        {/* Brand Text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-3">
              منصة الملحم
            </h1>
            <div className="w-24 h-0.5 bg-gold-light mx-auto my-4"></div>
            <p className="text-gold-light text-xl tracking-wide">
              للسفر والسياحة
            </p>
          </div>
        </motion.div>
      </div>

      {/* Vapor/Smoke Visual Effect */}
      <div className="fixed inset-0 z-[65] pointer-events-none overflow-hidden">
        {vapors.slice(-50).map((vapor) => (
          <motion.div
            key={`vapor-${vapor.id}`}
            className="absolute"
            style={{
              left: `${vapor.x}%`,
              top: `${vapor.y}%`,
              width: vapor.size * 6,
              height: vapor.size * 6,
              transform: 'translate(-50%, -50%)',
              background:
                'radial-gradient(ellipse at center, rgba(255,255,255,0.5), rgba(255,255,255,0.2), transparent 70%)',
              filter: 'blur(10px)',
              borderRadius: '50%',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 2],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 1.8,
              delay: vapor.delay / 1000,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* The Plane Icon */}
      <motion.div
        className="fixed z-[70] pointer-events-none"
        style={{
          left: `${jetPosition.x}%`,
          top: `${jetPosition.y}%`,
          transform: 'translate(-50%, -50%) rotate(45deg)',
        }}
      >
        <img
          src="https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/512px/2708.png"
          alt="طيارة"
          className="w-16 h-16 md:w-24 md:h-24 object-contain"
          style={{
            filter:
              'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(251, 191, 36, 0.6))',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default JetIntro;

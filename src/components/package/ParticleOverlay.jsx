import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Particle = ({ type, index }) => {
  const randomX = Math.random() * 100;
  const randomDelay = Math.random() * 5;
  const randomDuration = 5 + Math.random() * 10;
  const randomSize = type === 'snow' ? 4 + Math.random() * 6 : 8 + Math.random() * 12;

  // ❄️ ثلج - موسكو
  if (type === 'snow') {
    return (
      <motion.div
        className="absolute rounded-full bg-white/80 pointer-events-none"
        style={{
          width: randomSize,
          height: randomSize,
          left: `${randomX}%`,
          top: -20,
        }}
        animate={{
          y: ['0vh', '110vh'],
          x: [0, Math.sin(index) * 50],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: randomDuration,
          delay: randomDelay,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    );
  }

  // 🍃 أوراق خضراء - ماليزيا، تايلند
  if (type === 'leaf') {
    return (
      <motion.div
        className="absolute pointer-events-none text-green-500/60"
        style={{
          left: `${randomX}%`,
          top: -30,
          fontSize: randomSize,
        }}
        animate={{
          y: ['0vh', '110vh'],
          x: [0, Math.sin(index) * 100, 0],
          rotate: [0, 360],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: randomDuration,
          delay: randomDelay,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        🍃
      </motion.div>
    );
  }

  // ✨ يراعات - استوائي
  if (type === 'firefly') {
    return (
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 4,
          height: 4,
          left: `${randomX}%`,
          top: `${Math.random() * 100}%`,
          background: 'radial-gradient(circle, #fcd34d 0%, transparent 70%)',
          boxShadow: '0 0 10px #fcd34d, 0 0 20px #fcd34d',
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5],
          x: [0, Math.random() * 50 - 25],
          y: [0, Math.random() * 50 - 25],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          delay: randomDelay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  // 🍂 أوراق خريف - تركيا، جورجيا
  if (type === 'autumn') {
    const leaves = ['🍂', '🍁', '🍃'];
    const leaf = leaves[Math.floor(Math.random() * leaves.length)];
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${randomX}%`,
          top: -30,
          fontSize: randomSize + 4,
        }}
        animate={{
          y: ['0vh', '110vh'],
          x: [0, Math.sin(index) * 80, -Math.sin(index) * 40, 0],
          rotate: [0, 180, 360],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: randomDuration + 3,
          delay: randomDelay,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {leaf}
      </motion.div>
    );
  }

  // 🌧️ مطر - لندن
  if (type === 'rain') {
    return (
      <motion.div
        className="absolute pointer-events-none bg-gradient-to-b from-blue-300/60 to-transparent rounded-full"
        style={{
          width: 2,
          height: 15 + Math.random() * 10,
          left: `${randomX}%`,
          top: -30,
        }}
        animate={{
          y: ['0vh', '110vh'],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 1 + Math.random() * 0.5,
          delay: randomDelay * 0.3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    );
  }

  // ✨ ذهب/لمعان - دبي
  if (type === 'gold') {
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 3 + Math.random() * 4,
          height: 3 + Math.random() * 4,
          left: `${randomX}%`,
          top: `${Math.random() * 100}%`,
          background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 50%, transparent 70%)',
          boxShadow: '0 0 8px #fbbf24, 0 0 15px #d97706',
          borderRadius: '50%',
        }}
        animate={{
          opacity: [0, 1, 0.5, 1, 0],
          scale: [0.3, 1, 0.8, 1, 0.3],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          delay: randomDelay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  // 🌸 زهور/بتلات - فيتنام
  if (type === 'petal') {
    const petals = ['🌸', '💮', '🏵️'];
    const petal = petals[Math.floor(Math.random() * petals.length)];
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${randomX}%`,
          top: -30,
          fontSize: randomSize,
          opacity: 0.7,
        }}
        animate={{
          y: ['0vh', '110vh'],
          x: [0, Math.sin(index) * 60, -Math.sin(index) * 30, 0],
          rotate: [0, 90, 180, 270, 360],
          opacity: [0, 0.8, 0.8, 0],
        }}
        transition={{
          duration: randomDuration + 2,
          delay: randomDelay,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {petal}
      </motion.div>
    );
  }

  // 🏔️ جبال/ضباب - جورجيا (بديل)
  if (type === 'mist') {
    return (
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 100 + Math.random() * 150,
          height: 30 + Math.random() * 20,
          left: `${randomX - 10}%`,
          top: `${60 + Math.random() * 30}%`,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
        animate={{
          x: [-50, 50, -50],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 15 + Math.random() * 10,
          delay: randomDelay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  return null;
};

const ParticleOverlay = ({ vibe = 'tropical', intensity = 30, desktopOnly = false }) => {
  const [particles, setParticles] = useState([]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mobileMql = window.matchMedia('(max-width: 768px)');
    const reducedMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      const isMobile = mobileMql.matches;
      const reducedMotion = reducedMotionMql.matches;
      setEnabled(!(desktopOnly && isMobile) && !reducedMotion);
    };

    update();

    if (mobileMql.addEventListener) {
      mobileMql.addEventListener('change', update);
      reducedMotionMql.addEventListener('change', update);
      return () => {
        mobileMql.removeEventListener('change', update);
        reducedMotionMql.removeEventListener('change', update);
      };
    }

    mobileMql.addListener(update);
    reducedMotionMql.addListener(update);
    return () => {
      mobileMql.removeListener(update);
      reducedMotionMql.removeListener(update);
    };
  }, [desktopOnly]);

  useEffect(() => {
    if (!enabled) {
      setParticles([]);
      return;
    }

    const particleArray = Array.from({ length: intensity }, (_, i) => i);
    setParticles(particleArray);
  }, [enabled, intensity]);

  const getParticleType = () => {
    switch (vibe) {
      case 'arctic':
        return 'snow';
      case 'tropical':
        return Math.random() > 0.5 ? 'leaf' : 'firefly';
      case 'cultural':
        return Math.random() > 0.6 ? 'autumn' : 'petal';
      case 'urban':
        return 'rain';
      case 'mountain':
        return Math.random() > 0.5 ? 'autumn' : 'mist';
      case 'luxury':
        return 'gold';
      case 'honeymoon':
        return Math.random() > 0.5 ? 'petal' : 'gold';
      case 'cruise':
        return Math.random() > 0.5 ? 'mist' : 'rain';
      case 'islands':
        return Math.random() > 0.5 ? 'leaf' : 'firefly';
      default:
        return 'firefly';
    }
  };

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-40">
      {particles.map((_, index) => (
        <Particle key={index} type={getParticleType()} index={index} />
      ))}
    </div>
  );
};

export default ParticleOverlay;

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';

// Premium-quality local ambient tracks (preloaded and optimized)
const DESTINATION_TRACKS = {
  turkey: {
    url: '/audio/turkish.mp3',
    nameAr: 'أجواء تركيا وباقاتها الساحرة 🎵',
    color: 'from-red-600 to-amber-500'
  },
  azerbaijan: {
    url: '/audio/song-azerbaijan.mp3',
    nameAr: 'أذربيجان — الموسيقى الأذربيجانية الأصيلة 🎵',
    color: 'from-cyan-600 to-emerald-500'
  },
  russia: {
    url: '/audio/song-russia.mp3',
    nameAr: 'روسيا — الموسيقى الفولكلورية الروسية (كالينكا) 🪗',
    color: 'from-blue-600 to-slate-400'
  },
  thailand: {
    url: '/audio/song-thailand.mp3',
    nameAr: 'تايلاند — أنغام الطبيعة والاسترخاء 🌴',
    color: 'from-emerald-500 to-teal-400'
  },
  indonesia: {
    url: '/audio/song-indonesia.mp3',
    nameAr: 'إندونيسيا — سحر الشرق وجزر بالي 🌊',
    color: 'from-blue-500 to-cyan-400'
  },
  maldives: {
    url: '/audio/song-maldives.mp3',
    nameAr: 'جزر المالديف — هدوء الشواطئ والمحيط 🌊',
    color: 'from-cyan-400 to-blue-500'
  },
  malaysia: {
    url: '/audio/song-malaysia.mp3',
    nameAr: 'ماليزيا — سحر آسيا الحقيقي 🌴',
    color: 'from-emerald-500 to-teal-600'
  },
  vietnam: {
    url: '/audio/song-vietnam.mp3',
    nameAr: 'فيتنام — طبيعة آسيوية ساحرة 🌿',
    color: 'from-green-500 to-emerald-400'
  },
  default: {
    url: '/audio/song-default.mp3',
    nameAr: 'أجواء السفر الفاخرة المهدئة',
    color: 'from-amber-600 via-[#C9A227] to-amber-400'
  }
};

const AmbientAudio = () => {
  const location = useLocation();
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null); // Use ref instead of state to avoid re-render clearing the interval
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackKey, setActiveTrackKey] = useState('default');
  const [showTooltip, setShowTooltip] = useState(false);

  // 1. Detect Destination and dynamic page context, with MutationObserver for async loaded titles
  useEffect(() => {
      const detectAndTransition = () => {
      const path = location.pathname.toLowerCase();
      let newTrackKey = 'default';

      // Only change the music if we are on a specific package details page
      if (path.startsWith('/package/')) {
        const search = location.search.toLowerCase();
        const title = (document.title || '').toLowerCase();
        const fullText = `${path} ${search} ${title}`;

        if (
          fullText.includes('تركيا') || 
          fullText.includes('turkey') || 
          fullText.includes('istanbul') || 
          fullText.includes('إسطنبول')
        ) {
          newTrackKey = 'turkey';
        } else if (
          fullText.includes('أذربيجان') || 
          fullText.includes('اذربيجان') || 
          fullText.includes('azerbaijan') || 
          fullText.includes('باكو') || 
          fullText.includes('baku')
        ) {
          newTrackKey = 'azerbaijan';
        } else if (
          fullText.includes('روسيا') || 
          fullText.includes('russia') || 
          fullText.includes('موسكو') || 
          fullText.includes('moscow')
        ) {
          newTrackKey = 'russia';
        } else if (
          fullText.includes('تايلاند') || 
          fullText.includes('thailand') || 
          fullText.includes('بوكيت') || 
          fullText.includes('phuket') || 
          fullText.includes('فوكيت')
        ) {
          newTrackKey = 'thailand';
        } else if (
          fullText.includes('إندونيسيا') || 
          fullText.includes('اندونيسيا') || 
          fullText.includes('indonesia') || 
          fullText.includes('بالي') || 
          fullText.includes('bali')
        ) {
          newTrackKey = 'indonesia';
        } else if (
          fullText.includes('مالديف') || 
          fullText.includes('maldives')
        ) {
          newTrackKey = 'maldives';
        } else if (
          fullText.includes('ماليزيا') || 
          fullText.includes('malaysia') || 
          fullText.includes('كوالالمبور')
        ) {
          newTrackKey = 'malaysia';
        } else if (
          fullText.includes('فيتنام') || 
          fullText.includes('vietnam')
        ) {
          newTrackKey = 'vietnam';
        }
      }

      if (newTrackKey !== activeTrackKey) {
        handleTrackTransition(newTrackKey);
      }
    };

    // Run detection on mount / location / activeTrackKey change
    detectAndTransition();

    // Create a MutationObserver to listen to title changes (critical for async API loaded pages like PackageDetails)
    const titleEl = document.querySelector('title');
    if (titleEl) {
      const observer = new MutationObserver(() => {
        detectAndTransition();
      });
      observer.observe(titleEl, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [location, activeTrackKey]);

  // 2. Initialize state from localStorage and show welcome tooltip
  useEffect(() => {
    // Check if user previously enabled audio
    const savedAudioPreference = localStorage.getItem('ambient_audio_enabled');
    if (savedAudioPreference === 'true') {
      // Initialize only if we need to play
      if (!audioRef.current) {
        audioRef.current = new Audio(DESTINATION_TRACKS.default.url);
        audioRef.current.loop = true;
        audioRef.current.volume = 0;
      }

      // Start playing with a delay
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            fadeVolume(audioRef.current, 0.35, 1500);
          })
          .catch(() => {
            // Autoplay blocked, show tooltip to interact
            setTimeout(() => setShowTooltip(true), 3000);
          });
      }
    } else {
      // First-time or muted preference: show premium invite tooltip after 3.5s
      const shownTooltipBefore = sessionStorage.getItem('audio_tooltip_shown');
      if (!shownTooltipBefore) {
        const timer = setTimeout(() => {
          setShowTooltip(true);
          sessionStorage.setItem('audio_tooltip_shown', 'true');
        }, 3500);
        return () => clearTimeout(timer);
      }
    }

    // Auto-dismiss tooltip after 8s
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);


  // 3. Smooth Volume Fader (Fade In / Fade Out)
  const fadeVolume = (audioEl, targetVolume, durationMs) => {
    if (!audioEl) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const stepTime = 50; // interval steps
    const steps = durationMs / stepTime;
    const initialVolume = audioEl.volume;
    const volumeDelta = (targetVolume - initialVolume) / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVolume = initialVolume + volumeDelta * currentStep;
      
      // Safety guards
      if (newVolume >= 0 && newVolume <= 1) {
        audioEl.volume = newVolume;
      }

      if (currentStep >= steps) {
        audioEl.volume = targetVolume;
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    }, stepTime);
  };

  // 4. Smoothly switch tracks (Fade out, switch src, play, fade in)
  const handleTrackTransition = async (newTrackKey) => {
    setActiveTrackKey(newTrackKey);
    
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const newTrack = DESTINATION_TRACKS[newTrackKey];

    if (isPlaying) {
      // Fade out volume to 0
      fadeVolume(audioEl, 0, 600);
      
      setTimeout(() => {
        audioEl.src = newTrack.url;
        audioEl.load();
        
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              fadeVolume(audioEl, 0.35, 1200);
            })
            .catch(err => {
              console.warn('Autoplay block on track change:', err);
              setIsPlaying(false);
            });
        }
      }, 650);
    } else {
      // Just update src quietly
      audioEl.src = newTrack.url;
      audioEl.load();
    }
  };

  // 5. Toggle audio play/mute on speaker click
  const togglePlay = () => {
    let audioEl = audioRef.current;
    if (!audioEl) {
      audioEl = new Audio(DESTINATION_TRACKS[activeTrackKey].url);
      audioEl.loop = true;
      audioEl.volume = 0;
      audioRef.current = audioEl;
    }

    setShowTooltip(false);

    if (isPlaying) {
      // Fade out and pause
      fadeVolume(audioEl, 0, 500);
      setTimeout(() => {
        audioEl.pause();
        setIsPlaying(false);
      }, 550);
      localStorage.setItem('ambient_audio_enabled', 'false');
    } else {
      // Play and fade in
      audioEl.src = DESTINATION_TRACKS[activeTrackKey].url;
      audioEl.load();
      
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            fadeVolume(audioEl, 0.35, 1200);
            localStorage.setItem('ambient_audio_enabled', 'true');
          })
          .catch(err => {
            console.error('Audio play failed:', err);
          });
      }
    }
  };

  const isPackageDetails = location.pathname.startsWith('/package/');
  const activeTrack = DESTINATION_TRACKS[activeTrackKey];
  const ENABLE_TOP_POSITION_MOBILE_AUDIO = true; // Set to false to rollback to original bottom-left style

  return (
    <>
      {/* 2. Floating Speaker Control Button & Invite Tooltip */}
      <div 
        className={`fixed z-50 transition-all duration-300 ${
          isPackageDetails 
            ? 'bottom-3 left-4 md:bottom-6 md:left-6' // Aligned with the booking pill on mobile, bottom-left on desktop
            : 'bottom-3 left-4 md:bottom-6 md:left-6'
        }`}
      >
        <div className="relative flex items-center justify-end">
          
          {/* Active Vibe Glow */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full bg-[#C9A227]/25 animate-ping -z-10 scale-125" />
          )}
 
          {/* Premium Invite Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="absolute left-16 bottom-1.5 bg-gradient-to-r from-[#071428]/95 to-[#071428]/95 backdrop-blur-md text-white text-[11px] md:text-xs font-black px-4 py-2.5 rounded-xl border border-[#C9A227]/40 shadow-xl whitespace-nowrap z-50 flex items-center gap-2 select-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227] animate-spin" />
                <span>🔊 فعّل التجربة الصوتية الفاخرة لوجهتك</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse ml-1" />
              </motion.div>
            )}
          </AnimatePresence>
 
          {/* Floating Action Button */}
          <motion.button
            onClick={togglePlay}
            className={`w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_30px_rgba(201,162,39,0.25)] border relative ${
              isPlaying
                ? 'bg-gradient-to-tr from-[#071428] via-[#071428] to-[#071428] border-[#C9A227] text-[#C9A227]'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
            }`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            title={isPlaying ? "كتم الموسيقى الخلفية" : "تفعيل الموسيقى المحيطية"}
            aria-label="التحكم بالموسيقى الخلفية"
          >
            {isPlaying ? (
              <div className="flex items-center justify-center relative">
                {/* 3 Animated bars for music playing visualizer */}
                <div className="flex gap-0.5 items-end justify-center h-4.5 w-6">
                  <span className="w-0.75 bg-[#C9A227] rounded-full animate-[music-bar-1_0.8s_ease-in-out_infinite]" />
                  <span className="w-0.75 bg-[#C9A227] rounded-full animate-[music-bar-2_1.1s_ease-in-out_infinite] h-4" />
                  <span className="w-0.75 bg-[#C9A227] rounded-full animate-[music-bar-3_0.9s_ease-in-out_infinite]" />
                </div>
                <Volume2 className="w-4.5 h-4.5 absolute -top-2.5 -right-2.5 bg-[#071428] p-0.5 rounded-full border border-[#C9A227] text-[#C9A227]" />
              </div>
            ) : (
              <div className="flex items-center justify-center relative">
                <VolumeX className="w-6 h-6 text-slate-400" />
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Styled animation keyframes embedded directly */}
      <style>{`
        @keyframes music-bar-1 {
          0%, 100% { height: 6px; }
          50% { height: 18px; }
        }
        @keyframes music-bar-2 {
          0%, 100% { height: 16px; }
          50% { height: 6px; }
        }
        @keyframes music-bar-3 {
          0%, 100% { height: 8px; }
          50% { height: 18px; }
        }
      `}</style>
    </>
  );
};

export default AmbientAudio;

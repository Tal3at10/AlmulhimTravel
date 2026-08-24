import { useState, useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';

/**
 * OptimizedVideo - Smart video component for performance
 * 
 * Features:
 * - Cloudinary URL optimization (f_auto, q_auto, w_600 for mobile)
 * - Lazy loading with IntersectionObserver
 * - Focus Play: Only plays when >70% visible (mobile scroll-to-play)
 * - forceAutoplay: For Hero sections - always autoplay
 * - Controlled playback via isActive prop (desktop hover)
 */
const OptimizedVideo = ({
  src,
  poster,
  isActive = false,
  playOnMobile = false,
  forceAutoplay = false,
  className = '',
  ...props
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  
  // Check if >70% visible for Focus Play (mobile scroll-to-play)
  const isInView = useInView(containerRef, { 
    amount: 0.7,
    once: false 
  });

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia('(max-width: 768px)').matches || 
        'ontouchstart' in window
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load video when in viewport (or immediately if forceAutoplay)
  useEffect(() => {
    if (forceAutoplay) {
      setShouldLoad(true);
    } else if (isInView && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isInView, shouldLoad, forceAutoplay]);

  // Determine if video should play
  const shouldPlay = () => {
    // Force autoplay (Hero sections) - always play when visible
    if (forceAutoplay) {
      return isInView;
    }
    
    // Mobile: Focus Play - only play when >70% visible
    if (isMobile && playOnMobile) {
      return isInView;
    }
    
    // Desktop: Play on hover (controlled by isActive prop)
    if (!isMobile) {
      return isActive;
    }
    
    return false;
  };

  // Control video playback
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (shouldPlay()) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      if (!forceAutoplay) {
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive, isInView, isMobile, forceAutoplay, playOnMobile]);

  // Optimize Cloudinary URL
  const getOptimizedUrl = (url) => {
    if (!url) return url;
    
    // Check if it's a Cloudinary URL
    if (url.includes('res.cloudinary.com')) {
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        const transformations = isMobile 
          ? 'f_auto,q_auto,w_600' 
          : 'f_auto,q_auto';
        return `${parts[0]}/upload/${transformations}/${parts[1]}`;
      }
    }
    
    return url;
  };

  // On mobile without playOnMobile and not forceAutoplay, just show poster
  if (isMobile && !playOnMobile && !forceAutoplay) {
    return (
      <div ref={containerRef} className={className}>
        <img
          src={poster}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  const optimizedSrc = getOptimizedUrl(src);
  const isPlaying = shouldPlay();

  return (
    <div ref={containerRef} className={className}>
      {/* Poster image - visible when video not playing */}
      <img
        src={poster}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Video - only rendered when should load */}
      {shouldLoad && (
        <video
          ref={videoRef}
          src={optimizedSrc}
          poster={poster}
          autoPlay={forceAutoplay}
          muted
          loop
          playsInline
          preload={forceAutoplay ? 'auto' : 'metadata'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedVideo;

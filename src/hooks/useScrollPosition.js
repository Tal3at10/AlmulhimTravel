import { useState, useEffect, useRef } from 'react';

export const useScrollPosition = (threshold = 50) => {
  const [isScrolled, setIsScrolled] = useState(() => {
    // Initialize immediately for SSR safety
    if (typeof window !== 'undefined') {
      return window.scrollY > threshold;
    }
    return false;
  });

  useEffect(() => {
    // Dual approach: scroll event + IntersectionObserver for maximum compatibility
    
    // 1. Scroll event (works everywhere, may lag on older iOS during momentum)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial

    // 2. IntersectionObserver sentinel (instant on iOS, no throttle)
    let observer = null;
    let sentinel = null;

    if ('IntersectionObserver' in window) {
      sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = `position:absolute;top:${threshold}px;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden;`;
      document.body.appendChild(sentinel);

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsScrolled(!entry.isIntersecting);
        },
        { threshold: [0, 1] }
      );
      observer.observe(sentinel);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
      if (sentinel && sentinel.parentNode) {
        sentinel.parentNode.removeChild(sentinel);
      }
    };
  }, [threshold]);

  return isScrolled;
};

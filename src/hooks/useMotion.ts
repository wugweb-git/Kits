import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Respects system-level accessibility preferences
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for scroll position tracking
 */
export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
}

/**
 * Hook to detect if element is in viewport with Intersection Observer
 */
export function useInView(
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
): [React.RefObject<HTMLElement>, boolean] {
  const [isInView, setIsInView] = useState(false);
  const [ref, setRef] = useState<React.RefObject<HTMLElement>>({ current: null });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      // Only trigger once when entering viewport
      if (entry.isIntersecting && !isInView) {
        setIsInView(true);
        observer.disconnect(); // Stop observing after first trigger
      }
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref.current, options, isInView]);

  // Create ref object on mount
  useEffect(() => {
    setRef({ current: null } as React.RefObject<HTMLElement>);
  }, []);

  return [ref, isInView];
}

/**
 * Get motion duration adjusted for reduced motion preference
 */
export function getMotionDuration(
  duration: number,
  prefersReducedMotion: boolean
): number {
  return prefersReducedMotion ? duration * 0.4 : duration; // 60% reduction
}

/**
 * Get CSS transition string respecting reduced motion
 */
export function getMotionTransition(
  property: string,
  duration: string,
  easing: string,
  prefersReducedMotion: boolean
): string {
  if (prefersReducedMotion) {
    return `${property} 0.01ms linear`; // Near-instant for reduced motion
  }
  return `${property} ${duration} ${easing}`;
}

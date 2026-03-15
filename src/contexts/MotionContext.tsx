import React, { createContext, useContext, useState, useEffect } from 'react';

interface MotionContextType {
  prefersReducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check system preference
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

  const toggleReducedMotion = () => {
    setPrefersReducedMotion(prev => !prev);
  };

  return (
    <MotionContext.Provider value={{ prefersReducedMotion, toggleReducedMotion }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotionContext() {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error('useMotionContext must be used within a MotionProvider');
  }
  return context;
}

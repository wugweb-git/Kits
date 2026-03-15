import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useMotion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  staggerChildren?: boolean;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

/**
 * ScrollReveal component - Reveals content with fade + slide animation when scrolled into view
 * - Respects prefers-reduced-motion
 * - Supports staggered children animations
 * - Only animates once per element
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  stagger = 80,
  staggerChildren = false,
  className = '',
  style = {},
  disabled = false,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Skip animation if disabled or already animated
    if (disabled || hasAnimated) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Intersection Observer to detect when element enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          observer.disconnect(); // Only animate once
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before element is fully visible
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [disabled, hasAnimated]);

  // Get appropriate duration and translate based on reduced motion preference
  const getDuration = () => {
    if (prefersReducedMotion) return 'var(--motion-duration-xs)'; // 60ms
    return 'var(--motion-duration-medium)'; // 180ms
  };

  const getTranslateY = () => {
    if (prefersReducedMotion) return '0px';
    // Check if mobile
    if (window.innerWidth < 768) return 'var(--reveal-translate-y-mobile)'; // 12px
    return 'var(--reveal-translate-y)'; // 24px
  };

  const baseStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : `translateY(${getTranslateY()})`,
    transition: prefersReducedMotion
      ? 'none'
      : `opacity ${getDuration()} var(--motion-easing-soft) ${delay}ms, transform ${getDuration()} var(--motion-easing-soft) ${delay}ms`,
    ...style,
  };

  // If staggering children, wrap in a container that applies delays
  if (staggerChildren && React.Children.count(children) > 1) {
    return (
      <div ref={ref} className={className} style={baseStyle}>
        {React.Children.map(children, (child, index) => {
          const childDelay = delay + index * stagger;
          return (
            <div
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : `translateY(${getTranslateY()})`,
                transition: prefersReducedMotion
                  ? 'none'
                  : `opacity ${getDuration()} var(--motion-easing-soft) ${childDelay}ms, transform ${getDuration()} var(--motion-easing-soft) ${childDelay}ms`,
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={baseStyle}>
      {children}
    </div>
  );
};

/**
 * Simple fade-in reveal without translate
 */
export const FadeReveal: React.FC<Omit<ScrollRevealProps, 'staggerChildren'>> = ({
  children,
  delay = 0,
  className = '',
  style = {},
  disabled = false,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (disabled || hasAnimated) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [disabled, hasAnimated]);

  const baseStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transition: prefersReducedMotion
      ? 'none'
      : `opacity var(--motion-duration-medium) var(--motion-easing-soft) ${delay}ms`,
    ...style,
  };

  return (
    <div ref={ref} className={className} style={baseStyle}>
      {children}
    </div>
  );
};

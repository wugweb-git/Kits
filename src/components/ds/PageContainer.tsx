import React from 'react';
import { useBreakpoint } from '../../hooks/useMediaQuery';
import { getLayoutPadding, getSectionSpacing } from '../../utils/layout';

interface PageContainerProps {
  children: React.ReactNode;
  /** Apply section spacing padding (top/bottom) */
  withSectionSpacing?: boolean;
  /** Custom max-width override */
  maxWidth?: string;
  /** Remove default padding */
  noPadding?: boolean;
}

/**
 * PageContainer Component
 * 
 * Enforces NEW global layout padding standards:
 * - Desktop: 0px left & right (centered with max-width)
 * - Tablet: 0px left & right (centered with max-width)
 * - Mobile: 20px left & right
 * 
 * All pages should wrap their content in this component
 * to maintain consistent horizontal alignment.
 */
export function PageContainer({ 
  children, 
  withSectionSpacing = false,
  maxWidth,
  noPadding = false
}: PageContainerProps) {
  const { isMobile, isTablet } = useBreakpoint();
  
  return (
    <div style={{
      width: '100%',
      maxWidth: maxWidth || 'var(--content-max-width)', // Default: 1100px
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: noPadding ? 0 : getLayoutPadding(isMobile, isTablet),
      paddingRight: noPadding ? 0 : getLayoutPadding(isMobile, isTablet),
      paddingTop: withSectionSpacing ? getSectionSpacing(isMobile, isTablet) : 0,
      paddingBottom: withSectionSpacing ? getSectionSpacing(isMobile, isTablet) : 0,
      boxSizing: 'border-box'
    }}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  /** Apply background surface */
  surface?: '1000' | '950' | '900' | '850' | '800';
  /** Add border */
  withBorder?: boolean;
  /** Custom padding override */
  padding?: string;
  /** Full width section (ignores container padding) */
  fullWidth?: boolean;
}

/**
 * Section Component
 * 
 * Wrapper for content sections with consistent vertical spacing
 * and optional backgrounds/borders
 */
export function Section({ 
  children, 
  surface, 
  withBorder = false, 
  padding,
  fullWidth = false
}: SectionProps) {
  const { isMobile, isTablet } = useBreakpoint();
  
  return (
    <section style={{
      width: fullWidth ? '100%' : 'auto',
      paddingTop: padding || getSectionSpacing(isMobile, isTablet),
      paddingBottom: padding || getSectionSpacing(isMobile, isTablet),
      background: surface ? `var(--surface-${surface})` : 'transparent',
      borderTop: withBorder ? '1px solid var(--surface-800)' : 'none',
      borderBottom: withBorder ? '1px solid var(--surface-800)' : 'none'
    }}>
      {children}
    </section>
  );
}

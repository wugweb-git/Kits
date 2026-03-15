/**
 * Global Layout System Utilities
 * 
 * RESET: Enforces NEW horizontal padding standards:
 * - Desktop: 0px left & right (content centered with max-width)
 * - Tablet: 0px left & right (content centered with max-width)
 * - Mobile: 20px left & right
 */

export interface LayoutPadding {
  desktop: string;
  tablet: string;
  mobile: string;
}

export interface SectionSpacing {
  desktop: string;
  tablet: string;
  mobile: string;
}

/**
 * Global horizontal padding tokens
 * Desktop/Tablet: 0px | Mobile: 20px
 */
export const layoutPadding: LayoutPadding = {
  desktop: 'var(--layout-padding-desktop)', // 0px
  tablet: 'var(--layout-padding-tablet)',   // 0px
  mobile: 'var(--layout-padding-mobile)'    // 20px
};

/**
 * Vertical section spacing tokens
 */
export const sectionSpacing: SectionSpacing = {
  desktop: 'var(--section-spacing-desktop)', // 64px
  tablet: 'var(--section-spacing-tablet)',   // 48px
  mobile: 'var(--section-spacing-mobile)'    // 32px
};

/**
 * Get responsive padding based on breakpoint
 * Desktop/Tablet: 0px | Mobile: 20px
 */
export function getLayoutPadding(isMobile: boolean, isTablet: boolean): string {
  if (isMobile) return layoutPadding.mobile;
  if (isTablet) return layoutPadding.tablet;
  return layoutPadding.desktop;
}

/**
 * Get responsive section spacing based on breakpoint
 */
export function getSectionSpacing(isMobile: boolean, isTablet: boolean): string {
  if (isMobile) return sectionSpacing.mobile;
  if (isTablet) return sectionSpacing.tablet;
  return sectionSpacing.desktop;
}

/**
 * Container style for content pages with unified padding
 * Desktop/Tablet: 0px padding, centered with max-width
 * Mobile: 20px left & right padding
 */
export function getContainerStyle(isMobile: boolean, isTablet: boolean): React.CSSProperties {
  return {
    width: '100%',
    maxWidth: 'var(--content-max-width)', // 1100px
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: getLayoutPadding(isMobile, isTablet),
    paddingRight: getLayoutPadding(isMobile, isTablet),
    boxSizing: 'border-box'
  };
}

/**
 * Section wrapper style with consistent vertical spacing
 */
export function getSectionStyle(isMobile: boolean, isTablet: boolean): React.CSSProperties {
  return {
    paddingTop: getSectionSpacing(isMobile, isTablet),
    paddingBottom: getSectionSpacing(isMobile, isTablet)
  };
}

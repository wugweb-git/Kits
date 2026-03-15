// Responsive spacing utilities based on design tokens
export const spacing = {
  // Section gaps
  sectionGap: {
    mobile: '32px',
    tablet: '40px',
    desktop: '48px'
  },
  // Container padding
  containerPadding: {
    mobile: '16px',
    tablet: '24px',
    desktop: '32px'
  },
  // Card padding
  cardPadding: {
    mobile: '16px',
    tablet: '20px',
    desktop: '24px'
  },
  // Vertical spacing
  verticalSpacing: {
    xs: { mobile: '8px', tablet: '12px', desktop: '16px' },
    sm: { mobile: '12px', tablet: '16px', desktop: '20px' },
    md: { mobile: '16px', tablet: '20px', desktop: '24px' },
    lg: { mobile: '24px', tablet: '32px', desktop: '40px' },
    xl: { mobile: '32px', tablet: '40px', desktop: '48px' }
  }
};

// Typography scaling per breakpoint
export const typography = {
  // Display - Hero headings
  display: {
    mobile: 'var(--text-xl)',     // 1.5rem (24px) - was 2xl
    tablet: 'var(--text-2xl)',    // 2.25rem (36px) - was 3xl
    desktop: 'var(--text-3xl)'    // 3rem (48px)
  },
  // H1 - Page titles
  h1: {
    mobile: 'var(--text-xl)',     // 1.5rem (24px)
    tablet: 'var(--text-2xl)',    // 2.25rem (36px)
    desktop: 'var(--text-2xl)'    // 2.25rem (36px)
  },
  // H2 - Section headings
  h2: {
    mobile: 'var(--text-base)',   // 1rem (16px) - reduced by one step from lg
    tablet: 'var(--text-xl)',     // 1.5rem (24px)
    desktop: 'var(--text-xl)'     // 1.5rem (24px)
  },
  // H3 - Subsection headings
  h3: {
    mobile: 'var(--text-base)',   // 1rem (16px)
    tablet: 'var(--text-lg)',     // 1.25rem (20px)
    desktop: 'var(--text-lg)'     // 1.25rem (20px)
  },
  // H4 - Card titles
  h4: {
    mobile: 'var(--text-sm)',     // 0.875rem (14px)
    tablet: 'var(--text-base)',   // 1rem (16px)
    desktop: 'var(--text-base)'   // 1rem (16px)
  },
  // Body text
  body: {
    mobile: 'var(--text-sm)',     // 0.875rem (14px)
    tablet: 'var(--text-base)',   // 1rem (16px)
    desktop: 'var(--text-base)'   // 1rem (16px)
  },
  // Large body
  bodyLarge: {
    mobile: 'var(--text-base)',   // 1rem (16px)
    tablet: 'var(--text-lg)',     // 1.25rem (20px)
    desktop: 'var(--text-lg)'     // 1.25rem (20px)
  },
  // Small text
  small: {
    mobile: 'var(--text-xs)',     // 0.75rem (12px)
    tablet: 'var(--text-sm)',     // 0.875rem (14px)
    desktop: 'var(--text-sm)'     // 0.875rem (14px)
  },
  // Caption/helper text
  caption: {
    mobile: 'var(--text-xs)',     // 0.75rem (12px)
    tablet: 'var(--text-xs)',     // 0.75rem (12px)
    desktop: 'var(--text-xs)'     // 0.75rem (12px)
  }
};

// Helper to get responsive value
export function getResponsiveValue<T>(
  values: { mobile: T; tablet: T; desktop: T },
  breakpoint: 'mobile' | 'tablet' | 'desktop'
): T {
  return values[breakpoint];
}

// Grid columns per breakpoint
export const gridColumns = {
  mobile: 4,
  tablet: 8,
  desktop: 12
};

// Max widths
export const maxWidth = {
  mobile: '100%',
  tablet: '100%',
  desktop: '1440px'
};
import React from 'react';

export interface GridProps {
  /** Number of columns */
  columns?: number | { sm?: number; md?: number; lg?: number };
  /** Gap between items */
  gap?: string;
  /** Children elements */
  children: React.ReactNode;
  /** Optional className for custom styling */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * Grid Component
 * 
 * A flexible grid layout component for organizing content in columns.
 * Uses CSS Grid with full CSS variable support.
 * 
 * @example
 * <Grid columns={3} gap="var(--spacing-4)">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 */
export function Grid({
  columns = 1,
  gap = 'var(--spacing-4)',
  children,
  className = '',
  style = {},
}: GridProps) {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap,
    ...style,
  };

  if (typeof columns === 'number') {
    gridStyle.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  } else {
    // Responsive columns
    const { sm = 1, md = 2, lg = 3 } = columns;
    gridStyle.gridTemplateColumns = `repeat(${sm}, 1fr)`;
    
    // Use CSS custom properties for responsive design
    if (md || lg) {
      gridStyle.gridTemplateColumns = `repeat(auto-fit, minmax(min(100%, ${300 / (lg || md || sm)}px), 1fr))`;
    }
  }

  return (
    <div
      className={className}
      style={gridStyle}
    >
      {children}
    </div>
  );
}

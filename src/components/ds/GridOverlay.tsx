import React from 'react';
import { useBreakpoint } from '../../hooks/useMediaQuery';

export function GridOverlay({ isVisible }: { isVisible: boolean }) {
  const { isMobile, isTablet } = useBreakpoint();
  
  if (!isVisible) return null;

  const columns = isMobile ? 4 : isTablet ? 8 : 12;
  const gutter = isMobile ? '16px' : isTablet ? '16px' : '24px';
  const margin = isMobile ? '16px' : isTablet ? '32px' : '48px';
  const maxWidth = '1440px';

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: maxWidth,
          height: '100%',
          paddingLeft: margin,
          paddingRight: margin,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          columnGap: gutter,
          boxSizing: 'border-box',
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div 
            key={i} 
            style={{
              height: '100%',
              background: 'rgba(255, 0, 0, 0.05)',
              borderLeft: '1px solid rgba(255, 0, 0, 0.1)',
              borderRight: '1px solid rgba(255, 0, 0, 0.1)',
            }} 
          />
        ))}
      </div>
    </div>
  );
}

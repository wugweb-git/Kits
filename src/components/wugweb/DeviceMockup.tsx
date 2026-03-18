import React from 'react';

export interface DeviceMockupProps {
  children: React.ReactNode;
  device?: 'phone' | 'tablet' | 'laptop' | 'desktop';
  variant?: 'ios' | 'android' | 'default';
  orientation?: 'portrait' | 'landscape';
  showFrame?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DeviceMockup Component
 * 
 * Display content inside device frame mockups.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <DeviceMockup device="phone" variant="ios">
 *   <img src="/screenshot.png" alt="App" />
 * </DeviceMockup>
 */
export function DeviceMockup({
  children,
  device = 'phone',
  variant = 'default',
  orientation = 'portrait',
  showFrame = true,
  className = '',
  style = {},
}: DeviceMockupProps) {
  const isLandscape = orientation === 'landscape';

  const deviceSizes = {
    phone: {
      width: isLandscape ? '812px' : '375px',
      height: isLandscape ? '375px' : '812px',
      borderRadius: 'var(--radius-6)',
    },
    tablet: {
      width: isLandscape ? '1024px' : '768px',
      height: isLandscape ? '768px' : '1024px',
      borderRadius: 'var(--radius-7)',
    },
    laptop: {
      width: '1280px',
      height: '800px',
      borderRadius: 'var(--radius-5)',
    },
    desktop: {
      width: '1920px',
      height: '1080px',
      borderRadius: 'var(--radius-3)',
    },
  };

  const currentDevice = deviceSizes[device];

  return (
    <div
      className={className}
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: currentDevice.width,
          height: currentDevice.height,
          maxWidth: '100%',
          aspectRatio: `${parseInt(currentDevice.width)} / ${parseInt(currentDevice.height)}`,
          ...(showFrame && {
            padding: device === 'phone' ? '12px' : device === 'tablet' ? '16px' : '20px',
            background: variant === 'ios' ? '#1F1F1F' : variant === 'android' ? '#2C2C2C' : 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: currentDevice.borderRadius,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }),
        }}
      >
        {/* Notch for iOS */}
        {showFrame && variant === 'ios' && device === 'phone' && !isLandscape && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '150px',
              height: '28px',
              background: '#1F1F1F',
              borderRadius: '0 0 var(--radius-3) var(--radius-3)',
              zIndex: 10,
            }}
          />
        )}

        {/* Camera for laptop */}
        {showFrame && device === 'laptop' && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '6px',
              background: 'var(--muted-foreground)',
              borderRadius: '50%',
              zIndex: 10,
            }}
          />
        )}

        {/* Screen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'var(--background)',
            borderRadius: showFrame
              ? device === 'phone'
                ? 'var(--radius-5)'
                : device === 'tablet'
                ? 'var(--radius-6)'
                : 'var(--radius-3)'
              : currentDevice.borderRadius,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {children}
        </div>

        {/* Home Indicator for iOS */}
        {showFrame && variant === 'ios' && device === 'phone' && !isLandscape && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 'var(--radius-full)',
            }}
          />
        )}
      </div>

      {/* Stand for laptop */}
      {showFrame && device === 'laptop' && (
        <>
          <div
            style={{
              width: '60%',
              height: '8px',
              background: 'var(--muted)',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)',
            }}
          />
          <div
            style={{
              width: '80%',
              height: '12px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderTop: 'none',
              borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            }}
          />
        </>
      )}
    </div>
  );
}

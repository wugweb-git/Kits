import React from 'react';

export interface IndicatorProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 's' | 'm' | 'l';
  pulse?: boolean;
  label?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Indicator Component
 * 
 * Status indicator dot with optional pulse animation.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <Indicator variant="success" pulse>
 *   <Avatar />
 * </Indicator>
 * 
 * <Indicator variant="error" label="Offline" position="inline" />
 */
export function Indicator({
  variant = 'default',
  size = 'm',
  pulse = false,
  label,
  position = 'inline',
  children,
  className = '',
  style = {},
}: IndicatorProps) {
  const sizeMap = {
    s: 8,
    m: 12,
    l: 16,
  };

  const dotSize = sizeMap[size];

  const variantColors = {
    default: 'var(--muted-foreground)',
    success: 'var(--success)',
    warning: 'var(--accent)',
    error: 'var(--destructive)',
    info: 'var(--accent)',
  };

  const dotColor = variantColors[variant];

  const positionStyles = {
    'top-right': { top: 0, right: 0 },
    'top-left': { top: 0, left: 0 },
    'bottom-right': { bottom: 0, right: 0 },
    'bottom-left': { bottom: 0, left: 0 },
    inline: {},
  };

  const dot = (
    <span
      style={{
        display: 'inline-block',
        width: `${dotSize}px`,
        height: `${dotSize}px`,
        background: dotColor,
        borderRadius: '50%',
        border: '2px solid var(--background)',
        boxShadow: '0 0 0 1px var(--border)',
        ...(pulse && {
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }),
      }}
    >
      {pulse && (
        <style>
          {`
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.5;
              }
            }
          `}
        </style>
      )}
    </span>
  );

  if (position === 'inline') {
    return (
      <div
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          ...style,
        }}
      >
        {dot}
        {label && (
          <span
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: size === 's' ? 'var(--text-sm)' : size === 'm' ? 'var(--text-base)' : 'var(--text-lg)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--foreground)',
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          ...positionStyles[position],
          transform: 'translate(25%, -25%)',
        }}
      >
        {dot}
      </span>
    </div>
  );
}

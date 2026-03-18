import React from 'react';

export interface SpinnerProps {
  size?: 's' | 'm' | 'l' | 'xl';
  color?: 'default' | 'accent' | 'muted';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Spinner Component
 * 
 * Loading indicator with smooth rotation animation.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <Spinner />
 * <Spinner size="l" color="accent" />
 */
export function Spinner({
  size = 'm',
  color = 'default',
  className = '',
  style = {},
}: SpinnerProps) {
  const sizeMap = {
    s: 16,
    m: 24,
    l: 32,
    xl: 48,
  };

  const colorMap = {
    default: 'var(--foreground)',
    accent: 'var(--accent)',
    muted: 'var(--muted-foreground)',
  };

  const spinnerSize = sizeMap[size];
  const spinnerColor = colorMap[color];

  return (
    <div
      className={className}
      role="status"
      aria-label="Loading"
      style={{
        display: 'inline-block',
        width: `${spinnerSize}px`,
        height: `${spinnerSize}px`,
        ...style,
      }}
    >
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: 'spin 1s linear infinite',
        }}
      >
        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={spinnerColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="50 50"
          opacity="0.25"
        />
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12"
          stroke={spinnerColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

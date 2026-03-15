import React from 'react';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the logo */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Variant of the logo */
  variant?: 'full' | 'icon';
  /** Color theme */
  theme?: 'light' | 'dark';
}

export function Logo({
  size = 'md',
  variant = 'full',
  theme = 'dark',
  className,
  style,
  ...props
}: LogoProps) {
  const getSize = () => {
    switch (size) {
      case 'sm': return { width: variant === 'full' ? 100 : 24, height: 24, fontSize: '16px' };
      case 'lg': return { width: variant === 'full' ? 160 : 40, height: 40, fontSize: '24px' };
      case 'xl': return { width: variant === 'full' ? 200 : 48, height: 48, fontSize: '32px' };
      default: return { width: variant === 'full' ? 120 : 32, height: 32, fontSize: '20px' }; // md
    }
  };

  const dimensions = getSize();
  const color = theme === 'light' ? '#000000' : '#FFFFFF';

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        fontFamily: 'Inter Tight, sans-serif',
        fontWeight: 'var(--font-weight-bold)',
        color: color,
        ...style,
      }}
      {...props}
    >
      <svg
        width={dimensions.height}
        height={dimensions.height}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="6" fill="var(--accent)" />
        <path
          d="M16 6L26 26H6L16 6Z"
          fill="var(--accent-foreground)"
          transform="translate(0, 1) scale(0.6) translate(10, 8)"
        />
      </svg>
      {variant === 'full' && (
        <span style={{ fontSize: dimensions.fontSize }}>
          Wugweb
        </span>
      )}
    </div>
  );
}

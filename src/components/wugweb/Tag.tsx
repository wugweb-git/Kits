import React from 'react';

export interface TagProps {
  label?: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export function Tag({
  label = 'Tagname',
  variant = 'outline',
  size = 'sm',
  onClick,
  className = '',
}: TagProps) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={className}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: size === 'sm' ? '4px var(--spacing-2)' : '6px var(--spacing-3)',
        borderRadius: 'var(--radius-full)',
        border: variant === 'outline' ? '0.5px solid var(--foreground)' : 'none',
        background: variant === 'outline' ? 'transparent' : 'var(--muted)',
        fontFamily: 'Inter Tight, sans-serif',
        fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
        fontWeight: 'var(--font-weight-regular)',
        color: 'var(--foreground)',
        whiteSpace: 'nowrap',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all var(--motion-duration-short) var(--motion-easing-standard)',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        if (isClickable && variant === 'outline') {
          e.currentTarget.style.background = 'var(--accent-subtle)';
          e.currentTarget.style.borderColor = 'var(--accent)';
        } else if (isClickable) {
          e.currentTarget.style.background = 'var(--accent)';
          e.currentTarget.style.color = 'var(--accent-foreground)';
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable && variant === 'outline') {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'var(--foreground)';
        } else if (isClickable) {
          e.currentTarget.style.background = 'var(--muted)';
          e.currentTarget.style.color = 'var(--foreground)';
        }
      }}
    >
      {label}
    </div>
  );
}

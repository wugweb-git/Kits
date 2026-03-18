import React from 'react';

export interface KbdProps {
  children: React.ReactNode;
  size?: 's' | 'm' | 'l';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Kbd (Keyboard) Component
 * 
 * Displays keyboard shortcuts with consistent styling.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <Kbd>⌘K</Kbd>
 * <Kbd size="s">Ctrl</Kbd> + <Kbd size="s">C</Kbd>
 */
export function Kbd({
  children,
  size = 'm',
  className = '',
  style = {},
}: KbdProps) {
  const sizeStyles = {
    s: {
      fontSize: 'var(--text-xs)',
      padding: '2px 6px',
      minWidth: '20px',
    },
    m: {
      fontSize: 'var(--text-sm)',
      padding: '4px 8px',
      minWidth: '24px',
    },
    l: {
      fontSize: 'var(--text-base)',
      padding: '6px 10px',
      minWidth: '28px',
    },
  };

  return (
    <kbd
      className={className}
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        fontWeight: 'var(--font-weight-medium)',
        color: 'var(--foreground)',
        background: 'var(--muted)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-1)',
        boxShadow: '0 1px 0 rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...sizeStyles[size],
        ...style,
      }}
    >
      {children}
    </kbd>
  );
}

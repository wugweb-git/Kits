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
      padding: 'var(--kbd-padding-y-sm) var(--kbd-padding-x-sm)',
      minWidth: 'var(--kbd-min-width-sm)',
    },
    m: {
      fontSize: 'var(--text-sm)',
      padding: 'var(--kbd-padding-y-md) var(--kbd-padding-x-md)',
      minWidth: 'var(--kbd-min-width-md)',
    },
    l: {
      fontSize: 'var(--text-base)',
      padding: 'var(--kbd-padding-y-lg) var(--kbd-padding-x-lg)',
      minWidth: 'var(--kbd-min-width-lg)',
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
        border: 'var(--kbd-border)',
        borderRadius: 'var(--kbd-radius)',
        boxShadow: 'var(--kbd-shadow)',
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

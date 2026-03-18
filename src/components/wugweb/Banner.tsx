import React from 'react';
import { X, LucideIcon } from 'lucide-react';

export interface BannerProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: LucideIcon;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Banner Component
 * 
 * Full-width announcement banner with variants.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <Banner variant="info" icon={Info} dismissible>
 *   New features available! Check them out.
 * </Banner>
 */
export function Banner({
  children,
  variant = 'info',
  icon: Icon,
  dismissible = false,
  onDismiss,
  className = '',
  style = {},
}: BannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const variantStyles = {
    info: {
      background: 'var(--accent-subtle)',
      color: 'var(--foreground)',
      borderColor: 'var(--accent)',
    },
    success: {
      background: 'var(--success-subtle)',
      color: 'var(--success-foreground)',
      borderColor: 'var(--success)',
    },
    warning: {
      background: 'rgba(255, 190, 26, 0.1)',
      color: 'var(--foreground)',
      borderColor: 'var(--accent)',
    },
    error: {
      background: 'var(--destructive-subtle)',
      color: 'var(--destructive-foreground)',
      borderColor: 'var(--destructive)',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div
      className={className}
      role="banner"
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-3)',
        width: '100%',
        padding: 'var(--spacing-4) var(--spacing-6)',
        background: currentVariant.background,
        color: currentVariant.color,
        borderTop: `3px solid ${currentVariant.borderColor}`,
        borderBottom: `1px solid ${currentVariant.borderColor}`,
        ...style,
      }}
    >
      {/* Icon */}
      {Icon && (
        <div style={{ flexShrink: 0 }}>
          <Icon size={20} />
        </div>
      )}

      {/* Content */}
      <div
        style={{
          flex: 1,
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-regular)',
        }}
      >
        {children}
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: 'currentColor',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--radius-sm)',
            transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

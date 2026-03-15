import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface BadgeProps {
  label: string;
  tone?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'neutral';
  style?: 'solid' | 'subtle' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'none' | 'leading' | 'trailing';
  showDot?: boolean;
  count?: number;
  className?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      label,
      tone = 'default',
      style = 'solid',
      size = 'md',
      icon: Icon,
      iconPosition = 'none',
      showDot = false,
      count,
      className = '',
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      // Trigger appearance animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    }, []);

    // Size configurations - Strictly enforcing unique typography per size
    const sizeStyles = {
      sm: {
        padding: '0 8px',
        fontSize: 'var(--text-xs)', // 12px
        lineHeight: '14px',
        height: '22px',
        iconSize: 12,
        gap: '4px',
        dotSize: '6px',
      },
      md: {
        padding: '0 10px',
        fontSize: 'var(--text-sm)', // 14px
        lineHeight: '16px',
        height: '26px',
        iconSize: 14,
        gap: '6px',
        dotSize: '8px',
      },
      lg: {
        padding: '0 14px',
        fontSize: 'var(--text-base)', // 16px
        lineHeight: '20px',
        height: '32px',
        iconSize: 16,
        gap: '8px',
        dotSize: '8px',
      },
    };

    // Get tone styles based on style variant
    const getToneStyles = () => {
      const solidStyles = {
        default: {
          background: 'var(--surface-700)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
        primary: {
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: '1px solid var(--primary)',
        },
        secondary: {
          background: 'var(--secondary)',
          color: 'var(--secondary-foreground)',
          border: '1px solid var(--secondary)',
        },
        success: {
          background: 'var(--success)',
          color: 'var(--success-foreground)',
          border: '1px solid var(--success)',
        },
        warning: {
          background: 'var(--accent)',
          color: 'var(--accent-foreground)',
          border: '1px solid var(--accent)',
        },
        info: {
          background: 'var(--accent)',
          color: 'var(--accent-foreground)',
          border: '1px solid var(--accent)',
        },
        neutral: {
          background: 'var(--muted)',
          color: 'var(--muted-foreground)',
          border: '1px solid var(--border)',
        },
      };

      const subtleStyles = {
        default: {
          background: 'var(--surface-800)',
          color: 'var(--foreground)',
          border: '1px solid transparent',
        },
        primary: {
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'var(--foreground)',
          border: '1px solid transparent',
        },
        secondary: {
          background: 'var(--surface-700)',
          color: 'var(--foreground)',
          border: '1px solid transparent',
        },
        success: {
          background: 'var(--success-subtle)',
          color: 'var(--success)',
          border: '1px solid transparent',
        },
        warning: {
          background: 'var(--accent-subtle)',
          color: 'var(--accent)',
          border: '1px solid transparent',
        },
        info: {
          background: 'var(--accent-subtle)',
          color: 'var(--accent)',
          border: '1px solid transparent',
        },
        neutral: {
          background: 'var(--surface-800)',
          color: 'var(--muted-foreground)',
          border: '1px solid transparent',
        },
      };

      const outlineStyles = {
        default: {
          background: 'transparent',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
        primary: {
          background: 'transparent',
          color: 'var(--primary)',
          border: '1px solid var(--primary)',
        },
        secondary: {
          background: 'transparent',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
        success: {
          background: 'transparent',
          color: 'var(--success)',
          border: '1px solid var(--success)',
        },
        warning: {
          background: 'transparent',
          color: 'var(--accent)',
          border: '1px solid var(--accent)',
        },
        info: {
          background: 'transparent',
          color: 'var(--accent)',
          border: '1px solid var(--accent)',
        },
        neutral: {
          background: 'transparent',
          color: 'var(--muted-foreground)',
          border: '1px solid var(--border)',
        },
      };

      if (style === 'subtle') return subtleStyles[tone];
      if (style === 'outline') return outlineStyles[tone];
      return solidStyles[tone];
    };

    const currentSize = sizeStyles[size];
    const currentTone = getToneStyles();

    const showLeadingIcon = Icon && iconPosition === 'leading';
    const showTrailingIcon = Icon && iconPosition === 'trailing';

    return (
      <span
        ref={ref}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: currentSize.gap,
          padding: currentSize.padding,
          height: currentSize.height,
          
          // STRICT TYPOGRAPHY ENFORCEMENT
          fontSize: currentSize.fontSize,
          lineHeight: currentSize.lineHeight,
          
          fontFamily: 'Inter Tight, sans-serif',
          fontWeight: 'var(--font-weight-medium)',
          
          background: currentTone.background,
          color: currentTone.color,
          border: currentTone.border,
          borderRadius: 'var(--radius-full)',
          
          userSelect: 'none',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          position: 'relative',
          
          // Appearance animation
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: `opacity var(--motion-duration-normal) var(--motion-easing-standard), transform var(--motion-duration-normal) var(--motion-easing-standard)`,
        }}
      >
        {/* Dot Indicator */}
        {showDot && (
          <span
            style={{
              width: currentSize.dotSize,
              height: currentSize.dotSize,
              borderRadius: '50%',
              background: 'currentColor',
              flexShrink: 0,
            }}
          />
        )}

        {/* Leading Icon */}
        {showLeadingIcon && (
          <Icon
            size={currentSize.iconSize}
            style={{
              flexShrink: 0,
            }}
          />
        )}

        {/* Label */}
        <span
          style={{
            lineHeight: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            fontFamily: 'inherit',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </span>

        {/* Count Badge */}
        {count !== undefined && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: size === 'sm' ? '14px' : size === 'md' ? '16px' : '18px',
              height: size === 'sm' ? '14px' : size === 'md' ? '16px' : '18px',
              padding: '0 3px',
              fontSize: size === 'sm' ? '9px' : size === 'md' ? '10px' : '11px',
              fontWeight: 'var(--font-weight-semibold)',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 'var(--radius-full)',
              marginLeft: '2px',
              lineHeight: 1, 
            }}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}

        {/* Trailing Icon */}
        {showTrailingIcon && (
          <Icon
            size={currentSize.iconSize}
            style={{
              flexShrink: 0,
            }}
          />
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

import React from 'react';
import { LucideIcon, X } from 'lucide-react';

export interface ChipProps {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'subtle' | 'outline' | 'destructive';
  icon?: LucideIcon;
  iconPosition?: 'none' | 'leading' | 'trailing';
  removable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      label,
      size = 'md',
      tone = 'default',
      icon: Icon,
      iconPosition = 'none',
      removable = false,
      selected = false,
      disabled = false,
      onClick,
      onRemove,
      className = '',
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    // Size tokens
    const sizeStyles = {
      sm: {
        padding: '4px 8px',
        fontSize: 'var(--text-xs)',
        height: '24px',
        iconSize: 12,
        gap: '4px',
      },
      md: {
        padding: '6px 12px',
        fontSize: 'var(--text-sm)',
        height: '32px',
        iconSize: 14,
        gap: '6px',
      },
      lg: {
        padding: '8px 16px',
        fontSize: 'var(--text-base)',
        height: '40px',
        iconSize: 16,
        gap: '8px',
      },
    };

    // Tone styles using design tokens
    const getToneStyles = () => {
      const baseStyles = {
        default: {
          background: selected ? 'var(--accent)' : 'var(--surface-700)',
          color: selected ? 'var(--accent-foreground)' : 'var(--foreground)',
          border: '1px solid var(--border)',
        },
        subtle: {
          background: selected ? 'var(--accent-subtle)' : 'var(--surface-800)',
          color: selected ? 'var(--accent)' : 'var(--foreground)',
          border: '1px solid transparent',
        },
        outline: {
          background: selected ? 'var(--accent-subtle)' : 'transparent',
          color: selected ? 'var(--accent)' : 'var(--foreground)',
          border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        },
        destructive: {
          background: selected ? 'var(--destructive)' : 'var(--destructive-subtle)',
          color: selected ? 'var(--destructive-foreground)' : 'var(--destructive)',
          border: `1px solid ${selected ? 'var(--destructive)' : 'transparent'}`,
        },
      };

      return baseStyles[tone];
    };

    const currentSize = sizeStyles[size];
    const currentTone = getToneStyles();

    const handleClick = (e: React.MouseEvent) => {
      if (disabled) return;
      if (onClick) onClick();
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      if (onRemove) onRemove();
    };

    const showLeadingIcon = Icon && iconPosition === 'leading';
    const showTrailingIcon = Icon && iconPosition === 'trailing' && !removable;

    return (
      <div
        ref={ref}
        role={onClick ? 'button' : removable ? 'button' : 'status'}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-selected={selected}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsActive(false);
        }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as any);
          }
        }}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: currentSize.gap,
          padding: currentSize.padding,
          height: currentSize.height,
          fontSize: currentSize.fontSize,
          fontFamily: 'Inter Tight, sans-serif',
          fontWeight: 'var(--font-weight-medium)',
          background: currentTone.background,
          color: currentTone.color,
          border: currentTone.border,
          borderRadius: 'var(--radius-full)',
          cursor: disabled ? 'not-allowed' : onClick || removable ? 'pointer' : 'default',
          opacity: disabled ? 0.5 : 1,
          transition: `all var(--motion-duration-normal) var(--motion-easing-standard)`,
          outline: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          position: 'relative',
          // Hover state
          ...(isHovered &&
            !disabled && {
              transform: 'translateY(-1px)',
              boxShadow: tone === 'destructive' ? 'var(--focus-ring-destructive)' : 'none',
              filter: 'brightness(1.1)',
            }),
          // Active state
          ...(isActive &&
            !disabled && {
              transform: 'translateY(0)',
              filter: 'brightness(0.95)',
            }),
        }}
      >
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
            lineHeight: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </span>

        {/* Trailing Icon */}
        {showTrailingIcon && (
          <Icon
            size={currentSize.iconSize}
            style={{
              flexShrink: 0,
            }}
          />
        )}

        {/* Remove Button */}
        {removable && (
          <button
            type="button"
            aria-label={`Remove ${label}`}
            onClick={handleRemove}
            disabled={disabled}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: 'inherit',
              transition: `all var(--motion-duration-fast) var(--motion-easing-standard)`,
              flexShrink: 0,
              margin: 0,
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={currentSize.iconSize} />
          </button>
        )}

        {/* Focus Ring */}
        <style>{`
          [role="button"]:focus-visible::after,
          [role="status"]:focus-visible::after {
            content: '';
            position: absolute;
            inset: -3px;
            border-radius: var(--radius-full);
            box-shadow: ${tone === 'destructive' ? 'var(--focus-ring-destructive)' : 'var(--focus-ring-accent)'};
            pointer-events: none;
            animation: focusRingAppear var(--motion-duration-normal) var(--motion-easing-standard);
          }

          @keyframes focusRingAppear {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    );
  }
);

Chip.displayName = 'Chip';

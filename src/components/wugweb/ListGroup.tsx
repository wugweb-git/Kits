import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ListGroupItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  description?: string;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface ListGroupProps {
  items: ListGroupItem[];
  variant?: 'default' | 'bordered' | 'flush';
  size?: 's' | 'm' | 'l';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ListGroup Component
 * 
 * Structured list with clickable items, icons, and badges.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <ListGroup
 *   items={menuItems}
 *   variant="bordered"
 * />
 */
export function ListGroup({
  items,
  variant = 'default',
  size = 'm',
  className = '',
  style = {},
}: ListGroupProps) {
  const sizeStyles = {
    s: {
      fontSize: 'var(--text-sm)',
      padding: 'var(--spacing-2) var(--spacing-3)',
      iconSize: 16,
    },
    m: {
      fontSize: 'var(--text-base)',
      padding: 'var(--spacing-3) var(--spacing-4)',
      iconSize: 20,
    },
    l: {
      fontSize: 'var(--text-lg)',
      padding: 'var(--spacing-4) var(--spacing-5)',
      iconSize: 24,
    },
  };

  const currentSize = sizeStyles[size];

  const containerStyle: React.CSSProperties = {
    fontFamily: 'Inter Tight, sans-serif',
    width: '100%',
    ...(variant === 'bordered' && {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    }),
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isClickable = !item.disabled && item.onClick;

        return (
          <div
            key={item.id}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={item.disabled ? undefined : item.onClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              padding: currentSize.padding,
              fontSize: currentSize.fontSize,
              fontWeight: 'var(--font-weight-regular)',
              color: item.disabled ? 'var(--muted-foreground)' : 'var(--foreground)',
              background: item.active ? 'var(--accent)' : 'transparent',
              borderBottom:
                variant === 'flush' || (variant === 'bordered' && index < items.length - 1)
                  ? '1px solid var(--border)'
                  : 'none',
              cursor: isClickable ? 'pointer' : item.disabled ? 'not-allowed' : 'default',
              opacity: item.disabled ? 0.5 : 1,
              transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
            }}
            onMouseEnter={(e) => {
              if (isClickable) {
                e.currentTarget.style.background = item.active
                  ? 'var(--accent)'
                  : 'var(--muted)';
              }
            }}
            onMouseLeave={(e) => {
              if (isClickable) {
                e.currentTarget.style.background = item.active ? 'var(--accent)' : 'transparent';
              }
            }}
          >
            {/* Icon */}
            {Icon && (
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <Icon size={currentSize.iconSize} />
              </div>
            )}

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: item.active ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </div>
              {item.description && (
                <div
                  style={{
                    fontSize: size === 's' ? 'var(--text-xs)' : 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    marginTop: 'var(--spacing-1)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.description}
                </div>
              )}
            </div>

            {/* Badge */}
            {item.badge !== undefined && (
              <div
                style={{
                  flexShrink: 0,
                  fontSize: size === 's' ? 'var(--text-xs)' : 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  padding: '2px 8px',
                  background: 'var(--secondary)',
                  color: 'var(--secondary-foreground)',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {item.badge}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

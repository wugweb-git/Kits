import React from 'react';
import { LucideIcon, Circle } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export interface TimelineProps {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Timeline Component
 * 
 * Vertical or horizontal timeline display.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <Timeline
 *   items={events}
 *   orientation="vertical"
 * />
 */
export function Timeline({
  items,
  orientation = 'vertical',
  className = '',
  style = {},
}: TimelineProps) {
  const variantColors = {
    default: 'var(--foreground)',
    success: 'var(--success)',
    warning: 'var(--accent)',
    error: 'var(--destructive)',
  };

  const isVertical = orientation === 'vertical';

  return (
    <div
      className={className}
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        gap: isVertical ? 'var(--spacing-6)' : 'var(--spacing-8)',
        position: 'relative',
        ...style,
      }}
    >
      {items.map((item, index) => {
        const Icon = item.icon || Circle;
        const isLast = index === items.length - 1;
        const color = variantColors[item.variant || 'default'];

        return (
          <div
            key={item.id}
            style={{
              display: 'flex',
              flexDirection: isVertical ? 'row' : 'column',
              gap: 'var(--spacing-3)',
              position: 'relative',
              flex: isVertical ? undefined : 1,
            }}
          >
            {/* Connector */}
            {!isLast && (
              <div
                style={{
                  position: 'absolute',
                  ...(isVertical
                    ? {
                        left: '12px',
                        top: '40px',
                        width: '2px',
                        height: 'calc(100% + var(--spacing-6))',
                      }
                    : {
                        top: '12px',
                        left: 'calc(100% - var(--spacing-4))',
                        width: 'var(--spacing-8)',
                        height: '2px',
                      }),
                  background: 'var(--border)',
                }}
              />
            )}

            {/* Icon */}
            <div
              style={{
                flexShrink: 0,
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: color,
                color: '#FFFFFF',
                borderRadius: '50%',
                border: '3px solid var(--background)',
                boxShadow: '0 0 0 1px var(--border)',
                zIndex: 1,
              }}
            >
              <Icon size={12} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 'var(--spacing-4)' }}>
              {item.date && (
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                    marginBottom: 'var(--spacing-1)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.date}
                </div>
              )}
              <h4
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  margin: 0,
                  marginBottom: item.description ? 'var(--spacing-1)' : 0,
                }}
              >
                {item.title}
              </h4>
              {item.description && (
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-regular)',
                    color: 'var(--muted-foreground)',
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

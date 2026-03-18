import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface BottomNavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  onClick: () => void;
}

export interface BottomNavigationProps {
  items: BottomNavigationItem[];
  activeId?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BottomNavigation Component
 * 
 * Mobile bottom tab navigation bar.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <BottomNavigation
 *   items={navItems}
 *   activeId="home"
 * />
 */
export function BottomNavigation({
  items,
  activeId,
  className = '',
  style = {},
}: BottomNavigationProps) {
  return (
    <nav
      className={className}
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '64px',
        background: 'var(--card)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 40,
        ...style,
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-1)',
              flex: 1,
              height: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--accent)' : 'var(--muted-foreground)',
              transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--muted-foreground)';
              }
            }}
          >
            {/* Icon with Badge */}
            <div style={{ position: 'relative' }}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    padding: '2px 5px',
                    minWidth: '18px',
                    textAlign: 'center',
                    background: 'var(--destructive)',
                    color: 'var(--destructive-foreground)',
                    borderRadius: 'var(--radius-full)',
                    lineHeight: 1,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
              }}
            >
              {item.label}
            </span>

            {/* Active Indicator */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                  right: '20%',
                  height: '3px',
                  background: 'var(--accent)',
                  borderRadius: '0 0 var(--radius-full) var(--radius-full)',
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

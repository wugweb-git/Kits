import React from 'react';
import { LucideIcon, Plus, X } from 'lucide-react';

export interface SpeedDialAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

export interface SpeedDialProps {
  actions: SpeedDialAction[];
  direction?: 'up' | 'down' | 'left' | 'right';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SpeedDial Component
 * 
 * Floating action button with expandable menu.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <SpeedDial
 *   actions={quickActions}
 *   direction="up"
 *   position="bottom-right"
 * />
 */
export function SpeedDial({
  actions,
  direction = 'up',
  position = 'bottom-right',
  className = '',
  style = {},
}: SpeedDialProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const positionStyles = {
    'bottom-right': { bottom: 'var(--spacing-6)', right: 'var(--spacing-6)' },
    'bottom-left': { bottom: 'var(--spacing-6)', left: 'var(--spacing-6)' },
    'top-right': { top: 'var(--spacing-6)', right: 'var(--spacing-6)' },
    'top-left': { top: 'var(--spacing-6)', left: 'var(--spacing-6)' },
  };

  const getActionPosition = (index: number) => {
    const spacing = 64;
    const offset = (index + 1) * spacing;

    switch (direction) {
      case 'up':
        return { bottom: `${offset}px`, right: 0 };
      case 'down':
        return { top: `${offset}px`, right: 0 };
      case 'left':
        return { bottom: 0, right: `${offset}px` };
      case 'right':
        return { bottom: 0, left: `${offset}px` };
    }
  };

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 50,
        ...style,
      }}
    >
      {/* Actions */}
      {isOpen && (
        <div style={{ position: 'relative' }}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                style={{
                  position: 'absolute',
                  ...getActionPosition(index),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                  flexDirection: direction === 'right' ? 'row' : 'row-reverse',
                  animation: `speedDialSlideIn 200ms ease-out ${index * 50}ms both`,
                }}
              >
                {/* Label */}
                <div
                  style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    background: 'var(--card)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {action.label}
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  style={{
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--accent)',
                    color: 'var(--accent-foreground)',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Icon size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--accent)',
          color: 'var(--accent-foreground)',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
          transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <div
          style={{
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform var(--motion-duration-normal) var(--motion-easing-standard)',
          }}
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </div>
      </button>

      <style>
        {`
          @keyframes speedDialSlideIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

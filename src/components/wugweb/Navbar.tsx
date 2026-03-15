import React from 'react';

export interface NavbarItem {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface NavbarProps {
  items?: NavbarItem[];
  variant?: 'mobile' | 'desktop';
  className?: string;
}

const defaultItems: NavbarItem[] = [
  { label: 'Home', active: false },
  { label: 'Explore', active: false },
  { label: 'Search', active: true },
  { label: 'Profile', active: false },
  { label: 'Settings', active: false },
];

export function Navbar({
  items = defaultItems,
  variant = 'mobile',
  className = '',
}: NavbarProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: variant === 'mobile' ? '375px' : '100%',
        zIndex: 3,
      }}
    >
      {/* Shadow Layer */}
      <div
        style={{
          position: 'absolute',
          inset: '0 0 24px 0',
          background: 'var(--background)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          boxShadow: '0px 1px 82px 0px rgba(10, 14, 18, 0.1)',
          zIndex: 1,
        }}
      />

      {/* Navbar */}
      <div
        style={{
          position: 'relative',
          height: '80px',
          width: '100%',
          zIndex: 3,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '0 var(--spacing-8)',
            width: '100%',
            height: '100%',
            isolation: 'isolate',
            boxSizing: 'border-box',
          }}
        >
          {/* Menu Items */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              minHeight: '1px',
              minWidth: '1px',
              flex: '1 0 0',
              zIndex: 2,
            }}
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-2)',
                  padding: 'var(--spacing-3) var(--spacing-5)',
                  width: '44px',
                  borderRadius: 'var(--radius-full)',
                  backdropFilter: 'blur(10px)',
                  background: item.active ? 'var(--accent)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--motion-duration-short) var(--motion-easing-standard)',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.background = 'var(--accent-subtle)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
                aria-label={item.label}
              >
                {item.icon || (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.3861 1.21065C11.7472 0.929784 12.2528 0.929784 12.6139 1.21065L21.6139 8.21065C21.8575 8.4001 22 8.69141 22 9V20C22 20.7957 21.6839 21.5587 21.1213 22.1213C20.5587 22.6839 19.7957 23 19 23H5C4.20435 23 3.44129 22.6839 2.87868 22.1213C2.31607 21.5587 2 20.7957 2 20V9C2 8.69141 2.14247 8.4001 2.38606 8.21065L11.3861 1.21065ZM4 9.48908V20C4 20.2652 4.10536 20.5196 4.29289 20.7071C4.48043 20.8946 4.73478 21 5 21H19C19.2652 21 19.5196 20.8946 19.7071 20.7071C19.8946 20.5196 20 20.2652 20 20V9.48908L12 3.26686L4 9.48908Z"
                      fill={item.active ? 'var(--accent-foreground)' : 'var(--foreground)'}
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Background */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: '80px',
              background: 'var(--background)',
              borderTopLeftRadius: 'var(--radius-lg)',
              borderTopRightRadius: 'var(--radius-lg)',
              zIndex: 1,
            }}
          />
        </div>
      </div>

      {/* Home Indicator */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          background: 'var(--background)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '11px var(--spacing-2) var(--spacing-2)',
              width: '100%',
            }}
          >
            <div
              style={{
                width: '134px',
                height: '5px',
                background: 'var(--muted)',
                borderRadius: 'var(--radius-full)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

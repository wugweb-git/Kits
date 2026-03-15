import React from 'react';

export interface MenuSection {
  /** Unique identifier for the section */
  id: string;
  /** Section title */
  title?: string;
  /** Menu items in this section */
  items: MenuItem[];
}

export interface MenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Label text */
  label: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Whether the item is active/selected */
  active?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Badge content */
  badge?: string | number;
}

export interface SideMenuProps {
  /** Array of menu sections */
  sections: MenuSection[];
  /** Logo/header content */
  logo?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Optional className for custom styling */
  className?: string;
  /** Width of the menu */
  width?: string | number;
  /** Background color */
  backgroundColor?: string;
}

export function SideMenu({
  sections,
  logo,
  footer,
  className = '',
  width = '280px',
  backgroundColor,
}: SideMenuProps) {
  return (
    <aside
      className={`flex flex-col ${className}`}
      style={{
        width,
        backgroundColor: backgroundColor || 'var(--surface-950)',
        borderRight: '1px solid var(--border)',
        height: '100%',
        overflow: 'hidden',
        fontFamily: 'Inter Tight, sans-serif',
      }}
    >
      {/* Logo/Header */}
      {logo && (
        <div
          className="flex items-center p-[var(--spacing-3)]"
          style={{
            borderBottom: '1px solid var(--border)',
          }}
        >
          {logo}
        </div>
      )}

      {/* Menu Sections */}
      <div
        className="flex-1 overflow-y-auto p-[var(--spacing-3)]"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--muted) transparent',
        }}
      >
        <div className="flex flex-col gap-[var(--spacing-2)]">
          {sections.map((section, sectionIndex) => (
            <div key={section.id}>
              {section.title && (
                <div
                  className="px-[var(--spacing-1)] mb-[var(--spacing-1)]"
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--muted-foreground)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {section.title}
                </div>
              )}

              <div className="flex flex-col">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className="flex items-center gap-[var(--spacing-1)] w-full px-[var(--spacing-1)] py-[var(--spacing-1)] rounded-[var(--radius-md)] transition-all"
                    style={{
                      backgroundColor: item.active ? 'var(--accent)' : 'transparent',
                      color: item.active 
                        ? 'var(--accent-foreground)' 
                        : item.disabled 
                        ? 'var(--muted-foreground)' 
                        : 'var(--foreground)',
                      cursor: item.disabled ? 'not-allowed' : 'pointer',
                      opacity: item.disabled ? '0.5' : '1',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: 'var(--text-sm)',
                      fontWeight: item.active ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
                      transitionDuration: 'var(--motion-duration-fast)',
                      transitionTimingFunction: 'var(--motion-easing-standard)',
                    }}
                    onMouseEnter={(e) => {
                      if (!item.active && !item.disabled) {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!item.active && !item.disabled) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {item.icon && (
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: '16px',
                          height: '16px',
                        }}
                      >
                        {item.icon}
                      </div>
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <div
                        className="flex items-center justify-center px-[6px] py-[2px] rounded-[var(--radius-full)] shrink-0"
                        style={{
                          backgroundColor: item.active ? 'var(--accent-foreground)' : 'var(--muted)',
                          color: item.active ? 'var(--accent)' : 'var(--foreground)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-semibold)',
                          minWidth: '20px',
                        }}
                      >
                        {item.badge}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Divider between sections */}
              {sectionIndex < sections.length - 1 && (
                <div
                  className="my-[var(--spacing-2)]"
                  style={{
                    height: '1px',
                    backgroundColor: 'var(--border)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div
          className="p-[var(--spacing-3)]"
          style={{
            borderTop: '1px solid var(--border)',
          }}
        >
          {footer}
        </div>
      )}
    </aside>
  );
}

import React from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

export interface MegaMenuItem {
  title: string;
  description?: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
}

export interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
}

export interface MegaMenuProps {
  label: string;
  sections: MegaMenuSection[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * MegaMenu Component
 * 
 * Large dropdown menu with categorized sections.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <MegaMenu
 *   label="Products"
 *   sections={productSections}
 * />
 */
export function MegaMenu({
  label,
  sections,
  className = '',
  style = {},
}: MegaMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        fontFamily: 'Inter Tight, sans-serif',
        ...style,
      }}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-medium)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          padding: 'var(--spacing-2) var(--spacing-4)',
          color: 'var(--foreground)',
          background: 'none',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--muted)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'none';
          }
        }}
      >
        {label}
        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--motion-duration-fast) var(--motion-easing-standard)',
          }}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            minWidth: '600px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 38px -10px rgba(0, 0, 0, 0.3), 0 10px 20px -15px rgba(0, 0, 0, 0.2)',
            padding: 'var(--spacing-6)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${sections.length}, 1fr)`,
              gap: 'var(--spacing-6)',
            }}
          >
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* Section Title */}
                <h3
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--foreground)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 'var(--spacing-3)',
                  }}
                >
                  {section.title}
                </h3>

                {/* Section Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={itemIndex}
                        href={item.href}
                        onClick={(e) => {
                          if (item.onClick) {
                            e.preventDefault();
                            item.onClick();
                            setIsOpen(false);
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 'var(--spacing-3)',
                          padding: 'var(--spacing-3)',
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none',
                          color: 'var(--foreground)',
                          transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--muted)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {Icon && (
                          <div style={{ flexShrink: 0, marginTop: '2px' }}>
                            <Icon size={20} style={{ color: 'var(--accent)' }} />
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-medium)',
                              marginBottom: item.description ? 'var(--spacing-1)' : 0,
                            }}
                          >
                            {item.title}
                          </div>
                          {item.description && (
                            <div
                              style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--muted-foreground)',
                              }}
                            >
                              {item.description}
                            </div>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

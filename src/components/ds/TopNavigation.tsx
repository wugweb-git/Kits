import React from 'react';
import { Search, Menu } from 'lucide-react';

export interface TopNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onToggleSidebar: () => void;
  showMenuButton?: boolean;
}

/**
 * TopNavigation Component
 * 
 * Main navigation tabs for top-level sections.
 * Uses CSS variables from /styles/globals.css for theming.
 */
export function TopNavigation({
  currentSection,
  onSectionChange,
  onToggleSidebar,
  showMenuButton = false,
}: TopNavigationProps) {
  const sections = [
    { id: 'docs', label: 'Docs' },
    { id: 'components', label: 'Components' },
    { id: 'charts', label: 'Charts' },
    { id: 'blocks', label: 'Blocks' },
    { id: 'templates', label: 'Templates' },
    { id: 'icons', label: 'Icons' },
    { id: 'illustrations', label: 'Illustrations' },
    { id: 'animations', label: 'Animations' },
    { id: 'resources', label: 'Resources' },
  ];

  return (
    <nav
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-1)',
        padding: '0 var(--spacing-4)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--card)',
        height: '48px',
      }}
    >
      {/* Mobile Menu Button */}
      {showMenuButton && (
        <button
          type="button"
          onClick={onToggleSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            background: 'none',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--foreground)',
            cursor: 'pointer',
            marginRight: 'var(--spacing-2)',
            transition: 'background var(--motion-duration-fast) var(--motion-easing-standard)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--muted)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Section Tabs */}
      <div
        className="nav-sections-scroll"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-1)',
          flex: 1,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {sections.map((section) => {
          const isActive = currentSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                padding: '0 var(--spacing-3)',
                height: '36px',
                color: isActive ? 'var(--accent)' : 'var(--muted-foreground)',
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--foreground)';
                  e.currentTarget.style.background = 'var(--muted)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {section.label}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--accent)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Search Button */}
      <button
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          padding: '0 var(--spacing-3)',
          height: '36px',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-regular)',
          color: 'var(--muted-foreground)',
          background: 'var(--muted)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
          minWidth: showMenuButton ? 'auto' : '200px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--ring)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        <Search size={16} />
        {!showMenuButton && <span>Search...</span>}
        {!showMenuButton && (
          <kbd
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-xs)',
              padding: '2px 6px',
              background: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              marginLeft: 'auto',
            }}
          >
            ⌘K
          </kbd>
        )}
      </button>
    </nav>
  );
}
import React from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

export interface NavigationMenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: LucideIcon;
  badge?: string;
  children?: NavigationMenuItem[];
  onClick?: () => void;
}

export interface NavigationMenuProps {
  items: NavigationMenuItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  activeId?: string;
  onItemClick?: (item: NavigationMenuItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * NavigationMenu Component
 *
 * Accessible navigation menu with horizontal/vertical orientations and dropdown support.
 * Uses CSS variables from /styles/globals.css for theming.
 *
 * @example
 * <NavigationMenu
 *   items={navItems}
 *   variant="underline"
 *   activeId="home"
 *   onItemClick={(item) => navigate(item.href)}
 * />
 */
export function NavigationMenu({
  items,
  orientation = 'horizontal',
  variant = 'default',
  activeId,
  onItemClick,
  className = '',
  style = {},
}: NavigationMenuProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const isHorizontal = orientation === 'horizontal';

  const getItemStyle = (item: NavigationMenuItem, isActive: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontFamily: 'Inter Tight, sans-serif',
      fontSize: 'var(--text-sm)',
      fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
      padding: 'var(--spacing-2) var(--spacing-3)',
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      borderRadius: variant === 'underline' ? '0' : 'var(--radius-md)',
      color: isActive ? 'var(--accent)' : 'var(--foreground)',
      transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
      position: 'relative',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
    };

    if (variant === 'pills' && isActive) {
      base.background = 'var(--accent-subtle)';
    }
    if (variant === 'default' && isActive) {
      base.background = 'var(--muted)';
    }

    return base;
  };

  const renderItem = (item: NavigationMenuItem) => {
    const isActive = activeId === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openDropdown === item.id;
    const Icon = item.icon;

    return (
      <div key={item.id} style={{ position: 'relative' }}>
        <button
          type="button"
          style={getItemStyle(item, isActive)}
          onClick={() => {
            if (hasChildren) {
              setOpenDropdown(isOpen ? null : item.id);
            } else {
              onItemClick?.(item);
              setOpenDropdown(null);
            }
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'var(--muted)';
              e.currentTarget.style.color = 'var(--foreground)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.background =
                variant === 'pills' && isActive ? 'var(--accent-subtle)' : 'transparent';
              e.currentTarget.style.color = isActive ? 'var(--accent)' : 'var(--foreground)';
            }
          }}
        >
          {Icon && <Icon size={16} style={{ flexShrink: 0 }} />}
          <span>{item.label}</span>
          {item.badge && (
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                padding: '2px 6px',
                background: 'var(--accent)',
                color: 'var(--accent-foreground)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronDown
              size={14}
              style={{
                flexShrink: 0,
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--motion-duration-fast) var(--motion-easing-standard)',
              }}
            />
          )}
          {/* Underline indicator */}
          {variant === 'underline' && isActive && (
            <span
              style={{
                position: 'absolute',
                bottom: '-1px',
                left: 0,
                right: 0,
                height: '2px',
                background: 'var(--accent)',
                borderRadius: 'var(--radius-full)',
              }}
            />
          )}
        </button>

        {/* Dropdown */}
        {hasChildren && isOpen && (
          <div
            style={{
              position: isHorizontal ? 'absolute' : 'relative',
              top: isHorizontal ? '100%' : undefined,
              left: isHorizontal ? 0 : undefined,
              zIndex: 50,
              marginTop: isHorizontal ? 'var(--spacing-1)' : 0,
              marginLeft: isHorizontal ? 0 : 'var(--spacing-4)',
              background: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-2)',
              minWidth: '180px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-1)',
            }}
          >
            {item.children!.map((child) => {
              const ChildIcon = child.icon;
              const isChildActive = activeId === child.id;
              return (
                <button
                  key={child.id}
                  type="button"
                  style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: 'var(--text-sm)',
                    fontWeight: isChildActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: isChildActive ? 'var(--accent-subtle)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                    color: isChildActive ? 'var(--accent)' : 'var(--foreground)',
                    cursor: 'pointer',
                    transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                  }}
                  onClick={() => {
                    onItemClick?.(child);
                    setOpenDropdown(null);
                  }}
                  onMouseEnter={(e) => {
                    if (!isChildActive) e.currentTarget.style.background = 'var(--muted)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isChildActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {ChildIcon && <ChildIcon size={15} style={{ flexShrink: 0 }} />}
                  {child.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      className={className}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: isHorizontal ? 'center' : 'stretch',
        gap: 'var(--spacing-1)',
        borderBottom: variant === 'underline' && isHorizontal ? '1px solid var(--border)' : undefined,
        ...style,
      }}
    >
      {items.map(renderItem)}
    </nav>
  );
}

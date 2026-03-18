import React from 'react';
import { ChevronRight, Home, Slash } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: 'slash' | 'chevron' | 'arrow' | 'dot';
  size?: 'sm' | 'md' | 'lg';
  maxItems?: number;
  showHomeIcon?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const separatorMap = {
  slash: '/',
  chevron: 'chevron',
  arrow: '→',
  dot: '•',
};

const sizeMap = {
  sm: {
    fontSize: 'var(--text-xs)',
    lineHeight: '14px',
    padding: 'var(--spacing-1)',
    iconSize: 12,
  },
  md: {
    fontSize: 'var(--text-sm)',
    lineHeight: '16px',
    padding: 'var(--spacing-1)',
    iconSize: 14,
  },
  lg: {
    fontSize: 'var(--text-base)',
    lineHeight: '20px',
    padding: 'var(--spacing-2)',
    iconSize: 16,
  },
};

export function Breadcrumb({
  items,
  separator = 'slash',
  size = 'md',
  maxItems,
  showHomeIcon = false,
  className,
  style,
}: BreadcrumbProps) {
  const sizeStyles = sizeMap[size];
  
  // Handle truncation if maxItems is set
  const displayItems = React.useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    // Show first item, ellipsis, and last items
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    
    return [
      firstItem,
      { label: '...', href: undefined, current: false },
      ...lastItems,
    ];
  }, [items, maxItems]);

  // Build list items array
  const listItems = displayItems.map((item, index) => {
    const isLast = index === displayItems.length - 1;
    const isCurrent = item.current || isLast;
    const isEllipsis = item.label === '...';

    const elements = [];

    // Add the breadcrumb item
    elements.push(
      <li
        key={`item-${index}`}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {item.href && !isCurrent ? (
          <a
            href={item.href}
            aria-current={isCurrent ? 'page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              color: 'var(--muted-foreground)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-regular)',
              transition: 'color var(--motion-duration-fast) var(--motion-easing-standard)',
              cursor: isEllipsis ? 'default' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isEllipsis) {
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--muted-foreground)';
            }}
          >
            {showHomeIcon && index === 0 && item.icon ? (
              item.icon
            ) : null}
            <span>{item.label}</span>
          </a>
        ) : (
          <span
            aria-current={isCurrent ? 'page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              color: isCurrent ? 'var(--foreground)' : 'var(--muted-foreground)',
              fontWeight: isCurrent ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
              cursor: isEllipsis ? 'default' : 'text',
            }}
          >
            {showHomeIcon && index === 0 && item.icon ? (
              item.icon
            ) : null}
            <span>{item.label}</span>
          </span>
        )}
      </li>
    );

    // Add separator if not last item
    if (!isLast) {
      elements.push(
        <li
          key={`sep-${index}`}
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${sizeStyles.padding}`,
            color: 'var(--muted-foreground)',
          }}
        >
          {separator === 'chevron' ? (
            <ChevronRight size={sizeStyles.iconSize} />
          ) : (
            <span style={{ lineHeight: '20px' }}>{separatorMap[separator]}</span>
          )}
        </li>
      );
    }

    return elements;
  }).flat();

  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'Inter Tight, sans-serif',
        fontSize: sizeStyles.fontSize,
        lineHeight: sizeStyles.lineHeight,
        ...style,
      }}
    >
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          gap: 0,
        }}
      >
        {listItems}
      </ol>
    </nav>
  );
}

import React from 'react';
import { Logo } from './Logo';

export type BadgeVariant = 'empowered' | 'designed';
export type BadgeSize = 's' | 'm' | 'l';
export type BadgeBrand = 'wugweb' | 'stayweb' | 'nookweb' | 'docweb' | 'kits';

interface EmbedBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  brand?: BadgeBrand;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
}

const brandConfig = {
  wugweb: { text: 'wugweb', accentColor: '#FFBE1A' },
  stayweb: { text: 'stayweb', accentColor: '#3B82F6' },
  nookweb: { text: 'nookweb', accentColor: '#10B981' },
  docweb: { text: 'docweb', accentColor: '#8B5CF6' },
  kits: { text: 'kits', accentColor: '#F59E0B' },
};

const sizeConfig = {
  s: {
    fontSize: 'var(--text-sm)',
    padding: '6px 12px',
    logoHeight: 16,
    iconSize: 18,
    gap: '6px',
  },
  m: {
    fontSize: 'var(--text-base)',
    padding: '8px 16px',
    logoHeight: 20,
    iconSize: 20,
    gap: '8px',
  },
  l: {
    fontSize: 'var(--text-lg)',
    padding: '10px 20px',
    logoHeight: 25,
    iconSize: 24,
    gap: '10px',
  },
};

export function EmbedBadge({
  variant = 'designed',
  size = 'm',
  brand = 'wugweb',
  className = '',
  style = {},
  href,
  target = '_blank',
}: EmbedBadgeProps) {
  const config = brandConfig[brand];
  const sizing = sizeConfig[size];
  
  const badgeText = variant === 'empowered' ? 'Empowered by' : 'Designed by';

  const badgeContent = (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizing.gap,
        backgroundColor: '#080101',
        color: '#FFFFFF',
        padding: sizing.padding,
        borderRadius: 'var(--radius-2, 10px)',
        fontFamily: 'Inter Tight, sans-serif',
        fontSize: sizing.fontSize,
        fontWeight: 'var(--font-weight-semibold, 600)',
        lineHeight: '1.4',
        whiteSpace: 'nowrap',
        cursor: href ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (href) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (href) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* Text */}
      <span style={{ color: '#FFFFFF' }}>
        {badgeText}
      </span>

      {/* Logo or Icon */}
      {variant === 'empowered' ? (
        // Full logo for "Empowered by" - using Logo component
        <div style={{ height: `${sizing.logoHeight}px`, display: 'flex', alignItems: 'center' }}>
          <Logo 
            brand={brand}
            state="full"
            size="s"
            theme="dark"
            container="no"
            style={{ height: `${sizing.logoHeight}px` }}
          />
        </div>
      ) : (
        // Icon only for "Designed by" - using Logo component
        <div style={{ width: `${sizing.iconSize}px`, height: `${sizing.iconSize}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo 
            brand={brand}
            state="icon"
            size="s"
            theme="dark"
            container="no"
            style={{ width: `${sizing.iconSize}px`, height: `${sizing.iconSize}px` }}
          />
        </div>
      )}
    </div>
  );

  // Wrap in anchor if href is provided
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        style={{
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        {badgeContent}
      </a>
    );
  }

  return badgeContent;
}
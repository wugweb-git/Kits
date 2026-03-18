import React from 'react';

/**
 * PageWrapper Component
 * 
 * Standardized wrapper for all documentation pages.
 * Ensures consistent spacing, typography, and layout across all pages.
 * Uses ONLY CSS variables from /styles/globals.css.
 */

interface PageWrapperProps {
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export function PageWrapper({ children, maxWidth = '1400px', className = '' }: PageWrapperProps) {
  return (
    <div
      className={className}
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        maxWidth,
        margin: '0 auto',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}

/**
 * PageHeader Component
 * 
 * Standardized header for all pages.
 */
interface PageHeaderProps {
  badge?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function PageHeader({ badge, title, description, actions }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 'var(--spacing-12)' }}>
      {badge && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: '6px 16px',
            background: 'var(--accent-subtle)',
            color: 'var(--accent)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          {badge}
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--foreground)',
              margin: 0,
              marginBottom: 'var(--spacing-4)',
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-xl)',
              color: 'var(--muted-foreground)',
              margin: 0,
              maxWidth: '800px',
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}

/**
 * PageSection Component
 * 
 * Standardized section for pages.
 */
interface PageSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function PageSection({ title, description, children, className = '' }: PageSectionProps) {
  return (
    <section className={className} style={{ marginBottom: 'var(--spacing-12)' }}>
      {(title || description) && (
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          {title && (
            <h2
              style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--foreground)',
                margin: 0,
                marginBottom: description ? 'var(--spacing-2)' : 0,
              }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-base)',
                color: 'var(--muted-foreground)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * PageCard Component
 * 
 * Standardized card for pages.
 */
interface PageCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function PageCard({ children, className = '', hover = false, onClick }: PageCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={className}
      style={{
        background: 'var(--card)',
        border: `1px solid ${isHovered && hover ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-6)',
        transition: `all var(--motion-duration-fast) var(--motion-easing-standard)`,
        transform: isHovered && hover ? 'translateY(-2px)' : 'translateY(0)',
        cursor: onClick || hover ? 'pointer' : 'default',
      }}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/**
 * PageGrid Component
 * 
 * Responsive grid for pages.
 */
interface PageGridProps {
  children: React.ReactNode;
  cols?: number;
  gap?: string;
  className?: string;
}

export function PageGrid({ children, cols = 3, gap = 'var(--spacing-6)', className = '' }: PageGridProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${cols === 1 ? '100%' : cols === 2 ? '400px' : cols === 3 ? '300px' : '250px'}), 1fr))`,
        gap,
      }}
    >
      {children}
    </div>
  );
}

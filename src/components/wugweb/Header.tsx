import React from 'react';
import { Menu, X } from 'lucide-react';
import svgPaths from '../../imports/svg-hes3el3sby';

export interface HeaderNavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  navItems?: HeaderNavItem[];
  ctaText?: string;
  ctaIcon?: React.ReactNode;
  onCtaClick?: () => void;
  onNavClick?: (href: string) => void;
  variant?: 'desktop' | 'tablet' | 'mobile';
  className?: string;
  style?: React.CSSProperties;
}

// Real Wugweb Logo from Figma import
function WugwebLogo() {
  return (
    <div style={{
      width: '100px',
      height: '25.222px',
      position: 'relative',
    }}>
      <svg 
        style={{ display: 'block', width: '100%', height: '100%' }} 
        fill="none" 
        preserveAspectRatio="none" 
        viewBox="0 0 100 26"
      >
        <g clipPath="url(#clip0_header_logo)">
          <path d={svgPaths.p25a60500} fill="white" />
          <path d={svgPaths.p237b9b80} fill="white" />
          <path d={svgPaths.pf635f00} fill="#C9C9C9" />
          <path d={svgPaths.p1eebb380} fill="#C9C9C9" />
          <path d={svgPaths.p388d8d00} fill="white" />
          <path d={svgPaths.p33f10b00} fill="#C9C9C9" />
        </g>
        <defs>
          <clipPath id="clip0_header_logo">
            <rect fill="white" height="25.222" width="100" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// CTA Icon from Figma import
function ContactIcon() {
  return (
    <div style={{
      width: '24.667px',
      height: '24px',
      position: 'relative',
    }}>
      <svg 
        style={{ display: 'block', width: '100%', height: '100%' }} 
        fill="none" 
        preserveAspectRatio="none" 
        viewBox="0 0 25 24"
      >
        <g>
          <rect fill="var(--accent)" height="24" width="24.6667" />
          <path d={svgPaths.p1d840a00} fill="var(--accent-foreground)" />
        </g>
      </svg>
    </div>
  );
}

export function Header({
  logo,
  navItems = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ],
  ctaText = "Let's Talk",
  ctaIcon,
  onCtaClick,
  onNavClick,
  variant = 'desktop',
  className,
  style,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isMobile = variant === 'mobile';
  const isTablet = variant === 'tablet';
  const isDesktop = variant === 'desktop';

  return (
    <header
      className={className}
      style={{
        width: '100%',
        padding: isMobile 
          ? 'var(--spacing-2)' 
          : isTablet 
          ? 'var(--spacing-2) var(--spacing-3)' 
          : 'var(--spacing-2) var(--spacing-5)',
        fontFamily: 'Inter Tight, sans-serif',
        ...style,
      }}
    >
      {/* Floating Header Container - matches Figma import structure */}
      <div
        style={{
          background: 'var(--surface-800)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--spacing-2)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '48px',
            width: isMobile ? 'auto' : '120px',
            padding: isMobile ? '0 var(--spacing-1)' : '0',
          }}
        >
          {logo || <WugwebLogo />}
        </div>

        {/* Desktop/Tablet Navigation */}
        {!isMobile && (
          <nav
            role="navigation"
            aria-label="Main navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              flex: 1,
              justifyContent: 'flex-end',
            }}
          >
            {/* Nav Items */}
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => onNavClick?.(item.href)}
                aria-current={item.active ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '48px',
                  padding: isTablet ? '8px 10px' : '8px var(--spacing-2)',
                  background: item.active ? 'var(--surface-700)' : 'var(--background)',
                  border: '1px solid',
                  borderColor: item.active ? 'var(--border)' : 'var(--background)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-base)',
                  fontFamily: 'inherit',
                  fontWeight: 'var(--font-weight-regular)',
                  cursor: 'pointer',
                  transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.background = 'var(--surface-700)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.background = 'var(--background)';
                    e.currentTarget.style.borderColor = 'var(--background)';
                  }
                }}
              >
                {item.label}
              </button>
            ))}

            {/* CTA Button - matches Quote button from Figma */}
            <button
              onClick={onCtaClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-1)',
                height: '44px',
                padding: isTablet ? '8px 10px' : '8px var(--spacing-2)',
                background: 'var(--accent)',
                border: '1px solid var(--accent)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-foreground)',
                fontSize: 'var(--text-base)',
                fontFamily: 'inherit',
                fontWeight: 'var(--font-weight-regular)',
                cursor: 'pointer',
                transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {ctaIcon || <ContactIcon />}
              <span>{ctaText}</span>
            </button>
          </nav>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--foreground)',
              cursor: 'pointer',
              transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-700)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            marginTop: 'var(--spacing-2)',
            background: 'var(--surface-800)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-1)',
            animation: 'slideDown var(--motion-duration-normal) var(--motion-easing-decelerate)',
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                onNavClick?.(item.href);
                setMobileMenuOpen(false);
              }}
              aria-current={item.active ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: '48px',
                padding: '8px var(--spacing-2)',
                background: item.active ? 'var(--surface-700)' : 'var(--background)',
                border: '1px solid',
                borderColor: item.active ? 'var(--border)' : 'var(--background)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--foreground)',
                fontSize: 'var(--text-base)',
                fontFamily: 'inherit',
                fontWeight: 'var(--font-weight-regular)',
                cursor: 'pointer',
                transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
                width: '100%',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = 'var(--surface-700)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = 'var(--background)';
                  e.currentTarget.style.borderColor = 'var(--background)';
                }
              }}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              onCtaClick?.();
              setMobileMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-1)',
              height: '48px',
              padding: '8px var(--spacing-2)',
              background: 'var(--accent)',
              border: '1px solid var(--accent)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-foreground)',
              fontSize: 'var(--text-base)',
              fontFamily: 'inherit',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
              width: '100%',
              marginTop: 'var(--spacing-1)',
            }}
          >
            <ContactIcon />
            <span>{ctaText}</span>
          </button>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}

// Export individual components for documentation
export { WugwebLogo, ContactIcon };

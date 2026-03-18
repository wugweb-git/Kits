import React from 'react';
import { Github, Mail } from 'lucide-react';
import { useBreakpoint } from '../../hooks/useMediaQuery';
import logo from 'figma:asset/5e1c759341d10d01cfc46434d6f5695cb0c730b6.png';

interface FooterProps {
  onNavigate?: (page: string, subPage?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { isMobile, isTablet } = useBreakpoint();
  
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'components', label: 'Components' },
    { id: 'accessibility', label: 'Accessibility' }
  ];

  const handleLinkClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer 
      className="animate-fade-in-up"
      style={{
        marginTop: isMobile ? 'var(--spacing-12)' : 'var(--spacing-16)',
        background: 'var(--surface-900)',
        borderTop: '1px solid var(--surface-800)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Footer Content Container - applies padding rules */}
      <div style={{
        paddingLeft: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--layout-padding-desktop-right)',
        paddingRight: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--layout-padding-desktop-right)',
        paddingTop: isMobile ? 'var(--spacing-8)' : 'var(--spacing-12)',
        paddingBottom: isMobile ? 'var(--spacing-8)' : 'var(--spacing-12)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Main footer content - 3 columns on desktop, stacked on mobile */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: isMobile ? 'var(--spacing-8)' : 'var(--spacing-6)',
            marginBottom: 'var(--spacing-8)',
            width: '100%'
          }}
        >
          
          {/* Left: Logo + Tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <img 
                src={logo}
                alt="Wugweb Kits Logo"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p 
              className="text-muted-foreground" 
              style={{ 
                fontSize: 'var(--text-sm)',
                lineHeight: '1.5',
                maxWidth: '280px',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              Design System — Professional UI components and tokens for building consistent web applications.
            </p>
            
            {/* Wugweb Badge */}
            <div style={{ marginTop: 'var(--spacing-4)' }}>
              <a 
                href="https://wugweb.com?utm_source=badge&utm_medium=referral&utm_campaign=designed-by" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit Wugweb"
              >
                <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="180" height="40" rx="8" fill="#121212"/>
                  <rect x="0.5" y="0.5" width="179" height="39" rx="7.5" stroke="#2B2B2B"/>
                  <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#FFBE1A"/>
                  <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#FFBE1A" opacity="0.6"/>
                  <text x="30" y="16" fontFamily="Inter Tight, sans-serif" fontSize="10" fontWeight="500" fill="#A1A1A1">DESIGNED BY</text>
                  <text x="30" y="28" fontFamily="Inter Tight, sans-serif" fontSize="13" fontWeight="600" fill="#FFFFFF">Wugweb</text>
                </svg>
              </a>
            </div>
          </div>

          {/* Center: Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <h3 
              style={{ 
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
                marginBottom: 'var(--spacing-1)',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              Quick Links
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className="smooth-transition hover:text-accent"
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontFamily: 'Inter Tight, sans-serif'
                  }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Contact + Social */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <h3 
              style={{ 
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
                marginBottom: 'var(--spacing-1)',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              Connect
            </h3>
            
            {/* Email */}
            <a
              href="mailto:hello@wugweb.com"
              className="smooth-transition hover:text-accent"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              <Mail size={16} />
              <span>hello@wugweb.com</span>
            </a>

            {/* Version */}
            <div 
              className="text-muted-foreground" 
              style={{ 
                fontSize: 'var(--text-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-1)',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              <span>Version 2.1.0</span>
              <span style={{ fontSize: 'var(--text-xs)' }}>Updated March 2026</span>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
              <a
                href="https://github.com/wugweb-git/Kits"
                target="_blank"
                rel="noopener noreferrer"
                className="smooth-transition hover:text-accent button-press"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                  textDecoration: 'none'
                }}
                aria-label="GitHub Repository"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.figma.com/design/ttIty8LUIsRsU4AJFlX8To/wugweb-kits"
                target="_blank"
                rel="noopener noreferrer"
                className="smooth-transition hover:text-accent button-press"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                  textDecoration: 'none'
                }}
                aria-label="Figma Kit"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z"/>
                  <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z"/>
                  <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z"/>
                  <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z"/>
                  <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z"/>
                </svg>
              </a>
              <a
                href="https://wugweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="smooth-transition hover:text-accent button-press"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '36px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                  textDecoration: 'none',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'Inter Tight, sans-serif',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                aria-label="Wugweb"
              >
                wugweb.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div 
          style={{
            height: '1px',
            background: 'var(--border)',
            marginTop: 'var(--spacing-6)',
            marginBottom: 'var(--spacing-6)',
            width: '100%'
          }}
        />

        {/* Bottom: Copyright + Legal */}
        <div 
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 'var(--spacing-2)' : 'var(--spacing-4)',
            width: '100%'
          }}
        >
          <p 
            className="text-muted-foreground" 
            style={{ 
              fontSize: 'var(--text-xs)',
              margin: 0,
              fontFamily: 'Inter Tight, sans-serif'
            }}
          >
            © {currentYear} Wugweb Kits. All rights reserved.
          </p>

          <div 
            style={{ 
              display: 'flex', 
              gap: isMobile ? 'var(--spacing-3)' : 'var(--spacing-4)',
              flexWrap: 'wrap'
            }}
          >
            <button
              className="smooth-transition hover:text-accent"
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--muted-foreground)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              Privacy Policy
            </button>
            <button
              className="smooth-transition hover:text-accent"
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--muted-foreground)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              Terms of Service
            </button>
            <button
              className="smooth-transition hover:text-accent"
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--muted-foreground)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              License
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
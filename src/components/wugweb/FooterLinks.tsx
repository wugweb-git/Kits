import React from 'react';

export interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FooterLinksProps {
  copyright?: string;
  links?: FooterLink[];
  variant?: 'light' | 'dark';
  className?: string;
}

const defaultLinks: FooterLink[] = [
  { label: 'Sitemap', href: '#' },
  { label: 'Presskit', href: '#' },
  { label: 'Advocacy & Giving', href: '#' },
  { label: 'Refund Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
  { label: 'Privacy Policy', href: '#' },
];

export function FooterLinks({
  copyright = 'Copyright 2020-2025 © Wugweb®',
  links = defaultLinks,
  variant = 'light',
  className = '',
}: FooterLinksProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-5) var(--spacing-10)',
        background: variant === 'light' ? '#f2f2f2' : 'var(--background)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: '1 0 0',
          minHeight: '1px',
          minWidth: '1px',
        }}
      >
        {/* Copyright/Disclaimer */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-2)',
            minWidth: '300px',
            padding: 'var(--spacing-2) 0',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-regular)',
              lineHeight: '20px',
              color: variant === 'light' ? '#111827' : 'var(--muted-foreground)',
              margin: 0,
            }}
          >
            {copyright}
          </p>
        </div>

        {/* Footer Links */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--spacing-1)',
          }}
        >
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={(e) => {
                if (link.onClick) {
                  e.preventDefault();
                  link.onClick();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--spacing-2)',
                height: '39px',
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-regular)',
                color: variant === 'light' ? '#000' : 'var(--foreground)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'color var(--motion-duration-short) var(--motion-easing-standard)',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = variant === 'light' ? '#000' : 'var(--foreground)';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

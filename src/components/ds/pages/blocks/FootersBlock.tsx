import React from 'react';
import { BlockPageShell } from './BlockPageShell';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '../../../design-system/components';

const F = 'Inter Tight, sans-serif';

const footerLinks = {
  Product: ['Components', 'Blocks', 'Charts', 'Templates', 'Icons'],
  Resources: ['Documentation', 'Getting Started', 'Token Architecture', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy', 'Terms', 'License'],
};

const FullFooter = () => (
  <footer style={{ background: 'var(--card)', borderTop: 'var(--border-default)', padding: 'var(--core-spacing-12) var(--core-spacing-8) var(--spacing-8)' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Top: brand + columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-10)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-foreground)', fontFamily: F }}>W</span>
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>Wugweb Kits</span>
          </div>
          <p style={{ margin: '0 0 var(--spacing-5)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', lineHeight: 1.7, fontFamily: F, maxWidth: 200 }}>{`Production-ready design system. ${siteInventory.publicComponentModuleCount} components, 4-layer tokens, Figma sync.`}</p>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', border: 'var(--border-default)', color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color var(--motion-duration-fast)' }}>
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: F }}>{heading}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {links.map(l => (
                <a key={l} href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', textDecoration: 'none', fontFamily: F }}>{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Bottom: copyright */}
      <div style={{ borderTop: 'var(--border-default)', paddingTop: 'var(--spacing-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>© 2025 Wugweb. All rights reserved. MIT License.</p>
        <div style={{ display: 'flex', gap: 'var(--spacing-5)' }}>
          {['Privacy', 'Terms', 'Cookies'].map(l => <a key={l} href="#" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textDecoration: 'none', fontFamily: F }}>{l}</a>)}
        </div>
      </div>
    </div>
  </footer>
);

const MinimalFooter = () => (
  <footer style={{ background: 'var(--card)', borderTop: 'var(--border-default)', padding: 'var(--spacing-5) var(--spacing-8)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>Wugweb Kits</span>
      <nav style={{ display: 'flex', gap: 'var(--spacing-5)' }}>
        {['Documentation', 'GitHub', 'License', 'Privacy'].map(l => <a key={l} href="#" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textDecoration: 'none', fontFamily: F }}>{l}</a>)}
      </nav>
      <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>© 2025 Wugweb</p>
    </div>
  </footer>
);

const NewsletterFooter = () => (
  <footer style={{ background: 'var(--surface-1000)', borderTop: 'var(--border-default)', padding: 'var(--spacing-12) var(--spacing-8) var(--spacing-8)' }}>
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-10)' }}>
        <div>
          <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>Stay current</p>
          <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F }}>Token updates, new components, design system insights.</p>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <input type="email" placeholder="Email address" style={{ flex: 1, padding: '8px 12px', background: 'var(--input-background)', border: 'var(--border-default)', borderRadius: 'var(--input-radius)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: F }} />
            <Button size="sm" variant="default">Subscribe</Button>
          </div>
        </div>
        {['Product', 'Company'].map(section => (
          <div key={section}>
            <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: F }}>{section}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {footerLinks[section as keyof typeof footerLinks]?.map(l => <a key={l} href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', textDecoration: 'none', fontFamily: F }}>{l}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: 'var(--border-default)', paddingTop: 'var(--spacing-5)' }}>
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>© 2025 Wugweb. MIT License.</p>
      </div>
    </div>
  </footer>
);

export function FootersBlock() {
  return (
    <BlockPageShell
      title="Footers"
      description="Multi-column, minimal, and newsletter-integrated footer patterns. All use CSS variable tokens for complete theming control."
      category="Marketing UI"
      count={6}
      variants={[
        { id: 'full', label: 'Full multi-column footer', preview: <FullFooter /> },
        { id: 'minimal', label: 'Minimal single-line footer', preview: <MinimalFooter /> },
        { id: 'newsletter', label: 'Footer with newsletter signup', preview: <NewsletterFooter /> },
      ]}
    />
  );
}

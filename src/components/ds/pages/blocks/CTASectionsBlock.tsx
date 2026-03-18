import React from 'react';
import { BlockPageShell } from './BlockPageShell';
import { Button } from '../../../wugweb/Button';
import { ArrowRight, Mail } from 'lucide-react';

const F = 'Inter Tight, sans-serif';

const SimpleCTA = () => (
  <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', background: 'var(--background)', textAlign: 'center' }}>
    <h2 style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--ts-h2-size)', fontWeight: 'var(--ts-h2-weight)', color: 'var(--foreground)', fontFamily: F }}>Ready to build faster?</h2>
    <p style={{ margin: '0 0 var(--spacing-8)', fontSize: 'var(--ts-body-lg-size)', color: 'var(--muted-foreground)', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', fontFamily: F }}>
      Join thousands of designers and developers shipping with Wugweb Kits.
    </p>
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Button variant="default" size="lg">Get started free</Button>
      <Button variant="outline" size="lg">View pricing</Button>
    </div>
  </section>
);

const AccentCTA = () => (
  <section style={{ background: 'var(--accent)', padding: 'var(--core-spacing-16) var(--core-spacing-8)' }}>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-8)', alignItems: 'center' }}>
      <div>
        <h2 style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--ts-h2-size)', fontWeight: 'var(--ts-h2-weight)', color: 'var(--accent-foreground)', fontFamily: F }}>Start building today</h2>
        <p style={{ margin: 0, fontSize: 'var(--ts-body-md-size)', color: 'rgba(18,18,18,0.65)', fontFamily: F }}>No credit card. MIT licensed. Yours forever.</p>
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
        <Button style={{ background: 'var(--accent-foreground)', color: 'var(--accent)' }} size="lg">
          Get the kit <ArrowRight size={16} />
        </Button>
        <Button variant="ghost" style={{ color: 'var(--accent-foreground)', borderColor: 'rgba(18,18,18,0.25)' }} size="lg">
          Read docs
        </Button>
      </div>
    </div>
  </section>
);

const NewsletterCTA = () => (
  <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', background: 'var(--card)', borderTop: 'var(--border-default)', borderBottom: 'var(--border-default)', textAlign: 'center' }}>
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-5)' }}>
        <Mail size={22} style={{ color: 'var(--accent)' }} />
      </div>
      <h2 style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--ts-h3-size)', fontWeight: 'var(--ts-h3-weight)', color: 'var(--foreground)', fontFamily: F }}>Stay in the loop</h2>
      <p style={{ margin: '0 0 var(--spacing-6)', fontSize: 'var(--ts-body-sm-size)', color: 'var(--muted-foreground)', fontFamily: F }}>Token updates, new components, and design system insights. No spam, unsubscribe anytime.</p>
      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
        <input
          type="email"
          placeholder="you@company.com"
          style={{ flex: 1, padding: 'var(--spacing-2) var(--spacing-4)', background: 'var(--input-background)', border: 'var(--border-default)', borderRadius: 'var(--input-radius)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: F }}
        />
        <Button variant="default">Subscribe</Button>
      </div>
      <p style={{ margin: 'var(--spacing-3) 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>2,400+ designers and developers subscribed</p>
    </div>
  </section>
);

const BannerCTA = () => (
  <div style={{ background: 'var(--accent)', padding: 'var(--spacing-4) var(--spacing-8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-6)', flexWrap: 'wrap' }}>
    <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--accent-foreground)', fontFamily: F }}>🎉 Kits v2.0 is live — 127 components, 4-layer tokens, Figma sync</p>
    <Button size="sm" style={{ background: 'var(--accent-foreground)', color: 'var(--accent)', padding: '4px 14px' }}>See what's new →</Button>
  </div>
);

export function CTASectionsBlock() {
  return (
    <BlockPageShell
      title="CTA Sections"
      description="Call-to-action sections to drive sign-ups, trial starts, and newsletter subscriptions. Simple, split, banner, and email capture variants."
      category="Marketing UI"
      count={10}
      variants={[
        { id: 'simple', label: 'Centered CTA', preview: <SimpleCTA /> },
        { id: 'accent', label: 'Brand accent split CTA', preview: <AccentCTA /> },
        { id: 'newsletter', label: 'Newsletter capture', preview: <NewsletterCTA /> },
        { id: 'banner', label: 'Announcement banner CTA', preview: <BannerCTA /> },
      ]}
    />
  );
}

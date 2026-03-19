import React from 'react';
import { BlockPageShell } from './BlockPageShell';
import { Button } from '../../../wugweb/Button';
import { Badge } from '../../../wugweb/Badge';
import { siteInventory } from '../../../../generated/siteInventory';

const F = 'Inter Tight, sans-serif';

const Centered = () => (
  <section style={{ padding: 'var(--core-spacing-20) var(--core-spacing-8)', textAlign: 'center', background: 'var(--background)' }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)', background: 'var(--accent-subtle)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-full)', padding: '4px 14px', marginBottom: 'var(--spacing-6)' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--accent)', fontFamily: F }}>Now in public beta</span>
    </div>
    <h1 style={{ margin: '0 auto var(--spacing-5)', maxWidth: 640, fontSize: 'clamp(2rem, 5vw, var(--ts-h1-size))', fontWeight: 'var(--ts-h1-weight)', color: 'var(--foreground)', lineHeight: 'var(--ts-h1-line-height)', fontFamily: F }}>
      Build faster with a real design system
    </h1>
    <p style={{ margin: '0 auto var(--spacing-8)', maxWidth: 480, fontSize: 'var(--ts-body-lg-size)', color: 'var(--muted-foreground)', lineHeight: 'var(--ts-body-lg-line-height)', fontFamily: F }}>
      Wugweb Kits is a production-ready component library built on CSS variables so every decision is one token change away.
    </p>
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Button variant="default" size="lg">Get started free</Button>
      <Button variant="outline" size="lg">View components →</Button>
    </div>
    <p style={{ marginTop: 'var(--spacing-5)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>No credit card required · MIT license</p>
  </section>
);

const SplitHero = () => (
  <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', minHeight: 440, background: 'var(--background)' }}>
    <div style={{ padding: 'var(--core-spacing-16) var(--core-spacing-10)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'inline-flex', marginBottom: 'var(--spacing-4)', width: 'fit-content' }}>
        <Badge variant="outline">Design System</Badge>
      </div>
      <h1 style={{ margin: '0 0 var(--spacing-4)', fontSize: 'clamp(1.75rem, 4vw, var(--ts-h1-size))', fontWeight: 'var(--ts-h1-weight)', color: 'var(--foreground)', lineHeight: 'var(--ts-h1-line-height)', fontFamily: F }}>
        Design infrastructure for modern teams
      </h1>
      <p style={{ margin: '0 0 var(--spacing-8)', fontSize: 'var(--ts-body-md-size)', color: 'var(--muted-foreground)', lineHeight: 'var(--ts-body-md-line-height)', fontFamily: F, maxWidth: 400 }}>
        {`${siteInventory.publicComponentModuleCount} components, 4-layer token architecture, and a Figma-to-code workflow that actually scales.`}
      </p>
      <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
        <Button variant="default">Start building</Button>
        <Button variant="ghost">Read the docs</Button>
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-6)', marginTop: 'var(--spacing-10)' }}>
        {[[String(siteInventory.publicComponentModuleCount), 'Components'], ['4-layer', 'Token system'], ['MIT', 'License']].map(([val, lbl]) => (
          <div key={lbl}>
            <p style={{ margin: 0, fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>{val}</p>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{lbl}</p>
          </div>
        ))}
      </div>
    </div>
    <div style={{ background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, borderLeft: 'var(--border-default)' }}>
      <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
        <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-lg)', background: 'var(--accent)', margin: '0 auto var(--spacing-4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 36 }}>⬡</span>
        </div>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F }}>Component preview area</p>
      </div>
    </div>
  </section>
);

const AccentHero = () => (
  <section style={{ background: 'var(--accent)', padding: 'var(--core-spacing-16) var(--core-spacing-8)', textAlign: 'center' }}>
    <h1 style={{ margin: '0 auto var(--spacing-4)', maxWidth: 600, fontSize: 'clamp(2rem, 5vw, var(--ts-h1-size))', fontWeight: 'var(--ts-h1-weight)', color: 'var(--accent-foreground)', lineHeight: 'var(--ts-h1-line-height)', fontFamily: F }}>
      The design system that ships with you
    </h1>
    <p style={{ margin: '0 auto var(--spacing-8)', maxWidth: 440, fontSize: 'var(--ts-body-md-size)', color: 'rgba(18,18,18,0.7)', fontFamily: F }}>
      Token-driven, Figma-synced, production-ready.
    </p>
    <Button style={{ background: 'var(--accent-foreground)', color: 'var(--accent)', border: 'none' }} size="lg">
      Get the kit →
    </Button>
  </section>
);

const MinimalHero = () => (
  <section style={{ padding: 'var(--core-spacing-20) var(--core-spacing-8)', maxWidth: 720, margin: '0 auto' }}>
    <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: F }}>Wugweb Kits</p>
    <h1 style={{ margin: '0 0 var(--spacing-6)', fontSize: 'clamp(2.5rem, 6vw, 72px)', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1.05, fontFamily: F }}>
      Components<br />that mean it.
    </h1>
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="default" size="lg">Documentation</Button>
      <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: F }}>or</span>
      <Button variant="ghost" size="lg">Browse components →</Button>
    </div>
  </section>
);

export function HeroSectionsBlock() {
  return (
    <BlockPageShell
      title="Hero Sections"
      description="Attention-grabbing hero patterns for landing pages, marketing sites, and documentation. All built with CSS variables, responsive by default."
      category="Marketing UI"
      count={18}
      variants={[
        { id: 'centered', label: 'Centered hero with badge', preview: <Centered /> },
        { id: 'split', label: 'Split hero with stats', preview: <SplitHero /> },
        { id: 'accent', label: 'Brand accent background hero', preview: <AccentHero /> },
        { id: 'minimal', label: 'Minimal typographic hero', preview: <MinimalHero /> },
      ]}
    />
  );
}

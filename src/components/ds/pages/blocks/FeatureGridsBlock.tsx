import React from 'react';
import { BlockPageShell } from './BlockPageShell';
import { Zap, Shield, Layers, Code, Globe, Lock } from 'lucide-react';

const F = 'Inter Tight, sans-serif';

const features3Col = [
  { icon: Zap, title: 'Fast by default', desc: 'Tokens compile to CSS variables. Zero JS runtime cost, optimal paint.' },
  { icon: Shield, title: 'Accessible first', desc: 'WCAG AA contrast, keyboard navigation, and ARIA built into every component.' },
  { icon: Layers, title: '4-layer tokens', desc: 'Global → Alias → Semantic → Component. Swap entire brand in one file.' },
  { icon: Code, title: 'Code-synced', desc: 'Tokens Studio + GitHub + Style Dictionary. Figma and code stay in sync.' },
  { icon: Globe, title: 'Multi-platform', desc: 'CSS vars → Tailwind → React → iOS → Android. One token source, everywhere.' },
  { icon: Lock, title: 'Stable API', desc: 'Versioned tokens and backward-compatible upgrades. No surprise breakages.' },
];

const ThreeColGrid = () => (
  <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', background: 'var(--background)' }}>
    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
      <h2 style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--ts-h2-size)', fontWeight: 'var(--ts-h2-weight)', color: 'var(--foreground)', fontFamily: F }}>Built for production</h2>
      <p style={{ margin: 0, fontSize: 'var(--ts-body-lg-size)', color: 'var(--muted-foreground)', fontFamily: F, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
        Every decision made to ship faster without breaking things.
      </p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-6)', maxWidth: 900, margin: '0 auto' }}>
      {features3Col.map(({ icon: Icon, title, desc }) => (
        <div key={title} style={{ padding: 'var(--spacing-6)', background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-4)' }}>
            <Icon size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <h3 style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>{title}</h3>
          <p style={{ margin: 0, fontSize: 'var(--ts-body-sm-size)', color: 'var(--muted-foreground)', lineHeight: 1.6, fontFamily: F }}>{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const AlternatingFeatures = () => (
  <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', background: 'var(--background)' }}>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
      {[
        { icon: Zap, title: 'Token-first architecture', desc: 'Every pixel, color, spacing, and animation is a CSS variable. Update a single token file and watch the entire UI adapt.', badge: 'Core' },
        { icon: Shield, title: 'Accessibility built-in', desc: 'WCAG 2.1 AA contrast ratios enforced at the token level. Keyboard navigation and screen reader support on every component.', badge: 'A11y' },
      ].map(({ icon: Icon, title, desc, badge }, i) => (
        <div key={title} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-8)', alignItems: 'center', direction: i % 2 === 1 ? 'rtl' : 'ltr' }}>
          <div style={{ direction: 'ltr' }}>
            <span style={{ display: 'inline-block', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', background: 'var(--accent-subtle)', padding: '2px 10px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--spacing-4)', fontFamily: F }}>{badge}</span>
            <h3 style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--ts-h3-size)', fontWeight: 'var(--ts-h3-weight)', color: 'var(--foreground)', fontFamily: F }}>{title}</h3>
            <p style={{ margin: 0, fontSize: 'var(--ts-body-md-size)', color: 'var(--muted-foreground)', lineHeight: 1.7, fontFamily: F }}>{desc}</p>
          </div>
          <div style={{ direction: 'ltr', background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={48} style={{ color: 'var(--accent)', opacity: 0.4 }} />
          </div>
        </div>
      ))}
    </div>
  </section>
);

const HighlightedFeature = () => (
  <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', background: 'var(--background)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)', maxWidth: 900, margin: '0 auto' }}>
      {/* Large feature */}
      <div style={{ background: 'var(--accent)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280 }}>
        <Zap size={32} style={{ color: 'var(--accent-foreground)' }} />
        <div>
          <h3 style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--ts-h3-size)', fontWeight: 'var(--ts-h3-weight)', color: 'var(--accent-foreground)', fontFamily: F }}>4-Layer Token System</h3>
          <p style={{ margin: 0, fontSize: 'var(--ts-body-sm-size)', color: 'rgba(18,18,18,0.65)', fontFamily: F }}>Global → Alias → Semantic → Component. The architecture that scales to 10x without breaking.</p>
        </div>
      </div>
      {/* Two small features stacked */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {[
          { icon: Code, title: 'Style Dictionary ready', desc: 'Exports to CSS, Tailwind, JS, Android, iOS.' },
          { icon: Globe, title: 'Multi-brand support', desc: 'Swap the alias layer → new brand in minutes.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-6)', flex: 1 }}>
            <Icon size={20} style={{ color: 'var(--accent)', marginBottom: 'var(--spacing-3)' }} />
            <h3 style={{ margin: '0 0 var(--spacing-1)', fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>{title}</h3>
            <p style={{ margin: 0, fontSize: 'var(--ts-body-sm-size)', color: 'var(--muted-foreground)', fontFamily: F }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export function FeatureGridsBlock() {
  return (
    <BlockPageShell
      title="Feature Grids"
      description="Showcase product features with structured layouts. Cards, alternating rows, and bento-style grids — all token-driven."
      category="Marketing UI"
      count={10}
      variants={[
        { id: '3col', label: '3-column feature grid', preview: <ThreeColGrid /> },
        { id: 'alternating', label: 'Alternating features', preview: <AlternatingFeatures /> },
        { id: 'highlighted', label: 'Bento-style highlighted', preview: <HighlightedFeature /> },
      ]}
    />
  );
}

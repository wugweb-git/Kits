import React from 'react';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { Badge } from '../../wugweb/Badge';

const F = 'Inter Tight, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = React.useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setC(true); setTimeout(() => setC(false), 1500); }}
      style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '10px', color: c ? 'var(--success)' : 'var(--muted-foreground)', background: 'var(--muted)', border: 'var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', cursor: 'pointer', fontFamily: F }}>
      {c ? <Check size={10} /> : <Copy size={10} />} {c ? 'Copied!' : 'Copy'}
    </button>
  );
}

const TYPE_HIERARCHY = [
  {
    role: 'Display',
    token_size: '--ts-display-size',
    token_weight: '--ts-display-weight',
    token_lh: '--ts-display-line-height',
    token_fluid: '--fluid-display',
    size: '4rem / 64px',
    fluid: 'clamp(2.5rem, 5.5vw+0.5rem, 5rem)',
    weight: '700',
    lineHeight: 'tight (1.2)',
    letterSpacing: 'tight (-0.025em)',
    use: 'Hero headlines, marketing splash screens, landing page hero',
    do: 'One per page maximum. Always on dark/high-contrast backgrounds.',
    dont: 'Use in body content or repeated sections.',
    example: 'Build Faster.',
    tag: 'h1 / <span class="type-display">',
  },
  {
    role: 'H1',
    token_size: '--ts-h1-size',
    token_weight: '--ts-h1-weight',
    token_lh: '--ts-h1-line-height',
    token_fluid: '--fluid-h1',
    size: '3rem / 48px',
    fluid: 'clamp(2rem, 4vw+0.5rem, 3rem)',
    weight: '700',
    lineHeight: 'tight (1.2)',
    letterSpacing: 'normal (0)',
    use: 'Page-level headings, primary section titles, modal titles',
    do: 'Unique per page. Landmark level — drives page structure.',
    dont: 'Have multiple H1s on one page. Skip heading levels.',
    example: 'Wugweb Kits',
    tag: '<h1>',
  },
  {
    role: 'H2',
    token_size: '--ts-h2-size',
    token_weight: '--ts-h2-weight',
    token_lh: '--ts-h2-line-height',
    token_fluid: '--fluid-h2',
    size: '2.25rem / 36px',
    fluid: 'clamp(1.5rem, 2.5vw+0.5rem, 2.25rem)',
    weight: '600',
    lineHeight: 'snug (1.375)',
    letterSpacing: 'normal (0)',
    use: 'Major section headings, documentation sections, dashboard titles',
    do: 'Use sequentially after H1. Multiple H2s per page is fine.',
    dont: 'Use inside cards or table cells.',
    example: 'Component Library',
    tag: '<h2>',
  },
  {
    role: 'H3',
    token_size: '--ts-h3-size',
    token_weight: '--ts-h3-weight',
    token_lh: '--ts-h3-line-height',
    token_fluid: '--fluid-h3',
    size: '1.5rem / 24px',
    fluid: 'clamp(1.25rem, 1.5vw+0.5rem, 1.75rem)',
    weight: '600',
    lineHeight: 'snug (1.375)',
    letterSpacing: 'normal (0)',
    use: 'Sub-section headings, sidebar group labels, card section titles',
    do: 'Always inside a section already titled by H2.',
    dont: 'Use as card title (use H4 instead).',
    example: 'Form Controls',
    tag: '<h3>',
  },
  {
    role: 'H4',
    token_size: '--ts-h4-size',
    token_weight: '--ts-h4-weight',
    token_lh: '--ts-h4-line-height',
    token_fluid: '--fluid-h4',
    size: '1.25rem / 20px',
    fluid: 'clamp(1.06rem, 1vw+0.5rem, 1.375rem)',
    weight: '600',
    lineHeight: 'normal (1.5)',
    letterSpacing: 'normal (0)',
    use: 'Card titles, table column headings, sidebar item titles, modal sub-headers',
    do: 'Use for UI component labels. Most common heading in components.',
    dont: 'Replace Body LG with H4 for decorative purposes.',
    example: 'Button',
    tag: '<h4>',
  },
  {
    role: 'Body LG',
    token_size: '--ts-body-lg-size',
    token_weight: '--ts-body-lg-weight',
    token_lh: '--ts-body-lg-line-height',
    token_fluid: '--fluid-body-lg',
    size: '1.25rem / 20px',
    fluid: 'clamp(1rem, 0.5vw+0.875rem, 1.25rem)',
    weight: '400',
    lineHeight: 'relaxed (1.625)',
    letterSpacing: 'normal (0)',
    use: 'Page lead copy, intro paragraphs, hero sub-headings, modal descriptions',
    do: 'Use immediately after H1 or H2 for introductory text.',
    dont: 'Use as heading replacement.',
    example: '127 production-ready components powered by a 4-layer CSS token system.',
    tag: '<p class="type-body-lg">',
  },
  {
    role: 'Body MD',
    token_size: '--ts-body-md-size',
    token_weight: '--ts-body-md-weight',
    token_lh: '--ts-body-md-line-height',
    token_fluid: '--fluid-body-md',
    size: '1rem / 16px',
    fluid: 'clamp(0.9375rem, 0.25vw+0.875rem, 1rem)',
    weight: '400',
    lineHeight: 'normal (1.5)',
    letterSpacing: 'normal (0)',
    use: 'Default paragraph text, list items, table cell content, sidebar descriptions',
    do: 'Default for all body copy. Set on <body> as base.',
    dont: 'Use for labels or captions — use Label or Caption roles.',
    example: 'Each layer references the layer above it. No direct core token usage in components.',
    tag: '<p> / default',
  },
  {
    role: 'Body SM',
    token_size: '--ts-body-sm-size',
    token_weight: '--ts-body-sm-weight',
    token_lh: '--ts-body-sm-line-height',
    token_fluid: '--fluid-body-sm',
    size: '0.875rem / 14px',
    fluid: 'clamp(0.8125rem, 0.1vw+0.8rem, 0.875rem)',
    weight: '400',
    lineHeight: 'normal (1.5)',
    letterSpacing: 'normal (0)',
    use: 'Secondary copy, sidebar item descriptions, table metadata, dropdown options',
    do: 'Use for supporting text alongside primary Body MD.',
    dont: 'Use as primary body text in dense layouts.',
    example: 'Update one token. Everything rebrands.',
    tag: '<p class="type-body-sm">',
  },
  {
    role: 'Label MD',
    token_size: '--ts-label-md-size',
    token_weight: '--ts-label-md-weight',
    token_lh: '—',
    token_fluid: '--fluid-label',
    size: '0.875rem / 14px',
    fluid: 'clamp(0.75rem, 0.1vw+0.73rem, 0.875rem)',
    weight: '500',
    lineHeight: 'normal (1.5)',
    letterSpacing: 'wide (0.025em)',
    use: 'Form labels, input labels, menu items, navigation links, sidebar labels',
    do: 'Use medium weight (500) to distinguish from body. Add letter-spacing for readability.',
    dont: 'Use regular weight — must be distinct from Body SM.',
    example: 'Email address',
    tag: '<label>',
  },
  {
    role: 'Label SM',
    token_size: '--ts-label-sm-size',
    token_weight: '--ts-label-sm-weight',
    token_lh: '—',
    token_fluid: '—',
    size: '0.75rem / 12px',
    fluid: '—',
    weight: '500',
    lineHeight: 'normal (1.5)',
    letterSpacing: 'wide (0.025em)',
    use: 'Small labels, required indicators, tag labels, chip text',
    do: 'Pair with icons or colored accents to maintain readability at small size.',
    dont: 'Use for long strings — 1-3 words maximum.',
    example: 'Required',
    tag: '<label class="text-xs">',
  },
  {
    role: 'Caption',
    token_size: '--ts-caption-size',
    token_weight: '--ts-caption-weight',
    token_lh: '--ts-caption-line-height',
    token_fluid: '--fluid-caption',
    size: '0.75rem / 12px',
    fluid: 'clamp(0.625rem, 0.05vw+0.62rem, 0.75rem)',
    weight: '400',
    lineHeight: 'normal (1.5)',
    letterSpacing: 'normal (0)',
    use: 'Timestamps, metadata, image captions, helper text, table footnotes, badge text',
    do: 'Only on muted-foreground color. Pair with --muted-foreground token.',
    dont: 'Use on dark backgrounds with very low contrast.',
    example: 'Last updated 3 minutes ago',
    tag: '<span class="type-caption">',
  },
  {
    role: 'Code',
    token_size: '--ts-code-size',
    token_weight: '--ts-code-weight',
    token_lh: '—',
    token_fluid: '—',
    size: '0.875rem / 14px',
    fluid: '—',
    weight: '400',
    lineHeight: 'relaxed (1.625)',
    letterSpacing: 'normal (0)',
    use: 'Inline code, code blocks, token names, technical strings, keyboard shortcuts',
    do: 'Always use --core-font-family-mono. Never Inter Tight for code.',
    dont: 'Mix mono and sans-serif within the same inline text.',
    example: 'var(--accent)',
    tag: '<code> / <pre>',
  },
];

const WEIGHT_SCALE = [
  { name: 'Regular', value: 400, token: '--font-weight-regular', use: 'Body copy, captions, placeholder text' },
  { name: 'Medium',  value: 500, token: '--font-weight-medium',  use: 'Labels, menu items, nav links, buttons ghost' },
  { name: 'Semibold',value: 600, token: '--font-weight-semibold',use: 'H3/H4, card titles, button default, active nav' },
  { name: 'Bold',    value: 700, token: '--font-weight-bold',    use: 'H1/H2, Display, metric numbers, important UI' },
  { name: 'Extrabold',value: 800, token: '--font-weight-bold', use: 'Display (var font axis 800) — marketing only' },
];

const LINE_HEIGHT_SCALE = [
  { name: 'None',    value: 1,     token: '--core-line-height-none',    use: 'Display text, oversized numerics' },
  { name: 'Tight',   value: 1.2,   token: '--core-line-height-tight',   use: 'H1, H2, Display — short headings' },
  { name: 'Snug',    value: 1.375, token: '--core-line-height-snug',    use: 'H3, H4 — medium density headings' },
  { name: 'Normal',  value: 1.5,   token: '--core-line-height-normal',  use: 'Body MD, Body SM, Label — default prose' },
  { name: 'Relaxed', value: 1.625, token: '--core-line-height-relaxed', use: 'Body LG, long-form reading, documentation' },
  { name: 'Loose',   value: 2,     token: '--core-line-height-loose',   use: 'Table rows, spaced list items' },
];

export function TypographyDoc() {
  const [activeRole, setActiveRole] = React.useState<string | null>(null);

  return (
    <PageWrapper maxWidth="1200px">
      <PageHeader
        badge="Typography"
        title="Type Hierarchy"
        description="Inter Tight — the only allowed font face. 12 semantic roles with fixed sizes, fluid viewport-scaled variants, weight scale, and line-height system. Strictly enforced via CSS variables."
      />

      {/* Font specimen */}
      <div style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-8)', marginBottom: 'var(--spacing-10)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'var(--gradient-radial-accent)', pointerEvents: 'none' }} />
        <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: F }}>Inter Tight — sole permitted font face</p>
        <p style={{ margin: 0, fontSize: 'var(--fluid-display)', fontWeight: 800, color: 'var(--foreground)', fontFamily: F, lineHeight: 1.05, letterSpacing: '-0.03em' }}>Aa Bb Cc</p>
        <p style={{ margin: 'var(--spacing-3) 0 0', fontSize: 'var(--fluid-body-md)', color: 'var(--muted-foreground)', fontFamily: F, lineHeight: 1.6 }}>
          ABCDEFGHIJKLMNOPQRSTUVWXYZ · abcdefghijklmnopqrstuvwxyz · 0123456789 · !@#$%^&*()
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)', flexWrap: 'wrap' }}>
          {[['var(--core-font-family-base)', 'Sans-serif'], ['var(--core-font-family-mono)', 'Monospace']].map(([token, label]) => (
            <div key={label} style={{ background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-2) var(--spacing-4)' }}>
              <code style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontFamily: MONO }}>{token}</code>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginLeft: 'var(--spacing-2)', fontFamily: F }}>→ {label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full hierarchy */}
      <PageSection title="Type Roles" description="Click any row to expand full usage rules, do/don't, and copy the CSS.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {TYPE_HIERARCHY.map(ts => {
            const isOpen = activeRole === ts.role;
            return (
              <div key={ts.role} style={{ background: 'var(--card)', border: isOpen ? 'var(--border-accent)' : 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)' }}>
                {/* Row header */}
                <button onClick={() => setActiveRole(isOpen ? null : ts.role)} style={{ width: '100%', display: 'grid', gridTemplateColumns: '90px 1fr 120px 80px 80px 80px 36px', alignItems: 'center', gap: 'var(--spacing-4)', padding: 'var(--spacing-4) var(--spacing-5)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  {/* Role name */}
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: F, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ts.role}</span>
                  {/* Live specimen */}
                  <span style={{ fontSize: ts.fluid !== '—' ? ts.fluid : ts.size, fontWeight: parseInt(ts.weight), color: 'var(--foreground)', fontFamily: ts.role === 'Code' ? MONO : F, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ts.example}</span>
                  {/* Token */}
                  <code style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: MONO }}>{ts.token_size}</code>
                  {/* Size */}
                  <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: MONO }}>{ts.size}</span>
                  {/* Weight */}
                  <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: MONO }}>{ts.weight}</span>
                  {/* LH */}
                  <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: F }}>{ts.lineHeight}</span>
                  {/* Toggle */}
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontFamily: F, textAlign: 'right' }}>{isOpen ? '↑' : '↓'}</span>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div style={{ borderTop: 'var(--border-default)', padding: 'var(--spacing-5)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
                    {/* Tokens */}
                    <div>
                      <p style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>Tokens</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                        {[[ts.token_size, 'font-size'], [ts.token_weight, 'font-weight'], [ts.token_lh, 'line-height'], [ts.token_fluid, 'fluid (clamp)']].filter(([t]) => t !== '—').map(([token, prop]) => (
                          <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--muted)', borderRadius: 'var(--radius-sm)', padding: '4px 10px' }}>
                            <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: F }}>{prop}:</span>
                            <code style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: MONO }}>var({token})</code>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-5)' }}>
                      {/* Usage */}
                      <div>
                        <p style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>Used in</p>
                        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: F, lineHeight: 1.6 }}>{ts.use}</p>
                      </div>
                      {/* Do */}
                      <div>
                        <p style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>✓ Do</p>
                        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: F, lineHeight: 1.6 }}>{ts.do}</p>
                      </div>
                      {/* Don't */}
                      <div>
                        <p style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--destructive)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>✗ Don't</p>
                        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: F, lineHeight: 1.6 }}>{ts.dont}</p>
                      </div>
                    </div>

                    {/* Copy CSS */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-1000)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-4)', border: 'var(--border-default)' }}>
                      <code style={{ fontSize: '12px', color: 'var(--muted-foreground)', fontFamily: MONO }}>
                        {`font-size: var(${ts.token_size}); font-weight: var(${ts.token_weight}); font-family: var(--core-font-family-${ts.role === 'Code' ? 'mono' : 'base'});`}
                      </code>
                      <CopyBtn text={`font-size: var(${ts.token_size}); font-weight: var(${ts.token_weight}); font-family: var(--core-font-family-${ts.role === 'Code' ? 'mono' : 'base'});`} />
                    </div>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>HTML element: <code style={{ fontFamily: MONO, color: 'var(--accent)' }}>{ts.tag}</code></p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PageSection>

      {/* Weight scale */}
      <PageSection title="Font Weight Scale" description="5 weights from the Inter Tight variable font. Always use tokens — never raw numbers.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {WEIGHT_SCALE.map(w => (
            <div key={w.name} style={{ display: 'flex', gap: 'var(--spacing-5)', alignItems: 'center', background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-4) var(--spacing-5)', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F, fontSize: 'var(--fluid-h3)', fontWeight: w.value, color: 'var(--foreground)', width: 220, flexShrink: 0 }}>Wugweb Kits</span>
              <code style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontFamily: MONO, width: 200, flexShrink: 0 }}>{w.token}</code>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: MONO, width: 40 }}>{w.value}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F, flex: 1 }}>{w.use}</span>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Line height */}
      <PageSection title="Line Height Scale" description="6 named line-height steps. Use the semantic name, never raw numbers.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          {LINE_HEIGHT_SCALE.map(lh => (
            <div key={lh.name} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>{lh.name}</span>
                <code style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: MONO }}>{lh.value}</code>
              </div>
              <code style={{ display: 'block', fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: MONO, marginBottom: 'var(--spacing-3)' }}>{lh.token}</code>
              {/* Visual bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 'var(--spacing-3)' }}>
                {['Inter Tight', 'Wugweb Kits'].map((line, i) => (
                  <span key={i} style={{ fontFamily: F, fontSize: 'var(--fluid-body-md)', color: i === 0 ? 'var(--foreground)' : 'var(--muted-foreground)', lineHeight: lh.value, display: 'block' }}>{line}</span>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{lh.use}</p>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Rules */}
      <PageSection title="Typography Rules">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-6)' }}>
            {[
              { icon: '🔠', color: 'var(--accent)', label: 'Font rules', items: ['Inter Tight ONLY — no exceptions', 'Mono for code, tokens, kbd, pre', 'Variable font: 100–900 weight range', '@import from Google Fonts already in CSS'] },
              { icon: '✅', color: 'var(--success)', label: 'Always', items: ['Use var(--ts-*-size) tokens', 'Use var(--fluid-*) for viewport-scaled text', 'Use var(--font-weight-*) tokens for weight', 'Set lineHeight via var(--core-line-height-*)'] },
              { icon: '❌', color: 'var(--destructive)', label: 'Never', items: ['Hardcode 16px, 24px, #fff in components', 'Use Tailwind font-size classes (text-2xl)', 'Use Tailwind font-weight classes (font-bold)', 'Set px values on font-size directly'] },
              { icon: '♿', color: 'var(--info)', label: 'Accessibility', items: ['Min 16px body text (--ts-body-md-size)', 'Min 4.5:1 contrast for body (WCAG AA)', 'Min 3:1 contrast for large text (18px+)', 'Never disable user font scaling (no max-size)'] },
            ].map(({ icon, color, label, items }) => (
              <div key={label}>
                <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>{icon} {label}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {items.map(r => (
                    <li key={r} style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F, paddingLeft: 'var(--spacing-3)', borderLeft: `2px solid ${color}`, marginLeft: 'var(--spacing-1)' }}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

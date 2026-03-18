import React from 'react';
import { Copy, Check } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { Badge } from '../../wugweb/Badge';

const F = 'Inter Tight, sans-serif';

function Swatch({ token, hex, name, on = 'dark' }: { token: string; hex: string; name: string; on?: 'dark' | 'light' }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div
      onClick={() => { navigator.clipboard.writeText(hex).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      style={{ cursor: 'pointer', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: 'var(--border-default)' }}
    >
      <div style={{ height: 72, background: hex, display: 'flex', alignItems: 'flex-end', padding: 'var(--spacing-2)' }}>
        {copied && <Check size={12} style={{ color: on === 'dark' ? 'white' : '#121212' }} />}
      </div>
      <div style={{ background: 'var(--card)', padding: 'var(--spacing-3)' }}>
        <p style={{ margin: '0 0 2px', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{name}</p>
        <code style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)', display: 'block' }}>{token}</code>
        <code style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>{hex}</code>
      </div>
    </div>
  );
}

const brandPalette = [
  { token: '--core-color-brand-yellow-50', hex: 'rgba(255,250,230,1)', name: 'Yellow 50' },
  { token: '--core-color-brand-yellow-200', hex: 'rgba(255,226,120,1)', name: 'Yellow 200' },
  { token: '--core-color-brand-yellow-400', hex: 'rgba(255,198,45,1)', name: 'Yellow 400' },
  { token: '--core-color-brand-yellow-500', hex: 'rgba(255,190,26,1)', name: 'Yellow 500 ← Primary', on: 'dark' as const },
  { token: '--core-color-brand-yellow-700', hex: 'rgba(180,126,5,1)', name: 'Yellow 700' },
  { token: '--core-color-brand-yellow-900', hex: 'rgba(80,54,0,1)', name: 'Yellow 900', on: 'light' as const },
];

const neutralPalette = [
  { token: '--core-color-neutral-0', hex: 'rgba(255,255,255,1)', name: 'White', on: 'dark' as const },
  { token: '--core-color-neutral-300', hex: 'rgba(196,196,196,1)', name: 'Gray 300' },
  { token: '--core-color-neutral-500', hex: 'rgba(115,115,115,1)', name: 'Gray 500' },
  { token: '--core-color-neutral-700', hex: 'rgba(68,68,68,1)', name: 'Gray 700', on: 'light' as const },
  { token: '--core-color-neutral-900', hex: 'rgba(28,28,28,1)', name: 'Gray 900', on: 'light' as const },
  { token: '--core-color-neutral-950', hex: 'rgba(18,18,18,1)', name: 'Gray 950 ← Base', on: 'light' as const },
];

const typographyStyles = [
  { label: 'Display', token: '--ts-display-size', size: '4rem', weight: 800, use: 'Hero headlines, splash screens' },
  { label: 'H1', token: '--ts-h1-size', size: '2.25rem', weight: 700, use: 'Page titles' },
  { label: 'H2', token: '--ts-h2-size', size: '1.75rem', weight: 700, use: 'Section headings' },
  { label: 'H3', token: '--ts-h3-size', size: '1.375rem', weight: 600, use: 'Sub-section headings' },
  { label: 'H4', token: '--ts-h4-size', size: '1.125rem', weight: 600, use: 'Card titles, UI labels' },
  { label: 'Body LG', token: '--ts-body-lg-size', size: '1.125rem', weight: 400, use: 'Introductory text, lead copy' },
  { label: 'Body MD', token: '--ts-body-md-size', size: '1rem', weight: 400, use: 'Default paragraph text' },
  { label: 'Body SM', token: '--ts-body-sm-size', size: '0.875rem', weight: 400, use: 'Secondary copy, captions' },
  { label: 'Label', token: '--ts-label-md-size', size: '0.875rem', weight: 500, use: 'Form labels, UI labels' },
  { label: 'Caption', token: '--ts-caption-size', size: '0.75rem', weight: 400, use: 'Metadata, timestamps, hints' },
];

const voiceRules = [
  { do: 'Precise and useful', dont: 'Vague and fluffy', example: '"4-layer token system" not "powerful design tools"' },
  { do: 'Direct and confident', dont: 'Hedging and passive', example: '"Update one token, rebrand everything" not "may help with consistency"' },
  { do: 'Technical when right', dont: 'Dumbing down', example: 'Use "CSS variables", "WCAG AA", "W3C DTCG"' },
  { do: 'Warm but professional', dont: 'Sycophantic or stiff', example: '"Nice." not "Outstanding!" and not cold documentation-speak' },
];

export function BrandGuidelinesDoc() {
  return (
    <PageWrapper>
      <PageHeader
        badge="Brand"
        title="Brand Guidelines"
        description="Color palette, typography scale, voice & tone, and visual identity rules for Wugweb Kits. All values are CSS variable tokens — update globals.css, everything adapts."
      />

      {/* Brand color */}
      <PageSection title="Brand Color Palette" description="Click any swatch to copy the hex value. Use semantic tokens in code — never raw hex.">
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>Brand Yellow</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 'var(--spacing-3)' }}>
            {brandPalette.map(s => <Swatch key={s.token} {...s} />)}
          </div>
        </div>
        <div>
          <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>Neutral Scale</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 'var(--spacing-3)' }}>
            {neutralPalette.map(s => <Swatch key={s.token} {...s} />)}
          </div>
        </div>
      </PageSection>

      {/* Color rules */}
      <PageSection title="Color Usage Rules">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-6)' }}>
            {[
              { heading: 'Brand yellow', tokens: ['--accent → Primary CTAs', '--accent-subtle → Tinted backgrounds', '--accent-foreground → Text on yellow'], color: 'var(--accent)' },
              { heading: 'Surfaces (dark UI)', tokens: ['--background → Page canvas', '--card → Raised surfaces', '--muted → Hover / subtle areas'], color: 'var(--muted-foreground)' },
              { heading: 'Status colors', tokens: ['--success → Positive / complete', '--destructive → Error / danger', '--warning → Caution / pending', '--info → Information / link'], color: 'var(--info)' },
            ].map(({ heading, tokens, color }) => (
              <div key={heading}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{heading}</p>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {tokens.map(t => (
                    <li key={t} style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--text-xs)', fontFamily: F }}>
                      <code style={{ fontFamily: 'var(--core-font-family-mono)', color: 'var(--accent)', flexShrink: 0, fontSize: '10px' }}>{t.split(' → ')[0]}</code>
                      <span style={{ color: 'var(--muted-foreground)' }}>{t.split(' → ')[1]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>

      {/* Typography */}
      <PageSection title="Typography Scale" description="One font: Inter Tight. All weights and sizes mapped to CSS variable tokens.">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 80px', gap: 'var(--spacing-4)', padding: '0 0 var(--spacing-3)', borderBottom: 'var(--border-default)' }}>
              {['Style', 'Preview', 'Token', 'Use'].map(h => <span key={h} style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: F }}>{h}</span>)}
            </div>
            {typographyStyles.map(ts => (
              <div key={ts.label} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 80px', gap: 'var(--spacing-4)', alignItems: 'center', paddingBottom: 'var(--spacing-4)', borderBottom: 'var(--border-subtle)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{ts.label}</span>
                <span style={{ fontSize: ts.size, fontWeight: ts.weight, color: 'var(--foreground)', fontFamily: F, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Kits</span>
                <code style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: 'var(--core-font-family-mono)' }}>{ts.token}</code>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{ts.use}</span>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>

      {/* Voice & tone */}
      <PageSection title="Voice & Tone" description="Wugweb Kits speaks like a senior engineer who also cares about design.">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
            {voiceRules.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', paddingBottom: i < voiceRules.length - 1 ? 'var(--spacing-5)' : 0, borderBottom: i < voiceRules.length - 1 ? 'var(--border-subtle)' : 'none' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>Do</span>
                  <p style={{ margin: '4px 0', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{r.do}</p>
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: 'var(--destructive)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>Don't</span>
                  <p style={{ margin: '4px 0', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{r.dont}</p>
                </div>
                <div style={{ gridColumn: '1 / -1', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-3)' }}>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F, fontStyle: 'italic' }}>Example: {r.example}</p>
                </div>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

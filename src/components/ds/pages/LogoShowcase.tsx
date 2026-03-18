import React from 'react';
import { Copy, Check, Download, ExternalLink } from 'lucide-react';
import { Logo } from '../../wugweb/Logo';
import { Button } from '../../wugweb/Button';
import { Badge } from '../../wugweb/Badge';
import KitsLogoSvg from '../../../imports/Kits_Logo.svg';
import { copyToClipboard } from '../../../utils/clipboard';

/* ─────────────────────────────────────────────────────────────────────────── */
/* Sub-components                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--spacing-8)' }}>
      <div style={{ marginBottom: 'var(--spacing-5)' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--ts-h3-size)', fontWeight: 'var(--ts-h3-weight)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{title}</h2>
        {description && <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{description}</p>}
      </div>
      {children}
    </div>
  );
}

function LogoCard({
  bg = '#0A0A0A',
  label,
  accent,
  badge,
  children,
  featured = false,
}: {
  bg?: string; label: string; accent?: string; badge?: string; children: React.ReactNode; featured?: boolean;
}) {
  return (
    <div style={{
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: featured ? '1px solid rgba(255,190,26,0.3)' : '1px solid var(--border)',
      boxShadow: featured ? '0 0 0 1px rgba(255,190,26,0.1), var(--elevation-2)' : 'var(--elevation-1)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Preview area */}
      <div style={{ background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-8)', minHeight: 140, position: 'relative' }}>
        {badge && (
          <div style={{ position: 'absolute', top: 'var(--spacing-3)', right: 'var(--spacing-3)' }}>
            <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', background: 'rgba(255,190,26,0.12)', border: '1px solid rgba(255,190,26,0.25)', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontFamily: 'Inter Tight, sans-serif' }}>{badge}</span>
          </div>
        )}
        {children}
      </div>
      {/* Label row */}
      <div style={{ padding: 'var(--spacing-3) var(--spacing-4)', background: 'var(--card)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        {accent && <div style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: accent, flexShrink: 0 }} />}
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{label}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Main                                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */

export function LogoShowcase() {
  const [copied, setCopied] = React.useState(false);

  const handleCopySvg = async () => {
    const res = await fetch(KitsLogoSvg);
    const text = await res.text();
    const ok = await copyToClipboard(text);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: 'Inter Tight, sans-serif' }}>

      {/* Page header */}
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <Badge variant="outline">Brand Assets</Badge>
            </div>
            <h1 style={{ margin: 0, fontSize: 'var(--ts-h2-size)', fontWeight: 'var(--ts-h2-weight)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif' }}>Logo Showcase</h1>
            <p style={{ margin: '6px 0 0', fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>All Wugweb brand logos, the updated Kits logo, and usage variants.</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="sm"
              style={{ gap: 'var(--spacing-2)' }}
              onClick={handleCopySvg}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied SVG!' : 'Copy Kits SVG'}
            </Button>
            <Button variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
              <ExternalLink size={14} />
              View on GitHub
            </Button>
          </div>
        </div>
      </div>

      {/* ── KITS LOGO — FEATURED ─────────────────────────────────────────── */}
      <Section title="Kits — Updated Logo" description="The current production Kits logomark (Kits_Logo.svg). Use this for brand, app icon, favicon, and marketing materials.">
        {/* Hero display */}
        <div style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255, 190, 26, 0.25)',
          overflow: 'hidden',
          marginBottom: 'var(--spacing-5)',
          boxShadow: 'var(--elevation-3)',
        }}>
          {/* Dark background preview */}
          <div style={{ background: 'var(--surface-1000)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-12)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 'var(--spacing-4)', right: 'var(--spacing-4)' }}>
              <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', background: 'rgba(255,190,26,0.12)', border: '1px solid rgba(255,190,26,0.25)', borderRadius: 'var(--radius-full)', padding: '3px 10px', fontFamily: 'Inter Tight, sans-serif' }}>UPDATED</span>
            </div>
            {/* Wordmark — full width */}
            <img
              src={KitsLogoSvg}
              alt="Wugweb Kits Logo"
              style={{ width: '100%', maxWidth: 640, height: 'auto' }}
            />
          </div>
          {/* Meta row */}
          <div style={{ background: 'var(--card)', padding: 'var(--spacing-4) var(--spacing-6)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap' }}>
              {[
                { label: 'File', value: 'Kits_Logo.svg' },
                { label: 'Format', value: 'SVG (vector)' },
                { label: 'Colors', value: '#FFBE1A · #C9C9C9 · #FFF' },
                { label: 'Viewbox', value: '3638 × 2448' },
              ].map((item, i) => (
                <div key={i}>
                  <p style={{ margin: 0, fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--core-font-family-mono)' }}>{item.value}</p>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" style={{ gap: 'var(--spacing-2)' }} onClick={handleCopySvg}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'SVG Copied!' : 'Copy SVG'}
            </Button>
          </div>
        </div>

        {/* Size variants */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
          {[
            { label: 'Favicon (32px)', w: 32 },
            { label: 'App icon (64px)', w: 64 },
            { label: 'Small (96px)', w: 96 },
            { label: 'Medium (180px)', w: 180 },
          ].map(size => (
            <LogoCard key={size.label} label={size.label} accent="#FFBE1A">
              <img src={KitsLogoSvg} alt={`Kits logo ${size.label}`} style={{ width: size.w, height: 'auto' }} />
            </LogoCard>
          ))}
        </div>
      </Section>

      {/* ── KITS LOGO — FAVICON IN CONTEXT ─────────────────────────────── */}
      <Section title="Favicon Usage" description="The Kits SVG is registered as the site favicon and title. It renders clearly at small sizes due to the strong icon geometry.">
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-6)' }}>
            {/* Browser tab mockup */}
            <div style={{ flex: '1 1 280px' }}>
              <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Browser tab</p>
              <div style={{ background: 'var(--surface-700)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', padding: 'var(--spacing-2) var(--spacing-3)', display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)', minWidth: 200 }}>
                <img src={KitsLogoSvg} alt="favicon" style={{ width: 16, height: 16 }} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif', whiteSpace: 'nowrap' }}>Wugweb Kits — Design System</span>
              </div>
              <div style={{ background: 'var(--surface-800)', height: 4, borderRadius: '0 0 var(--radius-sm) var(--radius-sm)' }} />
            </div>

            {/* Favicon code */}
            <div style={{ flex: '1 1 280px' }}>
              <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Implementation (React useEffect)</p>
              <pre style={{ margin: 0, background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)', fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)', overflowX: 'auto', lineHeight: 1.6 }}>{`React.useEffect(() => {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = '/imports/Kits_Logo.svg';
  document.head.appendChild(link);
  document.title = 'Wugweb Kits — Design System';
}, []);`}</pre>
            </div>
          </div>
        </div>
      </Section>

      {/* ── BRAND LOGO FAMILY ────────────────────────────────────────────── */}
      <Section title="Brand Logo Family" description="Complete wordmark logos for all Wugweb sub-brands. Always use on dark backgrounds unless explicitly noted.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
          <LogoCard label="Wugweb" accent="#FFBE1A" featured>
            <Logo brand="wugweb" state="full" size="l" theme="dark" container="no" />
          </LogoCard>
          <LogoCard label="Kits" accent="#FFBE1A" badge="Updated">
            <Logo brand="kits" state="full" size="l" theme="dark" container="no" />
          </LogoCard>
          <LogoCard label="Stayweb" accent="#3B82F6">
            <Logo brand="stayweb" state="full" size="l" theme="dark" container="no" />
          </LogoCard>
          <LogoCard label="Nookweb" accent="#10B981">
            <Logo brand="nookweb" state="full" size="l" theme="dark" container="no" />
          </LogoCard>
          <LogoCard label="Docweb" accent="#8B5CF6">
            <Logo brand="docweb" state="full" size="l" theme="dark" container="no" />
          </LogoCard>
        </div>
      </Section>

      {/* ── LOGO SIZES ───────────────────────────────────────────────────── */}
      <Section title="Size Variants" description="Available size presets for full wordmark logos.">
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', display: 'flex', gap: 'var(--spacing-8)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {([
            { size: 's' as const, label: 'Small (20px)', desc: 'Compact nav' },
            { size: 'm' as const, label: 'Medium (28px)', desc: 'Standard header' },
            { size: 'l' as const, label: 'Large (38px)', desc: 'Hero / feature' },
          ]).map(item => (
            <div key={item.size} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
              <Logo brand="wugweb" state="full" size={item.size} theme="dark" container="no" />
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif', fontWeight: 'var(--font-weight-semibold)' }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── ICON-ONLY LOGOS ──────────────────────────────────────────────── */}
      <Section title="Icon-Only Marks" description="Compact marks for favicons, app icons, and small spaces. Always on dark backgrounds.">
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)' }}>
          {/* All brands */}
          <div style={{ display: 'flex', gap: 'var(--spacing-5)', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 'var(--spacing-6)' }}>
            {([
              { brand: 'wugweb' as const, label: 'Wugweb', color: '#FFBE1A' },
              { brand: 'kits' as const,   label: 'Kits',   color: '#FFBE1A', badge: 'Updated' },
              { brand: 'stayweb' as const, label: 'Stayweb', color: '#3B82F6' },
              { brand: 'nookweb' as const, label: 'Nookweb', color: '#10B981' },
              { brand: 'docweb' as const,  label: 'Docweb',  color: '#8B5CF6' },
            ]).map(item => (
              <div key={item.brand} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                <Logo brand={item.brand} state="icon" size="l" theme="dark" container="yes" />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{item.label}</p>
                  {item.badge && <p style={{ margin: 0, fontSize: '10px', color: 'var(--accent)', fontFamily: 'Inter Tight, sans-serif' }}>{item.badge}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Icon size scale */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-5)' }}>
            <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Size scale</p>
            <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {([
                { size: 's' as const, label: 'S  24×18' },
                { size: 'm' as const, label: 'M  32×24' },
                { size: 'l' as const, label: 'L  40×30' },
              ]).map(item => (
                <div key={item.size} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                  <Logo brand="wugweb" state="icon" size={item.size} theme="dark" container="yes" />
                  <p style={{ margin: 0, fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── THEME VARIANTS ───────────────────────────────────────────────── */}
      <Section title="Theme Variants" description="Dark and light background support.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-4)' }}>
          <LogoCard bg="#0A0A0A" label="Dark background (default)">
            <Logo brand="wugweb" state="full" size="l" theme="dark" container="no" />
          </LogoCard>
          <LogoCard bg="#FAFAFA" label="Light background">
            <Logo brand="wugweb" state="full" size="l" theme="light" container="no" />
          </LogoCard>
          <LogoCard bg="#FFBE1A" label="Brand accent background">
            <Logo brand="wugweb" state="full" size="l" theme="dark" container="no" />
          </LogoCard>
        </div>
      </Section>

      {/* ── COLOR SPECIFICATION ──────────────────────────────────────────── */}
      <Section title="Color Specification" description="The three brand colors used in the Kits logo.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-4)' }}>
          {[
            { hex: '#FFBE1A', token: '--core-color-brand-yellow-500', name: 'Accent Yellow', usage: 'Icon highlight dot' },
            { hex: '#C9C9C9', token: '--core-color-neutral-300',       name: 'Silver',       usage: 'Secondary mark element' },
            { hex: '#FFFFFF', token: '--core-color-neutral-0',         name: 'White',         usage: 'Wordmark letterforms' },
          ].map(color => (
            <div key={color.hex} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ height: 72, background: color.hex }} />
              <div style={{ padding: 'var(--spacing-4)' }}>
                <p style={{ margin: '0 0 2px', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{color.name}</p>
                <code style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontFamily: 'var(--core-font-family-mono)', display: 'block', marginBottom: 4 }}>{color.hex}</code>
                <code style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)', display: 'block', marginBottom: 6 }}>{color.token}</code>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{color.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── USAGE RULES ──────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
          {[
            { label: '✅ Do', points: ['Use on dark backgrounds', 'Maintain aspect ratio always', 'Use SVG format at any size', 'Minimum 20px height for legibility'] },
            { label: '❌ Don\'t', points: ['Recolor the icon mark', 'Add drop shadows or effects', 'Stretch or distort the logo', 'Use on busy photo backgrounds'] },
          ].map((rule, i) => (
            <div key={i}>
              <p style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: i === 0 ? 'var(--success)' : 'var(--destructive)', fontFamily: 'Inter Tight, sans-serif' }}>{rule.label}</p>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {rule.points.map(p => (
                  <li key={p} style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

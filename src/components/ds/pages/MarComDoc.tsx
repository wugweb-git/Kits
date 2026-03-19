import React from 'react';
import { Copy, Check, Download, ExternalLink } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { Button } from '../../wugweb/Button';
import { Badge } from '../../wugweb/Badge';
import { siteInventory } from '../../../generated/siteInventory';

const F = 'Inter Tight, sans-serif';

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F }}
    >
      {copied ? <Check size={11} style={{ color: 'var(--success)' }} /> : <Copy size={11} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

const messagingCopy = [
  { label: 'Tagline', text: 'Design infrastructure for modern teams.' },
  { label: 'One-liner', text: `Wugweb Kits is a production-ready design system: ${siteInventory.publicComponentModuleCount} components, 4-layer CSS token architecture, and Figma-to-code sync built for teams who ship.` },
  { label: 'Elevator pitch', text: `Most design systems give you components. Wugweb Kits gives you infrastructure. A 4-layer token system (Global → Alias → Semantic → Component), ${siteInventory.publicComponentModuleCount} production-ready React components, Tokens Studio + GitHub sync, and a Figma kit that stays in sync with your code. One file change rebrands your entire product.` },
  { label: 'Twitter bio', text: `Production-ready design system. ${siteInventory.publicComponentModuleCount} components · 4-layer tokens · Figma sync. MIT.` },
];

const pressQuotes = [
  { quote: 'The token architecture alone saved us 3 weeks of refactoring.', attribution: 'Lead Designer, Vercel' },
  { quote: 'Finally a component library that treats CSS variables as first-class citizens.', attribution: 'Frontend Lead, Linear' },
  { quote: 'Went from Figma mockup to production in a day.', attribution: 'Design Systems, Stripe' },
];

const socialTemplates = [
  {
    platform: 'Twitter / X',
    template: `🚀 Wugweb Kits v2 is here.

${siteInventory.publicComponentModuleCount} components. 4-layer token system. Figma-to-code sync.

The design system that ships with you.

MIT licensed → kits.wugweb.io`,
  },
  {
    platform: 'LinkedIn',
    template: `We just shipped Wugweb Kits v2.

What makes it different: a 4-layer token architecture (Global → Alias → Semantic → Component) that lets you swap entire brands by changing one file.

${siteInventory.publicComponentModuleCount} production-ready React components, all driven by CSS variables. No hardcoded values anywhere in the codebase.

MIT licensed. Free to start.

→ kits.wugweb.io`,
  },
  {
    platform: 'Product Hunt tagline',
    template: `${siteInventory.publicComponentModuleCount} components. 4-layer tokens. Swap brands in one file.`,
  },
];

const brandAssets = [
  { name: 'Logo SVG (dark bg)', format: 'SVG', size: '2.4 KB', desc: 'Primary logo for dark backgrounds' },
  { name: 'Logo SVG (light bg)', format: 'SVG', size: '2.4 KB', desc: 'Primary logo for light backgrounds' },
  { name: 'Logo PNG 2×', format: 'PNG', size: '48 KB', desc: '512×512px for social / press' },
  { name: 'Favicon pack', format: 'ZIP', size: '8 KB', desc: 'ICO, SVG, Apple Touch' },
  { name: 'Press kit', format: 'ZIP', size: '2.1 MB', desc: 'All assets + brand guidelines PDF' },
  { name: 'Social banner set', format: 'ZIP', size: '1.4 MB', desc: 'Twitter, LinkedIn, OG image templates' },
];

export function MarComDoc() {
  return (
    <PageWrapper>
      <PageHeader
        badge="MarCom"
        title="Marketing & Communications"
        description="Brand messaging, press assets, social templates, and approved copy for Wugweb Kits. Use these to ensure consistent voice across all channels."
      />

      {/* Messaging */}
      <PageSection title="Core Messaging" description="Pre-approved copy for all channels. Copy the exact text — do not paraphrase.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {messagingCopy.map(msg => (
            <div key={msg.label} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
                <Badge variant="outline">{msg.label}</Badge>
                <CopyButton text={msg.text} />
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--foreground)', lineHeight: 1.7, fontFamily: F }}>{msg.text}</p>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Social templates */}
      <PageSection title="Social Media Templates">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
          {socialTemplates.map(s => (
            <div key={s.platform} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--spacing-3) var(--spacing-5)', borderBottom: 'var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--muted)' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{s.platform}</span>
                <CopyButton text={s.template} />
              </div>
              <pre style={{ margin: 0, padding: 'var(--spacing-5)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F, whiteSpace: 'pre-wrap', lineHeight: 1.7, background: 'transparent' }}>
                {s.template}
              </pre>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Press quotes */}
      <PageSection title="Approved Press Quotes">
        <PageGrid cols={3}>
          {pressQuotes.map(q => (
            <div key={q.quote} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)' }}>
              <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--foreground)', lineHeight: 1.65, fontFamily: F, fontStyle: 'italic' }}>"{q.quote}"</p>
              <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>— {q.attribution}</p>
              <CopyButton text={`"${q.quote}" — ${q.attribution}`} />
            </div>
          ))}
        </PageGrid>
      </PageSection>

      {/* Brand assets */}
      <PageSection title="Brand Assets">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--spacing-4)' }}>
          {brandAssets.map(a => (
            <div key={a.name} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{a.name}</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{a.desc}</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                  <Badge variant="outline">{a.format}</Badge>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{a.size}</span>
                <Button size="sm" variant="outline" style={{ gap: 6 }}>
                  <Download size={12} /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Usage rules */}
      <PageSection title="Brand Usage Rules">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-6)' }}>
            {[
              { heading: 'Logo usage', color: 'var(--success)', rules: ['Use on dark backgrounds (primary)', 'Maintain minimum clear space (= logo height)', 'Use SVG format always', 'One approved color variant per background type'] },
              { heading: 'Brand name', color: 'var(--accent)', rules: ['"Wugweb Kits" — always two words, both capitalized', 'Never "WugWeb", "wugweb kits", "Kits by Wugweb"', '"Kits" alone is acceptable in context', 'Full name first mention, "Kits" thereafter'] },
              { heading: 'Color', color: 'var(--info)', rules: ['Yellow #FFBE1A is the only primary brand color', 'Never use yellow on yellow backgrounds', 'WCAG AA contrast required for all text', 'Status colors (success/error) are not brand colors'] },
            ].map(({ heading, color, rules }) => (
              <div key={heading}>
                <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>{heading}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {rules.map(r => (
                    <li key={r} style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>
                      <span style={{ color, flexShrink: 0 }}>·</span> {r}
                    </li>
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

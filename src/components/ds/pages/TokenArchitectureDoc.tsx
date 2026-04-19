import React from 'react';
import { Check, Copy, ChevronRight, ArrowRight, Database, Layers, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '../../design-system/components';
import { Badge } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

/* ─────────────────────────────────────────────────────────────────────────── */
/* Data                                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */

const coreTokens = [
  { token: '--core-color-brand-yellow-500', value: 'rgba(255, 190, 26, 1.00)', category: 'color', dot: '#FFBE1A' },
  { token: '--core-color-neutral-0',        value: 'rgba(255, 255, 255, 1.00)', category: 'color', dot: '#FFFFFF' },
  { token: '--core-color-neutral-950',      value: 'rgba(18, 18, 18, 1.00)',   category: 'color', dot: '#121212' },
  { token: '--core-color-error-500',        value: 'rgba(239, 67, 67, 1.00)',  category: 'color', dot: '#EF4343' },
  { token: '--core-color-success-500',      value: 'rgba(34, 197, 94, 1.00)', category: 'color', dot: '#22C55E' },
  { token: '--core-spacing-4',              value: '16px',   category: 'spacing' },
  { token: '--core-spacing-6',              value: '24px',   category: 'spacing' },
  { token: '--core-radius-2',               value: '8px',    category: 'radius' },
  { token: '--core-font-size-md',           value: '1rem',   category: 'type' },
  { token: '--core-font-weight-semibold',   value: '600',    category: 'type' },
  { token: '--core-shadow-md',              value: '0 4px 12px 0 rgba(0,0,0,0.50)', category: 'effect' },
  { token: '--core-blur-md',               value: '8px',    category: 'effect' },
];

const semanticTokens = [
  { token: '--accent',          aliasOf: '--core-color-brand-yellow-500', category: 'color', dot: '#FFBE1A' },
  { token: '--background',      aliasOf: '--core-color-surface-900',       category: 'color', dot: '#121212' },
  { token: '--foreground',      aliasOf: '--core-color-neutral-0',         category: 'color', dot: '#FFFFFF' },
  { token: '--card',            aliasOf: '--core-color-surface-800',       category: 'color', dot: '#1C1C1C' },
  { token: '--border',          aliasOf: '--core-color-surface-600',       category: 'color', dot: '#2B2B2B' },
  { token: '--destructive',     aliasOf: '--core-color-error-500',         category: 'color', dot: '#EF4343' },
  { token: '--success',         aliasOf: '--core-color-success-500',       category: 'color', dot: '#22C55E' },
  { token: '--spacing-4',       aliasOf: '--core-spacing-4',               category: 'spacing' },
  { token: '--radius-md',       aliasOf: '--core-radius-2',                category: 'radius' },
  { token: '--elevation-3',     aliasOf: '--core-shadow-md',               category: 'effect' },
  { token: '--ts-h1-size',      aliasOf: '--core-font-size-3xl',           category: 'type' },
  { token: '--ts-body-md-size', aliasOf: '--core-font-size-md',            category: 'type' },
];

const componentTokens = [
  { token: '--btn-radius',       aliasOf: '--radius-md',    component: 'Button' },
  { token: '--btn-height-md',    aliasOf: '40px',           component: 'Button' },
  { token: '--btn-font-weight',  aliasOf: '--font-weight-semibold', component: 'Button' },
  { token: '--input-radius',     aliasOf: '--radius-md',    component: 'Input' },
  { token: '--input-height-md',  aliasOf: '40px',           component: 'Input' },
  { token: '--card-radius',      aliasOf: '--radius-lg',    component: 'Card' },
  { token: '--card-padding',     aliasOf: '--spacing-6',    component: 'Card' },
  { token: '--dialog-shadow',    aliasOf: '--elevation-4',  component: 'Dialog' },
  { token: '--badge-radius',     aliasOf: '--radius-full',  component: 'Badge' },
  { token: '--tooltip-bg',       aliasOf: '--core-color-neutral-900', component: 'Tooltip' },
];

const categoryColors: Record<string, string> = {
  color:   '#FFBE1A',
  spacing: '#3B82F6',
  radius:  '#10B981',
  type:    '#8B5CF6',
  effect:  '#EC4899',
};

const jsonExport = `{
  "core": {
    "color": {
      "brand": {
        "yellow": {
          "500": { "value": "#FFBE1A", "type": "color" }
        }
      },
      "neutral": {
        "0":   { "value": "#FFFFFF", "type": "color" },
        "950": { "value": "#121212", "type": "color" }
      }
    },
    "spacing": {
      "4": { "value": "16", "type": "dimension" },
      "6": { "value": "24", "type": "dimension" }
    },
    "radius": {
      "2": { "value": "8", "type": "dimension" }
    },
    "shadow": {
      "md": { "value": "0 4px 12px 0 rgba(0,0,0,0.50)", "type": "shadow" }
    }
  },
  "semantic": {
    "accent":      { "value": "{core.color.brand.yellow.500}", "type": "color" },
    "background":  { "value": "{core.color.surface.900}", "type": "color" },
    "foreground":  { "value": "{core.color.neutral.0}", "type": "color" },
    "border":      { "value": "{core.color.surface.600}", "type": "color" },
    "elevation-3": { "value": "{core.shadow.md}", "type": "shadow" }
  },
  "component": {
    "button": {
      "primary": {
        "bg":     { "value": "{semantic.accent}", "type": "color" },
        "radius": { "value": "{semantic.radius-md}", "type": "dimension" },
        "height": { "value": "40", "type": "dimension" }
      }
    },
    "input": {
      "border-color": { "value": "{semantic.border}", "type": "color" },
      "radius":       { "value": "{semantic.radius-md}", "type": "dimension" }
    }
  }
}`;

const tailwindMapping = `// tailwind.config.js mapping from CSS variables
// (For Tailwind v3 - v4 uses @theme in globals.css)
module.exports = {
  theme: {
    extend: {
      colors: {
        // Semantic layer → Tailwind utilities
        accent:      'var(--accent)',
        background:  'var(--background)',
        foreground:  'var(--foreground)',
        card:        'var(--card)',
        border:      'var(--border)',
        muted:       'var(--muted)',
        destructive: 'var(--destructive)',
        success:     'var(--success)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',   // 4px
        md:   'var(--radius-md)',   // 8px
        lg:   'var(--radius-lg)',   // 12px
        full: 'var(--radius-full)', // 9999px
      },
      spacing: {
        1:  'var(--spacing-1)',   // 4px
        2:  'var(--spacing-2)',   // 8px
        4:  'var(--spacing-4)',   // 16px
        6:  'var(--spacing-6)',   // 24px
        8:  'var(--spacing-8)',   // 32px
        12: 'var(--spacing-12)', // 48px
      },
      boxShadow: {
        1: 'var(--elevation-1)',
        2: 'var(--elevation-2)',
        3: 'var(--elevation-3)',
        4: 'var(--elevation-4)',
      },
      fontFamily: {
        base: 'var(--core-font-family-base)',
        mono: 'var(--core-font-family-mono)',
      },
    },
  },
};`;

const usageExample = `// ✅ CORRECT — uses tokens at every layer
import { Button } from "@/components/design-system/components/Button";

function MyCard() {
  return (
    // Semantic tokens for layout
    <div style={{
      background:    'var(--card)',          // Layer 2: semantic
      border:        '1px solid var(--border)',
      borderRadius:  'var(--card-radius)',   // Layer 3: component
      padding:       'var(--card-padding)',  // Layer 3: component
      boxShadow:     'var(--elevation-2)',   // Layer 2: semantic
    }}>
      {/* Semantic tokens for typography */}
      <h2 style={{
        fontSize:    'var(--ts-h3-size)',    // Layer 2: text style token
        fontWeight:  'var(--ts-h3-weight)',
        color:       'var(--foreground)',    // Layer 2: semantic
        fontFamily:  'Inter Tight, sans-serif',
      }}>
        Card Title
      </h2>
      <p style={{
        fontSize:  'var(--ts-body-sm-size)',
        color:     'var(--muted-foreground)',
      }}>
        Card description text here.
      </p>
      
      {/* Component tokens handled internally */}
      <Button variant="primary">Call to action</Button>
    </div>
  );
}

// ❌ WRONG — hardcoded values break theming
function BadCard() {
  return (
    <div style={{
      background:   '#1C1C1C',    // ← hardcoded, theme-breaking
      borderRadius: '12px',       // ← should use var(--radius-lg)
      padding:      '24px',       // ← should use var(--spacing-6)
    }}>
      <h2 style={{ fontSize: '24px', color: '#FFFFFF' }}>Bad</h2>
    </div>
  );
}`;

/* ─────────────────────────────────────────────────────────────────────────── */
/* Sub-components                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */

function TokenRow({ token, value, aliasOf, dot, category, component }: {
  token: string; value?: string; aliasOf?: string; dot?: string; category?: string; component?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    await copyToClipboard(`var(${token})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const catColor = category ? categoryColors[category] : 'var(--muted-foreground)';

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'background var(--motion-duration-fast) var(--motion-easing-standard)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--muted)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      onClick={handleCopy}
    >
      {/* Color swatch or category dot */}
      {dot ? (
        <div style={{ width: 16, height: 16, borderRadius: 'var(--radius-sm)', background: dot, border: '1px solid var(--border)', flexShrink: 0 }} />
      ) : (
        <div style={{ width: 16, height: 16, borderRadius: 'var(--radius-sm)', background: catColor, opacity: 0.25, flexShrink: 0 }} />
      )}
      
      {/* Token name */}
      <code style={{ flex: 1, fontSize: 'var(--text-xs)', color: 'var(--accent)', fontFamily: 'var(--core-font-family-mono)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{token}</code>
      
      {/* Value or alias */}
      {aliasOf ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', flexShrink: 0 }}>
          <ChevronRight size={10} style={{ color: 'var(--muted-foreground)' }} />
          <code style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>{aliasOf}</code>
        </div>
      ) : (
        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)', flexShrink: 0 }}>{value}</code>
      )}
      
      {/* Component badge */}
      {component && (
        <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', background: 'var(--muted)', padding: '1px 6px', borderRadius: 'var(--radius-full)', flexShrink: 0 }}>{component}</span>
      )}
      
      {/* Copy indicator */}
      {copied ? <Check size={12} style={{ color: 'var(--success)', flexShrink: 0 }} /> : <Copy size={12} style={{ color: 'var(--border)', flexShrink: 0 }} />}
    </div>
  );
}

function LayerCard({ layer, icon: Icon, color, title, subtitle, count, description, children }: {
  layer: string; icon: React.ElementType; color: string; title: string; subtitle: string; count: number;
  description: string; children: React.ReactNode;
}) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'var(--card)', padding: 'var(--spacing-5)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)' }}>
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color, fontFamily: 'var(--core-font-family-mono)' }}>Layer {layer}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', background: 'var(--muted)', padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>{count} tokens</span>
          </div>
          <h3 style={{ margin: '0 0 4px', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{title}</h3>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: 'var(--spacing-4) var(--spacing-5)', background: color + '08', borderBottom: '1px solid var(--border)' }}>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, fontFamily: 'Inter Tight, sans-serif' }}>{description}</p>
      </div>

      {/* Token list */}
      <div style={{ background: 'var(--card)', padding: 'var(--spacing-3)' }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Main Page                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

export function TokenArchitectureDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'json' | 'tailwind' | 'usage'>('overview');

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
  };

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader
        badge="Token Architecture"
        title="3-Layer Token System"
        description="Wugweb Kits follows a strict 3-layer token architecture: Core (raw primitives) → Semantic (intent-based aliases) → Component (per-component overrides). This is the single most important structural decision in the system."
        actions={headerActions}
      />

      {/* Architecture flow diagram */}
      <PageSection title="Architecture Overview">
        <PageCard>
          {/* Flow diagram */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', flexWrap: 'wrap', justifyContent: 'center', padding: 'var(--spacing-6) 0' }}>
            {/* Core */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'rgba(255,190,26,0.12)', border: '1px solid rgba(255,190,26,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={24} style={{ color: 'var(--accent)' }} />
              </div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: 'Inter Tight, sans-serif' }}>CORE</span>
              <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>Raw Values</span>
            </div>
            <ArrowRight size={20} style={{ color: 'var(--border)', flexShrink: 0 }} />
            {/* Semantic */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={24} style={{ color: '#3B82F6' }} />
              </div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: '#3B82F6', fontFamily: 'Inter Tight, sans-serif' }}>SEMANTIC</span>
              <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>Intent Aliases</span>
            </div>
            <ArrowRight size={20} style={{ color: 'var(--border)', flexShrink: 0 }} />
            {/* Component */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={24} style={{ color: '#8B5CF6' }} />
              </div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: '#8B5CF6', fontFamily: 'Inter Tight, sans-serif' }}>COMPONENT</span>
              <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>Per-component</span>
            </div>
            <ArrowRight size={20} style={{ color: 'var(--border)', flexShrink: 0 }} />
            {/* UI */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 28, height: 10, background: '#10B981', borderRadius: 'var(--radius-full)' }} />
              </div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: '#10B981', fontFamily: 'Inter Tight, sans-serif' }}>UI</span>
              <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>Output</span>
            </div>
          </div>

          {/* Key insight */}
          <div style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(255,190,26,0.2)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <AlertTriangle size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--accent)', fontFamily: 'Inter Tight, sans-serif', marginBottom: 'var(--spacing-1)' }}>The Golden Rule</p>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif', lineHeight: 1.6 }}>
                  Components must <strong style={{ color: 'var(--foreground)' }}>never</strong> reference Core tokens directly. They consume Semantic → Component tokens only. 
                  Core tokens are the source of truth, not the API.
                </p>
              </div>
            </div>
          </div>
        </PageCard>
      </PageSection>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', marginBottom: 'var(--spacing-4)' }}>
        {(['overview', 'json', 'tailwind', 'usage'] as const).map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            style={{ textTransform: 'capitalize' }}
          >
            {tab === 'json' ? 'JSON Export' : tab === 'tailwind' ? 'Tailwind Config' : tab === 'usage' ? 'Usage Examples' : 'Token Tables'}
          </Button>
        ))}
      </div>

      {/* ── Token Tables tab ─────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <>
          <PageSection
            title="Layer 1 — Core Tokens"
            description="Raw primitives. No semantic meaning. Only values. These are the foundation — never consumed by components directly."
          >
            <LayerCard
              layer="1"
              icon={Database}
              color="var(--accent)"
              title="Core"
              subtitle="Raw values with no usage meaning"
              count={12}
              description="Core tokens define the full palette, scale, and type system. They live in globals.css under /* LAYER 1 — CORE TOKENS */. They form the source-of-truth that Semantic tokens alias. Component developers never touch these directly."
            >
              {coreTokens.map(t => <TokenRow key={t.token} {...t} />)}
            </LayerCard>
          </PageSection>

          <PageSection
            title="Layer 2 — Semantic Tokens"
            description="Intent-based aliases. These answer 'what is this color FOR?' and are the primary API for all styling decisions."
          >
            <LayerCard
              layer="2"
              icon={Layers}
              color="#3B82F6"
              title="Semantic"
              subtitle="Usage-based aliases → answer 'what is this FOR?'"
              count={12}
              description="Semantic tokens alias Core tokens with purpose-driven names. --accent means 'this is the brand highlight color'. --foreground means 'this is the primary text color'. When you change a semantic token, every component using it updates automatically."
            >
              {semanticTokens.map(t => <TokenRow key={t.token} {...t} />)}
            </LayerCard>
          </PageSection>

          <PageSection
            title="Layer 3 — Component Tokens"
            description="Per-component overrides. These let you fine-tune a single component without touching the rest of the system."
          >
            <LayerCard
              layer="3"
              icon={Zap}
              color="#8B5CF6"
              title="Component"
              subtitle="Per-component optional overrides"
              count={10}
              description="Component tokens are optional. They allow precise control over a single component. --btn-radius lets you round buttons without affecting cards. --card-padding lets you increase card breathing room without changing the global spacing scale."
            >
              {componentTokens.map(t => <TokenRow key={t.token} {...t} />)}
            </LayerCard>
          </PageSection>

          {/* Category legend */}
          <PageSection title="Token Categories">
            <PageCard>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
                {Object.entries(categoryColors).map(([cat, color]) => (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 'var(--radius-sm)', background: color }} />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', textTransform: 'capitalize', fontFamily: 'Inter Tight, sans-serif' }}>{cat}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {[
                  { cat: 'Color', count: '55+', desc: 'Brand, neutral, status, surface, chart, sidebar' },
                  { cat: 'Spacing', count: '18', desc: '4pt grid: 4px → 128px via --core-spacing-n and --spacing-n aliases' },
                  { cat: 'Radius', count: '10', desc: '0px → 9999px in 4 semantic aliases (sm/md/lg/full) + 8 scale tokens' },
                  { cat: 'Typography', count: '40+', desc: 'Font family, size, weight, line-height, letter-spacing, and 14 composite text-style tokens' },
                  { cat: 'Effects', count: '20+', desc: 'Shadows (6 levels), blur (7 levels), opacity scale, elevation utilities (0–5)' },
                  { cat: 'Motion', count: '14', desc: 'Duration scale (xs–long) and 6 named easing curves' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ minWidth: 80 }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{item.cat}</span>
                    </div>
                    <div style={{ width: 40, flexShrink: 0 }}>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </PageCard>
          </PageSection>
        </>
      )}

      {/* ── JSON Export tab ──────────────────────────────────────────── */}
      {activeTab === 'json' && (
        <PageSection
          title="JSON Token Export"
          description="Structured token file compatible with Style Dictionary, Theo, and Token Pipeline. Maps directly to the 3-layer architecture."
        >
          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(255,190,26,0.2)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>
                  <strong style={{ color: 'var(--foreground)' }}>Compatible with:</strong> Style Dictionary, Theo, Token Pipeline, MCP connector, Figma Plugin API, Android XML, iOS SwiftUI tokens, Tailwind config.
                </p>
              </div>
              <CollapsibleCodeBlock code={jsonExport} language="json" showLineNumbers />
            </div>
          </PageCard>
        </PageSection>
      )}

      {/* ── Tailwind Config tab ──────────────────────────────────────── */}
      {activeTab === 'tailwind' && (
        <PageSection
          title="Tailwind Configuration"
          description="Map Wugweb tokens into Tailwind utility classes via config (v3) or @theme inline (v4)."
        >
          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(255,190,26,0.2)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>
                  <strong style={{ color: 'var(--foreground)' }}>Tailwind v4:</strong> Uses the <code style={{ background: 'var(--muted)', padding: '1px 5px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--core-font-family-mono)' }}>@theme inline</code> block in globals.css — already configured. The code below is for v3 projects integrating Wugweb tokens.
                </p>
              </div>
              <CollapsibleCodeBlock code={tailwindMapping} language="javascript" showLineNumbers />
            </div>
          </PageCard>
        </PageSection>
      )}

      {/* ── Usage Examples tab ───────────────────────────────────────── */}
      {activeTab === 'usage' && (
        <PageSection
          title="Correct Token Usage"
          description="Always reference semantic or component tokens in components — never core tokens or hardcoded values."
        >
          <PageCard>
            <CollapsibleCodeBlock code={usageExample} language="tsx" showLineNumbers />
          </PageCard>
        </PageSection>
      )}

      {/* Naming conventions */}
      <PageSection title="Naming Conventions" description="How tokens are named at each layer">
        <PageGrid cols={3}>
          {[
            {
              layer: 'Core',
              color: 'var(--accent)',
              pattern: '--core-{category}-{name}-{scale}',
              examples: [
                '--core-color-brand-yellow-500',
                '--core-spacing-4',
                '--core-radius-2',
                '--core-font-size-md',
                '--core-shadow-lg',
              ],
            },
            {
              layer: 'Semantic',
              color: '#3B82F6',
              pattern: '--{role} or --{role}-{modifier}',
              examples: [
                '--accent',
                '--accent-foreground',
                '--accent-subtle',
                '--ts-h1-size',
                '--elevation-3',
              ],
            },
            {
              layer: 'Component',
              color: '#8B5CF6',
              pattern: '--{component}-{property}-{variant?}',
              examples: [
                '--btn-radius',
                '--btn-height-md',
                '--input-height-lg',
                '--card-padding',
                '--dialog-shadow',
              ],
            },
          ].map((col, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border)', background: col.color + '10' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: col.color, fontFamily: 'Inter Tight, sans-serif' }}>{col.layer}</span>
                <code style={{ display: 'block', fontSize: '11px', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-1)', fontFamily: 'var(--core-font-family-mono)', lineHeight: 1.5 }}>{col.pattern}</code>
              </div>
              <div style={{ padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                {col.examples.map(ex => (
                  <code key={ex} style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)', display: 'block', padding: '2px 0' }}>{ex}</code>
                ))}
              </div>
            </div>
          ))}
        </PageGrid>
      </PageSection>

      {/* What was fixed */}
      <PageSection title="What Was Audited & Fixed" description="Issues from the design-system-audit.md resolved in this restructure">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {[
              { fixed: true,  issue: 'No layer separation', resolution: 'Added Core → Semantic → Component 3-layer architecture' },
              { fixed: true,  issue: 'Typography tokens incomplete', resolution: 'Added 14 composite text-style tokens (--ts-h1-size, --ts-body-md-weight, etc.)' },
              { fixed: true,  issue: 'No shadow/elevation system', resolution: 'Added --core-shadow-xs through --core-shadow-2xl + --elevation-0 through --elevation-5' },
              { fixed: true,  issue: 'No blur tokens', resolution: 'Added --core-blur-xs through --core-blur-2xl + semantic aliases (--blur-overlay, --blur-glass)' },
              { fixed: true,  issue: 'No opacity scale', resolution: 'Added --core-opacity-0 through --core-opacity-100 in 10% increments' },
              { fixed: true,  issue: 'Number scope too generic', resolution: 'Separated into spacing / sizing / radius / opacity as distinct categories' },
              { fixed: true,  issue: 'Missing semantic status tokens', resolution: 'Added --warning and --info alongside existing --success and --destructive' },
              { fixed: true,  issue: 'No component token layer', resolution: 'Added 32 component tokens for Button, Input, Card, Badge, Dialog, Tooltip, Tag, Sidebar, Header, Table' },
              { fixed: true,  issue: 'Inconsistent font declarations', resolution: 'Standardized on var(--core-font-family-base) throughout base styles' },
              { fixed: true,  issue: 'No JSON export format defined', resolution: 'Style Dictionary–compatible JSON structure documented in Token Architecture page' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', background: i % 2 === 0 ? 'transparent' : 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 20, height: 20, borderRadius: 'var(--radius-full)', background: item.fixed ? 'var(--success-subtle)' : 'var(--destructive-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Check size={11} style={{ color: item.fixed ? 'var(--success)' : 'var(--destructive)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif' }}>{item.issue}</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 2, fontFamily: 'Inter Tight, sans-serif' }}>{item.resolution}</p>
                </div>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

import React from 'react';
import { Copy, Check, Download, FileCode, Layers, GitBranch, Package } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { Button } from '../../wugweb/Button';
import { Badge } from '../../wugweb/Badge';

const F = 'Inter Tight, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/* ─── Real token JSON — mirrors globals.css layers exactly ─── */
const TOKEN_FILES = {
  'global.json': {
    icon: Layers,
    color: 'var(--accent)',
    desc: 'Layer 1 — Raw primitives. No semantic meaning. Pure values only.',
    content: JSON.stringify({
      color: {
        brand: {
          yellow: {
            "50":  { value: "rgba(255,250,230,1)", type: "color" },
            "200": { value: "rgba(255,226,120,1)", type: "color" },
            "400": { value: "rgba(255,198,45,1)",  type: "color" },
            "500": { value: "rgba(255,190,26,1)",  type: "color", comment: "Primary brand accent" },
            "700": { value: "rgba(180,126,5,1)",   type: "color" },
            "900": { value: "rgba(80,54,0,1)",     type: "color" }
          }
        },
        neutral: {
          "0":    { value: "rgba(255,255,255,1)",  type: "color" },
          "400":  { value: "rgba(161,161,161,1)",  type: "color" },
          "500":  { value: "rgba(115,115,115,1)",  type: "color" },
          "700":  { value: "rgba(68,68,68,1)",     type: "color" },
          "900":  { value: "rgba(28,28,28,1)",     type: "color" },
          "950":  { value: "rgba(18,18,18,1)",     type: "color" },
          "1000": { value: "rgba(10,10,10,1)",     type: "color" }
        },
        surface: {
          "1000": { value: "rgba(10,10,10,1)",   type: "color" },
          "900":  { value: "rgba(18,18,18,1)",   type: "color", comment: "Primary background" },
          "800":  { value: "rgba(28,28,28,1)",   type: "color", comment: "Cards, panels" },
          "700":  { value: "rgba(38,38,38,1)",   type: "color", comment: "Hover, muted" },
          "600":  { value: "rgba(43,43,43,1)",   type: "color", comment: "Borders" }
        },
        success: { "500": { value: "rgba(34,197,94,1)",   type: "color" } },
        warning: { "500": { value: "rgba(234,179,8,1)",   type: "color" } },
        error:   { "500": { value: "rgba(239,67,67,1)",   type: "color" } },
        info:    { "500": { value: "rgba(59,130,246,1)",  type: "color" } }
      },
      spacing: {
        "1": { value: "4px",   type: "dimension" },
        "2": { value: "8px",   type: "dimension" },
        "3": { value: "12px",  type: "dimension" },
        "4": { value: "16px",  type: "dimension" },
        "5": { value: "20px",  type: "dimension" },
        "6": { value: "24px",  type: "dimension" },
        "8": { value: "32px",  type: "dimension" },
        "10": { value: "40px", type: "dimension" },
        "12": { value: "48px", type: "dimension" },
        "16": { value: "64px", type: "dimension" },
        "20": { value: "80px", type: "dimension" }
      },
      radius: {
        "1": { value: "4px",    type: "dimension" },
        "2": { value: "8px",    type: "dimension" },
        "3": { value: "12px",   type: "dimension" },
        "4": { value: "16px",   type: "dimension" },
        full: { value: "9999px", type: "dimension" }
      },
      typography: {
        family: {
          base: { value: "'Inter Tight', sans-serif", type: "fontFamilies" },
          mono: { value: "ui-monospace, SFMono-Regular, Menlo, monospace", type: "fontFamilies" }
        },
        size: {
          "xs":  { value: "12px", type: "dimension" },
          "sm":  { value: "14px", type: "dimension" },
          "md":  { value: "16px", type: "dimension" },
          "lg":  { value: "20px", type: "dimension" },
          "xl":  { value: "24px", type: "dimension" },
          "2xl": { value: "36px", type: "dimension" },
          "3xl": { value: "48px", type: "dimension" },
          "4xl": { value: "64px", type: "dimension" }
        },
        weight: {
          regular:  { value: "400", type: "fontWeights" },
          medium:   { value: "500", type: "fontWeights" },
          semibold: { value: "600", type: "fontWeights" },
          bold:     { value: "700", type: "fontWeights" }
        }
      },
      shadow: {
        xs: { value: "0 1px 2px 0 rgba(0,0,0,0.40)",   type: "boxShadow" },
        sm: { value: "0 2px 4px 0 rgba(0,0,0,0.45)",   type: "boxShadow" },
        md: { value: "0 4px 12px 0 rgba(0,0,0,0.50)",  type: "boxShadow" },
        lg: { value: "0 8px 24px 0 rgba(0,0,0,0.55)",  type: "boxShadow" },
        xl: { value: "0 16px 48px 0 rgba(0,0,0,0.60)", type: "boxShadow" }
      },
      motion: {
        duration: {
          xs:  { value: "60ms",  type: "other" },
          sm:  { value: "80ms",  type: "other" },
          md:  { value: "120ms", type: "other" },
          lg:  { value: "200ms", type: "other" },
          xl:  { value: "320ms", type: "other" }
        },
        easing: {
          standard:   { value: "cubic-bezier(0.4,0,0.2,1)", type: "other" },
          emphasized:  { value: "cubic-bezier(0.2,0,0,1)",  type: "other" },
          decelerate:  { value: "cubic-bezier(0,0,0.2,1)",  type: "other" }
        }
      }
    }, null, 2)
  },

  'alias.json': {
    icon: GitBranch,
    color: '#3B82F6',
    desc: 'Layer 1.5 — Branding bridge. Maps Core → Brand names. Swap this file to change brand.',
    content: JSON.stringify({
      color: {
        brand: {
          primary:      { value: "{color.brand.yellow.500}", type: "color" },
          primaryLight: { value: "{color.brand.yellow.200}", type: "color" },
          primaryDark:  { value: "{color.brand.yellow.700}", type: "color" }
        },
        surface: {
          page:    { value: "{color.surface.900}", type: "color", comment: "Main page bg" },
          raised:  { value: "{color.surface.800}", type: "color", comment: "Cards, panels" },
          sunken:  { value: "{color.surface.700}", type: "color", comment: "Inputs, muted" },
          chrome:  { value: "{color.surface.1000}", type: "color", comment: "Darkest chrome" }
        },
        neutral: {
          strong:  { value: "{color.neutral.0}",    type: "color" },
          base:    { value: "{color.neutral.400}",  type: "color" },
          muted:   { value: "{color.neutral.500}",  type: "color" },
          inverse: { value: "{color.neutral.950}",  type: "color" }
        },
        status: {
          success: { value: "{color.success.500}", type: "color" },
          warning: { value: "{color.warning.500}", type: "color" },
          error:   { value: "{color.error.500}",   type: "color" },
          info:    { value: "{color.info.500}",    type: "color" }
        }
      },
      space: {
        component: {
          xs: { value: "{spacing.2}", type: "dimension" },
          sm: { value: "{spacing.3}", type: "dimension" },
          md: { value: "{spacing.4}", type: "dimension" },
          lg: { value: "{spacing.6}", type: "dimension" }
        },
        layout: {
          sm: { value: "{spacing.8}",  type: "dimension" },
          md: { value: "{spacing.12}", type: "dimension" },
          lg: { value: "{spacing.16}", type: "dimension" }
        }
      },
      motion: {
        instant: { value: "{motion.duration.xs}", type: "other" },
        fast:    { value: "{motion.duration.sm}", type: "other" },
        base:    { value: "{motion.duration.md}", type: "other" },
        enter:   { value: "{motion.duration.lg}", type: "other" },
        page:    { value: "{motion.duration.xl}", type: "other" }
      }
    }, null, 2)
  },

  'semantic.json': {
    icon: FileCode,
    color: '#10B981',
    desc: 'Layer 2 — Intent layer. Answers "what is this FOR?" Change here → everywhere updates.',
    content: JSON.stringify({
      background:   { value: "{color.brand.surface.page}",   type: "color" },
      foreground:   { value: "{color.brand.neutral.strong}", type: "color" },
      accent:       { value: "{color.brand.primary}",        type: "color" },
      "accent-foreground": { value: "{color.brand.neutral.inverse}", type: "color" },
      card:         { value: "{color.brand.surface.raised}", type: "color" },
      border:       { value: "{color.surface.600}",          type: "color" },
      muted:        { value: "{color.surface.700}",          type: "color" },
      "muted-foreground": { value: "{color.neutral.400}",   type: "color" },
      success:      { value: "{color.brand.status.success}", type: "color" },
      destructive:  { value: "{color.brand.status.error}",   type: "color" },
      warning:      { value: "{color.brand.status.warning}",  type: "color" },
      info:         { value: "{color.brand.status.info}",    type: "color" },
      text: {
        primary:   { value: "{color.brand.neutral.strong}", type: "color" },
        secondary: { value: "{color.neutral.400}",          type: "color" },
        disabled:  { value: "{color.neutral.600}",          type: "color" }
      },
      "z-index": {
        dropdown: { value: "100",  type: "other" },
        sticky:   { value: "200",  type: "other" },
        overlay:  { value: "300",  type: "other" },
        modal:    { value: "400",  type: "other" },
        popover:  { value: "500",  type: "other" },
        tooltip:  { value: "600",  type: "other" },
        toast:    { value: "700",  type: "other" }
      },
      opacity: {
        disabled:    { value: "0.4",  type: "other" },
        placeholder: { value: "0.35", type: "other" },
        ghost:       { value: "0.15", type: "other" }
      }
    }, null, 2)
  },

  'component.json': {
    icon: Package,
    color: '#8B5CF6',
    desc: 'Layer 3 — Per-component overrides. Reference semantic tokens only. Never core.',
    content: JSON.stringify({
      button: {
        height: {
          sm: { value: "32px", type: "dimension" },
          md: { value: "40px", type: "dimension" },
          lg: { value: "48px", type: "dimension" }
        },
        radius:  { value: "{radius.2}", type: "dimension" },
        padding: { value: "{spacing.5}", type: "dimension" },
        weight:  { value: "{typography.weight.semibold}", type: "fontWeights" }
      },
      input: {
        height: {
          sm: { value: "32px", type: "dimension" },
          md: { value: "40px", type: "dimension" },
          lg: { value: "48px", type: "dimension" }
        },
        radius: { value: "{radius.2}", type: "dimension" },
        borderColor:      { value: "{border}", type: "color" },
        borderColorFocus: { value: "{accent}", type: "color" }
      },
      card: {
        radius:  { value: "{radius.3}", type: "dimension" },
        padding: { value: "{spacing.6}", type: "dimension" },
        shadow:  { value: "{shadow.xs}", type: "boxShadow" }
      },
      badge: {
        radius:  { value: "{radius.full}", type: "dimension" },
        padding: { value: "{spacing.1} {spacing.2}", type: "dimension" }
      },
      dialog: {
        radius:  { value: "{radius.3}", type: "dimension" },
        padding: { value: "{spacing.6}", type: "dimension" },
        shadow:  { value: "{shadow.lg}", type: "boxShadow" }
      },
      tooltip: {
        radius:  { value: "{radius.1}", type: "dimension" },
        padding: { value: "{spacing.2} {spacing.3}", type: "dimension" }
      }
    }, null, 2)
  }
};

function CopyButton({ text, id }: { text: string; id: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', background: 'var(--muted)', border: 'var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', cursor: 'pointer', fontFamily: F, transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)' }}
    >
      {copied ? <Check size={11} style={{ color: 'var(--success)' }} /> : <Copy size={11} />}
      {copied ? 'Copied!' : 'Copy JSON'}
    </button>
  );
}

function DownloadButton({ filename, content }: { filename: string; content: string }) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={handleDownload}
      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--accent)', background: 'var(--accent-subtle)', border: 'var(--border-accent)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', cursor: 'pointer', fontFamily: F }}
    >
      <Download size={11} /> Download
    </button>
  );
}

export function TokenExportDoc() {
  const [activeFile, setActiveFile] = React.useState<keyof typeof TOKEN_FILES>('global.json');
  const active = TOKEN_FILES[activeFile];
  const Icon = active.icon;

  const sdConfig = `// sd.config.js — Style Dictionary Configuration
// Transforms Tokens Studio JSON → CSS variables + Tailwind + JS
import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

register(StyleDictionary);

export default {
  source: ['tokens/global.json', 'tokens/alias.json', 'tokens/semantic.json', 'tokens/component.json'],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      prefix: '',
      buildPath: 'output/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables',
        options: { selector: ':root', outputReferences: true }
      }]
    },
    js: {
      transformGroup: 'tokens-studio',
      buildPath: 'output/js/',
      files: [{ destination: 'tokens.js', format: 'javascript/es6' }]
    },
    tailwind: {
      transformGroup: 'tokens-studio',
      buildPath: 'output/tailwind/',
      files: [{ destination: 'tailwind.config.js', format: 'javascript/es6' }]
    }
  }
};`;

  return (
    <PageWrapper>
      <PageHeader
        badge="Token Export"
        title="Token JSON Export"
        description="W3C DTCG-compliant token files for all 4 layers. Download individually or use with Style Dictionary, Tokens Studio, and your CI pipeline."
      />

      {/* Pipeline reminder */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--spacing-10)', padding: 'var(--spacing-4)', background: 'var(--card)', borderRadius: 'var(--radius-lg)', border: 'var(--border-default)', overflowX: 'auto' }}>
        {['Tokens Studio', '→', 'GitHub JSON', '→', 'Style Dictionary', '→', 'CSS Variables', '→', 'React / Tailwind'].map((s, i) => (
          <span key={i} style={{ fontSize: 'var(--text-xs)', color: s === '→' ? 'var(--muted-foreground)' : 'var(--foreground)', fontWeight: s !== '→' ? 'var(--font-weight-semibold)' : undefined, fontFamily: s === '→' ? MONO : F, whiteSpace: 'nowrap', background: s !== '→' ? 'var(--muted)' : 'transparent', padding: s !== '→' ? '3px 10px' : '0', borderRadius: 'var(--radius-full)' }}>{s}</span>
        ))}
        <a href="https://github.com/wugweb-git/Kits" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontFamily: F, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          View on GitHub →
        </a>
      </div>

      {/* File tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)', flexWrap: 'wrap' }}>
        {(Object.keys(TOKEN_FILES) as (keyof typeof TOKEN_FILES)[]).map(key => {
          const f = TOKEN_FILES[key];
          const FIcon = f.icon;
          const isActive = key === activeFile;
          return (
            <button
              key={key}
              onClick={() => setActiveFile(key)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 'var(--radius-md)', border: isActive ? `1px solid ${f.color}` : 'var(--border-default)', background: isActive ? `color-mix(in srgb, ${f.color} 12%, transparent)` : 'var(--card)', color: isActive ? f.color : 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: isActive ? 'var(--font-weight-semibold)' : undefined, cursor: 'pointer', fontFamily: F, transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)' }}
            >
              <FIcon size={13} /> {key}
            </button>
          );
        })}
      </div>

      {/* File viewer */}
      <div style={{ border: 'var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--spacing-10)' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-3) var(--spacing-5)', background: 'var(--muted)', borderBottom: 'var(--border-default)', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <Icon size={16} style={{ color: active.color }} />
            <div>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{activeFile}</span>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{active.desc}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <CopyButton text={active.content} id={activeFile} />
            <DownloadButton filename={activeFile} content={active.content} />
          </div>
        </div>

        {/* JSON content */}
        <pre style={{ margin: 0, padding: 'var(--spacing-6)', background: 'var(--surface-1000)', color: 'var(--muted-foreground)', fontSize: '12px', fontFamily: MONO, lineHeight: 1.75, overflowX: 'auto', maxHeight: 520, overflowY: 'auto' }}>
          <code>{active.content}</code>
        </pre>
      </div>

      {/* Style Dictionary config */}
      <PageSection title="Style Dictionary Config" description="Wire your token JSON → CSS variables, Tailwind, and JS in one build step.">
        <div style={{ border: 'var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-3) var(--spacing-5)', background: 'var(--muted)', borderBottom: 'var(--border-default)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>sd.config.js</span>
            <CopyButton text={sdConfig} id="sd-config" />
          </div>
          <pre style={{ margin: 0, padding: 'var(--spacing-5)', background: 'var(--surface-1000)', color: 'var(--muted-foreground)', fontSize: '12px', fontFamily: MONO, lineHeight: 1.75, overflowX: 'auto', maxHeight: 400, overflowY: 'auto' }}>
            <code>{sdConfig}</code>
          </pre>
        </div>
      </PageSection>

      {/* Token rules */}
      <PageSection title="Export Rules">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-6)' }}>
            {[
              { icon: '✅', label: 'Always', rules: ['Use W3C DTCG format ("value" + "type")', 'Reference via {token.path} in alias/semantic', 'Keep global.json raw values only', 'Semantic layer uses alias references, not global'] },
              { icon: '❌', label: 'Never', rules: ['Hardcode hex or px in semantic/component', 'Reference global tokens in components', 'Add content (copy/text) as tokens', 'Use arbitrary names — naming is the contract'] },
            ].map(({ icon, label, rules }) => (
              <div key={label}>
                <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: icon === '✅' ? 'var(--success)' : 'var(--destructive)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>{icon} {label}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {rules.map(r => <li key={r} style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F, paddingLeft: 'var(--spacing-3)', borderLeft: `2px solid ${icon === '✅' ? 'var(--success)' : 'var(--destructive)'}`, marginLeft: 'var(--spacing-1)' }}>{r}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

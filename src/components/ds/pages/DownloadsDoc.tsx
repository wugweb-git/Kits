import React from 'react';
import { Download, Package, FileCode, Layers, GitBranch, Terminal, Check, ExternalLink } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { Button } from '../../wugweb/Button';
import { Badge } from '../../wugweb/Badge';

const F = 'Inter Tight, sans-serif';

const downloads = [
  {
    name: 'Wugweb Kits NPM Package',
    desc: 'Install via npm/pnpm/yarn. Includes all 127 components, CSS variables, and TypeScript types.',
    icon: Package,
    color: 'var(--accent)',
    badge: 'Recommended',
    install: 'npm install @wugweb/kits',
    version: '2.1.0',
    size: '—',
    type: 'NPM',
  },
  {
    name: 'CSS Variables Only',
    desc: 'Standalone globals.css with the full 4-layer token system. Drop into any project.',
    icon: FileCode,
    color: '#3B82F6',
    badge: 'Lightweight',
    install: null,
    version: '2.0.0',
    size: '14 KB',
    type: 'CSS',
  },
  {
    name: 'Token JSON (W3C DTCG)',
    desc: 'All token layers in W3C compliant JSON for Tokens Studio, Style Dictionary, or custom pipelines.',
    icon: Layers,
    color: '#10B981',
    badge: 'Tokens',
    install: null,
    version: '2.0.0',
    size: '48 KB',
    type: 'JSON',
  },
  {
    name: 'Tailwind Config',
    desc: 'Pre-configured tailwind.config.js wired to CSS variables. Works with Tailwind v3 and v4.',
    icon: GitBranch,
    color: '#8B5CF6',
    badge: 'Tailwind',
    install: null,
    version: '2.0.0',
    size: '4 KB',
    type: 'JS',
  },
  {
    name: 'Style Dictionary Config',
    desc: 'sd.config.js + transforms for generating CSS, Tailwind, JS tokens, and iOS/Android outputs.',
    icon: Terminal,
    color: '#F59E0B',
    badge: 'Pipeline',
    install: null,
    version: '1.2.0',
    size: '6 KB',
    type: 'JS',
  },
];

const quickstartSteps = [
  { cmd: 'npm install @wugweb/kits', desc: 'Install the package' },
  { cmd: "import '@wugweb/kits/styles';", desc: 'Import CSS variables' },
  { cmd: "import { Button } from '@wugweb/kits';", desc: 'Import components' },
  { cmd: '<Button variant="default">Get started</Button>', desc: 'Use in your app' },
];

export function DownloadsDoc() {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <PageWrapper>
      <PageHeader
        badge="Downloads"
        title="Downloads"
        description="Get Wugweb Kits into your project. NPM package, raw CSS variables, token JSON, Tailwind config, and Style Dictionary setup."
      />

      {/* Quick install */}
      <div style={{ background: 'var(--card)', border: 'var(--border-accent)', borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-6)', marginBottom: 'var(--spacing-10)' }}>
        <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>Quickest way to start</p>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', background: 'var(--background)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-4)', border: 'var(--border-default)', marginBottom: 'var(--spacing-4)' }}>
          <code style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: 'var(--core-font-family-mono)' }}>npm install @wugweb/kits</code>
          <button
            onClick={() => handleCopy('npm install @wugweb/kits', 'quick')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F, flexShrink: 0 }}
          >
            {copied === 'quick' ? <Check size={13} style={{ color: 'var(--success)' }} /> : <Download size={13} />}
            {copied === 'quick' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button size="sm" variant="default">View on npm <ExternalLink size={12} /></Button>
          <Button size="sm" variant="outline">GitHub repo <ExternalLink size={12} /></Button>
        </div>
      </div>

      {/* All downloads */}
      <PageSection title="All Downloads">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {downloads.map(d => {
            const Icon = d.icon;
            return (
              <div key={d.name} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', display: 'flex', gap: 'var(--spacing-5)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `color-mix(in srgb, ${d.color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} style={{ color: d.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{d.name}</p>
                    <Badge variant="outline">{d.badge}</Badge>
                  </div>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{d.desc}</p>
                  {d.install && (
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', marginTop: 'var(--spacing-2)', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', width: 'fit-content' }}>
                      <code style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--core-font-family-mono)' }}>{d.install}</code>
                      <button
                        onClick={() => handleCopy(d.install!, d.name)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}
                      >
                        {copied === d.name ? <Check size={11} style={{ color: 'var(--success)' }} /> : <Download size={11} />}
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>v{d.version}</span>
                    {d.size !== '—' && <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: F }}>{d.size}</span>}
                  </div>
                  <Button size="sm" variant="outline">
                    <Download size={12} /> {d.type === 'NPM' ? 'npm install' : 'Download'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </PageSection>

      {/* Quickstart code */}
      <PageSection title="Quickstart" description="4 steps from zero to your first component.">
        <div style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          {quickstartSteps.map((step, i) => (
            <div
              key={step.cmd}
              style={{ display: 'flex', gap: 'var(--spacing-4)', padding: 'var(--spacing-4) var(--spacing-5)', alignItems: 'center', borderBottom: i < quickstartSteps.length - 1 ? 'var(--border-subtle)' : 'none', background: i % 2 === 0 ? 'transparent' : 'var(--muted)' }}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-foreground)', fontFamily: F }}>{i + 1}</span>
              </div>
              <code style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: 'var(--core-font-family-mono)' }}>{step.cmd}</code>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F, flexShrink: 0 }}>{step.desc}</span>
              <button
                onClick={() => handleCopy(step.cmd, `step-${i}`)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', flexShrink: 0 }}
              >
                {copied === `step-${i}` ? <Check size={13} style={{ color: 'var(--success)' }} /> : <Download size={13} />}
              </button>
            </div>
          ))}
        </div>
      </PageSection>
    </PageWrapper>
  );
}

import React from 'react';
import { ExternalLink, Check, Layers, RefreshCw, Zap, GitBranch, ArrowRight } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { Button } from '../../design-system/components';
import { Badge } from '../../design-system/components';
import { siteInventory } from '../../../generated/siteInventory';

const F = 'Inter Tight, sans-serif';

const kits = [
  {
    name: 'Component Kit',
    desc: `${siteInventory.publicComponentModuleCount} Figma components, variants, interactive states, and auto-layout — all connected to the token system.`,
    version: 'v2.1.0',
    pages: ['Components', 'Variants', 'States', 'Dark mode'],
    icon: Layers,
    color: 'var(--accent)',
    badge: 'Core',
    features: [`${siteInventory.publicComponentModuleCount} components`, 'All interactive states', 'Auto-layout throughout', 'Dark theme included'],
  },
  {
    name: 'Tokens Kit',
    desc: 'Complete variable library: 4-layer token system with Global, Alias, Semantic, and Component variables.',
    version: 'v2.0.0',
    pages: ['Global tokens', 'Alias layer', 'Semantic layer', 'Component layer'],
    icon: GitBranch,
    color: '#3B82F6',
    badge: 'Foundation',
    features: ['300+ variables', '4-layer architecture', 'Tokens Studio ready', 'W3C DTCG compliant'],
  },
  {
    name: 'Blocks Kit',
    desc: `${siteInventory.blockTotal} assembled block patterns — hero sections, navbars, forms, pricing tables, footers, and more.`,
    version: 'v1.4.0',
    pages: ['Marketing UI', 'Application UI', 'E-commerce UI'],
    icon: RefreshCw,
    color: '#10B981',
    badge: 'Blocks',
    features: [`${siteInventory.blockTotal} block patterns`, 'Marketing + App UI', 'Responsive frames', 'Token-connected'],
  },
  {
    name: 'Icons Kit',
    desc: '200+ custom and curated icons at 16/20/24px. Tokenized fill color, consistent stroke weight.',
    version: 'v1.2.0',
    pages: ['System icons', 'Product icons', 'Social icons'],
    icon: Zap,
    color: '#F59E0B',
    badge: 'Icons',
    features: ['200+ icons', '16/20/24px sizes', 'Tokenized color', 'Consistent stroke'],
  },
];

const syncSteps = [
  { step: '01', title: 'Install Tokens Studio', desc: 'Install the Tokens Studio plugin in your Figma workspace.' },
  { step: '02', title: 'Connect to GitHub', desc: 'Link your token repo (tokens/global.json, alias.json, semantic.json).' },
  { step: '03', title: 'Import the Figma Kit', desc: 'Duplicate the Wugweb Kits Figma file into your team workspace.' },
  { step: '04', title: 'Apply tokens', desc: 'Run Tokens Studio → Apply all tokens. All components update instantly.' },
  { step: '05', title: 'Push token changes', desc: 'Edit tokens in GitHub → push → Tokens Studio pulls → Figma updates.' },
  { step: '06', title: 'Export to CSS', desc: 'Style Dictionary transforms GitHub tokens → CSS variables → your app.' },
];

export function FigmaKitsDoc() {
  return (
    <PageWrapper>
      <PageHeader
        badge="Figma Kits"
        title="Figma Kits"
        description="Four production Figma kits that stay in sync with your codebase via Tokens Studio + GitHub. Change a token in GitHub, and Figma updates. Change in Figma, code follows."
      />

      {/* Pipeline */}
      <PageSection title="The Sync Pipeline">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', padding: 'var(--spacing-4) 0' }}>
            {['Tokens Studio', 'GitHub JSON', 'Style Dictionary', 'CSS Variables', 'React / Tailwind', 'Figma'].map((step, i) => (
              <React.Fragment key={step}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <div style={{ padding: '6px 14px', background: i === 0 ? 'var(--accent)' : 'var(--muted)', borderRadius: 'var(--radius-full)', border: i === 5 ? 'var(--border-accent)' : 'var(--border-default)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: i === 0 ? 'var(--accent-foreground)' : 'var(--foreground)', fontFamily: F, whiteSpace: 'nowrap' }}>{step}</span>
                  </div>
                </div>
                {i < 5 && <ArrowRight size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />}
              </React.Fragment>
            ))}
          </div>
          <p style={{ margin: 'var(--spacing-4) 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', textAlign: 'center', fontFamily: F }}>
            GitHub is the source of truth. Figma and code both consume the same token JSON.
          </p>
        </PageCard>
      </PageSection>

      {/* Kit cards */}
      <PageSection title="Available Kits">
        <PageGrid cols={2}>
          {kits.map(kit => {
            const Icon = kit.icon;
            return (
              <div key={kit.name} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `color-mix(in srgb, ${kit.color} 14%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} style={{ color: kit.color }} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>{kit.name}</h3>
                      <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>{kit.version}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{kit.badge}</Badge>
                </div>

                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, fontFamily: F }}>{kit.desc}</p>

                <div>
                  <p style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: F }}>Includes</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                    {kit.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Check size={11} style={{ color: kit.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: F }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: F }}>Pages</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                    {kit.pages.map(p => (
                      <span key={p} style={{ fontSize: '11px', padding: '2px 8px', background: 'var(--muted)', color: 'var(--muted-foreground)', borderRadius: 'var(--radius-full)', fontFamily: F }}>{p}</span>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                  <ExternalLink size={12} /> Open in Figma
                </Button>
              </div>
            );
          })}
        </PageGrid>
      </PageSection>

      {/* Sync setup */}
      <PageSection title="Sync Setup" description="6 steps to get Figma and code in perfect sync via Tokens Studio.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          {syncSteps.map(s => (
            <div key={s.step} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: 'var(--core-font-family-mono)' }}>{s.step}</span>
              </div>
              <div>
                <p style={{ margin: '0 0 var(--spacing-1)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{s.title}</p>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', lineHeight: 1.6, fontFamily: F }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </PageWrapper>
  );
}

import React from 'react';
import { Layers, Box, Grid3x3, Monitor, GitBranch, Zap, MousePointer, Image, Layout } from 'lucide-react';
import { Badge } from '../../wugweb/Badge';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { siteInventory } from '../../../generated/siteInventory';

const F = 'Inter Tight, sans-serif';

const layers = [
  {
    number: '01',
    icon: Layers,
    color: 'var(--accent)',
    title: 'Tokens',
    subtitle: 'Foundation layer',
    desc: 'Raw values. Enable consistency across all platforms. The only source of truth.',
    types: ['color', 'dimension (spacing + size)', 'radius', 'typography (composite)', 'shadow (composite)', 'border (composite)', 'opacity', 'motion', 'z-index', 'asset'],
    outputs: ['JSON (GitHub)', 'CSS variables', 'Tailwind config', 'iOS / Android'],
    rule: 'Tokens = values that change UI consistently. Not behavior, not logic, not content.',
  },
  {
    number: '02',
    icon: Box,
    color: 'var(--info)',
    title: 'Styles',
    subtitle: 'Figma / design layer',
    desc: 'Map tokens → usable styles in Figma. This is where Figma becomes usable. Not where logic lives.',
    types: ['Color styles (text.primary, bg.surface)', 'Text styles (heading.h1, body.md)', 'Effect styles (shadow.sm)', 'Grid styles (12-column)'],
    outputs: ['Figma styles', 'Figma variables', 'Design handoff'],
    rule: 'Styles are how designers consume tokens. Not a separate truth — a consumption layer.',
  },
  {
    number: '03',
    icon: Box,
    color: 'var(--success)',
    title: 'Components',
    subtitle: 'Atomic level — smallest reusable UI',
    desc: `${siteInventory.publicComponentModuleCount} production-ready components. 100% token-driven. Variant-based. No hardcoded values.`,
    types: ['Button (primary, secondary, ghost)', 'Input (sm, md, lg)', 'Badge, Tag, Chip', 'Card, Dialog, Drawer', 'Navigation, Breadcrumb'],
    outputs: ['React components', 'Figma components', 'Storybook'],
    rule: 'Components ONLY consume semantic + component tokens. Never core. Never hex.',
  },
  {
    number: '04',
    icon: Grid3x3,
    color: 'var(--chart-4)',
    title: 'Blocks',
    subtitle: 'Composition layer — real product UI',
    desc: 'Reusable UI patterns made of components. This is where most systems are weak.',
    types: ['Hero Sections (18)', 'Feature Grids (10)', 'Pricing Tables (10)', 'Testimonials (8)', 'Forms (12)', 'Navbars (8)', 'Footers (6)', 'CTAs (10)'],
    outputs: ['Assembled React blocks', 'Copy-paste patterns', 'Figma frames'],
    rule: 'Blocks = real product UI. Not just elements. Blocks use components, never rebuild them.',
  },
  {
    number: '05',
    icon: Monitor,
    color: 'var(--chart-5)',
    title: 'Screens',
    subtitle: 'Page layer — actual product views',
    desc: 'Actual product views assembled from blocks. Screens should NOT invent UI — only assemble blocks.',
    types: ['Dashboard', 'Landing page', 'Booking flow', 'Invoice page', 'Settings', 'Auth (login/signup)'],
    outputs: ['Full page layouts', 'Figma screens', 'Next.js pages'],
    rule: 'If a screen invents new UI, it means a block or component is missing. Add it to the system.',
  },
  {
    number: '06',
    icon: GitBranch,
    color: 'var(--warning)',
    title: 'Flows',
    subtitle: 'Behavior layer — user journeys',
    desc: 'Where product thinking lives. Sequences of screens with state changes, transitions, and edge cases.',
    types: ['Booking flow', 'Checkout flow', 'Onboarding', 'Login / auth', 'Error recovery'],
    outputs: ['Figma prototypes', 'User story maps', 'State diagrams'],
    rule: 'Flows define transitions, logic, and edge cases. Not UI — sequence.',
  },
];

const crossLayers = [
  {
    icon: Zap,
    color: 'var(--accent)',
    title: 'Motion System',
    desc: 'Cross-layer animation and transition tokens. Moods translate to motion presets, not raw tokens.',
    examples: [
      'Fast → 80–120ms · micro-interactions',
      'Calm → 200–300ms · page transitions',
      'Premium → easing + delay',
      'Playful → spring / bounce (via Motion library)',
    ],
  },
  {
    icon: MousePointer,
    color: 'var(--info)',
    title: 'Interaction System',
    desc: 'Behavior patterns, NOT tokens. Desktop: hover, click, focus. Mobile: tap, swipe, drag.',
    examples: [
      'Button: hover → elevate + color shift',
      'Button: click → scale 0.97',
      'Input: focus → accent border + ring',
      'Card: hover → elevation-2 shadow',
    ],
  },
  {
    icon: Image,
    color: 'var(--success)',
    title: 'Icon System',
    desc: '16 / 20 / 24px only. Consistent stroke weight. Tokenized color via --foreground or --accent.',
    examples: [
      '200+ system icons (lucide-react)',
      'Product icons (booking, invoice, etc.)',
      'Token: icon.color = var(--muted-foreground)',
      'Never hardcode icon colors',
    ],
  },
  {
    icon: Layout,
    color: 'var(--chart-4)',
    title: 'Layout System',
    desc: '12-column grid, 4pt spacing scale, responsive breakpoints. Some in tokens, some in code.',
    examples: [
      '12 col desktop · 8 col tablet · 4 col mobile',
      'Gutter: 24px / 16px / 16px',
      'Container max: var(--layout-max-width)',
      'Breakpoints: code-only (not tokens)',
    ],
  },
];

const notTokens = [
  { item: 'Breakpoints', where: 'tailwind.config / CSS media queries', reason: 'Layout logic, not value' },
  { item: 'Grid system', where: 'CSS grid / layout code', reason: 'Partially token, partially config' },
  { item: 'Accessibility rules', where: 'Code + guidelines', reason: 'Contrast rules, not design tokens' },
  { item: 'RTL logic', where: 'Component logic', reason: 'Layout direction, not value' },
  { item: 'Gestures / moods', where: 'Motion presets + brand docs', reason: 'Design direction, not data' },
  { item: 'Content / copy', where: 'CMS / i18n', reason: 'Never mix content with tokens' },
  { item: 'Behavior / state', where: 'Component logic', reason: 'Logic, not presentation values' },
];

export function SystemLayersDoc() {
  return (
    <PageWrapper>
      <PageHeader
        badge="System Architecture"
        title="System Layers"
        description="The complete Wugweb Kits layered model: Tokens → Styles → Components → Blocks → Screens → Flows → Product. Each layer has a clear responsibility. No overlap."
      />

      {/* The big picture */}
      <PageSection title="The Big Picture">
        <PageCard>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'stretch', minWidth: 560, padding: 'var(--spacing-4) 0' }}>
              {['Tokens', 'Styles', 'Components', 'Blocks', 'Screens', 'Flows', 'Product'].map((layer, i) => {
                const colors = ['var(--accent)', 'var(--info)', 'var(--success)', 'var(--layer-color-blocks)', 'var(--layer-color-screens)', 'var(--warning)', 'var(--destructive)'];
                return (
                  <React.Fragment key={layer}>
                    <div style={{ flex: 1, minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <div style={{ width: '100%', height: 8, borderRadius: 'var(--radius-full)', background: colors[i] }} />
                      <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', color: colors[i], textAlign: 'center', fontFamily: F }}>{layer}</span>
                    </div>
                    {i < 6 && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', alignSelf: 'center', flexShrink: 0 }}>→</div>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: 'var(--spacing-4)', background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.65, fontFamily: F }}>
              <strong style={{ color: 'var(--foreground)' }}>Core principle:</strong>{' '}
              <code style={{ fontFamily: 'var(--core-font-family-mono)', fontSize: 'var(--text-xs)', background: 'var(--card)', padding: '1px 5px', borderRadius: 'var(--radius-sm)' }}>Tokens = values · Layers = meaning · Components = usage · Code = execution</code>
              . Each layer ONLY consumes from the layer below it. Never skip layers. Never invent UI at the screen level.
            </p>
          </div>
        </PageCard>
      </PageSection>

      {/* Main layers */}
      <PageSection title="Layer Reference">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
          {layers.map(layer => {
            const Icon = layer.icon;
            return (
              <div key={layer.number} style={{ border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', gap: 'var(--spacing-5)', padding: 'var(--spacing-5)', background: 'var(--card)', borderBottom: 'var(--border-default)', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', flex: 1, minWidth: 200 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: layer.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={22} style={{ color: layer.color }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 2 }}>
                        <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)', color: layer.color, fontFamily: 'var(--core-font-family-mono)' }}>Layer {layer.number}</span>
                      </div>
                      <h3 style={{ margin: 0, fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>{layer.title}</h3>
                      <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{layer.subtitle}</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, fontFamily: F, maxWidth: 380, alignSelf: 'center' }}>{layer.desc}</p>
                </div>
                {/* Body */}
                <div style={{ padding: 'var(--spacing-5)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-5)' }}>
                  <div>
                    <p style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>Includes</p>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                      {layer.types.map(t => (
                        <li key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2)' }}>
                          <span style={{ color: layer.color, marginTop: 3, flexShrink: 0 }}>·</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>Outputs</p>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                      {layer.outputs.map(o => (
                        <li key={o} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                          <span style={{ color: 'var(--success)', fontSize: 'var(--text-xs)' }}>↗</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ background: layer.color + '08', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)', border: `1px solid ${layer.color}25` }}>
                    <p style={{ margin: '0 0 var(--spacing-1)', fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: layer.color, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>Rule</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', lineHeight: 1.6, fontFamily: F }}>{layer.rule}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PageSection>

      {/* Cross-layer systems */}
      <PageSection title="Cross-Layer Systems" description="These run across all layers. Not tokens — systems.">
        <PageGrid cols={2}>
          {crossLayers.map(cl => {
            const Icon = cl.icon;
            return (
              <div key={cl.title} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: cl.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: cl.color }} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>{cl.title}</h4>
                  </div>
                </div>
                <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, fontFamily: F }}>{cl.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                  {cl.examples.map(e => (
                    <div key={e} style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                      <span style={{ color: cl.color, flexShrink: 0, fontSize: 'var(--text-xs)', marginTop: 2 }}>›</span>
                      <code style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>{e}</code>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </PageGrid>
      </PageSection>

      {/* What's NOT a token */}
      <PageSection title="What Is NOT a Token" description="Critical separation. Systems break when these end up in the token layer.">
        <PageCard>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Item', 'Correct location', 'Reason'].map(h => (
                    <th key={h} style={{ padding: 'var(--table-padding-y) var(--table-padding-x)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', borderBottom: 'var(--border-default)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {notTokens.map((row, i) => (
                  <tr key={row.item} style={{ background: i % 2 === 0 ? 'var(--card)' : 'transparent' }}>
                    <td style={{ padding: 'var(--table-padding-y) var(--table-padding-x)', borderBottom: 'var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <span style={{ color: 'var(--destructive)', fontSize: 'var(--text-xs)' }}>✕</span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{row.item}</span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--table-padding-y) var(--table-padding-x)', borderBottom: 'var(--border-subtle)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F }}>{row.where}</td>
                    <td style={{ padding: 'var(--table-padding-y) var(--table-padding-x)', borderBottom: 'var(--border-subtle)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F }}>{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 'var(--spacing-5)', background: 'var(--accent-subtle)', border: 'var(--border-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F, lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--foreground)' }}>Rule:</strong> Tokens = values that change UI consistently. NOT behavior, logic, content, or rules.
              If you can't express it as a CSS variable, it's probably not a token.
            </p>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

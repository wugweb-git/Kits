import React from 'react';
import { BlockPageShell } from './BlockPageShell';
import { Check, X } from 'lucide-react';
import { Button } from '../../../wugweb/Button';
import { Badge } from '../../../wugweb/Badge';
import { siteInventory } from '../../../../generated/siteInventory';

const F = 'Inter Tight, sans-serif';

const plans = [
  {
    name: 'Starter', price: 'Free', period: 'forever',
    desc: 'For individuals and small projects.',
    cta: 'Get started', featured: false,
    features: ['5 components', '1 project', 'Community support', 'CSS variables', null, null],
  },
  {
    name: 'Pro', price: '$29', period: '/month',
    desc: 'For teams building serious products.',
    cta: 'Start free trial', featured: true,
    features: [`${siteInventory.publicComponentModuleCount} components`, 'Unlimited projects', 'Priority support', 'CSS variables', 'Figma kit', '4-layer tokens'],
  },
  {
    name: 'Enterprise', price: 'Custom', period: '',
    desc: 'For organizations at scale.',
    cta: 'Contact us', featured: false,
    features: [`${siteInventory.publicComponentModuleCount} components`, 'Unlimited projects', 'Dedicated support', 'CSS variables', 'Figma kit', 'MCP connector'],
  },
];

const ThreeTierPricing = () => (
  <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', background: 'var(--background)' }}>
    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
      <h2 style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--ts-h2-size)', fontWeight: 'var(--ts-h2-weight)', color: 'var(--foreground)', fontFamily: F }}>Simple, honest pricing</h2>
      <p style={{ margin: 0, fontSize: 'var(--ts-body-lg-size)', color: 'var(--muted-foreground)', fontFamily: F }}>Start free. Upgrade when you need more.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-5)', maxWidth: 900, margin: '0 auto', alignItems: 'start' }}>
      {plans.map(plan => (
        <div
          key={plan.name}
          style={{
            background: plan.featured ? 'var(--accent)' : 'var(--card)',
            border: plan.featured ? 'var(--border-accent)' : 'var(--border-default)',
            borderRadius: 'var(--card-radius)',
            padding: 'var(--spacing-7)',
            position: 'relative',
          }}
        >
          {plan.featured && (
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
              <span style={{ background: 'var(--foreground)', color: 'var(--background)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', padding: '3px 12px', borderRadius: 'var(--radius-full)', fontFamily: F, whiteSpace: 'nowrap' }}>Most popular</span>
            </div>
          )}
          <p style={{ margin: '0 0 var(--spacing-1)', fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: plan.featured ? 'var(--accent-foreground)' : 'var(--foreground)', fontFamily: F }}>{plan.name}</p>
          <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-sm)', color: plan.featured ? 'rgba(18,18,18,0.65)' : 'var(--muted-foreground)', fontFamily: F }}>{plan.desc}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 'var(--spacing-6)' }}>
            <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-weight-bold)', color: plan.featured ? 'var(--accent-foreground)' : 'var(--foreground)', fontFamily: F }}>{plan.price}</span>
            <span style={{ fontSize: 'var(--text-sm)', color: plan.featured ? 'rgba(18,18,18,0.6)' : 'var(--muted-foreground)', fontFamily: F }}>{plan.period}</span>
          </div>
          <Button
            variant={plan.featured ? 'default' : 'outline'}
            style={{ width: '100%', marginBottom: 'var(--spacing-6)', ...(plan.featured ? { background: 'var(--accent-foreground)', color: 'var(--accent)' } : {}) }}
          >
            {plan.cta}
          </Button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {plan.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', opacity: f ? 1 : 0.35 }}>
                {f
                  ? <Check size={14} style={{ color: plan.featured ? 'var(--accent-foreground)' : 'var(--success)', flexShrink: 0 }} />
                  : <X size={14} style={{ color: plan.featured ? 'rgba(18,18,18,0.3)' : 'var(--muted-foreground)', flexShrink: 0 }} />}
                <span style={{ fontSize: 'var(--text-sm)', color: plan.featured ? 'var(--accent-foreground)' : (f ? 'var(--foreground)' : 'var(--muted-foreground)'), fontFamily: F }}>{f ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const ComparisonTable = () => {
  const rows = [
    ['Components', '5', String(siteInventory.publicComponentModuleCount), String(siteInventory.publicComponentModuleCount)],
    ['Projects', '1', 'Unlimited', 'Unlimited'],
    ['Token system', '✓', '✓', '✓'],
    ['Figma kit', '—', '✓', '✓'],
    ['MCP connector', '—', '—', '✓'],
    ['Support', 'Community', 'Priority', 'Dedicated'],
  ];
  return (
    <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', background: 'var(--background)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 var(--spacing-8)', fontSize: 'var(--ts-h3-size)', fontWeight: 'var(--ts-h3-weight)', color: 'var(--foreground)', fontFamily: F }}>Compare plans</h2>
        <div style={{ border: 'var(--border-default)', borderRadius: 'var(--card-radius)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F }}>
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['Feature', 'Starter', 'Pro', 'Enterprise'].map((h, i) => (
                  <th key={h} style={{ padding: 'var(--table-padding-y) var(--table-padding-x)', textAlign: i === 0 ? 'left' : 'center', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', borderBottom: 'var(--border-default)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--card)' : 'transparent' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: 'var(--table-padding-y) var(--table-padding-x)', fontSize: 'var(--text-sm)', color: ci === 0 ? 'var(--foreground)' : (cell === '✓' ? 'var(--success)' : cell === '—' ? 'var(--muted-foreground)' : 'var(--foreground)'), textAlign: ci === 0 ? 'left' : 'center', borderBottom: ri < rows.length - 1 ? 'var(--border-subtle)' : 'none' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export function PricingTablesBlock() {
  return (
    <BlockPageShell
      title="Pricing Tables"
      description="Conversion-optimized pricing layouts. Three-tier cards, comparison tables, and toggle billing patterns — all token-driven."
      category="Marketing UI"
      count={10}
      variants={[
        { id: '3tier', label: 'Three-tier pricing cards', preview: <ThreeTierPricing /> },
        { id: 'comparison', label: 'Feature comparison table', preview: <ComparisonTable /> },
      ]}
    />
  );
}

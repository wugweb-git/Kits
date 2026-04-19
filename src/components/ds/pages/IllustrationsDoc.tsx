import React from 'react';
import { Download, Copy, Check, Search } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { Button } from '../../design-system/components';
import { Badge } from '../../design-system/components';

const F = 'Inter Tight, sans-serif';

/* ─── Inline SVG illustrations (token-driven colors) ─────────── */
function IllustrationEmptyState({ color = 'var(--accent)' }: { color?: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 120 }}>
      <rect x="20" y="20" width="80" height="60" rx="8" fill={`color-mix(in srgb, ${color} 12%, transparent)`} stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="60" cy="44" r="12" fill={`color-mix(in srgb, ${color} 20%, transparent)`} stroke={color} strokeWidth="1.5" />
      <path d="M54 44h12M60 38v12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="38" y="62" width="44" height="6" rx="3" fill={`color-mix(in srgb, ${color} 25%, transparent)`} />
      <rect x="46" y="72" width="28" height="4" rx="2" fill={`color-mix(in srgb, ${color} 15%, transparent)`} />
    </svg>
  );
}

function IllustrationSuccess({ color = 'var(--success)' }: { color?: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 120 }}>
      <circle cx="60" cy="46" r="26" fill={`color-mix(in srgb, ${color} 15%, transparent)`} stroke={color} strokeWidth="1.5" />
      <path d="M46 46l10 10 18-20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 76c0 0 10-6 30-6s30 6 30 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function IllustrationError({ color = 'var(--destructive)' }: { color?: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 120 }}>
      <path d="M60 22L96 80H24L60 22z" fill={`color-mix(in srgb, ${color} 12%, transparent)`} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M60 46v12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="64" r="2" fill={color} />
    </svg>
  );
}

function IllustrationSearch({ color = 'var(--info)' }: { color?: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 120 }}>
      <circle cx="52" cy="44" r="20" fill={`color-mix(in srgb, ${color} 12%, transparent)`} stroke={color} strokeWidth="1.5" />
      <path d="M66 58l18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M44 38h16M44 44h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function IllustrationLock({ color = 'var(--accent)' }: { color?: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 120 }}>
      <rect x="36" y="50" width="48" height="32" rx="6" fill={`color-mix(in srgb, ${color} 14%, transparent)`} stroke={color} strokeWidth="1.5" />
      <path d="M46 50V38a14 14 0 0128 0v12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="60" cy="66" r="4" fill={color} />
      <path d="M60 70v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IllustrationData({ color = 'var(--accent)' }: { color?: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 120 }}>
      <rect x="16" y="20" width="88" height="60" rx="6" fill={`color-mix(in srgb, ${color} 8%, transparent)`} stroke={color} strokeWidth="1.2" />
      <line x1="16" y1="34" x2="104" y2="34" stroke={color} strokeWidth="1" opacity="0.3" />
      {[0, 1, 2, 3].map(i => (
        <React.Fragment key={i}>
          <line x1="16" y1={46 + i * 10} x2="104" y2={46 + i * 10} stroke={color} strokeWidth="0.8" opacity="0.15" />
          <rect x={20} y={38 + i * 10} width={20 + (i % 3) * 18} height="6" rx="2" fill={color} opacity={0.3 - i * 0.05} />
        </React.Fragment>
      ))}
      <rect x="16" y="20" width="88" height="14" rx="6" fill={`color-mix(in srgb, ${color} 20%, transparent)`} />
    </svg>
  );
}

function IllustrationTeam({ color = 'var(--accent)' }: { color?: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 120 }}>
      {[30, 60, 90].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={36 + (i === 1 ? -4 : 0)} r={i === 1 ? 13 : 10} fill={`color-mix(in srgb, ${color} ${i === 1 ? 25 : 15}%, transparent)`} stroke={color} strokeWidth="1.2" />
          <circle cx={x} cy={36 + (i === 1 ? -4 : 0)} r={i === 1 ? 5 : 4} fill={color} opacity={i === 1 ? 0.6 : 0.35} />
          <path d={`M${x - (i === 1 ? 13 : 10)} ${60 + (i === 1 ? -4 : 2)}q${i === 1 ? 13 : 10}-12 ${i === 1 ? 26 : 20}-0`} stroke={color} strokeWidth="1.2" fill="none" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

function IllustrationMail({ color = 'var(--accent)' }: { color?: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 120 }}>
      <rect x="20" y="28" width="80" height="52" rx="6" fill={`color-mix(in srgb, ${color} 10%, transparent)`} stroke={color} strokeWidth="1.5" />
      <path d="M20 34l40 26 40-26" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="90" cy="36" r="10" fill="var(--destructive)" opacity="0.85" />
      <text x="90" y="40" textAnchor="middle" fontSize="9" fill="white" fontFamily={F} fontWeight="700">3</text>
    </svg>
  );
}

const illustrationSets = [
  {
    category: 'Empty States',
    color: 'var(--accent)',
    items: [
      { label: 'No results', comp: <IllustrationEmptyState /> },
      { label: 'No data', comp: <IllustrationData color="var(--muted-foreground)" /> },
      { label: 'Search empty', comp: <IllustrationSearch /> },
    ],
  },
  {
    category: 'Feedback',
    color: 'var(--success)',
    items: [
      { label: 'Success', comp: <IllustrationSuccess /> },
      { label: 'Error', comp: <IllustrationError /> },
      { label: 'Locked', comp: <IllustrationLock /> },
    ],
  },
  {
    category: 'Product',
    color: 'var(--info)',
    items: [
      { label: 'Team', comp: <IllustrationTeam /> },
      { label: 'Dashboard', comp: <IllustrationData /> },
      { label: 'Inbox', comp: <IllustrationMail /> },
    ],
  },
];

function IllustrationCard({ label, children, color }: { label: string; children: React.ReactNode; color: string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <div style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)', position: 'relative' }}>
      <div style={{ width: 120, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)' }}>
        {children}
      </div>
      <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{label}</p>
      <button
        onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }}
        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F }}
      >
        {copied ? <Check size={11} style={{ color: 'var(--success)' }} /> : <Copy size={11} />}
        {copied ? 'Copied' : 'Copy SVG'}
      </button>
    </div>
  );
}

export function IllustrationsDoc() {
  const [search, setSearch] = React.useState('');

  const filtered = illustrationSets.map(s => ({
    ...s,
    items: s.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())),
  })).filter(s => s.items.length > 0);

  return (
    <PageWrapper>
      <PageHeader
        badge="Illustrations"
        title="Illustration System"
        description="Token-driven SVG illustrations for empty states, feedback, and product UI. Colors use CSS variables so illustrations rebrand automatically with your design system."
      />

      {/* Key principle */}
      <div style={{ background: 'var(--accent-subtle)', border: 'var(--border-accent)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-4)', marginBottom: 'var(--spacing-10)', display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-start' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', marginTop: 6, flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F, lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--foreground)' }}>Token-driven colors:</strong> Every illustration uses <code style={{ fontFamily: 'var(--core-font-family-mono)', fontSize: 'var(--text-xs)', background: 'var(--card)', padding: '1px 5px', borderRadius: 'var(--radius-sm)' }}>color-mix()</code> with CSS variables. Swap <code style={{ fontFamily: 'var(--core-font-family-mono)', fontSize: 'var(--text-xs)', background: 'var(--card)', padding: '1px 5px', borderRadius: 'var(--radius-sm)' }}>--accent</code> in globals.css and every illustration updates automatically.
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 'var(--spacing-8)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: '8px 14px', maxWidth: 360 }}>
        <Search size={15} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search illustrations..."
          style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: F, width: '100%' }}
        />
      </div>

      {/* Categories */}
      {filtered.map(set => (
        <PageSection key={set.category} title={set.category}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--spacing-4)' }}>
            {set.items.map(item => (
              <IllustrationCard key={item.label} label={item.label} color={set.color}>
                {item.comp}
              </IllustrationCard>
            ))}
          </div>
        </PageSection>
      ))}

      {/* Usage */}
      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-6)' }}>
            {[
              { title: 'Color tokens', rules: ['Use --accent for primary illustrations', 'Use --success / --destructive for feedback', 'Use --muted-foreground for neutral/secondary', 'Never hardcode hex values in SVG'] },
              { title: 'Sizing', rules: ['80–160px for inline empty states', '200–280px for full-page states', 'Always scale proportionally', 'Test at 1× and 2× display density'] },
              { title: 'Accessibility', rules: ['Always add aria-label to SVG', 'Use role="img" on the SVG element', 'Include descriptive alt for conveying meaning', 'Decorative: aria-hidden="true"'] },
            ].map(({ title, rules }) => (
              <div key={title}>
                <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>{title}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {rules.map(r => (
                    <li key={r} style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>·</span> {r}
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

import React from 'react';
import { Monitor, Tablet, Smartphone, Copy, Check } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { Badge } from '../../wugweb/Badge';

const F = 'Inter Tight, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

const BREAKPOINTS = [
  { name: 'xs',  token: '--breakpoint-xs',  value: 480,  tailwind: '—',   label: 'Mobile S',    desc: 'Phones <480px — minimum supported size', icon: Smartphone, cols: 4 },
  { name: 'sm',  token: '--breakpoint-sm',  value: 640,  tailwind: 'sm:', label: 'Mobile L',    desc: 'Larger phones, small landscape', icon: Smartphone, cols: 4 },
  { name: 'md',  token: '--breakpoint-md',  value: 768,  tailwind: 'md:', label: 'Tablet',      desc: 'Tablets, landscape phones — sidebar hidden by default', icon: Tablet, cols: 8 },
  { name: 'lg',  token: '--breakpoint-lg',  value: 1024, tailwind: 'lg:', label: 'Desktop S',   desc: 'Desktop — sidebar shows, full navigation visible', icon: Monitor, cols: 12 },
  { name: 'xl',  token: '--breakpoint-xl',  value: 1280, tailwind: 'xl:', label: 'Desktop M',   desc: 'Larger desktop — wider content, more columns', icon: Monitor, cols: 12 },
  { name: '2xl', token: '--breakpoint-2xl', value: 1440, tailwind: '2xl:', label: 'Desktop L',  desc: 'Max content width — layout caps at 1440px', icon: Monitor, cols: 12 },
];

const TYPE_SCALE_RESPONSIVE = [
  { role: 'Display', mobile: 'clamp(2.5rem, 5.5vw+0.5rem, 5rem)', mobileVal: '~40px', desktopVal: '80px', token: '--fluid-display', weight: 800 },
  { role: 'H1',      mobile: 'clamp(2rem, 4vw+0.5rem, 3rem)',       mobileVal: '~32px', desktopVal: '48px', token: '--fluid-h1',      weight: 700 },
  { role: 'H2',      mobile: 'clamp(1.5rem, 2.5vw+0.5rem, 2.25rem)', mobileVal: '~24px', desktopVal: '36px', token: '--fluid-h2',    weight: 600 },
  { role: 'H3',      mobile: 'clamp(1.25rem, 1.5vw+0.5rem, 1.75rem)', mobileVal: '~20px', desktopVal: '28px', token: '--fluid-h3',   weight: 600 },
  { role: 'H4',      mobile: 'clamp(1.06rem, 1vw+0.5rem, 1.375rem)', mobileVal: '~17px', desktopVal: '22px', token: '--fluid-h4',    weight: 600 },
  { role: 'Body LG', mobile: 'clamp(1rem, 0.5vw+0.875rem, 1.25rem)', mobileVal: '~16px', desktopVal: '20px', token: '--fluid-body-lg', weight: 400 },
  { role: 'Body MD', mobile: 'clamp(0.9375rem, 0.25vw+0.875rem, 1rem)', mobileVal: '15px', desktopVal: '16px', token: '--fluid-body-md', weight: 400 },
  { role: 'Body SM', mobile: 'clamp(0.8125rem, 0.1vw+0.8rem, 0.875rem)', mobileVal: '13px', desktopVal: '14px', token: '--fluid-body-sm', weight: 400 },
  { role: 'Label',   mobile: 'clamp(0.75rem, 0.1vw+0.73rem, 0.875rem)', mobileVal: '12px', desktopVal: '14px', token: '--fluid-label', weight: 500 },
  { role: 'Caption', mobile: 'clamp(0.625rem, 0.05vw+0.62rem, 0.75rem)', mobileVal: '10px', desktopVal: '12px', token: '--fluid-caption', weight: 400 },
];

const SPACE_RESPONSIVE = [
  { role: 'Section spacing', xs: '--space-section-xs (32px)', sm: '--space-section-sm (40px)', md: '--space-section-md (48px)', lg: '--space-section-lg (64px)', xl: '--space-section-xl (80px)', class: '.section-spacing' },
  { role: 'Page gutter',     xs: '--space-page-xs (16px)',    sm: '--space-page-sm (20px)',    md: '--space-page-md (32px)',    lg: '--space-page-lg (40px)',    xl: '--space-page-xl (48px)',    class: '.page-gutter' },
  { role: 'Card padding',    xs: '--spacing-4 (16px)',        sm: '--spacing-5 (20px)',        md: '--spacing-6 (24px)',        lg: '--spacing-6 (24px)',        xl: '--card-padding (24px)',     class: '—' },
];

const LAYOUT_RULES = [
  { viewport: 'Mobile (<768px)',  cols: 4,  sidebar: 'Hidden (hamburger)', maxWidth: 'full', gutter: '16px', nav: 'Bottom / hamburger' },
  { viewport: 'Tablet (768–1023px)', cols: 8, sidebar: 'Overlay drawer', maxWidth: 'full', gutter: '32px', nav: 'Hamburger → overlay' },
  { viewport: 'Desktop (≥1024px)', cols: 12, sidebar: 'Always visible (280px)', maxWidth: '1440px', gutter: '40px', nav: 'Full top nav + sidebar' },
];

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = React.useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setC(true); setTimeout(() => setC(false), 1400); }} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '10px', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}>
      {c ? <Check size={10} style={{ color: 'var(--success)' }} /> : <Copy size={10} />}
    </button>
  );
}

/* Live viewport width indicator */
function ViewportIndicator() {
  const [vw, setVw] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  React.useEffect(() => {
    const handler = () => setVw(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const active = BREAKPOINTS.slice().reverse().find(b => vw >= b.value);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', background: 'var(--card)', border: 'var(--border-accent)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-4) var(--spacing-5)', marginBottom: 'var(--spacing-10)' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
      <div>
        <p style={{ margin: 0, fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>
          Current viewport: <span style={{ color: 'var(--accent)' }}>{vw}px</span>
          {active && <span style={{ marginLeft: 'var(--spacing-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-regular)', color: 'var(--muted-foreground)' }}>→ {active.tailwind !== '—' ? active.tailwind : 'xs'} breakpoint ({active.label})</span>}
        </p>
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>Resize the window to see the active breakpoint update in real time.</p>
      </div>
    </div>
  );
}

export function BreakpointsDoc() {
  return (
    <PageWrapper maxWidth="1200px">
      <PageHeader
        badge="Responsive System"
        title="Breakpoints & Fluid Type"
        description="Complete responsive system: 6 breakpoints, fluid viewport-scaled type using clamp(), adaptive spacing, and layout rules. All values are CSS variable tokens."
      />

      <ViewportIndicator />

      {/* Breakpoint scale */}
      <PageSection title="Breakpoint Scale" description="6 named breakpoints. Code-only tokens — no Figma scope. Use in @media queries or JS. NEVER as inline style values.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {BREAKPOINTS.map((bp, i) => {
            const Icon = bp.icon;
            const barWidth = `${(bp.value / 1440) * 100}%`;
            return (
              <div key={bp.name} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-4) var(--spacing-5)', display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', width: 140, flexShrink: 0 }}>
                  <Icon size={16} style={{ color: 'var(--muted-foreground)' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>{bp.label}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: MONO }}>{bp.name}</p>
                  </div>
                </div>

                {/* Bar */}
                <div style={{ flex: 1, minWidth: 120, background: 'var(--muted)', borderRadius: 'var(--radius-full)', height: 6 }}>
                  <div style={{ width: barWidth, height: '100%', background: 'var(--accent)', borderRadius: 'var(--radius-full)', opacity: 0.7 + i * 0.05 }} />
                </div>

                {/* Value + token */}
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: MONO, minWidth: 50 }}>{bp.value}px</span>
                  <code style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: MONO, background: 'var(--muted)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>{bp.token}</code>
                  {bp.tailwind !== '—' && <code style={{ fontSize: '11px', color: '#3B82F6', fontFamily: MONO }}>{bp.tailwind}</code>}
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{bp.desc}</span>
                </div>

                {/* Grid columns */}
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  {Array.from({ length: bp.cols }).map((_, ci) => (
                    <div key={ci} style={{ width: 6, height: 20, background: ci < bp.cols ? 'var(--accent)' : 'var(--muted)', borderRadius: 2, opacity: 0.4 + ci * (0.6 / bp.cols) }} />
                  ))}
                  <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: MONO, marginLeft: 4, alignSelf: 'center' }}>{bp.cols}col</span>
                </div>
              </div>
            );
          })}
        </div>
      </PageSection>

      {/* Fluid type scale */}
      <PageSection title="Fluid Type Scale" description="clamp()-based type that scales between mobile and desktop. Use .type-{role} utility classes or var(--fluid-{role}) directly.">
        <div style={{ border: 'var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 200px 1fr 80px 90px 80px', background: 'var(--muted)', borderBottom: 'var(--border-default)' }}>
            {['Role', 'Token', 'clamp() value', 'Mobile', 'Desktop', 'Weight'].map(h => (
              <div key={h} style={{ padding: '8px 12px', fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>{h}</div>
            ))}
          </div>

          {TYPE_SCALE_RESPONSIVE.map((ts, i) => (
            <div key={ts.role} style={{ display: 'grid', gridTemplateColumns: '100px 200px 1fr 80px 90px 80px', borderBottom: i < TYPE_SCALE_RESPONSIVE.length - 1 ? 'var(--border-subtle)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', alignItems: 'center' }}>
              <div style={{ padding: '12px 12px' }}>
                <span style={{ fontFamily: F, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>{ts.role}</span>
              </div>
              <div style={{ padding: '12px 12px' }}>
                <code style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: MONO }}>{ts.token}</code>
              </div>
              <div style={{ padding: '12px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <code style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: MONO, wordBreak: 'break-all', lineHeight: 1.4 }}>{ts.mobile}</code>
                <CopyBtn text={`font-size: var(${ts.token});`} />
              </div>
              <div style={{ padding: '12px 12px' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: MONO }}>{ts.mobileVal}</span>
              </div>
              <div style={{ padding: '12px 12px' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: MONO }}>{ts.desktopVal}</span>
              </div>
              <div style={{ padding: '12px 12px' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: MONO }}>{ts.weight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live preview */}
        <div style={{ marginTop: 'var(--spacing-6)', background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)' }}>
          <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>Live preview — resize window to see fluid scaling</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {TYPE_SCALE_RESPONSIVE.slice(0, 5).map(ts => (
              <div key={ts.role} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-4)', borderBottom: 'var(--border-subtle)', paddingBottom: 'var(--spacing-2)' }}>
                <span style={{ fontSize: ts.mobile, fontWeight: ts.weight, color: 'var(--foreground)', fontFamily: F, lineHeight: 1.15, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ts.role} — Inter Tight
                </span>
                <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: MONO, flexShrink: 0 }}>{ts.token}</span>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Responsive spacing */}
      <PageSection title="Responsive Spacing" description="Adaptive spacing that increases with viewport. Use semantic tokens, not raw px values.">
        <div style={{ border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr 1fr 1fr 100px', background: 'var(--muted)', borderBottom: 'var(--border-default)' }}>
            {['Spacing role', 'xs (<480)', 'sm (640)', 'md (768)', 'lg (1024)', 'xl (1280)', 'Class'].map(h => (
              <div key={h} style={{ padding: '8px 10px', fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: F }}>{h}</div>
            ))}
          </div>
          {SPACE_RESPONSIVE.map((row, i) => (
            <div key={row.role} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr 1fr 1fr 100px', borderBottom: i < SPACE_RESPONSIVE.length - 1 ? 'var(--border-subtle)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', alignItems: 'center' }}>
              <div style={{ padding: '10px 10px' }}><span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{row.role}</span></div>
              {[row.xs, row.sm, row.md, row.lg, row.xl].map((v, vi) => (
                <div key={vi} style={{ padding: '10px 10px' }}><code style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: MONO, lineHeight: 1.5 }}>{v}</code></div>
              ))}
              <div style={{ padding: '10px 10px' }}><code style={{ fontSize: '10px', color: '#3B82F6', fontFamily: MONO }}>{row.class}</code></div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Layout grid */}
      <PageSection title="Layout Rules" description="How the 12-column grid and layout shell adapt across breakpoints.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {LAYOUT_RULES.map(lr => (
            <div key={lr.viewport} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', display: 'grid', gridTemplateColumns: '200px repeat(5, 1fr)', gap: 'var(--spacing-4)', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{lr.viewport}</p>
              {[
                { label: 'Grid', value: `${lr.cols} cols` },
                { label: 'Sidebar', value: lr.sidebar },
                { label: 'Max-width', value: lr.maxWidth },
                { label: 'Gutter', value: lr.gutter },
                { label: 'Nav', value: lr.nav },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ margin: '0 0 2px', fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: F }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: F }}>{value}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </PageSection>

      {/* Code usage */}
      <PageSection title="Code Usage" description="Copy-paste reference for using breakpoints in JS, CSS, and React.">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
            {[
              { label: 'CSS @media', code: `/* Use breakpoint token values in @media */\n@media (min-width: 768px) { /* --breakpoint-md */\n  .my-element { display: grid; }\n}\n@media (min-width: 1024px) { /* --breakpoint-lg */\n  .my-element { grid-template-columns: repeat(3, 1fr); }\n}` },
              { label: 'Fluid type in CSS', code: `/* Use fluid tokens directly */\n.hero-title {\n  font-size: var(--fluid-display);\n  font-weight: var(--ts-display-weight);\n  line-height: var(--core-line-height-tight);\n  font-family: var(--core-font-family-base);\n}\n/* Or use the utility class: */\n.hero-title { /* class="type-display" */ }` },
              { label: 'Responsive spacing', code: `/* Utility classes for adaptive spacing */\n<section class="section-spacing page-gutter">\n  <div>Content scales with viewport</div>\n</section>\n\n/* Or with CSS tokens */\n.section {\n  padding: var(--space-section-xs);\n}\n@media (min-width: 1024px) {\n  .section { padding: var(--space-section-lg); }\n}` },
              { label: 'useBreakpoint hook', code: `// Already available at /hooks/useMediaQuery.ts\nimport { useBreakpoint } from '@/hooks/useMediaQuery';\n\nfunction Component() {\n  const { isMobile, isTablet, isDesktop } = useBreakpoint();\n\n  return (\n    <div style={{\n      padding: isMobile\n        ? 'var(--space-page-xs)'\n        : isTablet\n        ? 'var(--space-page-md)'\n        : 'var(--space-page-lg)'\n    }}>\n      {isMobile && <MobileNav />}\n      {isDesktop && <DesktopNav />}\n    </div>\n  );\n}` },
            ].map(({ label, code }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>{label}</p>
                  <CopyBtn text={code} />
                </div>
                <pre style={{ margin: 0, padding: 'var(--spacing-4)', background: 'var(--surface-1000)', borderRadius: 'var(--radius-md)', fontSize: '11px', fontFamily: MONO, color: 'var(--muted-foreground)', lineHeight: 1.75, overflowX: 'auto', border: 'var(--border-default)' }}>
                  <code>{code}</code>
                </pre>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

import React from 'react';
import { Zap, Clock, ArrowRight, RotateCw } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { Badge } from '../../wugweb/Badge';
import { Button } from '../../wugweb/Button';

const F = 'Inter Tight, sans-serif';

/* ─── Duration scale ──────────────────────────────────────────── */
const durationTokens = [
  { token: '--core-duration-xs', value: '60ms', alias: '--alias-motion-instant', label: 'Instant', use: 'State indicator toggles, micro-dots' },
  { token: '--core-duration-sm', value: '80ms', alias: '--motion-duration-fast', label: 'Fast', use: 'Button hover, icon swaps' },
  { token: '--core-duration-md', value: '120ms', alias: '--motion-duration-short', label: 'Short', use: 'Input focus, badge appear' },
  { token: '--core-duration-lg', value: '200ms', alias: '--motion-duration-slow', label: 'Normal', use: 'Dropdown open, tooltip appear' },
  { token: '--core-duration-xl', value: '320ms', alias: '--motion-duration-long', label: 'Slow', use: 'Modal enter, page transition' },
  { token: '--core-duration-2xl', value: '500ms', alias: '--motion-duration-xlong', label: 'X-Slow', use: 'Onboarding, splash screens' },
];

const easingTokens = [
  { token: '--motion-easing-standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'Standard', use: 'General transitions (enter + exit)' },
  { token: '--motion-easing-emphasized', value: 'cubic-bezier(0.2, 0, 0, 1)', label: 'Emphasized', use: 'Modals, drawers entering from off-screen' },
  { token: '--motion-easing-decelerate', value: 'cubic-bezier(0, 0, 0.2, 1)', label: 'Decelerate', use: 'Elements flying in (enter only)' },
  { token: '--motion-easing-fast-out', value: 'cubic-bezier(0.4, 0, 1, 1)', label: 'Accelerate', use: 'Elements flying out (exit only)' },
  { token: '--motion-easing-soft', value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', label: 'Soft', use: 'Gentle hover, scroll reveals' },
];

const moodPresets = [
  { mood: 'Fast', color: '#EF4444', duration: '80–120ms', easing: 'standard', use: 'Dashboard, data tools — speed priority' },
  { mood: 'Calm', color: '#3B82F6', duration: '200–300ms', easing: 'emphasized', use: 'Consumer apps, reading flow' },
  { mood: 'Premium', color: '#8B5CF6', duration: '320ms + delay', easing: 'soft', use: 'High-end product, luxury SaaS' },
  { mood: 'Playful', color: '#F59E0B', duration: 'Spring/bounce', easing: 'emphasized', use: 'Games, creative tools, social' },
];

/* ─── Live animation demos ────────────────────────────────────── */
function FadeDemo() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
      <div style={{ height: 56, width: '100%', background: 'var(--accent)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: visible ? 1 : 0, transition: `opacity var(--motion-duration-slow) var(--motion-easing-standard)` }}>
        <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--accent-foreground)', fontFamily: F }}>Fade target</span>
      </div>
      <Button size="sm" variant="outline" onClick={() => setVisible(v => !v)}>
        <RotateCw size={13} /> Toggle fade
      </Button>
      <code style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>
        transition: opacity var(--motion-duration-slow) var(--motion-easing-standard)
      </code>
    </div>
  );
}

function SlideDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
      <div style={{ height: 56, width: '100%', background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 var(--spacing-4)' }}>
        <div style={{ transform: open ? 'translateX(0)' : 'translateX(-120%)', opacity: open ? 1 : 0, transition: `transform var(--motion-duration-long) var(--motion-easing-emphasized), opacity var(--motion-duration-long) var(--motion-easing-emphasized)`, background: 'var(--accent)', borderRadius: 'var(--radius-sm)', padding: '8px 16px' }}>
          <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--accent-foreground)', fontSize: 'var(--text-sm)', fontFamily: F }}>Slide in!</span>
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={() => setOpen(v => !v)}>
        <RotateCw size={13} /> Toggle slide
      </Button>
      <code style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>
        transition: transform var(--motion-duration-long) var(--motion-easing-emphasized)
      </code>
    </div>
  );
}

function ScaleDemo() {
  const [scaled, setScaled] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
      <div style={{ height: 56, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, background: 'var(--accent)', borderRadius: 'var(--radius-md)', transform: scaled ? 'scale(1.4)' : 'scale(1)', transition: `transform var(--motion-duration-short) var(--motion-easing-soft)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={20} style={{ color: 'var(--accent-foreground)' }} />
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={() => setScaled(v => !v)}>
        <RotateCw size={13} /> Toggle scale
      </Button>
      <code style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>
        transition: transform var(--motion-duration-short) var(--motion-easing-soft)
      </code>
    </div>
  );
}

function HoverButton() {
  const [hov, setHov] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ padding: 'var(--spacing-3) var(--spacing-5)', background: hov ? 'var(--accent)' : 'var(--card)', border: hov ? 'var(--border-accent)' : 'var(--border-default)', borderRadius: 'var(--btn-radius)', color: hov ? 'var(--accent-foreground)' : 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: F, fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', transform: hov ? 'translateY(-1px)' : 'translateY(0)', boxShadow: hov ? 'var(--shadow-raised)' : 'none', transition: `all var(--motion-duration-fast) var(--motion-easing-standard)` }}
      >
        Hover me
      </button>
      <code style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>
        transition: all var(--motion-duration-fast) var(--motion-easing-standard)
      </code>
    </div>
  );
}

/* ─── Easing visualizer ───────────────────────────────────────── */
function EasingVisualizer({ easing, label }: { easing: string; label: string }) {
  const [active, setActive] = React.useState(false);
  return (
    <div
      onClick={() => { setActive(true); setTimeout(() => setActive(false), 700); }}
      style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)', cursor: 'pointer', userSelect: 'none' }}
    >
      <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{label}</p>
      <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius-sm)', height: 8, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, background: 'var(--accent)', borderRadius: 'var(--radius-sm)', width: active ? '100%' : '0%', transition: active ? `width 600ms ${easing}` : 'none' }} />
      </div>
      <p style={{ margin: 'var(--spacing-2) 0 0', fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>Click to animate</p>
    </div>
  );
}

export function AnimationsDoc() {
  return (
    <PageWrapper>
      <PageHeader
        badge="Motion System"
        title="Animations"
        description="Token-driven motion system. Duration scale, easing curves, mood presets, and live interaction demos. All animation values come from CSS variables — update once, cascade everywhere."
      />

      {/* Duration Scale */}
      <PageSection
        title="Duration Scale"
        description="6 named duration steps from --motion-duration-fast (80ms) to --motion-duration-xlong (500ms). Use the semantic tokens in components, never raw ms values."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {durationTokens.map(d => (
            <div key={d.token} style={{ display: 'grid', gridTemplateColumns: '200px 80px 180px 1fr', gap: 'var(--spacing-4)', alignItems: 'center', background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-5)' }}>
              <code style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontFamily: 'var(--core-font-family-mono)' }}>{d.alias}</code>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <div style={{ height: 4, borderRadius: 'var(--radius-full)', background: 'var(--accent)', width: `${(parseInt(d.value) / 500) * 100}%`, minWidth: 8, maxWidth: 60 }} />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--core-font-family-mono)', whiteSpace: 'nowrap' }}>{d.value}</span>
              </div>
              <Badge variant="outline">{d.label}</Badge>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{d.use}</span>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Easing */}
      <PageSection title="Easing Curves" description="5 semantic easing tokens. Click any card to see the animation.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--spacing-4)' }}>
          {easingTokens.map(e => (
            <div key={e.token} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)' }}>
              <EasingVisualizer easing={e.value} label={e.label} />
              <div style={{ marginTop: 'var(--spacing-3)' }}>
                <code style={{ fontSize: '10px', color: 'var(--accent)', display: 'block', marginBottom: 'var(--spacing-1)', fontFamily: 'var(--core-font-family-mono)' }}>{e.token}</code>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{e.use}</p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Mood presets */}
      <PageSection title="Motion Moods" description="Moods are NOT tokens — they are motion presets that guide animation decisions based on brand personality.">
        <PageGrid cols={2}>
          {moodPresets.map(m => (
            <div key={m.mood} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color }} />
                <h3 style={{ margin: 0, fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>{m.mood}</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F, minWidth: 70 }}>Duration</span>
                  <code style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--core-font-family-mono)' }}>{m.duration}</code>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F, minWidth: 70 }}>Easing</span>
                  <code style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: 'var(--core-font-family-mono)' }}>{m.easing}</code>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{m.use}</p>
            </div>
          ))}
        </PageGrid>
      </PageSection>

      {/* Live demos */}
      <PageSection title="Live Demos" description="Interactive examples. All use semantic motion tokens — no hardcoded ms or easing values.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--spacing-5)' }}>
          {[
            { label: 'Fade', comp: <FadeDemo /> },
            { label: 'Slide', comp: <SlideDemo /> },
            { label: 'Scale', comp: <ScaleDemo /> },
            { label: 'Hover', comp: <HoverButton /> },
          ].map(({ label, comp }) => (
            <div key={label} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)' }}>
              <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>{label}</p>
              {comp}
            </div>
          ))}
        </div>
      </PageSection>

      {/* Rules */}
      <PageSection title="Motion Rules">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-6)' }}>
            {[
              { color: 'var(--success)', label: 'Always do', rules: ['Use semantic duration tokens (--motion-duration-fast)', 'Use semantic easing tokens (--motion-easing-standard)', 'Test at 2× slow motion for a11y', 'Respect prefers-reduced-motion'] },
              { color: 'var(--destructive)', label: 'Never do', rules: ['Hardcode ms values (200ms) in components', 'Hardcode cubic-bezier() directly', 'Animate layout-triggering properties', 'Animate more than 3 properties at once'] },
            ].map(({ color, label, rules }) => (
              <div key={label}>
                <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>{label}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {rules.map(r => (
                    <li key={r} style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: F }}>
                      <span style={{ color, flexShrink: 0, fontWeight: 'var(--font-weight-bold)' }}>{color === 'var(--success)' ? '✓' : '✗'}</span>
                      {r}
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

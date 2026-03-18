import React from 'react';
import { BlockPageShell } from './BlockPageShell';
import { Star } from 'lucide-react';

const F = 'Inter Tight, sans-serif';

const testimonials = [
  { name: 'Aisha Mohammed', role: 'Lead Designer, Vercel', quote: 'The token architecture alone saved us 3 weeks of refactoring. Switching brands is a one-file change.', rating: 5, avatar: 'AM' },
  { name: 'Lucas Ferreira', role: 'Frontend Lead, Linear', quote: 'Finally a component library that treats CSS variables as first-class citizens. The 4-layer system is brilliant.', rating: 5, avatar: 'LF' },
  { name: 'Priya Nair', role: 'Design Systems, Stripe', quote: 'Went from Figma mockup to production in a day. The Figma-to-code sync is seamless.', rating: 5, avatar: 'PN' },
  { name: 'Tom Eriksson', role: 'CTO, Nookweb', quote: 'We replaced our entire bespoke component library with Wugweb Kits. Zero regrets, huge velocity gain.', rating: 5, avatar: 'TE' },
  { name: 'Fatima Al-Hassan', role: 'Product Engineer', quote: 'The accessibility story is real. Every component has WCAG AA compliance baked in from the token level.', rating: 5, avatar: 'FA' },
  { name: 'James Park', role: 'Indie Developer', quote: 'As a solo dev, having 127 production-ready components means I can focus on the product, not the system.', rating: 5, avatar: 'JP' },
];

const Stars = ({ n = 5 }: { n?: number }) => (
  <div style={{ display: 'flex', gap: 2, marginBottom: 'var(--spacing-3)' }}>
    {Array.from({ length: n }).map((_, i) => <Star key={i} size={14} fill="var(--accent)" stroke="none" />)}
  </div>
);

const Avatar = ({ initials, size = 40 }: { initials: string; size?: number }) => (
  <div style={{ width: size, height: size, borderRadius: 'var(--radius-full)', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <span style={{ fontSize: size < 36 ? 'var(--text-xs)' : 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-foreground)', fontFamily: F }}>{initials}</span>
  </div>
);

const CardGrid = () => (
  <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', background: 'var(--background)' }}>
    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
      <h2 style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--ts-h2-size)', fontWeight: 'var(--ts-h2-weight)', color: 'var(--foreground)', fontFamily: F }}>Loved by design teams</h2>
      <p style={{ margin: 0, color: 'var(--muted-foreground)', fontFamily: F }}>Real feedback from teams shipping with Wugweb Kits.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--spacing-5)', maxWidth: 900, margin: '0 auto' }}>
      {testimonials.map(t => (
        <div key={t.name} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Stars n={t.rating} />
          <p style={{ margin: 0, fontSize: 'var(--ts-body-sm-size)', color: 'var(--foreground)', lineHeight: 1.65, fontFamily: F, flex: 1 }}>"{t.quote}"</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginTop: 'auto' }}>
            <Avatar initials={t.avatar} size={36} />
            <div>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{t.name}</p>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{t.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const FeaturedQuote = () => (
  <section style={{ padding: 'var(--core-spacing-20) var(--core-spacing-8)', background: 'var(--background)', textAlign: 'center' }}>
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Stars n={5} />
      <blockquote style={{ margin: '0 0 var(--spacing-8)', fontSize: 'clamp(1.25rem, 3vw, var(--ts-h3-size))', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1.45, fontFamily: F, fontStyle: 'italic' }}>
        "The token architecture alone saved us 3 weeks of refactoring. Switching brands is a one-file change."
      </blockquote>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-3)' }}>
        <Avatar initials="AM" size={48} />
        <div style={{ textAlign: 'left' }}>
          <p style={{ margin: 0, fontSize: 'var(--ts-body-md-size)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>Aisha Mohammed</p>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F }}>Lead Designer, Vercel</p>
        </div>
      </div>
    </div>
  </section>
);

const LogoRail = () => (
  <section style={{ padding: 'var(--core-spacing-12) var(--core-spacing-8)', background: 'var(--card)', borderTop: 'var(--border-default)', borderBottom: 'var(--border-default)' }}>
    <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--spacing-6)', fontFamily: F }}>Trusted by teams at</p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-10)', flexWrap: 'wrap', alignItems: 'center' }}>
      {['Wugweb', 'Stayweb', 'Nookweb', 'Docweb', 'Kits'].map(name => (
        <span key={name} style={{ fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', opacity: 0.5, fontFamily: F }}>{name}</span>
      ))}
    </div>
  </section>
);

export function TestimonialsBlock() {
  return (
    <BlockPageShell
      title="Testimonials"
      description="Social proof blocks for landing pages: card grids, featured quotes, and logo rails. Token-driven, responsive."
      category="Marketing UI"
      count={8}
      variants={[
        { id: 'cards', label: 'Testimonial card grid', preview: <CardGrid /> },
        { id: 'featured', label: 'Featured large quote', preview: <FeaturedQuote /> },
        { id: 'logos', label: 'Logo trust rail', preview: <LogoRail /> },
      ]}
    />
  );
}

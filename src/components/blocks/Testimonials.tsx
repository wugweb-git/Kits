import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const QUOTES = [
  { name: 'Lena Kovač', role: 'Lead Designer @ Pitch', text: 'Wugweb Kits saved us weeks. The token system maps perfectly to our Figma variables, so hand-off is near-zero friction.', rating: 5 },
  { name: 'James Okafor', role: 'Frontend Engineer @ Linear', text: 'I plugged in the CSS variables in under an hour. Every breakpoint, every radius, every shadow — all already there. Genuinely impressed.', rating: 5 },
  { name: 'Priya Sharma', role: 'Design System Lead @ Vercel', text: 'The 4-layer token architecture is exactly how modern design systems should work. This is the reference I share with my team.', rating: 5 },
  { name: 'Carlos Mendes', role: 'Senior Developer @ Shopify', text: 'We shipped 3 product updates faster after switching. Standardised spacing and type scale meant fewer design reviews.', rating: 5 },
  { name: 'Sophie Turner', role: 'Product Manager @ Notion', text: 'The interactive Playground was a game-changer for aligning stakeholders without writing a line of code.', rating: 5 },
  { name: 'Arjun Mehta', role: 'Full-Stack Dev @ Stripe', text: 'Beautifully documented. The token architecture page alone replaced a 40-page internal doc we had been maintaining for two years.', rating: 5 },
  { name: 'Yuki Tanaka', role: 'UI Engineer @ Figma', text: 'The fluid type scale just works. clamp() everywhere, no media query spaghetti. We forked this as our new foundation.', rating: 5 },
  { name: 'Marco Bianchi', role: 'Creative Director @ Meta', text: 'Gorgeous by default, practical under the hood. The dark-mode tokens are the best I have used in any open system.', rating: 5 },
];

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--spacing-3)' }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: 'var(--accent)', fontSize: 'var(--fluid-body-sm)' }}>★</span>
      ))}
    </div>
  );
}

function TestimonialCard({ name, role, text, rating }: (typeof QUOTES)[0]) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-6)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-4)',
      fontFamily: 'var(--core-font-family-base)',
      boxShadow: 'var(--core-shadow-xs)',
    }}>
      <StarRating count={rating} />

      <p style={{
        margin: 0,
        fontFamily: 'var(--core-font-family-base)',
        fontSize: 'var(--fluid-body-md)',
        color: 'var(--foreground)',
        lineHeight: 'var(--core-line-height-relaxed)',
        fontStyle: 'italic',
      }}>
        "{text}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginTop: 'auto' }}>
        {/* Avatar */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-body-sm)',
            fontWeight: 'var(--font-weight-bold)' as any,
            color: 'var(--accent-foreground)',
          }}>
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <p style={{
            margin: 0,
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-body-sm)',
            fontWeight: 'var(--font-weight-semibold)' as any,
            color: 'var(--foreground)',
            lineHeight: 1.2,
          }}>
            {name}
          </p>
          <p style={{
            margin: 0,
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-caption)',
            color: 'var(--muted-foreground)',
            lineHeight: 1.3,
          }}>
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsGrid() {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 640: 2, 1024: 3 }}>
      <Masonry gutter="var(--spacing-4)">
        {QUOTES.map(q => (
          <TestimonialCard key={q.name} {...q} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}

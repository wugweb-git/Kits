import React from 'react';
import { Check, Star, Zap, Shield, Layers, Code, ArrowRight, Menu } from 'lucide-react';
import { PageWrapper, PageHeader } from '../../PageWrapper';
import { Button } from '../../../wugweb/Button';
import { siteInventory } from '../../../../generated/siteInventory';

const F = 'Inter Tight, sans-serif';

function LandingPreview() {
  const features = [
    { icon: Zap, title: 'Lightning fast', desc: 'CSS variable architecture means zero JS runtime cost. Ships lean.' },
    { icon: Shield, title: 'Accessible first', desc: 'WCAG AA contrast and keyboard navigation built into every component.' },
    { icon: Layers, title: '4-layer tokens', desc: 'Global → Alias → Semantic → Component. Swap brands in one file.' },
    { icon: Code, title: 'Code-first', desc: 'Tokens Studio + GitHub + Style Dictionary = always in sync.' },
  ];

  const plans = [
    { name: 'Starter', price: 'Free', cta: 'Get started', desc: 'For individuals', featured: false, features: ['5 components', '1 project', 'Community'] },
    { name: 'Pro', price: '$29/mo', cta: 'Start trial', desc: 'For teams', featured: true, features: [`${siteInventory.publicComponentModuleCount} components`, 'Unlimited', 'Priority support'] },
    { name: 'Enterprise', price: 'Custom', cta: 'Contact us', desc: 'For orgs', featured: false, features: ['Everything', 'SLA', 'Dedicated'] },
  ];

  const testimonials = [
    { name: 'Aisha M.', role: 'Lead Designer', quote: 'Saved us 3 weeks of refactoring.', stars: 5 },
    { name: 'Lucas F.', role: 'Frontend Lead', quote: 'Finally a library that treats tokens as first-class.', stars: 5 },
    { name: 'Priya N.', role: 'Design Systems', quote: 'Figma-to-code in a single day. Seamless.', stars: 5 },
  ];

  return (
    <div style={{ background: 'var(--background)', fontFamily: F }}>
      {/* Navbar */}
      <nav style={{ height: 56, background: 'rgba(18,18,18,0.9)', backdropFilter: 'blur(8px)', borderBottom: 'var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--spacing-8)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-foreground)', fontSize: 'var(--text-xs)', fontFamily: F }}>W</span>
          </div>
          <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: F }}>Wugweb Kits</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
          {['Features', 'Pricing', 'Docs', 'Blog'].map(l => (
            <a key={l} href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', textDecoration: 'none', fontFamily: F }}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="ghost" size="sm">Sign in</Button>
          <Button variant="default" size="sm">Get started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: 'var(--core-spacing-20) var(--core-spacing-8) var(--core-spacing-16)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)', background: 'var(--accent-subtle)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-full)', padding: '4px 14px', marginBottom: 'var(--spacing-6)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--accent)', fontFamily: F }}>Kits v2.0 is live</span>
        </div>
        <h1 style={{ margin: '0 auto var(--spacing-6)', maxWidth: 640, fontSize: 'clamp(2.5rem, 6vw, 64px)', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1.08, fontFamily: F }}>
          Design system infrastructure that ships
        </h1>
        <p style={{ margin: '0 auto var(--spacing-8)', maxWidth: 480, fontSize: 'var(--ts-body-lg-size)', color: 'var(--muted-foreground)', lineHeight: 'var(--ts-body-lg-line-height)', fontFamily: F }}>
          {`${siteInventory.publicComponentModuleCount} production-ready components. 4-layer token architecture. Figma-to-code sync that actually works.`}
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--spacing-10)' }}>
          <Button variant="default" size="lg">Get started free</Button>
          <Button variant="outline" size="lg">View components →</Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-8)', flexWrap: 'wrap' }}>
          {[[String(siteInventory.publicComponentModuleCount), 'Components'], ['4-layer', 'Token system'], ['MIT', 'License'], ['100%', 'CSS variables']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 'var(--ts-h3-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: F }}>{v}</p>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', borderTop: 'var(--border-default)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-10)' }}>
          <h2 style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--ts-h2-size)', fontWeight: 'var(--ts-h2-weight)', color: 'var(--foreground)', fontFamily: F }}>Built for production teams</h2>
          <p style={{ margin: 0, color: 'var(--muted-foreground)', fontFamily: F }}>Every decision made to scale without breaking things.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-5)', maxWidth: 900, margin: '0 auto' }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-6)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-4)' }}>
                <Icon size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, fontFamily: F }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', borderTop: 'var(--border-default)', background: 'var(--card)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-10)' }}>
          <h2 style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--ts-h2-size)', fontWeight: 'var(--ts-h2-weight)', color: 'var(--foreground)', fontFamily: F }}>Simple pricing</h2>
          <p style={{ margin: 0, color: 'var(--muted-foreground)', fontFamily: F }}>Start free. Scale when you're ready.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-5)', maxWidth: 760, margin: '0 auto' }}>
          {plans.map(plan => (
            <div key={plan.name} style={{ background: plan.featured ? 'var(--accent)' : 'var(--background)', border: plan.featured ? 'var(--border-accent)' : 'var(--border-default)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-6)', position: 'relative' }}>
              {plan.featured && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--foreground)', color: 'var(--background)', fontSize: '10px', fontWeight: 'var(--font-weight-bold)', padding: '2px 12px', borderRadius: 'var(--radius-full)', fontFamily: F, whiteSpace: 'nowrap' }}>Most popular</div>}
              <p style={{ margin: '0 0 var(--spacing-1)', fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: plan.featured ? 'var(--accent-foreground)' : 'var(--foreground)', fontFamily: F }}>{plan.name}</p>
              <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-xs)', color: plan.featured ? 'rgba(18,18,18,0.6)' : 'var(--muted-foreground)', fontFamily: F }}>{plan.desc}</p>
              <p style={{ margin: '0 0 var(--spacing-5)', fontSize: 'var(--ts-h3-size)', fontWeight: 'var(--font-weight-bold)', color: plan.featured ? 'var(--accent-foreground)' : 'var(--foreground)', fontFamily: F }}>{plan.price}</p>
              <Button variant={plan.featured ? 'default' : 'outline'} style={{ width: '100%', marginBottom: 'var(--spacing-5)', ...(plan.featured ? { background: 'var(--accent-foreground)', color: 'var(--accent)' } : {}) }} size="sm">
                {plan.cta}
              </Button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Check size={12} style={{ color: plan.featured ? 'var(--accent-foreground)' : 'var(--success)', flexShrink: 0 }} />
                    <span style={{ fontSize: 'var(--text-xs)', color: plan.featured ? 'var(--accent-foreground)' : 'var(--foreground)', fontFamily: F }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', borderTop: 'var(--border-default)' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 var(--spacing-10)', fontSize: 'var(--ts-h2-size)', fontWeight: 'var(--ts-h2-weight)', color: 'var(--foreground)', fontFamily: F }}>Loved by teams</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-5)', maxWidth: 800, margin: '0 auto' }}>
          {testimonials.map(t => (
            <div key={t.name} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 'var(--spacing-3)' }}>
                {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={12} fill="var(--accent)" stroke="none" />)}
              </div>
              <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: F, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>{t.name}</p>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--accent)', padding: 'var(--core-spacing-16) var(--core-spacing-8)', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--ts-h2-size)', fontWeight: 'var(--ts-h2-weight)', color: 'var(--accent-foreground)', fontFamily: F }}>Start building today</h2>
        <p style={{ margin: '0 0 var(--spacing-8)', color: 'rgba(18,18,18,0.65)', fontFamily: F }}>No credit card. MIT licensed. Yours forever.</p>
        <Button style={{ background: 'var(--accent-foreground)', color: 'var(--accent)' }} size="lg">Get the kit free <ArrowRight size={16} /></Button>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--card)', borderTop: 'var(--border-default)', padding: 'var(--spacing-5) var(--spacing-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>Wugweb Kits</span>
        <div style={{ display: 'flex', gap: 'var(--spacing-5)' }}>
          {['Privacy', 'Terms', 'License', 'GitHub'].map(l => <a key={l} href="#" style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textDecoration: 'none', fontFamily: F }}>{l}</a>)}
        </div>
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>© 2025 Wugweb. MIT License.</p>
      </footer>
    </div>
  );
}

export function LandingPageTemplate() {
  return (
    <PageWrapper maxWidth="100%">
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <PageHeader
          badge="Template"
          title="SaaS Landing Page"
          description="Full scrollable landing page — navbar, hero, features, pricing, testimonials, CTA, and footer. 100% CSS variables."
        />
      </div>

      {/* Preview in browser chrome */}
      <div style={{ border: 'var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-raised)' }}>
        {/* Browser chrome */}
        <div style={{ background: 'var(--muted)', borderBottom: 'var(--border-default)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          {['var(--destructive)', 'var(--warning)', 'var(--success)'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
          <div style={{ flex: 1, marginLeft: 8, background: 'var(--card)', borderRadius: 'var(--radius-sm)', padding: '3px 10px', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>kits.wugweb.io</div>
        </div>
        <div style={{ maxHeight: 700, overflowY: 'auto' }}>
          <LandingPreview />
        </div>
      </div>
    </PageWrapper>
  );
}

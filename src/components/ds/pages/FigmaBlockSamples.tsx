import React from 'react';
import { TrialPromoCardSystem, BlogCardSystem, FigmaInfoCardSystem } from '../../blocks/PromoBlocks';
import { TestimonialsGrid } from '../../blocks/Testimonials';
import { TrendsCard } from '../../blocks/TrendsCard';
import { ServiceCards } from '../../blocks/ServiceCards';
import { AuthScreen } from '../../blocks/AuthScreen';
import { LoginUI } from '../../blocks/LoginUI';
import { CartView } from '../../blocks/CartView';
import { ProjectCTA, QuoteCTA, DarkFooter, ServicesForm } from '../../blocks/FormBlocks';
import { DocWebNav } from '../../nav/DocWebNav';

// ─── Section wrapper ──────────────────────────────────────────────────────────
function BlockSection({
  id,
  title,
  subtitle,
  children,
  flush = false,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  flush?: boolean;
}) {
  return (
    <section id={id} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-6)',
      scrollMarginTop: '80px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)',
        padding: flush ? '0' : undefined,
      }}>
        <h2 style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h2)',
          fontWeight: 'var(--ts-h2-weight)' as any,
          color: 'var(--foreground)',
          margin: 0,
          lineHeight: 'var(--ts-h2-line-height)',
        }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-body-md)',
            color: 'var(--muted-foreground)',
            margin: 0,
            lineHeight: 'var(--core-line-height-relaxed)',
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div>{children}</div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', marginTop: 'var(--spacing-4)' }} />
    </section>
  );
}

// ─── Label tag ────────────────────────────────────────────────────────────────
function SectionTag({ label }: { label: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
      <span style={{
        background: 'var(--accent-subtle)',
        border: '1px solid var(--accent-muted)',
        borderRadius: 'var(--radius-full)',
        padding: '2px var(--spacing-3)',
        fontFamily: 'var(--core-font-family-base)',
        fontSize: 'var(--fluid-caption)',
        fontWeight: 'var(--font-weight-semibold)' as any,
        color: 'var(--accent)',
        textTransform: 'uppercase' as any,
        letterSpacing: '0.08em',
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function FigmaBlockSamples() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-12)',
      fontFamily: 'var(--core-font-family-base)',
    }}>
      {/* Page intro */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <SectionTag label="UI Block Samples" />
        <h1 style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h1)',
          fontWeight: 'var(--font-weight-bold)' as any,
          color: 'var(--foreground)',
          margin: 0,
          lineHeight: 'var(--core-line-height-tight)',
        }}>
          Figma-Imported UI Blocks
        </h1>
        <p style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-lg)',
          color: 'var(--muted-foreground)',
          margin: 0,
          maxWidth: '640px',
          lineHeight: 'var(--core-line-height-relaxed)',
        }}>
          All blocks built exclusively with CSS variable tokens from the design system — no hardcoded hex, px, or raw values.
        </p>
      </div>

      {/* Promo Cards */}
      <BlockSection
        id="promo-cards"
        title="Promo Cards"
        subtitle="Token-adaptive cards for marketing and trial CTAs — light/dark theming via CSS variables."
      >
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-6)',
          alignItems: 'flex-start',
        }}>
          <TrialPromoCardSystem />
          <BlogCardSystem />
          <FigmaInfoCardSystem />
        </div>
      </BlockSection>

      {/* Testimonials */}
      <BlockSection
        id="testimonials"
        title="Client Testimonials"
        subtitle="Masonry-style testimonial grid using CSS variable tokens for all colors, spacing, and radius."
      >
        <TestimonialsGrid />
      </BlockSection>

      {/* Dark Theme Widget */}
      <BlockSection
        id="dark-widget"
        title="Dark Theme Widget"
        subtitle="Analytics dashboard card with a built-in theme toggle — all surfaces via semantic tokens."
      >
        <TrendsCard />
      </BlockSection>

      {/* Service Cards */}
      <BlockSection
        id="service-cards"
        title="Service Cards Gallery"
        subtitle="Responsive card grid with hover interactions, badge tags, and image overlays."
        flush
      >
        <div style={{
          background: 'var(--surface-950)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflowX: 'hidden',
          overflowY: 'hidden',
        }}>
          <ServiceCards />
        </div>
      </BlockSection>

      {/* Auth Flow */}
      <BlockSection
        id="auth-flow"
        title="Full-Screen Auth Flow"
        subtitle="Multi-step authentication with sign-in, create account, and verification states."
      >
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: '680px',
        }}>
          <AuthScreen />
        </div>
      </BlockSection>

      {/* Dark Dashboard Nav */}
      <BlockSection
        id="dark-nav"
        title="Dark Dashboard Nav"
        subtitle="Top navigation bar for dark-theme dashboard templates with brand, notifications, and user profile."
      >
        <div style={{
          borderRadius: 'var(--radius-lg)',
          overflowX: 'hidden',
          overflowY: 'hidden',
          border: '1px solid var(--border)',
        }}>
          <DocWebNav />
        </div>
      </BlockSection>

      {/* Stayweb Login Screen */}
      <BlockSection
        id="login-screen"
        title="Stayweb Login Screen"
        subtitle="Branded split-panel login with sidebar navigation preview, email/password form and loading states."
      >
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflowX: 'hidden',
          overflowY: 'hidden',
        }}>
          <LoginUI />
        </div>
      </BlockSection>

      {/* POS Cart UI */}
      <BlockSection
        id="pos-cart"
        title="POS Cart UI"
        subtitle="Point-of-sale cart with quantity controls, product lines, tax calculation, and checkout CTA."
      >
        <CartView />
      </BlockSection>

      {/* Form & CTA Blocks */}
      <BlockSection
        id="forms-cta"
        title="Form & CTA Blocks"
        subtitle="Lead capture, quote request, services selector, and footer variants — all token-based."
      >
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-8)',
          alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <span style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-caption)',
              fontWeight: 'var(--font-weight-semibold)' as any,
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase' as any,
              letterSpacing: '0.08em',
            }}>
              Project CTA
            </span>
            <ProjectCTA />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <span style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-caption)',
              fontWeight: 'var(--font-weight-semibold)' as any,
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase' as any,
              letterSpacing: '0.08em',
            }}>
              Quote Request
            </span>
            <QuoteCTA />
            <DarkFooter />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <span style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-caption)',
              fontWeight: 'var(--font-weight-semibold)' as any,
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase' as any,
              letterSpacing: '0.08em',
            }}>
              Services Form
            </span>
            <ServicesForm />
          </div>
        </div>
      </BlockSection>
    </div>
  );
}

import React from 'react';
import { Logo } from '../ui/legacy-adapters';
import { Check, ArrowRight, Calendar, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// ─── Trial Promo Card — System Tokens ─────────────────────────────────────────
export function TrialPromoCardSystem() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '476px',
      background: 'var(--card)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-8)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--core-shadow-md)',
      border: '1px solid var(--border)',
      fontFamily: 'var(--core-font-family-base)',
      flexShrink: 0,
    }}>
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <Logo brand="wugweb" state="icon" size="l" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <h2 style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h1)',
          fontWeight: 'var(--font-weight-bold)' as any,
          margin: 0,
          color: 'var(--foreground)',
          lineHeight: 'var(--core-line-height-tight)',
        }}>
          Sign up and start<br />your free trial
        </h2>
        <p style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h3)',
          fontWeight: 'var(--font-weight-regular)' as any,
          fontStyle: 'italic',
          color: 'var(--muted-foreground)',
          margin: 0,
        }}>
          Get this deal today
        </p>
      </div>

      <button style={{
        marginTop: 'var(--spacing-12)',
        background: 'var(--accent)',
        color: 'var(--accent-foreground)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-3) var(--spacing-8)',
        fontFamily: 'var(--core-font-family-base)',
        fontSize: 'var(--fluid-body-md)',
        fontWeight: 'var(--font-weight-semibold)' as any,
        fontStyle: 'italic',
        alignSelf: 'flex-start',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        transition: `opacity var(--motion-duration-fast) var(--motion-easing-standard)`,
      }}>
        Let's Start
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ─── Blog Card — System Tokens ────────────────────────────────────────────────
export function BlogCardSystem() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '476px',
      background: 'var(--card)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--core-shadow-md)',
      border: '1px solid var(--border)',
      fontFamily: 'var(--core-font-family-base)',
      overflowX: 'hidden',
      overflowY: 'hidden',
      flexShrink: 0,
    }}>
      {/* Image */}
      <div style={{ width: '100%', height: '220px', background: 'var(--muted)', position: 'relative', flexShrink: 0 }}>
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&q=80"
          alt="Blog header"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--gradient-overlay)',
        }} />
      </div>

      <div style={{
        padding: 'var(--spacing-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <Calendar size={12} color="var(--muted-foreground)" />
          <span style={{
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-caption)',
            fontStyle: 'italic',
            color: 'var(--muted-foreground)',
          }}>
            Monday Jan 20, 2025
          </span>
        </div>

        <h3 style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h2)',
          fontWeight: 'var(--font-weight-bold)' as any,
          margin: 0,
          color: 'var(--foreground)',
          lineHeight: 'var(--core-line-height-tight)',
        }}>
          Learn Microinteraction
        </h3>

        <p style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-sm)',
          fontStyle: 'italic',
          color: 'var(--muted-foreground)',
          margin: 0,
          lineHeight: 'var(--core-line-height-relaxed)',
        }}>
          Microinteractions are subtle animations and transitions that guide users through an interface, providing feedback and creating delight.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'var(--spacing-2)',
        }}>
          <span style={{
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-body-sm)',
            fontWeight: 'var(--font-weight-semibold)' as any,
            color: 'var(--accent)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-1)',
          }}>
            Read Full Blog <ArrowRight size={12} />
          </span>
          <div style={{
            background: 'var(--muted)',
            padding: 'var(--spacing-1) var(--spacing-3)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}>
            <span style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-caption)',
              fontWeight: 'var(--font-weight-medium)' as any,
              fontStyle: 'italic',
              textTransform: 'uppercase' as any,
              letterSpacing: '0.06em',
              color: 'var(--muted-foreground)',
            }}>
              Blog
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Figma Info Card — System Tokens ──────────────────────────────────────────
export function FigmaInfoCardSystem() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '496px',
      background: 'var(--card)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-8)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-6)',
      boxShadow: 'var(--core-shadow-md)',
      border: '1px solid var(--border)',
      fontFamily: 'var(--core-font-family-base)',
      flexShrink: 0,
    }}>
      {/* Header — Figma dots icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            <div style={{ width: '14px', height: '14px', background: '#F24E1E', borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px', borderTopRightRadius: '7px' }} />
            <div style={{ width: '14px', height: '14px', background: '#FF7262', borderRadius: '7px' }} />
          </div>
          <div style={{ display: 'flex', gap: '3px' }}>
            <div style={{ width: '14px', height: '14px', background: '#A259FF', borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px', borderBottomRightRadius: '7px' }} />
            <div style={{ width: '14px', height: '14px', background: '#1ABCFE', borderRadius: '50%' }} />
          </div>
          <div style={{ display: 'flex', gap: '3px' }}>
            <div style={{ width: '14px', height: '14px', background: '#0ACF83', borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px', borderBottomRightRadius: '7px' }} />
          </div>
        </div>
        <h3 style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h3)',
          fontWeight: 'var(--font-weight-semibold)' as any,
          color: 'var(--foreground)',
          margin: 0,
        }}>
          E-Commerce Cards
        </h3>
      </div>

      <p style={{
        fontFamily: 'var(--core-font-family-base)',
        fontSize: 'var(--fluid-body-md)',
        color: 'var(--muted-foreground)',
        lineHeight: 'var(--core-line-height-relaxed)',
        margin: 0,
      }}>
        This beautiful collection of UI components is part of the recently released Wugweb Design System. It is a powerful tool for Figma including 300+ ready to use components.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <ExternalLink size={16} color="var(--accent)" />
        <a
          href="https://wugweb.io"
          style={{
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-body-md)',
            fontWeight: 'var(--font-weight-semibold)' as any,
            color: 'var(--foreground)',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}
        >
          https://wugweb.io
        </a>
      </div>

      <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        {['Auto Layout', 'Variants', 'Super organized & clean'].map(feature => (
          <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: 'var(--success)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Check size={12} color="var(--background)" strokeWidth={3} />
            </div>
            <span style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-body-sm)',
              color: 'var(--foreground)',
            }}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

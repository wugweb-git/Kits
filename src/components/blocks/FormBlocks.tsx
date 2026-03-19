import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, AlertCircle, Check } from 'lucide-react';

// ─── Project CTA (Form 4) ──────────────────────────────────────────────────────
export function ProjectCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div style={{
      background: 'var(--warning)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-8)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-6)',
      maxWidth: '480px',
      fontFamily: 'var(--core-font-family-base)',
      boxShadow: 'var(--core-shadow-md)',
    }}>
      <div>
        <p style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-caption)',
          fontWeight: 'var(--font-weight-semibold)' as any,
          textTransform: 'uppercase' as any,
          letterSpacing: '0.1em',
          color: 'var(--core-color-neutral-800)',
          margin: '0 0 var(--spacing-2) 0',
        }}>
          Get Started
        </p>
        <h2 style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h2)',
          fontWeight: 'var(--font-weight-bold)' as any,
          color: 'var(--core-color-neutral-950)',
          margin: '0 0 var(--spacing-3) 0',
          lineHeight: 'var(--core-line-height-tight)',
        }}>
          Start your next project with us
        </h2>
        <p style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-md)',
          color: 'var(--core-color-neutral-700)',
          margin: 0,
          lineHeight: 'var(--core-line-height-relaxed)',
        }}>
          Join thousands of designers and developers who ship faster with Wugweb Kits.
        </p>
      </div>

      {submitted ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
          background: 'rgba(0,0,0,0.08)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-4)',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--core-color-neutral-950)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Check size={16} color="var(--warning)" strokeWidth={3} />
          </div>
          <span style={{
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-body-md)',
            fontWeight: 'var(--font-weight-semibold)' as any,
            color: 'var(--core-color-neutral-950)',
          }}>
            You're in! We'll be in touch soon.
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.75)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(0,0,0,0.10)',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 var(--spacing-3)',
              borderRight: '1px solid rgba(0,0,0,0.10)',
            }}>
              <Mail size={16} color="var(--core-color-neutral-600)" />
            </div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: 'var(--spacing-3) var(--spacing-3)',
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-md)',
                color: 'var(--core-color-neutral-950)',
              }}
            />
          </div>
          <button
            onClick={() => email && setSubmitted(true)}
            style={{
              background: 'var(--core-color-neutral-950)',
              color: 'var(--warning)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-3) var(--spacing-6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-2)',
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-body-md)',
              fontWeight: 'var(--font-weight-semibold)' as any,
              transition: `opacity var(--motion-duration-fast) var(--motion-easing-standard)`,
              width: '100%',
            }}
          >
            Get Early Access
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Quote CTA (Form 8) ────────────────────────────────────────────────────────
export function QuoteCTA() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--input-background)',
    border: '1px solid var(--input-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-3)',
    fontFamily: 'var(--core-font-family-base)',
    fontSize: 'var(--fluid-body-sm)',
    color: 'var(--foreground)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: `border-color var(--motion-duration-short) var(--motion-easing-standard)`,
  };

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-8)',
      maxWidth: '480px',
      fontFamily: 'var(--core-font-family-base)',
      boxShadow: 'var(--core-shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-6)',
    }}>
      <div>
        <h2 style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h2)',
          fontWeight: 'var(--font-weight-bold)' as any,
          color: 'var(--foreground)',
          margin: '0 0 var(--spacing-2) 0',
          lineHeight: 'var(--core-line-height-tight)',
        }}>
          Request a Quote
        </h2>
        <p style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-md)',
          color: 'var(--muted-foreground)',
          margin: 0,
        }}>
          We'll get back to you within 24 hours.
        </p>
      </div>

      {submitted ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-4)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Check size={24} color="var(--background)" strokeWidth={3} />
          </div>
          <p style={{
            margin: 0,
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-body-md)',
            color: 'var(--foreground)',
          }}>
            Quote request sent!
          </p>
        </div>
      ) : (
        <form
          onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}
        >
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
              <label style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-label)', color: 'var(--muted-foreground)' }}>
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Full name"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
              <label style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-label)', color: 'var(--muted-foreground)' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' } as any} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="you@email.com"
                  style={{ ...inputStyle, paddingLeft: 'var(--spacing-8)' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
            <label style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-label)', color: 'var(--muted-foreground)' }}>
              Phone
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' } as any} />
              <input
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{ ...inputStyle, paddingLeft: 'var(--spacing-8)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
            <label style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-label)', color: 'var(--muted-foreground)' }}>
              Message
            </label>
            <textarea
              value={form.message}
              onChange={e => handleChange('message', e.target.value)}
              placeholder="Tell us about your project..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2)' }}>
            <AlertCircle size={14} color="var(--muted-foreground)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-caption)',
              color: 'var(--muted-foreground)',
              lineHeight: 'var(--core-line-height-normal)',
            }}>
              Your information is secure and will never be shared with third parties.
            </span>
          </div>

          <button
            type="submit"
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-foreground)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-3) var(--spacing-6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-2)',
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-body-md)',
              fontWeight: 'var(--font-weight-semibold)' as any,
              transition: `opacity var(--motion-duration-fast) var(--motion-easing-standard)`,
            }}
          >
            Send Quote Request <ArrowRight size={16} />
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Dark Footer ───────────────────────────────────────────────────────────────
export function DarkFooter() {
  return (
    <div style={{
      background: 'var(--surface-950)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-6)',
      maxWidth: '480px',
      fontFamily: 'var(--core-font-family-base)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <Logo brand="wugweb" state="icon" size="s" />
          <span style={{
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-body-sm)',
            fontWeight: 'var(--font-weight-semibold)' as any,
            color: 'var(--foreground)',
          }}>
            Wugweb Kits
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 'var(--spacing-5)' }}>
          {['Privacy', 'Terms', 'Contact'].map(link => (
            <a
              key={link}
              href="#"
              style={{
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-sm)',
                color: 'var(--muted-foreground)',
                textDecoration: 'none',
              }}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
      <div style={{
        borderTop: '1px solid var(--border)',
        marginTop: 'var(--spacing-4)',
        paddingTop: 'var(--spacing-4)',
      }}>
        <p style={{
          margin: 0,
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-caption)',
          color: 'var(--muted-foreground)',
        }}>
          © {new Date().getFullYear()} Wugweb. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// ─── Services Form (Frame 36) ──────────────────────────────────────────────────
export function ServicesForm() {
  const [selected, setSelected] = useState<string[]>([]);

  const services = [
    { id: 'design-system', label: 'Design System', desc: 'Token architecture & component library' },
    { id: 'figma-kits', label: 'Figma Kits', desc: 'Production-ready Figma component library' },
    { id: 'dev-handoff', label: 'Dev Handoff', desc: 'Code-ready exports & documentation' },
    { id: 'consultation', label: 'Consultation', desc: 'Expert design system strategy' },
  ];

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-8)',
      maxWidth: '480px',
      fontFamily: 'var(--core-font-family-base)',
      boxShadow: 'var(--core-shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-6)',
    }}>
      <div>
        <h2 style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h2)',
          fontWeight: 'var(--font-weight-bold)' as any,
          color: 'var(--foreground)',
          margin: '0 0 var(--spacing-2) 0',
          lineHeight: 'var(--core-line-height-tight)',
        }}>
          Choose Services
        </h2>
        <p style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-md)',
          color: 'var(--muted-foreground)',
          margin: 0,
        }}>
          Select the services you're interested in.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        {services.map(service => {
          const isSelected = selected.includes(service.id);
          return (
            <button
              key={service.id}
              onClick={() => toggle(service.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-4)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                background: isSelected ? 'var(--accent-subtle)' : 'var(--muted)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: `border-color var(--motion-duration-fast) var(--motion-easing-standard),
                             background var(--motion-duration-fast) var(--motion-easing-standard)`,
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: 'var(--radius-sm)',
                border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                background: isSelected ? 'var(--accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: `border-color var(--motion-duration-fast) var(--motion-easing-standard),
                             background var(--motion-duration-fast) var(--motion-easing-standard)`,
              }}>
                {isSelected && <Check size={12} color="var(--accent-foreground)" strokeWidth={3} />}
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
                  {service.label}
                </p>
                <p style={{
                  margin: 0,
                  fontFamily: 'var(--core-font-family-base)',
                  fontSize: 'var(--fluid-caption)',
                  color: 'var(--muted-foreground)',
                }}>
                  {service.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        disabled={selected.length === 0}
        style={{
          background: selected.length === 0 ? 'var(--muted)' : 'var(--accent)',
          color: selected.length === 0 ? 'var(--muted-foreground)' : 'var(--accent-foreground)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-3) var(--spacing-6)',
          cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-2)',
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-md)',
          fontWeight: 'var(--font-weight-semibold)' as any,
          opacity: selected.length === 0 ? 0.5 : 1,
          transition: `opacity var(--motion-duration-fast) var(--motion-easing-standard),
                       background var(--motion-duration-fast) var(--motion-easing-standard)`,
        }}
      >
        Continue {selected.length > 0 && `(${selected.length})`} <ArrowRight size={16} />
      </button>
    </div>
  );
}

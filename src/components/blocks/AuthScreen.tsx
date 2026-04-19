import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, User } from 'lucide-react';
import { Logo } from '../design-system/components';

type Step = 'sign-in' | 'create-account' | 'verify';

export function AuthScreen() {
  const [step, setStep] = useState<Step>('sign-in');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--core-font-family-base)',
    fontSize: 'var(--fluid-label)',
    fontWeight: 'var(--font-weight-medium)' as any,
    color: 'var(--muted-foreground)',
    marginBottom: 'var(--spacing-1)',
    display: 'block',
  };

  const inputWrapStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--input-background)',
    border: '1px solid var(--input-border)',
    borderRadius: 'var(--radius-md)',
    padding: '0 var(--spacing-3)',
    height: 'var(--input-height-md)',
    gap: 'var(--spacing-2)',
    transition: `border-color var(--motion-duration-short) var(--motion-easing-standard)`,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: 'var(--core-font-family-base)',
    fontSize: 'var(--fluid-body-sm)',
    color: 'var(--foreground)',
    height: '100%',
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '600px',
      fontFamily: 'var(--core-font-family-base)',
      background: 'var(--background)',
    }}>
      {/* Left panel — brand */}
      <div style={{
        width: '40%',
        minWidth: '280px',
        background: 'var(--surface-950)',
        padding: 'var(--spacing-12) var(--spacing-8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid var(--border)',
      }}>
        <div>
          <Logo brand="wugweb" state="icon" size="l" />
          <h1 style={{
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-h1)',
            fontWeight: 'var(--font-weight-bold)' as any,
            color: 'var(--foreground)',
            margin: 'var(--spacing-8) 0 var(--spacing-4) 0',
            lineHeight: 'var(--core-line-height-tight)',
          }}>
            Build better<br />design systems
          </h1>
          <p style={{
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-body-md)',
            color: 'var(--muted-foreground)',
            margin: 0,
            lineHeight: 'var(--core-line-height-relaxed)',
          }}>
            127+ production-ready components with a 4-layer CSS token system.
          </p>
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {[
            'CSS variable token system',
            'Fluid typography scale',
            'WCAG AA accessible',
            'Dark mode ready',
          ].map(feature => (
            <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Check size={10} color="var(--accent)" strokeWidth={3} />
              </div>
              <span style={{
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-sm)',
                color: 'var(--muted-foreground)',
              }}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        padding: 'var(--spacing-12) var(--spacing-8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '460px',
      }}>
        {step === 'sign-in' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-h2)',
                fontWeight: 'var(--font-weight-bold)' as any,
                color: 'var(--foreground)',
                margin: '0 0 var(--spacing-1) 0',
              }}>
                Welcome back
              </h2>
              <p style={{
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-md)',
                color: 'var(--muted-foreground)',
                margin: 0,
              }}>
                Sign in to your account
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <div style={inputWrapStyle}>
                  <Mail size={16} color="var(--muted-foreground)" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@email.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <div style={inputWrapStyle}>
                  <Lock size={16} color="var(--muted-foreground)" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                  <button
                    onClick={() => setShowPassword(s => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('verify')}
              style={{
                width: '100%',
                height: 'var(--btn-height-lg)',
                background: 'var(--accent)',
                color: 'var(--accent-foreground)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-2)',
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-md)',
                fontWeight: 'var(--font-weight-semibold)' as any,
              }}
            >
              Sign In <ArrowRight size={16} />
            </button>

            <p style={{
              margin: 0,
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-body-sm)',
              color: 'var(--muted-foreground)',
              textAlign: 'center',
            }}>
              Don't have an account?{' '}
              <button
                onClick={() => setStep('create-account')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: 'var(--core-font-family-base)',
                  fontSize: 'var(--fluid-body-sm)',
                  fontWeight: 'var(--font-weight-semibold)' as any,
                  color: 'var(--accent)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                Create one
              </button>
            </p>
          </div>
        )}

        {step === 'create-account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-h2)',
                fontWeight: 'var(--font-weight-bold)' as any,
                color: 'var(--foreground)',
                margin: '0 0 var(--spacing-1) 0',
              }}>
                Create account
              </h2>
              <p style={{
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-md)',
                color: 'var(--muted-foreground)',
                margin: 0,
              }}>
                Start your free 14-day trial today
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={inputWrapStyle}>
                  <User size={16} color="var(--muted-foreground)" />
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <div style={inputWrapStyle}>
                  <Mail size={16} color="var(--muted-foreground)" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={inputWrapStyle}>
                  <Lock size={16} color="var(--muted-foreground)" />
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" style={inputStyle} />
                  <button onClick={() => setShowPassword(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'var(--muted-foreground)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('verify')}
              style={{
                width: '100%',
                height: 'var(--btn-height-lg)',
                background: 'var(--accent)',
                color: 'var(--accent-foreground)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-2)',
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-md)',
                fontWeight: 'var(--font-weight-semibold)' as any,
              }}
            >
              Create Account <ArrowRight size={16} />
            </button>

            <p style={{ margin: 0, fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-body-sm)', color: 'var(--muted-foreground)', textAlign: 'center' }}>
              Already have an account?{' '}
              <button onClick={() => setStep('sign-in')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-body-sm)', fontWeight: 'var(--font-weight-semibold)' as any, color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                Sign in
              </button>
            </p>
          </div>
        )}

        {step === 'verify' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Check size={32} color="var(--accent-foreground)" strokeWidth={2.5} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-h2)', fontWeight: 'var(--font-weight-bold)' as any, color: 'var(--foreground)', margin: '0 0 var(--spacing-2) 0' }}>
                You're in!
              </h2>
              <p style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-body-md)', color: 'var(--muted-foreground)', margin: 0 }}>
                Check your email to verify your account and get started.
              </p>
            </div>
            <button
              onClick={() => setStep('sign-in')}
              style={{
                background: 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-3) var(--spacing-6)',
                cursor: 'pointer',
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-sm)',
                color: 'var(--muted-foreground)',
              }}
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

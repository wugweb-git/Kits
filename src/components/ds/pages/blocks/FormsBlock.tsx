import React from 'react';
import { BlockPageShell } from './BlockPageShell';
import { Button } from '../../../wugweb/Button';

const F = 'Inter Tight, sans-serif';

const inputStyle = (focused = false): React.CSSProperties => ({
  width: '100%', padding: 'var(--spacing-3) var(--spacing-4)', background: 'var(--input-background)',
  border: focused ? 'var(--border-focus)' : 'var(--border-default)', borderRadius: 'var(--input-radius)',
  color: 'var(--foreground)', fontSize: 'var(--ts-body-sm-size)', outline: 'none', fontFamily: F, boxSizing: 'border-box',
});
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 'var(--ts-label-md-size)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)', fontFamily: F,
};
const helperStyle: React.CSSProperties = { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-1)', fontFamily: F };

const Field = ({ label, type = 'text', placeholder = '', hint = '', required = false }: { label: string; type?: string; placeholder?: string; hint?: string; required?: boolean }) => (
  <div>
    <label style={labelStyle}>{label}{required && <span style={{ color: 'var(--destructive)', marginLeft: 3 }}>*</span>}</label>
    <input type={type} placeholder={placeholder} style={inputStyle()} />
    {hint && <p style={helperStyle}>{hint}</p>}
  </div>
);

const ContactForm = () => (
  <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', background: 'var(--background)' }}>
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--ts-h3-size)', fontWeight: 'var(--ts-h3-weight)', color: 'var(--foreground)', fontFamily: F }}>Get in touch</h2>
      <p style={{ margin: '0 0 var(--spacing-8)', fontSize: 'var(--ts-body-sm-size)', color: 'var(--muted-foreground)', fontFamily: F }}>We'll respond within 24 hours.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
          <Field label="First name" placeholder="Aisha" required />
          <Field label="Last name" placeholder="Mohammed" required />
        </div>
        <Field label="Email" type="email" placeholder="aisha@company.com" required />
        <Field label="Company" placeholder="Vercel" />
        <div>
          <label style={labelStyle}>Message <span style={{ color: 'var(--destructive)' }}>*</span></label>
          <textarea placeholder="Tell us about your project..." style={{ ...inputStyle(), minHeight: 120, resize: 'vertical' }} />
        </div>
        <Button variant="default" style={{ alignSelf: 'flex-start' }}>Send message</Button>
      </div>
    </div>
  </section>
);

const LoginForm = () => (
  <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', background: 'var(--background)', display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '100%', maxWidth: 400, background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-8)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-7)' }}>
        <div style={{ width: 44, height: 44, background: 'var(--accent)', borderRadius: 'var(--radius-lg)', margin: '0 auto var(--spacing-4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-foreground)', fontFamily: F }}>W</span>
        </div>
        <h2 style={{ margin: '0 0 var(--spacing-1)', fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>Sign in</h2>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F }}>Welcome back to Wugweb Kits</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <Field label="Email" type="email" placeholder="you@company.com" required />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-2)' }}>
            <label style={{ ...labelStyle, margin: 0 }}>Password <span style={{ color: 'var(--destructive)' }}>*</span></label>
            <a href="#" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontFamily: F, textDecoration: 'none' }}>Forgot password?</a>
          </div>
          <input type="password" placeholder="••••••••" style={inputStyle()} />
        </div>
        <Button variant="default" style={{ width: '100%', marginTop: 'var(--spacing-2)' }}>Sign in</Button>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F }}>Don't have an account? </span>
          <a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontFamily: F, textDecoration: 'none' }}>Sign up</a>
        </div>
      </div>
    </div>
  </section>
);

const MultiStepForm = () => {
  const steps = ['Account', 'Profile', 'Review'];
  return (
    <section style={{ padding: 'var(--core-spacing-16) var(--core-spacing-8)', background: 'var(--background)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', marginBottom: 'var(--spacing-8)' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: i === 0 ? 'var(--accent)' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: i === 0 ? 'var(--accent-foreground)' : 'var(--muted-foreground)', fontFamily: F }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: i === 0 ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)', color: i === 0 ? 'var(--foreground)' : 'var(--muted-foreground)', fontFamily: F }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-7)' }}>
          <h3 style={{ margin: '0 0 var(--spacing-5)', fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>Create your account</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Field label="Email" type="email" placeholder="you@company.com" required />
            <Field label="Password" type="password" placeholder="Min. 8 characters" hint="Use a mix of letters, numbers, and symbols." required />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-2)' }}>
              <Button variant="outline" disabled>← Back</Button>
              <Button variant="default">Continue →</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export function FormsBlock() {
  return (
    <BlockPageShell
      title="Form Blocks"
      description="Contact forms, login flows, multi-step wizards, and newsletter captures. Token-driven inputs with proper label, helper, and error states."
      category="Application UI"
      count={12}
      variants={[
        { id: 'contact', label: 'Contact form', preview: <ContactForm /> },
        { id: 'login', label: 'Login / Sign-in card', preview: <LoginForm /> },
        { id: 'multistep', label: 'Multi-step form', preview: <MultiStepForm /> },
      ]}
    />
  );
}

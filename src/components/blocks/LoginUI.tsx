import React, { useState } from 'react';
import {
  Mail, Lock, Eye, EyeOff, BedDouble, ShoppingCart,
  Users, Receipt, BarChart3, Settings,
} from 'lucide-react';
import { Logo } from '../wugweb/Logo';

const NAV_ITEMS = [
  { icon: BedDouble,    label: 'Rooms' },
  { icon: ShoppingCart, label: 'Orders' },
  { icon: Users,        label: 'Guests' },
  { icon: Receipt,      label: 'Billing' },
  { icon: BarChart3,    label: 'Reports' },
  { icon: Settings,     label: 'Settings' },
];

export function LoginUI() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1600);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '600px',
      fontFamily: 'var(--core-font-family-base)',
      background: 'var(--background)',
    }}>
      {/* Left: sidebar preview */}
      <div style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--surface-950)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--spacing-6)',
        gap: 'var(--spacing-6)',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <Logo brand="wugweb" state="icon" size="s" />
          <div>
            <p style={{
              margin: 0,
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-body-sm)',
              fontWeight: 'var(--font-weight-bold)' as any,
              color: 'var(--foreground)',
              lineHeight: 1.1,
            }}>
              Stayweb
            </p>
            <p style={{
              margin: 0,
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-caption)',
              color: 'var(--muted-foreground)',
              lineHeight: 1.1,
            }}>
              PMS Platform
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === 0;
            return (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--accent-subtle)' : 'transparent',
                  cursor: 'pointer',
                  opacity: isActive ? 1 : 0.5,
                }}
              >
                <Icon size={16} color={isActive ? 'var(--accent)' : 'var(--muted-foreground)'} />
                <span style={{
                  fontFamily: 'var(--core-font-family-base)',
                  fontSize: 'var(--fluid-body-sm)',
                  fontWeight: isActive ? 'var(--font-weight-semibold)' as any : 'var(--font-weight-regular)' as any,
                  color: isActive ? 'var(--accent)' : 'var(--muted-foreground)',
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right: login form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-8)',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-8)',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-h2)',
              fontWeight: 'var(--font-weight-bold)' as any,
              color: 'var(--foreground)',
              margin: '0 0 var(--spacing-1) 0',
            }}>
              Sign in to Stayweb
            </h2>
            <p style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--fluid-body-md)',
              color: 'var(--muted-foreground)',
              margin: 0,
            }}>
              Property management made simple.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
              <label style={{
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-label)',
                color: 'var(--muted-foreground)',
                fontWeight: 'var(--font-weight-medium)' as any,
              }}>
                Email address
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--input-background)',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0 var(--spacing-3)',
                height: 'var(--input-height-md)',
                gap: 'var(--spacing-2)',
              }}>
                <Mail size={16} color="var(--muted-foreground)" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@stayweb.io"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'var(--core-font-family-base)',
                    fontSize: 'var(--fluid-body-sm)',
                    color: 'var(--foreground)',
                    height: '100%',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
              <label style={{
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-label)',
                color: 'var(--muted-foreground)',
                fontWeight: 'var(--font-weight-medium)' as any,
              }}>
                Password
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--input-background)',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0 var(--spacing-3)',
                height: 'var(--input-height-md)',
                gap: 'var(--spacing-2)',
              }}>
                <Lock size={16} color="var(--muted-foreground)" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'var(--core-font-family-base)',
                    fontSize: 'var(--fluid-body-sm)',
                    color: 'var(--foreground)',
                    height: '100%',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: 'var(--btn-height-lg)',
                background: loading ? 'var(--muted)' : 'var(--accent)',
                color: loading ? 'var(--muted-foreground)' : 'var(--accent-foreground)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-md)',
                fontWeight: 'var(--font-weight-semibold)' as any,
                marginTop: 'var(--spacing-2)',
                transition: `background var(--motion-duration-fast) var(--motion-easing-standard)`,
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{
            margin: 0,
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-caption)',
            color: 'var(--muted-foreground)',
            textAlign: 'center',
          }}>
            Trouble logging in?{' '}
            <a href="#" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              Reset password
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

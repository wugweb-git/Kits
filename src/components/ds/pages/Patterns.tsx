import React, { useState } from 'react';
import { Card } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { Badge } from '../../design-system/components';
import { SocialButton } from '../../ui/social-button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { 
  User, Github, Twitter, 
  MoreHorizontal, BarChart3, ArrowUpRight, ArrowDownRight, Globe,
  Bell, Shield, Check,
  MessageSquare, Zap, Layout, Sparkles, Box, Command, 
  Figma, Slack, Hash, Disc
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';

// --- Internal Utilities for Documentation ---

const PatternHeader = ({ title, description }: { title: string, description: string }) => (
  <div style={{ marginBottom: 'var(--spacing-6)' }}>
    <h2 style={{
      fontFamily: 'var(--core-font-family-base)',
      fontSize: 'var(--fluid-h2)',
      fontWeight: 600,
      color: 'var(--foreground)',
      marginBottom: 'var(--spacing-2)',
      letterSpacing: '-0.02em'
    }}>
      {title}
    </h2>
    <p style={{
      fontFamily: 'var(--core-font-family-base)',
      fontSize: 'var(--fluid-body-lg)',
      color: 'var(--muted-foreground)',
      maxWidth: '48rem',
      lineHeight: 1.6
    }}>
      {description}
    </p>
  </div>
);

const ViewportControl = ({ isMobile, setMobile }: { isMobile: boolean, setMobile: (v: boolean) => void }) => (
  <div style={{
    display: 'flex',
    background: 'var(--surface-900)',
    padding: 'var(--spacing-1)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)'
  }}>
    <button
      onClick={() => setMobile(false)}
      style={{
        padding: 'var(--spacing-2) var(--spacing-3)',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--fluid-caption)',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        background: !isMobile ? 'var(--surface-700)' : 'transparent',
        color: !isMobile ? 'var(--foreground)' : 'var(--muted-foreground)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all var(--motion-duration-short) var(--motion-easing-standard)'
      }}
    >
      Desktop
    </button>
    <button
      onClick={() => setMobile(true)}
      style={{
        padding: 'var(--spacing-2) var(--spacing-3)',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--fluid-caption)',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        background: isMobile ? 'var(--surface-700)' : 'transparent',
        color: isMobile ? 'var(--foreground)' : 'var(--muted-foreground)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all var(--motion-duration-short) var(--motion-easing-standard)'
      }}
    >
      Mobile
    </button>
  </div>
);

interface PatternViewerProps {
  children: React.ReactNode | ((isMobile: boolean) => React.ReactNode);
}

const PatternViewer = ({ children }: PatternViewerProps) => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--surface-900)',
      marginBottom: 'var(--spacing-10)'
    }}>
      <div style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface-800)',
        padding: 'var(--spacing-3) var(--spacing-4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: 'var(--radius-full)', background: 'var(--border)', opacity: 0.5 }} />
          <div style={{ width: '12px', height: '12px', borderRadius: 'var(--radius-full)', background: 'var(--border)', opacity: 0.5 }} />
          <div style={{ width: '12px', height: '12px', borderRadius: 'var(--radius-full)', background: 'var(--border)', opacity: 0.5 }} />
        </div>
        <ViewportControl isMobile={isMobile} setMobile={setIsMobile} />
      </div>
      
      <div style={{
        background: 'var(--muted)',
        padding: 'var(--spacing-8)',
        overflowX: 'auto',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '400px',
        position: 'relative'
      }}>
        <div style={{
          width: isMobile ? '375px' : '100%',
          maxWidth: isMobile ? '375px' : '1000px',
          transition: 'all var(--motion-duration-long) var(--motion-easing-emphasized)',
          transformOrigin: 'top'
        }}>
          {typeof children === 'function' ? children(isMobile) : children}
        </div>
      </div>
    </div>
  );
};

export function Patterns() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
      
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-6)' }}>
        <h1 style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h1)',
          fontWeight: 700,
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-3)',
          letterSpacing: '-0.02em'
        }}>
          Pattern Composition
        </h1>
        <p style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-lg)',
          color: 'var(--muted-foreground)',
          maxWidth: '42rem',
          lineHeight: 1.6
        }}>
          Documentation illustrating the correct composition of existing design system components. 
          These examples demonstrate best practices for layout and hierarchy using only strict system tokens and unmodified components.
        </p>
      </div>

      {/* 1. Authentication */}
      <section>
        <PatternHeader 
          title="Authentication Composition" 
          description="Demonstrates the standard vertical stacking of Input and Button components within a restricted-width Card. Uses standard spacing tokens to create visual rhythm between form elements."
        />
        <PatternViewer>
          <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-6)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--core-shadow-md)'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--surface-600)' }} />
              
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)', paddingTop: 'var(--spacing-4)' }}>
                <div style={{
                  width: '64px', height: '64px',
                  background: 'var(--surface-900)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--spacing-4)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <User size={32} style={{ color: 'var(--foreground)', opacity: 0.9 }} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--core-font-family-base)',
                  fontSize: 'var(--fluid-h3)',
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)'
                }}>
                  Welcome back
                </h3>
                <p style={{
                  fontFamily: 'var(--core-font-family-base)',
                  fontSize: 'var(--fluid-body-sm)',
                  color: 'var(--muted-foreground)',
                  maxWidth: '80%',
                  margin: '0 auto'
                }}>
                  Enter your credentials to access your account.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <label style={{
                    fontFamily: 'var(--core-font-family-base)',
                    fontSize: 'var(--fluid-label)',
                    fontWeight: 500,
                    color: 'var(--foreground)'
                  }}>
                    Email
                  </label>
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    style={{
                      background: 'var(--surface-950)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--foreground)',
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      fontFamily: 'var(--core-font-family-base)',
                      fontSize: 'var(--fluid-body-md)'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <label style={{
                    fontFamily: 'var(--core-font-family-base)',
                    fontSize: 'var(--fluid-label)',
                    fontWeight: 500,
                    color: 'var(--foreground)'
                  }}>
                    Password
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    style={{
                      background: 'var(--surface-950)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--foreground)',
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      fontFamily: 'var(--core-font-family-base)',
                      fontSize: 'var(--fluid-body-md)'
                    }}
                  />
                </div>

                <div style={{ paddingTop: 'var(--spacing-2)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <Button fullWidth size="md" variant="primary">
                    Sign In
                  </Button>
                  
                  <div style={{ textAlign: 'center' }}>
                    <a href="#" style={{
                      fontFamily: 'var(--core-font-family-base)',
                      fontSize: 'var(--fluid-body-sm)',
                      color: 'var(--accent)',
                      fontWeight: 500,
                      textDecoration: 'none'
                    }}>
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div style={{ position: 'relative', padding: 'var(--spacing-4) 0', textAlign: 'center' }}>
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid var(--border)' }} />
                  <span style={{
                    position: 'relative',
                    background: 'var(--card)',
                    padding: '0 var(--spacing-3)',
                    fontFamily: 'var(--core-font-family-base)',
                    fontSize: 'var(--fluid-caption)',
                    color: 'var(--muted-foreground)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 500
                  }}>
                    Or continue with
                  </span>
                </div>

                <SocialButton 
                  variant="outline" 
                  className="w-full justify-center h-12 md:h-11 text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-700)] hover:text-[var(--foreground)] transition-colors"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  }
                >
                  Sign in with Google
                </SocialButton>
              </div>

              <div style={{
                marginTop: 'var(--spacing-8)',
                textAlign: 'center',
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-sm)',
                color: 'var(--muted-foreground)'
              }}>
                Don't have an account? <a href="#" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none', marginLeft: '4px' }}>Sign up</a>
              </div>
            </div>
          </div>
        </PatternViewer>
      </section>

      {/* 2. User Profile */}
      <section>
        <PatternHeader 
          title="Content Hierarchy Layout" 
          description="An example of establishing visual hierarchy using the Card component. Content is organized using standard flex layouts, with Badge components providing metadata without altering component internals."
        />
        <PatternViewer>
          <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
            <div style={{
              background: 'var(--surface-900)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--core-shadow-lg)'
            }}>
              <div style={{ height: '128px', background: 'var(--surface-950)', position: 'relative', borderBottom: '1px solid var(--border)' }}>
                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, var(--surface-900), transparent)', opacity: 0.5 }} />
              </div>
              
              <div style={{ padding: '0 var(--spacing-6) var(--spacing-6) var(--spacing-6)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-48px', marginBottom: 'var(--spacing-3)' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '96px', height: '96px',
                      borderRadius: 'var(--radius-full)',
                      border: '4px solid var(--surface-900)',
                      background: 'var(--surface-800)',
                      overflow: 'hidden',
                      boxShadow: 'var(--core-shadow-sm)'
                    }}>
                      <ImageWithFallback 
                        src="figma:asset/714473b3945ef2c290e1deafb7887474feaaf953.png" 
                        alt="Alex Morgan" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{
                      position: 'absolute', bottom: '4px', right: '4px',
                      width: '20px', height: '20px',
                      background: 'var(--success)',
                      border: '3px solid var(--surface-900)',
                      borderRadius: 'var(--radius-full)'
                    }} />
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: '4px' }}>
                    <Button variant="outline" size="sm" style={{ padding: '0 8px' }}>
                       <MoreHorizontal size={18} />
                    </Button>
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--spacing-5)' }}>
                  <h3 style={{
                    fontFamily: 'var(--core-font-family-base)',
                    fontSize: 'var(--ts-h4-size)',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    marginBottom: 'var(--spacing-1)'
                  }}>
                    Alex Morgan
                  </h3>
                  <p style={{
                    fontFamily: 'var(--core-font-family-base)',
                    fontSize: 'var(--fluid-body-md)',
                    color: 'var(--muted-foreground)'
                  }}>
                    Product Designer
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' }}>
                  <Badge label="Design" tone="neutral" style="subtle" />
                  <Badge label="New York" tone="neutral" style="subtle" />
                  <Badge label="Pro" tone="success" style="subtle" />
                </div>

                <div style={{ height: '1px', background: 'var(--border)', marginBottom: 'var(--spacing-5)' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>
                    <span style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-body-sm)', width: '16px', textAlign: 'center', fontWeight: 500 }}>@</span> 
                    <span style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-body-sm)' }}>alex@example.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>
                    <Globe size={16} /> 
                    <span style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-body-sm)' }}>wugweb.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>
                    <Check size={16} /> 
                    <span style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-body-sm)' }}>Joined Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PatternViewer>
      </section>

      {/* 3. Dashboard Grid */}
      <section>
        <PatternHeader 
          title="Grid Layout Composition" 
          description="Utilizes CSS Grid with system spacing tokens to arrange standard Card components. Text colors adhere to semantic system tokens (success/destructive) rather than arbitrary hex values."
        />
        <PatternViewer>
          {(isMobile: boolean) => (
            <div style={{
              display: 'grid',
              gap: 'var(--spacing-4)',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))'
            }}>
              {[
                { label: 'Revenue', value: '$24,500', trend: '+12%', up: true, icon: BarChart3 },
                { label: 'Users', value: '1,234', trend: '+5%', up: true, icon: User },
                { label: 'Bounce Rate', value: '42%', trend: '-2%', up: false, icon: ArrowUpRight },
                { label: 'Active', value: '573', trend: '+8%', up: true, icon: Globe },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'var(--surface-900)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--spacing-5)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--core-shadow-sm)'
                }}>
                  <div style={{ marginBottom: 'var(--spacing-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
                      <span style={{
                        fontFamily: 'var(--core-font-family-base)',
                        fontSize: 'var(--fluid-body-sm)',
                        color: 'var(--muted-foreground)',
                        fontWeight: 500,
                        letterSpacing: '0.02em'
                      }}>
                        {item.label}
                      </span>
                      <item.icon size={16} style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                    <div style={{
                      fontFamily: 'var(--core-font-family-base)',
                      fontSize: 'var(--fluid-h2)',
                      fontWeight: 700,
                      color: 'var(--foreground)',
                      letterSpacing: '-0.02em'
                    }}>
                      {item.value}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--core-font-family-base)',
                    fontSize: 'var(--fluid-caption)',
                    fontWeight: 500,
                    color: item.up ? 'var(--success)' : 'var(--destructive)'
                  }}>
                    {item.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{item.trend}</span>
                    <span style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>vs last month</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PatternViewer>
      </section>

    </div>
  );
}

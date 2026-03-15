import React from 'react';
import { Logo } from '../../wugweb/Logo';

export function LogoShowcase() {
  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: 'Inter Tight, sans-serif',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <h1 style={{ 
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-2)',
          margin: 0,
        }}>
          Logo Showcase
        </h1>
        <p style={{ 
          fontSize: 'var(--text-lg)',
          color: 'var(--muted-foreground)',
          margin: 0,
          marginTop: 'var(--spacing-2)',
        }}>
          All Wugweb brand logos and variants
        </p>
      </div>

      {/* Full Logos Section */}
      <div style={{ 
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-3)',
        padding: 'var(--spacing-6)',
        marginBottom: 'var(--spacing-6)',
      }}>
        <h2 style={{ 
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-2)',
          margin: 0,
        }}>
          Full Logos
        </h2>
        <p style={{ 
          fontSize: 'var(--text-sm)',
          color: 'var(--muted-foreground)',
          marginBottom: 'var(--spacing-5)',
          margin: 0,
          marginTop: 'var(--spacing-2)',
        }}>
          Complete wordmark with icon for headers, navigation, and primary branding
        </p>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-4)',
        }}>
          {/* Wugweb */}
          <div style={{ 
            padding: 'var(--spacing-5)',
            backgroundColor: '#0A0A0A',
            borderRadius: 'var(--radius-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-5)' }}>
              <Logo brand="wugweb" state="full" size="l" theme="dark" container="no" />
            </div>
            <p style={{ 
              fontSize: 'var(--text-sm)',
              color: '#999',
              textAlign: 'center',
              margin: 0,
            }}>
              Wugweb <span style={{ color: '#FFBE1A' }}>●</span>
            </p>
          </div>

          {/* Stayweb */}
          <div style={{ 
            padding: 'var(--spacing-5)',
            backgroundColor: '#0A0A0A',
            borderRadius: 'var(--radius-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-5)' }}>
              <Logo brand="stayweb" state="full" size="l" theme="dark" container="no" />
            </div>
            <p style={{ 
              fontSize: 'var(--text-sm)',
              color: '#999',
              textAlign: 'center',
              margin: 0,
            }}>
              Stayweb <span style={{ color: '#3B82F6' }}>●</span>
            </p>
          </div>

          {/* Nookweb */}
          <div style={{ 
            padding: 'var(--spacing-5)',
            backgroundColor: '#0A0A0A',
            borderRadius: 'var(--radius-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-5)' }}>
              <Logo brand="nookweb" state="full" size="l" theme="dark" container="no" />
            </div>
            <p style={{ 
              fontSize: 'var(--text-sm)',
              color: '#999',
              textAlign: 'center',
              margin: 0,
            }}>
              Nookweb <span style={{ color: '#10B981' }}>●</span>
            </p>
          </div>

          {/* Docweb */}
          <div style={{ 
            padding: 'var(--spacing-5)',
            backgroundColor: '#0A0A0A',
            borderRadius: 'var(--radius-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-5)' }}>
              <Logo brand="docweb" state="full" size="l" theme="dark" container="no" />
            </div>
            <p style={{ 
              fontSize: 'var(--text-sm)',
              color: '#999',
              textAlign: 'center',
              margin: 0,
            }}>
              Docweb <span style={{ color: '#8B5CF6' }}>●</span>
            </p>
          </div>

          {/* Kits */}
          <div style={{ 
            padding: 'var(--spacing-5)',
            backgroundColor: '#0A0A0A',
            borderRadius: 'var(--radius-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-5)' }}>
              <Logo brand="kits" state="full" size="l" theme="dark" container="no" />
            </div>
            <p style={{ 
              fontSize: 'var(--text-sm)',
              color: '#999',
              textAlign: 'center',
              margin: 0,
            }}>
              Kits <span style={{ color: '#F59E0B' }}>●</span>
            </p>
          </div>
        </div>

        {/* Full Logo Sizes */}
        <div style={{ marginTop: 'var(--spacing-6)' }}>
          <h3 style={{ 
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-4)',
            margin: 0,
          }}>
            Available Sizes
          </h3>
          
          <div style={{ 
            padding: 'var(--spacing-5)',
            backgroundColor: '#0A0A0A',
            borderRadius: 'var(--radius-2)',
            display: 'flex',
            gap: 'var(--spacing-6)',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
              <Logo brand="wugweb" state="full" size="s" theme="dark" container="no" />
              <p style={{ fontSize: 'var(--text-xs)', color: '#666', margin: 0 }}>Small (20px)</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
              <Logo brand="wugweb" state="full" size="m" theme="dark" container="no" />
              <p style={{ fontSize: 'var(--text-xs)', color: '#666', margin: 0 }}>Medium (28px)</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
              <Logo brand="wugweb" state="full" size="l" theme="dark" container="no" />
              <p style={{ fontSize: 'var(--text-xs)', color: '#666', margin: 0 }}>Large (38px)</p>
            </div>
          </div>
        </div>

        {/* Theme Variants */}
        <div style={{ marginTop: 'var(--spacing-6)' }}>
          <h3 style={{ 
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-4)',
            margin: 0,
          }}>
            Theme Support
          </h3>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-4)',
          }}>
            <div style={{ 
              padding: 'var(--spacing-5)',
              backgroundColor: '#0A0A0A',
              borderRadius: 'var(--radius-2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)',
              alignItems: 'center',
            }}>
              <Logo brand="stayweb" state="full" size="l" theme="dark" container="no" />
              <p style={{ fontSize: 'var(--text-xs)', color: '#666', margin: 0 }}>
                Dark (Icon always white + accent)
              </p>
            </div>

            <div style={{ 
              padding: 'var(--spacing-5)',
              backgroundColor: '#FAFAFA',
              borderRadius: 'var(--radius-2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)',
              alignItems: 'center',
            }}>
              <Logo brand="stayweb" state="full" size="l" theme="light" container="no" />
              <p style={{ fontSize: 'var(--text-xs)', color: '#999', margin: 0 }}>
                Light (Icon always white + accent)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Icon-Only Section */}
      <div style={{ 
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-3)',
        padding: 'var(--spacing-6)',
        marginBottom: 'var(--spacing-6)',
      }}>
        <h2 style={{ 
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-2)',
          margin: 0,
        }}>
          Icon-Only
        </h2>
        <p style={{ 
          fontSize: 'var(--text-sm)',
          color: 'var(--muted-foreground)',
          marginBottom: 'var(--spacing-5)',
          margin: 0,
          marginTop: 'var(--spacing-2)',
        }}>
          Compact mark for favicons, app icons, and small spaces (always on dark background)
        </p>
        
        {/* All Icon Brands */}
        <div style={{ 
          display: 'flex',
          gap: 'var(--spacing-4)',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 'var(--spacing-6)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
            <Logo brand="wugweb" state="icon" size="l" theme="dark" container="yes" />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', margin: 0 }}>Wugweb</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
            <Logo brand="stayweb" state="icon" size="l" theme="dark" container="yes" />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', margin: 0 }}>Stayweb</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
            <Logo brand="nookweb" state="icon" size="l" theme="dark" container="yes" />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', margin: 0 }}>Nookweb</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
            <Logo brand="docweb" state="icon" size="l" theme="dark" container="yes" />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', margin: 0 }}>Docweb</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
            <Logo brand="kits" state="icon" size="l" theme="dark" container="yes" />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', margin: 0 }}>Kits</p>
          </div>
        </div>

        {/* Icon Sizes */}
        <div>
          <h3 style={{ 
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-4)',
            margin: 0,
          }}>
            Available Sizes
          </h3>
          
          <div style={{ 
            display: 'flex',
            gap: 'var(--spacing-5)',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
              <Logo brand="wugweb" state="icon" size="s" theme="dark" container="yes" />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', margin: 0 }}>Small (24×18)</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
              <Logo brand="wugweb" state="icon" size="m" theme="dark" container="yes" />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', margin: 0 }}>Medium (32×24)</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
              <Logo brand="wugweb" state="icon" size="l" theme="dark" container="yes" />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', margin: 0 }}>Large (40×30)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Note */}
      <div style={{ 
        backgroundColor: 'var(--muted)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-2)',
        padding: 'var(--spacing-4)',
      }}>
        <p style={{ 
          fontSize: 'var(--text-sm)',
          color: 'var(--muted-foreground)',
          margin: 0,
          lineHeight: '1.6',
        }}>
          <strong style={{ color: 'var(--foreground)' }}>Note:</strong> The W icon always uses white + brand accent colors (never changes with theme). Full logos respect theme for text portions only.
        </p>
      </div>
    </div>
  );
}

import React from 'react';
import { Copy, Check, ChevronRight, Info, FileCode, Monitor, Tablet, Smartphone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Header, HeaderNavItem, WugwebLogo, ContactIcon } from '../../wugweb/Header';

export function HeaderDoc() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeNav, setActiveNav] = React.useState<string>('#about');
  const [showAllVariants, setShowAllVariants] = React.useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(label);
      toast.success(`Copied ${label}`);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const navItems: HeaderNavItem[] = [
    { label: 'About', href: '#about', active: activeNav === '#about' },
    { label: 'Services', href: '#services', active: activeNav === '#services' },
    { label: 'Work', href: '#work', active: activeNav === '#work' },
    { label: 'Blog', href: '#blog', active: activeNav === '#blog' },
    { label: 'Contact', href: '#contact', active: activeNav === '#contact' },
  ];

  const tokens = [
    { name: 'Header Background', token: '--surface-800', value: 'rgba(28, 28, 28, 1.00)', category: 'Color' },
    { name: 'Nav Item Background', token: '--background', value: 'rgba(18, 18, 18, 1.00)', category: 'Color' },
    { name: 'Nav Item Hover', token: '--surface-700', value: 'rgba(38, 38, 38, 1.00)', category: 'Color' },
    { name: 'Nav Item Active', token: '--surface-700', value: 'rgba(38, 38, 38, 1.00)', category: 'Color' },
    { name: 'Header Border', token: '--border', value: 'rgba(43, 43, 43, 1.00)', category: 'Color' },
    { name: 'Header Text', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'CTA Background', token: '--accent', value: 'rgba(255, 190, 26, 1.00)', category: 'Color' },
    { name: 'CTA Text', token: '--accent-foreground', value: 'rgba(18, 18, 18, 1.00)', category: 'Color' },
    { name: 'Header Radius', token: '--radius-lg', value: '12px', category: 'Radius' },
    { name: 'Nav Item Radius', token: '--radius-md', value: '8px', category: 'Radius' },
    { name: 'Container Padding', token: '--spacing-2', value: '16px', category: 'Spacing' },
    { name: 'Nav Gap', token: '--spacing-2', value: '16px', category: 'Spacing' },
    { name: 'Motion Duration', token: '--motion-duration-normal', value: '120ms', category: 'Motion' },
    { name: 'Motion Easing', token: '--motion-easing-standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)', category: 'Motion' },
  ];

  const reactCode = `import { Header } from './components/wugweb/Header';

function MyApp() {
  const navItems = [
    { label: 'About', href: '#about', active: true },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <Header
      navItems={navItems}
      ctaText="Let's Talk"
      variant="${selectedVariant}"
      onNavClick={(href) => handleNavigation(href)}
      onCtaClick={() => handleCTA()}
    />
  );
}`;

  const htmlCode = `<header class="header-container">
  <!-- Floating Header Container -->
  <div class="header-inner">
    <!-- Logo Section -->
    <div class="header-logo">
      <svg class="wugweb-logo" viewBox="0 0 100 26">
        <!-- Logo paths -->
      </svg>
    </div>

    <!-- Desktop Navigation -->
    <nav class="header-nav" role="navigation" aria-label="Main navigation">
      <a href="#about" class="nav-item active" aria-current="page">About</a>
      <a href="#services" class="nav-item">Services</a>
      <a href="#work" class="nav-item">Work</a>
      <a href="#blog" class="nav-item">Blog</a>
      <a href="#contact" class="nav-item">Contact</a>
      
      <!-- CTA Button -->
      <button class="header-cta">
        <svg class="cta-icon"><!-- Icon --></svg>
        <span>Let's Talk</span>
      </button>
    </nav>

    <!-- Mobile Hamburger -->
    <button 
      class="header-hamburger" 
      aria-label="Toggle menu"
      aria-expanded="false"
    >
      <svg><!-- Menu Icon --></svg>
    </button>
  </div>

  <!-- Mobile Menu (hidden by default) -->
  <div class="header-mobile-menu" hidden>
    <a href="#about" class="nav-item-mobile">About</a>
    <a href="#services" class="nav-item-mobile">Services</a>
    <!-- More items... -->
    <button class="header-cta-mobile">Let's Talk</button>
  </div>
</header>`;

  const cssCode = `.header-container {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-5);
  font-family: Inter Tight, sans-serif;
}

/* Floating Header - matches Figma import */
.header-inner {
  background: var(--surface-800);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
}

/* Logo */
.header-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 120px;
}

.wugweb-logo {
  width: 100px;
  height: 25.222px;
}

/* Navigation */
.header-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex: 1;
  justify-content: flex-end;
}

/* Nav Items */
.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 8px var(--spacing-2);
  background: var(--background);
  border: 1px solid var(--background);
  border-radius: var(--radius-md);
  color: var(--foreground);
  font-size: var(--text-base);
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  transition: all var(--motion-duration-normal) var(--motion-easing-standard);
  white-space: nowrap;
}

.nav-item:hover,
.nav-item.active {
  background: var(--surface-700);
  border-color: var(--border);
}

/* CTA Button */
.header-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);
  height: 44px;
  padding: 8px var(--spacing-2);
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  color: var(--accent-foreground);
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  transition: all var(--motion-duration-normal) var(--motion-easing-standard);
}

.header-cta:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Mobile Menu */
.header-hamburger {
  display: none;
}

.header-mobile-menu {
  margin-top: var(--spacing-2);
  background: var(--surface-800);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2);
  animation: slideDown var(--motion-duration-normal) var(--motion-easing-decelerate);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .header-container {
    padding: var(--spacing-2) var(--spacing-3);
  }
  
  .nav-item {
    padding: 8px 10px;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: var(--spacing-2);
  }
  
  .header-nav {
    display: none;
  }
  
  .header-hamburger {
    display: flex;
    width: 48px;
    height: 48px;
  }
}`;

  return (
    <>
      {/* Responsive Styles */}
      <style>{`
        .header-doc-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0;
          font-family: Inter Tight, sans-serif;
        }

        .header-doc-section {
          margin-bottom: var(--spacing-8);
        }

        .header-doc-card {
          background: var(--surface-800);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-6);
        }

        .header-doc-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-6);
        }

        .header-doc-grid-auto {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-4);
        }

        .header-doc-token-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-3);
        }

        .header-doc-variant-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-5);
        }

        /* Tablet - 768px to 1024px */
        @media (max-width: 1024px) {
          .header-doc-grid-2 {
            grid-template-columns: 1fr;
            gap: var(--spacing-5);
          }
          
          .header-doc-card {
            padding: var(--spacing-5);
          }
          
          .header-doc-token-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
        }

        /* Mobile - up to 768px */
        @media (max-width: 768px) {
          .header-doc-section {
            margin-bottom: var(--spacing-6);
          }

          .header-doc-card {
            padding: var(--spacing-4);
          }

          .header-doc-grid-2,
          .header-doc-grid-auto {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }

          .header-doc-token-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-2);
          }

          h1 {
            font-size: var(--text-2xl) !important;
          }

          h2 {
            font-size: var(--text-xl) !important;
          }

          h3 {
            font-size: var(--text-lg) !important;
          }
        }

        /* Extra small mobile - up to 480px */
        @media (max-width: 480px) {
          .header-doc-card {
            padding: var(--spacing-3);
          }

          .header-doc-section {
            margin-bottom: var(--spacing-5);
          }
        }
      `}</style>

      <div className="header-doc-container">
        
        {/* Header */}
        <header style={{
          marginBottom: 'var(--spacing-8)',
          paddingBottom: 'var(--spacing-6)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            marginBottom: 'var(--spacing-3)',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
          }}>
            <span>Components</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--foreground)' }}>Header</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--spacing-4)',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: '1 1 300px', minWidth: 0 }}>
              <h1 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                margin: 0,
                marginBottom: 'var(--spacing-2)',
                color: 'var(--foreground)',
              }}>
                Header / Navigation Bar
              </h1>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--muted-foreground)',
                margin: 0,
                lineHeight: '1.6',
              }}>
                A floating navigation header with logo, navigation links, and CTA button. Responsive across desktop, tablet, and mobile with hamburger menu. Built from real Figma component instance.
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--spacing-2)',
              flexWrap: 'wrap',
            }}>
              <div style={{
                display: 'inline-flex',
                padding: '8px 16px',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--accent)',
                flexShrink: 0,
              }}>
                v1.0.0
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
                padding: '8px 16px',
                background: 'var(--success-subtle)',
                border: '1px solid var(--success)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--success)',
                flexShrink: 0,
              }}>
                <FileCode size={14} />
                Figma Import
              </div>
            </div>
          </div>
        </header>

        {/* Component Variants Gallery */}
        <section className="header-doc-section">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-5)',
            flexWrap: 'wrap',
            gap: 'var(--spacing-3)',
          }}>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-semibold)',
              margin: 0,
              color: 'var(--foreground)',
            }}>
              Component Variants
            </h2>
            <button
              onClick={() => setShowAllVariants(!showAllVariants)}
              style={{
                padding: '8px 16px',
                fontSize: 'var(--text-sm)',
                fontFamily: 'Inter Tight, sans-serif',
                fontWeight: 'var(--font-weight-medium)',
                background: showAllVariants ? 'var(--accent)' : 'var(--surface-700)',
                color: showAllVariants ? 'var(--accent-foreground)' : 'var(--foreground)',
                border: '1px solid',
                borderColor: showAllVariants ? 'var(--accent)' : 'var(--border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
              }}
            >
              {showAllVariants ? 'Show Single' : 'Show All Variants'}
            </button>
          </div>

          <div className="header-doc-card">
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              margin: 0,
              marginBottom: 'var(--spacing-5)',
              lineHeight: '1.6',
            }}>
              This component was imported from Figma. Below are all detected variants including responsive breakpoints and states.
            </p>

            {showAllVariants ? (
              <div className="header-doc-variant-grid">
                {/* Desktop Variant */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    marginBottom: 'var(--spacing-3)',
                  }}>
                    <Monitor size={18} style={{ color: 'var(--accent)' }} />
                    <h3 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      margin: 0,
                      color: 'var(--foreground)',
                    }}>
                      Desktop (1024px+)
                    </h3>
                  </div>
                  <div style={{
                    background: 'var(--surface-900)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--spacing-4)',
                    overflow: 'auto',
                  }}>
                    <Header
                      navItems={navItems}
                      ctaText="Let's Talk"
                      variant="desktop"
                      onNavClick={(href) => setActiveNav(href)}
                      onCtaClick={() => toast.success('CTA clicked!')}
                    />
                  </div>
                </div>

                {/* Tablet Variant */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    marginBottom: 'var(--spacing-3)',
                  }}>
                    <Tablet size={18} style={{ color: 'var(--accent)' }} />
                    <h3 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      margin: 0,
                      color: 'var(--foreground)',
                    }}>
                      Tablet (768px - 1024px)
                    </h3>
                  </div>
                  <div style={{
                    background: 'var(--surface-900)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--spacing-4)',
                    overflow: 'auto',
                  }}>
                    <Header
                      navItems={navItems}
                      ctaText="Let's Talk"
                      variant="tablet"
                      onNavClick={(href) => setActiveNav(href)}
                      onCtaClick={() => toast.success('CTA clicked!')}
                    />
                  </div>
                </div>

                {/* Mobile Variant */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    marginBottom: 'var(--spacing-3)',
                  }}>
                    <Smartphone size={18} style={{ color: 'var(--accent)' }} />
                    <h3 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      margin: 0,
                      color: 'var(--foreground)',
                    }}>
                      Mobile (&lt;768px)
                    </h3>
                  </div>
                  <div style={{
                    background: 'var(--surface-900)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--spacing-4)',
                    maxWidth: '400px',
                  }}>
                    <Header
                      navItems={navItems}
                      ctaText="Let's Talk"
                      variant="mobile"
                      onNavClick={(href) => setActiveNav(href)}
                      onCtaClick={() => toast.success('CTA clicked!')}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--surface-900)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-6)',
                overflow: 'auto',
              }}>
                <Header
                  navItems={navItems}
                  ctaText="Let's Talk"
                  variant={selectedVariant}
                  onNavClick={(href) => setActiveNav(href)}
                  onCtaClick={() => toast.success('CTA clicked!')}
                />
              </div>
            )}
          </div>
        </section>

        {/* Anatomy Section */}
        <section className="header-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Anatomy
          </h2>

          <div className="header-doc-card">
            <div className="header-doc-grid-2">
              {/* Visual Anatomy */}
              <div>
                <div style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-4)',
                }}>
                  Header Structure (Figma Import)
                </div>

                {/* Anatomical Breakdown */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-4)',
                }}>
                  {/* Logo Component */}
                  <div style={{
                    padding: 'var(--spacing-4)',
                    background: 'var(--surface-900)',
                    border: '2px dashed var(--accent)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--accent)',
                      marginBottom: 'var(--spacing-2)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      Logo Component
                    </div>
                    <WugwebLogo />
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--muted-foreground)',
                      marginTop: 'var(--spacing-2)',
                    }}>
                      100px × 25.222px SVG
                    </div>
                  </div>

                  {/* Nav Item Component */}
                  <div style={{
                    padding: 'var(--spacing-4)',
                    background: 'var(--surface-900)',
                    border: '2px dashed var(--accent)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--accent)',
                      marginBottom: 'var(--spacing-2)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      Navigation Item
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: 'var(--spacing-2)',
                    }}>
                      <button style={{
                        height: '48px',
                        padding: '8px var(--spacing-2)',
                        background: 'var(--background)',
                        border: '1px solid var(--background)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-base)',
                        cursor: 'pointer',
                      }}>
                        Default
                      </button>
                      <button style={{
                        height: '48px',
                        padding: '8px var(--spacing-2)',
                        background: 'var(--surface-700)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-base)',
                        cursor: 'pointer',
                      }}>
                        Active
                      </button>
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--muted-foreground)',
                      marginTop: 'var(--spacing-2)',
                    }}>
                      48px height, 8px radius
                    </div>
                  </div>

                  {/* CTA Component */}
                  <div style={{
                    padding: 'var(--spacing-4)',
                    background: 'var(--surface-900)',
                    border: '2px dashed var(--accent)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--accent)',
                      marginBottom: 'var(--spacing-2)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      CTA Button (Quote)
                    </div>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-1)',
                      height: '44px',
                      padding: '8px var(--spacing-2)',
                      background: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--accent-foreground)',
                      fontSize: 'var(--text-base)',
                      cursor: 'pointer',
                    }}>
                      <ContactIcon />
                      <span>Let's Talk</span>
                    </button>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--muted-foreground)',
                      marginTop: 'var(--spacing-2)',
                    }}>
                      44px height, icon + text
                    </div>
                  </div>
                </div>
              </div>

              {/* Anatomy Labels */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)',
              }}>
                <AnatomyItem
                  label="Floating Header Container"
                  description="Main wrapper with rounded corners, dark background"
                  token="var(--surface-800), border-radius: var(--radius-lg)"
                />
                <AnatomyItem
                  label="Logo (Wugweb)"
                  description="Left-aligned SVG logo, 100px width"
                  token="Width: 120px container, Height: 48px"
                />
                <AnatomyItem
                  label="Menu Links Container"
                  description="Flex container with 12px gap between items"
                  token="gap: var(--spacing-2)"
                />
                <AnatomyItem
                  label="Navigation Items"
                  description="Buttons with hover and active states"
                  token="Height: 48px, Radius: var(--radius-md)"
                />
                <AnatomyItem
                  label="Active State"
                  description="Dark background with border"
                  token="var(--surface-700), border: var(--border)"
                />
                <AnatomyItem
                  label="CTA Button (Quote)"
                  description="Accent-colored button with contact icon"
                  token="Height: 44px, Background: var(--accent)"
                />
                <AnatomyItem
                  label="Container Padding"
                  description="12px internal padding"
                  token="padding: var(--spacing-2)"
                />
                <AnatomyItem
                  label="Mobile Hamburger"
                  description="48px square button, visible only on mobile"
                  token="display: none on desktop"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Preview */}
        <section className="header-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Interactive Preview
          </h2>

          <div className="header-doc-card">
            {/* Controls */}
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-4)',
              marginBottom: 'var(--spacing-5)',
              flexWrap: 'wrap',
            }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Breakpoint
                </label>
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-1)',
                  flexWrap: 'wrap',
                }}>
                  {(['desktop', 'tablet', 'mobile'] as const).map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      style={{
                        padding: '8px 16px',
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'Inter Tight, sans-serif',
                        fontWeight: 'var(--font-weight-medium)',
                        background: selectedVariant === variant ? 'var(--accent)' : 'var(--surface-700)',
                        color: selectedVariant === variant ? 'var(--accent-foreground)' : 'var(--foreground)',
                        border: '1px solid',
                        borderColor: selectedVariant === variant ? 'var(--accent)' : 'var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ flex: '1 1 300px' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Active Page
                </label>
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-1)',
                  flexWrap: 'wrap',
                }}>
                  {navItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => setActiveNav(item.href)}
                      style={{
                        padding: '8px 12px',
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'Inter Tight, sans-serif',
                        fontWeight: 'var(--font-weight-medium)',
                        background: activeNav === item.href ? 'var(--accent)' : 'var(--surface-700)',
                        color: activeNav === item.href ? 'var(--accent-foreground)' : 'var(--foreground)',
                        border: '1px solid',
                        borderColor: activeNav === item.href ? 'var(--accent)' : 'var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Display */}
            <div style={{
              background: 'var(--surface-900)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-6)',
              overflow: 'auto',
            }}>
              <Header
                navItems={navItems}
                ctaText="Let's Talk"
                variant={selectedVariant}
                onNavClick={(href) => setActiveNav(href)}
                onCtaClick={() => toast.success('CTA clicked!')}
              />
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="header-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Code Examples
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-3)',
          }}>
            <CodeBlock
              title="React"
              code={reactCode}
              language="tsx"
              copied={copiedCode === 'React code'}
              onCopy={() => copyToClipboard(reactCode, 'React code')}
            />

            <CodeBlock
              title="HTML"
              code={htmlCode}
              language="html"
              copied={copiedCode === 'HTML code'}
              onCopy={() => copyToClipboard(htmlCode, 'HTML code')}
            />

            <CodeBlock
              title="CSS with Design Tokens"
              code={cssCode}
              language="css"
              copied={copiedCode === 'CSS code'}
              onCopy={() => copyToClipboard(cssCode, 'CSS code')}
            />
          </div>
        </section>

        {/* Design Tokens */}
        <section className="header-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Design Tokens
          </h2>

          <div className="header-doc-card">
            <div className="header-doc-token-grid">
              {tokens.map((token) => (
                <button
                  key={token.name}
                  onClick={() => copyToClipboard(`var(${token.token})`, token.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-4)',
                    background: 'var(--surface-900)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.background = 'var(--surface-700)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--surface-900)';
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      background: 'var(--surface-800)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--muted-foreground)',
                      marginBottom: '6px',
                    }}>
                      {token.category}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      marginBottom: '4px',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      {token.name}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontFamily: 'monospace',
                      color: 'var(--accent)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      var({token.token})
                    </div>
                  </div>
                  {copiedCode === token.name ? (
                    <Check size={18} style={{ color: 'var(--success)', flexShrink: 0, marginLeft: 'var(--spacing-2)' }} />
                  ) : (
                    <Copy size={18} style={{ color: 'var(--muted-foreground)', flexShrink: 0, marginLeft: 'var(--spacing-2)' }} />
                  )}
                </button>
              ))}
            </div>

            <div style={{
              marginTop: 'var(--spacing-5)',
              padding: 'var(--spacing-4)',
              background: 'var(--accent-subtle)',
              border: '1px solid var(--accent)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              gap: 'var(--spacing-2)',
            }}>
              <Info size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                lineHeight: '1.6',
              }}>
                All header tokens are defined in <code style={{
                  padding: '3px 8px',
                  background: 'var(--surface-900)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'monospace',
                  color: 'var(--accent)',
                }}>/styles/globals.css</code>. These tokens ensure consistency across all breakpoints and states.
              </p>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="header-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Usage Guidelines
          </h2>

          <div className="header-doc-grid-auto">
            <GuidelineCard
              title="✅ DO: Keep navigation concise"
              description="Use 5-7 navigation items maximum. Each label should be short and descriptive. Users should understand where each link leads at a glance."
              type="do"
            />
            <GuidelineCard
              title="✅ DO: Make logo clickable to home"
              description="Always link the logo back to the homepage. This is a standard web convention that users expect and rely on for quick navigation."
              type="do"
            />
            <GuidelineCard
              title="✅ DO: Indicate active page"
              description="Use visual feedback (background color, border) to show which page the user is currently on. This improves wayfinding and orientation."
              type="do"
            />
            <GuidelineCard
              title="❌ DON'T: Overcrowd with CTAs"
              description="Limit to one primary CTA button. Multiple call-to-actions compete for attention and reduce conversion rates. Keep it focused."
              type="dont"
            />
            <GuidelineCard
              title="❌ DON'T: Use dropdowns in navigation"
              description="Avoid dropdown menus in the header. They create hover dependency issues and accessibility problems. Use a mega menu or separate page instead."
              type="dont"
            />
            <GuidelineCard
              title="❌ DON'T: Hide header on scroll"
              description="Keep the header fixed or sticky. Users need constant access to navigation without scrolling back to the top every time."
              type="dont"
            />
          </div>
        </section>

        {/* Accessibility */}
        <section className="header-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Accessibility
          </h2>

          <div className="header-doc-card">
            <div style={{
              display: 'grid',
              gap: 'var(--spacing-5)',
            }}>
              <AccessibilityItem
                title="Semantic HTML"
                items={[
                  'Use <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);"><header></code> element as the main container',
                  'Use <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);"><nav></code> with <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">role="navigation"</code>',
                  'Add <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-label="Main navigation"</code> to identify the navigation region',
                  'Mark active page with <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-current="page"</code>',
                  'Logo must have descriptive alt text, not just "logo"',
                ]}
              />
              <AccessibilityItem
                title="Keyboard Navigation"
                items={[
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Tab</kbd> - Navigate through all interactive elements in logical order',
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Enter</kbd> or <kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Space</kbd> - Activate links and buttons',
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Escape</kbd> - Close mobile menu (when open)',
                  'Focus indicators must be visible on all interactive elements',
                  'Tab order should follow logical reading order: Logo → Nav → CTA',
                ]}
              />
              <AccessibilityItem
                title="Mobile Menu Accessibility"
                items={[
                  'Hamburger button requires <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-label="Toggle menu"</code>',
                  'Use <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-expanded="true|false"</code> to indicate menu state',
                  'Trap focus inside mobile menu when open',
                  'Announce menu state changes to screen readers',
                  'Ensure touch targets are at least 44×44px',
                ]}
              />
              <AccessibilityItem
                title="Contrast & Visibility"
                items={[
                  'Text must have at least 4.5:1 contrast ratio against background',
                  'Active/hover states must be distinguishable without relying on color alone',
                  'CTA button should have at least 3:1 contrast with adjacent elements',
                  'Focus ring must be visible and have 3:1 contrast',
                  'Ensure sufficient spacing between interactive elements (minimum 8px)',
                ]}
              />
              <AccessibilityItem
                title="Screen Reader Support"
                items={[
                  'Logo link should be the first focusable element',
                  'Navigation must be wrapped in a landmark region',
                  'Active page announcement via <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-current</code>',
                  'CTA button purpose must be clear from its label',
                  'Mobile menu state changes should be announced',
                ]}
              />
            </div>
          </div>
        </section>

        {/* Component Instance Report */}
        <section className="header-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Component Instance Report
          </h2>

          <div className="header-doc-card">
            <div style={{
              padding: 'var(--spacing-4)',
              background: 'var(--success-subtle)',
              border: '1px solid var(--success)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-4)',
            }}>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--success)',
                margin: 0,
                marginBottom: 'var(--spacing-2)',
              }}>
                ✓ All Components Detected
              </h3>
              <p style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                lineHeight: '1.6',
              }}>
                Successfully imported and documented all header component instances from your Figma file.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gap: 'var(--spacing-3)',
            }}>
              <InstanceReportItem
                component="Navigation Bar"
                status="detected"
                variants="Desktop, Tablet, Mobile (responsive)"
                details="Main header component with floating container design"
              />
              <InstanceReportItem
                component="Logo (Wugweb)"
                status="detected"
                variants="Single variant"
                details="SVG logo, 100px × 25.222px"
              />
              <InstanceReportItem
                component="Menu Links"
                status="detected"
                variants="5 nav items + 1 CTA"
                details="About, Services, Work, Blog, Contact + Quote button"
              />
              <InstanceReportItem
                component="Navigation Items"
                status="detected"
                variants="Default, Hover, Active states"
                details="48px height buttons with 8px radius"
              />
              <InstanceReportItem
                component="CTA Button (Quote)"
                status="detected"
                variants="Single variant with icon"
                details="44px height, accent colored, mail icon"
              />
              <InstanceReportItem
                component="Contact Icon"
                status="detected"
                variants="Single SVG icon"
                details="24.667px × 24px mail envelope icon"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function AnatomyItem({ label, description, token }: { label: string; description: string; token: string }) {
  return (
    <div style={{
      padding: 'var(--spacing-4)',
      background: 'var(--surface-900)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--foreground)',
        marginBottom: '6px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--muted-foreground)',
        marginBottom: 'var(--spacing-2)',
        lineHeight: '1.5',
      }}>
        {description}
      </div>
      <code style={{
        fontSize: 'var(--text-xs)',
        fontFamily: 'monospace',
        color: 'var(--accent)',
        background: 'var(--surface-800)',
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-block',
      }}>
        {token}
      </code>
    </div>
  );
}

function CodeBlock({ 
  title, 
  code, 
  language, 
  copied, 
  onCopy 
}: { 
  title: string; 
  code: string; 
  language: string; 
  copied: boolean; 
  onCopy: () => void;
}) {
  return (
    <div style={{
      background: 'var(--surface-800)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-3)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface-900)',
      }}>
        <span style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)',
        }}>
          {title}
        </span>
        <button
          onClick={onCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-1)',
            padding: '8px 16px',
            fontSize: 'var(--text-sm)',
            fontFamily: 'Inter Tight, sans-serif',
            fontWeight: 'var(--font-weight-medium)',
            background: copied ? 'var(--success-subtle)' : 'var(--surface-700)',
            color: copied ? 'var(--success)' : 'var(--foreground)',
            border: '1px solid',
            borderColor: copied ? 'var(--success)' : 'var(--border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre style={{
        margin: 0,
        padding: 'var(--spacing-5)',
        fontSize: 'var(--text-sm)',
        fontFamily: 'monospace',
        color: 'var(--foreground)',
        overflow: 'auto',
        lineHeight: '1.7',
      }}>
        {code}
      </pre>
    </div>
  );
}

function GuidelineCard({ title, description, type }: { title: string; description: string; type: 'do' | 'dont' }) {
  return (
    <div style={{
      background: 'var(--surface-800)',
      border: '2px solid',
      borderColor: type === 'do' ? 'var(--success)' : 'var(--destructive)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-5)',
    }}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        margin: 0,
        marginBottom: 'var(--spacing-3)',
        color: type === 'do' ? 'var(--success)' : 'var(--destructive)',
      }}>
        {title}
      </h3>
      <p style={{
        margin: 0,
        fontSize: 'var(--text-base)',
        color: 'var(--foreground)',
        lineHeight: '1.6',
      }}>
        {description}
      </p>
    </div>
  );
}

function AccessibilityItem({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{
      padding: 'var(--spacing-5)',
      background: 'var(--surface-900)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    }}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        margin: 0,
        marginBottom: 'var(--spacing-4)',
        color: 'var(--foreground)',
      }}>
        {title}
      </h3>
      <ul style={{
        margin: 0,
        paddingLeft: 'var(--spacing-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
      }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              lineHeight: '1.7',
            }}
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </ul>
    </div>
  );
}

function InstanceReportItem({ 
  component, 
  status, 
  variants, 
  details 
}: { 
  component: string; 
  status: 'detected' | 'missing'; 
  variants: string; 
  details: string;
}) {
  return (
    <div style={{
      padding: 'var(--spacing-4)',
      background: 'var(--surface-900)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-2)',
      }}>
        <h4 style={{
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--foreground)',
          margin: 0,
        }}>
          {component}
        </h4>
        <span style={{
          padding: '4px 8px',
          background: status === 'detected' ? 'var(--success-subtle)' : 'var(--destructive-subtle)',
          color: status === 'detected' ? 'var(--success)' : 'var(--destructive)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-medium)',
          borderRadius: 'var(--radius-sm)',
          textTransform: 'uppercase',
        }}>
          {status}
        </span>
      </div>
      <div style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--muted-foreground)',
        marginBottom: '4px',
      }}>
        <strong>Variants:</strong> {variants}
      </div>
      <div style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--muted-foreground)',
      }}>
        {details}
      </div>
    </div>
  );
}
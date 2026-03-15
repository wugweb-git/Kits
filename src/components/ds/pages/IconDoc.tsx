import React from 'react';
import { Copy, Check, ChevronRight, Info } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowRightIcon, 
  ArrowIcon, 
  ChevronUpIcon, 
  InfoIcon, 
  HelpIcon, 
  SearchIcon,
  iconLibrary 
} from '../../wugweb/IconLibrary';

export function IconDoc() {
  const [selectedIcon, setSelectedIcon] = React.useState('arrow-right');
  const [selectedSize, setSelectedSize] = React.useState<16 | 20 | 24 | 32>(24);
  const [selectedColor, setSelectedColor] = React.useState('foreground');
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(label);
      toast.success(`Copied ${label}`);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const iconSizes = [16, 20, 24, 32] as const;
  const iconColors = [
    { name: 'foreground', token: '--foreground' },
    { name: 'muted', token: '--muted-foreground' },
    { name: 'accent', token: '--accent' },
    { name: 'destructive', token: '--destructive' },
  ];

  const filteredIcons = iconLibrary.filter(icon =>
    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedIconData = iconLibrary.find(icon => icon.name === selectedIcon);
  const IconComponent = selectedIconData?.component || ArrowRightIcon;

  const reactCode = `import ArrowRightIcon from './imports/ArrowRightIcon';

<ArrowRightIcon 
  style={{ 
    width: '${selectedSize}px',
    height: '${selectedSize}px',
    color: 'var(--${iconColors.find(c => c.name === selectedColor)?.token.replace('--', '')})'
  }} 
/>`;

  const tokens = [
    { name: 'Icon Color Default', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)' },
    { name: 'Icon Color Muted', token: '--muted-foreground', value: 'rgba(161, 161, 161, 1.00)' },
    { name: 'Icon Color Accent', token: '--accent', value: 'rgba(255, 190, 26, 1.00)' },
    { name: 'Icon Size 16', token: '16px', value: '16px' },
    { name: 'Icon Size 20', token: '20px', value: '20px' },
    { name: 'Icon Size 24', token: '24px', value: '24px' },
    { name: 'Icon Size 32', token: '32px', value: '32px' },
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Inter Tight, sans-serif',
    }}>
      
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
          <span style={{ color: 'var(--foreground)' }}>Icons</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--spacing-4)',
          flexWrap: 'wrap',
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              margin: 0,
              marginBottom: 'var(--spacing-2)',
              color: 'var(--foreground)',
            }}>
              Icons
            </h1>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--muted-foreground)',
              margin: 0,
              maxWidth: '600px',
            }}>
              A comprehensive icon system with consistent sizing, colors, and stroke widths. All icons use design system tokens for easy theming.
            </p>
          </div>

          <div style={{
            display: 'inline-flex',
            padding: '6px 12px',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--accent)',
          }}>
            Figma Component Set
          </div>
        </div>
      </header>

      {/* Anatomy Section */}
      <section style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-4)',
          color: 'var(--foreground)',
        }}>
          Anatomy
        </h2>

        <div style={{
          background: 'var(--surface-800)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-6)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-6)',
            alignItems: 'center',
          }}>
            {/* Visual Anatomy */}
            <div style={{
              background: 'var(--surface-900)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              minHeight: '200px',
            }}>
              {/* Icon Container Guide */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px',
                border: '2px dashed var(--accent)',
                borderRadius: 'var(--radius-sm)',
              }} />
              
              {/* Icon */}
              <div style={{
                width: '48px',
                height: '48px',
                color: 'var(--foreground)',
                position: 'relative',
                zIndex: 1,
              }}>
                <ArrowRightIcon size={48} />
              </div>

              {/* Labels */}
              <div style={{
                position: 'absolute',
                top: 'var(--spacing-2)',
                right: 'var(--spacing-2)',
                fontSize: 'var(--text-xs)',
                color: 'var(--accent)',
                background: 'var(--surface-800)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--accent)',
              }}>
                24×24 Frame
              </div>
            </div>

            {/* Anatomy Labels */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)',
            }}>
              <AnatomyItem
                label="Outer Frame"
                description="24×24px container with consistent padding"
                token="24px"
              />
              <AnatomyItem
                label="Vector Path"
                description="SVG path data optimized for clarity at all sizes"
                token="viewBox: 0 0 24 24"
              />
              <AnatomyItem
                label="Icon Color"
                description="Uses foreground color token by default"
                token="var(--foreground)"
              />
              <AnatomyItem
                label="Stroke Width"
                description="Consistent 2px stroke for outline icons"
                token="2px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Icon Gallery */}
      <section style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-4)',
          color: 'var(--foreground)',
        }}>
          Icon Gallery
        </h2>

        {/* Search */}
        <div style={{
          marginBottom: 'var(--spacing-4)',
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '400px',
          }}>
            <SearchIcon 
              size={18} 
              style={{
                position: 'absolute',
                left: 'var(--spacing-2)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted-foreground)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                paddingLeft: '40px',
                paddingRight: 'var(--spacing-2)',
                fontSize: 'var(--text-base)',
                fontFamily: 'Inter Tight, sans-serif',
                color: 'var(--foreground)',
                background: 'var(--input-background)',
                border: '2px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--ring)';
                e.currentTarget.style.boxShadow = 'var(--focus-ring-accent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div style={{
          background: 'var(--surface-800)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-4)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 'var(--spacing-3)',
          }}>
            {filteredIcons.map((icon) => {
              const Icon = icon.component;
              return (
                <button
                  key={icon.name}
                  onClick={() => setSelectedIcon(icon.name)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-2)',
                    padding: 'var(--spacing-3)',
                    background: selectedIcon === icon.name ? 'var(--accent-subtle)' : 'var(--surface-900)',
                    border: '1px solid',
                    borderColor: selectedIcon === icon.name ? 'var(--accent)' : 'var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                    minHeight: '100px',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedIcon !== icon.name) {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.background = 'var(--surface-700)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedIcon !== icon.name) {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--surface-900)';
                    }
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    color: 'white',
                  }}>
                    <Icon style={{ width: '100%', height: '100%' }} />
                  </div>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    color: selectedIcon === icon.name ? 'var(--accent)' : 'var(--foreground)',
                    textAlign: 'center',
                    fontWeight: 'var(--font-weight-medium)',
                  }}>
                    {icon.name}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredIcons.length === 0 && (
            <div style={{
              padding: 'var(--spacing-8)',
              textAlign: 'center',
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
            }}>
              No icons found matching "{searchQuery}"
            </div>
          )}
        </div>
      </section>

      {/* Live Icon Preview */}
      <section style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-4)',
          color: 'var(--foreground)',
        }}>
          Live Preview
        </h2>

        <div style={{
          background: 'var(--surface-800)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-6)',
        }}>
          {/* Preview Display */}
          <div style={{
            background: 'var(--surface-900)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-8)',
            marginBottom: 'var(--spacing-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
          }}>
            <div style={{
              width: `${selectedSize}px`,
              height: `${selectedSize}px`,
              color: `var(--${iconColors.find(c => c.name === selectedColor)?.token.replace('--', '')})`,
            }}>
              <IconComponent style={{ width: '100%', height: '100%' }} />
            </div>
          </div>

          {/* Controls */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-4)',
          }}>
            {/* Size Control */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                marginBottom: 'var(--spacing-2)',
              }}>
                Size
              </label>
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-1)',
              }}>
                {iconSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '6px 12px',
                      fontSize: 'var(--text-sm)',
                      fontFamily: 'Inter Tight, sans-serif',
                      fontWeight: 'var(--font-weight-medium)',
                      background: selectedSize === size ? 'var(--accent)' : 'var(--surface-700)',
                      color: selectedSize === size ? 'var(--accent-foreground)' : 'var(--foreground)',
                      border: '1px solid',
                      borderColor: selectedSize === size ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                    }}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {/* Color Control */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                marginBottom: 'var(--spacing-2)',
              }}>
                Color
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--spacing-1)',
              }}>
                {iconColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    style={{
                      padding: '6px 12px',
                      fontSize: 'var(--text-sm)',
                      fontFamily: 'Inter Tight, sans-serif',
                      fontWeight: 'var(--font-weight-medium)',
                      background: selectedColor === color.name ? 'var(--accent)' : 'var(--surface-700)',
                      color: selectedColor === color.name ? 'var(--accent-foreground)' : 'var(--foreground)',
                      border: '1px solid',
                      borderColor: selectedColor === color.name ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-4)',
          color: 'var(--foreground)',
        }}>
          Code
        </h2>

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
          }}>
            <span style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
            }}>
              React
            </span>
            <button
              onClick={() => copyToClipboard(reactCode, 'React code')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
                padding: '6px 12px',
                fontSize: 'var(--text-sm)',
                fontFamily: 'Inter Tight, sans-serif',
                fontWeight: 'var(--font-weight-medium)',
                background: copiedCode === 'React code' ? 'var(--success-subtle)' : 'var(--surface-700)',
                color: copiedCode === 'React code' ? 'var(--success)' : 'var(--foreground)',
                border: '1px solid',
                borderColor: copiedCode === 'React code' ? 'var(--success)' : 'var(--border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
              }}
            >
              {copiedCode === 'React code' ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedCode === 'React code' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre style={{
            margin: 0,
            padding: 'var(--spacing-4)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'monospace',
            color: 'var(--foreground)',
            overflow: 'auto',
            lineHeight: '1.6',
          }}>
            {reactCode}
          </pre>
        </div>
      </section>

      {/* Design Tokens */}
      <section style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-4)',
          color: 'var(--foreground)',
        }}>
          Design Tokens
        </h2>

        <div style={{
          background: 'var(--surface-800)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-4)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--spacing-3)',
          }}>
            {tokens.map((token) => (
              <button
                key={token.name}
                onClick={() => copyToClipboard(`var(${token.token})`, token.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--spacing-3)',
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
                    fontSize: 'var(--text-xs)',
                    color: 'var(--muted-foreground)',
                    marginBottom: '4px',
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
                    {token.token.startsWith('--') ? `var(${token.token})` : token.token}
                  </div>
                </div>
                {copiedCode === token.name ? (
                  <Check size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                ) : (
                  <Copy size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                )}
              </button>
            ))}
          </div>

          <div style={{
            marginTop: 'var(--spacing-4)',
            padding: 'var(--spacing-3)',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: 'var(--spacing-2)',
          }}>
            <Info size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{
              margin: 0,
              fontSize: 'var(--text-sm)',
              color: 'var(--foreground)',
              lineHeight: '1.5',
            }}>
              All icon tokens are defined in <code style={{
                padding: '2px 6px',
                background: 'var(--surface-900)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'monospace',
              }}>/styles/globals.css</code>. Click any token to copy its CSS variable.
            </p>
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-4)',
          color: 'var(--foreground)',
        }}>
          Usage Guidelines
        </h2>

        <div style={{
          display: 'grid',
          gap: 'var(--spacing-4)',
        }}>
          <GuidelineCard
            title="✅ DO: Use consistent sizing"
            description="Stick to the predefined icon sizes (16, 20, 24, 32px) for visual consistency across your interface."
            type="do"
          />
          <GuidelineCard
            title="✅ DO: Use design tokens for colors"
            description="Always use CSS variables like var(--foreground) or var(--muted-foreground) instead of hardcoded colors."
            type="do"
          />
          <GuidelineCard
            title="❌ DON'T: Mix stroke widths"
            description="Avoid mixing icons with different stroke weights in the same context. Keep stroke width consistent."
            type="dont"
          />
          <GuidelineCard
            title="❌ DON'T: Use overly complex icons"
            description="Icons should be simple and recognizable at small sizes. Avoid excessive detail that won't scale well."
            type="dont"
          />
        </div>
      </section>

      {/* Accessibility */}
      <section>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-4)',
          color: 'var(--foreground)',
        }}>
          Accessibility
        </h2>

        <div style={{
          background: 'var(--surface-800)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-4)',
        }}>
          <ul style={{
            margin: 0,
            paddingLeft: 'var(--spacing-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-2)',
          }}>
            <li style={{
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              lineHeight: '1.6',
            }}>
              <strong>Decorative icons:</strong> Add <code style={{
                padding: '2px 6px',
                background: 'var(--surface-900)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'monospace',
                color: 'var(--accent)',
              }}>aria-hidden="true"</code> to icons used purely for decoration
            </li>
            <li style={{
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              lineHeight: '1.6',
            }}>
              <strong>Informative icons:</strong> Provide text alternatives using <code style={{
                padding: '2px 6px',
                background: 'var(--surface-900)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'monospace',
                color: 'var(--accent)',
              }}>aria-label</code> or <code style={{
                padding: '2px 6px',
                background: 'var(--surface-900)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'monospace',
                color: 'var(--accent)',
              }}>sr-only</code> text
            </li>
            <li style={{
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              lineHeight: '1.6',
            }}>
              <strong>Color contrast:</strong> Ensure icon colors meet WCAG 2.1 AA standards (4.5:1 for small text, 3:1 for large)
            </li>
            <li style={{
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              lineHeight: '1.6',
            }}>
              <strong>Interactive icons:</strong> Provide adequate touch targets (minimum 44×44px) for mobile devices
            </li>
            <li style={{
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              lineHeight: '1.6',
            }}>
              <strong>Focus states:</strong> Icon buttons must have visible focus indicators using <code style={{
                padding: '2px 6px',
                background: 'var(--surface-900)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'monospace',
                color: 'var(--accent)',
              }}>var(--ring)</code>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function AnatomyItem({ label, description, token }: { label: string; description: string; token: string }) {
  return (
    <div style={{
      padding: 'var(--spacing-3)',
      background: 'var(--surface-900)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--foreground)',
        marginBottom: '4px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--muted-foreground)',
        marginBottom: 'var(--spacing-1)',
      }}>
        {description}
      </div>
      <code style={{
        fontSize: 'var(--text-xs)',
        fontFamily: 'monospace',
        color: 'var(--accent)',
        background: 'var(--surface-800)',
        padding: '2px 6px',
        borderRadius: 'var(--radius-sm)',
      }}>
        {token}
      </code>
    </div>
  );
}

function GuidelineCard({ title, description, type }: { title: string; description: string; type: 'do' | 'dont' }) {
  return (
    <div style={{
      background: 'var(--surface-800)',
      border: '1px solid',
      borderColor: type === 'do' ? 'var(--success)' : 'var(--destructive)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-4)',
    }}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        margin: 0,
        marginBottom: 'var(--spacing-2)',
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
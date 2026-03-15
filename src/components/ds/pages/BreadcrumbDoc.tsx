import React from 'react';
import { Copy, Check, ChevronRight, Info, FileCode, Home, Slash, ArrowRight, Dot, Code2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Breadcrumb, BreadcrumbItem } from '../../wugweb/Breadcrumb';
import { copyToClipboard as safeCopy } from '../../../utils/clipboard';

export function BreadcrumbDoc() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [selectedSeparator, setSelectedSeparator] = React.useState<'slash' | 'chevron' | 'arrow' | 'dot'>('slash');
  const [showHomeIcon, setShowHomeIcon] = React.useState(false);
  const [enableTruncation, setEnableTruncation] = React.useState(false);
  const [showAdvancedTokens, setShowAdvancedTokens] = React.useState(false);
  const [expandedCodeBlocks, setExpandedCodeBlocks] = React.useState<{ [key: string]: boolean }>({
    react: true,
    html: false,
    css: false,
  });

  const copyToClipboard = async (text: string, label: string) => {
    const success = await safeCopy(text);
    if (success) {
      setCopiedCode(label);
      toast.success(`Copied ${label}`);
      setTimeout(() => setCopiedCode(null), 2000);
    } else {
      toast.error('Failed to copy');
    }
  };

  const toggleCodeBlock = (key: string) => {
    setExpandedCodeBlocks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const basicItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Products', href: '/products' },
    { label: 'An Application', current: true },
  ];

  const longItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects', href: '/projects' },
    { label: 'Design System', href: '/design-system' },
    { label: 'Components', href: '/components' },
    { label: 'Breadcrumb', current: true },
  ];

  const coreTokens = [
    { name: 'Link Color', token: '--muted-foreground', value: 'rgba(161, 161, 161, 1.00)', category: 'Color' },
    { name: 'Link Hover', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Current Page', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Separator Color', token: '--muted-foreground', value: 'rgba(161, 161, 161, 1.00)', category: 'Color' },
    { name: 'Font Size (md)', token: '--text-sm', value: '14px', category: 'Typography' },
    { name: 'Separator Padding', token: '--spacing-1', value: '8px', category: 'Spacing' },
  ];

  const advancedTokens = [
    { name: 'Font Family', token: 'Inter Tight', value: 'Inter Tight, sans-serif', category: 'Typography' },
    { name: 'Font Size (sm)', token: '--text-xs', value: '12px', category: 'Typography' },
    { name: 'Font Size (lg)', token: '--text-base', value: '16px', category: 'Typography' },
    { name: 'Line Height (sm)', token: '14px', value: '14px', category: 'Typography' },
    { name: 'Line Height (md)', token: '16px', value: '16px', category: 'Typography' },
    { name: 'Line Height (lg)', token: '20px', value: '20px', category: 'Typography' },
    { name: 'Icon Gap', token: '--spacing-1', value: '8px', category: 'Spacing' },
    { name: 'Transition Duration', token: '--motion-duration-fast', value: '80ms', category: 'Motion' },
    { name: 'Transition Easing', token: '--motion-easing-standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)', category: 'Motion' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens, ...advancedTokens] : coreTokens;

  const reactCode = `import { Breadcrumb } from './components/wugweb/Breadcrumb';
import { Home } from 'lucide-react';

function MyPage() {
  const items = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Products', href: '/products' },
    { label: 'An Application', current: true },
  ];

  return (
    <Breadcrumb
      items={items}
      separator="${selectedSeparator}"
      size="${selectedSize}"
      ${showHomeIcon ? 'showHomeIcon' : ''}
      ${enableTruncation ? 'maxItems={3}' : ''}
    />
  );
}`;

  const htmlCode = `<nav aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    <!-- First Item -->
    <li class="breadcrumb-item">
      <a href="/" class="breadcrumb-link">
        <svg><!-- Home Icon --></svg>
        <span>Home</span>
      </a>
    </li>
    
    <!-- Separator -->
    <li aria-hidden="true" class="breadcrumb-separator">/</li>
    
    <!-- Middle Item -->
    <li class="breadcrumb-item">
      <a href="/products" class="breadcrumb-link">Products</a>
    </li>
    
    <!-- Separator -->
    <li aria-hidden="true" class="breadcrumb-separator">/</li>
    
    <!-- Current Page -->
    <li class="breadcrumb-item">
      <span aria-current="page" class="breadcrumb-current">
        An Application
      </span>
    </li>
  </ol>
</nav>`;

  const cssCode = `/* Breadcrumb Navigation */
nav[aria-label="Breadcrumb"] {
  display: flex;
  align-items: center;
  font-family: Inter Tight, sans-serif;
  font-size: var(--text-sm);
  line-height: 16px;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

/* Link States */
.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--muted-foreground);
  text-decoration: none;
  font-weight: var(--font-weight-regular);
  transition: color var(--motion-duration-fast) var(--motion-easing-standard);
  cursor: pointer;
}

.breadcrumb-link:hover {
  color: var(--foreground);
}

.breadcrumb-link:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Current Page */
.breadcrumb-current {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--foreground);
  font-weight: var(--font-weight-medium);
  cursor: text;
}

/* Separator */
.breadcrumb-separator {
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-1);
  color: var(--muted-foreground);
  line-height: 20px;
}

/* Size Variants */
.breadcrumb-sm {
  font-size: var(--text-xs);
  line-height: 14px;
}

.breadcrumb-lg {
  font-size: var(--text-base);
  line-height: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .breadcrumb-list {
    flex-wrap: wrap;
    gap: var(--spacing-1);
  }
}`;

  return (
    <>
      {/* Responsive Styles */}
      <style>{`
        .breadcrumb-doc-root {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          font-family: Inter Tight, sans-serif;
          box-sizing: border-box;
        }

        .breadcrumb-doc-section {
          margin-bottom: var(--spacing-8);
        }

        .breadcrumb-doc-card {
          background: var(--surface-800);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-5);
          width: 100%;
          box-sizing: border-box;
        }

        .breadcrumb-doc-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-5);
          width: 100%;
        }

        .breadcrumb-doc-grid-auto {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-4);
          width: 100%;
        }

        .breadcrumb-doc-token-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-3);
          width: 100%;
        }

        .breadcrumb-doc-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-4);
          width: 100%;
        }

        /* Tablet - 768px to 1024px */
        @media (max-width: 1024px) {
          .breadcrumb-doc-section {
            margin-bottom: var(--spacing-6);
          }

          .breadcrumb-doc-grid-2 {
            grid-template-columns: 1fr;
            gap: var(--spacing-4);
          }
          
          .breadcrumb-doc-card {
            padding: var(--spacing-4);
          }
          
          .breadcrumb-doc-token-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .breadcrumb-doc-grid-auto {
            grid-template-columns: 1fr;
          }
        }

        /* Mobile - up to 768px */
        @media (max-width: 768px) {
          .breadcrumb-doc-section {
            margin-bottom: var(--spacing-5);
          }

          .breadcrumb-doc-card {
            padding: var(--spacing-3);
          }

          .breadcrumb-doc-grid-2,
          .breadcrumb-doc-grid-auto {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }

          .breadcrumb-doc-token-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-2);
          }

          .breadcrumb-doc-controls {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
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
          .breadcrumb-doc-card {
            padding: var(--spacing-2);
          }

          .breadcrumb-doc-section {
            margin-bottom: var(--spacing-4);
          }

          .breadcrumb-doc-token-grid {
            grid-template-columns: 1fr;
          }

          .breadcrumb-doc-grid-2 {
            gap: var(--spacing-2);
          }
        }

        .code-block-collapsed {
          max-height: 0;
          overflow: hidden;
          transition: max-height 180ms var(--motion-easing-emphasized);
        }

        .code-block-expanded {
          max-height: 1000px;
          overflow: hidden;
          transition: max-height 180ms var(--motion-easing-emphasized);
        }

        .separator-fade {
          transition: opacity var(--motion-duration-fast) var(--motion-easing-standard);
        }

        .focus-ring-sim {
          outline: 2px solid var(--ring);
          outline-offset: 2px;
          border-radius: 2px;
        }

        /* Ensure anatomy cards don't overflow on mobile */
        .anatomy-card {
          padding: var(--spacing-3);
          background: var(--surface-900);
          border: 2px dashed var(--accent);
          border-radius: var(--radius-md);
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .anatomy-card {
            padding: var(--spacing-2);
          }
        }
      `}</style>

      <div className="breadcrumb-doc-root">
        
        {/* Header */}
        <header style={{
          marginBottom: 'var(--spacing-8)',
          paddingBottom: 'var(--spacing-6)',
          borderBottom: '1px solid var(--border)',
          width: '100%',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            marginBottom: 'var(--spacing-3)',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
            flexWrap: 'wrap',
          }}>
            <span>Components</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--foreground)' }}>Breadcrumb</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--spacing-4)',
            flexWrap: 'wrap',
            width: '100%',
          }}>
            <div style={{ flex: '1 1 300px', minWidth: 0 }}>
              <h1 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                margin: 0,
                marginBottom: 'var(--spacing-2)',
                color: 'var(--foreground)',
              }}>
                Breadcrumb
              </h1>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--muted-foreground)',
                margin: 0,
                lineHeight: '1.6',
              }}>
                A navigation component that shows the user's location within the site hierarchy. Supports multiple separators, sizes, truncation, and full accessibility.
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

        {/* Anatomy Section */}
        <section className="breadcrumb-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Anatomy
          </h2>

          <div className="breadcrumb-doc-card">
            <div className="breadcrumb-doc-grid-2">
              {/* Visual Anatomy */}
              <div style={{ width: '100%' }}>
                <div style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-4)',
                }}>
                  Breadcrumb Structure
                </div>

                {/* Anatomical Breakdown */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-4)',
                  width: '100%',
                }}>
                  {/* Basic Breadcrumb */}
                  <div className="anatomy-card">
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--accent)',
                      marginBottom: 'var(--spacing-2)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      Basic Breadcrumb
                    </div>
                    <Breadcrumb items={basicItems} size="md" />
                  </div>

                  {/* Separator Variants */}
                  <div className="anatomy-card">
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--accent)',
                      marginBottom: 'var(--spacing-3)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      Separator Variants
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-2)',
                      width: '100%',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)',
                        flexWrap: 'wrap',
                      }}>
                        <span style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          minWidth: '60px',
                        }}>
                          Slash:
                        </span>
                        <Breadcrumb items={basicItems} separator="slash" size="sm" />
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)',
                        flexWrap: 'wrap',
                      }}>
                        <span style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          minWidth: '60px',
                        }}>
                          Chevron:
                        </span>
                        <Breadcrumb items={basicItems} separator="chevron" size="sm" />
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)',
                        flexWrap: 'wrap',
                      }}>
                        <span style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          minWidth: '60px',
                        }}>
                          Dot:
                        </span>
                        <Breadcrumb items={basicItems} separator="dot" size="sm" />
                      </div>
                    </div>
                  </div>

                  {/* Size Variants */}
                  <div className="anatomy-card">
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--accent)',
                      marginBottom: 'var(--spacing-3)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      Size Variants
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-2)',
                      width: '100%',
                    }}>
                      <div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          marginBottom: '4px',
                        }}>
                          Small (12px)
                        </div>
                        <Breadcrumb items={basicItems} size="sm" />
                      </div>
                      <div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          marginBottom: '4px',
                        }}>
                          Medium (14px)
                        </div>
                        <Breadcrumb items={basicItems} size="md" />
                      </div>
                      <div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          marginBottom: '4px',
                        }}>
                          Large (16px)
                        </div>
                        <Breadcrumb items={basicItems} size="lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Anatomy Labels */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)',
                width: '100%',
              }}>
                <AnatomyItem
                  label="Navigation Container"
                  description="Semantic <nav> with aria-label='Breadcrumb'"
                  token="font-family: Inter Tight"
                />
                <AnatomyItem
                  label="Breadcrumb Items"
                  description="Ordered list with clickable links"
                  token="color: var(--muted-foreground)"
                />
                <AnatomyItem
                  label="Link Hover State"
                  description="Links change color on hover/tap"
                  token="color: var(--foreground)"
                />
                <AnatomyItem
                  label="Current Page"
                  description="Last item with aria-current='page'"
                  token="color: var(--foreground), font-weight: medium"
                />
                <AnatomyItem
                  label="Separator"
                  description="Visual divider with aria-hidden='true'"
                  token="padding: 0 var(--spacing-1)"
                />
                <AnatomyItem
                  label="Home Icon"
                  description="Optional icon for first item"
                  token="size: 14px, gap: var(--spacing-1)"
                />
                <AnatomyItem
                  label="Typography"
                  description="Font sizes: 12px (sm), 14px (md), 16px (lg)"
                  token="var(--text-xs/sm/base)"
                />
                <AnatomyItem
                  label="Truncation"
                  description="Shows first + last items with ellipsis"
                  token="maxItems prop for long paths"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Preview */}
        <section className="breadcrumb-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Interactive Preview
          </h2>

          <div className="breadcrumb-doc-card">
            {/* Controls */}
            <div className="breadcrumb-doc-controls" style={{
              marginBottom: 'var(--spacing-5)',
            }}>
              {/* Size Control */}
              <div style={{ width: '100%' }}>
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
                  flexWrap: 'wrap',
                }}>
                  {(['sm', 'md', 'lg'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '8px 16px',
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
                        textTransform: 'uppercase',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Separator Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Separator
                </label>
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-1)',
                  flexWrap: 'wrap',
                }}>
                  {(['slash', 'chevron', 'dot'] as const).map((sep) => (
                    <button
                      key={sep}
                      onClick={() => setSelectedSeparator(sep)}
                      style={{
                        padding: '8px 12px',
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'Inter Tight, sans-serif',
                        fontWeight: 'var(--font-weight-medium)',
                        background: selectedSeparator === sep ? 'var(--accent)' : 'var(--surface-700)',
                        color: selectedSeparator === sep ? 'var(--accent-foreground)' : 'var(--foreground)',
                        border: '1px solid',
                        borderColor: selectedSeparator === sep ? 'var(--accent)' : 'var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {sep}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Options
                </label>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-2)',
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                  }}>
                    <input
                      type="checkbox"
                      checked={showHomeIcon}
                      onChange={(e) => setShowHomeIcon(e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                      }}
                    />
                    Show home icon
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                  }}>
                    <input
                      type="checkbox"
                      checked={enableTruncation}
                      onChange={(e) => setEnableTruncation(e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                      }}
                    />
                    Enable truncation
                  </label>
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
              width: '100%',
              boxSizing: 'border-box',
            }}>
              <div style={{
                marginBottom: 'var(--spacing-4)',
              }}>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--muted-foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Basic Path
                </div>
                <Breadcrumb
                  items={basicItems}
                  separator={selectedSeparator}
                  size={selectedSize}
                  showHomeIcon={showHomeIcon}
                />
              </div>

              <div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--muted-foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Long Path {enableTruncation && '(Truncated)'}
                </div>
                <Breadcrumb
                  items={longItems}
                  separator={selectedSeparator}
                  size={selectedSize}
                  showHomeIcon={showHomeIcon}
                  maxItems={enableTruncation ? 3 : undefined}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="breadcrumb-doc-section">
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
            width: '100%',
          }}>
            <CodeBlock
              title="React"
              code={reactCode}
              language="tsx"
              copied={copiedCode === 'React code'}
              onCopy={() => copyToClipboard(reactCode, 'React code')}
              expanded={expandedCodeBlocks.react}
              onToggle={() => toggleCodeBlock('react')}
            />

            <CodeBlock
              title="HTML"
              code={htmlCode}
              language="html"
              copied={copiedCode === 'HTML code'}
              onCopy={() => copyToClipboard(htmlCode, 'HTML code')}
              expanded={expandedCodeBlocks.html}
              onToggle={() => toggleCodeBlock('html')}
            />

            <CodeBlock
              title="CSS with Design Tokens"
              code={cssCode}
              language="css"
              copied={copiedCode === 'CSS code'}
              onCopy={() => copyToClipboard(cssCode, 'CSS code')}
              expanded={expandedCodeBlocks.css}
              onToggle={() => toggleCodeBlock('css')}
            />
          </div>
        </section>

        {/* Design Tokens */}
        <section className="breadcrumb-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Design Tokens
          </h2>

          <div className="breadcrumb-doc-card">
            <div className="breadcrumb-doc-token-grid">
              {allTokens.map((token) => (
                <button
                  key={token.name}
                  onClick={() => copyToClipboard(typeof token.token === 'string' && token.token.startsWith('--') ? `var(${token.token})` : token.token, token.name)}
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
                    width: '100%',
                    boxSizing: 'border-box',
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
                      {token.token.startsWith('--') ? `var(${token.token})` : token.token}
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

            {/* Show More Toggle (Mobile) */}
            <div style={{
              marginTop: 'var(--spacing-4)',
              textAlign: 'center',
            }}>
              <button
                onClick={() => setShowAdvancedTokens(!showAdvancedTokens)}
                style={{
                  padding: '8px 16px',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'Inter Tight, sans-serif',
                  fontWeight: 'var(--font-weight-medium)',
                  background: 'var(--surface-700)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                }}
              >
                {showAdvancedTokens ? 'Show Less' : 'Show Advanced Tokens'}
              </button>
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
                All breadcrumb tokens are defined in <code style={{
                  padding: '3px 8px',
                  background: 'var(--surface-900)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'monospace',
                  color: 'var(--accent)',
                }}>/styles/globals.css</code>. Colors and spacing follow the 8-point grid system.
              </p>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="breadcrumb-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Usage Guidelines
          </h2>

          <div className="breadcrumb-doc-grid-auto">
            <GuidelineCard
              title="✅ DO: Keep depth reasonable"
              description="Limit breadcrumb depth to 4-5 levels maximum. Deep hierarchies confuse users and take up valuable screen space. Use truncation for longer paths."
              type="do"
            />
            <GuidelineCard
              title="✅ DO: Use clear, concise labels"
              description="Breadcrumb labels should be short and descriptive. Use familiar terms that match your navigation structure and make sense out of context."
              type="do"
            />
            <GuidelineCard
              title="✅ DO: Enable truncation for deep paths"
              description="For pages with many hierarchy levels, show the first and last few items with ellipsis (...) in the middle. This keeps the breadcrumb compact and readable."
              type="do"
            />
            <GuidelineCard
              title="❌ DON'T: Use on simple sites"
              description="Don't add breadcrumbs to flat sites with only 1-2 levels. They add unnecessary clutter when users can easily navigate with the main menu alone."
              type="dont"
            />
            <GuidelineCard
              title="❌ DON'T: Make current page clickable"
              description="The current page (last item) should not be a link. Users are already on this page, so making it clickable serves no purpose and can be confusing."
              type="dont"
            />
            <GuidelineCard
              title="❌ DON'T: Use very long labels"
              description="Avoid breadcrumb items with long, multi-word labels. They break the horizontal flow and make the breadcrumb hard to scan. Abbreviate if needed."
              type="dont"
            />
          </div>
        </section>

        {/* Accessibility */}
        <section className="breadcrumb-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Accessibility
          </h2>

          <div className="breadcrumb-doc-card">
            <div style={{
              display: 'grid',
              gap: 'var(--spacing-5)',
              width: '100%',
            }}>
              <AccessibilityItem
                title="Semantic HTML & ARIA"
                items={[
                  'Wrap breadcrumb in <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);"><nav></code> with <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-label="Breadcrumb"</code>',
                  'Use <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);"><ol></code> for the list (ordered hierarchy)',
                  'Add <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-current="page"</code> to the last item',
                  'Use <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-hidden="true"</code> on separator elements',
                  'Each breadcrumb item should be a <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);"><li></code> element',
                ]}
              />
              <AccessibilityItem
                title="Keyboard Navigation"
                items={[
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Tab</kbd> - Navigate through breadcrumb links in sequence',
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Enter</kbd> - Follow the focused breadcrumb link',
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Shift + Tab</kbd> - Navigate backwards through links',
                  'Focus should skip the current page (non-interactive)',
                  'Visible focus indicator required on all links (var(--ring))',
                ]}
              />
              <AccessibilityItem
                title="Screen Reader Support"
                items={[
                  'Screen readers announce "Breadcrumb navigation" from aria-label',
                  'Separators are hidden from screen readers (aria-hidden)',
                  'Current page is announced as "current page" via aria-current',
                  'List structure provides hierarchical context',
                  'Link text should be descriptive enough to understand out of context',
                ]}
              />
              <AccessibilityItem
                title="Visual Accessibility"
                items={[
                  'Text must have at least 4.5:1 contrast ratio (WCAG AA)',
                  'Links must have 3:1 contrast with surrounding text',
                  'Hover/tap state must be distinguishable without relying on color alone',
                  'Current page should be visually distinct (medium font weight)',
                  'Focus ring must be visible with 3:1 contrast (var(--ring))',
                ]}
              />
              <AccessibilityItem
                title="Mobile & Touch"
                items={[
                  'Touch targets must be at least 44×44px for mobile',
                  'Ensure adequate spacing between links on small screens',
                  'Breadcrumb should wrap gracefully on narrow viewports',
                  'Consider truncation for long paths on mobile',
                  'Maintain readability at all breakpoints (20px padding)',
                ]}
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
      width: '100%',
      boxSizing: 'border-box',
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
  onCopy,
  expanded,
  onToggle,
}: { 
  title: string; 
  code: string; 
  language: string; 
  copied: boolean; 
  onCopy: () => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{
      background: 'var(--surface-800)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-3)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface-900)',
        flexWrap: 'wrap',
        gap: 'var(--spacing-2)',
      }}>
        <span style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)',
        }}>
          {title}
        </span>
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-2)',
        }}>
          <button
            onClick={onToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              padding: '8px 12px',
              fontSize: 'var(--text-sm)',
              fontFamily: 'Inter Tight, sans-serif',
              fontWeight: 'var(--font-weight-medium)',
              background: 'var(--surface-700)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
            }}
          >
            <Code2 size={16} />
            <span>{expanded ? 'Hide' : 'Show'}</span>
          </button>
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
      </div>
      <div className={expanded ? 'code-block-expanded' : 'code-block-collapsed'}>
        <pre style={{
          margin: 0,
          padding: 'var(--spacing-5)',
          fontSize: 'var(--text-sm)',
          fontFamily: 'monospace',
          color: 'var(--foreground)',
          overflowX: 'auto',
          lineHeight: '1.7',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {code}
        </pre>
      </div>
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
      width: '100%',
      boxSizing: 'border-box',
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
      width: '100%',
      boxSizing: 'border-box',
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
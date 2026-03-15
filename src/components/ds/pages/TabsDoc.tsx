import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs as UITabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Copy, Check, X, ChevronRight, Keyboard, ExternalLink, Home, Settings, User } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Tabs } from '../../wugweb/Tabs';

export function TabsDoc() {
  const [selectedVariant, setSelectedVariant] = React.useState<'default' | 'underline' | 'pills'>('underline');
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [showCode, setShowCode] = React.useState(true);
  const [showAccessibility, setShowAccessibility] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  
  const { isMobile, isTablet, breakpoint } = useBreakpoint();

  const handleTokenClick = (token: string, label: string, value?: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const tabItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home size={16} />,
      content: <div style={{ padding: 'var(--spacing-2)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Home content goes here.</div>,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={16} />,
      content: <div style={{ padding: 'var(--spacing-2)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Profile content goes here.</div>,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={16} />,
      content: <div style={{ padding: 'var(--spacing-2)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Settings content goes here.</div>,
    },
  ];

  const jsxCode = `import { Tabs } from './components/wugweb/Tabs';
import { Home, User, Settings } from 'lucide-react';

const items = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home size={16} />,
    content: <div>Home content</div>,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <User size={16} />,
    content: <div>Profile content</div>,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings size={16} />,
    content: <div>Settings content</div>,
  },
];

<Tabs
  items={items}
  defaultValue="home"
  variant="${selectedVariant}"
  size="${selectedSize}"
  onValueChange={(value) => console.log(value)}
/>

// Design Tokens Used:
// Active Text: var(--foreground)
// Inactive Text: var(--muted-foreground)
// Active Background: var(--accent) (pills) | var(--muted) (default)
// Underline: var(--accent)
// Border: var(--border)`;

  const cssCode = `.tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.tabs-list {
  display: flex;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid var(--border);
}

.tabs-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-regular);
  color: var(--muted-foreground);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--motion-duration-fast) var(--motion-easing-standard);
}

.tabs-trigger[data-state="active"] {
  color: var(--foreground);
  font-weight: var(--font-weight-semibold);
  border-bottom: 2px solid var(--accent);
}

.tabs-content {
  margin-top: var(--spacing-2);
  animation: fadeIn var(--motion-duration-fast) var(--motion-easing-standard);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`;

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* Premium Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', width: '100%', boxSizing: 'border-box' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Navigation</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Tabs</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Tabs
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Navigation</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A horizontal navigation component that organizes content into separate views. Users can switch between views by clicking tab labels.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Variants</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>3</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Sizes</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>3</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>WCAG</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>AA</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Button onClick={copyPageLink} variant="outline" size="sm" className="button-micro focus-ring-accent" style={{ gap: '8px', background: 'var(--background)', borderColor: 'var(--border)' }}>
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="outline" size="sm" className="button-micro focus-ring-accent" style={{ gap: '8px', background: 'var(--background)', borderColor: 'var(--border)' }}>
                <ExternalLink size={16} />
                View in Figma
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="animate-fade-in-up" style={{ animationDelay: '100ms', width: '100%', boxSizing: 'border-box' }}>
        <Card className="card-hover-lift" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Variant</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['default', 'underline', 'pills'] as const).map((variant) => (
                      <Button 
                        key={variant} 
                        onClick={() => setSelectedVariant(variant)} 
                        variant={selectedVariant === variant ? 'default' : 'outline'} 
                        size="sm" 
                        className="button-micro" 
                        style={{ 
                          fontSize: 'var(--text-sm)', 
                          textTransform: 'capitalize', 
                          background: selectedVariant === variant ? 'var(--accent)' : 'var(--background)', 
                          color: selectedVariant === variant ? 'var(--accent-foreground)' : 'var(--foreground)', 
                          borderColor: 'var(--border)' 
                        }}
                      >
                        {variant}
                      </Button>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Size</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['sm', 'md', 'lg'] as const).map((size) => (
                      <Button 
                        key={size} 
                        onClick={() => setSelectedSize(size)} 
                        variant={selectedSize === size ? 'default' : 'outline'} 
                        size="sm" 
                        className="button-micro" 
                        style={{ 
                          fontSize: 'var(--text-sm)', 
                          textTransform: 'uppercase', 
                          background: selectedSize === size ? 'var(--accent)' : 'var(--background)', 
                          color: selectedSize === size ? 'var(--accent-foreground)' : 'var(--foreground)', 
                          borderColor: 'var(--border)' 
                        }}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: isMobile ? '24px' : '32px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', minHeight: '200px' }}>
                <Tabs
                  items={tabItems}
                  defaultValue="home"
                  variant={selectedVariant}
                  size={selectedSize}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Design Tokens */}
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Design Tokens</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Click on any token to highlight it in the preview above</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          <TokenCard label="Active Text" token="--foreground" value="#FFFFFF" color="var(--foreground)" onClick={() => handleTokenClick('--foreground', 'Active Text', '#FFFFFF')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard label="Inactive Text" token="--muted-foreground" value="#A1A1A1" color="var(--muted-foreground)" onClick={() => handleTokenClick('--muted-foreground', 'Inactive Text', '#A1A1A1')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard label="Active Accent" token="--accent" value="#FFBE1A" color="var(--accent)" onClick={() => handleTokenClick('--accent', 'Active Accent', '#FFBE1A')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard label="Border" token="--border" value="#2B2B2B" color="var(--border)" onClick={() => handleTokenClick('--border', 'Border', '#2B2B2B')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard label="Background" token="--muted" value="#262626" color="var(--muted)" onClick={() => handleTokenClick('--muted', 'Background', '#262626')} isHighlighted={highlightedToken === '--muted'} />
        </div>
      </section>

      {/* Code Examples */}
      {showCode && (
        <section className="animate-fade-in-up" style={{ animationDelay: '300ms', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>Code Examples</h2>
            <Button onClick={() => setShowCode(!showCode)} variant="ghost" size="sm" className="button-micro" style={{ gap: '8px' }}>
              <X size={16} />
              Hide
            </Button>
          </div>

          <UITabs defaultValue="jsx" style={{ width: '100%' }}>
            <TabsList style={{ marginBottom: '16px' }}>
              <TabsTrigger value="jsx">React + JSX</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
            </TabsList>

            <TabsContent value="jsx">
              <CollapsibleCodeBlock code={jsxCode} language="tsx" />
            </TabsContent>

            <TabsContent value="css">
              <CollapsibleCodeBlock code={cssCode} language="css" />
            </TabsContent>
          </UITabs>
        </section>
      )}

      {/* Accessibility */}
      {showAccessibility && (
        <section className="animate-fade-in-up" style={{ animationDelay: '400ms', width: '100%', boxSizing: 'border-box' }}>
          <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--card)' }}>
            <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Accessibility</h2>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>WCAG 2.1 Level AA compliant</p>
                </div>
                <Button onClick={() => setShowAccessibility(!showAccessibility)} variant="ghost" size="sm" className="button-micro" style={{ gap: '8px' }}>
                  <X size={16} />
                  Hide
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <Keyboard size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Keyboard Navigation</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>Tab</kbd> - Navigate between tabs</li>
                      <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>Enter</kbd> or <kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>Space</kbd> - Activate tab</li>
                      <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>←</kbd> <kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>→</kbd> - Move between tabs</li>
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>ARIA Attributes</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li><code>role="tablist"</code> on the tab container</li>
                      <li><code>role="tab"</code> on each tab trigger</li>
                      <li><code>role="tabpanel"</code> on the content panel</li>
                      <li><code>aria-selected</code> indicates active tab</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

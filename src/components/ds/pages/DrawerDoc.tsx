import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Copy, Check, X, ChevronRight, Keyboard, ExternalLink } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Drawer } from '../../wugweb/Drawer';
import { copyToClipboard } from '../../../utils/clipboard';

export function DrawerDoc() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedPosition, setSelectedPosition] = React.useState<'left' | 'right' | 'top' | 'bottom'>('right');
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
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
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const jsxCode = `import { Drawer, DrawerTrigger } from './components/wugweb/Drawer';

const [isOpen, setIsOpen] = React.useState(false);

<>
  <DrawerTrigger onClick={() => setIsOpen(true)}>
    Open Drawer
  </DrawerTrigger>

  <Drawer
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="DEVELOPER APP HAND-OFF"
    position="${selectedPosition}"
    size="${selectedSize}"
    showOverlay={true}
    closeOnOverlayClick={true}
    closeOnEscape={true}
  >
    <div className="flex flex-col gap-4">
      <h3>Drawer Content</h3>
      <p>This is the drawer content area.</p>
    </div>
  </Drawer>
</>

// Design Tokens Used:
// Background: var(--surface-800)
// Text: var(--foreground)
// Border: var(--border)
// Overlay: var(--overlay-background)`;

  const cssCode = `.drawer {
  position: fixed;
  background: var(--surface-800);
  transition: transform var(--motion-duration-normal) var(--motion-easing-emphasized);
  z-index: 1001;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-background);
  transition: opacity var(--motion-duration-normal) var(--motion-easing-standard);
  z-index: 1000;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2);
  border-bottom: 1px solid var(--border);
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-2);
}

.drawer-close {
  display: flex;
  align-items: center;
  justify-center;
  padding: var(--spacing-1);
  border-radius: var(--radius-sm);
  color: var(--muted-foreground);
  transition: background var(--motion-duration-fast);
}

.drawer-close:hover {
  background: var(--muted);
}`;

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* Premium Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', width: '100%', boxSizing: 'border-box' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Overlay</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Drawer</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Drawer
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Overlay</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A panel that slides in from the edge of the screen. Perfect for navigation menus, settings panels, and detailed content views without leaving the current context.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Positions</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>4</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Sizes</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>5</div>
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
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Position</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['left', 'right', 'top', 'bottom'] as const).map((position) => (
                      <Button 
                        key={position} 
                        onClick={() => setSelectedPosition(position)} 
                        variant={selectedPosition === position ? 'default' : 'outline'} 
                        size="sm" 
                        className="button-micro" 
                        style={{ 
                          fontSize: 'var(--text-sm)', 
                          textTransform: 'capitalize', 
                          background: selectedPosition === position ? 'var(--accent)' : 'var(--background)', 
                          color: selectedPosition === position ? 'var(--accent-foreground)' : 'var(--foreground)', 
                          borderColor: 'var(--border)' 
                        }}
                      >
                        {position}
                      </Button>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Size</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
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

              <div style={{ padding: isMobile ? '32px' : '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <DrawerTrigger onClick={() => setIsDrawerOpen(true)} variant="primary">
                  <Menu size={16} />
                  Open Drawer
                </DrawerTrigger>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Drawer Component */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="DEVELOPER APP HAND-OFF"
        position={selectedPosition}
        size={selectedSize}
        showOverlay={true}
        closeOnOverlayClick={true}
        closeOnEscape={true}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div style={{ padding: 'var(--spacing-3)', background: 'var(--muted)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-1)' }}>
              Drawer Content
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>
              This drawer can contain any content including navigation menus, settings panels, or detailed information.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
            <Button variant="outline" style={{ justifyContent: 'flex-start' }}>Menu Item 1</Button>
            <Button variant="outline" style={{ justifyContent: 'flex-start' }}>Menu Item 2</Button>
            <Button variant="outline" style={{ justifyContent: 'flex-start' }}>Menu Item 3</Button>
          </div>
        </div>
      </Drawer>

      {/* Design Tokens */}
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Design Tokens</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Click on any token to highlight it in the preview above</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          <TokenCard label="Background" token="--surface-800" value="#1C1C1C" color="var(--surface-800)" onClick={() => handleTokenClick('--surface-800', 'Background', '#1C1C1C')} isHighlighted={highlightedToken === '--surface-800'} />
          <TokenCard label="Overlay" token="--overlay-background" value="rgba(0,0,0,0.6)" color="var(--overlay-background)" onClick={() => handleTokenClick('--overlay-background', 'Overlay', 'rgba(0,0,0,0.6)')} isHighlighted={highlightedToken === '--overlay-background'} />
          <TokenCard label="Text Color" token="--foreground" value="#FFFFFF" color="var(--foreground)" onClick={() => handleTokenClick('--foreground', 'Text Color', '#FFFFFF')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard label="Border" token="--border" value="#2B2B2B" color="var(--border)" onClick={() => handleTokenClick('--border', 'Border', '#2B2B2B')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard label="Close Icon" token="--muted-foreground" value="#A1A1A1" color="var(--muted-foreground)" onClick={() => handleTokenClick('--muted-foreground', 'Close Icon', '#A1A1A1')} isHighlighted={highlightedToken === '--muted-foreground'} />
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

          <Tabs defaultValue="jsx" style={{ width: '100%' }}>
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
          </Tabs>
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
                      <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>Escape</kbd> - Close drawer</li>
                      <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>Tab</kbd> - Navigate through drawer content</li>
                      <li>Focus is trapped within the drawer when open</li>
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>ARIA Attributes</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li><code>role="dialog"</code> for screen reader support</li>
                      <li><code>aria-modal="true"</code> indicates modal behavior</li>
                      <li><code>aria-labelledby</code> connects to drawer title</li>
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
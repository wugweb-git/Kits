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
import { AlertDialog } from '../../wugweb/AlertDialog';
import { copyToClipboard } from '../../../utils/clipboard';

export function AlertDialogDoc() {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = React.useState<'default' | 'destructive' | 'warning' | 'info'>('default');
  const [showBackButton, setShowBackButton] = React.useState(false);
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

  const jsxCode = `import { AlertDialog } from './components/wugweb/AlertDialog';

const [isOpen, setIsOpen] = React.useState(false);

<>
  <Button onClick={() => setIsOpen(true)}>
    Show Alert
  </Button>

  <AlertDialog
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Alert title"
    description="Pull request #9999 merged after a successful build"
    variant="${selectedVariant}"
    ${showBackButton ? 'showBackButton={true}' : ''}
    actions={
      <AlertDialogActions
        primaryAction={{
          label: "Confirm",
          onClick: () => setIsOpen(false),
          variant: "primary"
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setIsOpen(false)
        }}
      />
    }
  />
</>

// Design Tokens Used:
// Background: var(--surface-900) | var(--destructive)
// Text: var(--foreground)
// Description: var(--muted-foreground)
// Overlay: var(--overlay-background)
// Border: var(--border)`;

  const cssCode = `.alert-dialog-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-background);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.alert-dialog {
  background: white;
  border-radius: var(--radius-md);
  max-width: 432px;
  width: 100%;
  border: 1px solid var(--border);
}

.alert-dialog-content {
  display: flex;
  gap: var(--spacing-1);
  align-items: flex-start;
  padding: var(--spacing-2);
}

.alert-dialog-title {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--foreground);
}

.alert-dialog-description {
  font-size: var(--text-sm);
  color: var(--muted-foreground);
  line-height: 1.5;
}

.alert-dialog-close {
  display: flex;
  align-items: center;
  justify-center;
  flex-shrink: 0;
  padding: 4px;
  border-radius: var(--radius-sm);
  color: var(--muted-foreground);
  transition: background var(--motion-duration-fast);
}

.alert-dialog-close:hover {
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
          <span style={{ color: 'var(--foreground)' }}>Alert Dialog</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Alert Dialog
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Overlay</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A modal dialog that interrupts the user with important content and expects a response. Perfect for confirmations, warnings, and critical notifications.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Variants</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>4</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Tokens</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>7</div>
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
              <Button onClick={() => setIsAlertOpen(true)} variant="outline" size="sm" className="button-micro focus-ring-accent" style={{ gap: '8px', background: 'var(--background)', borderColor: 'var(--border)' }}>
                <AlertCircle size={16} />
                Show Alert Dialog
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
                    {(['default', 'destructive', 'warning', 'info'] as const).map((variant) => (
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>
                    <input
                      type="checkbox"
                      checked={showBackButton}
                      onChange={(e) => setShowBackButton(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    Show Back Button
                  </label>
                </div>
              </div>

              <div style={{ padding: isMobile ? '32px' : '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <Button onClick={() => setIsAlertOpen(true)} variant="default" style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                  <AlertCircle size={16} />
                  Show Alert Dialog
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Alert Dialog Component */}
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title="Alert title"
        description="Pull request #9999 merged after a successful build"
        variant={selectedVariant}
        showBackButton={showBackButton}
        onBack={() => console.log('Back clicked')}
        actions={
          <AlertDialogActions
            primaryAction={{
              label: "Confirm",
              onClick: () => setIsAlertOpen(false),
              variant: selectedVariant === 'destructive' ? 'destructive' : 'primary'
            }}
            secondaryAction={{
              label: "Cancel",
              onClick: () => setIsAlertOpen(false)
            }}
          />
        }
      />

      {/* Design Tokens */}
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Design Tokens</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Click on any token to highlight it in the preview above</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          <TokenCard label="Background" token="--surface-900" value="#121212" color="var(--surface-900)" onClick={() => handleTokenClick('--surface-900', 'Background', '#121212')} isHighlighted={highlightedToken === '--surface-900'} />
          <TokenCard label="Overlay" token="--overlay-background" value="rgba(0,0,0,0.6)" color="var(--overlay-background)" onClick={() => handleTokenClick('--overlay-background', 'Overlay', 'rgba(0,0,0,0.6)')} isHighlighted={highlightedToken === '--overlay-background'} />
          <TokenCard label="Title Text" token="--foreground" value="#FFFFFF" color="var(--foreground)" onClick={() => handleTokenClick('--foreground', 'Title Text', '#FFFFFF')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard label="Description Text" token="--muted-foreground" value="#DFDFDF" color="var(--muted-foreground)" onClick={() => handleTokenClick('--muted-foreground', 'Description Text', '#DFDFDF')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard label="Destructive" token="--destructive" value="#EF4343" color="var(--destructive)" onClick={() => handleTokenClick('--destructive', 'Destructive', '#EF4343')} isHighlighted={highlightedToken === '--destructive'} />
          <TokenCard label="Border" token="--border" value="#1A1A1A" color="var(--border)" onClick={() => handleTokenClick('--border', 'Border', '#1A1A1A')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard label="Border Radius" token="--radius-md" value="8px" isRadius onClick={() => handleTokenClick('--radius-md', 'Border Radius', '8px')} isHighlighted={highlightedToken === '--radius-md'} />
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
                      <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>Escape</kbd> - Close alert dialog</li>
                      <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>Tab</kbd> - Navigate between actions</li>
                      <li>Focus is trapped within the dialog when open</li>
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>ARIA Attributes</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li><code>role="alertdialog"</code> for screen reader support</li>
                      <li><code>aria-modal="true"</code> indicates modal behavior</li>
                      <li><code>aria-labelledby</code> connects to dialog title</li>
                      <li><code>aria-describedby</code> connects to dialog description</li>
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
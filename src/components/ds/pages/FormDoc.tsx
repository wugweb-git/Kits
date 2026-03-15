import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Copy, Check, X, ChevronRight, Keyboard, ExternalLink, Send } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Form, FormField, FormSubmitButton } from '../../wugweb/Form';

export function FormDoc() {
  const [selectedLayout, setSelectedLayout] = React.useState<'vertical' | 'horizontal' | 'inline'>('horizontal');
  const [selectedVariant, setSelectedVariant] = React.useState<'default' | 'accent' | 'card'>('accent');
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Form submitted!');
  };

  const jsxCode = `import { Form, FormField, FormSubmitButton } from './components/wugweb/Form';

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Handle form submission
};

<Form
  title="Ready to start a project?"
  description="Get in touch with our team"
  onSubmit={handleSubmit}
  layout="${selectedLayout}"
  variant="${selectedVariant}"
>
  <FormField
    label="Full Name"
    name="name"
    type="text"
    placeholder="John Doe"
    required
  />
  
  <FormField
    label="Email Address"
    name="email"
    type="email"
    placeholder="john@example.com"
    required
  />
  
  <FormSubmitButton variant="primary">
    Submit
  </FormSubmitButton>
</Form>

// Design Tokens Used:
// Background: var(--accent) | var(--card)
// Text: var(--accent-foreground) | var(--foreground)
// Input Background: var(--input-background)
// Input Border: var(--border)
// Border Radius: var(--radius-md)
// Spacing: var(--spacing-1) to var(--spacing-5)`;

  const cssCode = `.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-5);
  border-radius: var(--radius-lg);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.form-field label {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
}

.form-field input {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-1);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--input-background);
  color: var(--foreground);
  font-size: var(--text-base);
  transition: all var(--motion-duration-fast);
}

.form-field input:focus {
  border-color: var(--ring);
  box-shadow: var(--focus-ring-accent);
  outline: none;
}

.form-submit {
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  background: var(--primary);
  color: var(--primary-foreground);
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--motion-duration-fast);
}`;

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* Premium Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', width: '100%', boxSizing: 'border-box' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Forms</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Form</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Form
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Forms</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A comprehensive form component with built-in field management, validation support, and flexible layouts. Perfect for contact forms, sign-ups, CTAs, and data collection.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Layouts</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>3</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Variants</div>
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
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Layout</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['vertical', 'horizontal', 'inline'] as const).map((layout) => (
                      <Button 
                        key={layout} 
                        onClick={() => setSelectedLayout(layout)} 
                        variant={selectedLayout === layout ? 'default' : 'outline'} 
                        size="sm" 
                        className="button-micro" 
                        style={{ 
                          fontSize: 'var(--text-sm)', 
                          textTransform: 'capitalize', 
                          background: selectedLayout === layout ? 'var(--accent)' : 'var(--background)', 
                          color: selectedLayout === layout ? 'var(--accent-foreground)' : 'var(--foreground)', 
                          borderColor: 'var(--border)' 
                        }}
                      >
                        {layout}
                      </Button>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Variant</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['default', 'accent', 'card'] as const).map((variant) => (
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
              </div>

              <div style={{ padding: isMobile ? '16px' : '24px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', minHeight: '200px' }}>
                <Form
                  title="Ready to start a project?"
                  onSubmit={handleSubmit}
                  layout={selectedLayout}
                  variant={selectedVariant}
                >
                  <FormField
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                  
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                  
                  <FormSubmitButton variant="primary">
                    <Send size={16} />
                    Submit
                  </FormSubmitButton>
                </Form>
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
          <TokenCard label="Accent Background" token="--accent" value="#FFBE1A" color="var(--accent)" onClick={() => handleTokenClick('--accent', 'Accent Background', '#FFBE1A')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard label="Accent Text" token="--accent-foreground" value="#121212" color="var(--accent-foreground)" onClick={() => handleTokenClick('--accent-foreground', 'Accent Text', '#121212')} isHighlighted={highlightedToken === '--accent-foreground'} />
          <TokenCard label="Input Background" token="--input-background" value="#1C1C1C" color="var(--input-background)" onClick={() => handleTokenClick('--input-background', 'Input Background', '#1C1C1C')} isHighlighted={highlightedToken === '--input-background'} />
          <TokenCard label="Input Border" token="--border" value="#2B2B2B" color="var(--border)" onClick={() => handleTokenClick('--border', 'Input Border', '#2B2B2B')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard label="Focus Ring" token="--ring" value="#FFBE1A" color="var(--ring)" onClick={() => handleTokenClick('--ring', 'Focus Ring', '#FFBE1A')} isHighlighted={highlightedToken === '--ring'} />
          <TokenCard label="Border Radius" token="--radius-md" value="8px" isRadius onClick={() => handleTokenClick('--radius-md', 'Border Radius', '8px')} isHighlighted={highlightedToken === '--radius-md'} />
          <TokenCard label="Large Spacing" token="--spacing-5" value="40px" isSpacing onClick={() => handleTokenClick('--spacing-5', 'Large Spacing', '40px')} isHighlighted={highlightedToken === '--spacing-5'} />
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
                      <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>Tab</kbd> - Navigate between form fields</li>
                      <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>Enter</kbd> - Submit form</li>
                      <li>Form elements are keyboard accessible with visible focus indicators</li>
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Best Practices</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li>All form fields have associated labels</li>
                      <li>Required fields are clearly marked</li>
                      <li>Error messages are announced to screen readers</li>
                      <li>Focus states are clearly visible</li>
                      <li>Form inputs support browser autofill</li>
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

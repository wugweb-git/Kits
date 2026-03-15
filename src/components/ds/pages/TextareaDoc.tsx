import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Copy, Check, ChevronRight, ExternalLink, CheckCircle2, XCircle, Keyboard, AlertCircle, X } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Textarea } from '../../wugweb/Textarea';

export function TextareaDoc() {
  const [selectedState, setSelectedState] = React.useState<'default' | 'focused' | 'disabled' | 'error'>('default');
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [showCode, setShowCode] = React.useState(true);
  const [showGuidelines, setShowGuidelines] = React.useState(true);
  const [showAccessibility, setShowAccessibility] = React.useState(true);
  const [value, setValue] = React.useState('');
  
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

  const jsxCode = `import { Textarea } from './components/wugweb/Textarea';

<Textarea
  label="Message"
  placeholder="Type your message here..."
  helperText="We will reply within 24 hours."
  maxLength={500}
  showCount
  required
/>

// Design Tokens Used:
// Background: var(--input-background)
// Border: var(--border)
// Text: var(--foreground)
// Focus Ring: var(--ring)
// Border Radius: var(--radius-md)
// Hover Border: var(--accent)`;

  const cssCode = `.textarea {
  width: 100%;
  padding: var(--spacing-3);
  background: var(--input-background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--foreground);
  font-family: 'Inter Tight', sans-serif;
  font-size: var(--text-base);
  line-height: 1.5;
  resize: vertical;
  transition: all var(--motion-duration-fast) var(--motion-easing-standard);
}

.textarea:focus {
  outline: none;
  border-color: var(--ring);
  box-shadow: var(--focus-ring-accent);
}

.textarea:hover:not(:disabled) {
  border-color: var(--accent);
}

.textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--muted);
}

.textarea.error {
  border-color: var(--destructive);
}`;

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* Premium Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', width: '100%', boxSizing: 'border-box' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Inputs</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Textarea</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Textarea
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Inputs</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A multi-line text input field for collecting longer form content like messages, comments, or descriptions. Supports auto-resizing, validation states, and character limits.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>States</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>4</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Tokens</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>6</div>
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
              
              {/* Controls */}
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>State</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['default', 'disabled', 'error'] as const).map((state) => (
                      <Button 
                        key={state} 
                        onClick={() => setSelectedState(state)} 
                        variant={selectedState === state ? 'default' : 'outline'} 
                        size="sm" 
                        className="button-micro" 
                        style={{ 
                          fontSize: 'var(--text-sm)', 
                          textTransform: 'capitalize', 
                          background: selectedState === state ? 'var(--accent)' : 'var(--background)', 
                          color: selectedState === state ? 'var(--accent-foreground)' : 'var(--foreground)'
                        }}
                      >
                        {state}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Area */}
              <div style={{ padding: isMobile ? '32px 16px' : '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                <div style={{ width: '100%', maxWidth: '500px' }}>
                  <Textarea
                    label="Message"
                    placeholder="Type your message here..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={selectedState === 'disabled'}
                    error={selectedState === 'error'}
                    errorMessage={selectedState === 'error' ? "Please enter a valid message" : undefined}
                    helperText="We will reply within 24 hours."
                    showCount
                    maxLength={500}
                    rows={4}
                  />
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </section>

      {/* Anatomy Section */}
      <section className="animate-fade-in-up" style={{ animationDelay: '150ms', width: '100%', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '16px', margin: 0 }}>Anatomy</h2>
        
        <Card className="card-hover-lift" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <CardContent style={{ padding: isMobile ? '24px' : '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', width: '100%' }}>
              
              {/* Anatomy Illustration */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Label</label>
                  <div style={{ 
                    width: '100%', 
                    height: '120px', 
                    padding: '12px', 
                    border: '2px solid var(--accent)', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--input-background)',
                    position: 'relative'
                  }}>
                    <span style={{ color: 'var(--muted-foreground)' }}>Placeholder text...</span>
                    <span style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>0/500</span>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>Helper text</span>
                </div>
              </div>

              {/* Anatomy Labels */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', 
                gap: isMobile ? '12px' : '16px', 
                width: '100%', 
                padding: isMobile ? '16px' : '20px', 
                background: 'var(--muted)', 
                borderRadius: 'var(--radius-md)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Border</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Padding</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Focus Ring</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Label</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Helper Text</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Counter</span>
                </div>
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
          <TokenCard label="Background" token="--input-background" value="#1C1C1C" color="var(--input-background)" onClick={() => handleTokenClick('--input-background', 'Background', '#1C1C1C')} isHighlighted={highlightedToken === '--input-background'} />
          <TokenCard label="Border" token="--border" value="#2B2B2B" color="var(--border)" onClick={() => handleTokenClick('--border', 'Border', '#2B2B2B')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard label="Text Color" token="--foreground" value="#FFFFFF" color="var(--foreground)" onClick={() => handleTokenClick('--foreground', 'Text Color', '#FFFFFF')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard label="Focus Ring" token="--ring" value="#FFBE1A" color="var(--ring)" onClick={() => handleTokenClick('--ring', 'Focus Ring', '#FFBE1A')} isHighlighted={highlightedToken === '--ring'} />
          <TokenCard label="Placeholder" token="--muted-foreground" value="#A1A1A1" color="var(--muted-foreground)" onClick={() => handleTokenClick('--muted-foreground', 'Placeholder', '#A1A1A1')} isHighlighted={highlightedToken === '--muted-foreground'} />
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

      {/* Usage Guidelines */}
      {showGuidelines && (
        <section className="animate-fade-in-up" style={{ animationDelay: '300ms', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>Usage Guidelines</h2>
            <Button onClick={() => setShowGuidelines(!showGuidelines)} variant="ghost" size="sm" className="button-micro" style={{ gap: '8px' }}>
              <X size={16} />
              Hide
            </Button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
            
            {/* Do */}
            <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
              <CardContent style={{ padding: isMobile ? '20px' : '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'rgba(0, 158, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={18} style={{ color: '#009E69' }} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Do</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  <li>Always include clear, descriptive labels above textareas</li>
                  <li>Use placeholder text for examples, not instructions</li>
                  <li>Provide helpful error messages when validation fails</li>
                  <li>Show character count when there is a maximum limit</li>
                  <li>Allow vertical resizing to fit more content</li>
                </ul>
              </CardContent>
            </Card>

            {/* Don't */}
            <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
              <CardContent style={{ padding: isMobile ? '20px' : '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'rgba(239, 67, 67, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <XCircle size={18} style={{ color: 'var(--destructive)' }} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Don't</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  <li>Don't use placeholder text as a replacement for labels</li>
                  <li>Don't disable textareas without explaining why</li>
                  <li>Don't set fixed heights that cut off content</li>
                  <li>Don't use generic error messages like "Invalid input"</li>
                  <li>Don't hide character limits until the user exceeds them</li>
                </ul>
              </CardContent>
            </Card>

          </div>
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
                      <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>Tab</kbd> - Focus textarea</li>
                      <li>Standard text editing shortcuts work within the textarea</li>
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Best Practices</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li>Always provide a label for screen readers</li>
                      <li>Use placeholder text as guidance, not as a label</li>
                      <li>Show character count when there's a limit</li>
                      <li>Provide clear error messages when validation fails</li>
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

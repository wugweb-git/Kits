import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Copy, Check, ChevronRight, ExternalLink, CheckCircle2, XCircle, Keyboard, Sparkles, AlertCircle, X } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';

export function InputTextDoc() {
  const [selectedState, setSelectedState] = React.useState<'default' | 'focused' | 'disabled' | 'error'>('default');
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [showCode, setShowCode] = React.useState(true);
  const [showGuidelines, setShowGuidelines] = React.useState(true);
  const [showAccessibility, setShowAccessibility] = React.useState(true);
  const [inputValue, setInputValue] = React.useState('');
  
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

  const getInputStyles = () => {
    const baseStyles = {
      width: '100%',
      height: '48px',
      padding: '0 16px',
      fontSize: 'var(--text-base)',
      fontFamily: 'inherit',
      color: 'var(--foreground)',
      background: 'var(--background)',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'var(--border)',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
      boxSizing: 'border-box' as const
    };

    if (selectedState === 'focused') {
      return {
        ...baseStyles,
        borderColor: 'var(--ring)',
        boxShadow: '0 0 0 3px rgba(255, 190, 26, 0.1)'
      };
    }

    if (selectedState === 'error') {
      return {
        ...baseStyles,
        borderColor: 'var(--destructive)',
        boxShadow: 'none'
      };
    }

    if (selectedState === 'disabled') {
      return {
        ...baseStyles,
        opacity: 0.5,
        cursor: 'not-allowed',
        background: 'var(--muted)'
      };
    }

    return baseStyles;
  };

  const jsxCode = `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <label 
    htmlFor="email"
    style={{ 
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--foreground)'
    }}
  >
    Email Address
  </label>
  
  <input
    id="email"
    type="email"
    placeholder="you@example.com"
    style={{
      width: '100%',
      height: '48px',
      padding: '0 16px',
      fontSize: 'var(--text-base)',
      color: 'var(--foreground)',
      background: 'var(--background)',
      border: '2px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)'
    }}
  />
</div>

// Design Tokens Used:
// Background: var(--background)
// Border: var(--border)
// Focus Ring: var(--ring)
// Text: var(--foreground)
// Placeholder: var(--muted-foreground)
// Border Radius: var(--radius-md)`;

  const cssCode = `.input-field {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  font-size: var(--text-base);
  color: var(--foreground);
  background: var(--background);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  outline: none;
  transition: all var(--motion-duration-fast) var(--motion-easing-standard);
}

.input-field:focus {
  border-color: var(--ring);
  box-shadow: 0 0 0 3px rgba(255, 190, 26, 0.1);
}

.input-field:hover:not(:disabled) {
  border-color: var(--muted-foreground);
}

.input-field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--muted);
}

.input-field.error {
  border-color: var(--destructive);
}

.input-field::placeholder {
  color: var(--muted-foreground);
  opacity: 0.6;
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
          <span style={{ color: 'var(--foreground)' }}>Input Text</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Input Text
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Inputs</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A foundational form control that allows users to enter and edit text. Supports labels, placeholder text, validation states, and accessibility features for seamless data input.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>States</div>
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
              <Button onClick={copyPageLink} variant="outline" size="sm" className="button-micro focus-ring-accent" style={{ gap: '8px', background: 'var(--background)' }}>
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="outline" size="sm" className="button-micro focus-ring-accent" style={{ gap: '8px', background: 'var(--background)' }}>
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
                    {(['default', 'focused', 'disabled', 'error'] as const).map((state) => (
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
              <div style={{ padding: isMobile ? '32px 16px' : '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label 
                      htmlFor="preview-input"
                      style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--foreground)'
                      }}
                    >
                      Email Address
                    </label>
                    
                    <input
                      id="preview-input"
                      type="email"
                      placeholder="you@example.com"
                      disabled={selectedState === 'disabled'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="smooth-transition"
                      style={getInputStyles()}
                    />
                    
                    {selectedState === 'error' && (
                      <span style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--destructive)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <AlertCircle size={14} style={{ flexShrink: 0 }} />
                        Please enter a valid email address
                      </span>
                    )}
                  </div>
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
              
              {/* Input Illustration */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                <input
                  type="text"
                  placeholder="Placeholder text"
                  disabled
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 16px',
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    background: 'var(--background)',
                    border: '2px solid var(--ring)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    boxShadow: '0 0 0 3px rgba(255, 190, 26, 0.1)',
                    boxSizing: 'border-box'
                  }}
                />
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
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Radius</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Placeholder</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Text</span>
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
          <TokenCard label="Background" token="--background" value="#FFFFFF" color="var(--background)" onClick={() => handleTokenClick('--background', 'Background', '#FFFFFF')} isHighlighted={highlightedToken === '--background'} />
          <TokenCard label="Border" token="--border" value="#DFDFDF" color="var(--border)" onClick={() => handleTokenClick('--border', 'Border', '#DFDFDF')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard label="Text Color" token="--foreground" value="#191919" color="var(--foreground)" onClick={() => handleTokenClick('--foreground', 'Text Color', '#191919')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard label="Focus Ring" token="--ring" value="#FFBE1A" color="var(--ring)" onClick={() => handleTokenClick('--ring', 'Focus Ring', '#FFBE1A')} isHighlighted={highlightedToken === '--ring'} />
          <TokenCard label="Error" token="--destructive" value="#EF4343" color="var(--destructive)" onClick={() => handleTokenClick('--destructive', 'Error', '#EF4343')} isHighlighted={highlightedToken === '--destructive'} />
          <TokenCard label="Placeholder" token="--muted-foreground" value="#7D7D7D" color="var(--muted-foreground)" onClick={() => handleTokenClick('--muted-foreground', 'Placeholder', '#7D7D7D')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard label="Border Radius" token="--radius-md" value="6px" isRadius onClick={() => handleTokenClick('--radius-md', 'Border Radius', '6px')} isHighlighted={highlightedToken === '--radius-md'} />
        </div>
      </section>

      {/* Code Examples */}
      {showCode && (
        <section className="animate-fade-in-up" style={{ animationDelay: '250ms', width: '100%', boxSizing: 'border-box' }}>
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
              <CollapsibleCodeBlock code={jsxCode} language="jsx" />
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
                  <li>Always include clear, descriptive labels above inputs</li>
                  <li>Use placeholder text for examples, not instructions</li>
                  <li>Provide helpful error messages when validation fails</li>
                  <li>Show focus states clearly for keyboard navigation</li>
                  <li>Use appropriate input types (email, tel, search)</li>
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
                  <li>Don't disable inputs without explaining why</li>
                  <li>Don't make inputs too small or too large</li>
                  <li>Don't use vague error messages like "Invalid input"</li>
                  <li>Don't remove focus indicators for accessibility</li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </section>
      )}

      {/* Accessibility */}
      {showAccessibility && (
        <section className="animate-fade-in-up" style={{ animationDelay: '350ms', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Accessibility</h2>
            <Button onClick={() => setShowAccessibility(!showAccessibility)} variant="ghost" size="sm" className="button-micro" style={{ gap: '8px' }}>
              <X size={16} />
              Hide
            </Button>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: '16px', margin: '0 0 16px 0' }}>
            WCAG AA compliant input implementation
          </p>

          <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
            <CardContent style={{ padding: isMobile ? '20px' : '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Color Contrast */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <CheckCircle2 size={20} style={{ color: '#009E69', flexShrink: 0 }} />
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Color Contrast</h3>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.6 }}>
                    Text and border colors meet WCAG 2.1 AA standards with minimum 4.5:1 contrast ratio. Focus rings use accent color with 3:1 contrast.
                  </p>
                </div>

                {/* Keyboard Navigation */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Keyboard size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Keyboard Navigation</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                    <li>
                      <kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: '0.9em', fontFamily: 'monospace' }}>Tab</kbd> - Navigate to input field
                    </li>
                    <li>
                      <kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: '0.9em', fontFamily: 'monospace' }}>Shift+Tab</kbd> - Navigate backward
                    </li>
                    <li>
                      <kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: '0.9em', fontFamily: 'monospace' }}>Enter</kbd> - Submit form (if in form)
                    </li>
                  </ul>
                </div>

                {/* ARIA & Labels */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Sparkles size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>ARIA & Labels</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                    <li>
                      Use <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em', fontFamily: 'monospace' }}>htmlFor</code> to associate labels with inputs
                    </li>
                    <li>
                      Add <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em', fontFamily: 'monospace' }}>aria-invalid</code> for error states
                    </li>
                    <li>
                      Use <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em', fontFamily: 'monospace' }}>aria-describedby</code> for error messages
                    </li>
                    <li>
                      Include <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em', fontFamily: 'monospace' }}>aria-required</code> for required fields
                    </li>
                  </ul>
                </div>

              </div>
            </CardContent>
          </Card>
        </section>
      )}

    </div>
  );
}
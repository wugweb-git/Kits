import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Copy, Check, ChevronRight, ExternalLink, CheckCircle2, XCircle, Sparkles, Keyboard, Circle } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';

export function RadioButtonDoc() {
  const [selectedState, setSelectedState] = React.useState<'default' | 'disabled'>('default');
  const [selectedValue, setSelectedValue] = React.useState('option1');
  const [showLabel, setShowLabel] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [showCode, setShowCode] = React.useState(true);
  const [showGuidelines, setShowGuidelines] = React.useState(true);
  const [showAccessibility, setShowAccessibility] = React.useState(true);
  
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

  const jsxCode = `import { Circle } from 'lucide-react';

// Radio Group Component
<div role="radiogroup" aria-labelledby="radio-group-label" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
  <label id="radio-group-label" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
    Select an option
  </label>
  
  {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
    <label 
      key={option}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: '${selectedState === 'disabled' ? 'not-allowed' : 'pointer'}',
        userSelect: 'none'
      }}
    >
      <input
        type="radio"
        name="demo-radio"
        value={option}
        checked={selectedValue === option}
        onChange={() => setSelectedValue(option)}
        ${selectedState === 'disabled' ? 'disabled' : ''}
        style={{ display: 'none' }}
        ${!showLabel ? `aria-label={option}` : ''}
      />
      
      <div
        className="smooth-transition"
        style={{
          position: 'relative',
          width: '20px',
          height: '20px',
          borderRadius: 'var(--radius-full)',
          border: '2px solid ' + (selectedValue === option ? 'var(--foreground)' : 'var(--border)'),
          background: 'var(--background)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: '${selectedState === 'disabled' ? '0.5' : '1'}'
        }}
      >
        {selectedValue === option && (
          <div 
            style={{ 
              width: '10px',
              height: '10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--foreground)'
            }} 
          />
        )}
      </div>
      
      ${showLabel ? `<span style={{
        fontSize: 'var(--text-sm)',
        color: '${selectedState === 'disabled' ? 'var(--muted-foreground)' : 'var(--foreground)'}',
        fontWeight: 'var(--font-weight-medium)'
      }}>
        {option}
      </span>` : `{/* Label is hidden visually but accessible via aria-label */}`}
    </label>
  ))}
</div>

// Design Tokens Used:
// Radio Border (Checked): var(--foreground)
// Radio Border (Unchecked): var(--border)
// Radio Indicator: var(--foreground)
// Background: var(--background)
// Text: var(--foreground), var(--muted-foreground)
// Border Radius: var(--radius-full)`;

  const cssCode = `.radio-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.radio-input {
  display: none;
}

.radio-box {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  border: 2px solid var(--border);
  background: var(--background);
  transition: all var(--motion-duration-fast) var(--motion-easing-standard);
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-input:checked + .radio-box {
  border-color: var(--foreground);
}

.radio-indicator {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  background: var(--foreground);
  transform: scale(0);
  transition: transform var(--motion-duration-fast) var(--motion-easing-emphasized);
}

.radio-input:checked + .radio-box .radio-indicator {
  transform: scale(1);
}

.radio-input:disabled + .radio-box {
  opacity: 0.5;
  cursor: not-allowed;
}

.radio-label {
  font-size: var(--text-sm);
  color: var(--foreground);
  font-weight: var(--font-weight-medium);
}`;

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', width: '100%', boxSizing: 'border-box' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Inputs</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Radio Button</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--foreground) 0%, var(--muted-foreground) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Radio Button
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--foreground)', color: 'var(--foreground)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Core Component</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Inputs</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A selection control that allows users to choose a single option from a set of mutually exclusive choices. Designed for clarity and ease of use with clear visual states.
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
              
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>State</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['default', 'disabled'] as const).map((state) => (
                      <Button 
                        key={state} 
                        onClick={() => setSelectedState(state)} 
                        variant={selectedState === state ? 'default' : 'outline'} 
                        size="sm" 
                        className="button-micro" 
                        style={{ 
                          fontSize: 'var(--text-sm)', 
                          textTransform: 'capitalize', 
                          background: selectedState === state ? 'var(--foreground)' : 'var(--background)', 
                          color: selectedState === state ? 'var(--background)' : 'var(--foreground)', 
                          borderColor: 'var(--border)' 
                        }}
                      >
                        {state}
                      </Button>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Label Visibility</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <Button 
                      onClick={() => setShowLabel(true)} 
                      variant={showLabel ? 'default' : 'outline'} 
                      size="sm" 
                      className="button-micro" 
                      style={{ 
                        fontSize: 'var(--text-sm)', 
                        background: showLabel ? 'var(--foreground)' : 'var(--background)', 
                        color: showLabel ? 'var(--background)' : 'var(--foreground)', 
                        borderColor: 'var(--border)' 
                      }}
                    >
                      Visible
                    </Button>
                    <Button 
                      onClick={() => setShowLabel(false)} 
                      variant={!showLabel ? 'default' : 'outline'} 
                      size="sm" 
                      className="button-micro" 
                      style={{ 
                        fontSize: 'var(--text-sm)', 
                        background: !showLabel ? 'var(--foreground)' : 'var(--background)', 
                        color: !showLabel ? 'var(--background)' : 'var(--foreground)', 
                        borderColor: 'var(--border)' 
                      }}
                    >
                      Hidden
                    </Button>
                  </div>
                </div>
              </div>

              <div style={{ padding: isMobile ? '32px 16px' : '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '16px' }}>
                <div role="radiogroup" aria-labelledby="preview-label" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '300px' }}>
                  <label id="preview-label" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', marginBottom: '4px' }}>
                    Select a plan
                  </label>
                  
                  {['Starter Plan', 'Pro Plan', 'Enterprise Plan'].map((option) => (
                    <label 
                      key={option}
                      onClick={() => {
                        if (selectedState !== 'disabled') {
                          setSelectedValue(option);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: selectedState === 'disabled' ? 'not-allowed' : 'pointer',
                        userSelect: 'none',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)'
                      }}
                      className={selectedState !== 'disabled' ? 'hover:border-foreground/50' : ''}
                    >
                      <div
                        role="radio"
                        aria-checked={selectedValue === option}
                        aria-disabled={selectedState === 'disabled'}
                        className="smooth-transition"
                        style={{
                          position: 'relative',
                          width: '20px',
                          height: '20px',
                          borderRadius: 'var(--radius-full)',
                          border: `2px solid ${selectedValue === option ? 'var(--foreground)' : 'var(--border)'}`,
                          background: 'var(--background)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: selectedState === 'disabled' ? 0.5 : 1,
                          flexShrink: 0
                        }}
                      >
                        {selectedValue === option && (
                          <div 
                            style={{ 
                              width: '10px',
                              height: '10px',
                              borderRadius: 'var(--radius-full)',
                              background: 'var(--foreground)',
                              animation: 'scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                            }} 
                          />
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {showLabel && (
                          <span style={{
                            fontSize: 'var(--text-sm)',
                            color: selectedState === 'disabled' ? 'var(--muted-foreground)' : 'var(--foreground)',
                            fontWeight: 'var(--font-weight-medium)'
                          }}>
                            {option}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
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
          <TokenCard label="Checked Border" token="--foreground" value="#191919" color="var(--foreground)" onClick={() => handleTokenClick('--foreground', 'Checked Border', '#191919')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard label="Unchecked Border" token="--border" value="#DFDFDF" color="var(--border)" onClick={() => handleTokenClick('--border', 'Unchecked Border', '#DFDFDF')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard label="Indicator Color" token="--foreground" value="#191919" color="var(--foreground)" onClick={() => handleTokenClick('--foreground', 'Indicator Color', '#191919')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard label="Background" token="--background" value="#FFFFFF" color="var(--background)" onClick={() => handleTokenClick('--background', 'Background', '#FFFFFF')} isHighlighted={highlightedToken === '--background'} />
          <TokenCard label="Label Color" token="--foreground" value="#191919" color="var(--foreground)" onClick={() => handleTokenClick('--foreground', 'Label Color', '#191919')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard label="Border Radius" token="--radius-full" value="9999px" isRadius onClick={() => handleTokenClick('--radius-full', 'Border Radius', '9999px')} isHighlighted={highlightedToken === '--radius-full'} />
        </div>
      </section>

      {/* Code Examples */}
      {showCode && (
        <section className="animate-fade-in-up" style={{ animationDelay: '300ms', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>Code Examples</h2>
            <Button onClick={() => setShowCode(!showCode)} variant="ghost" size="sm" className="button-micro" style={{ gap: '8px' }}>
              <XCircle size={16} />
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
        <section className="animate-fade-in-up" style={{ animationDelay: '400ms', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>Usage Guidelines</h2>
            <Button onClick={() => setShowGuidelines(!showGuidelines)} variant="ghost" size="sm" className="button-micro" style={{ gap: '8px' }}>
              <XCircle size={16} />
              Hide
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px', width: '100%' }}>
            <Card className="card-hover-lift" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
              <CardContent style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'rgba(0, 158, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={18} style={{ color: '#009E69' }} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Do</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  <li>Use for mutually exclusive options where only one choice is allowed</li>
                  <li>List options vertically for better readability</li>
                  <li>Provide a default selection when possible</li>
                  <li>Use clear, concise labels for each option</li>
                  <li>Allow users to tap the label to select the radio button</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover-lift" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
              <CardContent style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'rgba(239, 67, 67, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <XCircle size={18} style={{ color: 'var(--destructive)' }} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Don't</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  <li>Don't use for multi-select options (use Checkboxes instead)</li>
                  <li>Don't use if there are more than 5-7 options (use a Dropdown)</li>
                  <li>Don't let users unselect a radio button (it must always have one state active)</li>
                  <li>Don't nest radio buttons or create complex hierarchies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Accessibility Section */}
      {showAccessibility && (
        <section className="animate-fade-in-up" style={{ animationDelay: '500ms', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Accessibility</h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>WCAG AA compliant radio button implementation</p>
            </div>
            <Button onClick={() => setShowAccessibility(!showAccessibility)} variant="ghost" size="sm" className="button-micro" style={{ gap: '8px' }}>
              <XCircle size={16} />
              Hide
            </Button>
          </div>

          <Card className="card-hover-lift" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
            <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Keyboard size={20} style={{ color: 'var(--foreground)' }} />
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Keyboard Navigation</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                    <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>Tab</kbd> - Focuses the selected radio button or the first one</li>
                    <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>Arrow Keys</kbd> - Moves selection between radio buttons</li>
                    <li><kbd style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>Space</kbd> - Selects the focused radio button (if not already selected)</li>
                  </ul>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Sparkles size={20} style={{ color: 'var(--foreground)' }} />
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>ARIA Attributes</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                    <li>Use <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>role="radiogroup"</code> for the container</li>
                    <li>Use <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>role="radio"</code> for each option</li>
                    <li>Set <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>aria-checked</code> to "true" or "false"</li>
                    <li>Use <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>aria-labelledby</code> to label the group</li>
                  </ul>
                </div>

              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Related Components */}
      <section className="animate-fade-in-up" style={{ animationDelay: '600ms', width: '100%', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '16px' }}>Related Components</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          {[
            { name: 'Checkbox', category: 'Inputs', description: 'Multi-select input control' },
            { name: 'Toggle', category: 'Inputs', description: 'Binary on/off switch' },
            { name: 'Dropdown', category: 'Inputs', description: 'Select from many options' },
          ].map((component) => (
            <Card key={component.name} className="card-grid-item cursor-pointer" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}>
              <CardContent style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Badge variant="outline" style={{ width: 'fit-content', fontSize: 'var(--text-xs)', padding: '2px 8px' }}>{component.category}</Badge>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>{component.name}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>{component.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}

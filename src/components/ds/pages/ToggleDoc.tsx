import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Switch } from '../../ui/switch';
import { Copy, Check, X, ChevronRight, Keyboard, ExternalLink, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';

export function ToggleDoc() {
  const [selectedState, setSelectedState] = React.useState<'off' | 'on' | 'disabled'>('off');
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

  const jsxCode = `import { Switch } from './components/ui/switch';

<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <Switch 
    id="notifications"
    checked={${selectedState === 'on'}}
    disabled={${selectedState === 'disabled'}}
    onCheckedChange={(checked) => console.log(checked)}
    style={{
      '--primary': 'var(--foreground)',
      '--switch-background': 'var(--muted)'
    } as React.CSSProperties}
  />
  <label 
    htmlFor="notifications"
    style={{ 
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-normal)',
      color: 'var(--foreground)',
      cursor: '${selectedState === 'disabled' ? 'not-allowed' : 'pointer'}'
    }}
  >
    Enable notifications
  </label>
</div>

// Design Tokens Used:
// Background (on): var(--foreground)
// Background (off): var(--muted)
// Thumb: var(--background)
// Border Radius: var(--radius-full)`;

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative' }}>
      
      {/* Premium Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Inputs</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Toggle</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Toggle
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Inputs</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A switch control for toggling between two mutually exclusive states (on/off). Perfect for settings, preferences, and feature flags with immediate effect.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>States</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>3</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Tokens</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>4</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>WCAG</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>AA</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Button onClick={copyPageLink} variant="outline" size="sm" className="smooth-transition button-press" style={{ gap: '8px', background: 'var(--background)', borderColor: 'var(--border)' }}>
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="outline" size="sm" className="smooth-transition button-press" style={{ gap: '8px', background: 'var(--background)', borderColor: 'var(--border)' }}>
                <ExternalLink size={16} />
                View in Figma
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="animate-fade-in-up" style={{ animationDelay: '100ms', width: '100%', boxSizing: 'border-box' }}>
        <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>State</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['off', 'on', 'disabled'] as const).map((state) => (
                      <Button key={state} onClick={() => setSelectedState(state)} variant={selectedState === state ? 'default' : 'outline'} size="sm" className="smooth-transition button-press" style={{ fontSize: 'var(--text-sm)', textTransform: 'capitalize', background: selectedState === state ? 'var(--foreground)' : 'var(--background)', color: selectedState === state ? 'var(--background)' : 'var(--foreground)', borderColor: 'var(--border)' }}>
                        {state}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: isMobile ? '32px 16px' : '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Switch 
                    id="preview-toggle"
                    checked={selectedState === 'on'}
                    disabled={selectedState === 'disabled'}
                    onCheckedChange={(checked) => setSelectedState(checked ? 'on' : 'off')}
                    className="data-[state=checked]:bg-[var(--foreground)] data-[state=unchecked]:bg-[var(--muted)]"
                  />
                  <label 
                    htmlFor="preview-toggle" 
                    onClick={() => {
                      if (selectedState !== 'disabled') {
                        setSelectedState(selectedState === 'on' ? 'off' : 'on');
                      }
                    }}
                    style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: selectedState === 'disabled' ? 'var(--muted-foreground)' : 'var(--foreground)', cursor: selectedState === 'disabled' ? 'not-allowed' : 'pointer' }}
                  >
                    Enable notifications
                  </label>
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          <TokenCard label="Background (On)" token="--foreground" value="#191919" type="color" onClick={() => handleTokenClick('--foreground', 'Background (On)', '#191919')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard label="Background (Off)" token="--muted" value="#E1E1E1" type="color" onClick={() => handleTokenClick('--muted', 'Background (Off)', '#E1E1E1')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard label="Thumb Color" token="--background" value="#FFFFFF" type="color" onClick={() => handleTokenClick('--background', 'Thumb Color', '#FFFFFF')} isHighlighted={highlightedToken === '--background'} />
          <TokenCard label="Border Radius" token="--radius-full" value="50%" type="radius" onClick={() => handleTokenClick('--radius-full', 'Border Radius', '50%')} isHighlighted={highlightedToken === '--radius-full'} />
        </div>
      </section>

      {/* Code Examples */}
      {showCode && (
        <section className="animate-fade-in-up" style={{ animationDelay: '300ms', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>Code Examples</h2>
            <Button onClick={() => setShowCode(!showCode)} variant="ghost" size="sm" style={{ gap: '8px' }}>
              <X size={16} />
              Hide
            </Button>
          </div>

          <Tabs defaultValue="jsx" style={{ width: '100%' }}>
            <TabsList style={{ marginBottom: '16px' }}>
              <TabsTrigger value="jsx">React + JSX</TabsTrigger>
            </TabsList>
            
            <TabsContent value="jsx">
              <CollapsibleCodeBlock code={jsxCode} language="jsx" />
            </TabsContent>
          </Tabs>
        </section>
      )}

      {/* Usage Guidelines */}
      {showGuidelines && (
        <section className="animate-fade-in-up" style={{ animationDelay: '400ms', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>Usage Guidelines</h2>
            <Button onClick={() => setShowGuidelines(!showGuidelines)} variant="ghost" size="sm" style={{ gap: '8px' }}>
              <X size={16} />
              Hide
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px', width: '100%' }}>
            <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
              <CardContent style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'rgba(0, 158, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={18} style={{ color: '#009E69' }} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Do</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  <li>Use for immediate on/off actions</li>
                  <li>Use for settings and preferences</li>
                  <li>Provide clear labels indicating the action</li>
                  <li>Show immediate visual feedback</li>
                  <li>Use for binary choices with instant effect</li>
                </ul>
              </CardContent>
            </Card>

            <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
              <CardContent style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'rgba(239, 67, 67, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <XCircle size={18} style={{ color: 'var(--destructive)' }} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Don't</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  <li>Use for actions requiring confirmation</li>
                  <li>Use for multiple selections (use checkbox)</li>
                  <li>Use for mutually exclusive options (use radio)</li>
                  <li>Make the action unclear or ambiguous</li>
                  <li>Disable without clear explanation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Related Components */}
      <section className="animate-fade-in-up" style={{ animationDelay: '500ms', width: '100%', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '16px' }}>Related Components</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          {[
            { name: 'Checkbox', category: 'Inputs', description: 'Multi-select input control' },
            { name: 'Radio Button', category: 'Inputs', description: 'Single-select input control' },
          ].map((component) => (
            <Card key={component.name} className="smooth-transition cursor-pointer hover:border-accent" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}>
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

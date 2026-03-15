import React from 'react';
import { Button } from '../../wugweb/Button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Check, Copy, ExternalLink, X, ChevronRight, ArrowRight, MoreVertical, Menu, Search, Mail, User, Settings, Filter, Plus, Trash2, Layout, Type, MousePointer } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Switch } from '../../ui/switch';
import { cn } from '../../ui/utils';

export function ButtonDoc() {
  const [variant, setVariant] = React.useState<'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'>('primary');
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg' | 'xl'>('xl');
  const [state, setState] = React.useState<'default' | 'active' | 'disabled' | 'loading'>('default');
  const [showLeftIcon, setShowLeftIcon] = React.useState(false);
  const [showRightIcon, setShowRightIcon] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(false);
  
  const [showCode, setShowCode] = React.useState(true);
  const [showGuidelines, setShowGuidelines] = React.useState(true);
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

  // Generate dynamic code based on current state
  const getDynamicCode = () => {
    const props = [];
    if (variant !== 'primary') props.push(`variant="${variant}"`);
    if (size !== 'xl') props.push(`size="${size}"`);
    if (state === 'active') props.push(`state="active"`);
    if (state === 'disabled') props.push(`disabled`);
    if (state === 'loading') props.push(`loading`);
    if (fullWidth) props.push(`fullWidth`);
    if (showLeftIcon) props.push(`leftIcon={<ArrowRight />}`);
    if (showRightIcon) props.push(`rightIcon={<MoreVertical />}`);
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}` : '';
    
    return `import { Button } from "@/components/wugweb/Button";
import { ArrowRight, MoreVertical } from "lucide-react";

export function ButtonDemo() {
  return (
    <Button${propsString}
    >
      Button Label
    </Button>
  );
}`;
  };

  const sectionGap = spacing.sectionGap[breakpoint];

  // Helper to select icon based on context
  const getDemoIcon = (side: 'left' | 'right') => {
    if (side === 'left') return <ArrowRight />;
    return <MoreVertical />;
  };

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* Premium Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', width: '100%', boxSizing: 'border-box' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Surfaces</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Button</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Button
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--primary)', color: 'var(--primary)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Core Component</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v2.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Strict Mode</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A strictly defined button component with locked heights and explicit typography scaling. Ensures consistent actions across the entire application with accessible states and keyboard support.
            </p>

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
        <Card className="card-hover-lift" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'visible', width: '100%', boxSizing: 'border-box' }}>
          <CardContent style={{ padding: isMobile ? '24px' : '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px' }}>
                 {/* Variants */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const).map((v) => (
                        <Button
                          key={v}
                          variant={variant === v ? 'default' : 'outline'}
                          size="sm"
                          className="button-micro"
                          onClick={() => setVariant(v)}
                          style={{ 
                            textTransform: 'capitalize',
                            // Use primary color for selected state instead of accent
                            background: variant === v ? 'var(--primary)' : 'var(--background)',
                            color: variant === v ? 'var(--primary-foreground)' : 'var(--foreground)'
                          }}
                        >
                          {v}
                        </Button>
                      ))}
                    </div>
                 </div>

                 {/* Sizes */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size (Affects Text & Height)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(['xl', 'lg', 'md', 'sm'] as const).map((s) => (
                        <Button
                          key={s}
                          variant={size === s ? 'default' : 'outline'}
                          size="sm"
                          className="button-micro"
                          onClick={() => setSize(s)}
                          style={{ 
                            textTransform: 'uppercase',
                             background: size === s ? 'var(--primary)' : 'var(--background)',
                             color: size === s ? 'var(--primary-foreground)' : 'var(--foreground)'
                          }}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px' }}>
                 {/* State */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(['default', 'active', 'disabled', 'loading'] as const).map((st) => (
                        <Button
                          key={st}
                          variant={state === st ? 'default' : 'outline'}
                          size="sm"
                          className="button-micro"
                          onClick={() => setState(st)}
                          style={{ 
                            textTransform: 'capitalize',
                            background: state === st ? 'var(--primary)' : 'var(--background)',
                            color: state === st ? 'var(--primary-foreground)' : 'var(--foreground)'
                          }}
                        >
                          {st}
                        </Button>
                      ))}
                    </div>
                 </div>

                 {/* Toggles */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Options</label>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Switch checked={fullWidth} onCheckedChange={setFullWidth} id="full-width-toggle" />
                            <label htmlFor="full-width-toggle" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', cursor: 'pointer' }}>Full Width</label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Switch checked={showLeftIcon} onCheckedChange={setShowLeftIcon} id="left-icon-toggle" />
                            <label htmlFor="left-icon-toggle" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', cursor: 'pointer' }}>Left Icon</label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Switch checked={showRightIcon} onCheckedChange={setShowRightIcon} id="right-icon-toggle" />
                            <label htmlFor="right-icon-toggle" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', cursor: 'pointer' }}>Right Icon</label>
                        </div>
                    </div>
                 </div>
              </div>

            </div>

            {/* Preview Area */}
            <div style={{ 
                padding: isMobile ? '32px 16px' : '64px', 
                background: 'var(--surface-900)', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px dashed var(--border)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '240px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ width: fullWidth ? '100%' : 'auto', transition: 'all 0.2s ease' }}>
                    <Button 
                        variant={variant} 
                        size={size}
                        state={state === 'disabled' || state === 'loading' ? 'default' : state}
                        disabled={state === 'disabled'}
                        loading={state === 'loading'}
                        fullWidth={fullWidth}
                        leftIcon={showLeftIcon ? getDemoIcon('left') : undefined}
                        rightIcon={showRightIcon ? getDemoIcon('right') : undefined}
                        className="transition-all duration-300"
                    >
                        Button Label
                    </Button>
                </div>

                {/* Dimensions overlay */}
                <div style={{ 
                    position: 'absolute', 
                    bottom: '12px', 
                    right: '12px', 
                    display: 'flex',
                    gap: '8px',
                    fontSize: 'var(--text-xs)', 
                    color: 'var(--muted-foreground)', 
                    fontFamily: 'monospace',
                }}>
                    <span style={{ background: 'var(--surface-800)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        H: {size === 'xl' ? '70px' : size === 'lg' ? '56px' : size === 'md' ? '48px' : '36px'}
                    </span>
                    <span style={{ background: 'var(--surface-800)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        Text: {size === 'xl' ? '20px' : size === 'lg' ? '18px' : size === 'md' ? '16px' : '14px'}
                    </span>
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
              
              {/* Anatomy Visual */}
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                 <Button size="xl" variant="primary" leftIcon={<ArrowRight />} rightIcon={<MoreVertical />}>
                    Button Label
                 </Button>
                 
                 {/* Annotations would go here in a real SVG, using simplified visual indicators */}
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
                  <Layout size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Fixed Height</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Padding</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MousePointer size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Focus Ring</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Type size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Scaled Typography</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Border Radius</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Icons (Optional)</span>
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
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Strict adherence to the design system.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          <TokenCard label="Background (Primary)" token="--primary" value="#ffffff" color="var(--primary)" onClick={() => handleTokenClick('--primary', 'Background', '#ffffff')} isHighlighted={highlightedToken === '--primary'} />
          <TokenCard label="Text Color" token="--primary-foreground" value="#121212" color="var(--primary-foreground)" onClick={() => handleTokenClick('--primary-foreground', 'Text Color', '#121212')} isHighlighted={highlightedToken === '--primary-foreground'} />
          <TokenCard label="Border (Secondary)" token="--border" value="#2b2b2b" color="var(--border)" onClick={() => handleTokenClick('--border', 'Border', '#2b2b2b')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard label="Font Family" token="Inter Tight" value="Inter Tight" color="transparent" onClick={() => handleTokenClick('Inter Tight', 'Font Family', 'Inter Tight')} isHighlighted={highlightedToken === 'Inter Tight'} />
          <TokenCard label="Radius (XL)" token="--radius-lg" value="12px" isRadius onClick={() => handleTokenClick('--radius-lg', 'Radius', '12px')} isHighlighted={highlightedToken === '--radius-lg'} />
          <TokenCard label="Focus Ring" token="--ring" value="#FFBE1A" color="var(--ring)" onClick={() => handleTokenClick('--ring', 'Focus Ring', '#FFBE1A')} isHighlighted={highlightedToken === '--ring'} />
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
            </TabsList>

            <TabsContent value="jsx">
              <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" />
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
                    <Check size={18} style={{ color: '#009E69' }} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Do</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  <li>Use the appropriate size for the context (e.g., XL for hero actions).</li>
                  <li>Use 'Primary' for the main call to action on a screen.</li>
                  <li>Ensure button text is concise and action-oriented.</li>
                  <li>Use icons to reinforce the meaning of the label.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Don't */}
            <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
              <CardContent style={{ padding: isMobile ? '20px' : '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'rgba(239, 67, 67, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <X size={18} style={{ color: 'var(--destructive)' }} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Don't</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  <li>Don't use multiple Primary buttons in the same view.</li>
                  <li>Don't override the button height or padding manually.</li>
                  <li>Don't use buttons for navigation (use links instead).</li>
                  <li>Don't use arbitrary colors outside the defined variants.</li>
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
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>Built with WAI-ARIA patterns.</p>
                </div>
                <Button onClick={() => setShowAccessibility(!showAccessibility)} variant="ghost" size="sm" className="button-micro" style={{ gap: '8px' }}>
                  <X size={16} />
                  Hide
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Keyboard Focus</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li>Uses standard HTML <code>button</code> element.</li>
                      <li>Visible focus ring using <code>focus-visible</code>.</li>
                      <li>Supports <code>Enter</code> and <code>Space</code> keys for activation.</li>
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

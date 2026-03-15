import React from 'react';
import { Card } from '../../wugweb/Card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Check, Copy, ExternalLink, X, ChevronRight, Image as ImageIcon, Tag, Layout, Smartphone, Monitor } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Switch } from '../../ui/switch';
import { cn } from '../../ui/utils';

export function CardDoc() {
  const [variant, setVariant] = React.useState<'default' | 'elevated' | 'outline' | 'ghost' | 'dark'>('default');
  const [showThumbnail, setShowThumbnail] = React.useState(true);
  const [showTags, setShowTags] = React.useState(true);
  const [showAction, setShowAction] = React.useState(true);
  const [isMobileView, setIsMobileView] = React.useState(false);
  
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

  const sectionGap = spacing.sectionGap[breakpoint];

  const demoImage = "https://images.unsplash.com/photo-1552835376-89b8cdfacb4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwYXJjaGl0ZWN0dXJlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY5NDQwNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080";

  // Dynamic code generation
  const getDynamicCode = () => {
    const props = [];
    if (variant !== 'default') props.push(`variant="${variant}"`);
    if (showThumbnail) props.push(`thumbnail="${demoImage}"`);
    if (showTags) props.push(`tags={['Architecture', 'Minimal', 'Design']}`);
    if (showAction) props.push(`actionLabel="View Details"`);
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}` : '';

    return `import { Card } from "@/components/wugweb/Card";

export function CardDemo() {
  return (
    <Card
      title="Modern Architecture"
      description="Exploring the intersection of minimalism and functional design in contemporary urban spaces."${propsString}
    />
  );
}`;
  };

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', width: '100%', boxSizing: 'border-box' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Surfaces</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Card</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Card
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Core</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v2.0.2</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Interactive</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A responsive card component with refined spacing and typography. Automatically adapts its padding and layout for mobile and desktop environments.
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
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'visible', width: '100%', boxSizing: 'border-box', background: 'var(--card)' }}>
          <div style={{ padding: isMobile ? '24px' : '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px' }}>
                 {/* Variants */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(['default', 'elevated', 'outline', 'ghost', 'dark'] as const).map((v) => (
                        <Button
                          key={v}
                          variant={variant === v ? 'default' : 'outline'}
                          size="sm"
                          className="button-micro"
                          onClick={() => setVariant(v)}
                          style={{ 
                            textTransform: 'capitalize',
                            background: variant === v ? 'var(--accent)' : 'var(--background)',
                            color: variant === v ? 'var(--accent-foreground)' : 'var(--foreground)'
                          }}
                        >
                          {v}
                        </Button>
                      ))}
                    </div>
                 </div>

                 {/* Content Toggles */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Options</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Switch checked={showThumbnail} onCheckedChange={setShowThumbnail} id="thumbnail-toggle" />
                            <label htmlFor="thumbnail-toggle" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ImageIcon size={14} /> Thumbnail
                            </label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Switch checked={showTags} onCheckedChange={setShowTags} id="tags-toggle" />
                            <label htmlFor="tags-toggle" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Tag size={14} /> Tags
                            </label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <Switch checked={showAction} onCheckedChange={setShowAction} id="action-toggle" />
                             <label htmlFor="action-toggle" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Layout size={14} /> Action
                            </label>
                        </div>
                    </div>
                 </div>
              </div>

               {/* Viewport Control */}
               <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px', padding: '4px', background: 'var(--surface-900)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <Button 
                        size="sm" 
                        variant={!isMobileView ? 'secondary' : 'ghost'} 
                        onClick={() => setIsMobileView(false)}
                        style={{ height: '32px', gap: '8px' }}
                      >
                        <Monitor size={14} /> Desktop
                      </Button>
                      <Button 
                        size="sm" 
                        variant={isMobileView ? 'secondary' : 'ghost'} 
                        onClick={() => setIsMobileView(true)}
                        style={{ height: '32px', gap: '8px' }}
                      >
                        <Smartphone size={14} /> Mobile
                      </Button>
                  </div>
               </div>

            </div>

            {/* Preview Area */}
            <div style={{ 
                padding: isMobile ? '32px 16px' : '64px', 
                background: 'var(--muted)', 
                borderRadius: 'var(--radius-lg)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '400px',
                position: 'relative',
                backgroundImage: 'radial-gradient(circle at center, var(--surface-800) 0%, var(--surface-900) 100%)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ 
                    width: isMobileView ? '375px' : '100%', 
                    maxWidth: isMobileView ? '375px' : '380px', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}>
                    <Card 
                        variant={variant}
                        thumbnail={showThumbnail ? demoImage : undefined}
                        title="Modern Architecture"
                        description="Exploring the intersection of minimalism and functional design in contemporary urban spaces."
                        tags={showTags ? ['Architecture', 'Minimal', 'Design'] : undefined}
                        actionLabel={showAction ? "View Details" : undefined}
                        onAction={() => {}}
                    />
                </div>
                
                {/* Viewport label */}
                <div style={{ 
                    position: 'absolute', 
                    bottom: '12px', 
                    right: '12px', 
                    fontSize: 'var(--text-xs)', 
                    color: 'var(--muted-foreground)', 
                    fontFamily: 'monospace',
                    background: 'var(--surface-800)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)'
                }}>
                    {isMobileView ? 'Mobile (375px)' : 'Desktop (Responsive)'}
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* Design Tokens */}
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Design Tokens</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Responsive tokens adapt to viewport size.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          <TokenCard label="Padding (Desktop)" token="--spacing-3" value="24px" color="transparent" onClick={() => handleTokenClick('--spacing-3', 'Padding', '24px')} isHighlighted={highlightedToken === '--spacing-3'} />
          <TokenCard label="Padding (Mobile)" token="--layout-padding-mobile" value="20px" color="transparent" onClick={() => handleTokenClick('--layout-padding-mobile', 'Padding', '20px')} isHighlighted={highlightedToken === '--layout-padding-mobile'} />
          <TokenCard label="Radius" token="--radius-lg" value="12px" isRadius onClick={() => handleTokenClick('--radius-lg', 'Radius', '12px')} isHighlighted={highlightedToken === '--radius-lg'} />
          <TokenCard label="Background" token="--card" value="surface-800" color="var(--card)" onClick={() => handleTokenClick('--card', 'Background', '#1a1a1a')} isHighlighted={highlightedToken === '--card'} />
          <TokenCard label="Border" token="--border" value="surface-600" color="var(--border)" onClick={() => handleTokenClick('--border', 'Border', '#444444')} isHighlighted={highlightedToken === '--border'} />
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

      {/* Accessibility */}
      {showAccessibility && (
        <section className="animate-fade-in-up" style={{ animationDelay: '400ms', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--card)' }}>
            <div style={{ padding: isMobile ? '24px' : '32px' }}>
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
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Semantic Structure</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li>Uses valid semantic HTML tags.</li>
                      <li>Images include standard <code>alt</code> text support.</li>
                      <li>Contrast ratios meet WCAG AA standards.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

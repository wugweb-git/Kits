import React from 'react';
import { SocialButton } from '../../ui/social-button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Check, Copy, ExternalLink, X, ChevronRight, Github, Chrome, Mail, Twitter, Linkedin, Facebook, Layout, Type, MousePointer } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../wugweb/Button';

export function SocialButtonDoc() {
  const [variant, setVariant] = React.useState<'default' | 'outline' | 'ghost'>('default');
  const [size, setSize] = React.useState<'default' | 'sm' | 'lg'>('default');
  const [provider, setProvider] = React.useState<'github' | 'google' | 'twitter' | 'linkedin' | 'facebook' | 'email'>('github');
  
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

  const getProviderIcon = (p: string) => {
    switch(p) {
      case 'github': return <Github size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
      case 'google': return <Chrome size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
      case 'twitter': return <Twitter size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
      case 'linkedin': return <Linkedin size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
      case 'facebook': return <Facebook size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
      case 'email': return <Mail size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
      default: return <Github size={20} />;
    }
  };

  const getProviderLabel = (p: string) => {
    const name = p.charAt(0).toUpperCase() + p.slice(1);
    return `Continue with ${name}`;
  };

  // Generate dynamic code based on current state
  const getDynamicCode = () => {
    const props = [];
    if (variant !== 'default') props.push(`variant="${variant}"`);
    if (size !== 'default') props.push(`size="${size}"`);
    
    // Icon import mapping
    const iconImport = provider.charAt(0).toUpperCase() + provider.slice(1);
    const iconComp = provider === 'google' ? 'Chrome' : iconImport; // Chrome icon used for Google in Lucide usually
    
    const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
    
    return `import { SocialButton } from "@/components/ui/social-button";
import { ${iconComp} } from "lucide-react";

export function SocialLogin() {
  return (
    <SocialButton${propsString} icon={<${iconComp} size={${size === 'sm' ? 16 : size === 'lg' ? 24 : 20}} />}>
      ${getProviderLabel(provider)}
    </SocialButton>
  );
}`;
  };

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* Premium Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', width: '100%', boxSizing: 'border-box' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Patterns</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Social Button</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--social-foreground) 0%, var(--muted-foreground) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', margin: 0, lineHeight: 1.2 }}>
                Social Button
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--social-border)', color: 'var(--social-foreground)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Pattern</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Authentication</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              Social authentication buttons with white background and dark border, strictly adhering to design tokens. Designed for high contrast and clear provider recognition.
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
              
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
                 {/* Providers */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Provider</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(['github', 'google', 'twitter', 'email'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setProvider(p)}
                          className={provider === p ? 'ring-2 ring-[var(--ring)]' : ''}
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: provider === p ? 'var(--accent)' : 'var(--surface-700)',
                            color: provider === p ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          title={p}
                        >
                          {p === 'github' && <Github size={16} />}
                          {p === 'google' && <Chrome size={16} />}
                          {p === 'twitter' && <Twitter size={16} />}
                          {p === 'email' && <Mail size={16} />}
                        </button>
                      ))}
                    </div>
                 </div>

                 {/* Variants */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(['default', 'outline', 'ghost'] as const).map((v) => (
                        <Button
                          key={v}
                          variant={variant === v ? 'default' : 'outline'}
                          size="sm"
                          className="button-micro"
                          onClick={() => setVariant(v)}
                          style={{ 
                            textTransform: 'capitalize',
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
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(['default', 'sm', 'lg'] as const).map((s) => (
                        <Button
                          key={s}
                          variant={size === s ? 'default' : 'outline'}
                          size="sm"
                          className="button-micro"
                          onClick={() => setSize(s)}
                          style={{ 
                            textTransform: 'capitalize',
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
                <div className="transition-all duration-300">
                    <SocialButton 
                        variant={variant} 
                        size={size}
                        icon={getProviderIcon(provider)}
                    >
                        {getProviderLabel(provider)}
                    </SocialButton>
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
                        H: {size === 'lg' ? '48px' : size === 'sm' ? '36px' : '44px'}
                    </span>
                    <span style={{ background: 'var(--surface-800)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        Radius: 8px
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
                 <SocialButton icon={<Github size={20} />}>
                    Continue with GitHub
                 </SocialButton>
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
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Fixed Height (44px)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>White Background</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MousePointer size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Active: Scale 0.98</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Type size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Inter Tight Medium</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Dark Border</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Provider Icon</span>
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
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Tokens specific to social authentication buttons.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          <TokenCard label="Background" token="--social-background" value="#ffffff" color="var(--social-background)" onClick={() => handleTokenClick('--social-background', 'Background', '#ffffff')} isHighlighted={highlightedToken === '--social-background'} />
          <TokenCard label="Text Color" token="--social-foreground" value="#050505" color="var(--social-foreground)" onClick={() => handleTokenClick('--social-foreground', 'Text Color', '#050505')} isHighlighted={highlightedToken === '--social-foreground'} />
          <TokenCard label="Border" token="--social-border" value="#050505" color="var(--social-border)" onClick={() => handleTokenClick('--social-border', 'Border', '#050505')} isHighlighted={highlightedToken === '--social-border'} />
          <TokenCard label="Font Family" token="Inter Tight" value="Inter Tight" color="transparent" onClick={() => handleTokenClick('Inter Tight', 'Font Family', 'Inter Tight')} isHighlighted={highlightedToken === 'Inter Tight'} />
          <TokenCard label="Radius" token="--radius-md" value="8px" isRadius onClick={() => handleTokenClick('--radius-md', 'Radius', '8px')} isHighlighted={highlightedToken === '--radius-md'} />
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
                  <li>Use the provider's official icon (GitHub, Google, etc.).</li>
                  <li>Use "Continue with [Provider]" or "Sign in with [Provider]" text.</li>
                  <li>Stack them vertically in login forms for clarity.</li>
                  <li>Use the default white variant for the primary social option.</li>
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
                  <li>Don't use social buttons for generic actions.</li>
                  <li>Don't alter the provider's brand colors in a way that violates their guidelines (this component enforces neutral style).</li>
                  <li>Don't remove the border from the default variant.</li>
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
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>Standard button accessibility patterns.</p>
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
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Focus States</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li>Uses high-contrast ring for focus state (3px ring).</li>
                      <li>Ensures proper contrast ratios for text and icons against the white background.</li>
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

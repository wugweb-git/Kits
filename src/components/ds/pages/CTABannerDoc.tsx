import React from 'react';
import { CTABanner } from '../../wugweb/CTABanner';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Check, Copy, ExternalLink, X, ChevronRight, Layout, Type, MousePointer, Maximize, FileText, ArrowRight, MessageSquare } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../wugweb/Button';
import { copyToClipboard } from '../../../utils/clipboard';

export function CTABannerDoc() {
  const [title, setTitle] = React.useState('We speak your Industry\'s language.');
  const [subtitle, setSubtitle] = React.useState('Partner with Wugweb for domain-driven design and development that delivers.');
  const [buttonLabel, setButtonLabel] = React.useState('Request Quote');
  const [iconType, setIconType] = React.useState<'file' | 'arrow' | 'message'>('file');
  
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
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getIcon = () => {
    switch(iconType) {
      case 'file': return <FileText size={24} />;
      case 'arrow': return <ArrowRight size={24} />;
      case 'message': return <MessageSquare size={24} />;
      default: return <FileText size={24} />;
    }
  };

  const getIconImport = () => {
     switch(iconType) {
      case 'file': return 'FileText';
      case 'arrow': return 'ArrowRight';
      case 'message': return 'MessageSquare';
      default: return 'FileText';
    }
  };

  const getDynamicCode = () => {
    return `import { CTABanner } from "@/components/wugweb/CTABanner";
import { ${getIconImport()} } from "lucide-react";

export function PromoSection() {
  return (
    <CTABanner
      title="${title}"
      subtitle="${subtitle}"
      buttonLabel="${buttonLabel}"
      buttonIcon={<${getIconImport()} size={24} />}
      onButtonClick={() => console.log("CTA clicked")}
    />
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
          <span>Marketing</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>CTA Banner</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-subtle) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', margin: 0, lineHeight: 1.2 }}>
                CTA Banner
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Marketing</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v2.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Responsive</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A high-impact call-to-action component designed to capture user attention. Features a prominent title, descriptive subtitle, and a primary action button on a branded background.
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
                {/* Text Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>Title</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>Subtitle</label>
                    <textarea 
                      value={subtitle} 
                      onChange={(e) => setSubtitle(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none"
                    />
                  </div>
                </div>

                {/* Button Config */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>Button Label</label>
                    <input 
                      type="text" 
                      value={buttonLabel} 
                      onChange={(e) => setButtonLabel(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>Button Icon</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button 
                        variant={iconType === 'file' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setIconType('file')}
                        className="flex-1"
                        style={{ background: iconType === 'file' ? 'var(--primary)' : 'transparent', color: iconType === 'file' ? 'var(--primary-foreground)' : 'var(--foreground)' }}
                      >
                        <FileText size={16} className="mr-2" /> File
                      </Button>
                      <Button 
                        variant={iconType === 'arrow' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setIconType('arrow')}
                        className="flex-1"
                        style={{ background: iconType === 'arrow' ? 'var(--primary)' : 'transparent', color: iconType === 'arrow' ? 'var(--primary-foreground)' : 'var(--foreground)' }}
                      >
                        <ArrowRight size={16} className="mr-2" /> Arrow
                      </Button>
                      <Button 
                        variant={iconType === 'message' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setIconType('message')}
                        className="flex-1"
                        style={{ background: iconType === 'message' ? 'var(--primary)' : 'transparent', color: iconType === 'message' ? 'var(--primary-foreground)' : 'var(--foreground)' }}
                      >
                        <MessageSquare size={16} className="mr-2" /> Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div style={{ 
                width: '100%',
                overflow: 'hidden'
            }}>
                <CTABanner 
                  title={title}
                  subtitle={subtitle}
                  buttonLabel={buttonLabel}
                  buttonIcon={getIcon()}
                />
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
                  <Layout size={16} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Radius: 20px</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Brand Background</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Type size={16} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Display Typography</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Maximize size={16} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Min-Height: 312px</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MousePointer size={16} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>High-Contrast Button</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layout size={16} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Responsive Flex Layout</span>
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
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Tokens used to enforce the brand aesthetic.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          <TokenCard label="Background" token="--accent" value="#FFBE1A" color="var(--accent)" onClick={() => handleTokenClick('--accent', 'Background', '#FFBE1A')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard label="Text Color" token="--accent-foreground" value="#121212" color="var(--accent-foreground)" onClick={() => handleTokenClick('--accent-foreground', 'Text Color', '#121212')} isHighlighted={highlightedToken === '--accent-foreground'} />
          <TokenCard label="Container Radius" token="--radius-5" value="20px" isRadius onClick={() => handleTokenClick('--radius-5', 'Radius', '20px')} isHighlighted={highlightedToken === '--radius-5'} />
          <TokenCard label="Font Family" token="Inter Tight" value="Inter Tight" color="transparent" onClick={() => handleTokenClick('Inter Tight', 'Font Family', 'Inter Tight')} isHighlighted={highlightedToken === 'Inter Tight'} />
          <TokenCard label="Button Radius" token="--radius-3" value="12px" isRadius onClick={() => handleTokenClick('--radius-3', 'Radius', '12px')} isHighlighted={highlightedToken === '--radius-3'} />
          <TokenCard label="Button Height" token="70px" value="70px" color="transparent" onClick={() => handleTokenClick('70px', 'Height', '70px')} isHighlighted={highlightedToken === '70px'} />
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
                  <li>Use for major page breaks or at the bottom of landing pages.</li>
                  <li>Keep the title punchy and large (display text).</li>
                  <li>Ensure the subtitle supports the title with actionable context.</li>
                  <li>Maintain high contrast between the background and text.</li>
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
                  <li>Don't use for minor notifications or small alerts.</li>
                  <li>Don't overcrowd the banner with too many links or buttons.</li>
                  <li>Avoid changing the background color to something that reduces text legibility.</li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </section>
      )}
    </div>
  );
}
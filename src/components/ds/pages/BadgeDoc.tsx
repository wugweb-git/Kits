import React from 'react';
import { Badge } from '../../wugweb/Badge';
import { Button } from '../../ui/button';
import { Badge as UIBadge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Check, Copy, ExternalLink, X, ChevronRight, Star, Hash, Tag, Activity } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Switch } from '../../ui/switch';
import { cn } from '../../ui/utils';
import { copyToClipboard } from '../../../utils/clipboard';

export function BadgeDoc() {
  const [tone, setTone] = React.useState<'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'neutral'>('primary');
  const [style, setStyle] = React.useState<'solid' | 'subtle' | 'outline'>('solid');
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [showIcon, setShowIcon] = React.useState(false);
  const [showDot, setShowDot] = React.useState(false);
  const [showCount, setShowCount] = React.useState(false);
  
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

  const sectionGap = spacing.sectionGap[breakpoint];

  // Dynamic code generation
  const getDynamicCode = () => {
    const props = [];
    if (tone !== 'default') props.push(`tone="${tone}"`);
    if (style !== 'solid') props.push(`style="${style}"`);
    if (size !== 'md') props.push(`size="${size}"`);
    if (showIcon) {
        props.push(`icon={Star}`);
        props.push(`iconPosition="leading"`);
    }
    if (showDot) props.push(`showDot`);
    if (showCount) props.push(`count={12}`);
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}` : '';

    return `import { Badge } from "@/components/wugweb/Badge";
import { Star } from "lucide-react";

export function BadgeDemo() {
  return (
    <Badge
      label="${tone === 'success' ? 'Active' : tone === 'warning' ? 'Beta' : 'New'}"${propsString}
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
          <span>Feedback</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Badge</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Badge
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <UIBadge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Core</UIBadge>
                <UIBadge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</UIBadge>
                <UIBadge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Static</UIBadge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              Display compact status indicators, labels, and counts with flexible styling options. Badges help users quickly identify categories, statuses, and important metadata.
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
                 {/* Tones */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Tone</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(['default', 'primary', 'secondary', 'success', 'warning', 'info', 'neutral'] as const).map((t) => (
                        <Button
                          key={t}
                          variant={tone === t ? 'default' : 'outline'}
                          size="sm"
                          className="button-micro"
                          onClick={() => setTone(t)}
                          style={{ 
                            textTransform: 'capitalize',
                            background: tone === t ? 'var(--accent)' : 'var(--background)',
                            color: tone === t ? 'var(--accent-foreground)' : 'var(--foreground)'
                          }}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                 </div>

                 {/* Styles */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Style</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(['solid', 'subtle', 'outline'] as const).map((s) => (
                        <Button
                          key={s}
                          variant={style === s ? 'default' : 'outline'}
                          size="sm"
                          className="button-micro"
                          onClick={() => setStyle(s)}
                          style={{ 
                            textTransform: 'capitalize',
                            background: style === s ? 'var(--accent)' : 'var(--background)',
                            color: style === s ? 'var(--accent-foreground)' : 'var(--foreground)'
                          }}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                 </div>

                 {/* Sizes */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(['sm', 'md', 'lg'] as const).map((s) => (
                        <Button
                          key={s}
                          variant={size === s ? 'default' : 'outline'}
                          size="sm"
                          className="button-micro"
                          onClick={() => setSize(s)}
                          style={{ 
                            textTransform: 'capitalize',
                            background: size === s ? 'var(--accent)' : 'var(--background)',
                            color: size === s ? 'var(--accent-foreground)' : 'var(--foreground)'
                          }}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                 </div>

                 {/* Options */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Options</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Switch checked={showIcon} onCheckedChange={setShowIcon} id="icon-toggle" />
                            <label htmlFor="icon-toggle" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Star size={14} /> Icon
                            </label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Switch checked={showDot} onCheckedChange={setShowDot} id="dot-toggle" />
                            <label htmlFor="dot-toggle" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Activity size={14} /> Dot
                            </label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <Switch checked={showCount} onCheckedChange={setShowCount} id="count-toggle" />
                             <label htmlFor="count-toggle" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Hash size={14} /> Count
                            </label>
                        </div>
                    </div>
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
                minHeight: '200px',
                position: 'relative',
                backgroundImage: 'radial-gradient(circle at center, var(--surface-800) 0%, var(--surface-900) 100%)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <Badge 
                        tone={tone}
                        style={style}
                        size={size}
                        label={tone === 'success' ? 'Active' : tone === 'warning' ? 'Beta' : 'New Feature'}
                        icon={showIcon ? Star : undefined}
                        iconPosition="leading"
                        showDot={showDot}
                        count={showCount ? 12 : undefined}
                    />
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* Design Tokens */}
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Design Tokens</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>The badge component uses specific tokens for consistency.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px', width: '100%' }}>
          <TokenCard label="Border Radius" token="--radius-full" value="9999px" isRadius onClick={() => handleTokenClick('--radius-full', 'Radius', '9999px')} isHighlighted={highlightedToken === '--radius-full'} />
          <TokenCard label="Font Family" token="Inter Tight" value="Inter Tight" color="transparent" onClick={() => handleTokenClick('font-family', 'Font', 'Inter Tight')} isHighlighted={highlightedToken === 'font-family'} />
          <TokenCard label="Font Weight" token="--font-weight-medium" value="500" color="transparent" onClick={() => handleTokenClick('--font-weight-medium', 'Weight', '500')} isHighlighted={highlightedToken === '--font-weight-medium'} />
          <TokenCard label="Animation" token="--motion-duration-normal" value="0.2s" color="transparent" onClick={() => handleTokenClick('--motion-duration-normal', 'Motion', '0.2s')} isHighlighted={highlightedToken === '--motion-duration-normal'} />
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
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>Built for screen readers and high contrast.</p>
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
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Non-interactive</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li>Badges are static indicators and do not receive focus.</li>
                      <li>Use standard text contrast ratios (AA level).</li>
                      <li>Semantic markup ensures screen readers announce content naturally.</li>
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
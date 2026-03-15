import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Copy, Check, X, ChevronRight, Keyboard, ExternalLink, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';

export function TagDoc() {
  const [selectedVariant, setSelectedVariant] = React.useState<'filled' | 'outlined' | 'ghost'>('filled');
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md' | 'lg'>('md');
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

  const getPadding = () => {
    switch (selectedSize) {
      case 'sm': return '4px 8px';
      case 'md': return '6px 10px';
      case 'lg': return '8px 12px';
    }
  };

  const getFontSize = () => {
    switch (selectedSize) {
      case 'sm': return 'var(--text-xs)';
      case 'md': return 'var(--text-sm)';
      case 'lg': return 'var(--text-base)';
    }
  };

  const jsxCode = `<div style={{
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '${getPadding()}',
  borderRadius: 'var(--radius-full)',
  fontSize: '${getFontSize()}',
  fontWeight: 'var(--font-weight-medium)',
  ${selectedVariant === 'filled' 
    ? `background: 'var(--foreground)',\n  color: 'var(--background)',` 
    : selectedVariant === 'outlined'
      ? `background: 'transparent',\n  border: '1px solid var(--border)',\n  color: 'var(--foreground)',`
      : `background: 'transparent',\n  color: 'var(--muted-foreground)',`}
  transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)'
}}>
  Tag Label
</div>

// Design Tokens Used:
// Background: var(--foreground) | transparent
// Text: var(--background) | var(--foreground)
// Border: var(--border)
// Border Radius: var(--radius-full)`;

  const cssCode = `.tag {
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${getPadding()};
  
  /* Design Tokens */
  border-radius: var(--radius-full);
  font-size: ${getFontSize()};
  font-weight: var(--font-weight-medium);
  
  /* Motion */
  transition: all var(--motion-duration-fast) var(--motion-easing-standard);
}

.tag.filled {
  background: var(--foreground);
  color: var(--background);
}

.tag.outlined {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--foreground);
}

.tag.ghost {
  background: transparent;
  color: var(--muted-foreground);
}

.tag:hover {
  opacity: 0.8;
}`;

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative' }}>
      
      {/* Premium Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Feedback</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Tag</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Tag
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Feedback</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A compact label component for categorizing, organizing, and adding metadata to content. Perfect for filtering, navigation, and displaying attributes with multiple visual styles.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Variants</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>3</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Sizes</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>3</div>
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
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Variant</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['filled', 'outlined', 'ghost'] as const).map((variant) => (
                      <Button key={variant} onClick={() => setSelectedVariant(variant)} variant={selectedVariant === variant ? 'default' : 'outline'} size="sm" className="smooth-transition button-press" style={{ fontSize: 'var(--text-sm)', textTransform: 'capitalize', background: selectedVariant === variant ? 'var(--accent)' : 'var(--background)', color: selectedVariant === variant ? 'var(--accent-foreground)' : 'var(--foreground)', borderColor: 'var(--border)' }}>
                        {variant}
                      </Button>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Size</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['sm', 'md', 'lg'] as const).map((size) => (
                      <Button key={size} onClick={() => setSelectedSize(size)} variant={selectedSize === size ? 'default' : 'outline'} size="sm" className="smooth-transition button-press" style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', background: selectedSize === size ? 'var(--accent)' : 'var(--background)', color: selectedSize === size ? 'var(--accent-foreground)' : 'var(--foreground)', borderColor: 'var(--border)' }}>
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: isMobile ? '32px 16px' : '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: getPadding(),
                    borderRadius: 'var(--radius-full)',
                    fontSize: getFontSize(),
                    fontWeight: 'var(--font-weight-medium)',
                    background: selectedVariant === 'filled' ? 'var(--foreground)' : 'transparent',
                    color: selectedVariant === 'filled' ? 'var(--background)' : selectedVariant === 'outlined' ? 'var(--foreground)' : 'var(--muted-foreground)',
                    border: selectedVariant === 'outlined' ? '1px solid var(--border)' : 'none',
                    transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                    cursor: 'pointer'
                  }}>
                    Design
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: getPadding(),
                    borderRadius: 'var(--radius-full)',
                    fontSize: getFontSize(),
                    fontWeight: 'var(--font-weight-medium)',
                    background: selectedVariant === 'filled' ? 'var(--foreground)' : 'transparent',
                    color: selectedVariant === 'filled' ? 'var(--background)' : selectedVariant === 'outlined' ? 'var(--foreground)' : 'var(--muted-foreground)',
                    border: selectedVariant === 'outlined' ? '1px solid var(--border)' : 'none',
                    transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                    cursor: 'pointer'
                  }}>
                    Development
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: getPadding(),
                    borderRadius: 'var(--radius-full)',
                    fontSize: getFontSize(),
                    fontWeight: 'var(--font-weight-medium)',
                    background: selectedVariant === 'filled' ? 'var(--foreground)' : 'transparent',
                    color: selectedVariant === 'filled' ? 'var(--background)' : selectedVariant === 'outlined' ? 'var(--foreground)' : 'var(--muted-foreground)',
                    border: selectedVariant === 'outlined' ? '1px solid var(--border)' : 'none',
                    transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                    cursor: 'pointer'
                  }}>
                    UX
                  </div>
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
          <TokenCard label="Background" token="--foreground" value="#191919" type="color" onClick={() => handleTokenClick('--foreground', 'Background', '#191919')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard label="Text Color" token="--background" value="#FFFFFF" type="color" onClick={() => handleTokenClick('--background', 'Text Color', '#FFFFFF')} isHighlighted={highlightedToken === '--background'} />
          <TokenCard label="Border" token="--border" value="#DFDFDF" type="color" onClick={() => handleTokenClick('--border', 'Border', '#DFDFDF')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard label="Border Radius" token="--radius-full" value="50%" type="radius" onClick={() => handleTokenClick('--radius-full', 'Border Radius', '50%')} isHighlighted={highlightedToken === '--radius-full'} />
          <TokenCard label="Font Size" value={getFontSize()} type="typography" onClick={() => handleTokenClick('font-size', 'Font Size', getFontSize())} isHighlighted={highlightedToken === 'font-size'} />
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
                  <li>Use for categorization and filtering</li>
                  <li>Keep tag labels short and descriptive</li>
                  <li>Use consistent sizing within same context</li>
                  <li>Allow tags to wrap on multiple lines</li>
                  <li>Use for metadata and attributes</li>
                  <li>Group related tags together</li>
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
                  <li>Use for primary call-to-action buttons</li>
                  <li>Make tag labels too long (over 3 words)</li>
                  <li>Use too many tags on single item</li>
                  <li>Mix different tag sizes inconsistently</li>
                  <li>Use for critical system messages</li>
                  <li>Rely solely on color to convey meaning</li>
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
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>WCAG AA compliant tag implementation</p>
            </div>
            <Button onClick={() => setShowAccessibility(!showAccessibility)} variant="ghost" size="sm" style={{ gap: '8px' }}>
              <X size={16} />
              Hide
            </Button>
          </div>

          <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
            <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <CheckCircle2 size={20} style={{ color: '#009E69' }} />
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>WCAG AA Compliance</h3>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                    All color contrast ratios meet WCAG 2.1 AA standards (4.5:1 for normal text)
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Sparkles size={20} style={{ color: 'var(--accent)' }} />
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Semantic HTML</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                    <li>
                      Use semantic{' '}
                      <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>
                        &lt;span&gt;
                      </code>
                      {' '}or{' '}
                      <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>
                        &lt;button&gt;
                      </code>
                      {' '}for interactive tags
                    </li>
                    <li>
                      Add{' '}
                      <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>
                        role="button"
                      </code>
                      {' '}for clickable tags
                    </li>
                    <li>
                      Include proper{' '}
                      <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>
                        aria-label
                      </code>
                      {' '}for context
                    </li>
                    <li>
                      Group tags in lists with{' '}
                      <code style={{ background: 'var(--muted)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.9em' }}>
                        &lt;ul&gt;
                      </code>
                      {' '}when appropriate
                    </li>
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
            { name: 'Badge', category: 'Feedback', description: 'Status or count indicator' },
            { name: 'Chip', category: 'Feedback', description: 'Interactive tag with close' },
            { name: 'Button', category: 'Surfaces', description: 'Interactive action element' },
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
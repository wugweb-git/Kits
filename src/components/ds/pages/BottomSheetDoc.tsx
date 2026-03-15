import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Checkbox } from '../../ui/checkbox';
import { Slider } from '../../ui/slider';
import { 
  Copy, Check, X, ChevronRight, ExternalLink, Settings, 
  Share2, Link as LinkIcon, Flag, Download, Trash2, 
  Filter, ArrowUpDown, Search
} from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { BottomSheet } from '../../wugweb/BottomSheet';

export function BottomSheetDoc() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeScenario, setActiveScenario] = React.useState<'menu' | 'filter' | 'details'>('menu');
  
  // Sheet configuration
  const [height, setHeight] = React.useState<'auto' | 'sm' | 'md' | 'lg' | 'full'>('auto');
  const [showOverlay, setShowOverlay] = React.useState(true);
  const [showDragHandle, setShowDragHandle] = React.useState(true);
  
  // Doc state
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

  const getSheetTitle = () => {
    switch(activeScenario) {
      case 'menu': return 'Options';
      case 'filter': return 'Filter & Sort';
      case 'details': return 'Product Details';
      default: return 'Sheet';
    }
  };

  const getSheetContent = () => {
    switch(activeScenario) {
      case 'menu':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
            <Button variant="ghost" className="justify-start" style={{ gap: 'var(--spacing-3)', height: '56px', fontSize: 'var(--text-base)', color: 'var(--foreground)' }}>
              <Share2 size={20} />
              Share via...
            </Button>
            <Button variant="ghost" className="justify-start" style={{ gap: 'var(--spacing-3)', height: '56px', fontSize: 'var(--text-base)', color: 'var(--foreground)' }}>
              <LinkIcon size={20} />
              Copy Link
            </Button>
            <Button variant="ghost" className="justify-start" style={{ gap: 'var(--spacing-3)', height: '56px', fontSize: 'var(--text-base)', color: 'var(--foreground)' }}>
              <Download size={20} />
              Save to Device
            </Button>
            <div style={{ height: '1px', background: 'var(--border)', margin: 'var(--spacing-1) 0' }} />
            <Button variant="ghost" className="justify-start" style={{ gap: 'var(--spacing-3)', height: '56px', fontSize: 'var(--text-base)', color: 'var(--destructive)' }}>
              <Flag size={20} />
              Report Issue
            </Button>
          </div>
        );
      case 'filter':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-2) 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Sort by</h4>
              <RadioGroup defaultValue="newest">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newest" id="r1" />
                  <Label htmlFor="r1">Newest First</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-asc" id="r2" />
                  <Label htmlFor="r2">Price: Low to High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-desc" id="r3" />
                  <Label htmlFor="r3">Price: High to Low</Label>
                </div>
              </RadioGroup>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Price Range</h4>
              <Slider defaultValue={[50]} max={100} step={1} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                <span>$0</span>
                <span>$1,000+</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Categories</h4>
              <div className="flex items-center space-x-2">
                <Checkbox id="c1" />
                <Label htmlFor="c1">Electronics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="c2" checked />
                <Label htmlFor="c2">Clothing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="c3" />
                <Label htmlFor="c3">Home & Garden</Label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
              <Button style={{ flex: 1 }} onClick={() => setIsOpen(false)}>Show Results</Button>
              <Button variant="outline" style={{ flex: 1 }} onClick={() => setIsOpen(false)}>Reset</Button>
            </div>
          </div>
        );
      case 'details':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ aspectRatio: '16/9', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--muted-foreground)' }}>Product Image</span>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>Premium Design Kit</h3>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 'var(--font-weight-semibold)', marginTop: 'var(--spacing-1)' }}>$49.00</p>
            </div>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
              A comprehensive design system kit featuring over 500+ components, 50+ templates, and full documentation. Perfect for your next project.
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
              <Button style={{ flex: 1 }} onClick={() => setIsOpen(false)}>Add to Cart</Button>
            </div>
          </div>
        );
    }
  };

  const jsxCode = `import { BottomSheet } from './components/wugweb/BottomSheet';

const [isOpen, setIsOpen] = React.useState(false);

<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="${getSheetTitle()}"
  height="${height}"
  showOverlay={${showOverlay}}
  showDragHandle={${showDragHandle}}
>
  {/* Sheet Content */}
  <div className="p-4">
    ...
  </div>
</BottomSheet>`;

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', width: '100%', boxSizing: 'border-box' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Layout</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>BottomSheet</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                BottomSheet
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Layout</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A surface that slides up from the bottom of the screen to reveal more content. Commonly used for menus, filters, and secondary actions on mobile.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Variants</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>Adaptive</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Tokens</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>Surface</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Interaction</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>Swipe/Drag</div>
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
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Example Scenario</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <Button 
                      onClick={() => { setActiveScenario('menu'); setHeight('auto'); }} 
                      variant={activeScenario === 'menu' ? 'default' : 'outline'} 
                      size="sm" 
                      style={{ gap: '6px' }}
                    >
                      <Settings size={14} />
                      Options Menu
                    </Button>
                    <Button 
                      onClick={() => { setActiveScenario('filter'); setHeight('md'); }} 
                      variant={activeScenario === 'filter' ? 'default' : 'outline'} 
                      size="sm"
                      style={{ gap: '6px' }}
                    >
                      <Filter size={14} />
                      Filter Form
                    </Button>
                    <Button 
                      onClick={() => { setActiveScenario('details'); setHeight('auto'); }} 
                      variant={activeScenario === 'details' ? 'default' : 'outline'} 
                      size="sm"
                      style={{ gap: '6px' }}
                    >
                      <Search size={14} />
                      Product Details
                    </Button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="flex items-center space-x-2">
                    <Switch id="show-overlay" checked={showOverlay} onCheckedChange={setShowOverlay} />
                    <Label htmlFor="show-overlay">Show Overlay</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="show-drag" checked={showDragHandle} onCheckedChange={setShowDragHandle} />
                    <Label htmlFor="show-drag">Drag Handle</Label>
                  </div>
                </div>
              </div>

              {/* Preview Area */}
              <div style={{ 
                padding: isMobile ? '48px 24px' : '80px 48px', 
                background: 'var(--muted)', 
                borderRadius: 'var(--radius-md)', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '300px',
                gap: '16px',
                backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}>
                <Button 
                  onClick={() => setIsOpen(true)} 
                  size="lg"
                  className="hover:bg-accent/90 transition-all"
                  style={{ 
                    gap: '8px', 
                    background: 'var(--accent)', 
                    color: 'var(--accent-foreground)',
                    fontWeight: 'var(--font-weight-bold)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0 32px'
                  }}
                >
                  <ArrowUpDown size={18} />
                  Open Bottom Sheet
                </Button>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                  Click to preview the {activeScenario} example
                </p>
              </div>

              <BottomSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={getSheetTitle()}
                height={height}
                showOverlay={showOverlay}
                showDragHandle={showDragHandle}
              >
                {getSheetContent()}
              </BottomSheet>
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
          <TokenCard label="Sheet Background" token="--surface-800" value="#1C1C1C" color="var(--surface-800)" onClick={() => handleTokenClick('--surface-800', 'Background', '#1C1C1C')} isHighlighted={highlightedToken === '--surface-800'} />
          <TokenCard label="Overlay" token="--overlay-background" value="rgba(0,0,0,0.6)" color="var(--overlay-background)" onClick={() => handleTokenClick('--overlay-background', 'Overlay', 'rgba(0,0,0,0.6)')} isHighlighted={highlightedToken === '--overlay-background'} />
          <TokenCard label="Border Radius" token="--radius-lg" value="12px" isRadius onClick={() => handleTokenClick('--radius-lg', 'Border Radius', '12px')} isHighlighted={highlightedToken === '--radius-lg'} />
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
              <CollapsibleCodeBlock code={jsxCode} language="tsx" />
            </TabsContent>
          </Tabs>
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
                  <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Best Practices</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li>Ensure focus is trapped within the bottom sheet when open</li>
                      <li>Allow closing via Escape key and clicking outside</li>
                      <li>Provide a clear close button for screen reader users</li>
                      <li>Use appropriate ARIA roles (dialog or modal)</li>
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

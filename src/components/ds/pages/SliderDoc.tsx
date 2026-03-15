import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Slider as UISlider } from '../../ui/slider';
import { Copy, Check, ChevronRight, ExternalLink, Minus, Plus } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';

export function SliderDoc() {
  const [sliderValue, setSliderValue] = React.useState([85]);
  const [rangeValue, setRangeValue] = React.useState([25, 75]);
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

  const jsxCode = `import { Slider } from './components/ui/slider';

// Single Value Slider
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
      Volume
    </label>
    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)' }}>
      {value}%
    </span>
  </div>
  <Slider 
    value={[value]}
    onValueChange={(val) => setValue(val[0])}
    min={0}
    max={100}
    step={1}
    className="[&_[data-slot=slider-range]]:bg-[var(--foreground)] [&_[data-slot=slider-thumb]]:border-[var(--foreground)]"
  />
</div>

// Range Slider
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
      Price Range
    </label>
    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)' }}>
      \${rangeValue[0]} - \${rangeValue[1]}
    </span>
  </div>
  <Slider 
    value={rangeValue}
    onValueChange={setRangeValue}
    min={0}
    max={100}
    step={1}
    className="[&_[data-slot=slider-range]]:bg-[var(--foreground)] [&_[data-slot=slider-thumb]]:border-[var(--foreground)]"
  />
</div>

// Design Tokens Used:
// Track (base): var(--muted)
// Track (filled): var(--foreground)
// Thumb: var(--background) with var(--foreground) border
// Value Text: var(--accent)`;

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative' }}>
      
      {/* Premium Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Inputs</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Slider</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2, fontFamily: 'Inter Tight, sans-serif' }}>
                Slider
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)', fontFamily: 'Inter Tight, sans-serif' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontFamily: 'Inter Tight, sans-serif' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontFamily: 'Inter Tight, sans-serif' }}>Inputs</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6, fontFamily: 'Inter Tight, sans-serif' }}>
              An input control that allows users to select a numeric value from a continuous or discrete range by dragging a thumb along a track. Ideal for volume controls, brightness adjustments, and any value selection within a defined range.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px', fontFamily: 'Inter Tight, sans-serif' }}>Variants</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Inter Tight, sans-serif' }}>2</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px', fontFamily: 'Inter Tight, sans-serif' }}>Tokens</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Inter Tight, sans-serif' }}>5</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px', fontFamily: 'Inter Tight, sans-serif' }}>WCAG</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Inter Tight, sans-serif' }}>AA</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Button onClick={copyPageLink} variant="outline" size="sm" className="smooth-transition button-press" style={{ gap: '8px', background: 'var(--background)', borderColor: 'var(--border)', fontFamily: 'Inter Tight, sans-serif' }}>
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="outline" size="sm" className="smooth-transition button-press" style={{ gap: '8px', background: 'var(--background)', borderColor: 'var(--border)', fontFamily: 'Inter Tight, sans-serif' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Single Value Slider */}
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '16px', fontFamily: 'Inter Tight, sans-serif' }}>Single Value</h3>
                <div style={{ padding: isMobile ? '32px 24px' : '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                  <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif' }}>
                        Volume
                      </label>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: 'Inter Tight, sans-serif' }}>
                        {sliderValue[0]}%
                      </span>
                    </div>
                    <UISlider 
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      min={0}
                      max={100}
                      step={1}
                      className="smooth-transition [&_[data-slot=slider-range]]:bg-[var(--foreground)] [&_[data-slot=slider-thumb]]:border-[var(--foreground)]"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSliderValue([Math.max(0, sliderValue[0] - 10)])}
                        className="smooth-transition button-press"
                        style={{ fontFamily: 'Inter Tight, sans-serif', width: '40px' }}
                      >
                        <Minus size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSliderValue([Math.min(100, sliderValue[0] + 10)])}
                        className="smooth-transition button-press"
                        style={{ fontFamily: 'Inter Tight, sans-serif', width: '40px' }}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Range Slider */}
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '16px', fontFamily: 'Inter Tight, sans-serif' }}>Range Selection</h3>
                <div style={{ padding: isMobile ? '32px 24px' : '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                  <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif' }}>
                        Price Range
                      </label>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: 'Inter Tight, sans-serif' }}>
                        ${rangeValue[0]} - ${rangeValue[1]}
                      </span>
                    </div>
                    <UISlider 
                      value={rangeValue}
                      onValueChange={setRangeValue}
                      min={0}
                      max={100}
                      step={1}
                      className="smooth-transition [&_[data-slot=slider-range]]:bg-[var(--foreground)] [&_[data-slot=slider-thumb]]:border-[var(--foreground)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Anatomy */}
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms', width: '100%', boxSizing: 'border-box' }}>
        <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: '24px', fontFamily: 'Inter Tight, sans-serif' }}>Anatomy</h2>
            
            <div style={{ padding: isMobile ? '32px 24px' : '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
                {/* Annotated Slider */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                  {/* The Slider */}
                  <UISlider 
                    value={[45]}
                    min={0}
                    max={100}
                    disabled
                    className="smooth-transition [&_[data-slot=slider-range]]:bg-[var(--foreground)] [&_[data-slot=slider-thumb]]:border-[var(--foreground)]"
                    style={{ opacity: 1 }}
                  />
                  
                  {/* Annotations */}
                  <div style={{ position: 'absolute', top: '-30px', left: '0', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'Inter Tight, sans-serif' }}>
                    1. Track Base
                  </div>
                  <div style={{ position: 'absolute', top: '-30px', left: '45%', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'Inter Tight, sans-serif' }}>
                    2. Filled Track
                  </div>
                  <div style={{ position: 'absolute', bottom: '-30px', left: '43%', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'Inter Tight, sans-serif' }}>
                    3. Thumb
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '24px', height: '24px', background: 'var(--accent)', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Inter Tight, sans-serif' }}>1</div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '4px', fontFamily: 'Inter Tight, sans-serif' }}>Track Base</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>The full-width background track representing the entire value range. Background: <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>#e1e1e1</code> or <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>var(--muted)</code></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '24px', height: '24px', background: 'var(--accent)', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Inter Tight, sans-serif' }}>2</div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '4px', fontFamily: 'Inter Tight, sans-serif' }}>Filled Track</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>The colored portion from start to thumb position showing the current value. Background: <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>#191919</code> or <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>var(--foreground)</code></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '24px', height: '24px', background: 'var(--accent)', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Inter Tight, sans-serif' }}>3</div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '4px', fontFamily: 'Inter Tight, sans-serif' }}>Thumb</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>Draggable circular control for selecting the value. Size: <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>24px</code>, Background: <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>white</code>, Border: <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>var(--foreground)</code></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Design Tokens */}
      <section className="animate-fade-in-up" style={{ animationDelay: '300ms', width: '100%', boxSizing: 'border-box' }}>
        <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: '24px', fontFamily: 'Inter Tight, sans-serif' }}>Design Tokens</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              <TokenCard 
                label="Track Base Color" 
                value="#e1e1e1" 
                token="--muted"
                isHighlighted={highlightedToken === '--muted'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Filled Track Color" 
                value="#191919" 
                token="--foreground"
                isHighlighted={highlightedToken === '--foreground'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Thumb Background" 
                value="white" 
                token="--background"
                isHighlighted={highlightedToken === '--background'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Thumb Border Color" 
                value="#191919" 
                token="--foreground"
                isHighlighted={highlightedToken === '--foreground'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Border Radius" 
                value="4px" 
                token="--radius-sm"
                isHighlighted={highlightedToken === '--radius-sm'}
                onClick={handleTokenClick}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Usage Guidelines */}
      <CollapsibleCodeBlock
        title="Usage Guidelines"
        isOpen={showGuidelines}
        onToggle={() => setShowGuidelines(!showGuidelines)}
        animationDelay="400ms"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '12px', fontFamily: 'Inter Tight, sans-serif' }}>When to use</h3>
            <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'Inter Tight, sans-serif' }}>
              <li>Volume, brightness, or other continuous value adjustments</li>
              <li>Selecting a value within a defined numerical range</li>
              <li>Setting thresholds, limits, or boundaries (e.g., price ranges)</li>
              <li>Fine-tuning settings where precision matters but direct input isn't necessary</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '12px', fontFamily: 'Inter Tight, sans-serif' }}>When not to use</h3>
            <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'Inter Tight, sans-serif' }}>
              <li>When precise numeric input is required — use Input Text with number type instead</li>
              <li>Binary on/off choices — use Toggle or Checkbox instead</li>
              <li>Selection from discrete options — use Radio Button or Dropdown instead</li>
              <li>Accessibility concerns with fine motor control — provide alternative input methods</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '12px', fontFamily: 'Inter Tight, sans-serif' }}>Best practices</h3>
            <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'Inter Tight, sans-serif' }}>
              <li>Always provide a clear label indicating what the slider controls</li>
              <li>Display the current value visibly near the slider (e.g., "45%")</li>
              <li>Use appropriate min, max, and step values for the context</li>
              <li>Consider providing +/- buttons for keyboard-free incremental adjustment</li>
              <li>For ranges with units, display the unit alongside the value</li>
              <li>Ensure adequate spacing around the slider for touch targets (min 44×44px)</li>
            </ul>
          </div>
        </div>
      </CollapsibleCodeBlock>

      {/* Accessibility */}
      <CollapsibleCodeBlock
        title="Accessibility"
        isOpen={showAccessibility}
        onToggle={() => setShowAccessibility(!showAccessibility)}
        animationDelay="500ms"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter Tight, sans-serif' }}>
              Keyboard Navigation
              <Badge variant="outline" style={{ fontSize: 'var(--text-xs)', fontFamily: 'Inter Tight, sans-serif' }}>WCAG 2.1.1</Badge>
            </h3>
            <div style={{ background: 'var(--muted)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--text-sm)', fontFamily: 'Inter Tight, sans-serif' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <kbd style={{ padding: '4px 8px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>Tab</kbd>
                  <span style={{ color: 'var(--muted-foreground)' }}>Focus the slider</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <kbd style={{ padding: '4px 8px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>← / →</kbd>
                  <span style={{ color: 'var(--muted-foreground)' }}>Decrease/increase value by step</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <kbd style={{ padding: '4px 8px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>Home</kbd>
                  <span style={{ color: 'var(--muted-foreground)' }}>Jump to minimum value</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <kbd style={{ padding: '4px 8px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>End</kbd>
                  <span style={{ color: 'var(--muted-foreground)' }}>Jump to maximum value</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '12px', fontFamily: 'Inter Tight, sans-serif' }}>ARIA Requirements</h3>
            <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'Inter Tight, sans-serif' }}>
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>role="slider"</code> on the thumb element</li>
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>aria-valuenow</code> indicating current value</li>
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>aria-valuemin</code> and <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>aria-valuemax</code> defining the range</li>
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>aria-label</code> or linked label providing context</li>
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>aria-orientation="horizontal"</code> (default) or vertical when applicable</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '12px', fontFamily: 'Inter Tight, sans-serif' }}>Additional Considerations</h3>
            <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'Inter Tight, sans-serif' }}>
              <li>Thumb size should be at least 24×24px for adequate touch target</li>
              <li>Provide visible focus indicators when the slider is focused</li>
              <li>Consider offering an alternative number input for precise values</li>
              <li>Announce value changes to screen readers when adjusting</li>
              <li>Use sufficient color contrast between track, fill, and thumb (4.5:1 minimum)</li>
            </ul>
          </div>
        </div>
      </CollapsibleCodeBlock>

      {/* Code Example */}
      <CollapsibleCodeBlock
        title="Developer Code"
        code={jsxCode}
        language="jsx"
        isOpen={showCode}
        onToggle={() => setShowCode(!showCode)}
        animationDelay="600ms"
      />
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';
import { ButtonDocDark } from './ButtonDocDark';

/**
 * Button Documentation Responsive Showcase
 * Side-by-side comparison of all three responsive variants
 */
export function ButtonDocShowcase() {
  const [activeVariant, setActiveVariant] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Header */}
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', lineHeight: '1.1', margin: 0 }}>
            Button Documentation — Responsive Variants
          </h1>
          <Badge className="bg-accent text-accent-foreground" style={{ fontSize: 'var(--text-xs)' }}>
            3 Variants
          </Badge>
        </div>
        
        <p 
          className="text-muted-foreground" 
          style={{ 
            fontSize: 'var(--text-base)',
            lineHeight: '1.6',
            maxWidth: '900px',
            marginBottom: '24px'
          }}
        >
          Comprehensive button documentation optimized for three breakpoints: Desktop (1440px), Tablet (1024px), and Mobile (375px). 
          Each variant uses a tailored layout and interaction pattern for its viewport size.
        </p>

        {/* Variant Selector */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button
            variant={activeVariant === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveVariant('desktop')}
            className="button-press"
          >
            <Monitor size={16} />
            <span style={{ marginLeft: '8px' }}>Desktop (1440px)</span>
          </Button>
          
          <Button
            variant={activeVariant === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveVariant('tablet')}
            className="button-press"
          >
            <Tablet size={16} />
            <span style={{ marginLeft: '8px' }}>Tablet (1024px)</span>
          </Button>
          
          <Button
            variant={activeVariant === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveVariant('mobile')}
            className="button-press"
          >
            <Smartphone size={16} />
            <span style={{ marginLeft: '8px' }}>Mobile (375px)</span>
          </Button>
        </div>
      </header>

      {/* Specifications Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <Card className={activeVariant === 'desktop' ? 'border-accent' : ''}>
          <CardContent style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Monitor size={20} className={activeVariant === 'desktop' ? 'text-accent' : 'text-muted-foreground'} />
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                Desktop
              </h3>
            </div>
            <ul className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li>Two-column layout (500px + flex)</li>
              <li>Grid token cards (2 columns)</li>
              <li>Sticky preview panel</li>
              <li>All sections expanded</li>
              <li>Hover interactions</li>
            </ul>
          </CardContent>
        </Card>

        <Card className={activeVariant === 'tablet' ? 'border-accent' : ''}>
          <CardContent style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Tablet size={20} className={activeVariant === 'tablet' ? 'text-accent' : 'text-muted-foreground'} />
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                Tablet
              </h3>
            </div>
            <ul className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li>Stacked layout (preview first)</li>
              <li>Horizontal token scroller (snap center)</li>
              <li>Back navigation button</li>
              <li>2-column usage guidelines</li>
              <li>Touch-optimized controls</li>
            </ul>
          </CardContent>
        </Card>

        <Card className={activeVariant === 'mobile' ? 'border-accent' : ''}>
          <CardContent style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Smartphone size={20} className={activeVariant === 'mobile' ? 'text-accent' : 'text-muted-foreground'} />
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                Mobile
              </h3>
            </div>
            <ul className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li>Single-column vertical stack</li>
              <li>Collapsible code (default closed)</li>
              <li>Horizontal token scroller</li>
              <li>Compact toolbar under preview</li>
              <li>16px gutters (8-pt rhythm)</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview in Frame */}
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px' 
        }}>
          <h2 style={{ fontSize: 'var(--text-xl)', lineHeight: '1.2' }}>
            Live Preview
          </h2>
          <Badge variant="secondary">
            {activeVariant === 'desktop' && '1440px'}
            {activeVariant === 'tablet' && '1024px'}
            {activeVariant === 'mobile' && '375px'}
          </Badge>
        </div>

        {/* Viewport Frame */}
        <Card>
          <CardContent style={{ padding: 0 }}>
            <div 
              className="bg-muted"
              style={{ 
                width: '100%',
                height: 'auto',
                overflow: 'auto',
                borderRadius: 'var(--radius-lg)',
                position: 'relative'
              }}
            >
              {/* Device Frame */}
              <div 
                style={{ 
                  margin: '0 auto',
                  maxWidth: activeVariant === 'desktop' ? '1440px' : activeVariant === 'tablet' ? '1024px' : '375px',
                  background: 'var(--background)',
                  minHeight: '600px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'auto'
                }}
              >
                {activeVariant === 'desktop' && <ButtonDocDark />}
                {activeVariant === 'tablet' && <ButtonDocDark />}
                {activeVariant === 'mobile' && <ButtonDocDark />}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Design System Adherence */}
      <Card className="border-accent/40">
        <CardContent style={{ padding: '24px' }}>
          <h3 style={{ 
            fontSize: 'var(--text-lg)', 
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: '16px'
          }}>
            Design System Adherence
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h4 className="text-accent" style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: '8px'
              }}>
                CSS Variables
              </h4>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                All colors, spacing, borders, radius values use CSS variables from <code>/styles/globals.css</code>
              </p>
            </div>

            <div>
              <h4 className="text-accent" style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: '8px'
              }}>
                Typography Scale
              </h4>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                Inter Tight font family. Token-driven type scale reduces by 1 step (Tablet) and 2 steps (Mobile)
              </p>
            </div>

            <div>
              <h4 className="text-accent" style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: '8px'
              }}>
                8-Point Grid
              </h4>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                All spacing adheres to 8-pt rhythm. Mobile uses 16px gutters, Desktop uses 32px
              </p>
            </div>

            <div>
              <h4 className="text-accent" style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: '8px'
              }}>
              Micro-animations
              </h4>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                Smooth transitions, hover/press effects, fade-in-up animations. Mobile uses tap instead of hover
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <Card>
        <CardContent style={{ padding: '24px' }}>
          <h3 style={{ 
            fontSize: 'var(--text-lg)', 
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: '16px'
          }}>
            View Individual Variants
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'button-desktop';
              }}
              className="hover:text-accent smooth-transition"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'var(--foreground)'
              }}
            >
              <Monitor size={18} />
              <span style={{ flex: 1 }}>Component — Button — Doc — Desktop</span>
              <ExternalLink size={16} className="text-muted-foreground" />
            </a>

            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'button-tablet';
              }}
              className="hover:text-accent smooth-transition"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'var(--foreground)'
              }}
            >
              <Tablet size={18} />
              <span style={{ flex: 1 }}>Component — Button — Doc — Tablet</span>
              <ExternalLink size={16} className="text-muted-foreground" />
            </a>

            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'button-mobile';
              }}
              className="hover:text-accent smooth-transition"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'var(--foreground)'
              }}
            >
              <Smartphone size={18} />
              <span style={{ flex: 1 }}>Component — Button — Doc — Mobile</span>
              <ExternalLink size={16} className="text-muted-foreground" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
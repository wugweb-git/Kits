import React from 'react';
import { Button } from '../../design-system/components';
import { Check, Copy, ExternalLink, ArrowRight, ChevronRight } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function ButtonDoc() {
  const [variant, setVariant] = React.useState<'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'>('primary');
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg' | 'xl'>('xl');
  const [state, setState] = React.useState<'default' | 'active' | 'disabled' | 'loading'>('default');
  const [showLeftIcon, setShowLeftIcon] = React.useState(false);
  const [showRightIcon, setShowRightIcon] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(false);
  
  const [showCode, setShowCode] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);

  const handleTokenClick = (token: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getDynamicCode = () => {
    const props = [];
    if (variant !== 'primary') props.push(`variant="${variant}"`);
    if (size !== 'xl') props.push(`size="${size}"`);
    if (state === 'active') props.push(`state="active"`);
    if (state === 'disabled') props.push(`disabled`);
    if (state === 'loading') props.push(`loading`);
    if (fullWidth) props.push(`fullWidth`);
    if (showLeftIcon) props.push(`leftIcon={<ArrowRight />}`);
    if (showRightIcon) props.push(`rightIcon={<ChevronRight />}`);
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}` : '';
    
    return `import { Button } from "@/components/design-system/components/Button";
import { ArrowRight, ChevronRight } from "lucide-react";

export function ButtonDemo() {
  return (
    <Button${propsString}
    >
      Button Label
    </Button>
  );
}`;
  };

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
      <Button variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        <ExternalLink size={16} />
        View in Figma
      </Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader
        badge="Core Component"
        title="Button"
        description="A strictly defined button component with locked heights and explicit typography scaling. Ensures consistent actions across the entire application with accessible states and keyboard support."
        actions={headerActions}
      />

      {/* Interactive Playground */}
      <PageSection title="Interactive Playground" description="Customize and test the button component in real-time">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              {/* Variant */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const).map((v) => (
                    <Button
                      key={v}
                      variant={variant === v ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVariant(v)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {v}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                    <Button
                      key={s}
                      variant={size === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSize(s)}
                      style={{ textTransform: 'uppercase' }}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['default', 'active', 'disabled', 'loading'] as const).map((s) => (
                    <Button
                      key={s}
                      variant={state === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setState(s)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Icons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Icons</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  <Button
                    variant={showLeftIcon ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowLeftIcon(!showLeftIcon)}
                  >
                    Left Icon
                  </Button>
                  <Button
                    variant={showRightIcon ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowRightIcon(!showRightIcon)}
                  >
                    Right Icon
                  </Button>
                </div>
              </div>

              {/* Full Width */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Layout</label>
                <Button
                  variant={fullWidth ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFullWidth(!fullWidth)}
                >
                  Full Width
                </Button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: 'var(--spacing-12)',
              background: 'var(--muted)',
              borderRadius: 'var(--radius-lg)',
              minHeight: '200px'
            }}>
              <Button
                variant={variant}
                size={size}
                disabled={state === 'disabled'}
                loading={state === 'loading'}
                leftIcon={showLeftIcon ? <ArrowRight /> : undefined}
                rightIcon={showRightIcon ? <ChevronRight /> : undefined}
                fullWidth={fullWidth}
                style={{ maxWidth: fullWidth ? '100%' : undefined }}
              >
                Button Label
              </Button>
            </div>

            {/* Code */}
            {showCode && (
              <CollapsibleCodeBlock
                code={getDynamicCode()}
                language="tsx"
                showLineNumbers={true}
              />
            )}
          </div>
        </PageCard>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="CSS variables used by the Button component">
        <PageGrid cols={3}>
          <TokenCard
            token="--primary"
            label="Primary Background"
            value="rgba(255, 255, 255, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--primary')}
            isHighlighted={highlightedToken === '--primary'}
          />
          <TokenCard
            token="--accent"
            label="Accent Color"
            value="rgba(255, 190, 26, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--accent')}
            isHighlighted={highlightedToken === '--accent'}
          />
          <TokenCard
            token="--destructive"
            label="Destructive Color"
            value="rgba(239, 67, 67, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--destructive')}
            isHighlighted={highlightedToken === '--destructive'}
          />
          <TokenCard
            token="--spacing-4"
            label="Button Padding"
            value="16px"
            category="spacing"
            onClick={() => handleTokenClick('--spacing-4')}
            isHighlighted={highlightedToken === '--spacing-4'}
          />
          <TokenCard
            token="--radius-lg"
            label="Border Radius"
            value="12px"
            category="radius"
            onClick={() => handleTokenClick('--radius-lg')}
            isHighlighted={highlightedToken === '--radius-lg'}
          />
          <TokenCard
            token="--font-weight-medium"
            label="Font Weight"
            value="500"
            category="typography"
            onClick={() => handleTokenClick('--font-weight-medium')}
            isHighlighted={highlightedToken === '--font-weight-medium'}
          />
        </PageGrid>
      </PageSection>

      {/* Usage Guidelines */}
      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>When to Use</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>For primary actions that submit forms or advance workflows</li>
              <li>For secondary actions that provide alternative options</li>
              <li>For destructive actions that require user confirmation</li>
            </ul>

            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0, marginTop: 'var(--spacing-4)' }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use clear, action-oriented labels (e.g., "Save Changes" instead of "Submit")</li>
              <li>Limit one primary button per screen section</li>
              <li>Use loading state for async operations to provide feedback</li>
              <li>Ensure adequate touch target size (minimum 44x44px)</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>

      {/* Accessibility */}
      <PageSection title="Accessibility">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Keyboard Support</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>Enter</code> / <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>Space</code> - Activates the button</li>
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>Tab</code> - Moves focus to the next focusable element</li>
            </ul>

            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0, marginTop: 'var(--spacing-4)' }}>ARIA Attributes</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>aria-disabled</code> - Indicates disabled state to screen readers</li>
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>aria-busy</code> - Indicates loading state</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

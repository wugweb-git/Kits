import React from 'react';
import { Copy, Check, ChevronRight, Info, FileCode, Home, Slash, ArrowRight, Dot, Code2, ExternalLink } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem } from '../../wugweb/Breadcrumb';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function BreadcrumbDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [selectedSeparator, setSelectedSeparator] = React.useState<'slash' | 'chevron' | 'arrow' | 'dot'>('slash');
  const [showHomeIcon, setShowHomeIcon] = React.useState(false);
  const [enableTruncation, setEnableTruncation] = React.useState(false);
  const [showAdvancedTokens, setShowAdvancedTokens] = React.useState(false);

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

  const basicItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: showHomeIcon ? <Home size={14} /> : undefined },
    { label: 'Products', href: '/products' },
    { label: 'An Application', current: true },
  ];

  const longItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects', href: '/projects' },
    { label: 'Design System', href: '/design-system' },
    { label: 'Components', href: '/components' },
    { label: 'Breadcrumb', current: true },
  ];

  const coreTokens = [
    { name: 'Link Color', token: '--muted-foreground', value: 'rgba(161, 161, 161, 1.00)', category: 'Color' },
    { name: 'Link Hover', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Current Page', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Separator Color', token: '--muted-foreground', value: 'rgba(161, 161, 161, 1.00)', category: 'Color' },
    { name: 'Font Size (md)', token: '--text-sm', value: '14px', category: 'Typography' },
    { name: 'Separator Padding', token: '--spacing-2', value: '8px', category: 'Spacing' },
  ];

  const advancedTokens = [
    { name: 'Font Family', token: 'Inter Tight', value: 'Inter Tight, sans-serif', category: 'Typography' },
    { name: 'Font Size (sm)', token: '--text-xs', value: '12px', category: 'Typography' },
    { name: 'Font Size (lg)', token: '--text-base', value: '16px', category: 'Typography' },
    { name: 'Icon Gap', token: '--spacing-1', value: '4px', category: 'Spacing' },
    { name: 'Transition Duration', token: '--motion-duration-fast', value: '80ms', category: 'Motion' },
    { name: 'Transition Easing', token: '--motion-easing-standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)', category: 'Motion' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens, ...advancedTokens] : coreTokens;

  const getDynamicCode = () => {
    const props = [];
    if (selectedSize !== 'md') props.push(`size="${selectedSize}"`);
    if (selectedSeparator !== 'slash') props.push(`separator="${selectedSeparator}"`);
    if (showHomeIcon) props.push(`// Add icon to first item`);
    if (enableTruncation) props.push(`maxItems={3}`);
    
    return `import { Breadcrumb } from '@/components/wugweb/Breadcrumb';
import { Home } from 'lucide-react';

const items = [
  { label: 'Home', href: '/'${showHomeIcon ? ', icon: <Home size={14} />' : ''} },
  { label: 'Products', href: '/products' },
  { label: 'An Application', current: true },
];

export function BreadcrumbDemo() {
  return (
    <Breadcrumb
      items={items}${props.length > 0 ? '\n      ' + props.join('\n      ') : ''}
    />
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
        badge="Navigation Component"
        title="Breadcrumb"
        description="A navigation component that shows the user's location within the site hierarchy. Supports multiple separators, sizes, truncation, and full accessibility."
        actions={headerActions}
      />

      {/* Interactive Playground */}
      <PageSection title="Interactive Playground" description="Customize and test the breadcrumb component in real-time">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              {/* Size */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['sm', 'md', 'lg'] as const).map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      style={{ textTransform: 'uppercase' }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Separator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Separator</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['slash', 'chevron', 'dot'] as const).map((sep) => (
                    <Button
                      key={sep}
                      variant={selectedSeparator === sep ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSeparator(sep)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {sep}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Options</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={showHomeIcon}
                      onChange={(e) => setShowHomeIcon(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                    />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Show home icon</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={enableTruncation}
                      onChange={(e) => setEnableTruncation(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                    />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Enable truncation</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ marginBottom: 'var(--spacing-8)' }}>
            <div style={{ 
              padding: 'var(--spacing-8)', 
              background: 'var(--muted)', 
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px'
            }}>
              <Breadcrumb 
                items={enableTruncation ? longItems : basicItems} 
                separator={selectedSeparator} 
                size={selectedSize}
                maxItems={enableTruncation ? 3 : undefined}
              />
            </div>
          </div>

          {/* Code */}
          <CollapsibleCodeBlock
            code={getDynamicCode()}
            language="tsx"
            filename="BreadcrumbDemo.tsx"
            showLineNumbers
          />
        </PageCard>
      </PageSection>

      {/* Variants */}
      <PageSection title="Variants" description="Different breadcrumb configurations">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Basic Breadcrumb
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Simple navigation path
              </p>
              <div style={{ padding: 'var(--spacing-5)', background: 'var(--muted)', borderRadius: 'var(--radius-md)' }}>
                <Breadcrumb items={basicItems} />
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                With Home Icon
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Leading icon for the first item
              </p>
              <div style={{ padding: 'var(--spacing-5)', background: 'var(--muted)', borderRadius: 'var(--radius-md)' }}>
                <Breadcrumb items={[
                  { label: 'Home', href: '/', icon: <Home size={14} /> },
                  { label: 'Products', href: '/products' },
                  { label: 'An Application', current: true },
                ]} />
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Truncated Path
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Shows first and last items with ellipsis for long paths
              </p>
              <div style={{ padding: 'var(--spacing-5)', background: 'var(--muted)', borderRadius: 'var(--radius-md)' }}>
                <Breadcrumb items={longItems} maxItems={3} />
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Size Variants */}
      <PageSection title="Sizes" description="Available size options">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Small (12px)</div>
                <Breadcrumb items={basicItems} size="sm" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Medium (14px) - Default</div>
                <Breadcrumb items={basicItems} size="md" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Large (16px)</div>
                <Breadcrumb items={basicItems} size="lg" />
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Separator Variants */}
      <PageSection title="Separators" description="Available separator styles">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Slash - Default</div>
                <Breadcrumb items={basicItems} separator="slash" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Chevron</div>
                <Breadcrumb items={basicItems} separator="chevron" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Arrow</div>
                <Breadcrumb items={basicItems} separator="arrow" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Dot</div>
                <Breadcrumb items={basicItems} separator="dot" />
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="CSS variables used by this component">
        <PageCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
              {showAdvancedTokens ? 'Showing all tokens' : 'Showing core tokens only'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedTokens(!showAdvancedTokens)}
            >
              {showAdvancedTokens ? 'Show Less' : 'Show All'}
            </Button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-3)' }}>
            {allTokens.map((token, index) => (
              <TokenCard
                key={index}
                name={token.name}
                token={token.token}
                value={token.value}
                category={token.category}
                highlighted={highlightedToken === token.token}
                onClick={() => handleTokenClick(token.token)}
              />
            ))}
          </div>
        </PageCard>
      </PageSection>

      {/* Usage Guidelines */}
      <PageSection title="Usage Guidelines" description="Best practices for using breadcrumbs">
        <PageGrid columns={2}>
          <PageCard>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: 'var(--radius-full)', 
                background: 'var(--success)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Check size={16} style={{ color: 'var(--success-foreground)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                  Do
                </h3>
                <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, paddingLeft: 'var(--spacing-4)' }}>
                  <li>Use breadcrumbs for hierarchical navigation</li>
                  <li>Show the current page as non-clickable</li>
                  <li>Keep labels concise (1-2 words)</li>
                  <li>Use consistent separators throughout</li>
                  <li>Truncate long paths with ellipsis</li>
                </ul>
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: 'var(--radius-full)', 
                background: 'var(--destructive)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Info size={16} style={{ color: 'var(--destructive-foreground)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                  Don't
                </h3>
                <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, paddingLeft: 'var(--spacing-4)' }}>
                  <li>Use for flat navigation structures</li>
                  <li>Make the current page clickable</li>
                  <li>Use overly long labels</li>
                  <li>Mix different separator styles</li>
                  <li>Show every level in deep hierarchies</li>
                </ul>
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Accessibility */}
      <PageSection title="Accessibility" description="Built-in accessibility features">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Semantic HTML
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Uses <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>&lt;nav&gt;</code> with <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>aria-label="Breadcrumb"</code> and ordered list structure.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Current Page Indicator
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                The current page uses <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>aria-current="page"</code> for screen readers.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Keyboard Navigation
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                All links are keyboard accessible with Tab key and have visible focus indicators.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Hidden Separators
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Separators use <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>aria-hidden="true"</code> to prevent screen reader announcement.
              </p>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

// Helper component for anatomy section
function AnatomyItem({ label, description, token }: { label: string; description: string; token: string }) {
  return (
    <div style={{ 
      padding: 'var(--spacing-3)', 
      background: 'var(--muted)', 
      borderRadius: 'var(--radius-md)',
      borderLeft: '3px solid var(--accent)'
    }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-1)' }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-1)' }}>
        {description}
      </div>
      <code style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontFamily: 'monospace' }}>
        {token}
      </code>
    </div>
  );
}

import React from 'react';
import { Tag } from '../../design-system/components';
import { Check, Copy, ExternalLink, X } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function TagDoc() {
  const [selectedVariant, setSelectedVariant] = React.useState<'filled' | 'outlined' | 'ghost'>('filled');
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [showCode, setShowCode] = React.useState(true);

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
    if (selectedVariant !== 'filled') props.push(`variant="${selectedVariant}"`);
    if (selectedSize !== 'md') props.push(`size="${selectedSize}"`);
    
    const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
    
    return `import { Tag } from "@/components/design-system/components";
import { X } from "lucide-react";

export function TagDemo() {
  return (
    <Tag${propsString} onRemove={() => console.log('removed')}>
      Design System
    </Tag>
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
        badge="UI Component"
        title="Tag"
        description="A compact element for labeling, categorizing, or organizing items with optional remove functionality."
        actions={headerActions}
      />

      {/* Interactive Playground */}
      <PageSection title="Interactive Playground" description="Customize and test the tag component in real-time">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              {/* Variant */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['filled', 'outlined', 'ghost'] as const).map((v) => (
                    <Button
                      key={v}
                      variant={selectedVariant === v ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedVariant(v)}
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
                  {(['sm', 'md', 'lg'] as const).map((s) => (
                    <Button
                      key={s}
                      variant={selectedSize === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(s)}
                      style={{ textTransform: 'uppercase' }}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ 
              padding: 'var(--spacing-12)',
              background: 'var(--muted)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              gap: 'var(--spacing-3)',
              flexWrap: 'wrap'
            }}>
              <Tag variant={selectedVariant} size={selectedSize}>
                Design System
              </Tag>
              <Tag variant={selectedVariant} size={selectedSize} onRemove={() => alert('Tag removed')}>
                React
              </Tag>
              <Tag variant={selectedVariant} size={selectedSize} onRemove={() => alert('Tag removed')}>
                TypeScript
              </Tag>
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
      <PageSection title="Design Tokens" description="CSS variables used by the Tag component">
        <PageGrid cols={3}>
          <TokenCard
            token="--accent"
            label="Primary Color"
            value="rgba(255, 190, 26, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--accent')}
            isHighlighted={highlightedToken === '--accent'}
          />
          <TokenCard
            token="--accent-subtle"
            label="Subtle Background"
            value="rgba(255, 190, 26, 0.1)"
            category="color"
            onClick={() => handleTokenClick('--accent-subtle')}
            isHighlighted={highlightedToken === '--accent-subtle'}
          />
          <TokenCard
            token="--border"
            label="Border Color"
            value="rgba(43, 43, 43, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--border')}
            isHighlighted={highlightedToken === '--border'}
          />
          <TokenCard
            token="--spacing-3"
            label="Padding"
            value="12px"
            category="spacing"
            onClick={() => handleTokenClick('--spacing-3')}
            isHighlighted={highlightedToken === '--spacing-3'}
          />
          <TokenCard
            token="--radius-full"
            label="Border Radius"
            value="9999px"
            category="radius"
            onClick={() => handleTokenClick('--radius-full')}
            isHighlighted={highlightedToken === '--radius-full'}
          />
          <TokenCard
            token="--text-sm"
            label="Font Size"
            value="0.875rem"
            category="typography"
            onClick={() => handleTokenClick('--text-sm')}
            isHighlighted={highlightedToken === '--text-sm'}
          />
        </PageGrid>
      </PageSection>

      {/* Usage Guidelines */}
      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use tags to represent selected filters, categories, or attributes</li>
              <li>Include a remove button when tags are dismissible</li>
              <li>Keep tag labels short and descriptive</li>
              <li>Use consistent styling for tags in the same context</li>
              <li>Consider using different colors to represent different categories</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

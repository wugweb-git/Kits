import React from 'react';
import { Card } from '../../wugweb/Card';
import { Check, Copy, ExternalLink, Heart, Share2, Bookmark } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../wugweb/Button';
import { copyToClipboard } from '../../../utils/clipboard';

export function CardDoc() {
  const [showCode, setShowCode] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [activeVariant, setActiveVariant] = React.useState<'default' | 'outlined' | 'elevated'>('default');

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
    return `import { Card } from "@/components/wugweb/Card";

export function CardDemo() {
  return (
    <Card${activeVariant !== 'default' ? ` variant="${activeVariant}"` : ''}>
      <div style={{ padding: 'var(--spacing-6)' }}>
        <h3 style={{ 
          fontSize: 'var(--text-lg)', 
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--foreground)',
          margin: 0,
          marginBottom: 'var(--spacing-2)'
        }}>
          Card Title
        </h3>
        <p style={{ 
          fontSize: 'var(--text-base)', 
          color: 'var(--muted-foreground)',
          margin: 0
        }}>
          Card content goes here
        </p>
      </div>
    </Card>
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
        badge="Layout Component"
        title="Card"
        description="A flexible container component for grouping related content with consistent styling and optional variants."
        actions={headerActions}
      />

      {/* Interactive Playground */}
      <PageSection title="Interactive Playground" description="Customize and test the card component in real-time">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              {/* Variant */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['default', 'outlined', 'elevated'] as const).map((v) => (
                    <Button
                      key={v}
                      variant={activeVariant === v ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveVariant(v)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {v}
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
              minHeight: '300px'
            }}>
              <Card variant={activeVariant} style={{ maxWidth: '400px', width: '100%' }}>
                <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div>
                    <h3 style={{ 
                      fontSize: 'var(--text-xl)', 
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--foreground)',
                      margin: 0,
                      marginBottom: 'var(--spacing-2)'
                    }}>
                      Card Title
                    </h3>
                    <p style={{ 
                      fontSize: 'var(--text-base)', 
                      color: 'var(--muted-foreground)',
                      margin: 0,
                      lineHeight: 1.6
                    }}>
                      This is a card component that can contain any content. It provides a consistent container with proper spacing and styling.
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--border)' }}>
                    <Button variant="ghost" size="sm" style={{ gap: 'var(--spacing-2)' }}>
                      <Heart size={16} />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" style={{ gap: 'var(--spacing-2)' }}>
                      <Share2 size={16} />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" style={{ gap: 'var(--spacing-2)' }}>
                      <Bookmark size={16} />
                      Save
                    </Button>
                  </div>
                </div>
              </Card>
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

      {/* Variants */}
      <PageSection title="Variants" description="Different card styles for various use cases">
        <PageGrid cols={3}>
          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Default</h4>
              <Card variant="default">
                <div style={{ padding: 'var(--spacing-4)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>
                    Standard card with subtle background
                  </p>
                </div>
              </Card>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Outlined</h4>
              <Card variant="outlined">
                <div style={{ padding: 'var(--spacing-4)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>
                    Card with prominent border
                  </p>
                </div>
              </Card>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Elevated</h4>
              <Card variant="elevated">
                <div style={{ padding: 'var(--spacing-4)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>
                    Card with shadow elevation
                  </p>
                </div>
              </Card>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="CSS variables used by the Card component">
        <PageGrid cols={3}>
          <TokenCard
            token="--card"
            label="Background"
            value="rgba(28, 28, 28, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--card')}
            isHighlighted={highlightedToken === '--card'}
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
            token="--spacing-6"
            label="Default Padding"
            value="24px"
            category="spacing"
            onClick={() => handleTokenClick('--spacing-6')}
            isHighlighted={highlightedToken === '--spacing-6'}
          />
          <TokenCard
            token="--radius-lg"
            label="Border Radius"
            value="12px"
            category="radius"
            onClick={() => handleTokenClick('--radius-lg')}
            isHighlighted={highlightedToken === '--radius-lg'}
          />
        </PageGrid>
      </PageSection>

      {/* Usage Guidelines */}
      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use cards to group related information and actions</li>
              <li>Maintain consistent padding across all cards in the same context</li>
              <li>Use elevated variant sparingly for important or interactive cards</li>
              <li>Consider using outlined variant for cards that need more visual separation</li>
              <li>Keep card content scannable with clear hierarchy</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

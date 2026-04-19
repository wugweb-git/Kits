import React from 'react';
import { Copy, Check, ExternalLink, Github, Star } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Collapsible } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function CollapsibleDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(true);

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

  const jsxCode = `import { Collapsible } from './components/design-system/components';

<Collapsible
  title="@peduarte starred 3 repositories"
  description="View recent activity"
  defaultOpen={true}
>
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Github size={16} />
      <span>vercel/next.js</span>
    </div>
    <div className="flex items-center gap-2">
      <Star size={16} />
      <span>120,000 stars</span>
    </div>
  </div>
</Collapsible>

// Design Tokens Used:
// Background: var(--input-background)
// Border: var(--border)
// Text: var(--foreground)
// Radius: var(--radius-md)`;

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
        title="Collapsible"
        description="An interactive component that reveals or hides content with smooth animations. Perfect for displaying additional details, form sections, or organizing hierarchical information."
        actions={headerActions}
      />

      {/* Interactive Preview */}
      <PageSection title="Interactive Preview" description="Try expanding and collapsing the section">
        <PageCard>
          <div style={{ maxWidth: '600px' }}>
            <Collapsible
              title="@peduarte starred 3 repositories"
              defaultOpen={isOpen}
              onOpenChange={setIsOpen}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', padding: 'var(--spacing-4)', background: 'var(--input-background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <Github size={16} style={{ color: 'var(--muted-foreground)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>vercel/next.js</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <Star size={16} style={{ color: 'var(--muted-foreground)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>120,000 stars</span>
                </div>
              </div>
            </Collapsible>
          </div>
        </PageCard>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="All CSS variables used in this component">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          <TokenCard
            label="Background"
            token="--input-background"
            value="#1A1A1A"
            color="var(--input-background)"
            onClick={() => handleTokenClick('--input-background')}
            isHighlighted={highlightedToken === '--input-background'}
          />
          <TokenCard
            label="Border Color"
            token="--border"
            value="#2B2B2B"
            color="var(--border)"
            onClick={() => handleTokenClick('--border')}
            isHighlighted={highlightedToken === '--border'}
          />
          <TokenCard
            label="Text Color"
            token="--foreground"
            value="#FFFFFF"
            color="var(--foreground)"
            onClick={() => handleTokenClick('--foreground')}
            isHighlighted={highlightedToken === '--foreground'}
          />
        </div>
      </PageSection>

      {/* Code Examples */}
      <PageSection title="Code Examples" description="Copy and paste the code below">
        <CollapsibleCodeBlock code={jsxCode} language="tsx" />
      </PageSection>

      {/* Accessibility */}
      <PageSection title="Accessibility" description="WCAG 2.1 Level AA compliant">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-2)', color: 'var(--foreground)' }}>
                  Best Practices
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                  <li>Uses <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>aria-expanded</code> to indicate the current state</li>
                  <li>Keyboard accessible with <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>Enter</code> and <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>Space</code> support</li>
                  <li>Smooth animations respect user's <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>prefers-reduced-motion</code> settings</li>
                </ul>
              </div>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

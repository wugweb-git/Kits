import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Jumbotron } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { siteInventory } from '../../../generated/siteInventory';
import { copyToClipboard } from '../../../utils/clipboard';

export function JumbotronDoc() {
  const [size, setSize] = React.useState<'s' | 'm' | 'l'>('m');
  const [centered, setCentered] = React.useState(true);
  const [showPrimary, setShowPrimary] = React.useState(true);
  const [showSecondary, setShowSecondary] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);

  const handleTokenClick = (token: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
  };

  const getDynamicCode = () => `import { Jumbotron } from "@/components/design-system/components";

<Jumbotron
  title="Build faster with Wugweb Kits"
  subtitle="Design System"
  description="81 production-ready components built on CSS variables. Ship consistent UIs in record time."
  size="${size}"
  centered={${centered}}
  ${showPrimary ? 'primaryAction={{ label: "Get Started", onClick: () => {} }}' : ''}
  ${showSecondary ? 'secondaryAction={{ label: "View Components", onClick: () => {} }}' : ''}
/>`;

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
      <Button variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        <ExternalLink size={16} />View in Figma
      </Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader
        badge="Layout Component"
        title="Jumbotron"
        description="A hero section component for page headers and landing pages. Features a title, subtitle, description, and up to two call-to-action buttons with optional background image support."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize the jumbotron layout">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['s', 'm', 'l'] as const).map(s => (
                  <Button key={s} variant={size === s ? 'default' : 'outline'} size="sm" onClick={() => setSize(s)}>{s.toUpperCase()}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Alignment</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={centered ? 'default' : 'outline'} size="sm" onClick={() => setCentered(true)}>Centered</Button>
                <Button variant={!centered ? 'default' : 'outline'} size="sm" onClick={() => setCentered(false)}>Left</Button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Actions</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                <Button variant={showPrimary ? 'default' : 'outline'} size="sm" onClick={() => setShowPrimary(!showPrimary)}>Primary CTA</Button>
                <Button variant={showSecondary ? 'default' : 'outline'} size="sm" onClick={() => setShowSecondary(!showSecondary)}>Secondary CTA</Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <Jumbotron
                title="Build faster with Wugweb Kits"
                subtitle="Design System"
                description="81 production-ready components built on CSS variables. Ship consistent UIs in record time."
                size={size}
                centered={centered}
                primaryAction={showPrimary ? { label: 'Get Started', onClick: () => {} } : undefined}
                secondaryAction={showSecondary ? { label: 'View Components', onClick: () => {} } : undefined}
              />
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--surface-900" label="Jumbotron Background" value="rgba(18, 18, 18, 1.00)" category="color" onClick={() => handleTokenClick('--surface-900')} isHighlighted={highlightedToken === '--surface-900'} />
          <TokenCard token="--foreground" label="Title Color" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--foreground')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard token="--accent" label="Subtitle Color" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--muted-foreground" label="Description Color" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--section-spacing-desktop" label="Padding" value="64px" category="spacing" onClick={() => handleTokenClick('--section-spacing-desktop')} isHighlighted={highlightedToken === '--section-spacing-desktop'} />
          <TokenCard token="--radius-lg" label="Border Radius" value="12px" category="radius" onClick={() => handleTokenClick('--radius-lg')} isHighlighted={highlightedToken === '--radius-lg'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

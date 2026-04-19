import React from 'react';
import { Copy, Check, ExternalLink, Menu, X } from 'lucide-react';
import { Header, HeaderNavItem } from '../../design-system/components';
import { Logo } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function HeaderDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
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

  const navItems: HeaderNavItem[] = [
    { label: 'About', href: '#about' },
    { label: 'Products', href: '#products' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  const coreTokens = [
    { name: 'Background', token: '--background', value: 'rgba(18, 18, 18, 1.00)', category: 'Color' },
    { name: 'Border Color', token: '--border', value: 'rgba(43, 43, 43, 1.00)', category: 'Color' },
    { name: 'Text Color', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Height', token: '--header-height', value: '64px', category: 'Layout' },
    { name: 'Padding', token: '--spacing-5', value: '20px', category: 'Spacing' },
  ];

  const advancedTokens = [
    { name: 'Font Family', token: 'Inter Tight', value: 'Inter Tight, sans-serif', category: 'Typography' },
    { name: 'Font Weight', token: '--font-weight-medium', value: '500', category: 'Typography' },
    { name: 'Font Size', token: '--text-base', value: '16px', category: 'Typography' },
    { name: 'Transition Duration', token: '--motion-duration-normal', value: '120ms', category: 'Motion' },
    { name: 'Transition Easing', token: '--motion-easing-standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)', category: 'Motion' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens, ...advancedTokens] : coreTokens;

  const codeExample = `import { Header } from '@/components/design-system/components';
import { Logo } from '@/components/design-system/components';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export function MyHeader() {
  return (
    <Header navItems={navItems} logo={<Logo />} />
  );
}`;

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
        title="Header"
        description="A responsive header component with logo, navigation items, and mobile menu support. Provides consistent top-level navigation across the application."
        actions={headerActions}
      />

      {/* Basic Example */}
      <PageSection title="Basic Example" description="Default header configuration">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{ 
              padding: 'var(--spacing-5)', 
              background: 'var(--muted)', 
              borderRadius: 'var(--radius-lg)',
              minHeight: '120px'
            }}>
              <Header navItems={navItems} logo={<Logo />} />
            </div>
          </div>

          <CollapsibleCodeBlock
            code={codeExample}
            language="tsx"
            filename="HeaderDemo.tsx"
            showLineNumbers
          />
        </PageCard>
      </PageSection>

      {/* Variants */}
      <PageSection title="Variants" description="Different header configurations">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                With Logo
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Header with logo on the left
              </p>
              <div style={{ padding: 'var(--spacing-5)', background: 'var(--muted)', borderRadius: 'var(--radius-md)' }}>
                <Header navItems={navItems} logo={<Logo />} />
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Without Logo
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Header with navigation only
              </p>
              <div style={{ padding: 'var(--spacing-5)', background: 'var(--muted)', borderRadius: 'var(--radius-md)' }}>
                <Header navItems={navItems} />
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

      {/* Accessibility */}
      <PageSection title="Accessibility" description="Built-in accessibility features">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Semantic HTML
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Uses <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>&lt;header&gt;</code> and <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>&lt;nav&gt;</code> elements with proper landmarks.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Keyboard Navigation
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                All navigation links are keyboard accessible with visible focus indicators.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Mobile Menu
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Mobile menu button includes proper ARIA labels and expanded/collapsed states.
              </p>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

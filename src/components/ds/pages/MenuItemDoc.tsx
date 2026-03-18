import React from 'react';
import { Copy, Check, ExternalLink, Home, Settings, User, LogOut } from 'lucide-react';
import { MenuItem } from '../../wugweb/MenuItem';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function MenuItemDoc() {
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

  const coreTokens = [
    { name: 'Background', token: '--muted', value: 'rgba(38, 38, 38, 1.00)', category: 'Color' },
    { name: 'Hover Background', token: '--accent-subtle', value: 'rgba(255, 190, 26, 0.1)', category: 'Color' },
    { name: 'Text Color', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Border Radius', token: '--radius-md', value: '8px', category: 'Border' },
    { name: 'Padding', token: '--spacing-3', value: '12px', category: 'Spacing' },
  ];

  const advancedTokens = [
    { name: 'Font Family', token: 'Inter Tight', value: 'Inter Tight, sans-serif', category: 'Typography' },
    { name: 'Font Weight', token: '--font-weight-medium', value: '500', category: 'Typography' },
    { name: 'Font Size', token: '--text-sm', value: '14px', category: 'Typography' },
    { name: 'Icon Size', token: '20px', value: '20px', category: 'Sizing' },
    { name: 'Transition Duration', token: '--motion-duration-normal', value: '120ms', category: 'Motion' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens, ...advancedTokens] : coreTokens;

  const codeExample = `import { MenuItem } from '@/components/wugweb/MenuItem';
import { Home, Settings, LogOut } from 'lucide-react';

export function MyMenu() {
  return (
    <div>
      <MenuItem icon={<Home />} label="Home" onClick={() => {}} />
      <MenuItem icon={<Settings />} label="Settings" onClick={() => {}} />
      <MenuItem icon={<LogOut />} label="Log Out" onClick={() => {}} destructive />
    </div>
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
        badge="Navigation Component"
        title="Menu Item"
        description="Individual menu item component for dropdown menus and navigation lists. Supports icons, active states, and destructive actions."
        actions={headerActions}
      />

      {/* Basic Example */}
      <PageSection title="Basic Example" description="Default menu item configuration">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{ 
              padding: 'var(--spacing-5)', 
              background: 'var(--muted)', 
              borderRadius: 'var(--radius-lg)',
              maxWidth: '300px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <MenuItem icon={<Home />} label="Home" onClick={() => {}} />
                <MenuItem icon={<User />} label="Profile" onClick={() => {}} />
                <MenuItem icon={<Settings />} label="Settings" onClick={() => {}} />
                <MenuItem icon={<LogOut />} label="Log Out" onClick={() => {}} destructive />
              </div>
            </div>
          </div>

          <CollapsibleCodeBlock
            code={codeExample}
            language="tsx"
            filename="MenuItemDemo.tsx"
            showLineNumbers
          />
        </PageCard>
      </PageSection>

      {/* Variants */}
      <PageSection title="Variants" description="Different menu item styles">
        <PageGrid columns={2}>
          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                With Icon
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Menu item with leading icon
              </p>
              <div style={{ maxWidth: '250px' }}>
                <MenuItem icon={<Home />} label="Home" onClick={() => {}} />
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Without Icon
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Simple text menu item
              </p>
              <div style={{ maxWidth: '250px' }}>
                <MenuItem label="Home" onClick={() => {}} />
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Active State
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Highlighted when current
              </p>
              <div style={{ maxWidth: '250px' }}>
                <MenuItem icon={<Settings />} label="Settings" onClick={() => {}} active />
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Destructive
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                For delete or dangerous actions
              </p>
              <div style={{ maxWidth: '250px' }}>
                <MenuItem icon={<LogOut />} label="Log Out" onClick={() => {}} destructive />
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
                Keyboard Navigation
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Fully keyboard accessible with Tab navigation and Enter/Space activation.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Focus Indicators
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Visible focus ring when navigating with keyboard.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                ARIA Labels
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Proper role attributes and aria labels for screen readers.
              </p>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

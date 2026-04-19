import React from 'react';
import { Copy, Check, ExternalLink, X } from 'lucide-react';
import { Drawer } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function DrawerDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState<'left' | 'right'>('right');
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
    { name: 'Overlay Background', token: '--overlay-background', value: 'rgba(0, 0, 0, 0.6)', category: 'Color' },
    { name: 'Drawer Background', token: '--card', value: 'var(--surface-800)', category: 'Color' },
    { name: 'Text Color', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Drawer Width', token: '400px', value: '400px', category: 'Sizing' },
    { name: 'Padding', token: '--spacing-6', value: '24px', category: 'Spacing' },
  ];

  const advancedTokens = [
    { name: 'Font Family', token: 'Inter Tight', value: 'Inter Tight, sans-serif', category: 'Typography' },
    { name: 'Transition Duration', token: '--motion-duration-medium', value: '180ms', category: 'Motion' },
    { name: 'Transition Easing', token: '--motion-easing-standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)', category: 'Motion' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens, ...advancedTokens] : coreTokens;

  const codeExample = `import { Drawer } from '@/components/design-system/components';
import { useState } from 'react';

export function DrawerDemo() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Drawer</button>
      
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Settings"
        position="${position}"
      >
        <p>Drawer content goes here</p>
      </Drawer>
    </>
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
        badge="Overlay Component"
        title="Drawer"
        description="A panel that slides in from the edge of the screen. Perfect for navigation menus, filters, or additional content."
        actions={headerActions}
      />

      {/* Interactive Example */}
      <PageSection title="Interactive Example" description="Test the drawer component">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-6)' }}>
            <div>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)', display: 'block' }}>
                Position
              </label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['left', 'right'] as const).map((pos) => (
                  <Button
                    key={pos}
                    variant={position === pos ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPosition(pos)}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {pos}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{ 
              padding: 'var(--spacing-8)', 
              background: 'var(--muted)', 
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px'
            }}>
              <Button onClick={() => setIsOpen(true)}>
                Open {position} Drawer
              </Button>
            </div>
          </div>

          <CollapsibleCodeBlock
            code={codeExample}
            language="tsx"
            filename="DrawerDemo.tsx"
            showLineNumbers
          />

          <Drawer
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Drawer Title"
            position={position}
          >
            <div style={{ padding: 'var(--spacing-4)' }}>
              <p style={{ color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
                This is the drawer content. You can put any components here.
              </p>
              <Button onClick={() => setIsOpen(false)}>Close Drawer</Button>
            </div>
          </Drawer>
        </PageCard>
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
                Focus Trapping
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Tab focus is trapped within the drawer when open.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Escape to Close
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Press Escape key to close the drawer.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Click Outside
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Clicking the overlay closes the drawer.
              </p>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

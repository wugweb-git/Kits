import React from 'react';
import { Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react';
import { AlertDialog } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function AlertDialogDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
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
    { name: 'Dialog Background', token: '--card', value: 'var(--surface-800)', category: 'Color' },
    { name: 'Text Color', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Border Radius', token: '--radius-lg', value: '12px', category: 'Border' },
    { name: 'Padding', token: '--spacing-6', value: '24px', category: 'Spacing' },
  ];

  const advancedTokens = [
    { name: 'Font Family', token: 'Inter Tight', value: 'Inter Tight, sans-serif', category: 'Typography' },
    { name: 'Title Size', token: '--text-xl', value: '24px', category: 'Typography' },
    { name: 'Description Size', token: '--text-sm', value: '14px', category: 'Typography' },
    { name: 'Transition Duration', token: '--motion-duration-medium', value: '180ms', category: 'Motion' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens, ...advancedTokens] : coreTokens;

  const codeExample = `import { AlertDialog } from '@/components/design-system/components/AlertDialog';
import { useState } from 'react';

export function AlertDialogDemo() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Delete Account</button>
      
      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Account"
        description="This action cannot be undone. All your data will be permanently deleted."
        onConfirm={() => {
          // Handle delete
          setIsOpen(false);
        }}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
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
        title="Alert Dialog"
        description="A modal dialog that interrupts the user with important content and expects a response. Used for confirmations and destructive actions."
        actions={headerActions}
      />

      {/* Interactive Example */}
      <PageSection title="Interactive Example" description="Test the alert dialog">
        <PageCard>
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
              <Button onClick={() => setIsOpen(true)} variant="destructive">
                Delete Account
              </Button>
            </div>
          </div>

          <CollapsibleCodeBlock
            code={codeExample}
            language="tsx"
            filename="AlertDialogDemo.tsx"
            showLineNumbers
          />

          <AlertDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Delete Account"
            description="This action cannot be undone. All your data will be permanently deleted from our servers."
            onConfirm={() => {
              console.log('Confirmed');
              setIsOpen(false);
            }}
            confirmText="Delete"
            cancelText="Cancel"
            variant="destructive"
          />
        </PageCard>
      </PageSection>

      {/* Variants */}
      <PageSection title="Variants" description="Different alert dialog styles">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                  Default
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  Standard confirmation dialog
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                  Destructive
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  For dangerous actions like delete or remove
                </p>
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
                Focus Trapping
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Tab focus is trapped within the dialog when open.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                ARIA Attributes
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Uses <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>role="alertdialog"</code> and proper labeling.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Keyboard Support
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Press Escape to cancel, Enter to confirm.
              </p>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

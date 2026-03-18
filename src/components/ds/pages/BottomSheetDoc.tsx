import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { BottomSheet } from '../../wugweb/BottomSheet';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function BottomSheetDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showAdvancedTokens, setShowAdvancedTokens] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const coreTokens = [
    { name: 'Background', token: '--card', value: 'var(--surface-800)', category: 'Color' },
    { name: 'Overlay', token: '--overlay-background', value: 'rgba(0, 0, 0, 0.6)', category: 'Color' },
    { name: 'Border Radius', token: '--radius-lg', value: '12px', category: 'Border' },
    { name: 'Padding', token: '--spacing-6', value: '24px', category: 'Spacing' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens] : coreTokens;

  const code = `import { BottomSheet } from '@/components/wugweb/BottomSheet';

<BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <h2>Content Title</h2>
  <p>Bottom sheet content...</p>
</BottomSheet>`;

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm">
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
      <Button variant="outline" size="sm"><ExternalLink size={16} />View in Figma</Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader badge="Overlay Component" title="Bottom Sheet" description="A mobile-optimized panel that slides up from the bottom of the screen." actions={headerActions} />
      
      <PageSection title="Interactive Example">
        <PageCard>
          <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-4)' }}>
            <Button onClick={() => setIsOpen(true)}>Open Bottom Sheet</Button>
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="BottomSheetDemo.tsx" />
          <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div style={{ padding: 'var(--spacing-4)' }}>
              <h2 style={{ marginBottom: 'var(--spacing-3)', color: 'var(--foreground)' }}>Bottom Sheet</h2>
              <p style={{ color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>This is a bottom sheet component.</p>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </BottomSheet>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-3)' }}>
            {allTokens.map((token, i) => <TokenCard key={i} {...token} highlighted={highlightedToken === token.token} onClick={() => setHighlightedToken(token.token)} />)}
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

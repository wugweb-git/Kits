import React from 'react';
import { Copy, Check, ExternalLink, CheckCircle, XCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function ToasterDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
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
    { name: 'Success Color', token: '--success', value: 'rgba(34, 197, 94, 1.00)', category: 'Color' },
    { name: 'Error Color', token: '--destructive', value: 'rgba(239, 67, 67, 1.00)', category: 'Color' },
    { name: 'Border Radius', token: '--radius-md', value: '8px', category: 'Border' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens] : coreTokens;

  const code = `import { toast } from 'sonner';

// Success toast
toast.success('Changes saved successfully');

// Error toast
toast.error('Failed to save changes');

// Info toast
toast('New message received');`;

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
      <PageHeader badge="Feedback Component" title="Toast" description="Brief notification messages that appear temporarily to provide feedback." actions={headerActions} />
      
      <PageSection title="Interactive Examples" description="Click to trigger different toast types">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap', marginBottom: 'var(--spacing-4)' }}>
            <Button onClick={() => toast.success('Success! Changes have been saved.')}>Success Toast</Button>
            <Button onClick={() => toast.error('Error! Something went wrong.')} variant="destructive">Error Toast</Button>
            <Button onClick={() => toast('Info: New message received')} variant="outline">Info Toast</Button>
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="ToastDemo.tsx" />
        </PageCard>
      </PageSection>

      <PageSection title="Variants" description="Different toast types">
        <PageGrid columns={3}>
          <PageCard>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <CheckCircle size={20} style={{ color: 'var(--success)' }} />
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Success</h3>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Positive confirmations</p>
          </PageCard>
          <PageCard>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <XCircle size={20} style={{ color: 'var(--destructive)' }} />
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Error</h3>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Error messages</p>
          </PageCard>
          <PageCard>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <Info size={20} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Info</h3>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>General information</p>
          </PageCard>
        </PageGrid>
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

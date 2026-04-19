import React from 'react';
import { Alert } from '../../design-system/components';
import { Check, Copy, ExternalLink, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function AlertDoc() {
  const [selectedTone, setSelectedTone] = React.useState<'info' | 'success' | 'warning' | 'error' | 'neutral'>('info');
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md'>('md');
  const [hasTitle, setHasTitle] = React.useState(true);
  const [isDismissible, setIsDismissible] = React.useState(true);
  const [showCode, setShowCode] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);

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
    return `import { Alert } from "@/components/design-system/components/Alert";
import { Info } from "lucide-react";

export function AlertDemo() {
  return (
    <Alert
      tone="${selectedTone}"
      size="${selectedSize}"
      ${hasTitle ? 'title="Alert Title"' : ''}
      ${isDismissible ? 'onDismiss={() => console.log("dismissed")}' : ''}
    >
      This is an alert message providing important information to users.
    </Alert>
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
        badge="Feedback Component"
        title="Alert"
        description="Display important messages and notifications to users with various severity levels and optional dismiss functionality."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the alert component">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Tone</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['info', 'success', 'warning', 'error', 'neutral'] as const).map((t) => (
                    <Button key={t} variant={selectedTone === t ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTone(t)} style={{ textTransform: 'capitalize' }}>{t}</Button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Options</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  <Button variant={hasTitle ? 'default' : 'outline'} size="sm" onClick={() => setHasTitle(!hasTitle)}>Title</Button>
                  <Button variant={isDismissible ? 'default' : 'outline'} size="sm" onClick={() => setIsDismissible(!isDismissible)}>Dismissible</Button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)' }}>
              <Alert tone={selectedTone} size={selectedSize} title={hasTitle ? 'Alert Title' : undefined} onDismiss={isDismissible ? () => console.log('dismissed') : undefined}>
                This is an alert message providing important information to users. It can contain longer text and multiple lines.
              </Alert>
            </div>
            {showCode && <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers={true} />}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Tone Variants" description="Different alert tones for various contexts">
        <PageGrid cols={1}>
          <Alert tone="info" title="Information" onDismiss={() => {}}>This is an informational message for general notices and updates.</Alert>
          <Alert tone="success" title="Success" onDismiss={() => {}}>Operation completed successfully! Your changes have been saved.</Alert>
          <Alert tone="warning" title="Warning" onDismiss={() => {}}>Please review this important information before proceeding.</Alert>
          <Alert tone="error" title="Error" onDismiss={() => {}}>An error occurred. Please try again or contact support.</Alert>
          <Alert tone="neutral" title="Neutral" onDismiss={() => {}}>This is a neutral alert for general notifications.</Alert>
        </PageGrid>
      </PageSection>

      <PageSection title="Design Tokens" description="CSS variables used by the Alert component">
        <PageGrid cols={3}>
          <TokenCard token="--accent" label="Info Color" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--success" label="Success Color" value="rgba(34, 197, 94, 1.00)" category="color" onClick={() => handleTokenClick('--success')} isHighlighted={highlightedToken === '--success'} />
          <TokenCard token="--destructive" label="Error Color" value="rgba(239, 67, 67, 1.00)" category="color" onClick={() => handleTokenClick('--destructive')} isHighlighted={highlightedToken === '--destructive'} />
          <TokenCard token="--spacing-4" label="Padding" value="16px" category="spacing" onClick={() => handleTokenClick('--spacing-4')} isHighlighted={highlightedToken === '--spacing-4'} />
          <TokenCard token="--radius-lg" label="Border Radius" value="12px" category="radius" onClick={() => handleTokenClick('--radius-lg')} isHighlighted={highlightedToken === '--radius-lg'} />
        </PageGrid>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use alerts for important messages that require user attention</li>
              <li>Choose the appropriate tone based on message severity</li>
              <li>Keep alert messages concise and actionable</li>
              <li>Allow users to dismiss non-critical alerts</li>
              <li>Position alerts prominently but not disruptively</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

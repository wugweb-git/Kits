import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Logo } from '../../wugweb/Logo';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function LogoDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const code = `import { Logo } from '@/components/wugweb/Logo';

// Default size
<Logo />

// Custom size
<Logo size="s" />
<Logo size="m" />
<Logo size="l" />`;

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm">
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
      <Button variant="outline" size="sm"><ExternalLink size={16} />View in Figma</Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader badge="Branding" title="Logo" description="Brand logo component with consistent sizing and styling." actions={headerActions} />
      
      <PageSection title="Examples">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-3)' }}>
                Sizes
              </h3>
              <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <Logo size="s" />
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-2)' }}>Small</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Logo size="m" />
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-2)' }}>Medium</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Logo size="l" />
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-2)' }}>Large</div>
                </div>
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-3)' }}>
                On Dark Background
              </h3>
              <div style={{ padding: 'var(--spacing-6)', background: 'var(--background)', borderRadius: 'var(--radius-md)' }}>
                <Logo />
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-3)' }}>
                On Light Background
              </h3>
              <div style={{ padding: 'var(--spacing-6)', background: 'var(--card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <Logo />
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      <PageSection title="Code">
        <PageCard>
          <CollapsibleCodeBlock code={code} language="tsx" filename="LogoDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
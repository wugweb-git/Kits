import React from 'react';
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { copyToClipboard } from '../../../utils/clipboard';

export function IconDocNew() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

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
      <PageHeader 
        badge="Assets" 
        title="Icons (New)" 
        description="Updated icon documentation. See IconDoc for main icon library." 
        actions={headerActions} 
      />
      
      <PageSection title="Note">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
            <Sparkles size={24} style={{ color: 'var(--accent)' }} />
            <div>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)', marginBottom: 'var(--spacing-1)' }}>
                This is a placeholder for updated icon documentation.
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                Please refer to IconDoc for the main icon library documentation.
              </p>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

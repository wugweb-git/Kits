import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { EmbedBadge } from '../../wugweb/EmbedBadge';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function EmbedBadgesDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const code = `import { EmbedBadge } from '@/components/wugweb/EmbedBadge';

<EmbedBadge
  variant=\"empowered\"
  size=\"m\"
  brand=\"wugweb\"
/>`;

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
      <PageHeader badge="Content Component" title="Embed Badges" description="Display status badges and metrics in a compact, embeddable format." actions={headerActions} />
      
      <PageSection title="Example">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
            <EmbedBadge variant="empowered" size="m" brand="wugweb" />
            <EmbedBadge variant="designed" size="m" brand="wugweb" />
            <EmbedBadge variant="empowered" size="s" brand="kits" />
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="EmbedBadgesDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
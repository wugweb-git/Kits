import React from 'react';
import { Copy, Check, ExternalLink, Code, Palette, Zap, Shield } from 'lucide-react';
import { TopicTile } from '../../ui/legacy-adapters';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function TopicTileDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const code = `import { TopicTile } from '@/components/design-system/components';
import { Code } from 'lucide-react';

<TopicTile
  icon={<Code />}
  title="Development"
  description="Build modern web applications"
  href="#development"
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
      <PageHeader badge="Content Component" title="Topic Tile" description="Clickable tiles representing topics or categories with icons." actions={headerActions} />
      
      <PageSection title="Example">
        <PageGrid columns={2}>
          <TopicTile
            icon={<Code size={24} />}
            title="Development"
            description="Build modern web applications with the latest technologies"
            href="#development"
          />
          <TopicTile
            icon={<Palette size={24} />}
            title="Design"
            description="Create beautiful user interfaces and experiences"
            href="#design"
          />
          <TopicTile
            icon={<Zap size={24} />}
            title="Performance"
            description="Optimize your applications for speed and efficiency"
            href="#performance"
          />
          <TopicTile
            icon={<Shield size={24} />}
            title="Security"
            description="Protect your users with best security practices"
            href="#security"
          />
        </PageGrid>
      </PageSection>

      <PageSection title="Code">
        <PageCard>
          <CollapsibleCodeBlock code={code} language="tsx" filename="TopicTileDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

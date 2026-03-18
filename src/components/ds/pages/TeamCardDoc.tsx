import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { TeamCard } from '../../wugweb/TeamCard';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function TeamCardDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const code = `import { TeamCard } from '@/components/wugweb/TeamCard';

<TeamCard
  name="Sarah Johnson"
  role="Product Designer"
  avatar="/avatars/sarah.jpg"
  bio="Passionate about creating beautiful and functional user experiences"
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
      <PageHeader badge="Content Component" title="Team Card" description="Display team member information with avatar, name, role, and bio." actions={headerActions} />
      
      <PageSection title="Example">
        <PageGrid columns={3}>
          <TeamCard
            name="Sarah Johnson"
            role="Product Designer"
            bio="Creating beautiful experiences"
          />
          <TeamCard
            name="Mike Chen"
            role="Frontend Engineer"
            bio="Building fast and accessible interfaces"
          />
          <TeamCard
            name="Emma Davis"
            role="Product Manager"
            bio="Shipping user-focused products"
          />
        </PageGrid>
      </PageSection>

      <PageSection title="Code">
        <PageCard>
          <CollapsibleCodeBlock code={code} language="tsx" filename="TeamCardDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

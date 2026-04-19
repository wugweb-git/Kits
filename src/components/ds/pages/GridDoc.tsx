import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Grid } from '../../ui/legacy-adapters';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function GridDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const code = `import { Grid } from '@/components/design-system/components';

<Grid columns={3} gap="var(--spacing-4)">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
  <div>Item 6</div>
</Grid>`;

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
      <PageHeader badge="Layout Component" title="Grid" description="Flexible grid system for organizing content in columns." actions={headerActions} />
      
      <PageSection title="Example">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <Grid columns={3} gap="var(--spacing-4)">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ padding: 'var(--spacing-4)', background: 'var(--accent-subtle)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--accent)' }}>
                  Item {i}
                </div>
              ))}
            </Grid>
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="GridDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

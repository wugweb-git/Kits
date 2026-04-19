import React from 'react';
import { Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { CTABanner } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function CTABannerDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const code = `import { CTABanner } from '@/components/design-system/components/CTABanner';

<CTABanner
  title="Ready to get started?"
  subtitle="Join thousands of users already using our platform"
  buttonLabel="Get Started"
  onButtonClick={() => {}}
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
      <PageHeader badge="Content Component" title="CTA Banner" description="Call-to-action banner for promoting features or driving conversions." actions={headerActions} />
      
      <PageSection title="Example">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <CTABanner
              title="Ready to get started?"
              subtitle="Join thousands of users already using our platform to build amazing products."
              buttonLabel="Get Started"
              onButtonClick={() => console.log('Get Started')}
            />
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="CTABannerDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
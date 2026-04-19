import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { PhoneInput } from '../../ui/legacy-adapters';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function PhoneInputDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [phone, setPhone] = React.useState('');

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const code = `import { PhoneInput } from '@/components/design-system/components';

<PhoneInput
  value={phone}
  onChange={setPhone}
  label="Phone Number"
  placeholder="+1 (555) 000-0000"
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
      <PageHeader badge="Form Component" title="Phone Input" description="Specialized input for phone numbers with country code support." actions={headerActions} />
      
      <PageSection title="Example">
        <PageCard>
          <div style={{ maxWidth: '400px', marginBottom: 'var(--spacing-4)' }}>
            <PhoneInput value={phone} onChange={setPhone} label="Phone Number" placeholder="+1 (555) 000-0000" />
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="PhoneInputDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

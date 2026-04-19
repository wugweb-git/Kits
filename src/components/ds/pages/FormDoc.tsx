import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Input } from '../../design-system/components';
import { Textarea } from '../../design-system/components';
import { Checkbox } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function FormDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const code = `import { Input, Textarea, Checkbox, Button } from '@/components/design-system/components';

export function MyForm() {
  return (
    <form onSubmit={(e) => { e.preventDefault(); }}>
      <Input label="Name" placeholder="Enter your name" />
      <Textarea label="Message" placeholder="Your message" />
      <Checkbox label="I agree to terms" />
      <Button type="submit">Submit</Button>
    </form>
  );
}`;

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
      <PageHeader badge="Pattern" title="Form" description="Combine form components to create accessible, validated forms." actions={headerActions} />
      
      <PageSection title="Example Form" description="Basic form with common fields">
        <PageCard>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: '500px', marginBottom: 'var(--spacing-4)' }}>
            <Input label="Full Name" placeholder="Enter your name" />
            <Input label="Email" type="email" placeholder="your@email.com" />
            <Textarea label="Message" placeholder="Your message here" />
            <Checkbox label="I agree to the terms and conditions" />
            <Button type="submit">Submit Form</Button>
          </form>
          <CollapsibleCodeBlock code={code} language="tsx" filename="FormDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
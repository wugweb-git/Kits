import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { RadioGroup } from '../../wugweb/RadioGroup';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function RadioButtonDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [selected, setSelected] = React.useState('option1');

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const code = `import { RadioGroup } from '@/components/wugweb/RadioGroup';

<RadioGroup
  name="options"
  value="option1"
  label="Option 1"
  checked={selected === 'option1'}
  onChange={() => setSelected('option1')}
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
      <PageHeader badge="Form Component" title="Radio Button" description="Single radio button component for creating custom radio groups." actions={headerActions} />
      
      <PageSection title="Example">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
            <RadioGroup name="demo" value="option1" label="Option 1" checked={selected === 'option1'} onChange={() => setSelected('option1')} />
            <RadioGroup name="demo" value="option2" label="Option 2" checked={selected === 'option2'} onChange={() => setSelected('option2')} />
            <RadioGroup name="demo" value="option3" label="Option 3" checked={selected === 'option3'} onChange={() => setSelected('option3')} />
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="RadioButtonDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
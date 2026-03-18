import React from 'react';
import { Copy, Check, ExternalLink, Search } from 'lucide-react';
import { Input } from '../../wugweb/Input';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function InputDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [value, setValue] = React.useState('');

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const code = `import { Input } from '@/components/wugweb/Input';

<Input
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
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
      <PageHeader badge="Form Component" title="Input" description="Generic input component for various input types. Note: For text inputs with labels, use InputText component." actions={headerActions} />
      
      <PageSection title="Example">
        <PageCard>
          <div style={{ maxWidth: '400px', marginBottom: 'var(--spacing-4)' }}>
            <Input placeholder="Search..." value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="InputDemo.tsx" />
        </PageCard>
      </PageSection>

      <PageSection title="Variants">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: '400px' }}>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Text Input</div>
                <Input type="text" placeholder="Enter text..." />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Email Input</div>
                <Input type="email" placeholder="your@email.com" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Password Input</div>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Search Input</div>
                <Input type="search" placeholder="Search..." />
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

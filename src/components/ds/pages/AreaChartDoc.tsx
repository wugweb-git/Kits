import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { AreaChart } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function AreaChartDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const sampleData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  const code = `import { AreaChart } from '@/components/design-system/components';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

<AreaChart
  data={data}
  dataKey="value"
  xAxisKey="name"
  height={300}
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
      <PageHeader badge="Chart Component" title="Area Chart" description="Visualize data trends over time with area charts." actions={headerActions} />
      
      <PageSection title="Example">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <AreaChart
              data={sampleData}
              dataKey="value"
              xAxisKey="name"
              height={300}
            />
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="AreaChartDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

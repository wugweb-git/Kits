import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { BarChart } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function BarChartDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const sampleData = [
    { name: 'Product A', sales: 4000 },
    { name: 'Product B', sales: 3000 },
    { name: 'Product C', sales: 6000 },
    { name: 'Product D', sales: 8000 },
    { name: 'Product E', sales: 5000 },
  ];

  const code = `import { BarChart } from '@/components/design-system/components/BarChart';

const data = [
  { name: 'Product A', sales: 4000 },
  { name: 'Product B', sales: 3000 },
  { name: 'Product C', sales: 6000 },
  { name: 'Product D', sales: 8000 },
  { name: 'Product E', sales: 5000 },
];

<BarChart
  data={data}
  dataKey="sales"
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
      <PageHeader badge="Chart Component" title="Bar Chart" description="Compare data across categories with vertical bar charts." actions={headerActions} />
      
      <PageSection title="Example">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <BarChart
              data={sampleData}
              dataKey="sales"
              xAxisKey="name"
              height={300}
            />
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="BarChartDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

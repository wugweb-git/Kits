import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { AreaChart } from '../../ui/legacy-adapters';
import { BarChart } from '../../ui/legacy-adapters';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function ChartDoc() {
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

  const code = `import { AreaChart, BarChart } from '@/components/design-system/components';

// Area Chart
<AreaChart data={data} dataKey="value" xAxisKey="name" height={300} />

// Bar Chart
<BarChart data={data} dataKey="value" xAxisKey="name" height={300} />`;

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
      <PageHeader badge="Data Visualization" title="Charts" description="Data visualization components powered by Recharts. All charts use CSS variables for theming." actions={headerActions} />
      
      <PageSection title="Available Charts" description="Chart types in the design system">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Area Chart
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Visualize trends over time
              </p>
              <AreaChart data={sampleData} dataKey="value" xAxisKey="name" height={250} />
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Bar Chart
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Compare values across categories
              </p>
              <BarChart data={sampleData} dataKey="value" xAxisKey="name" height={250} />
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      <PageSection title="Code">
        <PageCard>
          <CollapsibleCodeBlock code={code} language="tsx" filename="ChartsDemo.tsx" />
        </PageCard>
      </PageSection>

      <PageSection title="Theming">
        <PageCard>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              All charts use the following CSS variables for consistent theming:
            </p>
            <ul style={{ paddingLeft: 'var(--spacing-4)' }}>
              <li><code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>--chart-1</code> - Primary chart color</li>
              <li><code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>--chart-2</code> - Secondary chart color</li>
              <li><code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>--chart-3</code> - Tertiary chart color</li>
              <li><code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>--chart-4</code> - Accent chart color</li>
              <li><code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>--chart-5</code> - Error/destructive chart color</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

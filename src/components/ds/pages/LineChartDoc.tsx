import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { LineChart } from '../../ui/legacy-adapters';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

const monthlyData = [
  { month: 'Jan', revenue: 4200, users: 1800, sessions: 3100 },
  { month: 'Feb', revenue: 5800, users: 2400, sessions: 4200 },
  { month: 'Mar', revenue: 5200, users: 2100, sessions: 3800 },
  { month: 'Apr', revenue: 7100, users: 3200, sessions: 5600 },
  { month: 'May', revenue: 6400, users: 2800, sessions: 4900 },
  { month: 'Jun', revenue: 8900, users: 4100, sessions: 7300 },
  { month: 'Jul', revenue: 9200, users: 4500, sessions: 8100 },
  { month: 'Aug', revenue: 8400, users: 3900, sessions: 7200 },
];

export function LineChartDoc() {
  const [showGrid, setShowGrid] = React.useState(true);
  const [showLegend, setShowLegend] = React.useState(true);
  const [curved, setCurved] = React.useState(true);
  const [showDots, setShowDots] = React.useState(true);
  const [height, setHeight] = React.useState(300);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);

  const handleTokenClick = (token: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
  };

  const getDynamicCode = () => `import { LineChart } from "@/components/design-system/components";

const data = [
  { month: "Jan", revenue: 4200, users: 1800 },
  { month: "Feb", revenue: 5800, users: 2400 },
  { month: "Mar", revenue: 5200, users: 2100 },
  { month: "Apr", revenue: 7100, users: 3200 },
];

<LineChart
  data={data}
  xAxisKey="month"
  dataKeys={[
    { key: "revenue", name: "Revenue", color: "var(--chart-1)" },
    { key: "users", name: "Users", color: "var(--chart-4)" },
  ]}
  height={${height}}
  showGrid={${showGrid}}
  showLegend={${showLegend}}
  curved={${curved}}
  showDots={${showDots}}
/>`;

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
      <Button variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        <ExternalLink size={16} />View in Figma
      </Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader
        badge="Chart Component"
        title="Line Chart"
        description="A line chart for visualizing trends over time. Supports multiple data series, curved lines, data point dots, grid lines, and legends. Built on top of Recharts."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and preview the line chart">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            {[
              { label: 'Grid', state: showGrid, set: setShowGrid },
              { label: 'Legend', state: showLegend, set: setShowLegend },
              { label: 'Curved', state: curved, set: setCurved },
              { label: 'Dots', state: showDots, set: setShowDots },
            ].map(ctrl => (
              <div key={ctrl.label} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>{ctrl.label}</label>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <Button variant={ctrl.state ? 'default' : 'outline'} size="sm" onClick={() => ctrl.set(true)}>On</Button>
                  <Button variant={!ctrl.state ? 'default' : 'outline'} size="sm" onClick={() => ctrl.set(false)}>Off</Button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Height</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {[200, 300, 400].map(h => (
                  <Button key={h} variant={height === h ? 'default' : 'outline'} size="sm" onClick={() => setHeight(h)}>{h}px</Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <LineChart
              data={monthlyData}
              xAxisKey="month"
              dataKeys={[
                { key: 'revenue', name: 'Revenue', color: 'var(--chart-1)' },
                { key: 'users', name: 'Users', color: 'var(--chart-4)' },
                { key: 'sessions', name: 'Sessions', color: 'var(--chart-3)' },
              ]}
              height={height}
              showGrid={showGrid}
              showLegend={showLegend}
              curved={curved}
              showDots={showDots}
            />
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--chart-1" label="Series 1 (White)" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--chart-1')} isHighlighted={highlightedToken === '--chart-1'} />
          <TokenCard token="--chart-4" label="Series 2 (Accent)" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--chart-4')} isHighlighted={highlightedToken === '--chart-4'} />
          <TokenCard token="--chart-3" label="Series 3 (Muted)" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--chart-3')} isHighlighted={highlightedToken === '--chart-3'} />
          <TokenCard token="--chart-5" label="Series 4 (Error)" value="rgba(239, 67, 67, 1.00)" category="color" onClick={() => handleTokenClick('--chart-5')} isHighlighted={highlightedToken === '--chart-5'} />
          <TokenCard token="--border" label="Grid Lines" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--muted-foreground" label="Axis Labels" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

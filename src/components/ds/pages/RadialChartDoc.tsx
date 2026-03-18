import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { RadialChart } from '../../wugweb/RadialChart';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

const progressData = [
  { name: 'Components Done', value: 127, fill: 'var(--chart-4)' },
  { name: 'Docs Complete', value: 85, fill: 'var(--chart-1)' },
  { name: 'Test Coverage', value: 62, fill: 'var(--chart-3)' },
  { name: 'Accessibility', value: 78, fill: 'var(--chart-2)' },
];

const storageData = [
  { name: 'Used Storage', value: 73, fill: 'var(--chart-4)' },
  { name: 'Cached Files', value: 45, fill: 'var(--chart-1)' },
  { name: 'Backups', value: 28, fill: 'var(--chart-3)' },
];

export function RadialChartDoc() {
  const [dataset, setDataset] = React.useState<'progress' | 'storage'>('progress');
  const [showLegend, setShowLegend] = React.useState(true);
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

  const currentData = dataset === 'progress' ? progressData : storageData;

  const getDynamicCode = () => `import { RadialChart } from "@/components/wugweb/RadialChart";

const data = [
  { name: "Components Done", value: 127, fill: "var(--chart-4)" },
  { name: "Docs Complete", value: 85, fill: "var(--chart-1)" },
  { name: "Test Coverage", value: 62, fill: "var(--chart-3)" },
];

<RadialChart
  data={data}
  height={${height}}
  showLegend={${showLegend}}
  innerRadius={20}
  outerRadius={80}
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
        title="Radial Chart"
        description="A radial bar chart that shows progress or proportional values as concentric arcs. Great for progress rings, capacity usage, and multi-metric dashboards."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Switch datasets and configure display options">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Dataset</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={dataset === 'progress' ? 'default' : 'outline'} size="sm" onClick={() => setDataset('progress')}>Progress</Button>
                <Button variant={dataset === 'storage' ? 'default' : 'outline'} size="sm" onClick={() => setDataset('storage')}>Storage</Button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Legend</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={showLegend ? 'default' : 'outline'} size="sm" onClick={() => setShowLegend(true)}>On</Button>
                <Button variant={!showLegend ? 'default' : 'outline'} size="sm" onClick={() => setShowLegend(false)}>Off</Button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Height</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {[250, 300, 380].map(h => (
                  <Button key={h} variant={height === h ? 'default' : 'outline'} size="sm" onClick={() => setHeight(h)}>{h}px</Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <RadialChart
              data={currentData}
              height={height}
              showLegend={showLegend}
              innerRadius={20}
              outerRadius={80}
            />
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Usage Examples" description="Common scenarios for radial charts">
        <PageGrid cols={3}>
          {[
            { title: 'Progress Rings', desc: 'Show completion percentage for tasks, onboarding, or goals.' },
            { title: 'Capacity Usage', desc: 'Visualize storage, memory, or bandwidth consumed vs. available.' },
            { title: 'Multi-metric KPI', desc: 'Compare several KPIs simultaneously in a compact dashboard widget.' },
          ].map((ex, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)' }}>
              <h4 style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{ex.title}</h4>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{ex.desc}</p>
            </div>
          ))}
        </PageGrid>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--chart-4" label="Arc 1 (Accent)" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--chart-4')} isHighlighted={highlightedToken === '--chart-4'} />
          <TokenCard token="--chart-1" label="Arc 2 (White)" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--chart-1')} isHighlighted={highlightedToken === '--chart-1'} />
          <TokenCard token="--chart-3" label="Arc 3 (Gray)" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--chart-3')} isHighlighted={highlightedToken === '--chart-3'} />
          <TokenCard token="--chart-2" label="Arc 4 (Dark)" value="rgba(68, 68, 68, 1.00)" category="color" onClick={() => handleTokenClick('--chart-2')} isHighlighted={highlightedToken === '--chart-2'} />
          <TokenCard token="--muted" label="Track Background" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--muted-foreground" label="Legend Text" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

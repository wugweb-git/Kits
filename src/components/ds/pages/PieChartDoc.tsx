import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { PieChart } from '../../ui/legacy-adapters';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

const trafficData = [
  { name: 'Direct', value: 4200, color: 'var(--chart-1)' },
  { name: 'Organic Search', value: 3100, color: 'var(--chart-4)' },
  { name: 'Referral', value: 1800, color: 'var(--chart-3)' },
  { name: 'Social', value: 1200, color: 'var(--chart-2)' },
  { name: 'Email', value: 900, color: 'var(--chart-5)' },
];

export function PieChartDoc() {
  const [donut, setDonut] = React.useState(false);
  const [showLegend, setShowLegend] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(false);
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

  const getDynamicCode = () => `import { PieChart } from "@/components/design-system/components";

const data = [
  { name: "Direct", value: 4200, color: "var(--chart-1)" },
  { name: "Organic", value: 3100, color: "var(--chart-4)" },
  { name: "Referral", value: 1800, color: "var(--chart-3)" },
  { name: "Social", value: 1200, color: "var(--chart-2)" },
];

<PieChart
  data={data}
  height={${height}}
  donut={${donut}}
  showLegend={${showLegend}}
  showLabels={${showLabels}}
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
        title="Pie Chart"
        description="A pie or donut chart for showing proportional data. Useful for displaying category breakdowns, market share, or any part-to-whole relationship."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Toggle between pie and donut, configure display options">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Shape</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={!donut ? 'default' : 'outline'} size="sm" onClick={() => setDonut(false)}>Pie</Button>
                <Button variant={donut ? 'default' : 'outline'} size="sm" onClick={() => setDonut(true)}>Donut</Button>
              </div>
            </div>
            {[
              { label: 'Legend', state: showLegend, set: setShowLegend },
              { label: 'Labels', state: showLabels, set: setShowLabels },
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
                {[250, 300, 400].map(h => (
                  <Button key={h} variant={height === h ? 'default' : 'outline'} size="sm" onClick={() => setHeight(h)}>{h}px</Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <PieChart data={trafficData} height={height} donut={donut} showLegend={showLegend} showLabels={showLabels} />
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--chart-1" label="Slice 1 (White)" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--chart-1')} isHighlighted={highlightedToken === '--chart-1'} />
          <TokenCard token="--chart-4" label="Slice 2 (Yellow)" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--chart-4')} isHighlighted={highlightedToken === '--chart-4'} />
          <TokenCard token="--chart-3" label="Slice 3 (Gray)" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--chart-3')} isHighlighted={highlightedToken === '--chart-3'} />
          <TokenCard token="--chart-2" label="Slice 4 (Dark)" value="rgba(68, 68, 68, 1.00)" category="color" onClick={() => handleTokenClick('--chart-2')} isHighlighted={highlightedToken === '--chart-2'} />
          <TokenCard token="--chart-5" label="Slice 5 (Red)" value="rgba(239, 67, 67, 1.00)" category="color" onClick={() => handleTokenClick('--chart-5')} isHighlighted={highlightedToken === '--chart-5'} />
          <TokenCard token="--background" label="Donut Center" value="rgba(18, 18, 18, 1.00)" category="color" onClick={() => handleTokenClick('--background')} isHighlighted={highlightedToken === '--background'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

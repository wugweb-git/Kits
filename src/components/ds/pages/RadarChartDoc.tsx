import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { RadarChart } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

const skillsData = [
  { skill: 'Accessibility', current: 80, target: 95 },
  { skill: 'Performance', current: 72, target: 88 },
  { skill: 'Design Tokens', current: 95, target: 100 },
  { skill: 'Documentation', current: 68, target: 90 },
  { skill: 'Test Coverage', current: 55, target: 80 },
  { skill: 'TypeScript', current: 88, target: 95 },
];

const teamData = [
  { category: 'Design', frontend: 85, backend: 30, mobile: 60 },
  { category: 'Dev Speed', frontend: 78, backend: 82, mobile: 70 },
  { category: 'Testing', frontend: 65, backend: 75, mobile: 55 },
  { category: 'Docs', frontend: 90, backend: 60, mobile: 72 },
  { category: 'UX', frontend: 88, backend: 40, mobile: 80 },
];

export function RadarChartDoc() {
  const [dataset, setDataset] = React.useState<'skills' | 'team'>('skills');
  const [showLegend, setShowLegend] = React.useState(true);
  const [height, setHeight] = React.useState(350);
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

  const currentData = dataset === 'skills' ? skillsData : teamData;
  const currentAngleKey = dataset === 'skills' ? 'skill' : 'category';
  const currentDataKeys = dataset === 'skills'
    ? [
        { key: 'current', name: 'Current', color: 'var(--chart-4)' },
        { key: 'target', name: 'Target', color: 'var(--chart-1)' },
      ]
    : [
        { key: 'frontend', name: 'Frontend', color: 'var(--chart-4)' },
        { key: 'backend', name: 'Backend', color: 'var(--chart-1)' },
        { key: 'mobile', name: 'Mobile', color: 'var(--chart-3)' },
      ];

  const getDynamicCode = () => `import { RadarChart } from "@/components/design-system/components";

const skillsData = [
  { skill: "Accessibility", current: 80, target: 95 },
  { skill: "Performance", current: 72, target: 88 },
  { skill: "Design Tokens", current: 95, target: 100 },
  { skill: "Documentation", current: 68, target: 90 },
  { skill: "Test Coverage", current: 55, target: 80 },
];

<RadarChart
  data={skillsData}
  angleKey="skill"
  dataKeys={[
    { key: "current", name: "Current", color: "var(--chart-4)" },
    { key: "target", name: "Target", color: "var(--chart-1)" },
  ]}
  height={${height}}
  showLegend={${showLegend}}
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
        title="Radar Chart"
        description="A spider/radar chart for comparing multiple attributes across one or more datasets. Ideal for capability assessments, skill comparisons, and multi-dimensional data views."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Switch datasets and configure display options">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Dataset</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={dataset === 'skills' ? 'default' : 'outline'} size="sm" onClick={() => setDataset('skills')}>Skills</Button>
                <Button variant={dataset === 'team' ? 'default' : 'outline'} size="sm" onClick={() => setDataset('team')}>Team</Button>
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
                {[250, 350, 450].map(h => (
                  <Button key={h} variant={height === h ? 'default' : 'outline'} size="sm" onClick={() => setHeight(h)}>{h}px</Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <RadarChart
              data={currentData}
              angleKey={currentAngleKey}
              dataKeys={currentDataKeys}
              height={height}
              showLegend={showLegend}
            />
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="When to Use Radar Charts">
        <PageGrid cols={2}>
          {[
            { title: 'Good for', points: ['Comparing 5–10 attributes across 1–3 entities', 'Showing skill/capability gaps', 'Balanced multi-dimensional comparisons', 'Performance scorecards'] },
            { title: 'Avoid when', points: ['Comparing more than 3 series (gets cluttered)', 'Precise value comparison is needed (use bar chart)', 'Your audience is unfamiliar with radar charts', 'You have fewer than 3 attributes (use bar chart)'] },
          ].map((card, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)' }}>
              <h4 style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: i === 0 ? 'var(--success)' : 'var(--muted-foreground)' }}>{card.title}</h4>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-5)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                {card.points.map((p, j) => <li key={j} style={{ fontSize: 'var(--text-sm)' }}>{p}</li>)}
              </ul>
            </div>
          ))}
        </PageGrid>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--chart-4" label="Series 1 (Accent)" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--chart-4')} isHighlighted={highlightedToken === '--chart-4'} />
          <TokenCard token="--chart-1" label="Series 2 (White)" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--chart-1')} isHighlighted={highlightedToken === '--chart-1'} />
          <TokenCard token="--chart-3" label="Series 3 (Gray)" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--chart-3')} isHighlighted={highlightedToken === '--chart-3'} />
          <TokenCard token="--border" label="Grid Lines" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--muted-foreground" label="Angle Labels" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

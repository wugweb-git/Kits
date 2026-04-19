import React from 'react';
import { Check, Copy, ExternalLink, GitCommit, Tag, Rocket, Bug, Wrench } from 'lucide-react';
import { Timeline } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

const timelineItems = [
  { id: '1', title: 'v2.0.0 Released', description: 'Major release with 127 new components and full CSS variable support.', date: 'Mar 2026', icon: Rocket, variant: 'success' as const },
  { id: '2', title: 'Beta Testing', description: 'Public beta with community feedback integration and bug fixes.', date: 'Feb 2026', icon: Bug, variant: 'warning' as const },
  { id: '3', title: 'Token System Rebuilt', description: 'Complete overhaul of the design token architecture to CSS variables.', date: 'Jan 2026', icon: Wrench, variant: 'default' as const },
  { id: '4', title: 'v1.0.0 Released', description: 'Initial release of the Wugweb Design System with 40 base components.', date: 'Dec 2025', icon: Tag, variant: 'default' as const },
  { id: '5', title: 'Project Started', description: 'First commit and initial project setup.', date: 'Nov 2025', icon: GitCommit, variant: 'default' as const },
];

export function TimelineDoc() {
  const [orientation, setOrientation] = React.useState<'vertical' | 'horizontal'>('vertical');
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

  const getDynamicCode = () => `import { Timeline } from "@/components/design-system/components";
import { Rocket, Bug } from "lucide-react";

const events = [
  {
    id: "1",
    title: "v2.0.0 Released",
    description: "Major release with 127 components.",
    date: "Mar 2026",
    icon: Rocket,
    variant: "success",
  },
  {
    id: "2",
    title: "Beta Testing",
    description: "Public beta with community feedback.",
    date: "Feb 2026",
    icon: Bug,
    variant: "warning",
  },
];

<Timeline items={events} orientation="${orientation}" />`;

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
        badge="Layout Component"
        title="Timeline"
        description="A chronological display of events with connecting lines, icons, and date labels. Supports vertical (default) and horizontal orientations with success, warning, and error variant states."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Toggle orientation and preview the timeline">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Orientation</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['vertical', 'horizontal'] as const).map(o => (
                  <Button key={o} variant={orientation === o ? 'default' : 'outline'} size="sm" onClick={() => setOrientation(o)} style={{ textTransform: 'capitalize' }}>{o}</Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', overflowX: orientation === 'horizontal' ? 'auto' : undefined }}>
              <Timeline items={timelineItems} orientation={orientation} />
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Use Cases" description="Common scenarios for the Timeline component">
        <PageGrid cols={2}>
          {[
            { title: 'Changelogs', desc: 'Communicate release history and version progression to users.' },
            { title: 'Order Tracking', desc: 'Show shipment status from order placed to delivery.' },
            { title: 'Onboarding Steps', desc: 'Guide users through completed and upcoming setup steps.' },
            { title: 'Activity Feeds', desc: 'Display a chronological log of user or system actions.' },
          ].map((uc, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)' }}>
              <h4 style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{uc.title}</h4>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{uc.desc}</p>
            </div>
          ))}
        </PageGrid>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--border" label="Connector Line" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--success" label="Success Variant" value="rgba(34, 197, 94, 1.00)" category="color" onClick={() => handleTokenClick('--success')} isHighlighted={highlightedToken === '--success'} />
          <TokenCard token="--destructive" label="Error Variant" value="rgba(239, 67, 67, 1.00)" category="color" onClick={() => handleTokenClick('--destructive')} isHighlighted={highlightedToken === '--destructive'} />
          <TokenCard token="--accent" label="Warning Variant" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--muted" label="Default Node" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--spacing-6" label="Item Spacing" value="24px" category="spacing" onClick={() => handleTokenClick('--spacing-6')} isHighlighted={highlightedToken === '--spacing-6'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

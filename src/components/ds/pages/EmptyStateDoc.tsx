import React from 'react';
import { Check, Copy, ExternalLink, FileQuestion, Search, Package, Users, Inbox } from 'lucide-react';
import { EmptyState } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function EmptyStateDoc() {
  const [icon, setIcon] = React.useState<'FileQuestion' | 'Search' | 'Package' | 'Inbox'>('FileQuestion');
  const [showPrimary, setShowPrimary] = React.useState(true);
  const [showSecondary, setShowSecondary] = React.useState(false);
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

  const iconMap = { FileQuestion, Search, Package, Inbox };
  const currentIcon = iconMap[icon];

  const getDynamicCode = () => `import { EmptyState } from "@/components/design-system/components";
import { ${icon} } from "lucide-react";

<EmptyState
  icon={${icon}}
  title="No results found"
  description="Try adjusting your search or filters to find what you're looking for."
  ${showPrimary ? 'actionLabel="Create new"\n  onAction={() => {}}' : ''}
  ${showSecondary ? 'secondaryActionLabel="Browse all"\n  onSecondaryAction={() => {}}' : ''}
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

  const presets = [
    { title: 'No Search Results', icon: Search, desc: 'Try different keywords or filters.', action: 'Clear filters' },
    { title: 'Inbox Empty', icon: Inbox, desc: "You're all caught up! No new messages.", action: 'Compose' },
    { title: 'No Packages', icon: Package, desc: 'Install your first package to get started.', action: 'Browse packages' },
    { title: 'No Team Members', icon: Users, desc: 'Invite your teammates to collaborate.', action: 'Invite members' },
  ];

  return (
    <PageWrapper>
      <PageHeader
        badge="Feedback Component"
        title="Empty State"
        description="A placeholder component that appears when no content is available. Provides clear context and actionable next steps to guide the user forward."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize the empty state component">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Icon</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                {(['FileQuestion', 'Search', 'Package', 'Inbox'] as const).map(i => (
                  <Button key={i} variant={icon === i ? 'default' : 'outline'} size="sm" onClick={() => setIcon(i)}>{i}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Actions</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                <Button variant={showPrimary ? 'default' : 'outline'} size="sm" onClick={() => setShowPrimary(!showPrimary)}>Primary</Button>
                <Button variant={showSecondary ? 'default' : 'outline'} size="sm" onClick={() => setShowSecondary(!showSecondary)}>Secondary</Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
              <EmptyState
                icon={currentIcon}
                title="No results found"
                description="Try adjusting your search or filters to find what you're looking for."
                actionLabel={showPrimary ? 'Create new' : undefined}
                onAction={showPrimary ? () => {} : undefined}
                secondaryActionLabel={showSecondary ? 'Browse all' : undefined}
                onSecondaryAction={showSecondary ? () => {} : undefined}
              />
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Common Presets" description="Ready-to-use empty state configurations">
        <PageGrid cols={2}>
          {presets.map((preset, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)' }}>
              <EmptyState icon={preset.icon} title={preset.title} description={preset.desc} actionLabel={preset.action} onAction={() => {}} />
            </div>
          ))}
        </PageGrid>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--muted-foreground" label="Icon Color" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--foreground" label="Title Color" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--foreground')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard token="--text-tertiary" label="Description Color" value="rgba(115, 115, 115, 1.00)" category="color" onClick={() => handleTokenClick('--text-tertiary')} isHighlighted={highlightedToken === '--text-tertiary'} />
          <TokenCard token="--spacing-8" label="Vertical Spacing" value="32px" category="spacing" onClick={() => handleTokenClick('--spacing-8')} isHighlighted={highlightedToken === '--spacing-8'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

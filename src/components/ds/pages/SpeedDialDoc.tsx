import React from 'react';
import { Check, Copy, ExternalLink, Edit, Share, Trash2, Download, Mail } from 'lucide-react';
import { SpeedDial } from '../../wugweb/SpeedDial';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function SpeedDialDoc() {
  const [direction, setDirection] = React.useState<'up' | 'down' | 'left' | 'right'>('up');
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

  const actions = [
    { id: 'edit', label: 'Edit', icon: Edit, onClick: () => {} },
    { id: 'share', label: 'Share', icon: Share, onClick: () => {} },
    { id: 'download', label: 'Download', icon: Download, onClick: () => {} },
    { id: 'email', label: 'Email', icon: Mail, onClick: () => {} },
    { id: 'delete', label: 'Delete', icon: Trash2, onClick: () => {} },
  ];

  const getDynamicCode = () => `import { SpeedDial } from "@/components/wugweb/SpeedDial";
import { Edit, Share, Trash2 } from "lucide-react";

const actions = [
  { id: "edit", label: "Edit", icon: Edit, onClick: () => {} },
  { id: "share", label: "Share", icon: Share, onClick: () => {} },
  { id: "delete", label: "Delete", icon: Trash2, onClick: () => {} },
];

<SpeedDial
  actions={actions}
  direction="${direction}"
  position="bottom-right"
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
        badge="Utility Component"
        title="Speed Dial"
        description="A floating action button (FAB) that expands into a radial or linear menu of quick actions. Keeps the interface clean while providing fast access to common tasks."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Click the + button to expand actions, toggle direction">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Expand Direction</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                {(['up', 'down', 'left', 'right'] as const).map(d => (
                  <Button key={d} variant={direction === d ? 'default' : 'outline'} size="sm" onClick={() => setDirection(d)} style={{ textTransform: 'capitalize' }}>{d}</Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', minHeight: '240px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', textAlign: 'center' }}>
                The SpeedDial is positioned at bottom-right of a page. Click + to expand.
              </p>
              {/* Inline demo — not fixed to page */}
              <div style={{ position: 'absolute', bottom: 'var(--spacing-6)', right: 'var(--spacing-6)' }}>
                <SpeedDial actions={actions} direction={direction} position="bottom-right" style={{ position: 'relative' }} />
              </div>
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Limit actions to 3–6 items — more choices cause decision paralysis</li>
              <li>Always provide a label for each action for accessibility</li>
              <li>Position at bottom-right to match platform FAB conventions</li>
              <li>Avoid on desktop applications where a toolbar is more appropriate</li>
              <li>Prefer <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>direction="up"</code> to avoid covering content below</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--primary" label="FAB Background" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--primary')} isHighlighted={highlightedToken === '--primary'} />
          <TokenCard token="--primary-foreground" label="FAB Icon Color" value="rgba(18, 18, 18, 1.00)" category="color" onClick={() => handleTokenClick('--primary-foreground')} isHighlighted={highlightedToken === '--primary-foreground'} />
          <TokenCard token="--card" label="Action Item Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--card')} isHighlighted={highlightedToken === '--card'} />
          <TokenCard token="--accent" label="Active Accent" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--radius-full" label="FAB Radius" value="9999px" category="radius" onClick={() => handleTokenClick('--radius-full')} isHighlighted={highlightedToken === '--radius-full'} />
          <TokenCard token="--motion-duration-normal" label="Expand Animation" value="120ms" category="other" onClick={() => handleTokenClick('--motion-duration-normal')} isHighlighted={highlightedToken === '--motion-duration-normal'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

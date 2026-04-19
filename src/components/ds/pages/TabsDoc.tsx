import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Check, Copy, ExternalLink, Code, Palette, Settings } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function TabsDoc() {
  const [showCode, setShowCode] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);

  const handleTokenClick = (token: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getDynamicCode = () => {
    return `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function TabsDemo() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Details</TabsTrigger>
        <TabsTrigger value="tab3">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Overview content</TabsContent>
      <TabsContent value="tab2">Details content</TabsContent>
      <TabsContent value="tab3">Settings content</TabsContent>
    </Tabs>
  );
}`;
  };

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
      <Button variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        <ExternalLink size={16} />
        View in Figma
      </Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader
        badge="Navigation Component"
        title="Tabs"
        description="Organize content into multiple sections that users can navigate between, with support for different visual styles."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the tabs component">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)' }}>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview"><Code size={16} style={{ marginRight: 'var(--spacing-2)' }} />Overview</TabsTrigger>
                  <TabsTrigger value="design"><Palette size={16} style={{ marginRight: 'var(--spacing-2)' }} />Design</TabsTrigger>
                  <TabsTrigger value="settings"><Settings size={16} style={{ marginRight: 'var(--spacing-2)' }} />Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div style={{ padding: 'var(--spacing-6)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ color: 'var(--foreground)', margin: 0 }}>Overview content goes here. This is the first tab panel.</p>
                  </div>
                </TabsContent>
                <TabsContent value="design">
                  <div style={{ padding: 'var(--spacing-6)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ color: 'var(--foreground)', margin: 0 }}>Design content goes here. This is the second tab panel.</p>
                  </div>
                </TabsContent>
                <TabsContent value="settings">
                  <div style={{ padding: 'var(--spacing-6)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ color: 'var(--foreground)', margin: 0 }}>Settings content goes here. This is the third tab panel.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            {showCode && <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers={true} />}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens" description="CSS variables used by the Tabs component">
        <PageGrid cols={3}>
          <TokenCard token="--accent" label="Active Tab Color" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--muted-foreground" label="Inactive Tab Color" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--spacing-4" label="Padding" value="16px" category="spacing" onClick={() => handleTokenClick('--spacing-4')} isHighlighted={highlightedToken === '--spacing-4'} />
        </PageGrid>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use tabs to organize related content into logical sections</li>
              <li>Limit tabs to 3-7 items for optimal usability</li>
              <li>Use clear, concise labels for each tab</li>
              <li>Consider using icons alongside text for visual clarity</li>
              <li>Ensure the active tab is visually distinct from inactive tabs</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';
import { Check, Copy, ExternalLink, Calendar, Settings } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function PopoverDoc() {
  const [selectedPosition, setSelectedPosition] = React.useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
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
    return `import { Popover, PopoverTrigger, PopoverContent } from "@/components/design-system/components";
import { Button } from "@/components/design-system/components";

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent side="${selectedPosition}">
        <div style={{ padding: 'var(--spacing-4)' }}>
          <h4>Popover Title</h4>
          <p>This is the popover content.</p>
        </div>
      </PopoverContent>
    </Popover>
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
        badge="Overlay Component"
        title="Popover"
        description="Display rich content in a floating panel that appears on demand, triggered by user interaction."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the popover component">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Position</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
                    <Button key={p} variant={selectedPosition === p ? 'default' : 'outline'} size="sm" onClick={() => setSelectedPosition(p)} style={{ textTransform: 'capitalize' }}>{p}</Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" style={{ gap: 'var(--spacing-2)' }}>
                    <Settings size={16} />
                    Open Popover
                  </Button>
                </PopoverTrigger>
                <PopoverContent side={selectedPosition} style={{ width: '300px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0, marginBottom: 'var(--spacing-2)' }}>Settings</h4>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>Configure your preferences</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                      <Button size="sm" fullWidth>Save Changes</Button>
                      <Button size="sm" variant="outline" fullWidth>Cancel</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {showCode && <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers={true} />}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens" description="CSS variables used by the Popover component">
        <PageGrid cols={3}>
          <TokenCard token="--popover" label="Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--popover')} isHighlighted={highlightedToken === '--popover'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--radius-lg" label="Border Radius" value="12px" category="radius" onClick={() => handleTokenClick('--radius-lg')} isHighlighted={highlightedToken === '--radius-lg'} />
        </PageGrid>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use popovers for secondary content that doesn't require immediate attention</li>
              <li>Keep popover content concise and focused on a single task</li>
              <li>Ensure popovers can be easily dismissed</li>
              <li>Avoid nesting popovers within other popovers</li>
              <li>Position popovers to avoid covering important UI elements</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
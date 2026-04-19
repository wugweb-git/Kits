import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../ui/tooltip';
import { Check, Copy, ExternalLink, Info, HelpCircle } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function TooltipDoc() {
  const [selectedPosition, setSelectedPosition] = React.useState<'top' | 'bottom' | 'left' | 'right'>('top');
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
    return `import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/design-system/components";
import { HelpCircle } from "lucide-react";

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle size={20} />
        </TooltipTrigger>
        <TooltipContent side="${selectedPosition}">
          This is helpful information
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
        title="Tooltip"
        description="Display contextual information when users hover over or focus on an element."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the tooltip component">
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
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" style={{ gap: 'var(--spacing-2)' }}>
                      <HelpCircle size={16} />
                      Hover me
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={selectedPosition}>
                    <p style={{ margin: 0 }}>This is helpful information that appears on hover</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {showCode && <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers={true} />}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Examples" description="Common tooltip use cases">
        <PageGrid cols={3}>
          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'center' }}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Icon Tooltip</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button style={{ padding: 'var(--spacing-2)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                      <Info size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>More information</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'center' }}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Help Tooltip</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button style={{ padding: 'var(--spacing-2)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                      <HelpCircle size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Get help with this feature</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'center' }}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Button Tooltip</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm">Action</Button>
                  </TooltipTrigger>
                  <TooltipContent>Click to perform action</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      <PageSection title="Design Tokens" description="CSS variables used by the Tooltip component">
        <PageGrid cols={3}>
          <TokenCard token="--popover" label="Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--popover')} isHighlighted={highlightedToken === '--popover'} />
          <TokenCard token="--popover-foreground" label="Text Color" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--popover-foreground')} isHighlighted={highlightedToken === '--popover-foreground'} />
          <TokenCard token="--radius-md" label="Border Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
        </PageGrid>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Keep tooltip content brief and focused</li>
              <li>Use tooltips to provide additional context, not critical information</li>
              <li>Ensure tooltips don't cover important UI elements</li>
              <li>Don't use tooltips on mobile (use alternatives like help text)</li>
              <li>Position tooltips to avoid viewport edges</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
import React from 'react';
import { Check, Copy, ExternalLink, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { Banner } from '../../ui/legacy-adapters';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function BannerDoc() {
  const [variant, setVariant] = React.useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [dismissible, setDismissible] = React.useState(true);
  const [key, setKey] = React.useState(0);
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

  const variantIcons = { info: Info, success: CheckCircle, warning: AlertTriangle, error: XCircle };

  const getDynamicCode = () => `import { Banner } from "@/components/design-system/components";
import { Info } from "lucide-react";

<Banner
  variant="${variant}"
  icon={${variantIcons[variant].name}}
  dismissible={${dismissible}}
  onDismiss={() => console.log("dismissed")}
>
  ${variant === 'info' ? 'A new version of the design system is now available.' :
    variant === 'success' ? 'Your component library has been updated successfully.' :
    variant === 'warning' ? 'Deprecation notice: This API will be removed in v3.0.' :
    'Build failed: 3 type errors found in your components.'}
</Banner>`;

  const variantMessages = {
    info: 'A new version of the Wugweb Design System is available. Update to get the latest components.',
    success: 'Your design tokens have been synchronized successfully with Figma.',
    warning: 'Deprecation notice: The legacy InputText component will be removed in v3.0. Please migrate to Input.',
    error: 'Build failed: 3 type errors found. Run tsc --noEmit to see details.',
  };

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
        badge="Feedback Component"
        title="Banner"
        description="A full-width announcement bar for system-level messages. Supports info, success, warning, and error variants with optional dismissal. Renders at the top of the page or section."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and preview banner variants">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                {(['info', 'success', 'warning', 'error'] as const).map(v => (
                  <Button key={v} variant={variant === v ? 'default' : 'outline'} size="sm" onClick={() => { setVariant(v); setKey(k => k + 1); }} style={{ textTransform: 'capitalize' }}>{v}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Dismissible</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={dismissible ? 'default' : 'outline'} size="sm" onClick={() => { setDismissible(true); setKey(k => k + 1); }}>On</Button>
                <Button variant={!dismissible ? 'default' : 'outline'} size="sm" onClick={() => { setDismissible(false); setKey(k => k + 1); }}>Off</Button>
              </div>
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <Button variant="outline" size="sm" onClick={() => setKey(k => k + 1)}>Reset</Button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <Banner key={key} variant={variant} icon={variantIcons[variant]} dismissible={dismissible} onDismiss={() => {}}>
              {variantMessages[variant]}
            </Banner>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="All Variants" description="Preview all banner variants side by side">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <Banner variant="info" icon={Info}>A new version of the design system is now available. Update to access the latest components.</Banner>
          <Banner variant="success" icon={CheckCircle}>Your changes have been saved and deployed successfully.</Banner>
          <Banner variant="warning" icon={AlertTriangle}>Deprecation notice: This feature will be removed in version 3.0.</Banner>
          <Banner variant="error" icon={XCircle} dismissible onDismiss={() => {}}>Build error: Type mismatch in Button.tsx. See console for details.</Banner>
        </div>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--accent" label="Info Banner" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--success" label="Success Banner" value="rgba(34, 197, 94, 1.00)" category="color" onClick={() => handleTokenClick('--success')} isHighlighted={highlightedToken === '--success'} />
          <TokenCard token="--destructive" label="Error Banner" value="rgba(239, 67, 67, 1.00)" category="color" onClick={() => handleTokenClick('--destructive')} isHighlighted={highlightedToken === '--destructive'} />
          <TokenCard token="--accent-subtle" label="Info Background" value="rgba(255, 190, 26, 0.10)" category="color" onClick={() => handleTokenClick('--accent-subtle')} isHighlighted={highlightedToken === '--accent-subtle'} />
          <TokenCard token="--success-subtle" label="Success Background" value="rgba(34, 197, 94, 0.10)" category="color" onClick={() => handleTokenClick('--success-subtle')} isHighlighted={highlightedToken === '--success-subtle'} />
          <TokenCard token="--destructive-subtle" label="Error Background" value="rgba(239, 67, 67, 0.10)" category="color" onClick={() => handleTokenClick('--destructive-subtle')} isHighlighted={highlightedToken === '--destructive-subtle'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { DeviceMockup } from '../../ui/legacy-adapters';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function DeviceMockupDoc() {
  const [device, setDevice] = React.useState<'phone' | 'tablet' | 'laptop' | 'desktop'>('phone');
  const [variant, setVariant] = React.useState<'ios' | 'android' | 'default'>('ios');
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait');
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

  const getDynamicCode = () => `import { DeviceMockup } from "@/components/design-system/components";

<DeviceMockup
  device="${device}"
  variant="${variant}"
  orientation="${orientation}"
>
  {/* Your content, screenshot, or iframe here */}
  <img src="/screenshot.png" alt="App preview" />
</DeviceMockup>`;

  const sampleContent = (
    <div style={{ width: '100%', height: '100%', background: 'var(--surface-900)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', padding: 'var(--spacing-4)' }}>
      <div style={{ height: '32px', background: 'var(--surface-700)', borderRadius: 'var(--radius-sm)' }} />
      <div style={{ height: '80px', background: 'var(--accent-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)' }}>Hero Section</span>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ height: '20px', background: 'var(--surface-700)', borderRadius: 'var(--radius-sm)', width: i === 3 ? '60%' : '100%' }} />
      ))}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
        <div style={{ flex: 1, height: '48px', background: 'var(--primary)', borderRadius: 'var(--radius-md)' }} />
        <div style={{ flex: 1, height: '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)' }} />
      </div>
    </div>
  );

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
        title="Device Mockup"
        description="Wraps content inside photorealistic device frames — phone, tablet, laptop, or desktop. Use it in marketing pages, presentations, and documentation to showcase your UI in context."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Switch device type and orientation">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Device</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                {(['phone', 'tablet', 'laptop', 'desktop'] as const).map(d => (
                  <Button key={d} variant={device === d ? 'default' : 'outline'} size="sm" onClick={() => setDevice(d)} style={{ textTransform: 'capitalize' }}>{d}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Style</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['ios', 'android', 'default'] as const).map(v => (
                  <Button key={v} variant={variant === v ? 'default' : 'outline'} size="sm" onClick={() => setVariant(v)} style={{ textTransform: 'capitalize' }}>{v}</Button>
                ))}
              </div>
            </div>
            {(device === 'phone' || device === 'tablet') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Orientation</label>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  {(['portrait', 'landscape'] as const).map(o => (
                    <Button key={o} variant={orientation === o ? 'default' : 'outline'} size="sm" onClick={() => setOrientation(o)} style={{ textTransform: 'capitalize' }}>{o}</Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflowX: 'auto' }}>
              <DeviceMockup device={device} variant={variant} orientation={orientation} style={{ maxWidth: '100%' }}>
                {sampleContent}
              </DeviceMockup>
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--surface-800" label="Device Frame" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--surface-800')} isHighlighted={highlightedToken === '--surface-800'} />
          <TokenCard token="--border" label="Frame Border" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--radius-6" label="Frame Radius" value="24px" category="radius" onClick={() => handleTokenClick('--radius-6')} isHighlighted={highlightedToken === '--radius-6'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

import React from 'react';
import { Check, Copy, ExternalLink, User } from 'lucide-react';
import { Indicator } from '../../design-system/components';
import { Avatar } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function IndicatorDoc() {
  const [variant, setVariant] = React.useState<'default' | 'success' | 'warning' | 'error' | 'info'>('success');
  const [size, setSize] = React.useState<'s' | 'm' | 'l'>('m');
  const [pulse, setPulse] = React.useState(true);
  const [position, setPosition] = React.useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline'>('top-right');
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

  const getDynamicCode = () => `import { Indicator } from "@/components/design-system/components";

// Status dot on an avatar
<Indicator variant="${variant}" size="${size}" pulse={${pulse}} position="${position}">
  <Avatar name="Alice Johnson" />
</Indicator>

// Inline status label
<Indicator variant="${variant}" position="inline" label="Online" />`;

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

  const variantLabels = { default: 'Away', success: 'Online', warning: 'Busy', error: 'Offline', info: 'In a meeting' };

  return (
    <PageWrapper>
      <PageHeader
        badge="Feedback Component"
        title="Indicator"
        description="A small status dot used to communicate state — online, offline, busy, or error. Supports pulse animation and can be positioned over any child element or rendered inline."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize the indicator variant, size, and position">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                {(['default', 'success', 'warning', 'error', 'info'] as const).map(v => (
                  <Button key={v} variant={variant === v ? 'default' : 'outline'} size="sm" onClick={() => setVariant(v)} style={{ textTransform: 'capitalize' }}>{v}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['s', 'm', 'l'] as const).map(s => (
                  <Button key={s} variant={size === s ? 'default' : 'outline'} size="sm" onClick={() => setSize(s)}>{s.toUpperCase()}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Pulse</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={pulse ? 'default' : 'outline'} size="sm" onClick={() => setPulse(true)}>On</Button>
                <Button variant={!pulse ? 'default' : 'outline'} size="sm" onClick={() => setPulse(false)}>Off</Button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Position</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                {(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'inline'] as const).map(p => (
                  <Button key={p} variant={position === p ? 'default' : 'outline'} size="sm" onClick={() => setPosition(p)} style={{ fontSize: 'var(--text-xs)' }}>{p}</Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--spacing-8)', flexWrap: 'wrap' }}>
              {position !== 'inline' ? (
                <Indicator variant={variant} size={size} pulse={pulse} position={position}>
                  <Avatar name="Alice Johnson" size="l" />
                </Indicator>
              ) : (
                <Indicator variant={variant} size={size} pulse={pulse} position="inline" label={variantLabels[variant]} />
              )}
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Status Examples" description="Common indicator usage patterns">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-8)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-8)' }}>
            {(['default', 'success', 'warning', 'error', 'info'] as const).map(v => (
              <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                <Indicator variant={v} position="top-right" pulse={v === 'success'}>
                  <Avatar name={v === 'success' ? 'Alice' : v === 'warning' ? 'Bob' : v === 'error' ? 'Carol' : v === 'info' ? 'Dave' : 'Eve'} size="m" />
                </Indicator>
                <Indicator variant={v} position="inline" label={variantLabels[v]} />
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--success" label="Online / Success" value="rgba(34, 197, 94, 1.00)" category="color" onClick={() => handleTokenClick('--success')} isHighlighted={highlightedToken === '--success'} />
          <TokenCard token="--destructive" label="Offline / Error" value="rgba(239, 67, 67, 1.00)" category="color" onClick={() => handleTokenClick('--destructive')} isHighlighted={highlightedToken === '--destructive'} />
          <TokenCard token="--accent" label="Warning / Info" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--muted-foreground" label="Away / Default" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--radius-full" label="Dot Shape" value="9999px" category="radius" onClick={() => handleTokenClick('--radius-full')} isHighlighted={highlightedToken === '--radius-full'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

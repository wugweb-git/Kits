import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Spinner } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function SpinnerDoc() {
  const [size, setSize] = React.useState<'s' | 'm' | 'l' | 'xl'>('m');
  const [color, setColor] = React.useState<'default' | 'accent' | 'muted'>('accent');
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

  const getDynamicCode = () => `import { Spinner } from "@/components/design-system/components";

// Basic spinner
<Spinner />

// With size and color
<Spinner size="${size}" color="${color}" />

// Loading button pattern
<Button disabled>
  <Spinner size="s" color="default" />
  Loading...
</Button>`;

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
        title="Spinner"
        description="A loading indicator with smooth rotation animation. Use to communicate that a process is running and the interface will be ready soon."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize the spinner size and color">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['s', 'm', 'l', 'xl'] as const).map(s => (
                  <Button key={s} variant={size === s ? 'default' : 'outline'} size="sm" onClick={() => setSize(s)}>{s.toUpperCase()}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Color</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['default', 'accent', 'muted'] as const).map(c => (
                  <Button key={c} variant={color === c ? 'default' : 'outline'} size="sm" onClick={() => setColor(c)} style={{ textTransform: 'capitalize' }}>{c}</Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner size={size} color={color} />
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="All Sizes & Colors" description="Full reference of size and color combinations">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-6)', textAlign: 'center' }}>
            {(['s', 'm', 'l', 'xl'] as const).map(s => (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s}</span>
                {(['default', 'accent', 'muted'] as const).map(c => (
                  <div key={c} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', alignItems: 'center' }}>
                    <Spinner size={s} color={c} />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{c}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Common Patterns" description="Typical usage of the Spinner">
        <PageGrid cols={2}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Loading Button</h4>
            <Button disabled style={{ gap: 'var(--spacing-2)' }}>
              <Spinner size="s" color="default" />
              Saving changes...
            </Button>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Full Page Loading</h4>
            <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <Spinner size="l" color="accent" />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Loading your data...</span>
            </div>
          </div>
        </PageGrid>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--foreground" label="Default Color" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--foreground')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard token="--accent" label="Accent Color" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--muted-foreground" label="Muted Color" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--motion-duration-slow" label="Rotation Speed" value="200ms" category="other" onClick={() => handleTokenClick('--motion-duration-slow')} isHighlighted={highlightedToken === '--motion-duration-slow'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

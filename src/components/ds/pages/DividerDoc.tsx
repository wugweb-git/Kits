import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Divider } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { Switch } from '../../design-system/components';
import { Label } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function DividerDoc() {
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical'>('horizontal');
  const [label, setLabel] = React.useState('Or continue with');
  const [labelPosition, setLabelPosition] = React.useState<'center' | 'left' | 'right'>('center');
  const [dashed, setDashed] = React.useState(false);
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

  const jsxCode = `import { Divider } from './components/design-system/components/Divider';

<Divider
  orientation="${orientation}"
  label="${label}"
  labelPosition="${labelPosition}"
  dashed={${dashed}}
/>

// Design Tokens Used:
// Color: var(--border)
// Text: var(--muted-foreground)
// Spacing: var(--spacing-2)`;

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
        badge="Layout Component"
        title="Divider"
        description="A visual separator that groups and organizes content. Can be horizontal or vertical, and can optionally include a label."
        actions={headerActions}
      />

      {/* Interactive Preview */}
      <PageSection title="Interactive Preview" description="Customize and test the divider component">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            {/* Orientation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Orientation</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {(['horizontal', 'vertical'] as const).map((o) => (
                  <Button
                    key={o}
                    onClick={() => setOrientation(o)}
                    variant={orientation === o ? 'default' : 'outline'}
                    size="sm"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {o}
                  </Button>
                ))}
              </div>
            </div>

            {/* Label Position */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Label Position</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {(['left', 'center', 'right'] as const).map((p) => (
                  <Button
                    key={p}
                    onClick={() => setLabelPosition(p)}
                    variant={labelPosition === p ? 'default' : 'outline'}
                    size="sm"
                    disabled={orientation === 'vertical'}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dashed Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Switch id="dashed" checked={dashed} onCheckedChange={setDashed} />
              <Label htmlFor="dashed">Dashed</Label>
            </div>
          </div>

          {/* Preview Area */}
          <div style={{
            padding: 'var(--spacing-12)',
            background: 'var(--muted)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            flexDirection: orientation === 'vertical' ? 'row' : 'column',
            gap: 'var(--spacing-4)'
          }}>
            {orientation === 'horizontal' ? (
              <div style={{ width: '100%' }}>
                <p style={{ marginBottom: 'var(--spacing-4)', color: 'var(--foreground)' }}>Content Above</p>
                <Divider
                  orientation="horizontal"
                  label={label}
                  labelPosition={labelPosition}
                  dashed={dashed}
                />
                <p style={{ marginTop: 'var(--spacing-4)', color: 'var(--foreground)' }}>Content Below</p>
              </div>
            ) : (
              <div style={{ display: 'flex', height: '100px', alignItems: 'center' }}>
                <span style={{ marginRight: 'var(--spacing-4)', color: 'var(--foreground)' }}>Left</span>
                <Divider
                  orientation="vertical"
                  dashed={dashed}
                />
                <span style={{ marginLeft: 'var(--spacing-4)', color: 'var(--foreground)' }}>Right</span>
              </div>
            )}
          </div>
        </PageCard>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="All CSS variables used in this component">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          <TokenCard
            label="Divider Color"
            token="--border"
            value="#2B2B2B"
            color="var(--border)"
            onClick={() => handleTokenClick('--border')}
            isHighlighted={highlightedToken === '--border'}
          />
          <TokenCard
            label="Text Color"
            token="--muted-foreground"
            value="#A1A1A1"
            color="var(--muted-foreground)"
            onClick={() => handleTokenClick('--muted-foreground')}
            isHighlighted={highlightedToken === '--muted-foreground'}
          />
          <TokenCard
            label="Spacing"
            token="--spacing-2"
            value="16px"
            isSpacing
            onClick={() => handleTokenClick('--spacing-2')}
            isHighlighted={highlightedToken === '--spacing-2'}
          />
        </div>
      </PageSection>

      {/* Code Examples */}
      <PageSection title="Code Examples" description="Copy and paste the code below">
        <CollapsibleCodeBlock code={jsxCode} language="tsx" />
      </PageSection>

      {/* Accessibility */}
      <PageSection title="Accessibility" description="WCAG 2.1 Level AA compliant">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-2)', color: 'var(--foreground)' }}>
                  Best Practices
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                  <li>Uses <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>role="separator"</code> for semantic meaning</li>
                  <li>Sets <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>aria-orientation</code> based on the orientation prop</li>
                  <li>Decorative dividers can be hidden from screen readers using <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>aria-hidden="true"</code> if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
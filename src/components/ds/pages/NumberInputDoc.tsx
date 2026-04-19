import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { NumberInput } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function NumberInputDoc() {
  const [value, setValue] = React.useState(1);
  const [size, setSize] = React.useState<'s' | 'm' | 'l'>('m');
  const [min, setMin] = React.useState(0);
  const [max, setMax] = React.useState(100);
  const [step, setStep] = React.useState(1);
  const [disabled, setDisabled] = React.useState(false);
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

  const getDynamicCode = () => `import { NumberInput } from "@/components/design-system/components/NumberInput";

export function NumberInputDemo() {
  const [quantity, setQuantity] = React.useState(${value});

  return (
    <NumberInput
      value={quantity}
      onChange={setQuantity}
      min={${min}}
      max={${max}}
      step={${step}}
      size="${size}"
      disabled={${disabled}}
    />
  );
}`;

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
        badge="Form Component"
        title="Number Input"
        description="A numeric input field with increment and decrement controls. Enforces min/max boundaries and step increments to ensure valid values."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the number input">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['s', 'm', 'l'] as const).map(s => (
                  <Button key={s} variant={size === s ? 'default' : 'outline'} size="sm" onClick={() => setSize(s)}>{s.toUpperCase()}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Step</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {[1, 5, 10].map(s => (
                  <Button key={s} variant={step === s ? 'default' : 'outline'} size="sm" onClick={() => setStep(s)}>{s}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={!disabled ? 'default' : 'outline'} size="sm" onClick={() => setDisabled(false)}>Enabled</Button>
                <Button variant={disabled ? 'default' : 'outline'} size="sm" onClick={() => setDisabled(true)}>Disabled</Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-4)' }}>
              <NumberInput value={value} onChange={setValue} min={min} max={max} step={step} size={size} disabled={disabled} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Range: {min} – {max}, Step: {step}</span>
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Use Cases" description="Common usage patterns for NumberInput">
        <PageGrid cols={3}>
          {[
            { label: 'Quantity Selector', desc: 'Shopping cart item count', min: 1, max: 99 },
            { label: 'Age Input', desc: 'User registration forms', min: 18, max: 120 },
            { label: 'Page Size', desc: 'Pagination control', min: 10, max: 100, step: 10 },
          ].map((ex, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{ex.label}</h4>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{ex.desc}</p>
              </div>
              <NumberInput value={ex.min} onChange={() => {}} min={ex.min} max={ex.max} step={ex.step || 1} size="m" />
            </div>
          ))}
        </PageGrid>
      </PageSection>

      <PageSection title="Design Tokens" description="CSS variables used by NumberInput">
        <PageGrid cols={3}>
          <TokenCard token="--input-background" label="Input Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--input-background')} isHighlighted={highlightedToken === '--input-background'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--accent" label="Active Accent" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--radius-md" label="Border Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

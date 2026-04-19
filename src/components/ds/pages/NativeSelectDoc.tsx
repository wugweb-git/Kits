import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { NativeSelect } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
];

export function NativeSelectDoc() {
  const [value, setValue] = React.useState('');
  const [size, setSize] = React.useState<'s' | 'm' | 'l'>('m');
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

  const getDynamicCode = () => `import { NativeSelect } from "@/components/design-system/components";

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
];

export function NativeSelectDemo() {
  const [country, setCountry] = React.useState('');

  return (
    <NativeSelect
      value={country}
      onChange={setCountry}
      options={countries}
      placeholder="Select a country"
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
        title="Native Select"
        description="A styled native HTML select element. Use when you need browser-native select behavior with mobile keyboard support, or when JavaScript is unavailable."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the native select">
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
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={!disabled ? 'default' : 'outline'} size="sm" onClick={() => setDisabled(false)}>Enabled</Button>
                <Button variant={disabled ? 'default' : 'outline'} size="sm" onClick={() => setDisabled(true)}>Disabled</Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '320px' }}>
                <NativeSelect value={value} onChange={setValue} options={countryOptions} placeholder="Select a country" size={size} disabled={disabled} />
              </div>
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="NativeSelect vs Select" description="When to use each component">
        <PageGrid cols={2}>
          {[
            { title: 'Use NativeSelect when…', points: ['Mobile experience is critical (native keyboard)', 'Simple option lists without custom rendering', 'Form submissions to a server', 'Accessibility is the top concern'] },
            { title: 'Use Select (custom) when…', points: ['You need custom option rendering (icons, descriptions)', 'You need search/filter within options', 'You need grouped options with separators', 'Consistent styling across all platforms is required'] },
          ].map((card, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)' }}>
              <h4 style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{card.title}</h4>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-5)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                {card.points.map((p, j) => <li key={j} style={{ fontSize: 'var(--text-sm)' }}>{p}</li>)}
              </ul>
            </div>
          ))}
        </PageGrid>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--input-background" label="Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--input-background')} isHighlighted={highlightedToken === '--input-background'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--foreground" label="Text Color" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--foreground')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard token="--radius-md" label="Border Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

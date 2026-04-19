import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { DatePicker } from '../../ui/legacy-adapters';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function DatePickerDoc() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [size, setSize] = React.useState<'s' | 'm' | 'l'>('m');
  const [showClearButton, setShowClearButton] = React.useState(true);
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

  const getDynamicCode = () => `import { DatePicker } from "@/components/design-system/components";

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="Select a date"
      size="${size}"
      showClearButton={${showClearButton}}
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
        title="Date Picker"
        description="A date selection input that opens a calendar popup. Built on top of the Calendar component for consistent styling and keyboard accessibility."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the date picker">
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
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Clear Button</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={showClearButton ? 'default' : 'outline'} size="sm" onClick={() => setShowClearButton(true)}>On</Button>
                <Button variant={!showClearButton ? 'default' : 'outline'} size="sm" onClick={() => setShowClearButton(false)}>Off</Button>
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
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <div style={{ width: '100%', maxWidth: '280px' }}>
                <DatePicker value={date} onChange={setDate} placeholder="Select a date" size={size} showClearButton={showClearButton} disabled={disabled} />
              </div>
            </div>
            {date && (
              <div style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--accent)' }}>
                Selected: <strong>{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </div>
            )}
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--input-background" label="Input Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--input-background')} isHighlighted={highlightedToken === '--input-background'} />
          <TokenCard token="--accent" label="Selected Day Color" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--popover" label="Calendar Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--popover')} isHighlighted={highlightedToken === '--popover'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--radius-md" label="Input Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
          <TokenCard token="--radius-lg" label="Calendar Radius" value="12px" category="radius" onClick={() => handleTokenClick('--radius-lg')} isHighlighted={highlightedToken === '--radius-lg'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

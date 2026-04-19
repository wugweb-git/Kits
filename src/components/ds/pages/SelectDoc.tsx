import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../design-system/components';
import { Label } from '../../design-system/components';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function SelectDoc() {
  const [selectedValue, setSelectedValue] = React.useState('apple');
  const [isDisabled, setIsDisabled] = React.useState(false);
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
    return `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/design-system/components";

export function SelectDemo() {
  return (
    <Select value="${selectedValue}" onValueChange={setValue}${isDisabled ? ' disabled' : ''}>
      <SelectTrigger>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
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
        badge="Form Component"
        title="Select"
        description="A dropdown component for selecting a value from a list of options with keyboard navigation support."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the select component">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  <Button variant={!isDisabled ? 'default' : 'outline'} size="sm" onClick={() => setIsDisabled(false)}>Enabled</Button>
                  <Button variant={isDisabled ? 'default' : 'outline'} size="sm" onClick={() => setIsDisabled(true)}>Disabled</Button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label htmlFor="fruit-select">Favorite Fruit</Label>
                <Select value={selectedValue} onValueChange={setSelectedValue} disabled={isDisabled}>
                  <SelectTrigger id="fruit-select">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">🍎 Apple</SelectItem>
                    <SelectItem value="banana">🍌 Banana</SelectItem>
                    <SelectItem value="orange">🍊 Orange</SelectItem>
                    <SelectItem value="grape">🍇 Grape</SelectItem>
                    <SelectItem value="strawberry">🍓 Strawberry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {showCode && <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers={true} />}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens" description="CSS variables used by the Select component">
        <PageGrid cols={3}>
          <TokenCard token="--input-background" label="Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--input-background')} isHighlighted={highlightedToken === '--input-background'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--accent" label="Active Item" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
        </PageGrid>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use select for 5+ options; use radio buttons for fewer options</li>
              <li>Provide clear placeholder text indicating what to select</li>
              <li>Sort options logically (alphabetically, by frequency, or by category)</li>
              <li>Consider adding search for long lists (10+ items)</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

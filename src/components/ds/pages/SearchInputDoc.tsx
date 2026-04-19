import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { SearchInput } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function SearchInputDoc() {
  const [value, setValue] = React.useState('');
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
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getDynamicCode = () => `import { SearchInput } from "@/components/design-system/components/SearchInput";

export function SearchInputDemo() {
  const [value, setValue] = React.useState('');

  return (
    <SearchInput
      value={value}
      onChange={setValue}
      onSearch={(v) => console.log('Search:', v)}
      placeholder="Search components..."
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
        <ExternalLink size={16} />
        View in Figma
      </Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader
        badge="Form Component"
        title="Search Input"
        description="An input field with a built-in search icon, optional clear button, and keyboard search trigger. Ideal for filtering lists, searching content, or triggering search overlays."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the search input in real-time">
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
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '400px' }}>
                <SearchInput
                  value={value}
                  onChange={setValue}
                  onSearch={(v) => console.log('Search:', v)}
                  placeholder="Search components..."
                  size={size}
                  showClearButton={showClearButton}
                  disabled={disabled}
                />
              </div>
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens" description="CSS variables used by the SearchInput component">
        <PageGrid cols={3}>
          <TokenCard token="--input-background" label="Input Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--input-background')} isHighlighted={highlightedToken === '--input-background'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--muted-foreground" label="Placeholder Color" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--ring" label="Focus Ring" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--ring')} isHighlighted={highlightedToken === '--ring'} />
          <TokenCard token="--radius-md" label="Border Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
          <TokenCard token="--spacing-4" label="Horizontal Padding" value="16px" category="spacing" onClick={() => handleTokenClick('--spacing-4')} isHighlighted={highlightedToken === '--spacing-4'} />
        </PageGrid>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>onSearch</code> to trigger search on Enter key or button click</li>
              <li>Always show a clear button when the field can contain user-entered text</li>
              <li>Use controlled mode with <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>value</code> + <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>onChange</code> for filtering</li>
              <li>Debounce the <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>onChange</code> handler for live search to avoid excessive API calls</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

import React from 'react';
import { Copy, Check, Tag, X, Settings, Filter, ExternalLink } from 'lucide-react';
import { Chip } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function ChipDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [selectedTone, setSelectedTone] = React.useState<'default' | 'subtle' | 'outline' | 'destructive'>('default');
  const [iconPosition, setIconPosition] = React.useState<'none' | 'leading' | 'trailing'>('leading');
  const [isRemovable, setIsRemovable] = React.useState(false);
  const [selectedState, setSelectedState] = React.useState<'default' | 'selected' | 'disabled'>('default');
  const [showAdvancedTokens, setShowAdvancedTokens] = React.useState(false);

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

  const coreTokens = [
    { name: 'Background (default)', token: '--surface-700', value: 'rgba(68, 68, 68, 1.00)', category: 'Color' },
    { name: 'Text Color', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Border Color', token: '--border', value: 'rgba(43, 43, 43, 1.00)', category: 'Color' },
    { name: 'Destructive', token: '--destructive-subtle', value: 'rgba(239, 67, 67, 0.1)', category: 'Color' },
    { name: 'Selected (default)', token: '--accent', value: 'rgba(255, 190, 26, 1.00)', category: 'Color' },
    { name: 'Border Radius', token: '--radius-full', value: '9999px', category: 'Border' },
  ];

  const advancedTokens = [
    { name: 'Font Family', token: 'Inter Tight', value: 'Inter Tight, sans-serif', category: 'Typography' },
    { name: 'Font Weight', token: '--font-weight-medium', value: '500', category: 'Typography' },
    { name: 'Font Size (sm)', token: '--text-xs', value: '12px', category: 'Typography' },
    { name: 'Font Size (md)', token: '--text-sm', value: '14px', category: 'Typography' },
    { name: 'Font Size (lg)', token: '--text-base', value: '16px', category: 'Typography' },
    { name: 'Icon Gap', token: '--spacing-1', value: '4px', category: 'Spacing' },
    { name: 'Transition Duration', token: '--motion-duration-normal', value: '120ms', category: 'Motion' },
    { name: 'Transition Easing', token: '--motion-easing-standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)', category: 'Motion' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens, ...advancedTokens] : coreTokens;

  const getDynamicCode = () => {
    const props = [];
    if (selectedSize !== 'md') props.push(`size="${selectedSize}"`);
    if (selectedTone !== 'default') props.push(`tone="${selectedTone}"`);
    if (iconPosition !== 'none') props.push(`icon={<Tag />}`);
    if (iconPosition !== 'none' && iconPosition !== 'leading') props.push(`iconPosition="${iconPosition}"`);
    if (isRemovable) props.push(`removable`);
    if (isRemovable) props.push(`onRemove={() => console.log('removed')}`);
    if (selectedState === 'selected') props.push(`selected`);
    if (selectedState === 'disabled') props.push(`disabled`);
    
    return `import { Chip } from '@/components/design-system/components/Chip';
${iconPosition !== 'none' ? 'import { Tag } from \'lucide-react\';\n' : ''}
export function ChipDemo() {
  return (
    <Chip
      label="${selectedTone === 'destructive' ? 'Delete' : 'Filter'}"${props.length > 0 ? '\n      ' + props.join('\n      ') : ''}
    />
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
        badge="Content Component"
        title="Chip"
        description="Compact elements that represent an input, attribute, or action. Support icons, different tones, removable state, and full accessibility."
        actions={headerActions}
      />

      {/* Interactive Playground */}
      <PageSection title="Interactive Playground" description="Customize and test the chip component in real-time">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              {/* Size */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['sm', 'md', 'lg'] as const).map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      style={{ textTransform: 'uppercase' }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Tone</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['default', 'subtle', 'outline', 'destructive'] as const).map((tone) => (
                    <Button
                      key={tone}
                      variant={selectedTone === tone ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTone(tone)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {tone}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Icon Position */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Icon Position</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['none', 'leading', 'trailing'] as const).map((pos) => (
                    <Button
                      key={pos}
                      variant={iconPosition === pos ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIconPosition(pos)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {pos}
                    </Button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['default', 'selected', 'disabled'] as const).map((state) => (
                    <Button
                      key={state}
                      variant={selectedState === state ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedState(state)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {state}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Options</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isRemovable}
                    onChange={(e) => setIsRemovable(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                  />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Removable</span>
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ marginBottom: 'var(--spacing-8)' }}>
            <div style={{ 
              padding: 'var(--spacing-8)', 
              background: 'var(--muted)', 
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px'
            }}>
              <Chip
                label={selectedTone === 'destructive' ? 'Delete' : 'Filter'}
                icon={iconPosition !== 'none' ? Tag : undefined}
                iconPosition={iconPosition !== 'none' ? iconPosition as 'leading' | 'trailing' : undefined}
                size={selectedSize}
                tone={selectedTone}
                removable={isRemovable}
                selected={selectedState === 'selected'}
                disabled={selectedState === 'disabled'}
                onRemove={isRemovable ? () => console.log('removed') : undefined}
              />
            </div>
          </div>

          {/* Code */}
          <CollapsibleCodeBlock
            code={getDynamicCode()}
            language="tsx"
            filename="ChipDemo.tsx"
            showLineNumbers
          />
        </PageCard>
      </PageSection>

      {/* Size Variants */}
      <PageSection title="Sizes" description="Available size options">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Small (24px)</div>
                <Chip label="Small Chip" size="sm" icon={Tag} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Medium (32px) - Default</div>
                <Chip label="Medium Chip" size="md" icon={Tag} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Large (40px)</div>
                <Chip label="Large Chip" size="lg" icon={Tag} />
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Tone Variants */}
      <PageSection title="Tones" description="Different tone variations">
        <PageGrid columns={2}>
          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Default
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-3)' }}>
                Standard chip with background
              </p>
              <Chip label="Default" icon={Tag} tone="default" />
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Subtle
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-3)' }}>
                Softer appearance
              </p>
              <Chip label="Subtle" icon={Tag} tone="subtle" />
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Outline
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-3)' }}>
                Transparent background with border
              </p>
              <Chip label="Outline" icon={Tag} tone="outline" />
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Destructive
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-3)' }}>
                For delete or remove actions
              </p>
              <Chip label="Delete" icon={X} tone="destructive" />
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* States */}
      <PageSection title="States" description="Different chip states">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Default</div>
                <Chip label="Default" icon={Tag} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Selected</div>
                <Chip label="Selected" icon={Tag} selected />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Disabled</div>
                <Chip label="Disabled" icon={Tag} disabled />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Removable</div>
                <Chip label="Removable" icon={Tag} removable onRemove={() => console.log('removed')} />
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Icon Positions */}
      <PageSection title="Icon Positions" description="Leading and trailing icon configurations">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>No Icon</div>
                <Chip label="No Icon" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Leading Icon</div>
                <Chip label="Leading" icon={Tag} iconPosition="leading" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-2)' }}>Trailing Icon</div>
                <Chip label="Trailing" icon={Settings} iconPosition="trailing" />
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="CSS variables used by this component">
        <PageCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
              {showAdvancedTokens ? 'Showing all tokens' : 'Showing core tokens only'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedTokens(!showAdvancedTokens)}
            >
              {showAdvancedTokens ? 'Show Less' : 'Show All'}
            </Button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-3)' }}>
            {allTokens.map((token, index) => (
              <TokenCard
                key={index}
                name={token.name}
                token={token.token}
                value={token.value}
                category={token.category}
                highlighted={highlightedToken === token.token}
                onClick={() => handleTokenClick(token.token)}
              />
            ))}
          </div>
        </PageCard>
      </PageSection>

      {/* Accessibility */}
      <PageSection title="Accessibility" description="Built-in accessibility features">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Keyboard Navigation
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Chips are keyboard accessible with Tab key navigation and visible focus indicators. Press Enter or Space to activate.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                ARIA Roles
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Uses appropriate ARIA roles: <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>role="button"</code> for interactive chips, <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>role="status"</code> for non-interactive.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Selected State
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Uses <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>aria-selected</code> to communicate selection state to screen readers.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Remove Button Label
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Removable chips include <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>aria-label</code> on the remove button for screen readers.
              </p>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
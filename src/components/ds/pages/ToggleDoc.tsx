import React from 'react';
import { Switch } from '../../wugweb/Switch';
import { Label } from '../../wugweb/Label';
import { Check, Copy, ExternalLink, Bold, Italic, Underline } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../wugweb/Button';
import { copyToClipboard } from '../../../utils/clipboard';

export function ToggleDoc() {
  const [isChecked, setIsChecked] = React.useState(false);
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
    return `import { Switch } from "@/components/wugweb/Switch";
import { Label } from "@/components/wugweb/Label";

export function ToggleDemo() {
  const [enabled, setEnabled] = React.useState(${isChecked});
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
      <Switch
        checked={enabled}
        onCheckedChange={setEnabled}
        ${isDisabled ? 'disabled' : ''}
      />
      <Label>Enable notifications</Label>
    </div>
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
        title="Toggle"
        description="A binary switch control for turning a setting or feature on or off with a visual sliding indicator."
        actions={headerActions}
      />

      {/* Interactive Playground */}
      <PageSection title="Interactive Playground" description="Customize and test the toggle component in real-time">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              {/* State */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  <Button
                    variant={!isDisabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsDisabled(false)}
                  >
                    Enabled
                  </Button>
                  <Button
                    variant={isDisabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsDisabled(true)}
                  >
                    Disabled
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ 
              padding: 'var(--spacing-12)',
              background: 'var(--muted)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <Switch
                  checked={isChecked}
                  onCheckedChange={setIsChecked}
                  disabled={isDisabled}
                />
                <Label>Enable notifications</Label>
              </div>
            </div>

            {/* Code */}
            {showCode && (
              <CollapsibleCodeBlock
                code={getDynamicCode()}
                language="tsx"
                showLineNumbers={true}
              />
            )}
          </div>
        </PageCard>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="CSS variables used by the Toggle component">
        <PageGrid cols={3}>
          <TokenCard
            token="--accent"
            label="Active Background"
            value="rgba(255, 190, 26, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--accent')}
            isHighlighted={highlightedToken === '--accent'}
          />
          <TokenCard
            token="--muted"
            label="Inactive Background"
            value="rgba(38, 38, 38, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--muted')}
            isHighlighted={highlightedToken === '--muted'}
          />
          <TokenCard
            token="--primary"
            label="Thumb Color"
            value="rgba(255, 255, 255, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--primary')}
            isHighlighted={highlightedToken === '--primary'}
          />
          <TokenCard
            token="--radius-full"
            label="Border Radius"
            value="9999px"
            category="radius"
            onClick={() => handleTokenClick('--radius-full')}
            isHighlighted={highlightedToken === '--radius-full'}
          />
        </PageGrid>
      </PageSection>

      {/* Usage Guidelines */}
      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use toggles for immediate on/off settings that take effect instantly</li>
              <li>Always provide a clear label describing what the toggle controls</li>
              <li>Use checkboxes for selections that require a submit action</li>
              <li>Ensure the active state is visually distinct from inactive</li>
              <li>Consider adding descriptive text for complex settings</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>

      {/* Accessibility */}
      <PageSection title="Accessibility">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Implementation</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>Space</code> or <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>Enter</code> - Toggles the switch</li>
              <li>Use <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>role="switch"</code> for proper semantic meaning</li>
              <li>Include <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>aria-checked</code> to indicate current state</li>
              <li>Ensure minimum touch target size of 44x44px</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
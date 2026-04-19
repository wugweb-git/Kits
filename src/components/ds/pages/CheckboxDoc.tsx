import React from 'react';
import { Checkbox } from '../../design-system/components';
import { Label } from '../../design-system/components';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function CheckboxDoc() {
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
    return `import { Checkbox } from "@/components/design-system/components";
import { Label } from "@/components/design-system/components";

export function CheckboxDemo() {
  const [checked, setChecked] = React.useState(false);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={setChecked}
        ${isDisabled ? 'disabled' : ''}
      />
      <Label htmlFor="terms">Accept terms and conditions</Label>
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
        title="Checkbox"
        description="A binary input control for selecting one or multiple options, with support for indeterminate state."
        actions={headerActions}
      />

      {/* Interactive Playground */}
      <PageSection title="Interactive Playground" description="Customize and test the checkbox component in real-time">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              {/* State */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  <Button
                    variant={!isChecked && !isDisabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setIsChecked(false);
                      setIsDisabled(false);
                    }}
                  >
                    Unchecked
                  </Button>
                  <Button
                    variant={isChecked && !isDisabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setIsChecked(true);
                      setIsDisabled(false);
                    }}
                  >
                    Checked
                  </Button>
                  <Button
                    variant={isDisabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsDisabled(!isDisabled)}
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
              justifyContent: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <Checkbox
                  id="demo-checkbox"
                  checked={isChecked}
                  onCheckedChange={setIsChecked}
                  disabled={isDisabled}
                />
                <Label htmlFor="demo-checkbox">Accept terms and conditions</Label>
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
      <PageSection title="Design Tokens" description="CSS variables used by the Checkbox component">
        <PageGrid cols={3}>
          <TokenCard
            token="--primary"
            label="Checked Background"
            value="rgba(255, 255, 255, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--primary')}
            isHighlighted={highlightedToken === '--primary'}
          />
          <TokenCard
            token="--border"
            label="Border Color"
            value="rgba(43, 43, 43, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--border')}
            isHighlighted={highlightedToken === '--border'}
          />
          <TokenCard
            token="--background"
            label="Unchecked Background"
            value="rgba(18, 18, 18, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--background')}
            isHighlighted={highlightedToken === '--background'}
          />
          <TokenCard
            token="--radius-sm"
            label="Border Radius"
            value="4px"
            category="radius"
            onClick={() => handleTokenClick('--radius-sm')}
            isHighlighted={highlightedToken === '--radius-sm'}
          />
        </PageGrid>
      </PageSection>

      {/* Usage Guidelines */}
      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use checkboxes for multiple-choice selections where users can select any number of options</li>
              <li>Always provide a visible label that clearly describes what the checkbox controls</li>
              <li>Group related checkboxes together with a fieldset</li>
              <li>Use the indeterminate state for "select all" scenarios with nested options</li>
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
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>Space</code> - Toggles the checkbox</li>
              <li>Clicking the label also toggles the checkbox when properly associated</li>
              <li>Use <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>aria-checked</code> to indicate state</li>
              <li>Ensure minimum touch target size of 44x44px</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

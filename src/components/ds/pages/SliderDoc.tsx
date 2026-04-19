import React from 'react';
import { Slider } from '../../design-system/components';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function SliderDoc() {
  const [sliderValue, setSliderValue] = React.useState(50);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [showCode, setShowCode] = React.useState(true);

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
    return `import { Slider } from "@/components/design-system/components/Slider";

export function SliderDemo() {
  const [value, setValue] = React.useState(${sliderValue});
  
  return (
    <Slider
      label="Volume"
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      step={1}
      showValue
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
        badge="Form Component"
        title="Slider"
        description="An input control for selecting a value or range from a continuous or discrete set of values."
        actions={headerActions}
      />

      {/* Interactive Playground */}
      <PageSection title="Interactive Playground" description="Customize and test the slider component in real-time">
        <PageCard>
          {/* Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div style={{ 
              padding: 'var(--spacing-12)',
              background: 'var(--muted)',
              borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
                {/* Single Value */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
                      Single Value
                    </label>
                    <span style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontWeight: 'var(--font-weight-semibold)', 
                      color: 'var(--accent)',
                      background: 'var(--accent-subtle)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {sliderValue}%
                    </span>
                  </div>
                  <Slider
                    value={sliderValue}
                    onChange={setSliderValue}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
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
      <PageSection title="Design Tokens" description="CSS variables used by the Slider component">
        <PageGrid cols={3}>
          <TokenCard
            token="--accent"
            label="Active Track Color"
            value="rgba(255, 190, 26, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--accent')}
            isHighlighted={highlightedToken === '--accent'}
          />
          <TokenCard
            token="--muted"
            label="Track Background"
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
        </PageGrid>
      </PageSection>

      {/* Usage Guidelines */}
      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use sliders for selecting values within a known range</li>
              <li>Display the current value alongside the slider</li>
              <li>Provide clear labels for min and max values when helpful</li>
              <li>Consider using stepped values for discrete options</li>
              <li>Use range sliders when users need to select a range of values</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
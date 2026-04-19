import React from 'react';
import { Textarea } from '../../design-system/components';
import { Label } from '../../design-system/components';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function TextareaDoc() {
  const [value, setValue] = React.useState('');
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
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
    return `import { Textarea } from "@/components/design-system/components";
import { Label } from "@/components/design-system/components";

export function TextareaDemo() {
  const [value, setValue] = React.useState('');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      <Label htmlFor="message">Message</Label>
      <Textarea
        id="message"
        placeholder="Enter your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ${isDisabled ? 'disabled' : ''}
        ${isError ? 'error' : ''}
      />
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
        title="Textarea"
        description="A multi-line text input for collecting longer-form content with auto-resize support."
        actions={headerActions}
      />

      {/* Interactive Playground */}
      <PageSection title="Interactive Playground" description="Customize and test the textarea component in real-time">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              {/* State */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  <Button
                    variant={!isDisabled && !isError ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setIsDisabled(false);
                      setIsError(false);
                    }}
                  >
                    Default
                  </Button>
                  <Button
                    variant={isDisabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setIsDisabled(true);
                      setIsError(false);
                    }}
                  >
                    Disabled
                  </Button>
                  <Button
                    variant={isError ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setIsError(true);
                      setIsDisabled(false);
                    }}
                  >
                    Error
                  </Button>
                </div>
              </div>

              {/* Character Count */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Character Count</label>
                <div style={{ 
                  padding: 'var(--spacing-3) var(--spacing-4)', 
                  background: 'var(--muted)', 
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)'
                }}>
                  {value.length} characters
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
            }}>
              <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label htmlFor="demo-textarea">Message</Label>
                <Textarea
                  id="demo-textarea"
                  placeholder="Enter your message..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={isDisabled}
                  error={isError}
                  rows={5}
                />
                {isError && (
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--destructive)' }}>
                    Please provide a valid message
                  </span>
                )}
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
      <PageSection title="Design Tokens" description="CSS variables used by the Textarea component">
        <PageGrid cols={3}>
          <TokenCard
            token="--input-background"
            label="Background"
            value="rgba(28, 28, 28, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--input-background')}
            isHighlighted={highlightedToken === '--input-background'}
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
            token="--destructive"
            label="Error Color"
            value="rgba(239, 67, 67, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--destructive')}
            isHighlighted={highlightedToken === '--destructive'}
          />
          <TokenCard
            token="--spacing-4"
            label="Padding"
            value="16px"
            category="spacing"
            onClick={() => handleTokenClick('--spacing-4')}
            isHighlighted={highlightedToken === '--spacing-4'}
          />
          <TokenCard
            token="--radius-md"
            label="Border Radius"
            value="8px"
            category="radius"
            onClick={() => handleTokenClick('--radius-md')}
            isHighlighted={highlightedToken === '--radius-md'}
          />
          <TokenCard
            token="--text-base"
            label="Font Size"
            value="1rem"
            category="typography"
            onClick={() => handleTokenClick('--text-base')}
            isHighlighted={highlightedToken === '--text-base'}
          />
        </PageGrid>
      </PageSection>

      {/* Usage Guidelines */}
      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use textareas for multi-line input like comments, descriptions, or messages</li>
              <li>Provide placeholder text that shows the expected format</li>
              <li>Consider adding character count for inputs with length limits</li>
              <li>Set appropriate rows prop for the expected content length</li>
              <li>Enable auto-resize when content length is unpredictable</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

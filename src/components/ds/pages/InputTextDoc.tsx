import React from 'react';
import { Input } from '../../design-system/components';
import { Label } from '../../design-system/components';
import { Check, Copy, ExternalLink, Search, Mail } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function InputTextDoc() {
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
    return `import { Input } from "@/components/design-system/components";
import { Label } from "@/components/design-system/components";

export function InputDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      <Label htmlFor="email">Email Address</Label>
      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
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
        title="Input Text"
        description="A versatile text input component for collecting user data with support for various states, validation, and icons."
        actions={headerActions}
      />

      {/* Interactive Playground */}
      <PageSection title="Interactive Playground" description="Customize and test the input component in real-time">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              {/* State */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  <Button
                    variant={isDisabled ? 'outline' : 'default'}
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

              {/* Value */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Current Value</label>
                <div style={{ 
                  padding: 'var(--spacing-3) var(--spacing-4)', 
                  background: 'var(--muted)', 
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  fontFamily: 'monospace'
                }}>
                  {value || '(empty)'}
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
              <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label htmlFor="demo-input">Email Address</Label>
                <Input
                  id="demo-input"
                  type="email"
                  placeholder="you@example.com"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={isDisabled}
                  error={isError}
                />
                {isError && (
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--destructive)' }}>
                    Please enter a valid email address
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

      {/* Variants */}
      <PageSection title="Variants" description="Different input styles and configurations">
        <PageGrid cols={2}>
          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>With Icon</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label htmlFor="search-input">Search</Label>
                <div style={{ position: 'relative' }}>
                  <Search 
                    size={20} 
                    style={{ 
                      position: 'absolute', 
                      left: 'var(--spacing-4)', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: 'var(--muted-foreground)'
                    }} 
                  />
                  <Input
                    id="search-input"
                    type="text"
                    placeholder="Search..."
                    style={{ paddingLeft: 'var(--spacing-10)' }}
                  />
                </div>
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>With Helper Text</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label htmlFor="password-input">Password</Label>
                <Input
                  id="password-input"
                  type="password"
                  placeholder="Enter your password"
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  Must be at least 8 characters
                </span>
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="CSS variables used by the Input component">
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
              <li>Always pair inputs with clear, descriptive labels</li>
              <li>Use placeholder text for examples, not instructions</li>
              <li>Provide helpful error messages that explain how to fix the issue</li>
              <li>Use appropriate input types (email, tel, number) for better mobile keyboards</li>
              <li>Consider adding icons to clarify input purpose</li>
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
              <li>Use <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>htmlFor</code> to associate labels with inputs</li>
              <li>Include <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>aria-describedby</code> for helper text and error messages</li>
              <li>Set <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>aria-invalid</code> when input has validation errors</li>
              <li>Ensure minimum touch target size of 44x44px</li>
              <li>Maintain sufficient color contrast (4.5:1 for text)</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

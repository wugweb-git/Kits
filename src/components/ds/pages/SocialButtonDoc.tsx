import React from 'react';
import { Copy, Check, ExternalLink, Github, Mail, Facebook, Twitter, Linkedin } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { SocialButton } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function SocialButtonDoc() {
  const [variant, setVariant] = React.useState<'default' | 'outline'>('default');
  const [size, setSize] = React.useState<'default' | 'sm' | 'lg'>('default');
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

  const jsxCode = `import { SocialButton } from './components/design-system/components';
import { Github } from 'lucide-react';

<SocialButton
  variant="${variant}"
  size="${size}"
  icon={<Github size={20} />}
>
  Continue with GitHub
</SocialButton>

// Design Tokens Used:
// Background: var(--social-background)
// Text: var(--social-foreground)
// Border: var(--border)`;

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
        badge="Pattern Component"
        title="Social Button"
        description="Specialized buttons for social authentication and sharing. Pre-styled for common social platforms with consistent branding."
        actions={headerActions}
      />

      {/* Interactive Preview */}
      <PageSection title="Interactive Preview" description="Customize and test the social button">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            {/* Variant */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {(['default', 'outline'] as const).map((v) => (
                  <Button
                    key={v}
                    onClick={() => setVariant(v)}
                    variant={variant === v ? 'default' : 'outline'}
                    size="sm"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {(['sm', 'default', 'lg'] as const).map((s) => (
                  <Button
                    key={s}
                    onClick={() => setSize(s)}
                    variant={size === s ? 'default' : 'outline'}
                    size="sm"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {s === 'default' ? 'md' : s}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SocialButton
              variant={variant}
              size={size}
              icon={<Github size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
            >
              Continue with GitHub
            </SocialButton>
          </div>
        </PageCard>
      </PageSection>

      {/* Provider Examples */}
      <PageSection title="Provider Examples" description="Common social authentication providers">
        <PageGrid cols={2}>
          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <SocialButton icon={<Github size={20} />}>
                Continue with GitHub
              </SocialButton>
              <SocialButton icon={<Mail size={20} />}>
                Continue with Email
              </SocialButton>
              <SocialButton icon={<Facebook size={20} />}>
                Continue with Facebook
              </SocialButton>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <SocialButton icon={<Twitter size={20} />}>
                Continue with Twitter
              </SocialButton>
              <SocialButton icon={<Linkedin size={20} />}>
                Continue with LinkedIn
              </SocialButton>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="All CSS variables used in this component">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          <TokenCard
            label="Background"
            token="--social-background"
            value="#262626"
            color="var(--social-background)"
            onClick={() => handleTokenClick('--social-background')}
            isHighlighted={highlightedToken === '--social-background'}
          />
          <TokenCard
            label="Text Color"
            token="--social-foreground"
            value="#FFFFFF"
            color="var(--social-foreground)"
            onClick={() => handleTokenClick('--social-foreground')}
            isHighlighted={highlightedToken === '--social-foreground'}
          />
          <TokenCard
            label="Border Color"
            token="--border"
            value="#2B2B2B"
            color="var(--border)"
            onClick={() => handleTokenClick('--border')}
            isHighlighted={highlightedToken === '--border'}
          />
        </div>
      </PageSection>

      {/* Code Examples */}
      <PageSection title="Code Examples" description="Copy and paste the code below">
        <CollapsibleCodeBlock code={jsxCode} language="tsx" />
      </PageSection>

      {/* Accessibility */}
      <PageSection title="Accessibility" description="WCAG 2.1 Level AA compliant">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-2)', color: 'var(--foreground)' }}>
                  Best Practices
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                  <li>Uses clear, descriptive button labels like "Continue with GitHub" instead of just "GitHub"</li>
                  <li>Includes proper <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>aria-label</code> attributes for screen readers</li>
                  <li>Maintains sufficient color contrast for all visual states</li>
                  <li>Keyboard accessible with proper focus indicators</li>
                </ul>
              </div>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Clipboard } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function ClipboardDoc() {
  const [variant, setVariant] = React.useState<'button' | 'inline'>('button');
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

  const getDynamicCode = () => `import { Clipboard } from "@/components/design-system/components/Clipboard";

// Button variant (shows copy icon button)
<Clipboard text="npm install wugweb-kits" variant="button">
  <code>npm install wugweb-kits</code>
</Clipboard>

// Inline variant (wraps children with copy on click)
<Clipboard text="copy-me@example.com" variant="inline">
  <span>copy-me@example.com</span>
</Clipboard>`;

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

  const snippets = [
    { label: 'Install command', text: 'npm install wugweb-kits', description: 'Package installation' },
    { label: 'Import statement', text: "import { Button } from '@/components/design-system/components/Button';", description: 'Component import' },
    { label: 'CSS variable', text: 'var(--accent)', description: 'Design token' },
    { label: 'API key', text: 'wk_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', description: 'API credentials' },
  ];

  return (
    <PageWrapper>
      <PageHeader
        badge="Utility Component"
        title="Clipboard"
        description="Copy-to-clipboard with visual feedback. Wraps any content with a copy button that shows a success state on copy. Available in button and inline variants."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Click to copy in each example">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['button', 'inline'] as const).map(v => (
                  <Button key={v} variant={variant === v ? 'default' : 'outline'} size="sm" onClick={() => setVariant(v)} style={{ textTransform: 'capitalize' }}>{v}</Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              {snippets.map((snippet, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{snippet.label}</span>
                  <Clipboard text={snippet.text} variant={variant} successMessage="Copied!" showIcon>
                    <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)', color: 'var(--foreground)', background: 'var(--surface-700)', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-sm)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {snippet.text}
                    </code>
                  </Clipboard>
                </div>
              ))}
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--success" label="Success State" value="rgba(34, 197, 94, 1.00)" category="color" onClick={() => handleTokenClick('--success')} isHighlighted={highlightedToken === '--success'} />
          <TokenCard token="--muted" label="Button Background" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--radius-md" label="Button Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

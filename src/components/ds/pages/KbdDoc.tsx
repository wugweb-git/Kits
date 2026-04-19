import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Kbd } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function KbdDoc() {
  const [size, setSize] = React.useState<'s' | 'm' | 'l'>('m');
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

  const code = `import { Kbd } from "@/components/design-system/components";

// Single key
<Kbd>⌘K</Kbd>

// Key combination
<span>Press <Kbd size="s">Ctrl</Kbd> + <Kbd size="s">C</Kbd> to copy</span>

// In documentation context
<p>
  To save your work, press <Kbd>⌘</Kbd> <Kbd>S</Kbd>
</p>`;

  const shortcuts = [
    { combo: ['⌘', 'K'], description: 'Open command palette' },
    { combo: ['⌘', 'B'], description: 'Toggle bold text' },
    { combo: ['⌘', 'Z'], description: 'Undo last action' },
    { combo: ['⌘', 'Shift', 'Z'], description: 'Redo last action' },
    { combo: ['Ctrl', 'C'], description: 'Copy selection' },
    { combo: ['Ctrl', 'V'], description: 'Paste clipboard' },
    { combo: ['Tab'], description: 'Move focus forward' },
    { combo: ['Esc'], description: 'Close dialog / dismiss' },
  ];

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

  return (
    <PageWrapper>
      <PageHeader
        badge="Typography Component"
        title="Keyboard Key (Kbd)"
        description="A semantic component for displaying keyboard shortcuts with consistent visual styling. Uses the HTML <kbd> element for proper accessibility and semantics."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the Kbd component">
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
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
              <Kbd size={size}>⌘</Kbd>
              <span style={{ color: 'var(--muted-foreground)' }}>+</span>
              <Kbd size={size}>K</Kbd>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: '0 var(--spacing-4)' }}>|</span>
              <Kbd size={size}>Ctrl</Kbd>
              <span style={{ color: 'var(--muted-foreground)' }}>+</span>
              <Kbd size={size}>Shift</Kbd>
              <span style={{ color: 'var(--muted-foreground)' }}>+</span>
              <Kbd size={size}>P</Kbd>
            </div>
            <CollapsibleCodeBlock code={code} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Keyboard Shortcut Reference" description="Common keyboard shortcuts using Kbd components">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-3)' }}>
            {shortcuts.map((shortcut, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-3)', background: 'var(--muted)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{shortcut.description}</span>
                <div style={{ display: 'flex', gap: 'var(--spacing-1)', alignItems: 'center', flexShrink: 0 }}>
                  {shortcut.combo.map((key, j) => (
                    <React.Fragment key={j}>
                      {j > 0 && <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>+</span>}
                      <Kbd size="s">{key}</Kbd>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--surface-600" label="Key Background" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--surface-600')} isHighlighted={highlightedToken === '--surface-600'} />
          <TokenCard token="--border" label="Key Border" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--foreground" label="Key Text" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--foreground')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard token="--radius-sm" label="Key Radius" value="4px" category="radius" onClick={() => handleTokenClick('--radius-sm')} isHighlighted={highlightedToken === '--radius-sm'} />
          <TokenCard token="--text-xs" label="Small Size" value="0.75rem" category="other" onClick={() => handleTokenClick('--text-xs')} isHighlighted={highlightedToken === '--text-xs'} />
          <TokenCard token="--text-sm" label="Medium Size" value="0.875rem" category="other" onClick={() => handleTokenClick('--text-sm')} isHighlighted={highlightedToken === '--text-sm'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

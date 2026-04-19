import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { WYSIWYG } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function WYSIWYGDoc() {
  const [content, setContent] = React.useState('<p>Start typing your content here. Try the <strong>formatting</strong> toolbar above to apply <em>styles</em>.</p>');
  const [minHeight, setMinHeight] = React.useState(200);
  const [isDisabled, setIsDisabled] = React.useState(false);
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

  const getDynamicCode = () => `import { WYSIWYG } from "@/components/design-system/components";

export function WYSIWYGDemo() {
  const [content, setContent] = React.useState('');

  return (
    <WYSIWYG
      value={content}
      onChange={setContent}
      placeholder="Start writing your content..."
      minHeight={${minHeight}}
      disabled={${isDisabled}}
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
        <ExternalLink size={16} />View in Figma
      </Button>
    </div>
  );

  const toolbarItems = [
    { key: 'Bold', keys: 'Ctrl/⌘ + B' },
    { key: 'Italic', keys: 'Ctrl/⌘ + I' },
    { key: 'Underline', keys: 'Ctrl/⌘ + U' },
    { key: 'Unordered List', keys: '- + Space' },
    { key: 'Ordered List', keys: '1. + Space' },
  ];

  return (
    <PageWrapper>
      <PageHeader
        badge="Form Component"
        title="WYSIWYG Editor"
        description="A rich text editor with a formatting toolbar. Supports bold, italic, underline, lists, alignment, links, images, and inline code. Outputs clean HTML."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Edit rich text content in real-time">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Min Height</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {[150, 200, 300].map(h => (
                  <Button key={h} variant={minHeight === h ? 'default' : 'outline'} size="sm" onClick={() => setMinHeight(h)}>{h}px</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>State</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={!isDisabled ? 'default' : 'outline'} size="sm" onClick={() => setIsDisabled(false)}>Enabled</Button>
                <Button variant={isDisabled ? 'default' : 'outline'} size="sm" onClick={() => setIsDisabled(true)}>Disabled</Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <WYSIWYG
              value={content}
              onChange={setContent}
              placeholder="Start writing your content..."
              minHeight={minHeight}
              disabled={isDisabled}
            />
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Toolbar Reference" description="All available formatting actions">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-3)' }}>
            {[
              { action: 'Bold', shortcut: '⌘B', description: 'Strong emphasis' },
              { action: 'Italic', shortcut: '⌘I', description: 'Soft emphasis' },
              { action: 'Underline', shortcut: '⌘U', description: 'Underline text' },
              { action: 'Bullet List', shortcut: '–', description: 'Unordered list items' },
              { action: 'Numbered List', shortcut: '–', description: 'Ordered list items' },
              { action: 'Align Left', shortcut: '–', description: 'Left-align text' },
              { action: 'Align Center', shortcut: '–', description: 'Center-align text' },
              { action: 'Align Right', shortcut: '–', description: 'Right-align text' },
              { action: 'Link', shortcut: '–', description: 'Insert hyperlink' },
              { action: 'Image', shortcut: '–', description: 'Insert image URL' },
              { action: 'Code', shortcut: '–', description: 'Inline code block' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{item.action}</span>
                  {item.shortcut !== '–' && (
                    <code style={{ fontSize: 'var(--text-xs)', background: 'var(--surface-600)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', color: 'var(--accent)' }}>{item.shortcut}</code>
                  )}
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{item.description}</span>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--input-background" label="Editor Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--input-background')} isHighlighted={highlightedToken === '--input-background'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--surface-700" label="Toolbar Background" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--surface-700')} isHighlighted={highlightedToken === '--surface-700'} />
          <TokenCard token="--accent" label="Active Tool Color" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--radius-md" label="Border Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
          <TokenCard token="--foreground" label="Editor Text" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--foreground')} isHighlighted={highlightedToken === '--foreground'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

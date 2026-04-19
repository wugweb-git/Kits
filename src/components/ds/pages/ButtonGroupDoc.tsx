import React from 'react';
import { Check, Copy, ExternalLink, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { ButtonGroup } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function ButtonGroupDoc() {
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical'>('horizontal');
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [align, setAlign] = React.useState('left');
  const [format, setFormat] = React.useState<string[]>([]);

  const handleTokenClick = (token: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
  };

  const toggleFormat = (f: string) => {
    setFormat(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const code = `import { ButtonGroup } from "@/components/design-system/components/ButtonGroup";
import { Button } from "@/components/design-system/components/Button";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

// Horizontal group (default)
<ButtonGroup>
  <Button variant="outline" size="sm">First</Button>
  <Button variant="outline" size="sm">Second</Button>
  <Button variant="outline" size="sm">Third</Button>
</ButtonGroup>

// Vertical group
<ButtonGroup orientation="vertical">
  <Button variant="outline">Option A</Button>
  <Button variant="outline">Option B</Button>
  <Button variant="outline">Option C</Button>
</ButtonGroup>

// Icon toolbar
<ButtonGroup>
  <Button variant="outline" size="sm"><AlignLeft size={16} /></Button>
  <Button variant="outline" size="sm"><AlignCenter size={16} /></Button>
  <Button variant="outline" size="sm"><AlignRight size={16} /></Button>
</ButtonGroup>`;

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
        badge="Utility Component"
        title="Button Group"
        description="Groups related buttons together with connected borders, removing the gap between them and treating them as a single control unit. Ideal for toolbars, segmented controls, and pagination."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Test orientation and typical use cases">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Orientation</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['horizontal', 'vertical'] as const).map(o => (
                  <Button key={o} variant={orientation === o ? 'default' : 'outline'} size="sm" onClick={() => setOrientation(o)} style={{ textTransform: 'capitalize' }}>{o}</Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--spacing-8)', flexWrap: 'wrap' }}>
              <ButtonGroup orientation={orientation}>
                <Button variant="outline" size="sm">First</Button>
                <Button variant="outline" size="sm">Second</Button>
                <Button variant="outline" size="sm">Third</Button>
              </ButtonGroup>
            </div>
            <CollapsibleCodeBlock code={code} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Usage Examples" description="Real-world button group patterns">
        <PageGrid cols={2}>
          {/* Text alignment toolbar */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Alignment Toolbar</h4>
            <ButtonGroup>
              <Button variant={align === 'left' ? 'default' : 'outline'} size="sm" onClick={() => setAlign('left')}><AlignLeft size={16} /></Button>
              <Button variant={align === 'center' ? 'default' : 'outline'} size="sm" onClick={() => setAlign('center')}><AlignCenter size={16} /></Button>
              <Button variant={align === 'right' ? 'default' : 'outline'} size="sm" onClick={() => setAlign('right')}><AlignRight size={16} /></Button>
            </ButtonGroup>
          </div>
          {/* Text format toolbar */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Format Toolbar (Multi-select)</h4>
            <ButtonGroup>
              <Button variant={format.includes('bold') ? 'default' : 'outline'} size="sm" onClick={() => toggleFormat('bold')}><Bold size={16} /></Button>
              <Button variant={format.includes('italic') ? 'default' : 'outline'} size="sm" onClick={() => toggleFormat('italic')}><Italic size={16} /></Button>
              <Button variant={format.includes('underline') ? 'default' : 'outline'} size="sm" onClick={() => toggleFormat('underline')}><Underline size={16} /></Button>
            </ButtonGroup>
          </div>
        </PageGrid>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--border" label="Divider Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--radius-md" label="Group Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
          <TokenCard token="--accent" label="Active Button" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

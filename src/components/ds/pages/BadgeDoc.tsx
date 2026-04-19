import React from 'react';
import { Badge } from '../../design-system/components';
import { Check, Copy, ExternalLink, AlertCircle, CheckCircle, Star } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function BadgeDoc() {
  const [tone, setTone] = React.useState<'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'neutral'>('primary');
  const [style, setStyle] = React.useState<'solid' | 'subtle' | 'outline'>('solid');
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [showIcon, setShowIcon] = React.useState(false);
  const [showDot, setShowDot] = React.useState(false);
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
    const props = [];
    if (tone !== 'primary') props.push(`tone="${tone}"`);
    if (style !== 'solid') props.push(`variant="${style}"`);
    if (size !== 'md') props.push(`size="${size}"`);
    if (showIcon) props.push(`icon={<Star size={12} />}`);
    if (showDot) props.push(`dot`);
    
    const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
    
    return `import { Badge } from "@/components/design-system/components";
import { Star } from "lucide-react";

export function BadgeDemo() {
  return (
    <Badge${propsString}>
      Active
    </Badge>
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
        badge="UI Component"
        title="Badge"
        description="A compact visual indicator for status, categories, counts, or labels with multiple style variants and tones."
        actions={headerActions}
      />

      {/* Interactive Playground */}
      <PageSection title="Interactive Playground" description="Customize and test the badge component in real-time">
        <PageCard>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              {/* Tone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Tone</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['default', 'primary', 'secondary', 'success', 'warning', 'info', 'neutral'] as const).map((t) => (
                    <Button
                      key={t}
                      variant={tone === t ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTone(t)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Style</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['solid', 'subtle', 'outline'] as const).map((s) => (
                    <Button
                      key={s}
                      variant={style === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStyle(s)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['sm', 'md', 'lg'] as const).map((s) => (
                    <Button
                      key={s}
                      variant={size === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSize(s)}
                      style={{ textTransform: 'uppercase' }}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Decorations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Decorations</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  <Button
                    variant={showIcon ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setShowIcon(!showIcon);
                      if (!showIcon) setShowDot(false);
                    }}
                  >
                    Icon
                  </Button>
                  <Button
                    variant={showDot ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setShowDot(!showDot);
                      if (!showDot) setShowIcon(false);
                    }}
                  >
                    Dot
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
              <Badge
                tone={tone}
                variant={style}
                size={size}
                icon={showIcon ? <Star size={12} /> : undefined}
                dot={showDot}
              >
                Active
              </Badge>
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

      {/* Variants Showcase */}
      <PageSection title="Tone Variants" description="Different badge tones for various contexts">
        <PageGrid cols={3}>
          {(['default', 'primary', 'secondary', 'success', 'warning', 'info', 'neutral'] as const).map((t) => (
            <PageCard key={t}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0, textTransform: 'capitalize' }}>{t}</h4>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Badge tone={t} variant="solid">Solid</Badge>
                  <Badge tone={t} variant="subtle">Subtle</Badge>
                  <Badge tone={t} variant="outline">Outline</Badge>
                </div>
              </div>
            </PageCard>
          ))}
        </PageGrid>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="CSS variables used by the Badge component">
        <PageGrid cols={3}>
          <TokenCard
            token="--accent"
            label="Primary Color"
            value="rgba(255, 190, 26, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--accent')}
            isHighlighted={highlightedToken === '--accent'}
          />
          <TokenCard
            token="--success"
            label="Success Color"
            value="rgba(34, 197, 94, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--success')}
            isHighlighted={highlightedToken === '--success'}
          />
          <TokenCard
            token="--destructive"
            label="Warning Color"
            value="rgba(239, 67, 67, 1.00)"
            category="color"
            onClick={() => handleTokenClick('--destructive')}
            isHighlighted={highlightedToken === '--destructive'}
          />
          <TokenCard
            token="--spacing-2"
            label="Padding X"
            value="8px"
            category="spacing"
            onClick={() => handleTokenClick('--spacing-2')}
            isHighlighted={highlightedToken === '--spacing-2'}
          />
          <TokenCard
            token="--radius-full"
            label="Border Radius"
            value="9999px"
            category="radius"
            onClick={() => handleTokenClick('--radius-full')}
            isHighlighted={highlightedToken === '--radius-full'}
          />
          <TokenCard
            token="--text-xs"
            label="Font Size"
            value="0.75rem"
            category="typography"
            onClick={() => handleTokenClick('--text-xs')}
            isHighlighted={highlightedToken === '--text-xs'}
          />
        </PageGrid>
      </PageSection>

      {/* Usage Guidelines */}
      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use badges to draw attention to new, important, or relevant information</li>
              <li>Keep badge text short and concise (ideally 1-2 words)</li>
              <li>Use consistent tones across your application (e.g., always use "success" for completed states)</li>
              <li>Avoid using too many badges in close proximity as it reduces their effectiveness</li>
              <li>Use the dot variant for minimal visual weight when space is limited</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

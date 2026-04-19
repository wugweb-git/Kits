import React from 'react';
import { Avatar, AvatarGroup } from '../../design-system/components';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';
import imgAvatar from 'figma:asset/f696e50d914cf017f3f0dedc0a291546425bc149.png';

export function AvatarDoc() {
  const [selectedSize, setSelectedSize] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  const [selectedStatus, setSelectedStatus] = React.useState<'online' | 'offline' | 'away' | 'busy' | 'none'>('none');
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
    if (selectedSize !== 'md') props.push(`size="${selectedSize}"`);
    if (selectedStatus !== 'none') props.push(`status="${selectedStatus}"`);
    const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
    
    return `import { Avatar } from "@/components/design-system/components/Avatar";

export function AvatarDemo() {
  return (
    <Avatar${propsString}
      src="/avatar.jpg"
      alt="User Avatar"
      fallback="JD"
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
        badge="UI Component"
        title="Avatar"
        description="A visual representation of a user or entity with support for images, initials, status indicators, and groups."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the avatar component">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Size</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
                    <Button key={s} variant={selectedSize === s ? 'default' : 'outline'} size="sm" onClick={() => setSelectedSize(s)} style={{ textTransform: 'uppercase' }}>{s}</Button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Status</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {(['none', 'online', 'offline', 'away', 'busy'] as const).map((s) => (
                    <Button key={s} variant={selectedStatus === s ? 'default' : 'outline'} size="sm" onClick={() => setSelectedStatus(s)} style={{ textTransform: 'capitalize' }}>{s}</Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: 'var(--spacing-6)', flexWrap: 'wrap' }}>
              <Avatar size={selectedSize} status={selectedStatus} src={imgAvatar} alt="User" fallback="JD" />
              <Avatar size={selectedSize} status={selectedStatus} fallback="AB" />
            </div>
            {showCode && <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers={true} />}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Avatar Group" description="Display multiple avatars in a compact group">
        <PageCard>
          <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AvatarGroup 
              avatars={[
                { src: imgAvatar, alt: 'User 1', fallback: 'U1' },
                { fallback: 'U2' },
                { fallback: 'U3' },
                { fallback: 'U4' },
                { fallback: 'U5' },
              ]}
              max={4}
            />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens" description="CSS variables used by the Avatar component">
        <PageGrid cols={3}>
          <TokenCard token="--card" label="Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--card')} isHighlighted={highlightedToken === '--card'} />
          <TokenCard token="--success" label="Online Status" value="rgba(34, 197, 94, 1.00)" category="color" onClick={() => handleTokenClick('--success')} isHighlighted={highlightedToken === '--success'} />
          <TokenCard token="--radius-full" label="Border Radius" value="9999px" category="radius" onClick={() => handleTokenClick('--radius-full')} isHighlighted={highlightedToken === '--radius-full'} />
        </PageGrid>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use consistent avatar sizes within the same context</li>
              <li>Provide meaningful fallback initials when images aren't available</li>
              <li>Use status indicators only when user presence is relevant</li>
              <li>Group avatars when showing team members or collaborators</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
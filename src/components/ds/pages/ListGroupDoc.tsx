import React from 'react';
import { Check, Copy, ExternalLink, Home, Settings, User, Bell, FileText, Star } from 'lucide-react';
import { ListGroup } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function ListGroupDoc() {
  const [variant, setVariant] = React.useState<'default' | 'bordered' | 'flush'>('default');
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

  const menuItems = [
    { id: '1', label: 'Dashboard', icon: Home, active: true, onClick: () => {} },
    { id: '2', label: 'Profile', icon: User, onClick: () => {} },
    { id: '3', label: 'Notifications', icon: Bell, badge: '5', onClick: () => {} },
    { id: '4', label: 'Documents', icon: FileText, onClick: () => {} },
    { id: '5', label: 'Favourites', icon: Star, onClick: () => {} },
    { id: '6', label: 'Settings', icon: Settings, description: 'Manage your preferences', onClick: () => {} },
  ];

  const getDynamicCode = () => `import { ListGroup } from "@/components/design-system/components/ListGroup";
import { Home, User, Bell } from "lucide-react";

const items = [
  { id: "1", label: "Dashboard", icon: Home, active: true, onClick: () => {} },
  { id: "2", label: "Profile", icon: User, onClick: () => {} },
  { id: "3", label: "Notifications", icon: Bell, badge: "5", onClick: () => {} },
];

<ListGroup
  items={items}
  variant="${variant}"
  size="${size}"
/>`;

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
        badge="Data Display Component"
        title="List Group"
        description="A structured list of clickable items with support for icons, descriptions, badges, active states, and disabled items. Ideal for settings menus, navigation lists, and option selectors."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the list group">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['default', 'bordered', 'flush'] as const).map(v => (
                  <Button key={v} variant={variant === v ? 'default' : 'outline'} size="sm" onClick={() => setVariant(v)} style={{ textTransform: 'capitalize' }}>{v}</Button>
                ))}
              </div>
            </div>
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
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '360px' }}>
                <ListGroup items={menuItems} variant={variant} size={size} />
              </div>
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--card" label="List Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--card')} isHighlighted={highlightedToken === '--card'} />
          <TokenCard token="--border" label="Item Border" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--accent" label="Active Item" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--muted" label="Hover State" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--radius-md" label="Item Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
          <TokenCard token="--spacing-3" label="Item Padding" value="12px" category="spacing" onClick={() => handleTokenClick('--spacing-3')} isHighlighted={highlightedToken === '--spacing-3'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

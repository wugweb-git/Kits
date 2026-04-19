import React from 'react';
import { Check, Copy, ExternalLink, Home, Settings, User, FileText, BarChart2, Package, HelpCircle } from 'lucide-react';
import { NavigationMenu } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function NavigationMenuDoc() {
  const [activeId, setActiveId] = React.useState('home');
  const [variant, setVariant] = React.useState<'default' | 'pills' | 'underline'>('underline');
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical'>('horizontal');
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

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'docs', label: 'Docs', icon: FileText, badge: 'New' },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      children: [
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const getDynamicCode = () => `import { NavigationMenu } from "@/components/design-system/components";
import { Home, FileText, User, Package } from "lucide-react";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "docs", label: "Docs", icon: FileText },
  {
    id: "products",
    label: "Products",
    icon: Package,
    children: [
      { id: "analytics", label: "Analytics" },
      { id: "settings", label: "Settings" },
    ],
  },
];

<NavigationMenu
  items={navItems}
  variant="${variant}"
  orientation="${orientation}"
  activeId={activeId}
  onItemClick={(item) => setActiveId(item.id)}
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
        badge="Navigation Component"
        title="Navigation Menu"
        description="An accessible navigation menu with horizontal and vertical orientations, three visual variants, dropdown support, and badge indicators. Suitable for app-level navigation and section tabs."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the navigation menu">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Variant</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['default', 'pills', 'underline'] as const).map(v => (
                  <Button key={v} variant={variant === v ? 'default' : 'outline'} size="sm" onClick={() => setVariant(v)} style={{ textTransform: 'capitalize' }}>{v}</Button>
                ))}
              </div>
            </div>
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
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ maxWidth: orientation === 'vertical' ? '240px' : '100%' }}>
                <NavigationMenu
                  items={navItems}
                  variant={variant}
                  orientation={orientation}
                  activeId={activeId}
                  onItemClick={(item) => setActiveId(item.id)}
                />
              </div>
              {activeId && (
                <p style={{ marginTop: 'var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 'var(--spacing-4) 0 0' }}>
                  Active: <strong style={{ color: 'var(--accent)' }}>{activeId}</strong>
                </p>
              )}
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Variants" description="Visual styles for different contexts">
        <PageGrid cols={3}>
          {(['default', 'pills', 'underline'] as const).map(v => (
            <div key={v} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', textTransform: 'capitalize' }}>{v}</h4>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                  {v === 'default' ? 'Subtle background on active' : v === 'pills' ? 'Rounded pill active indicator' : 'Underline border on active'}
                </p>
              </div>
              <NavigationMenu
                items={[
                  { id: 'a', label: 'Item A' },
                  { id: 'b', label: 'Item B' },
                ]}
                variant={v}
                activeId="a"
              />
            </div>
          ))}
        </PageGrid>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--accent" label="Active Item Color" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--accent-subtle" label="Active Background" value="rgba(255, 190, 26, 0.10)" category="color" onClick={() => handleTokenClick('--accent-subtle')} isHighlighted={highlightedToken === '--accent-subtle'} />
          <TokenCard token="--muted" label="Hover Background" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--popover" label="Dropdown Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--popover')} isHighlighted={highlightedToken === '--popover'} />
          <TokenCard token="--radius-md" label="Item Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

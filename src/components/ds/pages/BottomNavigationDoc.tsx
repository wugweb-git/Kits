import React from 'react';
import { Check, Copy, ExternalLink, Home, Search, Heart, ShoppingCart, User } from 'lucide-react';
import { BottomNavigation } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function BottomNavigationDoc() {
  const [activeId, setActiveId] = React.useState('home');
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
    { id: 'home', label: 'Home', icon: Home, onClick: () => setActiveId('home') },
    { id: 'search', label: 'Search', icon: Search, onClick: () => setActiveId('search') },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: '3', onClick: () => setActiveId('favorites') },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: '12', onClick: () => setActiveId('cart') },
    { id: 'profile', label: 'Profile', icon: User, onClick: () => setActiveId('profile') },
  ];

  const code = `import { BottomNavigation } from "@/components/design-system/components";
import { Home, Search, Heart, ShoppingCart, User } from "lucide-react";

const navItems = [
  { id: "home", label: "Home", icon: Home, onClick: () => setActive("home") },
  { id: "search", label: "Search", icon: Search, onClick: () => setActive("search") },
  { id: "favorites", label: "Favorites", icon: Heart, badge: "3", onClick: () => setActive("favorites") },
  { id: "cart", label: "Cart", icon: ShoppingCart, badge: "12", onClick: () => setActive("cart") },
  { id: "profile", label: "Profile", icon: User, onClick: () => setActive("profile") },
];

<BottomNavigation items={navItems} activeId={activeId} />`;

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
        title="Bottom Navigation"
        description="A fixed bottom tab bar for mobile navigation. Displays 3–5 destinations with icons and optional badge counts. Follows iOS and Material Design bottom navigation patterns."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Click tabs to test active state and badges">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-8)' }}>
              {/* Mobile device frame simulation */}
              <div style={{ margin: '0 auto', width: '375px', maxWidth: '100%', background: 'var(--surface-900)', borderRadius: 'var(--radius-6)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                {/* Fake screen content */}
                <div style={{ padding: 'var(--spacing-6)', minHeight: '180px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                    {activeId.charAt(0).toUpperCase() + activeId.slice(1)}
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                    Current screen content for the {activeId} tab.
                  </p>
                </div>
                <BottomNavigation items={navItems} activeId={activeId} />
              </div>
            </div>
            <CollapsibleCodeBlock code={code} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use 3–5 destinations — fewer than 3 wastes space; more than 5 is cognitively overwhelming</li>
              <li>Always include an icon — text alone is insufficient on small screens</li>
              <li>Use badge counts sparingly — reserve for high-priority notifications only</li>
              <li>Ensure the bottom nav is <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>position: fixed</code> at the bottom on mobile layouts</li>
              <li>Avoid placing it on tablet/desktop — use a sidebar or top nav instead</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--card" label="Nav Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--card')} isHighlighted={highlightedToken === '--card'} />
          <TokenCard token="--accent" label="Active Tab Color" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--muted-foreground" label="Inactive Tab Color" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--border" label="Top Border" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--destructive" label="Badge Background" value="rgba(239, 67, 67, 1.00)" category="color" onClick={() => handleTokenClick('--destructive')} isHighlighted={highlightedToken === '--destructive'} />
          <TokenCard token="--spacing-2" label="Label Margin" value="8px" category="spacing" onClick={() => handleTokenClick('--spacing-2')} isHighlighted={highlightedToken === '--spacing-2'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

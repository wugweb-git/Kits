import React from 'react';
import { Copy, Check, ExternalLink, Home, Folder, Star, Settings } from 'lucide-react';
import { SideMenu, SideMenuItem } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function SideMenuDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const items: SideMenuItem[] = [
    { label: 'Home', href: '#home', icon: <Home size={18} />, active: true },
    { label: 'Projects', href: '#projects', icon: <Folder size={18} /> },
    { label: 'Favorites', href: '#favorites', icon: <Star size={18} /> },
    { label: 'Settings', href: '#settings', icon: <Settings size={18} /> },
  ];

  const code = `import { SideMenu } from '@/components/design-system/components';
import { Home, Folder, Star, Settings } from 'lucide-react';

const items = [
  { label: 'Home', href: '#home', icon: <Home size={18} />, active: true },
  { label: 'Projects', href: '#projects', icon: <Folder size={18} /> },
  { label: 'Favorites', href: '#favorites', icon: <Star size={18} /> },
  { label: 'Settings', href: '#settings', icon: <Settings size={18} /> },
];

<SideMenu items={items} />`;

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm">
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
      <Button variant="outline" size="sm"><ExternalLink size={16} />View in Figma</Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader badge="Navigation Component" title="Side Menu" description="Vertical navigation menu for sidebars with icon support and active states." actions={headerActions} />
      
      <PageSection title="Example">
        <PageCard>
          <div style={{ maxWidth: '280px', marginBottom: 'var(--spacing-4)', background: 'var(--muted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)' }}>
            <SideMenu items={items} />
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="SideMenuDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

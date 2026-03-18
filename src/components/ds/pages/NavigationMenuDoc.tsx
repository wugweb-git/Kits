import React from 'react';
import { Copy, Check, ExternalLink, Home, Settings, User, FileText } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem } from '../../wugweb/NavigationMenu';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function NavigationMenuDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const menuItems: NavigationMenuItem[] = [
    { label: 'Home', href: '#home', icon: <Home size={18} /> },
    { label: 'Profile', href: '#profile', icon: <User size={18} /> },
    { label: 'Documents', href: '#docs', icon: <FileText size={18} /> },
    { label: 'Settings', href: '#settings', icon: <Settings size={18} /> },
  ];

  const code = `import { NavigationMenu } from '@/components/wugweb/NavigationMenu';
import { Home, User, FileText, Settings } from 'lucide-react';

const items = [
  { label: 'Home', href: '#home', icon: <Home size={18} /> },
  { label: 'Profile', href: '#profile', icon: <User size={18} /> },
  { label: 'Documents', href: '#docs', icon: <FileText size={18} /> },
  { label: 'Settings', href: '#settings', icon: <Settings size={18} /> },
];

<NavigationMenu items={items} />`;

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
      <PageHeader badge="Navigation Component" title="Navigation Menu" description="Complex navigation menu with nested items and dropdown support." actions={headerActions} />
      
      <PageSection title="Example">
        <PageCard>
          <div style={{ maxWidth: '300px', marginBottom: 'var(--spacing-4)' }}>
            <NavigationMenu items={menuItems} />
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="NavigationMenuDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

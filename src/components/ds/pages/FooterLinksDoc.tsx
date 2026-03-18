import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { FooterLinks, FooterLinkGroup } from '../../wugweb/FooterLinks';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function FooterLinksDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const linkGroups: FooterLinkGroup[] = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Updates", href: "#updates" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" }
      ]
    }
  ];

  const code = `import { FooterLinks } from '@/components/wugweb/FooterLinks';

const groups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" }
    ]
  }
];

<FooterLinks groups={groups} />`;

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
      <PageHeader badge="Layout Component" title="Footer Links" description="Organized footer link groups for site navigation." actions={headerActions} />
      
      <PageSection title="Example">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-4)', background: 'var(--muted)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)' }}>
            <FooterLinks groups={linkGroups} />
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="FooterLinksDemo.tsx" />
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

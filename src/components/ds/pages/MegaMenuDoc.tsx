import React from 'react';
import { Check, Copy, ExternalLink, BarChart2, FileText, Settings, Package, Users, Zap, Code, Globe } from 'lucide-react';
import { MegaMenu } from '../../wugweb/MegaMenu';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { siteInventory } from '../../../generated/siteInventory';
import { copyToClipboard } from '../../../utils/clipboard';

export function MegaMenuDoc() {
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

  const productSections = [
    {
      title: 'Design Tools',
      items: [
        { title: 'Component Library', description: `${siteInventory.publicComponentModuleCount} production-ready components`, icon: Package },
        { title: 'Design Tokens', description: 'CSS variables for consistent styling', icon: Zap },
        { title: 'Icon Library', description: '1000+ Lucide icons pre-integrated', icon: Globe },
      ],
    },
    {
      title: 'Development',
      items: [
        { title: 'CLI Tool', description: 'Generate components from command line', icon: Code },
        { title: 'Figma Plugin', description: 'Sync tokens directly from Figma', icon: FileText },
        { title: 'VS Code Extension', description: 'IntelliSense for Wugweb tokens', icon: Settings },
      ],
    },
    {
      title: 'Team & Enterprise',
      items: [
        { title: 'Team Dashboard', description: 'Manage design system adoption', icon: BarChart2 },
        { title: 'User Roles', description: 'Control access and permissions', icon: Users },
      ],
    },
  ];

  const code = `import { MegaMenu } from "@/components/wugweb/MegaMenu";
import { Package, Zap, Code } from "lucide-react";

const sections = [
  {
    title: "Design Tools",
    items: [
      { title: "Component Library", description: "81 components", icon: Package },
      { title: "Design Tokens", description: "CSS variables", icon: Zap },
    ],
  },
  {
    title: "Development",
    items: [
      { title: "CLI Tool", description: "Generate components", icon: Code },
    ],
  },
];

<MegaMenu label="Products" sections={sections} />`;

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
        title="Mega Menu"
        description="A large dropdown navigation menu that organizes many links into categorized sections with optional icons and descriptions. Perfect for product or service-heavy navigation."
        actions={headerActions}
      />

      <PageSection title="Live Demo" description="Click the Mega Menu trigger to see the dropdown">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '180px' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                <Button variant="ghost" size="sm">Home</Button>
                <MegaMenu label="Products" sections={productSections} />
                <Button variant="ghost" size="sm">Pricing</Button>
                <Button variant="ghost" size="sm">Blog</Button>
              </div>
            </div>
            <CollapsibleCodeBlock code={code} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--popover" label="Dropdown Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--popover')} isHighlighted={highlightedToken === '--popover'} />
          <TokenCard token="--border" label="Dropdown Border" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--muted" label="Item Hover" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--accent" label="Active Color" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--radius-lg" label="Dropdown Radius" value="12px" category="radius" onClick={() => handleTokenClick('--radius-lg')} isHighlighted={highlightedToken === '--radius-lg'} />
          <TokenCard token="--text-xs" label="Section Title Size" value="0.75rem" category="other" onClick={() => handleTokenClick('--text-xs')} isHighlighted={highlightedToken === '--text-xs'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

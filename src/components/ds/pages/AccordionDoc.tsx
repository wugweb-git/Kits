import React from 'react';
import { Accordion, AccordionGroup } from '../../wugweb/Accordion';
import { Check, Copy, ExternalLink, HelpCircle, Settings, Star } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { siteInventory } from '../../../generated/siteInventory';
import { Button } from '../../wugweb/Button';
import { copyToClipboard } from '../../../utils/clipboard';

export function AccordionDoc() {
  const [showCode, setShowCode] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [allowMultiple, setAllowMultiple] = React.useState(true);

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

  const accordionItems = [
    {
      title: 'What is Wugweb Kits?',
      content: (
        <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
          {`Wugweb Kits is a comprehensive design system with ${siteInventory.publicComponentModuleCount} production-ready components built with React and Tailwind CSS, strictly using CSS variables for complete design token control.`}
        </p>
      ),
      icon: <HelpCircle size={16} />,
      defaultOpen: true,
    },
    {
      title: 'How do I get started?',
      content: (
        <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
          Install the package, import the components you need, and customize the design tokens in
          your global CSS file to match your brand.
        </p>
      ),
      icon: <Star size={16} />,
    },
    {
      title: 'Is it accessible?',
      content: (
        <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
          Yes! All components follow WAI-ARIA patterns and include proper keyboard navigation, focus
          management, and screen reader support.
        </p>
      ),
      icon: <Settings size={16} />,
    },
  ];

  const getDynamicCode = () => `import { Accordion, AccordionGroup } from "@/components/wugweb/Accordion";

export function AccordionDemo() {
  return (
    <AccordionGroup
      allowMultiple={${allowMultiple}}
      items={[
        {
          title: "What is Wugweb Kits?",
          content: <p>A ${siteInventory.publicComponentModuleCount}-component design system.</p>,
          defaultOpen: true,
        },
        {
          title: "How do I get started?",
          content: <p>Import the components and customize tokens.</p>,
        },
        {
          title: "Is it accessible?",
          content: <p>Yes — WAI-ARIA compliant throughout.</p>,
        },
      ]}
    />
  );
}`;

  const singleCode = `import { Accordion } from "@/components/wugweb/Accordion";

<Accordion title="Accordion Title" defaultOpen>
  Content goes here inside the accordion.
</Accordion>`;

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
        badge="Disclosure Component"
        title="Accordion"
        description="Vertically stacked interactive headings that reveal or hide associated sections of content. Supports single and multi-open modes with smooth animations."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the accordion component">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-6)', display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Behavior</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant={allowMultiple ? 'default' : 'outline'} size="sm" onClick={() => setAllowMultiple(true)}>Multiple</Button>
                <Button variant={!allowMultiple ? 'default' : 'outline'} size="sm" onClick={() => setAllowMultiple(false)}>Single</Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <AccordionGroup allowMultiple={allowMultiple} items={accordionItems} />
              </div>
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers={true} />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Single Accordion" description="The base Accordion component for standalone usage">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Accordion title="Click to expand" defaultOpen>
                  <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                    This is the content that appears when the accordion is expanded. You can put any React node here.
                  </p>
                </Accordion>
              </div>
            </div>
            <CollapsibleCodeBlock code={singleCode} language="tsx" showLineNumbers={true} />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens" description="CSS variables used by the Accordion component">
        <PageGrid cols={3}>
          <TokenCard token="--foreground" label="Title Color" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--foreground')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard token="--muted-foreground" label="Content Color" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--muted" label="Hover Background" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--radius-md" label="Border Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
          <TokenCard token="--motion-duration-normal" label="Animation Speed" value="120ms" category="other" onClick={() => handleTokenClick('--motion-duration-normal')} isHighlighted={highlightedToken === '--motion-duration-normal'} />
        </PageGrid>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use accordions to organize related content into collapsible sections</li>
              <li>Keep section headings clear and concise — they must be scannable when collapsed</li>
              <li>Use <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>allowMultiple=false</code> for FAQs and settings; <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>true</code> for filters</li>
              <li>Avoid nesting accordions more than one level deep</li>
              <li>Use <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>defaultOpen</code> for the most important content section</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

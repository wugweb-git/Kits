import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../wugweb/Button';
import { copyToClipboard } from '../../../utils/clipboard';

export function AccordionDoc() {
  const [showCode, setShowCode] = React.useState(true);
  const [showAccessibility, setShowAccessibility] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [allowMultiple, setAllowMultiple] = React.useState(false);

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
    return `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/wugweb/Accordion";

export function AccordionDemo() {
  return (
    <Accordion type="${allowMultiple ? 'multiple' : 'single'}" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Wugweb Kits?</AccordionTrigger>
        <AccordionContent>
          Wugweb Kits is a comprehensive design system with 127+ production-ready components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I get started?</AccordionTrigger>
        <AccordionContent>
          Install the package and import the components you need into your project.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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
        badge="Disclosure Component"
        title="Accordion"
        description="Vertically stacked set of interactive headings that reveal or hide associated sections of content."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Customize and test the accordion component">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-8)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Behavior</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  <Button variant={!allowMultiple ? 'default' : 'outline'} size="sm" onClick={() => setAllowMultiple(false)}>Single</Button>
                  <Button variant={allowMultiple ? 'default' : 'outline'} size="sm" onClick={() => setAllowMultiple(true)}>Multiple</Button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)' }}>
              <Accordion type={allowMultiple ? 'multiple' : 'single'} collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is Wugweb Kits?</AccordionTrigger>
                  <AccordionContent>
                    Wugweb Kits is a comprehensive design system with 127+ production-ready components built with React and Tailwind CSS, strictly using CSS variables for complete design token control.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I get started?</AccordionTrigger>
                  <AccordionContent>
                    Install the package, import the components you need, and customize the design tokens in your global CSS file to match your brand.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All components follow WAI-ARIA patterns and include proper keyboard navigation, focus management, and screen reader support.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            {showCode && <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers={true} />}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens" description="CSS variables used by the Accordion component">
        <PageGrid cols={3}>
          <TokenCard token="--foreground" label="Text Color" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--foreground')} isHighlighted={highlightedToken === '--foreground'} />
          <TokenCard token="--muted-foreground" label="Content Color" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--spacing-4" label="Padding" value="16px" category="spacing" onClick={() => handleTokenClick('--spacing-4')} isHighlighted={highlightedToken === '--spacing-4'} />
        </PageGrid>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use accordions for organizing related content into collapsible sections</li>
              <li>Keep section headings clear and concise</li>
              <li>Consider using single mode for FAQs and multiple mode for filters</li>
              <li>Ensure content is scannable even when collapsed</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>

      {showAccessibility && (
        <PageSection title="Accessibility">
          <PageCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Keyboard Support</h3>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>Enter</code> / <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>Space</code> - Toggle accordion item</li>
                <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>Tab</code> - Move focus to next trigger</li>
              </ul>
            </div>
          </PageCard>
        </PageSection>
      )}
    </PageWrapper>
  );
}
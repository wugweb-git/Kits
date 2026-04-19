import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../design-system/components';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../design-system/components';
import { copyToClipboard } from '../../../utils/clipboard';

export function DialogDoc() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [showCode, setShowCode] = React.useState(true);

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
    return `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/design-system/components/Dialog";
import { Button } from "@/components/design-system/components/Button";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of what the dialog is for.
          </DialogDescription>
        </DialogHeader>
        <div style={{ padding: 'var(--spacing-6) 0' }}>
          Dialog content goes here
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
        badge="Overlay Component"
        title="Dialog"
        description="A modal window that requires user interaction before returning to the main application flow."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Test the dialog component">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-12)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to proceed with this action? This cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div style={{ padding: 'var(--spacing-6) 0' }}>
                    <p style={{ color: 'var(--foreground)', margin: 0 }}>
                      Additional content or form fields can be placed here.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsOpen(false)}>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {showCode && <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers={true} />}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens" description="CSS variables used by the Dialog component">
        <PageGrid cols={3}>
          <TokenCard token="--card" label="Content Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--card')} isHighlighted={highlightedToken === '--card'} />
          <TokenCard token="--overlay-background" label="Overlay Background" value="rgba(0, 0, 0, 0.6)" category="color" onClick={() => handleTokenClick('--overlay-background')} isHighlighted={highlightedToken === '--overlay-background'} />
          <TokenCard token="--border" label="Border Color" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--radius-lg" label="Border Radius" value="12px" category="radius" onClick={() => handleTokenClick('--radius-lg')} isHighlighted={highlightedToken === '--radius-lg'} />
        </PageGrid>
      </PageSection>

      <PageSection title="Usage Guidelines">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Use dialogs for critical information or actions that require user attention</li>
              <li>Always provide a clear way to close the dialog (X button or Cancel action)</li>
              <li>Keep dialog content focused and concise</li>
              <li>Avoid nesting dialogs within other dialogs</li>
              <li>Use clear, action-oriented button labels</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Accessibility">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Implementation</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li><code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>Escape</code> - Close the dialog</li>
              <li>Focus is trapped within the dialog when open</li>
              <li>Focus returns to trigger element when dialog closes</li>
              <li>Proper ARIA labels for screen readers</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

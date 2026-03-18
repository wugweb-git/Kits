import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Skeleton } from '../../wugweb/Skeleton';
import { Button } from '../../wugweb/Button';
import { copyToClipboard } from '../../../utils/clipboard';

export function SkeletonDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);

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

  const jsxCode = `import { Skeleton } from './components/wugweb/Skeleton';

// Card Skeleton Example
<div className="flex flex-col gap-4 w-[250px]">
  <Skeleton height={125} className="w-full rounded-xl" />
  <div className="space-y-2">
    <Skeleton height={16} className="w-full" />
    <Skeleton height={16} className="w-[80%]" />
  </div>
</div>

// Profile Skeleton Example
<div className="flex items-center gap-4">
  <Skeleton variant="circle" width={48} height={48} />
  <div className="space-y-2">
    <Skeleton height={16} width={200} />
    <Skeleton height={12} width={150} />
  </div>
</div>`;

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
        badge="Feedback Component"
        title="Skeleton"
        description="A placeholder component used to indicate content is loading. It mimics the structure of the actual content to reduce perceived load time."
        actions={headerActions}
      />

      {/* Interactive Preview */}
      <PageSection title="Examples" description="Common skeleton loading patterns">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
            
            {/* Card Example */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Card Loading State</h3>
              <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap' }}>
                <div style={{ width: '280px', padding: 'var(--spacing-6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-800)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <Skeleton height={140} style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={16} width="100%" />
                    <Skeleton height={16} width="60%" />
                  </div>
                </div>
                
                <div style={{ width: '280px', padding: 'var(--spacing-6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-800)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <Skeleton height={140} style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={16} width="100%" />
                    <Skeleton height={16} width="60%" />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Example */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Profile Loading State</h3>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', padding: 'var(--spacing-6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-800)' }}>
                <Skeleton variant="circle" width={56} height={56} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', flex: 1 }}>
                  <Skeleton height={20} width={200} />
                  <Skeleton height={16} width={140} />
                </div>
              </div>
            </div>

          </div>
        </PageCard>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="All CSS variables used in this component">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          <TokenCard
            label="Color"
            token="--muted"
            value="#262626"
            color="var(--muted)"
            onClick={() => handleTokenClick('--muted')}
            isHighlighted={highlightedToken === '--muted'}
          />
          <TokenCard
            label="Radius"
            token="--radius-md"
            value="8px"
            isRadius
            onClick={() => handleTokenClick('--radius-md')}
            isHighlighted={highlightedToken === '--radius-md'}
          />
        </div>
      </PageSection>

      {/* Code Examples */}
      <PageSection title="Code Examples" description="Copy and paste the code below">
        <CollapsibleCodeBlock code={jsxCode} language="tsx" />
      </PageSection>

      {/* Accessibility */}
      <PageSection title="Accessibility" description="WCAG 2.1 Level AA compliant">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-2)', color: 'var(--foreground)' }}>
                  Best Practices
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                  <li>Mark as decorative if purely visual using <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>aria-hidden="true"</code> if needed</li>
                  <li>Use <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>aria-busy="true"</code> on the container to indicate loading state to screen readers</li>
                </ul>
              </div>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

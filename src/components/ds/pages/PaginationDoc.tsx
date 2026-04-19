import React from 'react';
import { Copy, Check, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function PaginationDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showAdvancedTokens, setShowAdvancedTokens] = React.useState(false);

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

  const coreTokens = [
    { name: 'Button Background', token: '--surface-700', value: 'rgba(68, 68, 68, 1.00)', category: 'Color' },
    { name: 'Active Background', token: '--accent', value: 'rgba(255, 190, 26, 1.00)', category: 'Color' },
    { name: 'Text Color', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Border Color', token: '--border', value: 'rgba(43, 43, 43, 1.00)', category: 'Color' },
    { name: 'Border Radius', token: '--radius-md', value: '8px', category: 'Border' },
  ];

  const advancedTokens = [
    { name: 'Font Family', token: 'Inter Tight', value: 'Inter Tight, sans-serif', category: 'Typography' },
    { name: 'Font Weight', token: '--font-weight-medium', value: '500', category: 'Typography' },
    { name: 'Font Size', token: '--text-sm', value: '14px', category: 'Typography' },
    { name: 'Button Gap', token: '--spacing-1', value: '4px', category: 'Spacing' },
    { name: 'Transition Duration', token: '--motion-duration-normal', value: '120ms', category: 'Motion' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens, ...advancedTokens] : coreTokens;

  const codeExample = `import { Pagination } from '@/components/design-system/components';
import { useState } from 'react';

export function PaginationDemo() {
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={10}
      onPageChange={setCurrentPage}
    />
  );
}`;

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
        badge="Navigation Component"
        title="Pagination"
        description="Navigate through multiple pages of content. Displays page numbers with previous/next controls and handles large page counts elegantly."
        actions={headerActions}
      />

      {/* Interactive Example */}
      <PageSection title="Interactive Example" description="Test the pagination component">
        <PageCard>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{ 
              padding: 'var(--spacing-8)', 
              background: 'var(--muted)', 
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px'
            }}>
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
              />
            </div>
            <div style={{ 
              marginTop: 'var(--spacing-4)', 
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)'
            }}>
              Current Page: {currentPage} of 10
            </div>
          </div>

          <CollapsibleCodeBlock
            code={codeExample}
            language="tsx"
            filename="PaginationDemo.tsx"
            showLineNumbers
          />
        </PageCard>
      </PageSection>

      {/* Variants */}
      <PageSection title="Variants" description="Different pagination configurations">
        <PageGrid columns={1}>
          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Few Pages
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Shows all pages when total is small
              </p>
              <div style={{ padding: 'var(--spacing-5)', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center' }}>
                <Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Many Pages
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Shows ellipsis for large page counts
              </p>
              <div style={{ padding: 'var(--spacing-5)', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center' }}>
                <Pagination currentPage={15} totalPages={50} onPageChange={() => {}} />
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                First Page
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Previous button disabled on first page
              </p>
              <div style={{ padding: 'var(--spacing-5)', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center' }}>
                <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Last Page
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
                Next button disabled on last page
              </p>
              <div style={{ padding: 'var(--spacing-5)', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center' }}>
                <Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Design Tokens */}
      <PageSection title="Design Tokens" description="CSS variables used by this component">
        <PageCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
              {showAdvancedTokens ? 'Showing all tokens' : 'Showing core tokens only'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedTokens(!showAdvancedTokens)}
            >
              {showAdvancedTokens ? 'Show Less' : 'Show All'}
            </Button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-3)' }}>
            {allTokens.map((token, index) => (
              <TokenCard
                key={index}
                name={token.name}
                token={token.token}
                value={token.value}
                category={token.category}
                highlighted={highlightedToken === token.token}
                onClick={() => handleTokenClick(token.token)}
              />
            ))}
          </div>
        </PageCard>
      </PageSection>

      {/* Accessibility */}
      <PageSection title="Accessibility" description="Built-in accessibility features">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Keyboard Navigation
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                All page buttons are keyboard accessible with Tab navigation and Enter/Space activation.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                ARIA Labels
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Uses <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>aria-label</code> for "Previous" and "Next" buttons.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Current Page Indicator
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Active page uses <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>aria-current="page"</code> for screen readers.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                Disabled States
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Previous/Next buttons are properly disabled at boundaries with <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>aria-disabled</code>.
              </p>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

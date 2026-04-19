import React from 'react';
import { Copy, Check, ExternalLink, Info } from 'lucide-react';
import { Logo } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { copyToClipboard } from '../../../utils/clipboard';

export function LogoSystemDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

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
      <PageHeader badge="Branding Guidelines" title="Logo System" description="Brand guidelines and usage rules for the logo system." actions={headerActions} />
      
      <PageSection title="Logo Usage Guidelines">
        <PageGrid columns={2}>
          <PageCard>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: 'var(--radius-full)', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={16} style={{ color: 'var(--success-foreground)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                  Do
                </h3>
                <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, paddingLeft: 'var(--spacing-4)' }}>
                  <li>Use official logo files</li>
                  <li>Maintain clear space around logo</li>
                  <li>Use approved color variants</li>
                  <li>Ensure minimum size requirements</li>
                </ul>
              </div>
            </div>
          </PageCard>

          <PageCard>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: 'var(--radius-full)', background: 'var(--destructive)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Info size={16} style={{ color: 'var(--destructive-foreground)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
                  Don't
                </h3>
                <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, paddingLeft: 'var(--spacing-4)' }}>
                  <li>Distort or stretch the logo</li>
                  <li>Change logo colors</li>
                  <li>Add effects or shadows</li>
                  <li>Rotate or skew the logo</li>
                </ul>
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      <PageSection title="Clear Space">
        <PageCard>
          <div style={{ padding: 'var(--spacing-6)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <Logo size="l" />
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-4)' }}>
              Maintain minimum clear space equal to the height of the logo on all sides
            </p>
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Minimum Sizes">
        <PageCard>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
            <p style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong style={{ color: 'var(--foreground)' }}>Digital:</strong> Minimum 32px height
            </p>
            <p>
              <strong style={{ color: 'var(--foreground)' }}>Print:</strong> Minimum 0.5 inches height
            </p>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
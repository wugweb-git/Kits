import React from 'react';
import { Copy, Check, ExternalLink, Heart, Star, Home, Search, Settings, User, Mail, Bell, Trash2, Edit, Download } from 'lucide-react';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function IconDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const code = `import { Heart, Star, Home, Settings } from 'lucide-react';

// Default size (24px)
<Heart />

// Custom size
<Heart size={16} />

// With color
<Heart size={20} style={{ color: 'var(--accent)' }} />`;

  const icons = [
    { Icon: Heart, name: 'Heart' },
    { Icon: Star, name: 'Star' },
    { Icon: Home, name: 'Home' },
    { Icon: Search, name: 'Search' },
    { Icon: Settings, name: 'Settings' },
    { Icon: User, name: 'User' },
    { Icon: Mail, name: 'Mail' },
    { Icon: Bell, name: 'Bell' },
    { Icon: Trash2, name: 'Trash' },
    { Icon: Edit, name: 'Edit' },
    { Icon: Download, name: 'Download' },
    { Icon: ExternalLink, name: 'Link' },
  ];

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
      <PageHeader badge="Assets" title="Icons" description="Icon library powered by Lucide React. Consistent, accessible SVG icons." actions={headerActions} />
      
      <PageSection title="Common Icons" description="Frequently used icons">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
            {icons.map(({ Icon, name }) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-3)', background: 'var(--muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <Icon size={24} style={{ color: 'var(--foreground)' }} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{name}</span>
              </div>
            ))}
          </div>
          <CollapsibleCodeBlock code={code} language="tsx" filename="IconsDemo.tsx" />
        </PageCard>
      </PageSection>

      <PageSection title="Sizes">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <Heart size={16} />
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-1)' }}>16px</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Heart size={20} />
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-1)' }}>20px</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Heart size={24} />
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-1)' }}>24px</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Heart size={32} />
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-1)' }}>32px</div>
            </div>
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Usage">
        <PageCard>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              All icons come from <code style={{ padding: '2px 6px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>lucide-react</code> library. 
              Import only the icons you need for optimal bundle size.
            </p>
            <p>
              Browse all available icons at <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>lucide.dev/icons</a>
            </p>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

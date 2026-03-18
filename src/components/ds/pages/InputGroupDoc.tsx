import React from 'react';
import { Check, Copy, ExternalLink, Search, Mail, Lock, User, Globe } from 'lucide-react';
import { InputGroup } from '../../wugweb/InputGroup';
import { Input } from '../../wugweb/Input';
import { Button } from '../../wugweb/Button';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function InputGroupDoc() {
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

  const code = `import { InputGroup } from "@/components/wugweb/InputGroup";
import { Input } from "@/components/wugweb/Input";
import { Search, Mail } from "lucide-react";

// Left icon
<InputGroup leftIcon={Search}>
  <Input placeholder="Search..." />
</InputGroup>

// Right element (button)
<InputGroup rightElement={<Button size="sm">Subscribe</Button>}>
  <Input placeholder="Enter your email" type="email" />
</InputGroup>

// Both sides
<InputGroup leftIcon={Mail} rightElement={<Button size="sm">Send</Button>}>
  <Input placeholder="recipient@example.com" />
</InputGroup>`;

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

  const examples = [
    {
      label: 'Search with icon',
      component: (
        <InputGroup leftIcon={Search}>
          <Input placeholder="Search components..." />
        </InputGroup>
      ),
    },
    {
      label: 'Email with button',
      component: (
        <InputGroup rightElement={<Button size="sm">Subscribe</Button>}>
          <Input placeholder="Enter your email" type="email" />
        </InputGroup>
      ),
    },
    {
      label: 'URL with prefix',
      component: (
        <InputGroup leftElement={<span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', padding: '0 var(--spacing-3)', whiteSpace: 'nowrap' }}>https://</span>}>
          <Input placeholder="your-domain.com" />
        </InputGroup>
      ),
    },
    {
      label: 'Password with icon',
      component: (
        <InputGroup leftIcon={Lock}>
          <Input placeholder="Enter password" type="password" />
        </InputGroup>
      ),
    },
    {
      label: 'Username with prefix text',
      component: (
        <InputGroup leftElement={<span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', padding: '0 var(--spacing-3)' }}>@</span>}>
          <Input placeholder="username" />
        </InputGroup>
      ),
    },
    {
      label: 'Full search bar',
      component: (
        <InputGroup leftIcon={Search} rightElement={<Button size="sm">Search</Button>}>
          <Input placeholder="Search the entire site..." />
        </InputGroup>
      ),
    },
  ];

  return (
    <PageWrapper>
      <PageHeader
        badge="Layout Component"
        title="Input Group"
        description="A wrapper that attaches icons, text prefixes, or button elements to an Input field, creating visually connected input compositions without extra CSS."
        actions={headerActions}
      />

      <PageSection title="Examples" description="Common input group patterns">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
            {examples.map((ex, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{ex.label}</label>
                {ex.component}
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Code Reference" description="Copy-paste examples for all patterns">
        <PageCard>
          <CollapsibleCodeBlock code={code} language="tsx" showLineNumbers />
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--input-background" label="Input Background" value="rgba(28, 28, 28, 1.00)" category="color" onClick={() => handleTokenClick('--input-background')} isHighlighted={highlightedToken === '--input-background'} />
          <TokenCard token="--border" label="Group Border" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--muted" label="Adornment Background" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--muted-foreground" label="Icon / Prefix Color" value="rgba(161, 161, 161, 1.00)" category="color" onClick={() => handleTokenClick('--muted-foreground')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard token="--radius-md" label="Group Radius" value="8px" category="radius" onClick={() => handleTokenClick('--radius-md')} isHighlighted={highlightedToken === '--radius-md'} />
          <TokenCard token="--ring" label="Focus Ring" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--ring')} isHighlighted={highlightedToken === '--ring'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

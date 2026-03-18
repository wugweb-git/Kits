import React from 'react';
import { Check, Copy, ArrowRight, BookOpen, Layers, Palette, Zap, Code2, Star } from 'lucide-react';
import { Button } from '../../wugweb/Button';
import { Badge } from '../../wugweb/Badge';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function GettingStartedDoc() {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
  };

  const principles = [
    {
      icon: Palette,
      title: 'CSS Variables First',
      description: 'Every visual property — color, spacing, radius, typography — is a CSS variable. Change your brand in one place and every component updates.',
    },
    {
      icon: Layers,
      title: 'Source, Not Package',
      description: 'You copy the source files. No npm package, no version lock-in, no black box. Own your components completely.',
    },
    {
      icon: Code2,
      title: '8pt Grid System',
      description: 'All spacing follows a strict 4/8pt grid. --spacing-1 is 4px, --spacing-2 is 8px. Consistent by design, not by accident.',
    },
    {
      icon: Zap,
      title: 'Zero Runtime CSS-in-JS',
      description: 'Pure CSS variables and Tailwind classes. No styled-components, no emotion, no runtime style computation.',
    },
  ];

  const anatomy = `// Every Wugweb component follows this pattern:
import React from 'react';

// 1. Explicit TypeScript interface — always documented
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

// 2. Inline styles using CSS variables — not hardcoded values
export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      style={{
        background: 'var(--primary)',        // ← token, not #fff
        color: 'var(--primary-foreground)',  // ← token, not #121212
        borderRadius: 'var(--radius-md)',    // ← token, not 8px
        padding: 'var(--spacing-2) var(--spacing-6)',
        fontFamily: 'Inter Tight, sans-serif',
      }}
      {...props}
    />
  );
}`;

  const tokenUsage = `/* The contract between design and code */

/* ❌ WRONG — hardcoded value, breaks theming */
button { background: #FFBE1A; }

/* ✅ CORRECT — uses design token */
button { background: var(--accent); }

/* When you update the token, everything updates */
:root {
  --accent: rgba(59, 130, 246, 1.00); /* switch to blue */
}`;

  const quickStartCode = `import { Button } from "@/components/wugweb/Button";
import { Input } from "@/components/wugweb/Input";
import { Badge } from "@/components/wugweb/Badge";
import { Card } from "@/components/wugweb/Card";

export default function MyFirstComponent() {
  const [email, setEmail] = React.useState('');

  return (
    <Card style={{ padding: 'var(--spacing-8)', maxWidth: '400px' }}>
      <h2 style={{ 
        color: 'var(--foreground)', 
        fontFamily: 'Inter Tight, sans-serif',
        marginBottom: 'var(--spacing-2)'
      }}>
        Join the waitlist
        <Badge style={{ marginLeft: 'var(--spacing-2)' }}>Beta</Badge>
      </h2>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        type="email"
      />
      <Button
        style={{ marginTop: 'var(--spacing-4)', width: '100%' }}
        onClick={() => console.log(email)}
      >
        Get early access
      </Button>
    </Card>
  );
}`;

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader
        badge="Getting Started"
        title="Introduction"
        description="Wugweb Kits is a 127-component design system built around a single contract: all styling flows through CSS variables. Change a token, change everything. No exceptions."
        actions={headerActions}
      />

      {/* Core principles */}
      <PageSection title="Core Principles" description="The rules that every component in Wugweb follows">
        <PageGrid cols={2}>
          {principles.map((p, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <p.icon size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{p.title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{p.description}</p>
            </div>
          ))}
        </PageGrid>
      </PageSection>

      {/* The CSS Variable Contract */}
      <PageSection title="The CSS Variable Contract" description="How Wugweb enforces design token consistency">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.7 }}>
              Every component in Wugweb uses <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>var(--token-name)</code> for every visual property. 
              This creates a contract between design and code — updating <code style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>--accent</code> in your CSS
              updates every button, link, badge, and interactive element simultaneously.
            </p>
            <CollapsibleCodeBlock code={tokenUsage} language="css" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      {/* Component anatomy */}
      <PageSection title="Component Anatomy" description="How every Wugweb component is structured">
        <PageCard>
          <CollapsibleCodeBlock code={anatomy} language="tsx" showLineNumbers />
        </PageCard>
      </PageSection>

      {/* Quick start */}
      <PageSection title="Your First Component" description="Copy this and you're running in 60 seconds">
        <PageCard>
          <CollapsibleCodeBlock code={quickStartCode} language="tsx" showLineNumbers />
        </PageCard>
      </PageSection>

      {/* What's included */}
      <PageSection title="What's Included" description="A complete overview of the Wugweb Kits design system">
        <PageGrid cols={3}>
          {[
            { icon: '🎨', count: '55', label: 'Color Tokens', desc: 'Light/dark surfaces, accent, semantic colors' },
            { icon: '📦', count: '127+', label: 'Components', desc: 'Form controls, layout, navigation, feedback' },
            { icon: '📐', count: '92', label: 'Button Variants', desc: 'Every state, size, and combination' },
            { icon: '✏️', count: '48', label: 'Typography Tokens', desc: 'Font size, weight, line height scale' },
            { icon: '📏', count: '11', label: 'Spacing Tokens', desc: '4pt grid from 4px to 48px' },
            { icon: '🔷', count: '10', label: 'Radius Tokens', desc: 'From 0px to 9999px (full)' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <span style={{ fontSize: 'var(--text-lg)' }}>{item.icon}</span>
                <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: 'Inter Tight, sans-serif' }}>{item.count}</span>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{item.desc}</p>
            </div>
          ))}
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

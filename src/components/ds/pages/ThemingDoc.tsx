import React from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../../design-system/components';
import { Badge } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

export function ThemingDoc() {
  const [activeTheme, setActiveTheme] = React.useState<'dark' | 'ocean' | 'forest' | 'rose'>('dark');
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

  const themes = {
    dark: {
      label: 'Dark (Default)',
      accent: 'rgba(255, 190, 26, 1.00)',
      bg: 'rgba(18, 18, 18, 1.00)',
      surface: 'rgba(28, 28, 28, 1.00)',
      border: 'rgba(43, 43, 43, 1.00)',
    },
    ocean: {
      label: 'Ocean',
      accent: 'rgba(56, 189, 248, 1.00)',
      bg: 'rgba(12, 20, 33, 1.00)',
      surface: 'rgba(20, 30, 50, 1.00)',
      border: 'rgba(30, 50, 80, 1.00)',
    },
    forest: {
      label: 'Forest',
      accent: 'rgba(74, 222, 128, 1.00)',
      bg: 'rgba(10, 20, 15, 1.00)',
      surface: 'rgba(18, 32, 22, 1.00)',
      border: 'rgba(30, 55, 38, 1.00)',
    },
    rose: {
      label: 'Rose',
      accent: 'rgba(251, 113, 133, 1.00)',
      bg: 'rgba(24, 10, 14, 1.00)',
      surface: 'rgba(38, 16, 22, 1.00)',
      border: 'rgba(60, 25, 35, 1.00)',
    },
  };

  const currentTheme = themes[activeTheme];

  const customThemeCode = `/* Custom theme override in globals.css */
:root {
  /* === BRAND ACCENT ===
   * Your primary highlight color. Used on buttons, links,
   * focus rings, active states, and chart highlights.
   */
  --accent: rgba(56, 189, 248, 1.00);          /* Sky blue */
  --accent-foreground: rgba(10, 15, 25, 1.00); /* Text on accent */
  --accent-subtle: rgba(56, 189, 248, 0.10);   /* Subtle bg for accent areas */
  --ring: rgba(56, 189, 248, 1.00);            /* Focus rings */

  /* === SURFACES ===
   * Dark UI uses layered surfaces instead of light/shadow.
   */
  --background: rgba(12, 20, 33, 1.00);        /* Page background */
  --card: rgba(20, 30, 50, 1.00);             /* Cards, modals */
  --popover: rgba(24, 36, 58, 1.00);          /* Dropdowns, tooltips */
  --muted: rgba(28, 44, 72, 1.00);            /* Muted areas, hover */
  --border: rgba(30, 50, 80, 1.00);           /* All borders */

  /* === TEXT ===
   * These should contrast against your surface tokens.
   */
  --foreground: rgba(240, 249, 255, 1.00);     /* Primary text */
  --muted-foreground: rgba(125, 175, 210, 1.00); /* Secondary text */

  /* === TYPOGRAPHY ===
   * Only use fonts defined in your CSS @import.
   */
  /* font-family is set on <body> in your CSS */
}

body {
  font-family: 'Inter Tight', sans-serif;
  background: var(--background);
  color: var(--foreground);
}`;

  const tokenGroupsCode = `/* ============================================
 * FULL TOKEN REFERENCE — Copy-paste into globals.css
 * ============================================ */

:root {
  /* --- Colors --- */
  --accent: rgba(255, 190, 26, 1.00);
  --accent-foreground: rgba(18, 18, 18, 1.00);
  --accent-subtle: rgba(255, 190, 26, 0.10);

  --primary: rgba(255, 255, 255, 1.00);
  --primary-foreground: rgba(18, 18, 18, 1.00);

  --destructive: rgba(239, 67, 67, 1.00);
  --destructive-foreground: rgba(255, 255, 255, 1.00);
  --destructive-subtle: rgba(239, 67, 67, 0.10);

  --success: rgba(34, 197, 94, 1.00);
  --success-foreground: rgba(255, 255, 255, 1.00);
  --success-subtle: rgba(34, 197, 94, 0.10);

  /* --- Radius (4 × n) --- */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* --- Spacing (4pt grid) --- */
  --spacing-1: 4px;   /* 4px */
  --spacing-2: 8px;   /* 8px */
  --spacing-3: 12px;  /* 12px */
  --spacing-4: 16px;  /* 16px */
  --spacing-6: 24px;  /* 24px */
  --spacing-8: 32px;  /* 32px */
  --spacing-12: 48px; /* 48px */

  /* --- Typography --- */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.25rem;    /* 20px */
  --text-xl: 1.5rem;     /* 24px */
  --text-2xl: 2.25rem;   /* 36px */

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* --- Motion --- */
  --motion-duration-fast: 80ms;
  --motion-duration-normal: 120ms;
  --motion-duration-slow: 200ms;
  --motion-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
}`;

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
      <Button onClick={copyPageLink} variant="outline" size="sm" style={{ gap: 'var(--spacing-2)' }}>
        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
        {copiedLink ? 'Copied!' : 'Copy Link'}
      </Button>
    </div>
  );

  const tokenGroups = [
    {
      title: 'Brand Tokens',
      desc: 'Start here for branding. These cascade through every component.',
      tokens: ['--accent', '--accent-foreground', '--accent-subtle', '--ring', '--primary', '--primary-foreground'],
    },
    {
      title: 'Surface Tokens',
      desc: 'Layered dark surfaces create visual hierarchy without shadows.',
      tokens: ['--background', '--card', '--popover', '--muted', '--border', '--input-background'],
    },
    {
      title: 'Text Tokens',
      desc: 'Four text colors for primary, secondary, tertiary, and placeholder.',
      tokens: ['--foreground', '--muted-foreground', '--text-secondary', '--text-tertiary'],
    },
    {
      title: 'Semantic Tokens',
      desc: 'Status colors for success, error, and warning states.',
      tokens: ['--success', '--destructive', '--accent (warning)'],
    },
  ];

  return (
    <PageWrapper>
      <PageHeader
        badge="Getting Started"
        title="Theming"
        description="Wugweb Kits uses a single CSS variables file as the design token contract. Override any variable in your project's globals.css and every component updates automatically."
        actions={headerActions}
      />

      {/* Theme preview */}
      <PageSection title="Theme Presets" description="See how the system looks with different accent and surface palettes">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            {(Object.keys(themes) as Array<keyof typeof themes>).map(key => (
              <Button key={key} variant={activeTheme === key ? 'default' : 'outline'} size="sm" onClick={() => setActiveTheme(key)}>
                {themes[key].label}
              </Button>
            ))}
          </div>

          {/* Live theme preview card */}
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: `1px solid ${currentTheme.border}`,
            background: currentTheme.bg,
            padding: 'var(--spacing-8)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-6)',
            transition: 'all var(--motion-duration-slow) var(--motion-easing-standard)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: currentTheme.accent }} />
              <div>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter Tight, sans-serif' }}>{currentTheme.label} Theme</p>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>--accent: {currentTheme.accent}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
              <div style={{ height: 36, minWidth: 100, borderRadius: 'var(--radius-md)', background: currentTheme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 var(--spacing-4)' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'rgba(0,0,0,0.85)', fontFamily: 'Inter Tight, sans-serif' }}>Primary Button</span>
              </div>
              <div style={{ height: 36, minWidth: 100, borderRadius: 'var(--radius-md)', border: `1px solid ${currentTheme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 var(--spacing-4)' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter Tight, sans-serif' }}>Outline Button</span>
              </div>
              <div style={{ height: 36, padding: '0 var(--spacing-3)', borderRadius: 'var(--radius-full)', background: `${currentTheme.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: currentTheme.accent, fontFamily: 'Inter Tight, sans-serif' }}>Badge</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-2)' }}>
              {[currentTheme.bg, currentTheme.surface, currentTheme.border, currentTheme.accent].map((color, i) => (
                <div key={i} style={{ height: 32, borderRadius: 'var(--radius-sm)', background: color, border: `1px solid ${currentTheme.border}` }} />
              ))}
            </div>
          </div>
        </PageCard>
      </PageSection>

      {/* How to create a custom theme */}
      <PageSection title="Creating a Custom Theme" description="Override tokens in your globals.css to change the entire system">
        <PageCard>
          <CollapsibleCodeBlock code={customThemeCode} language="css" showLineNumbers />
        </PageCard>
      </PageSection>

      {/* Token groups */}
      <PageSection title="Token Groups" description="Tokens are organized into functional groups for easier targeting">
        <PageGrid cols={2}>
          {tokenGroups.map((group, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{group.title}</h4>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{group.desc}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {group.tokens.map((token, j) => (
                  <code key={j} style={{ fontSize: 'var(--text-xs)', background: 'var(--muted)', color: 'var(--accent)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>{token}</code>
                ))}
              </div>
            </div>
          ))}
        </PageGrid>
      </PageSection>

      {/* Full token reference */}
      <PageSection title="Full Token Reference" description="All available CSS variables — copy into globals.css and customize freely">
        <PageCard>
          <CollapsibleCodeBlock code={tokenGroupsCode} language="css" showLineNumbers />
        </PageCard>
      </PageSection>

      {/* Important rules */}
      <PageSection title="Theming Rules">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>What you must always do</h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6)', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li style={{ fontSize: 'var(--text-sm)' }}>Use <code style={{ background: 'var(--muted)', padding: '1px 5px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>var(--token)</code> for all colors — never hardcode hex or rgba values in component styles</li>
              <li style={{ fontSize: 'var(--text-sm)' }}>Use <code style={{ background: 'var(--muted)', padding: '1px 5px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>var(--spacing-n)</code> for all padding and gap — maintain the 4pt grid</li>
              <li style={{ fontSize: 'var(--text-sm)' }}>Use <code style={{ background: 'var(--muted)', padding: '1px 5px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>var(--radius-sm/md/lg)</code> for border-radius — not arbitrary pixel values</li>
              <li style={{ fontSize: 'var(--text-sm)' }}>Only use font faces defined in your CSS <code style={{ background: 'var(--muted)', padding: '1px 5px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>@import</code> — Inter Tight by default</li>
              <li style={{ fontSize: 'var(--text-sm)' }}>Set both a color AND its foreground counterpart (e.g. <code style={{ background: 'var(--muted)', padding: '1px 5px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>--accent</code> + <code style={{ background: 'var(--muted)', padding: '1px 5px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>--accent-foreground</code>)</li>
            </ul>
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

import React from 'react';
import { Check, Copy, Terminal, Package, FolderOpen, Code2, Zap } from 'lucide-react';
import { Button } from '../../wugweb/Button';
import { Clipboard } from '../../wugweb/Clipboard';
import { Stepper } from '../../wugweb/Stepper';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

const installSteps = [
  { id: 'copy', title: 'Copy components', description: 'Add wugweb components to your project' },
  { id: 'css', title: 'Add CSS variables', description: 'Configure your design tokens' },
  { id: 'import', title: 'Import & use', description: 'Import components in your app' },
  { id: 'customize', title: 'Customize tokens', description: 'Make it yours' },
];

export function InstallationDoc() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
  };

  const codeSnippets = {
    npmInstall: `# Copy the wugweb components directory into your project
cp -r /path/to/wugweb/components/wugweb ./components/wugweb`,

    peerDeps: `# Install peer dependencies
npm install lucide-react recharts
npm install clsx tailwind-merge`,

    cssImport: `/* Add to your global CSS file (e.g., globals.css) */
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap');

:root {
  /* Typography */
  --font-size: 16px;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;

  /* Colors */
  --background: rgba(18, 18, 18, 1.00);
  --foreground: rgba(255, 255, 255, 1.00);
  --accent: rgba(255, 190, 26, 1.00);
  --accent-foreground: rgba(18, 18, 18, 1.00);
  --border: rgba(43, 43, 43, 1.00);
  --muted: rgba(38, 38, 38, 1.00);
  --muted-foreground: rgba(161, 161, 161, 1.00);

  /* Spacing (4pt grid) */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}`,

    usage: `// Import any component directly from the wugweb directory
import { Button } from "@/components/wugweb/Button";
import { Input } from "@/components/wugweb/Input";
import { Badge } from "@/components/wugweb/Badge";

export function MyPage() {
  return (
    <div>
      <Input placeholder="Search..." />
      <Button variant="primary">Submit</Button>
      <Badge>New</Badge>
    </div>
  );
}`,

    customize: `/* Override any token in your globals.css to match your brand */
:root {
  /* Change the accent color from yellow to blue */
  --accent: rgba(59, 130, 246, 1.00);
  --accent-foreground: rgba(255, 255, 255, 1.00);
  --ring: rgba(59, 130, 246, 1.00);

  /* Update border radius for a sharper or softer feel */
  --radius-md: 4px;   /* sharp */
  /* --radius-md: 16px; */ /* very rounded */

  /* Switch to a different font */
  /* font-family is set on body — change it there */
}

body {
  font-family: 'Your Custom Font', sans-serif;
}`,
  };

  const requirements = [
    { name: 'React', version: '18+', required: true },
    { name: 'TypeScript', version: '5+', required: false },
    { name: 'Tailwind CSS', version: '4+', required: true },
    { name: 'lucide-react', version: 'any', required: true },
    { name: 'recharts', version: '2+', required: false, note: 'Chart components only' },
  ];

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
        title="Installation"
        description="Wugweb Kits is a source-first design system. You copy the components into your project — no package manager, no version lock-in, no black box. Your code, your control."
        actions={headerActions}
      />

      {/* Step tracker */}
      <PageSection title="Installation Steps" description="Follow these four steps to get Wugweb Kits running in your project">
        <PageCard>
          <Stepper steps={installSteps} currentStep={currentStep} orientation="horizontal" onStepClick={setCurrentStep} />
          <div style={{ marginTop: 'var(--spacing-8)', display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outline" onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}>Previous</Button>
            <Button onClick={() => setCurrentStep(s => Math.min(installSteps.length - 1, s + 1))} disabled={currentStep === installSteps.length - 1}>Next Step</Button>
          </div>
        </PageCard>
      </PageSection>

      {/* Step 1 */}
      <PageSection
        title="Step 1 — Copy Component Files"
        description="Wugweb ships as source files. Copy the /components/wugweb directory into your project."
      >
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
              {[
                { icon: FolderOpen, label: '/components/wugweb/', desc: '127+ component files' },
                { icon: Package, label: 'peer dependencies', desc: 'lucide-react, recharts' },
              ].map((item, i) => (
                <div key={i} style={{ flex: '1 1 200px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <item.icon size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'monospace' }}>{item.label}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <CollapsibleCodeBlock code={codeSnippets.npmInstall} language="bash" showLineNumbers />
            <CollapsibleCodeBlock code={codeSnippets.peerDeps} language="bash" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      {/* Step 2 */}
      <PageSection
        title="Step 2 — Add CSS Variables"
        description="Copy the design tokens into your global CSS file. All components read from these variables."
      >
        <PageCard>
          <CollapsibleCodeBlock code={codeSnippets.cssImport} language="css" showLineNumbers />
        </PageCard>
      </PageSection>

      {/* Step 3 */}
      <PageSection
        title="Step 3 — Import & Use"
        description="Components are directly importable with no registration or plugin required."
      >
        <PageCard>
          <CollapsibleCodeBlock code={codeSnippets.usage} language="tsx" showLineNumbers />
        </PageCard>
      </PageSection>

      {/* Step 4 */}
      <PageSection
        title="Step 4 — Customize Tokens"
        description="Override any CSS variable to match your brand. No config files, no build step — just CSS."
      >
        <PageCard>
          <CollapsibleCodeBlock code={codeSnippets.customize} language="css" showLineNumbers />
        </PageCard>
      </PageSection>

      {/* Requirements */}
      <PageSection title="Requirements" description="Peer dependencies and framework compatibility">
        <PageCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {requirements.map((req, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-3)', borderBottom: i < requirements.length - 1 ? '1px solid var(--border)' : undefined, flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: req.required ? 'var(--accent)' : 'var(--muted-foreground)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'monospace' }}>{req.name}</span>
                  {req.note && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>— {req.note}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <code style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', background: 'var(--muted)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>{req.version}</code>
                  <span style={{ fontSize: 'var(--text-xs)', color: req.required ? 'var(--accent)' : 'var(--muted-foreground)' }}>{req.required ? 'Required' : 'Optional'}</span>
                </div>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}

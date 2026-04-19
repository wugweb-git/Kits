import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Stepper } from '../../design-system/components';
import { Button } from '../../design-system/components';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { copyToClipboard } from '../../../utils/clipboard';

const wizardSteps = [
  { id: 'account', title: 'Account', description: 'Create your account' },
  { id: 'profile', title: 'Profile', description: 'Set up your profile' },
  { id: 'preferences', title: 'Preferences', description: 'Choose your preferences' },
  { id: 'review', title: 'Review', description: 'Review and confirm' },
];

export function StepperDoc() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical'>('horizontal');
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

  const getDynamicCode = () => `import { Stepper } from "@/components/design-system/components";

const steps = [
  { id: "account", title: "Account", description: "Create your account" },
  { id: "profile", title: "Profile", description: "Set up your profile" },
  { id: "preferences", title: "Preferences", description: "Choose your preferences" },
  { id: "review", title: "Review", description: "Review and confirm" },
];

export function StepperDemo() {
  const [currentStep, setCurrentStep] = React.useState(0);

  return (
    <Stepper
      steps={steps}
      currentStep={currentStep}
      orientation="${orientation}"
      onStepClick={setCurrentStep}
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
        <ExternalLink size={16} />View in Figma
      </Button>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader
        badge="Navigation Component"
        title="Stepper"
        description="A step-by-step progress indicator for multi-step workflows like wizards, checkout flows, and onboarding. Supports horizontal and vertical orientations with clickable steps."
        actions={headerActions}
      />

      <PageSection title="Interactive Playground" description="Navigate through steps and change orientation">
        <PageCard>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Orientation</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {(['horizontal', 'vertical'] as const).map(o => (
                  <Button key={o} variant={orientation === o ? 'default' : 'outline'} size="sm" onClick={() => setOrientation(o)} style={{ textTransform: 'capitalize' }}>{o}</Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>Current Step</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {wizardSteps.map((_, i) => (
                  <Button key={i} variant={currentStep === i ? 'default' : 'outline'} size="sm" onClick={() => setCurrentStep(i)}>{i + 1}</Button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ padding: 'var(--spacing-8)', background: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
              <Stepper
                steps={wizardSteps}
                currentStep={currentStep}
                orientation={orientation}
                onStepClick={setCurrentStep}
              />
              {/* Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-8)', paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--border)' }}>
                <Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>Previous</Button>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', alignSelf: 'center' }}>
                  Step {currentStep + 1} of {wizardSteps.length}: <strong style={{ color: 'var(--foreground)' }}>{wizardSteps[currentStep].title}</strong>
                </span>
                <Button onClick={() => setCurrentStep(Math.min(wizardSteps.length - 1, currentStep + 1))} disabled={currentStep === wizardSteps.length - 1}>
                  {currentStep === wizardSteps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
            <CollapsibleCodeBlock code={getDynamicCode()} language="tsx" showLineNumbers />
          </div>
        </PageCard>
      </PageSection>

      <PageSection title="Design Tokens">
        <PageGrid cols={3}>
          <TokenCard token="--accent" label="Completed Step" value="rgba(255, 190, 26, 1.00)" category="color" onClick={() => handleTokenClick('--accent')} isHighlighted={highlightedToken === '--accent'} />
          <TokenCard token="--primary" label="Current Step" value="rgba(255, 255, 255, 1.00)" category="color" onClick={() => handleTokenClick('--primary')} isHighlighted={highlightedToken === '--primary'} />
          <TokenCard token="--muted" label="Inactive Step" value="rgba(38, 38, 38, 1.00)" category="color" onClick={() => handleTokenClick('--muted')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard token="--border" label="Connector Line" value="rgba(43, 43, 43, 1.00)" category="color" onClick={() => handleTokenClick('--border')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard token="--spacing-6" label="Step Spacing" value="24px" category="spacing" onClick={() => handleTokenClick('--spacing-6')} isHighlighted={highlightedToken === '--spacing-6'} />
          <TokenCard token="--radius-full" label="Step Circle" value="9999px" category="radius" onClick={() => handleTokenClick('--radius-full')} isHighlighted={highlightedToken === '--radius-full'} />
        </PageGrid>
      </PageSection>
    </PageWrapper>
  );
}

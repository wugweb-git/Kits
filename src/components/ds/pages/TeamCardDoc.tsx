import React from 'react';
import { TeamCard } from '../../wugweb/TeamCard';
import { CodeBlock } from '../components/CodeBlock';
import { AnatomyDiagram } from '../components/AnatomyDiagram';
import { SectionDivider } from '../components/SectionDivider';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { toast } from 'sonner@2.0.3';

export function TeamCardDoc() {
  const { isMobile, isTablet } = useBreakpoint();
  const [copiedStates, setCopiedStates] = React.useState<{ [key: string]: boolean }>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [id]: true });
    toast.success('Copied to clipboard!');
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [id]: false });
    }, 2000);
  };

  const reactCode = `import { TeamCard } from './components/wugweb/TeamCard';

function MyComponent() {
  return (
    <TeamCard
      name="Vedanshu Srivastava"
      role="Head of Design & Strategy"
      image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      onClick={() => console.log('Card clicked')}
    />
  );
}`;

  const propsCode = `interface TeamCardProps {
  name?: string;
  role?: string;
  image?: string;
  onClick?: () => void;
  className?: string;
}`;

  return (
    <div style={{
      fontFamily: 'Inter Tight, sans-serif',
      color: 'var(--foreground)',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? 'var(--spacing-4)' : 'var(--spacing-8)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h1 style={{
          fontSize: isMobile ? 'var(--text-2xl)' : 'var(--text-3xl)',
          fontWeight: 'var(--font-weight-bold)',
          marginBottom: 'var(--spacing-4)',
          color: 'var(--foreground)',
        }}>
          Team Card
        </h1>
        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--muted-foreground)',
          lineHeight: '1.6',
          margin: 0,
        }}>
          A component for displaying team member information with an image overlay and role description.
        </p>
      </div>

      <SectionDivider />

      {/* Preview Section */}
      <section style={{ marginBottom: 'var(--spacing-10)' }}>
        <h2 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-6)',
          color: 'var(--foreground)',
        }}>
          Preview
        </h2>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-6)',
          padding: 'var(--spacing-8)',
          background: 'var(--card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
        }}>
          <TeamCard
            name="Vedanshu Srivastava"
            role="Head of Design & Strategy"
            image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop"
            onClick={() => toast.success('Team card clicked!')}
          />

          <TeamCard
            name="Sarah Johnson"
            role="Senior Product Designer"
            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop"
            onClick={() => toast.success('Team card clicked!')}
          />

          <TeamCard
            name="Alex Chen"
            role="Lead Developer"
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
            onClick={() => toast.success('Team card clicked!')}
          />
        </div>
      </section>

      <SectionDivider />

      {/* Usage Section */}
      <section style={{ marginBottom: 'var(--spacing-10)' }}>
        <h2 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-6)',
          color: 'var(--foreground)',
        }}>
          Usage
        </h2>

        <CodeBlock
          code={reactCode}
          language="tsx"
          onCopy={() => handleCopy(reactCode, 'react')}
          copied={copiedStates['react']}
        />
      </section>

      <SectionDivider />

      {/* Anatomy Section */}
      <section style={{ marginBottom: 'var(--spacing-10)' }}>
        <h2 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-6)',
          color: 'var(--foreground)',
        }}>
          Anatomy
        </h2>

        <AnatomyDiagram
          parts={[
            { id: 1, label: 'Background Image', description: 'Team member photo' },
            { id: 2, label: 'Gradient Overlay', description: 'Ensures text readability' },
            { id: 3, label: 'Info Container', description: 'Dark background with blur effect' },
            { id: 4, label: 'Name', description: 'Team member name (semibold, 20px)' },
            { id: 5, label: 'Role', description: 'Job title or role (regular, 16px)' },
          ]}
        />
      </section>

      <SectionDivider />

      {/* Props Section */}
      <section style={{ marginBottom: 'var(--spacing-10)' }}>
        <h2 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-6)',
          color: 'var(--foreground)',
        }}>
          Props
        </h2>

        <CodeBlock
          code={propsCode}
          language="tsx"
          onCopy={() => handleCopy(propsCode, 'props')}
          copied={copiedStates['props']}
        />

        <div style={{ marginTop: 'var(--spacing-6)' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'var(--text-sm)',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', color: 'var(--foreground)' }}>Prop</th>
                <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', color: 'var(--foreground)' }}>Type</th>
                <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', color: 'var(--foreground)' }}>Default</th>
                <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', color: 'var(--foreground)' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>name</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>string</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>"Vedanshu Srivastava"</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Team member's name</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>role</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>string</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>"Head of Design & Strategy"</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Job title or role</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>image</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>string</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>undefined</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>URL to team member's photo</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>onClick</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>() =&gt; void</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>undefined</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Click handler</td>
              </tr>
              <tr>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>className</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>string</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>""</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <SectionDivider />

      {/* Accessibility Section */}
      <section style={{ marginBottom: 'var(--spacing-10)' }}>
        <h2 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-6)',
          color: 'var(--foreground)',
        }}>
          Accessibility
        </h2>

        <ul style={{
          fontSize: 'var(--text-base)',
          lineHeight: '1.8',
          color: 'var(--muted-foreground)',
          paddingLeft: 'var(--spacing-6)',
        }}>
          <li>The component includes proper role and tabIndex when clickable</li>
          <li>Image includes alt text with team member's name</li>
          <li>Gradient overlay ensures sufficient text contrast (WCAG AA compliant)</li>
          <li>Interactive cards have hover states and are keyboard accessible</li>
          <li>Touch targets meet minimum 44x44px requirement on mobile</li>
        </ul>
      </section>

      <SectionDivider />

      {/* Design Tokens Section */}
      <section>
        <h2 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-6)',
          color: 'var(--foreground)',
        }}>
          Design Tokens
        </h2>

        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: 'var(--spacing-6)',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'var(--text-sm)',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', color: 'var(--foreground)' }}>Property</th>
                <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', color: 'var(--foreground)' }}>Token</th>
                <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', color: 'var(--foreground)' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Border Radius</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>--radius-md</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>8px</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Name Font Size</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>--text-lg</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>20px</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Role Font Size</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>--text-base</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>16px</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Padding</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>--spacing-2</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>8px</td>
              </tr>
              <tr>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Text Color</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>--foreground</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>rgba(255, 255, 255, 1.00)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

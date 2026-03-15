import React from 'react';
import { TopicTile } from '../../wugweb/TopicTile';
import { CodeBlock } from '../components/CodeBlock';
import { AnatomyDiagram } from '../components/AnatomyDiagram';
import { SectionDivider } from '../components/SectionDivider';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard as safeCopyToClipboard } from '../../../utils/clipboard';

export function TopicTileDoc() {
  const { isMobile, isTablet } = useBreakpoint();
  const [copiedStates, setCopiedStates] = React.useState<{ [key: string]: boolean }>({});

  const handleCopy = async (text: string, id: string) => {
    const success = await safeCopyToClipboard(text);
    if (success) {
      setCopiedStates({ ...copiedStates, [id]: true });
      toast.success('Copied to clipboard!');
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [id]: false });
      }, 2000);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const reactCode = `import { TopicTile } from './components/wugweb/TopicTile';

function MyComponent() {
  return (
    <TopicTile
      title="Introduction to React"
      progress={75}
      status="in-progress"
      thumbnail="https://images.unsplash.com/photo-1633356122544-f134324a6cee"
      onClick={() => console.log('Topic clicked')}
    />
  );
}`;

  const propsCode = `interface TopicTileProps {
  title?: string;
  progress?: number;
  thumbnail?: string;
  status?: 'not-started' | 'in-progress' | 'completed';
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
          Topic Tile
        </h1>
        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--muted-foreground)',
          lineHeight: '1.6',
          margin: 0,
        }}>
          A card component for displaying learning topics or courses with progress tracking and status indicators.
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
          <TopicTile
            title="Advanced JavaScript Concepts"
            progress={80}
            status="in-progress"
            thumbnail="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop"
            onClick={() => toast.success('Topic clicked!')}
          />

          <TopicTile
            title="UI/UX Design Fundamentals"
            progress={0}
            status="not-started"
            thumbnail="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop"
            onClick={() => toast.success('Topic clicked!')}
          />

          <TopicTile
            title="React Best Practices"
            progress={100}
            status="completed"
            thumbnail="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=200&fit=crop"
            onClick={() => toast.success('Topic clicked!')}
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
            { id: 1, label: 'Background', description: 'Blurred thumbnail with overlay' },
            { id: 2, label: 'Thumbnail', description: 'Course or topic artwork' },
            { id: 3, label: 'Status Medal', description: 'Visual status indicator' },
            { id: 4, label: 'Title', description: 'Course or topic name' },
            { id: 5, label: 'Progress', description: 'Completion percentage or status text' },
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
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>title</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>string</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>"A Topic Name That Is Two Lines"</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Topic or course title</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>progress</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>number</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>80</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Completion percentage (0-100)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>thumbnail</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>string</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>undefined</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>URL to topic artwork</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>status</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>'not-started' | 'in-progress' | 'completed'</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>'in-progress'</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Current status of the topic</td>
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
          <li>Status medals use distinct colors (success, accent, neutral) for different states</li>
          <li>Progress text provides alternative status information</li>
          <li>Interactive tiles have role="button" and proper tabIndex</li>
          <li>Hover states provide visual feedback</li>
          <li>Text contrast meets WCAG AA standards</li>
          <li>Status icons supplement color with shape for colorblind users</li>
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
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>--radius-lg</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>12px</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Title Font Size</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>--text-lg</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>20px</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Progress Font Size</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>--text-sm</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>14px</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Success Color</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>--success</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>rgba(34, 197, 94, 1.00)</td>
              </tr>
              <tr>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>Accent Color</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--accent)' }}>--accent</td>
                <td style={{ padding: 'var(--spacing-3)', color: 'var(--muted-foreground)' }}>rgba(255, 190, 26, 1.00)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
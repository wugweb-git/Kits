import React from 'react';
import { Copy, Check, ChevronRight, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert } from '../../wugweb/Alert';
import { copyToClipboard as safeCopyToClipboard } from '../../../utils/clipboard';

export function AlertDoc() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [selectedTone, setSelectedTone] = React.useState<'info' | 'success' | 'warning' | 'error' | 'neutral'>('info');
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md'>('md');
  const [hasTitle, setHasTitle] = React.useState(true);
  const [isDismissible, setIsDismissible] = React.useState(true);
  const [showAdvancedTokens, setShowAdvancedTokens] = React.useState(false);
  const [expandedCodeBlocks, setExpandedCodeBlocks] = React.useState<{ [key: string]: boolean }>({
    react: true,
    html: false,
    css: false,
  });

  const copyToClipboard = async (code: string, id: string) => {
    const success = await safeCopyToClipboard(code);
    if (success) {
      setCopiedCode(id);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const toggleCodeBlock = (id: string) => {
    setExpandedCodeBlocks(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Get alert content based on tone
  const getAlertContent = () => {
    const contentMap = {
      info: {
        title: 'Information',
        description: 'This is an informational alert with important details you should know about.',
      },
      success: {
        title: 'Success',
        description: 'Your changes have been saved successfully and are now live.',
      },
      warning: {
        title: 'Warning',
        description: 'Please review the following information before proceeding with this action.',
      },
      error: {
        title: 'Error',
        description: 'An error occurred while processing your request. Please try again.',
      },
      neutral: {
        title: 'Notice',
        description: 'This is a neutral alert for general information and updates.',
      },
    };

    return contentMap[selectedTone];
  };

  const currentContent = getAlertContent();

  // Generate code examples
  const reactCode = `import { Alert } from './components/wugweb/Alert';

function MyComponent() {
  return (
    <Alert
      ${hasTitle ? `title="${currentContent.title}"` : ''}
      description="${currentContent.description}"
      tone="${selectedTone}"
      size="${selectedSize}"
      ${isDismissible ? 'dismissible' : ''}
      ${isDismissible ? 'onDismiss={() => console.log(\'Alert dismissed\')}' : ''}
    />
  );
}`;

  const htmlCode = `<div 
  role="alert" 
  aria-live="${selectedTone === 'error' ? 'assertive' : 'polite'}" 
  aria-atomic="true"
  class="alert alert-${selectedTone} alert-${selectedSize}"
>
  <div class="alert-icon">
    <svg><!-- ${selectedTone} icon --></svg>
  </div>
  <div class="alert-content">
    ${hasTitle ? `<div class="alert-title">${currentContent.title}</div>` : ''}
    <div class="alert-description">${currentContent.description}</div>
  </div>
  ${isDismissible ? '<button class="alert-dismiss" aria-label="Dismiss alert"><svg><!-- X icon --></svg></button>' : ''}
</div>`;

  const cssCode = `.alert {
  display: flex;
  align-items: flex-start;
  width: 100%;
  font-family: Inter Tight, sans-serif;
  border-radius: var(--radius-md);
  box-sizing: border-box;
  transition: opacity var(--motion-duration-slow) var(--motion-easing-standard),
              transform var(--motion-duration-slow) var(--motion-easing-standard);
}

/* Size variants */
.alert-sm {
  padding: var(--spacing-2);
  gap: var(--spacing-2);
}

.alert-md {
  padding: var(--spacing-3);
  gap: var(--spacing-3);
}

/* Tone variants */
.alert-info {
  background: var(--accent-subtle);
  border: 1px solid var(--accent);
}

.alert-info .alert-icon {
  color: var(--accent);
}

.alert-success {
  background: var(--success-subtle);
  border: 1px solid var(--success);
}

.alert-success .alert-icon {
  color: var(--success);
}

.alert-warning {
  background: rgba(255, 190, 26, 0.1);
  border: 1px solid var(--accent);
}

.alert-warning .alert-icon {
  color: var(--accent);
}

.alert-error {
  background: var(--destructive-subtle);
  border: 1px solid var(--destructive);
}

.alert-error .alert-icon {
  color: var(--destructive);
}

.alert-neutral {
  background: var(--surface-800);
  border: 1px solid var(--border);
}

.alert-neutral .alert-icon {
  color: var(--muted-foreground);
}

/* Content */
.alert-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.alert-title {
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
  word-wrap: break-word;
}

.alert-description {
  font-weight: var(--font-weight-regular);
  line-height: 1.6;
  word-wrap: break-word;
}

/* Dismiss button */
.alert-dismiss {
  flex-shrink: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--motion-duration-fast) var(--motion-easing-standard);
}

.alert-dismiss:hover {
  background: rgba(0, 0, 0, 0.1);
}

.alert-dismiss:focus-visible {
  box-shadow: var(--focus-ring-accent);
  outline: none;
}

/* Dismissing animation */
.alert-dismissing {
  opacity: 0;
  transform: translateY(-8px);
}`;

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    }}>
      <style>{`
        .alert-doc-root {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .alert-doc-card {
          background: var(--surface-800);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-6);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .alert-doc-card {
            padding: var(--spacing-4);
          }
        }

        @media (max-width: 480px) {
          .alert-doc-card {
            padding: var(--spacing-3);
          }
        }

        .alert-doc-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-4);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .alert-doc-grid-2 {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }
        }

        .alert-doc-grid-auto {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-4);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .alert-doc-grid-auto {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }
        }

        .alert-doc-token-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--spacing-3);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .alert-doc-token-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-2);
          }
        }

        @media (max-width: 480px) {
          .alert-doc-token-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-2);
          }
        }

        .anatomy-card {
          background: var(--surface-900);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: var(--spacing-5);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .anatomy-card {
            padding: var(--spacing-3);
            gap: var(--spacing-3);
          }
        }

        .alert-preview-wrapper {
          background: var(--surface-1000);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: var(--spacing-6);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .alert-preview-wrapper {
            padding: var(--spacing-4);
          }
        }

        @media (max-width: 480px) {
          .alert-preview-wrapper {
            padding: var(--spacing-3);
          }
        }

        .token-card-button {
          width: 100%;
          max-width: 100%;
          padding: var(--spacing-4);
          background: var(--surface-900);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--motion-duration-normal) var(--motion-easing-standard);
          text-align: left;
          box-sizing: border-box;
        }

        .token-card-button:hover {
          background: var(--surface-800);
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .token-card-button {
            padding: var(--spacing-3);
          }
        }

        @media (max-width: 375px) {
          .anatomy-card {
            padding: var(--spacing-2) !important;
          }

          .alert-preview-wrapper {
            padding: var(--spacing-2) !important;
          }

          .token-card-button {
            padding: var(--spacing-2) !important;
          }

          h1 {
            font-size: var(--text-lg) !important;
          }

          .alert-doc-card {
            padding: var(--spacing-2) !important;
          }
        }

        .alert-doc-root p,
        .alert-doc-root li,
        .alert-doc-root h1,
        .alert-doc-root h2,
        .alert-doc-root h3,
        .alert-doc-root span {
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        .alert-doc-root code {
          word-break: break-all;
          white-space: pre-wrap;
        }

        .control-button {
          padding: 8px 16px;
          font-size: var(--text-sm);
          font-family: Inter Tight, sans-serif;
          font-weight: var(--font-weight-medium);
          border: 1px solid;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--motion-duration-fast) var(--motion-easing-standard);
          white-space: nowrap;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .control-button {
            padding: 6px 12px;
            font-size: var(--text-xs);
          }
        }

        @media (max-width: 480px) {
          .control-button {
            padding: 6px 10px;
            font-size: var(--text-xs);
          }
        }

        @media (max-width: 360px) {
          .control-button {
            padding: 4px 8px !important;
            font-size: 11px !important;
          }
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          width: 100%;
          box-sizing: border-box;
        }

        .checkbox-label {
          font-size: var(--text-sm);
          color: var(--foreground);
          font-family: Inter Tight, sans-serif;
          user-select: none;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .checkbox-label {
            font-size: var(--text-xs);
          }
        }

        @media (max-width: 768px) {
          pre {
            padding: var(--spacing-3) !important;
            font-size: 12px !important;
          }
        }

        @media (max-width: 480px) {
          pre {
            padding: var(--spacing-2) !important;
            font-size: 11px !important;
          }
        }

        .info-banner {
          display: flex;
          gap: var(--spacing-2);
          padding: var(--spacing-4);
          background: var(--accent-subtle);
          border: 1px solid var(--accent);
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .info-banner {
            flex-direction: column;
            padding: var(--spacing-3);
          }
        }

        @media (max-width: 480px) {
          .info-banner {
            padding: var(--spacing-2);
          }
        }

        .code-block-collapsed {
          max-height: 0;
          overflow: hidden;
          transition: max-height var(--motion-duration-slow) var(--motion-easing-standard);
        }

        .code-block-expanded {
          max-height: 2000px;
          transition: max-height var(--motion-duration-slow) var(--motion-easing-standard);
        }

        @media (max-width: 768px) {
          header {
            margin-bottom: var(--spacing-6) !important;
            padding-bottom: var(--spacing-4) !important;
          }
        }

        @media (max-width: 480px) {
          header {
            margin-bottom: var(--spacing-4) !important;
            padding-bottom: var(--spacing-3) !important;
          }
        }
      `}</style>

      <div className="alert-doc-root">
        
        {/* Header */}
        <header style={{
          marginBottom: 'var(--spacing-8)',
          paddingBottom: 'var(--spacing-6)',
          borderBottom: '1px solid var(--border)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            marginBottom: 'var(--spacing-3)',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
            flexWrap: 'wrap',
          }}>
            <span>Components</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--foreground)' }}>Alert</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--spacing-4)',
            flexWrap: 'wrap',
            width: '100%',
            maxWidth: '100%',
          }}>
            <div style={{
              flex: 1,
              minWidth: '280px',
            }}>
              <h1 style={{
                margin: 0,
                marginBottom: 'var(--spacing-3)',
                color: 'var(--foreground)',
                wordWrap: 'break-word',
              }}>
                Alert
              </h1>
              <p style={{
                margin: 0,
                fontSize: 'var(--text-lg)',
                color: 'var(--muted-foreground)',
                lineHeight: '1.6',
                wordWrap: 'break-word',
              }}>
                Display contextual status messages with icons and optional dismiss actions. Use alerts to communicate important information, success states, warnings, or errors to users.
              </p>
            </div>
            <div style={{
              display: 'inline-flex',
              padding: '6px 12px',
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              border: '1px solid var(--accent)',
            }}>
              v1.0.0
            </div>
          </div>
        </header>

        {/* Anatomy Section */}
        <section style={{
          marginBottom: 'var(--spacing-8)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          <h2 style={{
            margin: 0,
            marginBottom: 'var(--spacing-4)',
            color: 'var(--foreground)',
          }}>
            Anatomy
          </h2>
          <p style={{
            margin: 0,
            marginBottom: 'var(--spacing-5)',
            fontSize: 'var(--text-base)',
            color: 'var(--muted-foreground)',
            lineHeight: '1.6',
          }}>
            The Alert component consists of several key elements that work together to communicate important messages.
          </p>

          <div className="alert-doc-grid-2">
            {/* Anatomy Diagram */}
            <div className="anatomy-card">
              <h3 style={{
                margin: 0,
                marginBottom: 'var(--spacing-3)',
                fontSize: 'var(--text-lg)',
                color: 'var(--foreground)',
              }}>
                Component Structure
              </h3>
              <div style={{
                background: 'var(--surface-1000)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-4)',
              }}>
                <Alert
                  title="Alert Title"
                  description="This is an example alert message with a title and description."
                  tone="info"
                  size="md"
                  dismissible
                />
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-2)',
                  width: '100%',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }} />
                    <span>Container (background + border)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }} />
                    <span>Leading Icon (status indicator)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }} />
                    <span>Title (optional)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }} />
                    <span>Description</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }} />
                    <span>Dismiss Button (optional)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Mapping */}
            <div className="anatomy-card">
              <h3 style={{
                margin: 0,
                marginBottom: 'var(--spacing-3)',
                fontSize: 'var(--text-lg)',
                color: 'var(--foreground)',
              }}>
                Design Token Mapping
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)',
              }}>
                <AnatomyToken label="Background (info)" token="--accent-subtle" />
                <AnatomyToken label="Background (success)" token="--success-subtle" />
                <AnatomyToken label="Background (error)" token="--destructive-subtle" />
                <AnatomyToken label="Border (info)" token="--accent" />
                <AnatomyToken label="Border (success)" token="--success" />
                <AnatomyToken label="Border (error)" token="--destructive" />
                <AnatomyToken label="Icon Color" token="Tone-specific" />
                <AnatomyToken label="Border Radius" token="--radius-md" />
                <AnatomyToken label="Font Family" token="Inter Tight" />
                <AnatomyToken label="Padding (sm)" token="--spacing-2 (16px)" />
                <AnatomyToken label="Padding (md)" token="--spacing-3 (24px)" />
                <AnatomyToken label="Dismiss Duration" token="--motion-duration-slow (200ms)" />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Preview Section */}
        <section style={{
          marginBottom: 'var(--spacing-8)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          <h2 style={{
            margin: 0,
            marginBottom: 'var(--spacing-4)',
            color: 'var(--foreground)',
          }}>
            Interactive Preview
          </h2>
          <p style={{
            margin: 0,
            marginBottom: 'var(--spacing-5)',
            fontSize: 'var(--text-base)',
            color: 'var(--muted-foreground)',
            lineHeight: '1.6',
          }}>
            Customize the alert below to see how different configurations work together.
          </p>

          <div className="alert-doc-card">
            {/* Controls */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-4)',
              marginBottom: 'var(--spacing-6)',
              width: '100%',
              maxWidth: '100%',
            }}>
              {/* Tone Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Tone
                </label>
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-1)',
                  flexWrap: 'wrap',
                }}>
                  {(['info', 'success', 'warning', 'error', 'neutral'] as const).map((tone) => (
                    <button
                      key={tone}
                      className="control-button"
                      onClick={() => setSelectedTone(tone)}
                      style={{
                        background: selectedTone === tone ? 'var(--accent)' : 'var(--surface-700)',
                        color: selectedTone === tone ? 'var(--accent-foreground)' : 'var(--foreground)',
                        borderColor: selectedTone === tone ? 'var(--accent)' : 'var(--border)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Size
                </label>
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-1)',
                  flexWrap: 'wrap',
                }}>
                  {(['sm', 'md'] as const).map((size) => (
                    <button
                      key={size}
                      className="control-button"
                      onClick={() => setSelectedSize(size)}
                      style={{
                        background: selectedSize === size ? 'var(--accent)' : 'var(--surface-700)',
                        color: selectedSize === size ? 'var(--accent-foreground)' : 'var(--foreground)',
                        borderColor: selectedSize === size ? 'var(--accent)' : 'var(--border)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Toggle */}
              <div style={{ width: '100%' }}>
                <label className="checkbox-wrapper" style={{
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={hasTitle}
                    onChange={(e) => setHasTitle(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  />
                  <span className="checkbox-label">Show title</span>
                </label>
              </div>

              {/* Dismissible Toggle */}
              <div style={{ width: '100%' }}>
                <label className="checkbox-wrapper" style={{
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={isDismissible}
                    onChange={(e) => setIsDismissible(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  />
                  <span className="checkbox-label">Dismissible</span>
                </label>
              </div>
            </div>

            {/* Preview Display */}
            <div className="alert-preview-wrapper">
              <Alert
                title={hasTitle ? currentContent.title : undefined}
                description={currentContent.description}
                tone={selectedTone}
                size={selectedSize}
                dismissible={isDismissible}
                onDismiss={() => toast.success('Alert dismissed!')}
              />
            </div>
          </div>
        </section>

        {/* Tokens Used Section */}
        <section style={{
          marginBottom: 'var(--spacing-8)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          <h2 style={{
            margin: 0,
            marginBottom: 'var(--spacing-4)',
            color: 'var(--foreground)',
          }}>
            Tokens Used
          </h2>
          <p style={{
            margin: 0,
            marginBottom: 'var(--spacing-5)',
            fontSize: 'var(--text-base)',
            color: 'var(--muted-foreground)',
            lineHeight: '1.6',
          }}>
            All visual properties of the Alert component are bound to design system tokens.
          </p>

          <div className="alert-doc-card">
            {/* Core Tokens */}
            <div className="alert-doc-token-grid">
              <TokenCard
                name="Background (info)"
                value="--accent-subtle"
                onCopy={() => copyToClipboard('var(--accent-subtle)', 'bg-info')}
                copied={copiedCode === 'bg-info'}
              />
              <TokenCard
                name="Background (success)"
                value="--success-subtle"
                onCopy={() => copyToClipboard('var(--success-subtle)', 'bg-success')}
                copied={copiedCode === 'bg-success'}
              />
              <TokenCard
                name="Background (error)"
                value="--destructive-subtle"
                onCopy={() => copyToClipboard('var(--destructive-subtle)', 'bg-error')}
                copied={copiedCode === 'bg-error'}
              />
              <TokenCard
                name="Background (neutral)"
                value="--surface-800"
                onCopy={() => copyToClipboard('var(--surface-800)', 'bg-neutral')}
                copied={copiedCode === 'bg-neutral'}
              />
              <TokenCard
                name="Border (info)"
                value="--accent"
                onCopy={() => copyToClipboard('var(--accent)', 'border-info')}
                copied={copiedCode === 'border-info'}
              />
              <TokenCard
                name="Border (success)"
                value="--success"
                onCopy={() => copyToClipboard('var(--success)', 'border-success')}
                copied={copiedCode === 'border-success'}
              />
              <TokenCard
                name="Border (error)"
                value="--destructive"
                onCopy={() => copyToClipboard('var(--destructive)', 'border-error')}
                copied={copiedCode === 'border-error'}
              />
              <TokenCard
                name="Border Radius"
                value="--radius-md"
                onCopy={() => copyToClipboard('var(--radius-md)', 'radius')}
                copied={copiedCode === 'radius'}
              />
            </div>

            {/* Advanced Tokens Toggle */}
            <div style={{
              marginTop: 'var(--spacing-5)',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <button
                onClick={() => setShowAdvancedTokens(!showAdvancedTokens)}
                className="control-button"
                style={{
                  background: 'var(--surface-700)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)',
                }}
              >
                {showAdvancedTokens ? 'Show Less' : 'Show Advanced Tokens'}
              </button>
            </div>

            {/* Advanced Tokens */}
            {showAdvancedTokens && (
              <div className="alert-doc-token-grid" style={{
                marginTop: 'var(--spacing-5)',
              }}>
                <TokenCard
                  name="Text Color"
                  value="--foreground"
                  onCopy={() => copyToClipboard('var(--foreground)', 'text-color')}
                  copied={copiedCode === 'text-color'}
                />
                <TokenCard
                  name="Icon (info)"
                  value="--accent"
                  onCopy={() => copyToClipboard('var(--accent)', 'icon-info')}
                  copied={copiedCode === 'icon-info'}
                />
                <TokenCard
                  name="Icon (success)"
                  value="--success"
                  onCopy={() => copyToClipboard('var(--success)', 'icon-success')}
                  copied={copiedCode === 'icon-success'}
                />
                <TokenCard
                  name="Icon (error)"
                  value="--destructive"
                  onCopy={() => copyToClipboard('var(--destructive)', 'icon-error')}
                  copied={copiedCode === 'icon-error'}
                />
                <TokenCard
                  name="Padding (sm)"
                  value="--spacing-2"
                  onCopy={() => copyToClipboard('var(--spacing-2)', 'padding-sm')}
                  copied={copiedCode === 'padding-sm'}
                />
                <TokenCard
                  name="Padding (md)"
                  value="--spacing-3"
                  onCopy={() => copyToClipboard('var(--spacing-3)', 'padding-md')}
                  copied={copiedCode === 'padding-md'}
                />
                <TokenCard
                  name="Gap (sm)"
                  value="--spacing-2"
                  onCopy={() => copyToClipboard('var(--spacing-2)', 'gap-sm')}
                  copied={copiedCode === 'gap-sm'}
                />
                <TokenCard
                  name="Gap (md)"
                  value="--spacing-3"
                  onCopy={() => copyToClipboard('var(--spacing-3)', 'gap-md')}
                  copied={copiedCode === 'gap-md'}
                />
                <TokenCard
                  name="Title Weight"
                  value="--font-weight-semibold"
                  onCopy={() => copyToClipboard('var(--font-weight-semibold)', 'title-weight')}
                  copied={copiedCode === 'title-weight'}
                />
                <TokenCard
                  name="Dismiss Duration"
                  value="--motion-duration-slow"
                  onCopy={() => copyToClipboard('var(--motion-duration-slow)', 'dismiss-duration')}
                  copied={copiedCode === 'dismiss-duration'}
                />
                <TokenCard
                  name="Easing"
                  value="--motion-easing-standard"
                  onCopy={() => copyToClipboard('var(--motion-easing-standard)', 'easing')}
                  copied={copiedCode === 'easing'}
                />
                <TokenCard
                  name="Focus Ring"
                  value="--focus-ring-accent"
                  onCopy={() => copyToClipboard('var(--focus-ring-accent)', 'focus-ring')}
                  copied={copiedCode === 'focus-ring'}
                />
              </div>
            )}

            <div className="info-banner" style={{
              marginTop: 'var(--spacing-5)',
            }}>
              <Info size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                lineHeight: '1.5',
              }}>
                <strong>Token Binding:</strong> All Alert variants use these tokens to ensure consistent theming across your application. Update token values in your design system to theme all alert instances automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section style={{
          marginBottom: 'var(--spacing-8)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          <h2 style={{
            margin: 0,
            marginBottom: 'var(--spacing-4)',
            color: 'var(--foreground)',
          }}>
            Code Examples
          </h2>
          <p style={{
            margin: 0,
            marginBottom: 'var(--spacing-5)',
            fontSize: 'var(--text-base)',
            color: 'var(--muted-foreground)',
            lineHeight: '1.6',
          }}>
            Use these tokenized code examples to implement the Alert component in your application.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-4)',
            width: '100%',
            maxWidth: '100%',
          }}>
            <CodeBlock
              title="React / JSX"
              code={reactCode}
              language="jsx"
              copied={copiedCode === 'react'}
              onCopy={() => copyToClipboard(reactCode, 'react')}
              expanded={expandedCodeBlocks.react}
              onToggle={() => toggleCodeBlock('react')}
            />
            <CodeBlock
              title="HTML"
              code={htmlCode}
              language="html"
              copied={copiedCode === 'html'}
              onCopy={() => copyToClipboard(htmlCode, 'html')}
              expanded={expandedCodeBlocks.html}
              onToggle={() => toggleCodeBlock('html')}
            />
            <CodeBlock
              title="CSS / Tailwind-like"
              code={cssCode}
              language="css"
              copied={copiedCode === 'css'}
              onCopy={() => copyToClipboard(cssCode, 'css')}
              expanded={expandedCodeBlocks.css}
              onToggle={() => toggleCodeBlock('css')}
            />
          </div>
        </section>

        {/* Usage Guidelines */}
        <section style={{
          marginBottom: 'var(--spacing-8)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          <h2 style={{
            margin: 0,
            marginBottom: 'var(--spacing-4)',
            color: 'var(--foreground)',
          }}>
            Usage Guidelines
          </h2>
          <p style={{
            margin: 0,
            marginBottom: 'var(--spacing-5)',
            fontSize: 'var(--text-base)',
            color: 'var(--muted-foreground)',
            lineHeight: '1.6',
          }}>
            Follow these guidelines to use alerts effectively in your interface.
          </p>

          <div className="alert-doc-grid-2">
            <GuidelineCard
              title="Do: Use for contextual status messages"
              description="Alerts are perfect for communicating system status, user action results, or important information that requires immediate attention."
              type="do"
            />
            <GuidelineCard
              title="Don't: Overload with long paragraphs"
              description="Avoid using alerts for lengthy content. Keep messages concise and to the point. Use 1-2 sentences maximum."
              type="dont"
            />
            <GuidelineCard
              title="Do: Keep alerts concise"
              description="Use clear, brief language that quickly conveys the message. Focus on what the user needs to know or do next."
              type="do"
            />
            <GuidelineCard
              title="Don't: Use destructive tones incorrectly"
              description="Don't use error or warning tones for neutral information. Match the tone to the severity and context of the message."
              type="dont"
            />
            <GuidelineCard
              title="Do: Position alerts contextually"
              description="Place alerts near the content they relate to. Use page-level alerts for global messages and inline alerts for field-specific feedback."
              type="do"
            />
            <GuidelineCard
              title="Don't: Show multiple alerts at once"
              description="Avoid displaying too many alerts simultaneously. Stack them vertically with clear spacing or show one at a time to prevent overwhelming users."
              type="dont"
            />
            <GuidelineCard
              title="Do: Include actionable next steps"
              description="When appropriate, include clear actions users can take to resolve issues or learn more about the alert message."
              type="do"
            />
            <GuidelineCard
              title="Don't: Use alerts for every message"
              description="Not every message needs an alert. Reserve alerts for important, timely information. Use toasts or inline text for less critical updates."
              type="dont"
            />
          </div>
        </section>

        {/* Accessibility Section */}
        <section style={{
          marginBottom: 'var(--spacing-8)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          <h2 style={{
            margin: 0,
            marginBottom: 'var(--spacing-4)',
            color: 'var(--foreground)',
          }}>
            Accessibility
          </h2>
          <p style={{
            margin: 0,
            marginBottom: 'var(--spacing-5)',
            fontSize: 'var(--text-base)',
            color: 'var(--muted-foreground)',
            lineHeight: '1.6',
          }}>
            The Alert component includes built-in accessibility features to ensure it works for all users.
          </p>

          <div className="alert-doc-grid-auto">
            <AccessibilityItem
              title="ARIA Attributes"
              items={[
                '<code>role="alert"</code> identifies the alert to screen readers',
                '<code>aria-live="polite"</code> for info, success, warning alerts',
                '<code>aria-live="assertive"</code> for error alerts (immediate announcement)',
                '<code>aria-atomic="true"</code> ensures entire alert is read',
                '<code>aria-label="Dismiss alert"</code> on close button',
              ]}
            />
            <AccessibilityItem
              title="Screen Reader Support"
              items={[
                'Alert content is automatically announced when displayed',
                'Error alerts use assertive mode for immediate attention',
                'Info/success alerts use polite mode to avoid interruption',
                'Dismiss button clearly labeled for screen reader users',
                'Icon meaning is conveyed through context and tone',
              ]}
            />
            <AccessibilityItem
              title="Keyboard Navigation"
              items={[
                '<strong>Tab:</strong> Focus on dismiss button (if dismissible)',
                '<strong>Enter / Space:</strong> Dismiss the alert',
                '<strong>Escape:</strong> Optional: dismiss the alert',
                'Focus is managed appropriately after dismissal',
              ]}
            />
            <AccessibilityItem
              title="Focus Management"
              items={[
                'Dismiss button receives focus when tabbing',
                'Focus ring uses <code>var(--focus-ring-accent)</code>',
                'Error alerts use <code>var(--focus-ring-destructive)</code>',
                'Focus is returned to appropriate element after dismissal',
                'Focus indicator is always visible and high contrast',
              ]}
            />
            <AccessibilityItem
              title="Color & Contrast"
              items={[
                'All text meets WCAG AA standards (4.5:1 contrast)',
                'Icons maintain 3:1 contrast with background',
                'Border colors provide additional visual distinction',
                'Status is not conveyed by color alone (icons included)',
                'High contrast colors for error and warning states',
              ]}
            />
            <AccessibilityItem
              title="Motion & Animation"
              items={[
                'Dismiss animation respects prefers-reduced-motion',
                'Animation duration is 180ms (non-disruptive)',
                'Alerts appear instantly without distracting animations',
                'Fade-out provides visual confirmation of dismissal',
                'No auto-dismiss for critical alerts',
              ]}
            />
          </div>
        </section>

      </div>
    </div>
  );
}

// Helper Components
function TokenCard({ name, value, onCopy, copied }: { name: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <button
      onClick={onCopy}
      className="token-card-button"
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 'var(--spacing-2)',
        marginBottom: 'var(--spacing-2)',
      }}>
        <span style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)',
          textAlign: 'left',
          wordWrap: 'break-word',
          flex: 1,
        }}>
          {name}
        </span>
        {copied ? (
          <Check size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
        ) : (
          <Copy size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
        )}
      </div>
      <code style={{
        display: 'block',
        fontSize: 'var(--text-xs)',
        color: 'var(--accent)',
        fontFamily: 'monospace',
        background: 'var(--surface-1000)',
        padding: '4px 8px',
        borderRadius: 'var(--radius-sm)',
        textAlign: 'left',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}>
        var({value})
      </code>
    </button>
  );
}

function AnatomyToken({ label, token }: { label: string; token: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--spacing-3)',
      padding: 'var(--spacing-3)',
      background: 'var(--surface-1000)',
      borderRadius: 'var(--radius-sm)',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      <span style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--muted-foreground)',
        flex: 1,
        wordWrap: 'break-word',
      }}>
        {label}
      </span>
      <code style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--accent)',
        fontFamily: 'monospace',
        textAlign: 'right',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}>
        {token}
      </code>
    </div>
  );
}

function CodeBlock({ 
  title, 
  code, 
  language, 
  copied, 
  onCopy,
  expanded,
  onToggle,
}: { 
  title: string; 
  code: string; 
  language: string; 
  copied: boolean; 
  onCopy: () => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{
      background: 'var(--surface-800)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-3)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface-900)',
        flexWrap: 'wrap',
        gap: 'var(--spacing-2)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}>
        <span style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)',
        }}>
          {title}
        </span>
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-2)',
        }}>
          <button
            onClick={onToggle}
            className="control-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              background: 'var(--surface-700)',
              color: 'var(--foreground)',
              borderColor: 'var(--border)',
            }}
          >
            <span>{expanded ? 'Hide' : 'Show'}</span>
          </button>
          <button
            onClick={onCopy}
            className="control-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              background: copied ? 'var(--success-subtle)' : 'var(--surface-700)',
              color: copied ? 'var(--success)' : 'var(--foreground)',
              borderColor: copied ? 'var(--success)' : 'var(--border)',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <div className={expanded ? 'code-block-expanded' : 'code-block-collapsed'}>
        <pre style={{
          margin: 0,
          padding: 'var(--spacing-5)',
          fontSize: 'var(--text-sm)',
          fontFamily: 'monospace',
          color: 'var(--foreground)',
          overflowX: 'auto',
          lineHeight: '1.7',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          {code}
        </pre>
      </div>
    </div>
  );
}

function GuidelineCard({ title, description, type }: { title: string; description: string; type: 'do' | 'dont' }) {
  return (
    <div style={{
      background: 'var(--surface-800)',
      border: '2px solid',
      borderColor: type === 'do' ? 'var(--success)' : 'var(--destructive)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-5)',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        margin: 0,
        marginBottom: 'var(--spacing-3)',
        color: type === 'do' ? 'var(--success)' : 'var(--destructive)',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}>
        {title}
      </h3>
      <p style={{
        margin: 0,
        fontSize: 'var(--text-base)',
        color: 'var(--foreground)',
        lineHeight: '1.6',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}>
        {description}
      </p>
    </div>
  );
}

function AccessibilityItem({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{
      padding: 'var(--spacing-5)',
      background: 'var(--surface-900)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        margin: 0,
        marginBottom: 'var(--spacing-4)',
        color: 'var(--foreground)',
        wordWrap: 'break-word',
      }}>
        {title}
      </h3>
      <ul style={{
        margin: 0,
        paddingLeft: 'var(--spacing-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
        width: '100%',
        maxWidth: '100%',
      }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              lineHeight: '1.7',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </ul>
    </div>
  );
}
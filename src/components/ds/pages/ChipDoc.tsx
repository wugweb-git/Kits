import React from 'react';
import { Copy, Check, ChevronRight, Info, Tag, X, Settings, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Chip } from '../../wugweb/Chip';
import { copyToClipboard as safeCopyToClipboard } from '../../../utils/clipboard';

export function ChipDoc() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [selectedTone, setSelectedTone] = React.useState<'default' | 'subtle' | 'outline' | 'destructive'>('default');
  const [iconPosition, setIconPosition] = React.useState<'none' | 'leading' | 'trailing'>('leading');
  const [isRemovable, setIsRemovable] = React.useState(false);
  const [selectedState, setSelectedState] = React.useState<'default' | 'hover' | 'selected' | 'disabled'>('default');
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

  // Generate code examples based on current settings
  const reactCode = `import { Chip } from './components/wugweb/Chip';
import { ${iconPosition !== 'none' ? 'Tag' : 'LucideIcon'} } from 'lucide-react';

function MyComponent() {
  return (
    <Chip
      label="${selectedTone === 'destructive' ? 'Delete' : 'Filter'}"
      ${iconPosition !== 'none' ? `icon={Tag}` : ''}
      ${iconPosition !== 'none' ? `iconPosition="${iconPosition}"` : ''}
      size="${selectedSize}"
      tone="${selectedTone}"
      ${isRemovable ? 'removable' : ''}
      ${selectedState === 'selected' ? 'selected' : ''}
      ${selectedState === 'disabled' ? 'disabled' : ''}
      onClick={() => console.log('Chip clicked')}
      ${isRemovable ? 'onRemove={() => console.log(\'Chip removed\')}' : ''}
    />
  );
}`;

  const htmlCode = `<div 
  role="${isRemovable ? 'button' : 'status'}" 
  tabindex="0" 
  aria-disabled="false"
  ${selectedState === 'selected' ? 'aria-selected="true"' : ''}
  class="chip chip-${selectedSize} chip-${selectedTone}${selectedState === 'selected' ? ' chip-selected' : ''}${selectedState === 'disabled' ? ' chip-disabled' : ''}"
>
  ${iconPosition === 'leading' ? '<svg class="chip-icon chip-icon-leading"><!-- icon --></svg>' : ''}
  <span class="chip-label">${selectedTone === 'destructive' ? 'Delete' : 'Filter'}</span>
  ${iconPosition === 'trailing' ? '<svg class="chip-icon chip-icon-trailing"><!-- icon --></svg>' : ''}
  ${isRemovable ? '<button class="chip-remove" aria-label="Remove Filter"><svg><!-- X icon --></svg></button>' : ''}
</div>`;

  const cssCode = `.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: Inter Tight, sans-serif;
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--motion-duration-normal) var(--motion-easing-standard);
  user-select: none;
  white-space: nowrap;
}

/* Size variants */
.chip-sm {
  padding: 4px 8px;
  height: 24px;
  font-size: var(--text-xs);
  gap: 4px;
}

.chip-md {
  padding: 6px 12px;
  height: 32px;
  font-size: var(--text-sm);
  gap: 6px;
}

.chip-lg {
  padding: 8px 16px;
  height: 40px;
  font-size: var(--text-base);
  gap: 8px;
}

/* Tone variants */
.chip-default {
  background: var(--surface-700);
  color: var(--foreground);
  border: 1px solid var(--border);
}

.chip-subtle {
  background: var(--surface-800);
  color: var(--foreground);
  border: 1px solid transparent;
}

.chip-outline {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
}

.chip-destructive {
  background: var(--destructive-subtle);
  color: var(--destructive);
  border: 1px solid transparent;
}

/* Selected state */
.chip-selected.chip-default {
  background: var(--accent);
  color: var(--accent-foreground);
}

.chip-selected.chip-destructive {
  background: var(--destructive);
  color: var(--destructive-foreground);
}

/* Hover state */
.chip:hover:not(.chip-disabled) {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

/* Active state */
.chip:active:not(.chip-disabled) {
  transform: translateY(0);
  filter: brightness(0.95);
}

/* Disabled state */
.chip-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Focus ring */
.chip:focus-visible {
  outline: none;
}

.chip-destructive:focus-visible {`;

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    }}>
      <style>{`
        .chip-doc-root {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .chip-doc-card {
          background: var(--surface-800);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-6);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .chip-doc-card {
            padding: var(--spacing-4);
          }
        }

        @media (max-width: 480px) {
          .chip-doc-card {
            padding: var(--spacing-3);
          }
        }

        .chip-doc-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-4);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .chip-doc-grid-2 {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }
        }

        .chip-doc-grid-auto {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-4);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .chip-doc-grid-auto {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }
        }

        .chip-doc-token-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--spacing-3);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .chip-doc-token-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-2);
          }
        }

        @media (max-width: 480px) {
          .chip-doc-token-grid {
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

        .chip-preview-wrapper {
          background: var(--surface-1000);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: var(--spacing-8);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 120px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .chip-preview-wrapper {
            padding: var(--spacing-4);
            min-height: 100px;
          }
        }

        @media (max-width: 480px) {
          .chip-preview-wrapper {
            padding: var(--spacing-3);
            min-height: 80px;
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

          .chip-preview-wrapper {
            padding: var(--spacing-2) !important;
          }

          .token-card-button {
            padding: var(--spacing-2) !important;
          }

          h1 {
            font-size: var(--text-lg) !important;
          }

          .chip-doc-card {
            padding: var(--spacing-2) !important;
          }
        }

        /* Ensure all flex containers are responsive */
        @media (max-width: 768px) {
          .chip-doc-root * {
            max-width: 100%;
          }
        }

        /* General text overflow protection */
        .chip-doc-root p,
        .chip-doc-root li,
        .chip-doc-root h1,
        .chip-doc-root h2,
        .chip-doc-root h3,
        .chip-doc-root span {
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        .chip-doc-root code {
          word-break: break-all;
          white-space: pre-wrap;
        }

        /* Section title responsive */
        .section-title {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        /* Header responsive */
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

        /* Button responsive styles */
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

          .control-select {
            padding: 4px 8px !important;
            font-size: 11px !important;
          }
        }

        /* Select responsive styles */
        .control-select {
          width: 100%;
          padding: 8px 12px;
          font-size: var(--text-sm);
          font-family: Inter Tight, sans-serif;
          background: var(--surface-700);
          color: var(--foreground);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .control-select {
            padding: 6px 10px;
            font-size: var(--text-xs);
          }
        }

        /* Checkbox control wrapper */
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

        /* Ensure code examples don't overflow */
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

        /* Info banner responsive */
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
      `}</style>

      <div className="chip-doc-root">
        
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
            <span style={{ color: 'var(--foreground)' }}>Chip</span>
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
                Chip
              </h1>
              <p style={{
                margin: 0,
                fontSize: 'var(--text-lg)',
                color: 'var(--muted-foreground)',
                lineHeight: '1.6',
                wordWrap: 'break-word',
              }}>
                Compact, interactive elements for filters, tags, and selections. Chips represent discrete information with optional icons and removal actions.
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
            The Chip component consists of several key elements that work together to create a compact, interactive tag.
          </p>

          <div className="chip-doc-grid-2">
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
                alignItems: 'center',
              }}>
                <Chip
                  label="Example Chip"
                  icon={Tag}
                  iconPosition="leading"
                  removable
                  size="lg"
                  tone="default"
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
                    <span>Container (border-radius: var(--radius-full))</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }} />
                    <span>Leading Icon (optional)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }} />
                    <span>Label Text</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }} />
                    <span>Remove Button (optional)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }} />
                    <span>Focus Ring (on keyboard focus)</span>
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
                <AnatomyToken label="Background" token="--surface-700 / --accent" />
                <AnatomyToken label="Text Color" token="--foreground / --accent-foreground" />
                <AnatomyToken label="Border" token="--border" />
                <AnatomyToken label="Border Radius" token="--radius-full" />
                <AnatomyToken label="Font Family" token="Inter Tight" />
                <AnatomyToken label="Font Weight" token="--font-weight-medium" />
                <AnatomyToken label="Padding (sm)" token="4px 8px" />
                <AnatomyToken label="Padding (md)" token="6px 12px" />
                <AnatomyToken label="Padding (lg)" token="8px 16px" />
                <AnatomyToken label="Focus Ring" token="--focus-ring-accent" />
                <AnatomyToken label="Hover Duration" token="--motion-duration-normal (120ms)" />
                <AnatomyToken label="Press Duration" token="--motion-duration-fast (80ms)" />
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
            Customize the chip below to see how different configurations work together.
          </p>

          <div className="chip-doc-card">
            {/* Controls */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-4)',
              marginBottom: 'var(--spacing-6)',
              width: '100%',
              maxWidth: '100%',
            }}>
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
                  {(['sm', 'md', 'lg'] as const).map((size) => (
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
                  {(['default', 'subtle', 'outline', 'destructive'] as const).map((tone) => (
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

              {/* Icon Position Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Icon Position
                </label>
                <select
                  value={iconPosition}
                  onChange={(e) => setIconPosition(e.target.value as any)}
                  className="control-select"
                >
                  <option value="none">None</option>
                  <option value="leading">Leading</option>
                  <option value="trailing">Trailing</option>
                </select>
              </div>

              {/* State Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value as any)}
                  className="control-select"
                >
                  <option value="default">Default</option>
                  <option value="selected">Selected</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {/* Removable Control */}
              <div style={{ width: '100%' }}>
                <label className="checkbox-wrapper" style={{
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={isRemovable}
                    onChange={(e) => setIsRemovable(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  />
                  <span className="checkbox-label">Show remove button</span>
                </label>
              </div>
            </div>

            {/* Preview Display */}
            <div className="chip-preview-wrapper">
              <Chip
                label={selectedTone === 'destructive' ? 'Delete' : 'Filter'}
                icon={selectedTone === 'destructive' ? X : iconPosition !== 'none' ? Tag : undefined}
                iconPosition={iconPosition}
                size={selectedSize}
                tone={selectedTone}
                removable={isRemovable}
                selected={selectedState === 'selected'}
                disabled={selectedState === 'disabled'}
                onClick={() => toast.success('Chip clicked!')}
                onRemove={() => toast.success('Chip removed!')}
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
            All visual properties of the Chip component are bound to design system tokens.
          </p>

          <div className="chip-doc-card">
            {/* Core Tokens */}
            <div className="chip-doc-token-grid">
              <TokenCard
                name="Background (default)"
                value="--surface-700"
                onCopy={() => copyToClipboard('var(--surface-700)', 'bg-default')}
                copied={copiedCode === 'bg-default'}
              />
              <TokenCard
                name="Background (subtle)"
                value="--surface-800"
                onCopy={() => copyToClipboard('var(--surface-800)', 'bg-subtle')}
                copied={copiedCode === 'bg-subtle'}
              />
              <TokenCard
                name="Background (selected)"
                value="--accent"
                onCopy={() => copyToClipboard('var(--accent)', 'bg-selected')}
                copied={copiedCode === 'bg-selected'}
              />
              <TokenCard
                name="Background (destructive)"
                value="--destructive-subtle"
                onCopy={() => copyToClipboard('var(--destructive-subtle)', 'bg-destructive')}
                copied={copiedCode === 'bg-destructive'}
              />
              <TokenCard
                name="Text Color"
                value="--foreground"
                onCopy={() => copyToClipboard('var(--foreground)', 'text-color')}
                copied={copiedCode === 'text-color'}
              />
              <TokenCard
                name="Text (selected)"
                value="--accent-foreground"
                onCopy={() => copyToClipboard('var(--accent-foreground)', 'text-selected')}
                copied={copiedCode === 'text-selected'}
              />
              <TokenCard
                name="Border Color"
                value="--border"
                onCopy={() => copyToClipboard('var(--border)', 'border')}
                copied={copiedCode === 'border'}
              />
              <TokenCard
                name="Border Radius"
                value="--radius-full"
                onCopy={() => copyToClipboard('var(--radius-full)', 'radius')}
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
              <div className="chip-doc-token-grid" style={{
                marginTop: 'var(--spacing-5)',
              }}>
                <TokenCard
                  name="Typography (sm)"
                  value="--text-xs"
                  onCopy={() => copyToClipboard('var(--text-xs)', 'text-sm')}
                  copied={copiedCode === 'text-sm'}
                />
                <TokenCard
                  name="Typography (md)"
                  value="--text-sm"
                  onCopy={() => copyToClipboard('var(--text-sm)', 'text-md')}
                  copied={copiedCode === 'text-md'}
                />
                <TokenCard
                  name="Typography (lg)"
                  value="--text-base"
                  onCopy={() => copyToClipboard('var(--text-base)', 'text-lg')}
                  copied={copiedCode === 'text-lg'}
                />
                <TokenCard
                  name="Font Weight"
                  value="--font-weight-medium"
                  onCopy={() => copyToClipboard('var(--font-weight-medium)', 'font-weight')}
                  copied={copiedCode === 'font-weight'}
                />
                <TokenCard
                  name="Focus Ring"
                  value="--focus-ring-accent"
                  onCopy={() => copyToClipboard('var(--focus-ring-accent)', 'focus-ring')}
                  copied={copiedCode === 'focus-ring'}
                />
                <TokenCard
                  name="Focus Ring (destructive)"
                  value="--focus-ring-destructive"
                  onCopy={() => copyToClipboard('var(--focus-ring-destructive)', 'focus-ring-dest')}
                  copied={copiedCode === 'focus-ring-dest'}
                />
                <TokenCard
                  name="Hover Duration"
                  value="--motion-duration-normal"
                  onCopy={() => copyToClipboard('var(--motion-duration-normal)', 'hover-duration')}
                  copied={copiedCode === 'hover-duration'}
                />
                <TokenCard
                  name="Press Duration"
                  value="--motion-duration-fast"
                  onCopy={() => copyToClipboard('var(--motion-duration-fast)', 'press-duration')}
                  copied={copiedCode === 'press-duration'}
                />
                <TokenCard
                  name="Easing"
                  value="--motion-easing-standard"
                  onCopy={() => copyToClipboard('var(--motion-easing-standard)', 'easing')}
                  copied={copiedCode === 'easing'}
                />
                <TokenCard
                  name="Shadow (hover)"
                  value="--shadow-sm"
                  onCopy={() => copyToClipboard('var(--shadow-sm)', 'shadow')}
                  copied={copiedCode === 'shadow'}
                />
                <TokenCard
                  name="Destructive Color"
                  value="--destructive"
                  onCopy={() => copyToClipboard('var(--destructive)', 'destructive')}
                  copied={copiedCode === 'destructive'}
                />
                <TokenCard
                  name="Accent Subtle"
                  value="--accent-subtle"
                  onCopy={() => copyToClipboard('var(--accent-subtle)', 'accent-subtle')}
                  copied={copiedCode === 'accent-subtle'}
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
                <strong>Token Binding:</strong> All Chip variants use these tokens to ensure consistent theming across your application. Update token values in your design system to theme all chip instances automatically.
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
            Use these tokenized code examples to implement the Chip component in your application.
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
            Follow these guidelines to use chips effectively in your interface.
          </p>

          <div className="chip-doc-grid-2">
            <GuidelineCard
              title="Do: Use chips for filters and tags"
              description="Chips are perfect for displaying filters, categories, and tags that users can interact with or remove."
              type="do"
            />
            <GuidelineCard
              title="Don't: Use chips for long text"
              description="Avoid using chips for long paragraphs or sentences. Keep labels short and concise (1-3 words)."
              type="dont"
            />
            <GuidelineCard
              title="Do: Keep labels short"
              description="Use brief, descriptive labels that clearly communicate the chip's purpose. Aim for 1-3 words maximum."
              type="do"
            />
            <GuidelineCard
              title="Don't: Mix too many tones"
              description="Don't mix multiple tones in the same chip group. Stick to one tone (e.g., all default or all subtle) for consistency."
              type="dont"
            />
            <GuidelineCard
              title="Do: Use icons for clarity"
              description="Add leading icons to chips when they help users quickly identify the chip's category or purpose."
              type="do"
            />
            <GuidelineCard
              title="Don't: Overcrowd with chips"
              description="Avoid displaying too many chips at once. Consider grouping or using filters to show/hide chips as needed."
              type="dont"
            />
            <GuidelineCard
              title="Do: Use removable chips for selections"
              description="Enable the removable option when users can dismiss or deselect items, like applied filters or selected tags."
              type="do"
            />
            <GuidelineCard
              title="Don't: Use for critical actions"
              description="Don't use chips for critical actions like 'Delete Account'. Use proper buttons for important destructive actions."
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
            The Chip component includes built-in accessibility features to ensure it works for all users.
          </p>

          <div className="chip-doc-grid-auto">
            <AccessibilityItem
              title="Keyboard Navigation"
              items={[
                '<strong>Tab:</strong> Focus on the chip',
                '<strong>Enter / Space:</strong> Activate the chip (if clickable)',
                '<strong>Escape:</strong> Remove focus from chip',
                'Remove buttons are focusable and can be activated with Enter or Space',
              ]}
            />
            <AccessibilityItem
              title="Focus Management"
              items={[
                'Focus ring appears with <code>var(--focus-ring-accent)</code> on keyboard focus',
                'Destructive chips use <code>var(--focus-ring-destructive)</code>',
                'Focus ring animates in with 120ms duration for visual feedback',
                'Focus indicator is always visible and not obscured by content',
              ]}
            />
            <AccessibilityItem
              title="ARIA Attributes"
              items={[
                '<code>role="button"</code> for interactive chips',
                '<code>role="status"</code> for non-interactive chips',
                '<code>aria-disabled="true"</code> for disabled state',
                '<code>aria-selected="true"</code> for selected state',
                '<code>aria-label="Remove [label]"</code> on remove buttons',
              ]}
            />
            <AccessibilityItem
              title="Screen Reader Support"
              items={[
                'Chip label is announced by screen readers',
                'Remove button announces "Remove [chip label]"',
                'Selected state is communicated via aria-selected',
                'Disabled state prevents interaction and is announced',
              ]}
            />
            <AccessibilityItem
              title="Color Contrast"
              items={[
                'All text meets WCAG AA standards (4.5:1 contrast ratio)',
                'Focus indicators have 3:1 contrast with background',
                'Destructive chips use high-contrast error colors',
                'Icons maintain proper contrast in all states',
              ]}
            />
            <AccessibilityItem
              title="Touch Targets"
              items={[
                'Minimum 24px touch target for small chips',
                'Medium chips have 32px touch target',
                'Large chips have 40px touch target',
                'Remove buttons maintain accessible hit areas',
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
import React from 'react';
import { Copy, Check } from 'lucide-react';

interface PropRow {
  prop: string;
  type: string;
  default: string;
  description: string;
}

interface Example {
  title: string;
  description?: string;
  component: React.ReactNode;
}

interface DocTemplateProps {
  title: string;
  description: string;
  isNew?: boolean;
  preview: React.ReactNode;
  code: string;
  examples?: Example[];
  props: PropRow[];
}

/**
 * DocTemplate Component
 * 
 * Reusable template for component documentation pages.
 * Uses CSS variables from /styles/globals.css for theming.
 */
export function DocTemplate({
  title,
  description,
  isNew = false,
  preview,
  code,
  examples = [],
  props,
}: DocTemplateProps) {
  const [copied, setCopied] = React.useState(false);

  const copyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        {isNew && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              padding: '4px 12px',
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--spacing-4)',
            }}
          >
            New Component
          </div>
        )}
        <h1
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            margin: 0,
            marginBottom: 'var(--spacing-3)',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-lg)',
            color: 'var(--muted-foreground)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      {/* Preview */}
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          Preview
        </h2>
        <div
          style={{
            padding: 'var(--spacing-8)',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          {preview}
        </div>
      </div>

      {/* Installation */}
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          Usage
        </h2>
        <div
          style={{
            position: 'relative',
            background: 'var(--muted)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-4)',
          }}
        >
          <pre
            style={{
              fontFamily: 'monospace',
              fontSize: 'var(--text-sm)',
              color: 'var(--foreground)',
              margin: 0,
              overflow: 'auto',
            }}
          >
            {code}
          </pre>
          <button
            onClick={() => copyCode(code)}
            style={{
              position: 'absolute',
              top: 'var(--spacing-4)',
              right: 'var(--spacing-4)',
              padding: 'var(--spacing-2)',
              background: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: copied ? 'var(--success)' : 'var(--foreground)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--background)';
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Examples */}
      {examples.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-4)',
            }}
          >
            Examples
          </h2>

          {examples.map((example, index) => (
            <div key={index} style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-3)',
                }}
              >
                {example.title}
              </h3>
              {example.description && (
                <p
                  style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: 'var(--text-base)',
                    color: 'var(--muted-foreground)',
                    marginBottom: 'var(--spacing-3)',
                  }}
                >
                  {example.description}
                </p>
              )}
              <div
                style={{
                  padding: 'var(--spacing-6)',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {example.component}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Props */}
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          Props
        </h2>
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                <th
                  style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--foreground)',
                    padding: 'var(--spacing-3)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  Prop
                </th>
                <th
                  style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--foreground)',
                    padding: 'var(--spacing-3)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--foreground)',
                    padding: 'var(--spacing-3)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  Default
                </th>
                <th
                  style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--foreground)',
                    padding: 'var(--spacing-3)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {props.map((row, index) => (
                <tr key={index}>
                  <td
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--accent)',
                      padding: 'var(--spacing-3)',
                      borderBottom: index < props.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    {row.prop}
                  </td>
                  <td
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)',
                      padding: 'var(--spacing-3)',
                      borderBottom: index < props.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    {row.type}
                  </td>
                  <td
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)',
                      padding: 'var(--spacing-3)',
                      borderBottom: index < props.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    {row.default}
                  </td>
                  <td
                    style={{
                      fontFamily: 'Inter Tight, sans-serif',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      padding: 'var(--spacing-3)',
                      borderBottom: index < props.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    {row.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Copy, Check } from 'lucide-react';

export interface ClipboardProps {
  text: string;
  children?: React.ReactNode;
  successMessage?: string;
  showIcon?: boolean;
  variant?: 'button' | 'inline';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Clipboard Component
 * 
 * Copy to clipboard with visual feedback.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <Clipboard text="npm install wugweb">
 *   <code>npm install wugweb</code>
 * </Clipboard>
 */
export function Clipboard({
  text,
  children,
  successMessage = 'Copied!',
  showIcon = true,
  variant = 'button',
  className = '',
  style = {},
}: ClipboardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (variant === 'inline') {
    return (
      <div
        className={className}
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          padding: 'var(--spacing-2) var(--spacing-3)',
          background: 'var(--muted)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          ...style,
        }}
      >
        <code
          style={{
            fontFamily: 'monospace',
            fontSize: 'var(--text-sm)',
            color: 'var(--foreground)',
          }}
        >
          {children || text}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: copied ? 'var(--success)' : 'var(--muted-foreground)',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--radius-sm)',
            transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.color = 'var(--foreground)';
              e.currentTarget.style.background = 'var(--secondary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.color = 'var(--muted-foreground)';
              e.currentTarget.style.background = 'none';
            }
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {children && <div style={{ marginBottom: 'var(--spacing-2)' }}>{children}</div>}
      
      <button
        type="button"
        onClick={handleCopy}
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          padding: 'var(--spacing-2) var(--spacing-4)',
          background: copied ? 'var(--success)' : 'var(--secondary)',
          color: copied ? 'var(--success-foreground)' : 'var(--foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
        }}
        onMouseEnter={(e) => {
          if (!copied) {
            e.currentTarget.style.background = 'var(--muted)';
          }
        }}
        onMouseLeave={(e) => {
          if (!copied) {
            e.currentTarget.style.background = 'var(--secondary)';
          }
        }}
      >
        {showIcon && (copied ? <Check size={16} /> : <Copy size={16} />)}
        {copied ? successMessage : 'Copy'}
      </button>
    </div>
  );
}

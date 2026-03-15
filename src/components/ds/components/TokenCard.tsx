import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { typography } from '../../../utils/responsive';

interface TokenCardProps {
  label: string;
  token: string;
  value?: string;
  color?: string;
  isRadius?: boolean;
  isDuration?: boolean;
  isEasing?: boolean;
  isFocus?: boolean;
  onClick?: (token: string, label: string, value?: string) => void;
  isHighlighted?: boolean;
}

export function TokenCard({ label, token, value, color, isRadius, isDuration, isEasing, isFocus, onClick, isHighlighted }: TokenCardProps) {
  const [copied, setCopied] = React.useState(false);
  const { isMobile, breakpoint } = useBreakpoint();

  const copyToken = async () => {
    try {
      // Try modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(token);
      } else {
        // Fallback to older method
        const textArea = document.createElement('textarea');
        textArea.value = token;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed:', err);
      // Still show feedback even if copy failed
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className={`bg-card border token-card-glow ${isHighlighted ? 'token-card-highlighted' : ''} ${isHighlighted ? 'border-accent' : 'border-border'}`}
      style={{ 
        borderRadius: 'var(--radius-lg)',
        padding: isMobile ? '14px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
      onClick={onClick ? () => onClick(token, label, value) : copyToken}
    >
      {/* Header with label and visual */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontSize: typography.caption[breakpoint],
            color: 'var(--muted-foreground)',
            marginBottom: '6px',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            {label}
          </div>
          
          {/* Visual representation */}
          {!isDuration && !isEasing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{ 
                  width: isMobile ? '32px' : '40px', 
                  height: isMobile ? '32px' : '40px', 
                  borderRadius: isRadius ? 'var(--radius-lg)' : 'var(--radius-md)',
                  background: isFocus ? 'var(--background)' : color,
                  border: '1px solid var(--border)',
                  boxShadow: isFocus ? '0 0 0 2px var(--ring)' : 'none',
                  flexShrink: 0
                }} 
              />
            </div>
          )}
          
          {isDuration && (
            <div style={{ 
              fontSize: typography.body[breakpoint],
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--accent)'
            }}>
              {value || '200ms'}
            </div>
          )}
          
          {isEasing && (
            <div 
              className="bg-muted"
              style={{ 
                height: '32px',
                width: '100%',
                borderRadius: 'var(--radius-sm)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border)'
              }}
            >
              <div 
                className="bg-accent"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '60%',
                  transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: 0.3
                }}
              />
            </div>
          )}
        </div>
        
        {/* Copy button */}
        <button
          className="hover:bg-accent/20 smooth-transition"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid transparent',
            flexShrink: 0
          }}
          onClick={(e) => {
            e.stopPropagation();
            copyToken();
          }}
        >
          {copied ? (
            <Check size={14} className="text-accent" />
          ) : (
            <Copy size={14} className="text-muted-foreground" />
          )}
        </button>
      </div>
      
      {/* Token name */}
      <div 
        className="bg-muted"
        style={{ 
          padding: '8px 10px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)'
        }}
      >
        <code style={{ 
          fontSize: typography.caption[breakpoint],
          color: 'var(--accent)',
          fontFamily: 'monospace',
          wordBreak: 'break-all'
        }}>
          {token}
        </code>
      </div>
      
      {/* Subtle gradient overlay on hover */}
      <div 
        className="pointer-events-none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, var(--accent), transparent)',
          opacity: 0,
          transition: 'opacity 200ms ease'
        }}
      />
    </div>
  );
}
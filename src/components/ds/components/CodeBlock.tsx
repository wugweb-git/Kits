import React from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { typography } from '../../../utils/responsive';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../../../utils/clipboard';

interface CodeBlockProps {
  code: string;
  language?: 'jsx' | 'css' | 'typescript';
  showCopy?: boolean;
  maxHeight?: string;
}

export function CodeBlock({ code, language = 'jsx', showCopy = true, maxHeight }: CodeBlockProps) {
  const [copiedType, setCopiedType] = React.useState<'tokenized' | 'values' | null>(null);
  const [showCopyMenu, setShowCopyMenu] = React.useState(false);
  const { isMobile, breakpoint } = useBreakpoint();

  // Token to value mapping
  const tokenValueMap: Record<string, string> = {
    'var(--background)': 'rgba(18, 18, 18, 1.00)',
    'var(--foreground)': 'rgba(255, 255, 255, 1.00)',
    'var(--card)': 'rgba(28, 28, 28, 1.00)',
    'var(--secondary)': 'rgba(43, 43, 43, 1.00)',
    'var(--muted)': 'rgba(38, 38, 38, 1.00)',
    'var(--muted-foreground)': 'rgba(161, 161, 161, 1.00)',
    'var(--accent)': 'rgba(255, 190, 26, 1.00)',
    'var(--accent-foreground)': 'rgba(18, 18, 18, 1.00)',
    'var(--destructive)': 'rgba(239, 67, 67, 1.00)',
    'var(--border)': 'rgba(43, 43, 43, 1.00)',
    'var(--ring)': 'rgba(255, 190, 26, 1.00)',
    'var(--radius-sm)': '4px',
    'var(--radius-md)': '8px',
    'var(--radius-lg)': '12px',
    'var(--radius-full)': '9999px',
    'var(--text-xs)': '0.75rem',
    'var(--text-sm)': '0.875rem',
    'var(--text-base)': '1rem',
    'var(--text-lg)': '1.25rem',
    'var(--text-xl)': '1.5rem',
    'var(--text-2xl)': '2.25rem',
    'var(--font-weight-regular)': '400',
    'var(--font-weight-medium)': '500',
    'var(--font-weight-semibold)': '600',
    'var(--font-weight-bold)': '700',
    'var(--motion-duration-fast)': '80ms',
    'var(--motion-duration-normal)': '120ms',
    'var(--motion-duration-slow)': '200ms',
    'var(--motion-easing-standard)': 'cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Replace tokens with actual values
  const replaceTokensWithValues = (codeStr: string): string => {
    let result = codeStr;
    Object.entries(tokenValueMap).forEach(([token, value]) => {
      result = result.replace(new RegExp(token.replace(/[()]/g, '\\\\$&'), 'g'), value);
    });
    return result;
  };

  const copyCode = async (type: 'tokenized' | 'values') => {
    const codeToCopy = type === 'tokenized' ? code : replaceTokensWithValues(code);
    
    const success = await copyToClipboard(codeToCopy);
    if (success) {
      setCopiedType(type);
      setShowCopyMenu(false);
      
      // Show toast notification
      toast('Copied', {
        description: type === 'tokenized' ? 'Code with tokens copied' : 'Code with CSS values copied',
        duration: 1500,
        style: {
          background: 'var(--card)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
        },
      });
      
      setTimeout(() => setCopiedType(null), 1500);
    } else {
      toast('Copy failed', {
        description: 'Unable to copy to clipboard',
        duration: 1500,
        style: {
          background: 'var(--destructive)',
          border: '1px solid var(--destructive)',
          color: 'var(--destructive-foreground)',
        },
      });
    }
  };

  // Simple syntax highlighting for tokens
  const highlightCode = (text: string) => {
    // Highlight CSS variables
    let highlighted = text.replace(
      /var\(--[\w-]+\)/g, 
      (match) => `<span style="color: var(--accent); font-weight: var(--font-weight-semibold)">${match}</span>`
    );
    
    // Highlight string values
    highlighted = highlighted.replace(
      /"([^"]*)"/g,
      (match) => `<span style="color: var(--chart-3)">${match}</span>`
    );
    
    // Highlight comments
    highlighted = highlighted.replace(
      /(\/\/.*$)/gm,
      (match) => `<span style="color: var(--muted-foreground); font-style: italic">${match}</span>`
    );
    
    // Highlight CSS properties
    if (language === 'css') {
      highlighted = highlighted.replace(
        /^(\s*)([\w-]+)(?=:)/gm,
        (match, indent, prop) => `${indent}<span style="color: var(--chart-4)">${prop}</span>`
      );
    }
    
    return highlighted;
  };

  return (
    <div 
      className="border border-border"
      style={{ 
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--muted)'
      }}
    >
      {/* Header with copy button */}
      {showCopy && (
        <div 
          className="border-b border-border bg-card"
          style={{
            padding: isMobile ? '8px 12px' : '10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <span 
            className="text-muted-foreground"
            style={{ 
              fontSize: typography.caption[breakpoint],
              fontWeight: 'var(--font-weight-medium)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {language === 'jsx' ? 'React / JSX' : language === 'css' ? 'CSS' : 'TypeScript'}
          </span>
          
          <div style={{ position: 'relative' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCopyMenu(!showCopyMenu)}
              className="button-press"
              style={{ 
                height: '28px',
                padding: '0 10px',
                fontSize: typography.caption[breakpoint]
              }}
            >
              {copiedType ? (
                <>
                  <Check size={14} />
                  <span style={{ marginLeft: '6px' }}>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span style={{ marginLeft: '6px' }}>Copy</span>
                </>
              )}
            </Button>
            
            {/* Copy menu dropdown */}
            {showCopyMenu && (
              <>
                {/* Backdrop to close menu */}
                <div 
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10
                  }}
                  onClick={() => setShowCopyMenu(false)}
                />
                
                {/* Menu */}
                <div 
                  className="bg-card border border-border animate-fade-in-up"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    right: 0,
                    minWidth: '180px',
                    padding: '4px',
                    borderRadius: 'var(--radius-md)',
                    zIndex: 20
                  }}
                >
                  <button
                    onClick={() => copyCode('tokenized')}
                    className="w-full text-left hover:bg-accent hover:text-accent-foreground smooth-transition"
                    style={{ 
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: typography.small[breakpoint],
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 'var(--font-weight-medium)'
                    }}
                  >
                    <Code2 size={14} />
                    Copy (tokenized)
                  </button>
                  <button
                    onClick={() => copyCode('values')}
                    className="w-full text-left hover:bg-accent hover:text-accent-foreground smooth-transition"
                    style={{ 
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: typography.small[breakpoint],
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 'var(--font-weight-medium)'
                    }}
                  >
                    <Copy size={14} />
                    Copy (CSS values)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Code content */}
      <div 
        style={{ 
          padding: isMobile ? '16px' : '20px',
          overflow: 'auto',
          maxHeight: maxHeight || (isMobile ? '400px' : '600px')
        }}
      >
        <pre 
          style={{ 
            margin: 0,
            fontSize: typography.small[breakpoint],
            lineHeight: '1.6',
            fontFamily: 'monospace',
            color: 'var(--foreground)'
          }}
        >
          <code 
            dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
          />
        </pre>
      </div>
    </div>
  );
}
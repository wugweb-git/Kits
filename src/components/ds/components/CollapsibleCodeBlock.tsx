import React from 'react';
import { Copy, Check, Code2, ChevronDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { typography } from '../../../utils/responsive';
import { toast } from 'sonner';
import { Card, CardContent } from '../../ui/card';

interface CollapsibleCodeBlockProps {
  code?: string;
  language?: 'jsx' | 'css' | 'typescript';
  defaultCollapsed?: boolean;
  previewHeight?: string; // Height when collapsed (e.g., '48px')
  showViewCodeButton?: boolean;
  title?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  animationDelay?: string;
  children?: React.ReactNode;
}

export function CollapsibleCodeBlock({ 
  code, 
  language = 'jsx', 
  defaultCollapsed = false,
  previewHeight = '0px',
  showViewCodeButton = true,
  title,
  isOpen,
  onToggle,
  animationDelay = '0ms',
  children
}: CollapsibleCodeBlockProps) {
  const { isMobile, isTablet, breakpoint } = useBreakpoint();
  
  // Auto-collapse based on breakpoint
  const shouldDefaultCollapse = isMobile ? true : isTablet ? true : defaultCollapsed;
  const responsivePreviewHeight = isMobile ? '0px' : isTablet ? '48px' : previewHeight;
  
  const [isCollapsed, setIsCollapsed] = React.useState(shouldDefaultCollapse);
  const [copiedType, setCopiedType] = React.useState<'tokenized' | 'values' | null>(null);
  const [showCopyMenu, setShowCopyMenu] = React.useState(false);

  // Use external control if provided, otherwise use internal state
  const isContentOpen = isOpen !== undefined ? isOpen : !isCollapsed;
  const handleToggle = onToggle || (() => setIsCollapsed(!isCollapsed));

  // If used with title and children (section mode), render different layout
  if (title && children) {
    return (
      <section 
        className="animate-fade-in-up" 
        style={{ animationDelay, width: '100%', boxSizing: 'border-box' }}
      >
        <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isContentOpen ? '24px' : '0', transition: 'margin var(--motion-duration-normal) var(--motion-easing-emphasized)' }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', margin: 0, fontFamily: 'Inter Tight, sans-serif' }}>{title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className="button-press"
                style={{ fontFamily: 'Inter Tight, sans-serif' }}
              >
                <ChevronDown 
                  size={20} 
                  style={{ 
                    transform: isContentOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform var(--motion-duration-normal) var(--motion-easing-emphasized)'
                  }}
                />
              </Button>
            </div>
            
            <div 
              style={{ 
                maxHeight: isContentOpen ? '5000px' : '0',
                overflow: 'hidden',
                transition: 'max-height var(--motion-duration-normal) var(--motion-easing-emphasized), opacity var(--motion-duration-normal) var(--motion-easing-emphasized)',
                opacity: isContentOpen ? 1 : 0
              }}
            >
              {children}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

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
  };

  const replaceTokensWithValues = (codeStr: string): string => {
    let result = codeStr;
    Object.entries(tokenValueMap).forEach(([token, value]) => {
      result = result.replace(new RegExp(token.replace(/[()]/g, '\\\\$&'), 'g'), value);
    });
    return result;
  };

  const copyCode = async (type: 'tokenized' | 'values') => {
    if (!code) return;
    
    const codeToCopy = type === 'tokenized' ? code : replaceTokensWithValues(code);
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(codeToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = codeToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopiedType(type);
      setShowCopyMenu(false);
      
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
    } catch (err) {
      console.warn('Copy failed:', err);
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

  const highlightCode = (text: string | undefined) => {
    if (!text) return '';
    
    let highlighted = text.replace(
      /var\(--[\w-]+\)/g, 
      (match) => `<span style="color: var(--accent); font-weight: var(--font-weight-semibold)">${match}</span>`
    );
    
    highlighted = highlighted.replace(
      /"([^"]*)"/g,
      (match) => `<span style="color: rgba(132, 204, 22, 1)">${match}</span>`
    );
    
    highlighted = highlighted.replace(
      /(\/\/.*$)/gm,
      (match) => `<span style="color: var(--muted-foreground); font-style: italic">${match}</span>`
    );
    
    if (language === 'css') {
      highlighted = highlighted.replace(
        /^(\s*)([\w-]+)(?=:)/gm,
        (match, indent, prop) => `${indent}<span style="color: rgba(96, 165, 250, 1)">${prop}</span>`
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
        background: 'var(--muted)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Header with copy button - always visible */}
      <div 
        className="border-b border-border bg-card"
        style={{
          padding: isMobile ? '8px 12px' : '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          
          {showViewCodeButton && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hover:text-accent smooth-transition"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: typography.caption[breakpoint],
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              <ChevronDown 
                size={14} 
                style={{ 
                  transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                  transition: 'transform 180ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
              {isCollapsed ? 'View code' : 'Hide code'}
            </button>
          )}
        </div>
        
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
                {!isMobile && <span style={{ marginLeft: '6px' }}>Copied!</span>}
              </>
            ) : (
              <>
                <Copy size={14} />
                {!isMobile && <span style={{ marginLeft: '6px' }}>Copy</span>}
              </>
            )}
          </Button>
          
          {/* Copy menu dropdown */}
          {showCopyMenu && (
            <>
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
      
      {/* Code content with smooth height transition */}
      <div 
        style={{ 
          maxHeight: isCollapsed ? responsivePreviewHeight : '600px',
          overflow: 'hidden',
          transition: 'max-height 180ms cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div 
          style={{ 
            padding: isMobile ? '16px' : '20px',
            overflowX: 'auto',
            overflowY: 'auto',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          <pre 
            style={{ 
              margin: 0,
              fontSize: typography.small[breakpoint],
              lineHeight: '1.6',
              fontFamily: 'monospace',
              color: 'var(--foreground)',
              whiteSpace: 'pre',
              overflowX: 'auto',
              width: 'max-content',
              minWidth: '100%'
            }}
          >
            <code 
              dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
            />
          </pre>
        </div>
        
        {/* Gradient fade overlay when collapsed */}
        {isCollapsed && previewHeight !== '0px' && (
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '24px',
              background: 'linear-gradient(to bottom, transparent, var(--muted))',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
    </div>
  );
}
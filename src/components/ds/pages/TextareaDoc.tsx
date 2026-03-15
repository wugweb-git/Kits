import React from 'react';
import { Textarea } from '../../wugweb/Textarea';
import { Label } from '../../wugweb/Label';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Check, Copy, ChevronRight, X, AlertCircle } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { getSpacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../wugweb/Button';
import { copyToClipboard } from '../../../utils/clipboard';

export function TextareaDoc() {
  const [value, setValue] = React.useState('');
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [showCode, setShowCode] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  
  const { isMobile, isTablet } = useBreakpoint();

  const handleTokenClick = (token: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

  const copyPageLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const generateCode = () => {
    let code = `<Textarea\n`;
    if (isDisabled) code += `  disabled={true}\n`;
    if (isError) code += `  error={true}\n`;
    code += `  value={value}\n`;
    code += `  onChange={(e) => setValue(e.target.value)}\n`;
    code += `/>`;
    return code;
  };

  return (
    <div 
      className="min-h-screen w-full"
      style={{ 
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        paddingLeft: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--layout-padding-desktop-right)',
        paddingRight: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--layout-padding-desktop-right)',
        paddingTop: getSpacing(isMobile ? 8 : isTablet ? 10 : 12),
        paddingBottom: getSpacing(isMobile ? 12 : isTablet ? 16 : 20),
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: getSpacing(isMobile ? 8 : 12) }}>
        <div className="flex items-center gap-2" style={{ marginBottom: getSpacing(3) }}>
          <span style={{ 
            color: 'var(--muted-foreground)',
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '14px',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            Components
          </span>
          <ChevronRight size={16} color="var(--muted-foreground)" />
          <span style={{ 
            color: 'var(--foreground)',
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '14px',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            Textarea
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: '1.2',
              marginBottom: getSpacing(2),
            }}>
              Textarea
            </h1>
            <p style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '18px',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--muted-foreground)',
              lineHeight: '1.6',
            }}>
              A multi-line text input field for capturing longer form content like comments, messages, or descriptions.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" style={{
              borderColor: 'var(--accent)',
              color: 'var(--accent)',
              backgroundColor: 'var(--accent-subtle)',
            }}>
              Form Control
            </Badge>
            <Button variant="outline" size="sm" onClick={copyPageLink}>
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Playground */}
      <Card style={{ 
        marginBottom: getSpacing(8),
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-3)',
      }}>
        <CardContent className="p-0">
          <div style={{ 
            padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)',
            borderBottom: '1px solid var(--border)',
          }}>
            <h3 style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '20px',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: getSpacing(6),
            }}>
              Interactive Playground
            </h3>

            {/* Preview */}
            <div style={{
              backgroundColor: 'var(--surface-800)',
              borderRadius: 'var(--radius-3)',
              padding: isMobile ? 'var(--spacing-8)' : 'var(--spacing-12)',
              marginBottom: getSpacing(6),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '250px',
            }}>
              <div style={{ width: '100%', maxWidth: '500px' }}>
                <Label htmlFor="playground-textarea" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                  Your Message
                </Label>
                <Textarea
                  id="playground-textarea"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  error={isError}
                  disabled={isDisabled}
                />
                {isError && (
                  <div className="flex items-center gap-2" style={{ marginTop: 'var(--spacing-2)' }}>
                    <AlertCircle size={14} color="var(--destructive)" />
                    <span style={{
                      fontFamily: 'Inter Tight, sans-serif',
                      fontSize: '14px',
                      color: 'var(--destructive)',
                    }}>
                      This field is required
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is-disabled"
                    checked={isDisabled}
                    onChange={(e) => setIsDisabled(e.target.checked)}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <Label htmlFor="is-disabled">Disabled</Label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is-error"
                    checked={isError}
                    onChange={(e) => setIsError(e.target.checked)}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <Label htmlFor="is-error">Show Error State</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Code */}
          <div style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
            <CollapsibleCodeBlock
              code={generateCode()}
              language="tsx"
              filename="Textarea.tsx"
              showLineNumbers
            />
          </div>
        </CardContent>
      </Card>

      {/* Design Tokens */}
      <Card style={{ 
        marginBottom: getSpacing(8),
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-3)',
      }}>
        <CardContent style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
          <h3 style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '20px',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: getSpacing(6),
          }}>
            Design Tokens
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TokenCard
              token="--input-background"
              label="Background"
              value="rgba(28, 28, 28, 1.00)"
              isHighlighted={highlightedToken === '--input-background'}
              onClick={() => handleTokenClick('--input-background')}
            />
            <TokenCard
              token="--foreground"
              label="Text Color"
              value="rgba(255, 255, 255, 1.00)"
              isHighlighted={highlightedToken === '--foreground'}
              onClick={() => handleTokenClick('--foreground')}
            />
            <TokenCard
              token="--border"
              label="Border"
              value="rgba(43, 43, 43, 1.00)"
              isHighlighted={highlightedToken === '--border'}
              onClick={() => handleTokenClick('--border')}
            />
            <TokenCard
              token="--ring"
              label="Focus Ring"
              value="rgba(255, 190, 26, 1.00)"
              isHighlighted={highlightedToken === '--ring'}
              onClick={() => handleTokenClick('--ring')}
            />
            <TokenCard
              token="--muted-foreground"
              label="Placeholder"
              value="rgba(161, 161, 161, 1.00)"
              isHighlighted={highlightedToken === '--muted-foreground'}
              onClick={() => handleTokenClick('--muted-foreground')}
            />
            <TokenCard
              token="--destructive"
              label="Error State"
              value="rgba(239, 67, 67, 1.00)"
              isHighlighted={highlightedToken === '--destructive'}
              onClick={() => handleTokenClick('--destructive')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Usage Guidelines */}
      <Card style={{ 
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-3)',
      }}>
        <CardContent style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
          <h3 style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '20px',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: getSpacing(6),
          }}>
            Usage Guidelines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: getSpacing(4) }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Check size={14} color="white" />
                </div>
                <h4 style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '16px',
                  fontWeight: 'var(--font-weight-semibold)',
                }}>
                  Do
                </h4>
              </div>
              <ul style={{ 
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)',
              }}>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Use for multi-line text input like comments or messages
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Provide clear labels and helper text
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Set appropriate height based on expected content
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Show character count for length-limited fields
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: getSpacing(4) }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--destructive)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <X size={14} color="white" />
                </div>
                <h4 style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '16px',
                  fontWeight: 'var(--font-weight-semibold)',
                }}>
                  Don't
                </h4>
              </div>
              <ul style={{ 
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)',
              }}>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Use for single-line input (use Input instead)
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Make the textarea too small to display content
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Disable resize without good reason
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Use without visible labels or context
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React from 'react';
import { Input } from '../../wugweb/Input';
import { Label } from '../../wugweb/Label';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Check, Copy, ExternalLink, X, ChevronRight, Type, Layout, MousePointer, AlertCircle } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../wugweb/Button';

export function InputDoc() {
  const [inputValue, setInputValue] = React.useState('');
  const [inputType, setInputType] = React.useState<'text' | 'email' | 'password' | 'number'>('text');
  const [placeholder, setPlaceholder] = React.useState('Enter your text...');
  const [hasError, setHasError] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  
  const [showCode, setShowCode] = React.useState(true);
  const [showGuidelines, setShowGuidelines] = React.useState(true);
  const [showAccessibility, setShowAccessibility] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  
  const { isMobile, isTablet } = useBreakpoint();

  const handleTokenClick = (token: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const generateCode = () => {
    let code = `<Input\n`;
    if (inputType !== 'text') code += `  type="${inputType}"\n`;
    if (placeholder !== 'Enter your text...') code += `  placeholder="${placeholder}"\n`;
    if (hasError) code += `  error={true}\n`;
    if (isDisabled) code += `  disabled={true}\n`;
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
        paddingTop: spacing(isMobile ? 8 : isTablet ? 10 : 12),
        paddingBottom: spacing(isMobile ? 12 : isTablet ? 16 : 20),
      }}
    >
      {/* Premium Header */}
      <div style={{ marginBottom: spacing(isMobile ? 8 : 12) }}>
        <div className="flex items-center gap-2" style={{ marginBottom: spacing(3) }}>
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
            Input
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: '1.2',
              marginBottom: spacing(2),
            }}>
              Input
            </h1>
            <p style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '18px',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--muted-foreground)',
              lineHeight: '1.6',
            }}>
              A foundational text input field for capturing user data with support for various types, validation states, and accessibility features.
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
            <Button
              variant="outline"
              size="sm"
              onClick={copyPageLink}
            >
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Playground */}
      <Card style={{ 
        marginBottom: spacing(8),
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
              marginBottom: spacing(6),
            }}>
              Interactive Playground
            </h3>

            {/* Preview */}
            <div style={{
              backgroundColor: 'var(--surface-800)',
              borderRadius: 'var(--radius-3)',
              padding: isMobile ? 'var(--spacing-8)' : 'var(--spacing-12)',
              marginBottom: spacing(6),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
            }}>
              <div style={{ width: '100%', maxWidth: '400px' }}>
                <Label htmlFor="playground-input" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                  Email Address
                </Label>
                <Input
                  id="playground-input"
                  type={inputType}
                  placeholder={placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  error={hasError}
                  disabled={isDisabled}
                />
                {hasError && (
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
              <div>
                <Label htmlFor="input-type" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                  Type
                </Label>
                <select
                  id="input-type"
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value as any)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-2)',
                    backgroundColor: 'var(--input-background)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: '16px',
                    outline: 'none',
                  }}
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="password">Password</option>
                  <option value="number">Number</option>
                </select>
              </div>

              <div>
                <Label htmlFor="input-placeholder" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                  Placeholder
                </Label>
                <Input
                  id="input-placeholder"
                  type="text"
                  placeholder="Placeholder text"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="has-error"
                  checked={hasError}
                  onChange={(e) => setHasError(e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <Label htmlFor="has-error">Show Error State</Label>
              </div>

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
            </div>
          </div>

          {/* Generated Code */}
          <div style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
            <CollapsibleCodeBlock
              code={generateCode()}
              language="tsx"
              filename="Input.tsx"
              showLineNumbers
            />
          </div>
        </CardContent>
      </Card>

      {/* Design Tokens */}
      <Card style={{ 
        marginBottom: spacing(8),
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-3)',
      }}>
        <CardContent style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
          <h3 style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '20px',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: spacing(6),
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
        marginBottom: spacing(8),
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-3)',
      }}>
        <CardContent style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: spacing(6) }}>
            <h3 style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '20px',
              fontWeight: 'var(--font-weight-semibold)',
            }}>
              Usage Guidelines
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGuidelines(!showGuidelines)}
            >
              {showGuidelines ? <X size={16} /> : <Check size={16} />}
            </Button>
          </div>

          {showGuidelines && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2" style={{ marginBottom: spacing(4) }}>
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
                    Always pair inputs with clear, descriptive labels
                  </li>
                  <li style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: '14px',
                    color: 'var(--muted-foreground)',
                    paddingLeft: 'var(--spacing-4)',
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0 }}>•</span>
                    Use placeholder text for examples or formatting hints
                  </li>
                  <li style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: '14px',
                    color: 'var(--muted-foreground)',
                    paddingLeft: 'var(--spacing-4)',
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0 }}>•</span>
                    Show error messages immediately after validation
                  </li>
                  <li style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: '14px',
                    color: 'var(--muted-foreground)',
                    paddingLeft: 'var(--spacing-4)',
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0 }}>•</span>
                    Use appropriate input types (email, password, number)
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2" style={{ marginBottom: spacing(4) }}>
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
                    Use placeholder text as a replacement for labels
                  </li>
                  <li style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: '14px',
                    color: 'var(--muted-foreground)',
                    paddingLeft: 'var(--spacing-4)',
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0 }}>•</span>
                    Make inputs too narrow to display expected content
                  </li>
                  <li style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: '14px',
                    color: 'var(--muted-foreground)',
                    paddingLeft: 'var(--spacing-4)',
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0 }}>•</span>
                    Disable inputs without clear indication why
                  </li>
                  <li style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: '14px',
                    color: 'var(--muted-foreground)',
                    paddingLeft: 'var(--spacing-4)',
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0 }}>•</span>
                    Use generic error messages like "Invalid input"
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card style={{ 
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-3)',
      }}>
        <CardContent style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: spacing(6) }}>
            <h3 style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '20px',
              fontWeight: 'var(--font-weight-semibold)',
            }}>
              Accessibility
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAccessibility(!showAccessibility)}
            >
              {showAccessibility ? <X size={16} /> : <Check size={16} />}
            </Button>
          </div>

          {showAccessibility && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-4)',
            }}>
              <div>
                <h4 style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '16px',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: spacing(2),
                }}>
                  Keyboard Navigation
                </h4>
                <p style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  lineHeight: '1.6',
                }}>
                  • <kbd style={{ 
                    backgroundColor: 'var(--surface-800)', 
                    padding: '2px 6px', 
                    borderRadius: 'var(--radius-1)',
                    fontFamily: 'monospace',
                  }}>Tab</kbd> - Focus the input field<br/>
                  • <kbd style={{ 
                    backgroundColor: 'var(--surface-800)', 
                    padding: '2px 6px', 
                    borderRadius: 'var(--radius-1)',
                    fontFamily: 'monospace',
                  }}>Shift + Tab</kbd> - Navigate backwards
                </p>
              </div>

              <div>
                <h4 style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '16px',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: spacing(2),
                }}>
                  Screen Reader Support
                </h4>
                <p style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  lineHeight: '1.6',
                }}>
                  Input fields are properly labeled and associated with their labels using the <code style={{
                    backgroundColor: 'var(--surface-800)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-1)',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                  }}>htmlFor</code> attribute. Error states are announced to screen readers.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '16px',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: spacing(2),
                }}>
                  ARIA Attributes
                </h4>
                <p style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  lineHeight: '1.6',
                }}>
                  Use <code style={{
                    backgroundColor: 'var(--surface-800)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-1)',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                  }}>aria-invalid</code> for error states and <code style={{
                    backgroundColor: 'var(--surface-800)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-1)',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                  }}>aria-describedby</code> to link error messages.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

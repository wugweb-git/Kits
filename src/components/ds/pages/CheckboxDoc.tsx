import React from 'react';
import { Checkbox } from '../../wugweb/Checkbox';
import { Label } from '../../wugweb/Label';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Check, Copy, ChevronRight, X } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { getSpacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../wugweb/Button';
import { copyToClipboard } from '../../../utils/clipboard';

export function CheckboxDoc() {
  const [isChecked, setIsChecked] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [showCode, setShowCode] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  
  const { isMobile, isTablet } = useBreakpoint();

  const handleTokenClick = (token: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

  const copyPageLink = async () => {
    try {
      await copyToClipboard(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const generateCode = () => {
    let code = `<div className="flex items-center gap-2">\n`;
    code += `  <Checkbox\n`;
    code += `    id="terms"\n`;
    code += `    checked={checked}\n`;
    code += `    onCheckedChange={setChecked}\n`;
    if (isDisabled) code += `    disabled={true}\n`;
    code += `  />\n`;
    code += `  <Label htmlFor="terms">Accept terms and conditions</Label>\n`;
    code += `</div>`;
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
            Checkbox
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
              Checkbox
            </h1>
            <p style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '18px',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--muted-foreground)',
              lineHeight: '1.6',
            }}>
              A control that allows users to select one or more options from a set.
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
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
            }}>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="playground-checkbox"
                  checked={isChecked}
                  onCheckedChange={(checked) => setIsChecked(checked as boolean)}
                  disabled={isDisabled}
                />
                <Label htmlFor="playground-checkbox">
                  Accept terms and conditions
                </Label>
              </div>
            </div>

            {/* Controls */}
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

          {/* Code */}
          <div style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
            <CollapsibleCodeBlock
              code={generateCode()}
              language="tsx"
              filename="Checkbox.tsx"
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
              token="--primary"
              label="Checked Background"
              value="rgba(255, 255, 255, 1.00)"
              isHighlighted={highlightedToken === '--primary'}
              onClick={() => handleTokenClick('--primary')}
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
              token="--radius-1"
              label="Border Radius"
              value="4px"
              isHighlighted={highlightedToken === '--radius-1'}
              onClick={() => handleTokenClick('--radius-1')}
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
                  Use checkboxes for multiple selections
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Always pair with a clear label
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Group related checkboxes together
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
                  Use for mutually exclusive options (use radio instead)
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Make labels too long or complex
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Use without proper spacing between options
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
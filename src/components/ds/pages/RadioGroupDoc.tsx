import React from 'react';
import { RadioGroup, RadioGroupItem } from '../../wugweb/RadioGroup';
import { Label } from '../../wugweb/Label';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Check, Copy, ChevronRight, X } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../wugweb/Button';

export function RadioGroupDoc() {
  const [selectedValue, setSelectedValue] = React.useState('default');
  const [isDisabled, setIsDisabled] = React.useState(false);
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
    let code = `<RadioGroup value={value} onValueChange={setValue}${isDisabled ? ' disabled={true}' : ''}>\n`;
    code += `  <div className="flex items-center gap-2">\n`;
    code += `    <RadioGroupItem value="default" id="r1" />\n`;
    code += `    <Label htmlFor="r1">Default</Label>\n`;
    code += `  </div>\n`;
    code += `  <div className="flex items-center gap-2">\n`;
    code += `    <RadioGroupItem value="comfortable" id="r2" />\n`;
    code += `    <Label htmlFor="r2">Comfortable</Label>\n`;
    code += `  </div>\n`;
    code += `  <div className="flex items-center gap-2">\n`;
    code += `    <RadioGroupItem value="compact" id="r3" />\n`;
    code += `    <Label htmlFor="r3">Compact</Label>\n`;
    code += `  </div>\n`;
    code += `</RadioGroup>`;
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
      {/* Header */}
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
            Radio Group
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
              Radio Group
            </h1>
            <p style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '18px',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--muted-foreground)',
              lineHeight: '1.6',
            }}>
              A set of checkable buttons where only one can be selected at a time.
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
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
            }}>
              <RadioGroup 
                value={selectedValue} 
                onValueChange={setSelectedValue}
                disabled={isDisabled}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1">Default</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="comfortable" id="r2" />
                  <Label htmlFor="r2">Comfortable</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="compact" id="r3" />
                  <Label htmlFor="r3">Compact</Label>
                </div>
              </RadioGroup>
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
              filename="RadioGroup.tsx"
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
              token="--primary"
              label="Selected Indicator"
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
              token="--spacing-3"
              label="Item Spacing"
              value="12px"
              isHighlighted={highlightedToken === '--spacing-3'}
              onClick={() => handleTokenClick('--spacing-3')}
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
            marginBottom: spacing(6),
          }}>
            Usage Guidelines
          </h3>

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
                  Use for mutually exclusive options
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Provide 2-5 options for best UX
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Always have one option pre-selected
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
                  Use for multiple selections (use checkboxes)
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Use for more than 7 options (use select)
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Nest radio groups within each other
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

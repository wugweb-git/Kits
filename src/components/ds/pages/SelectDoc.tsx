import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '../../wugweb/Select';
import { Label } from '../../wugweb/Label';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Check, Copy, ChevronRight, X } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../wugweb/Button';

export function SelectDoc() {
  const [selectedValue, setSelectedValue] = React.useState('apple');
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
    let code = `<Select value={value} onValueChange={setValue}${isDisabled ? ' disabled={true}' : ''}>\n`;
    code += `  <SelectTrigger>\n`;
    code += `    <SelectValue placeholder="Select a fruit" />\n`;
    code += `  </SelectTrigger>\n`;
    code += `  <SelectContent>\n`;
    code += `    <SelectGroup>\n`;
    code += `      <SelectLabel>Fruits</SelectLabel>\n`;
    code += `      <SelectItem value="apple">Apple</SelectItem>\n`;
    code += `      <SelectItem value="banana">Banana</SelectItem>\n`;
    code += `      <SelectItem value="orange">Orange</SelectItem>\n`;
    code += `    </SelectGroup>\n`;
    code += `  </SelectContent>\n`;
    code += `</Select>`;
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
            Select
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
              Select
            </h1>
            <p style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '18px',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--muted-foreground)',
              lineHeight: '1.6',
            }}>
              A dropdown control for selecting a single value from a list of options with support for grouping and keyboard navigation.
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
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
            }}>
              <div style={{ width: '100%', maxWidth: '300px' }}>
                <Label htmlFor="playground-select" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                  Choose a fruit
                </Label>
                <Select value={selectedValue} onValueChange={setSelectedValue} disabled={isDisabled}>
                  <SelectTrigger id="playground-select">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="grape">Grape</SelectItem>
                      <SelectItem value="mango">Mango</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Vegetables</SelectLabel>
                      <SelectItem value="carrot">Carrot</SelectItem>
                      <SelectItem value="broccoli">Broccoli</SelectItem>
                      <SelectItem value="spinach">Spinach</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
              filename="Select.tsx"
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
              label="Trigger Background"
              value="rgba(28, 28, 28, 1.00)"
              isHighlighted={highlightedToken === '--input-background'}
              onClick={() => handleTokenClick('--input-background')}
            />
            <TokenCard
              token="--popover"
              label="Dropdown Background"
              value="rgba(18, 18, 18, 1.00)"
              isHighlighted={highlightedToken === '--popover'}
              onClick={() => handleTokenClick('--popover')}
            />
            <TokenCard
              token="--accent"
              label="Item Hover"
              value="rgba(255, 190, 26, 1.00)"
              isHighlighted={highlightedToken === '--accent'}
              onClick={() => handleTokenClick('--accent')}
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
                  Use for 5+ options where space is limited
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Group related options with SelectLabel
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Provide clear, descriptive placeholder text
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Sort options alphabetically or by relevance
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
                  Use for fewer than 5 options (use radio instead)
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Make dropdown lists excessively long without search
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Use vague or abbreviated option labels
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Nest select dropdowns within each other
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

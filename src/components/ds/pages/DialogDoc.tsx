import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../wugweb/Dialog';
import { Label } from '../../wugweb/Label';
import { Input } from '../../wugweb/Input';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Check, Copy, ChevronRight, X } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Button } from '../../wugweb/Button';

export function DialogDoc() {
  const [isOpen, setIsOpen] = React.useState(false);
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
    return `<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="primary">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="John Doe" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue="john@example.com" />
      </div>
    </div>
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;
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
            Dialog
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
              Dialog
            </h1>
            <p style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '18px',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--muted-foreground)',
              lineHeight: '1.6',
            }}>
              A modal dialog that interrupts the user with important content and expects a response.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" style={{
              borderColor: 'var(--accent)',
              color: 'var(--accent)',
              backgroundColor: 'var(--accent-subtle)',
            }}>
              Overlay
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
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="primary">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4" style={{ gap: 'var(--spacing-4)' }}>
                    <div>
                      <Label htmlFor="name" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                        Name
                      </Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div>
                      <Label htmlFor="email" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                        Email
                      </Label>
                      <Input id="email" type="email" defaultValue="john@example.com" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setIsOpen(false)}>
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Code */}
          <div style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
            <CollapsibleCodeBlock
              code={generateCode()}
              language="tsx"
              filename="Dialog.tsx"
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
              token="--card"
              label="Dialog Background"
              value="rgba(18, 18, 18, 1.00)"
              isHighlighted={highlightedToken === '--card'}
              onClick={() => handleTokenClick('--card')}
            />
            <TokenCard
              token="--border"
              label="Border"
              value="rgba(43, 43, 43, 1.00)"
              isHighlighted={highlightedToken === '--border'}
              onClick={() => handleTokenClick('--border')}
            />
            <TokenCard
              token="--radius-3"
              label="Border Radius"
              value="12px"
              isHighlighted={highlightedToken === '--radius-3'}
              onClick={() => handleTokenClick('--radius-3')}
            />
            <TokenCard
              token="--spacing-8"
              label="Padding"
              value="32px"
              isHighlighted={highlightedToken === '--spacing-8'}
              onClick={() => handleTokenClick('--spacing-8')}
            />
            <TokenCard
              token="--ring"
              label="Focus Ring"
              value="rgba(255, 190, 26, 1.00)"
              isHighlighted={highlightedToken === '--ring'}
              onClick={() => handleTokenClick('--ring')}
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
                  Use for critical actions requiring user attention
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Provide clear action buttons (Save, Cancel, etc.)
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Keep dialog content focused and concise
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Allow users to close with Escape key or overlay click
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
                  Use for non-critical or informational content
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Stack multiple dialogs on top of each other
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Make dialogs too large or cramped with content
                </li>
                <li style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  paddingLeft: 'var(--spacing-4)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Auto-open dialogs without user interaction
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

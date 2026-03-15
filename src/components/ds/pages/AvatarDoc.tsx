import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Copy, Check, X, ChevronRight, Keyboard, ExternalLink } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';
import { Avatar, AvatarGroup } from '../../wugweb/Avatar';
import imgAvatar from 'figma:asset/f696e50d914cf017f3f0dedc0a291546425bc149.png';

export function AvatarDoc() {
  const [selectedSize, setSelectedSize] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  const [selectedStatus, setSelectedStatus] = React.useState<'online' | 'offline' | 'away' | 'busy' | 'none'>('none');
  const [showCode, setShowCode] = React.useState(true);
  const [showAccessibility, setShowAccessibility] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  
  const { isMobile, isTablet, breakpoint } = useBreakpoint();

  const handleTokenClick = (token: string, label: string, value?: string) => {
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

  const jsxCode = `import { Avatar, AvatarGroup } from './components/wugweb/Avatar';

// Single Avatar
<Avatar
  src="/path/to/image.png"
  alt="User name"
  size="${selectedSize}"
  ${selectedStatus !== 'none' ? `status="${selectedStatus}"` : ''}
  fallback="JD"
/>

// Avatar Group
<AvatarGroup
  avatars={[
    { src: "/avatar1.png", alt: "User 1" },
    { src: "/avatar2.png", alt: "User 2" },
    { src: "/avatar3.png", alt: "User 3" },
  ]}
  size="${selectedSize}"
  max={5}
/>

// Design Tokens Used:
// Background: var(--muted)
// Text: var(--muted-foreground)
// Border Radius: 50% (circle)
// Border: var(--border)`;

  const cssCode = `.avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  background-color: var(--muted);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity var(--motion-duration-fast) var(--motion-easing-standard);
}

.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--muted);
  color: var(--muted-foreground);
}

.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;
  border: 2px solid white;
}

.avatar-group {
  display: flex;
  align-items: center;
}

.avatar-group .avatar:not(:first-child) {
  margin-left: calc(-1 * var(--avatar-size) * 0.25);
}`;

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* Premium Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', width: '100%', boxSizing: 'border-box' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Data Display</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Avatar</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                Avatar
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px' }}>Data Display</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              A circular or square visual representation of a user or entity. Supports images, fallback initials, status indicators, and can be grouped together.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Sizes</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>5</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Tokens</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>4</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>WCAG</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>AA</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Button onClick={copyPageLink} variant="outline" size="sm" className="button-micro focus-ring-accent" style={{ gap: '8px', background: 'var(--background)', borderColor: 'var(--border)' }}>
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="outline" size="sm" className="button-micro focus-ring-accent" style={{ gap: '8px', background: 'var(--background)', borderColor: 'var(--border)' }}>
                <ExternalLink size={16} />
                View in Figma
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="animate-fade-in-up" style={{ animationDelay: '100ms', width: '100%', boxSizing: 'border-box' }}>
        <Card className="card-hover-lift" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Size</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
                      <Button 
                        key={size} 
                        onClick={() => setSelectedSize(size)} 
                        variant={selectedSize === size ? 'default' : 'outline'} 
                        size="sm" 
                        className="button-micro" 
                        style={{ 
                          fontSize: 'var(--text-sm)', 
                          textTransform: 'uppercase', 
                          background: selectedSize === size ? 'var(--accent)' : 'var(--background)', 
                          color: selectedSize === size ? 'var(--accent-foreground)' : 'var(--foreground)', 
                          borderColor: 'var(--border)' 
                        }}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px', color: 'var(--foreground)' }}>Status</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(['none', 'online', 'offline', 'away', 'busy'] as const).map((status) => (
                      <Button 
                        key={status} 
                        onClick={() => setSelectedStatus(status)} 
                        variant={selectedStatus === status ? 'default' : 'outline'} 
                        size="sm" 
                        className="button-micro" 
                        style={{ 
                          fontSize: 'var(--text-sm)', 
                          textTransform: 'capitalize', 
                          background: selectedStatus === status ? 'var(--accent)' : 'var(--background)', 
                          color: selectedStatus === status ? 'var(--accent-foreground)' : 'var(--foreground)', 
                          borderColor: 'var(--border)' 
                        }}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: isMobile ? '32px' : '48px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px', minHeight: '200px' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '16px', textAlign: 'center' }}>Single Avatar</div>
                  <Avatar
                    src={imgAvatar}
                    alt="User Avatar"
                    size={selectedSize}
                    status={selectedStatus}
                  />
                </div>

                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '16px', textAlign: 'center' }}>Avatar Group</div>
                  <AvatarGroup
                    avatars={[
                      { src: imgAvatar, alt: 'User 1' },
                      { fallback: 'AB', alt: 'User 2' },
                      { fallback: 'CD', alt: 'User 3' },
                      { fallback: 'EF', alt: 'User 4' },
                    ]}
                    size={selectedSize}
                    max={3}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Design Tokens */}
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Design Tokens</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Click on any token to highlight it in the preview above</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          <TokenCard label="Background" token="--muted" value="#F5F5F5" color="var(--muted)" onClick={() => handleTokenClick('--muted', 'Background', '#F5F5F5')} isHighlighted={highlightedToken === '--muted'} />
          <TokenCard label="Text Color" token="--muted-foreground" value="#A1A1A1" color="var(--muted-foreground)" onClick={() => handleTokenClick('--muted-foreground', 'Text Color', '#A1A1A1')} isHighlighted={highlightedToken === '--muted-foreground'} />
          <TokenCard label="Border" token="--border" value="#2B2B2B" color="var(--border)" onClick={() => handleTokenClick('--border', 'Border', '#2B2B2B')} isHighlighted={highlightedToken === '--border'} />
          <TokenCard label="Online Status" token="--success" value="#22C55E" color="var(--success)" onClick={() => handleTokenClick('--success', 'Online Status', '#22C55E')} isHighlighted={highlightedToken === '--success'} />
        </div>
      </section>

      {/* Code Examples */}
      {showCode && (
        <section className="animate-fade-in-up" style={{ animationDelay: '300ms', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>Code Examples</h2>
            <Button onClick={() => setShowCode(!showCode)} variant="ghost" size="sm" className="button-micro" style={{ gap: '8px' }}>
              <X size={16} />
              Hide
            </Button>
          </div>

          <Tabs defaultValue="jsx" style={{ width: '100%' }}>
            <TabsList style={{ marginBottom: '16px' }}>
              <TabsTrigger value="jsx">React + JSX</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
            </TabsList>

            <TabsContent value="jsx">
              <CollapsibleCodeBlock code={jsxCode} language="tsx" />
            </TabsContent>

            <TabsContent value="css">
              <CollapsibleCodeBlock code={cssCode} language="css" />
            </TabsContent>
          </Tabs>
        </section>
      )}

      {/* Accessibility */}
      {showAccessibility && (
        <section className="animate-fade-in-up" style={{ animationDelay: '400ms', width: '100%', boxSizing: 'border-box' }}>
          <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--card)' }}>
            <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Accessibility</h2>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>WCAG 2.1 Level AA compliant</p>
                </div>
                <Button onClick={() => setShowAccessibility(!showAccessibility)} variant="ghost" size="sm" className="button-micro" style={{ gap: '8px' }}>
                  <X size={16} />
                  Hide
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <Check size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '8px' }}>Best Practices</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                      <li>Always provide meaningful alt text for avatar images</li>
                      <li>Use fallback initials or icons when images are unavailable</li>
                      <li>Ensure status indicators have sufficient color contrast</li>
                      <li>Consider screen reader users when displaying avatar groups</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../wugweb/Button';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../../../utils/clipboard';

export function ButtonShowcase() {
  const [copiedCode, setCopiedCode] = React.useState(false);

  const copyCode = async (code: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <h1>Button Component</h1>
          <Badge>Imported from Figma</Badge>
        </div>
        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-lg)' }}>
          Primary interactive button component with multiple variants and states. 
          Fully bound to your design system tokens.
        </p>
      </div>

      {/* Alert showing token bindings */}
      <Alert className="bg-accent/10 border-accent">
        <CheckCircle2 size={20} className="text-accent" />
        <AlertTitle className="text-accent">Design Token Integration Complete</AlertTitle>
        <AlertDescription>
          All styles are bound to CSS variables from your design system. Update tokens in 
          /styles/globals.css to instantly change all button styles across your application.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="variants" className="w-full">
        <TabsList>
          <TabsTrigger value="variants">All Variants</TabsTrigger>
          <TabsTrigger value="states">All States</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="icons">With Icons</TabsTrigger>
          <TabsTrigger value="code">Code Examples</TabsTrigger>
          <TabsTrigger value="tokens">Token Mapping</TabsTrigger>
        </TabsList>

        {/* Variants Tab */}
        <TabsContent value="variants" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Different visual styles for various use cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h4>Primary (Dark)</h4>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                      Imported from Figma - Main call-to-action button
                    </p>
                  </div>
                  <WugwebButton variant="primary" size="lg">
                    Button
                  </WugwebButton>
                </div>

                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h4>Secondary</h4>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                      Secondary actions with muted styling
                    </p>
                  </div>
                  <WugwebButton variant="secondary" size="lg">
                    Secondary Action
                  </WugwebButton>
                </div>

                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h4>Accent</h4>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                      High-emphasis accent for important actions
                    </p>
                  </div>
                  <WugwebButton variant="accent" size="lg">
                    Important Action
                  </WugwebButton>
                </div>

                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h4>Outline</h4>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                      Transparent with border for tertiary actions
                    </p>
                  </div>
                  <WugwebButton variant="outline" size="lg">
                    Tertiary Action
                  </WugwebButton>
                </div>

                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h4>Ghost</h4>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                      Minimal style for subtle interactions
                    </p>
                  </div>
                  <WugwebButton variant="ghost" size="lg">
                    Ghost Action
                  </WugwebButton>
                </div>

                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h4>Destructive</h4>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                      Dangerous actions like delete
                    </p>
                  </div>
                  <WugwebButton variant="destructive" size="lg">
                    Delete Action
                  </WugwebButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* States Tab */}
        <TabsContent value="states" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Interactive States</CardTitle>
              <CardDescription>
                All button states with proper design token bindings. Hover, focus, or click to see transitions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>Default State</p>
                  <WugwebButton variant="primary" size="lg">
                    Default
                  </WugwebButton>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Hover State
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginBottom: '12px' }}>
                    Hover over the button to see the hover state (accent color + border)
                  </p>
                  <WugwebButton variant="primary" size="lg">
                    Hover Me
                  </WugwebButton>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Focus State
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginBottom: '12px' }}>
                    Tab to focus this button (shows 2px accent ring)
                  </p>
                  <WugwebButton variant="primary" size="lg">
                    Focus Me
                  </WugwebButton>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Active/Pressed State
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginBottom: '12px' }}>
                    Click and hold to see the pressed state (full accent background)
                  </p>
                  <WugwebButton variant="primary" size="lg">
                    Press Me
                  </WugwebButton>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Disabled State
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginBottom: '12px' }}>
                    50% opacity, cursor not-allowed
                  </p>
                  <WugwebButton variant="primary" size="lg" disabled>
                    Disabled
                  </WugwebButton>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Loading State
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginBottom: '12px' }}>
                    Shows animated spinner, button is disabled
                  </p>
                  <WugwebButton variant="primary" size="lg" loading>
                    Processing...
                  </WugwebButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sizes Tab */}
        <TabsContent value="sizes" style={{ marginTop: '24px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Button Sizes</CardTitle>
              <CardDescription>Four size options for different UI contexts</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Small (40px height)
                  </p>
                  <WugwebButton variant="primary" size="sm">
                    Small Button
                  </WugwebButton>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Medium (48px height)
                  </p>
                  <WugwebButton variant="primary" size="md">
                    Medium Button
                  </WugwebButton>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Large (64px height) - From Figma
                  </p>
                  <WugwebButton variant="primary" size="lg">
                    Large Button
                  </WugwebButton>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Extra Large (72px height)
                  </p>
                  <WugwebButton variant="primary" size="xl">
                    Extra Large Button
                  </WugwebButton>
                </div>

                <div style={{ width: '100%' }}>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Full Width
                  </p>
                  <WugwebButton variant="primary" size="lg" fullWidth>
                    Full Width Button
                  </WugwebButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Icons Tab */}
        <TabsContent value="icons" style={{ marginTop: '24px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Buttons with Icons</CardTitle>
              <CardDescription>
                Imported Figma design includes left and right icon slots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Left Icon Only
                  </p>
                  <WugwebButton variant="primary" size="lg" leftIcon={<Download />}>
                    Download
                  </WugwebButton>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Right Icon Only
                  </p>
                  <WugwebButton variant="primary" size="lg" rightIcon={<ArrowRight />}>
                    Continue
                  </WugwebButton>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Both Icons (Figma Import Style)
                  </p>
                  <WugwebButton variant="primary" size="lg" leftIcon={<ArrowRight />} rightIcon={<ArrowRight />}>
                    Button
                  </WugwebButton>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Icon-only (Text can be hidden for icon buttons)
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <WugwebButton variant="primary" size="lg" leftIcon={<Check />}>
                      Approve
                    </WugwebButton>
                    <WugwebButton variant="destructive" size="lg" leftIcon={<X />}>
                      Reject
                    </WugwebButton>
                  </div>
                </div>

                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
                    Different Variants with Icons
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <WugwebButton variant="accent" size="md" leftIcon={<Check />}>
                      Save
                    </WugwebButton>
                    <WugwebButton variant="outline" size="md" leftIcon={<Download />}>
                      Export
                    </WugwebButton>
                    <WugwebButton variant="destructive" size="md" leftIcon={<Trash2 />}>
                      Delete
                    </WugwebButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <CardTitle>Usage Examples</CardTitle>
                  <CardDescription>Copy and paste these examples into your code</CardDescription>
                </div>
                <WugwebButton
                  variant="outline"
                  size="sm"
                  onClick={() => copyCode(codeExample)}
                  leftIcon={copiedCode ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                >
                  {copiedCode ? 'Copied!' : 'Copy All'}
                </WugwebButton>
              </div>
            </CardHeader>
            <CardContent>
              <pre 
                className="bg-muted"
                style={{ 
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  fontSize: 'var(--text-sm)',
                  overflowX: 'auto',
                  lineHeight: '1.6'
                }}
              >
                <code>{codeExample}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tokens Tab */}
        <TabsContent value="tokens" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Design Token Mapping</CardTitle>
              <CardDescription>
                All button styles are mapped to CSS variables from /styles/globals.css
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h4 style={{ marginBottom: '16px' }}>Primary Variant Tokens</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {primaryTokens.map((token, index) => (
                      <div 
                        key={index}
                        className="bg-muted"
                        style={{ 
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px'
                        }}
                      >
                        <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{token.property}</span>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <code className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                            {token.value}
                          </code>
                          <Badge variant="secondary">{token.token}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ marginBottom: '16px' }}>Typography Tokens</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {typographyTokens.map((token, index) => (
                      <div 
                        key={index}
                        className="bg-muted"
                        style={{ 
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px'
                        }}
                      >
                        <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{token.property}</span>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <code className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                            {token.value}
                          </code>
                          <Badge variant="secondary">{token.token}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ marginBottom: '16px' }}>Interactive State Tokens</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stateTokens.map((token, index) => (
                      <div 
                        key={index}
                        className="bg-muted"
                        style={{ 
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px'
                        }}
                      >
                        <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{token.state}</span>
                        <Badge variant="secondary">{token.tokens}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const codeExample = `import { Button } from './components/wugweb/Button';
import { ArrowRight, Download, Trash2 } from 'lucide-react';

// Primary button (from Figma import)
<Button variant="primary" size="lg">
  Button
</Button>

// With icons (Figma style)
<Button variant="primary" size="lg" leftIcon={<ArrowRight />} rightIcon={<ArrowRight />}>
  Button
</Button>

// Different variants
<Button variant="secondary" size="md">
  Secondary
</Button>

<Button variant="accent" size="lg">
  Important Action
</Button>

<Button variant="outline" size="md">
  Tertiary
</Button>

<Button variant="destructive" size="md" leftIcon={<Trash2 />}>
  Delete
</Button>

// With loading state
<Button variant="primary" loading>
  Processing...
</Button>

// Disabled state
<Button variant="primary" disabled>
  Disabled
</Button>

// Full width
<Button variant="primary" fullWidth>
  Full Width
</Button>`;

const primaryTokens = [
  { property: 'Background', value: '#2b2b2b', token: '--secondary' },
  { property: 'Text Color', value: '#ffffff', token: '--foreground' },
  { property: 'Border', value: '#444444', token: '--border' },
  { property: 'Border Radius', value: '12px', token: '--radius-lg' },
  { property: 'Padding', value: '20px', token: 'custom spacing' },
  { property: 'Height', value: '64px', token: 'size-lg' },
];

const typographyTokens = [
  { property: 'Font Family', value: 'Inter Tight', token: 'body font' },
  { property: 'Font Size', value: '20px', token: '--text-xl' },
  { property: 'Font Weight', value: '600', token: '--font-weight-semibold' },
  { property: 'Line Height', value: '1.5', token: 'default' },
];

const stateTokens = [
  { state: 'Hover', tokens: 'bg: --background, text: --accent, border: --accent' },
  { state: 'Pressed/Active', tokens: 'bg: --accent, text: --accent-foreground' },
  { state: 'Focus', tokens: 'ring: --ring (2px outline)' },
  { state: 'Disabled', tokens: 'opacity: 0.5, cursor: not-allowed' },
];
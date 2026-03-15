import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../wugweb/Button';
import { Badge } from '../../ui/badge';
import { Download, Upload, FileCode, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { copyToClipboard as safeCopy } from '../../../utils/clipboard';

export function FigmaImportGuide() {
  const [copiedStep, setCopiedStep] = React.useState<number | null>(null);

  const copyToClipboard = async (text: string, stepNumber: number) => {
    const success = await safeCopy(text);
    if (success) {
      setCopiedStep(stepNumber);
      setTimeout(() => setCopiedStep(null), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1>Figma Import Guide</h1>
        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-lg)', marginTop: '16px' }}>
          Follow these steps to export your Figma components and prepare them for integration 
          with the Wugweb Kits design system.
        </p>
      </div>

      <Alert>
        <AlertCircle size={20} />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          This guide will help you export components from Figma. Once exported, you'll paste 
          the component code and I'll integrate it with your design tokens.
        </AlertDescription>
      </Alert>

      {/* Step 1: Organize Components in Figma */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div 
              className="bg-accent text-foreground"
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              1
            </div>
            <CardTitle>Organize Components in Figma</CardTitle>
          </div>
          <CardDescription>
            Prepare your Figma file with proper component organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ marginBottom: '8px' }}>Component Naming Convention</h4>
              <div 
                className="bg-muted"
                style={{ borderRadius: 'var(--radius-md)', padding: '16px' }}
              >
                <code>Category/ComponentName/Variant/State</code>
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    Examples:
                  </p>
                  <code className="text-foreground">Buttons/Primary/Default</code>
                  <code className="text-foreground">Buttons/Primary/Hover</code>
                  <code className="text-foreground">Buttons/Primary/Disabled</code>
                  <code className="text-foreground">Inputs/TextField/Default</code>
                  <code className="text-foreground">Inputs/TextField/Active</code>
                  <code className="text-foreground">Inputs/TextField/Error</code>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '8px' }}>Categories to Export</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Buttons', 'Inputs', 'Cards', 'Modals', 'Badges', 'Icons', 'Dropdowns', 'Checkboxes', 'Radio Buttons', 'Toggles'].map(category => (
                  <Badge key={category} variant="secondary">{category}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Export as React Components */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div 
              className="bg-accent text-foreground"
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              2
            </div>
            <CardTitle>Export Components</CardTitle>
          </div>
          <CardDescription>
            Use Figma's built-in export or "Copy as CSS" feature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h4 style={{ marginBottom: '12px' }}>Method A: Copy as CSS (Recommended)</h4>
              <ol className="list-decimal list-inside" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Select a component in Figma</li>
                <li>Right-click → Copy/Paste as → Copy as CSS</li>
                <li>Paste the CSS into a text file</li>
                <li>Repeat for each component variant and state</li>
              </ol>
            </div>

            <div>
              <h4 style={{ marginBottom: '12px' }}>Method B: Figma Dev Mode</h4>
              <ol className="list-decimal list-inside" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Open Dev Mode (Shift + D)</li>
                <li>Select a component</li>
                <li>Click "Inspect" panel on the right</li>
                <li>Copy the CSS or React properties</li>
                <li>Note down: colors, padding, border-radius, font-size, font-weight</li>
              </ol>
            </div>

            <Alert>
              <AlertCircle size={20} />
              <AlertDescription>
                Focus on extracting: background colors, border colors, border radius, padding, 
                font sizes, font weights, and spacing values. We'll map these to your design tokens.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Component Data Format */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div 
              className="bg-accent text-foreground"
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              3
            </div>
            <CardTitle>Format Component Data</CardTitle>
          </div>
          <CardDescription>
            Structure your component information in this format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-muted-foreground">
              For each component, provide the following information:
            </p>
            
            <div 
              className="bg-muted"
              style={{ borderRadius: 'var(--radius-md)', padding: '16px', position: 'relative' }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`Component: Button Primary
Category: Buttons
Variants: Default, Hover, Focused, Disabled

--- Default State ---
Background: #2b2b2b
Text Color: #ffffff
Border: 1px solid #444444
Border Radius: 8px
Padding: 12px 16px
Font Size: 16px
Font Weight: 500
Height: 48px

--- Hover State ---
Background: #000000
Text Color: #ffbe1a
Border: 1px solid #ffbe1a
[... rest of properties ...]`, 1)}
                style={{ position: 'absolute', top: '8px', right: '8px' }}
              >
                {copiedStep === 1 ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </Button>
              <pre style={{ fontSize: 'var(--text-sm)', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
{`Component: Button Primary
Category: Buttons
Variants: Default, Hover, Focused, Disabled

--- Default State ---
Background: #2b2b2b
Text Color: #ffffff
Border: 1px solid #444444
Border Radius: 8px
Padding: 12px 16px
Font Size: 16px
Font Weight: 500
Height: 48px

--- Hover State ---
Background: #000000
Text Color: #ffbe1a
Border: 1px solid #ffbe1a
Border Radius: 8px
Padding: 12px 16px
Font Size: 16px
Font Weight: 500
Height: 48px

[... continue for all states ...]`}
              </pre>
            </div>

            <Alert>
              <CheckCircle2 size={20} />
              <AlertDescription>
                Don't worry about exact formatting - just provide the component name, category, 
                and styling properties for each state. I'll map them to your design tokens automatically.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Export Component Images */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div 
              className="bg-accent text-foreground"
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              4
            </div>
            <CardTitle>Export Component Thumbnails</CardTitle>
          </div>
          <CardDescription>
            Create visual previews for the component gallery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ol className="list-decimal list-inside" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Select each component in Figma</li>
              <li>Right-click → Export → PNG (2x resolution)</li>
              <li>Save with naming: <code className="bg-muted px-2 py-1" style={{ borderRadius: 'var(--radius-sm)' }}>component-name-variant.png</code></li>
              <li>Keep thumbnails at approximately 400x300px</li>
            </ol>

            <div 
              className="bg-muted"
              style={{ borderRadius: 'var(--radius-md)', padding: '16px' }}
            >
              <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '8px' }}>Example filenames:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <code>button-primary-default.png</code>
                <code>button-secondary-default.png</code>
                <code>input-text-default.png</code>
                <code>card-default.png</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 5: Submit Components */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div 
              className="bg-accent text-foreground"
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              5
            </div>
            <CardTitle>Submit for Integration</CardTitle>
          </div>
          <CardDescription>
            Provide the component data and I'll integrate it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-muted-foreground">
              Once you've gathered all the component information, send me:
            </p>
            
            <div 
              className="bg-card border border-border"
              style={{ borderRadius: 'var(--radius-md)', padding: '16px' }}
            >
              <ul className="list-disc list-inside" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Component specifications (colors, spacing, typography)</li>
                <li>All variants and states for each component</li>
                <li>Thumbnail images (or describe them)</li>
                <li>Any interactive behaviors or animations</li>
              </ul>
            </div>

            <Alert className="bg-accent/10 border-accent">
              <CheckCircle2 size={20} className="text-accent" />
              <AlertTitle className="text-accent">Ready to Start</AlertTitle>
              <AlertDescription>
                I'll then create React components bound to your design tokens, generate 
                interactive documentation, and build the component gallery.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Token Mapping Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Design Token Mapping Reference</CardTitle>
          <CardDescription>
            How your Figma values will map to design tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div>
              <h4 style={{ marginBottom: '12px' }}>Colors</h4>
              <div 
                className="bg-muted"
                style={{ borderRadius: 'var(--radius-md)', padding: '12px', fontSize: 'var(--text-sm)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><code>#2b2b2b</code> → <code>Neutral 8</code></div>
                  <div><code>#ffffff</code> → <code>Neutral 1</code></div>
                  <div><code>#ffbe1a</code> → <code>Accent main</code></div>
                  <div><code>#ef4343</code> → <code>Error 500</code></div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '12px' }}>Border Radius</h4>
              <div 
                className="bg-muted"
                style={{ borderRadius: 'var(--radius-md)', padding: '12px', fontSize: 'var(--text-sm)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><code>4px</code> → <code>r-2</code></div>
                  <div><code>8px</code> → <code>r-4</code></div>
                  <div><code>12px</code> → <code>r-6</code></div>
                  <div><code>999px</code> → <code>r-9</code></div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '12px' }}>Font Sizes</h4>
              <div 
                className="bg-muted"
                style={{ borderRadius: 'var(--radius-md)', padding: '12px', fontSize: 'var(--text-sm)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><code>14px</code> → <code>sm</code></div>
                  <div><code>16px</code> → <code>md</code></div>
                  <div><code>20px</code> → <code>xl</code></div>
                  <div><code>24px</code> → <code>2xl</code></div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '12px' }}>Spacing</h4>
              <div 
                className="bg-muted"
                style={{ borderRadius: 'var(--radius-md)', padding: '12px', fontSize: 'var(--text-sm)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><code>8px</code> → <code>s-3</code></div>
                  <div><code>12px</code> → <code>s-4</code></div>
                  <div><code>16px</code> → <code>s-5</code></div>
                  <div><code>24px</code> → <code>s-7</code></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Component */}
      <Card>
        <CardHeader>
          <CardTitle>Example: Complete Button Component Export</CardTitle>
          <CardDescription>
            Here's what a complete component export should look like
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="bg-muted"
            style={{ borderRadius: 'var(--radius-md)', padding: '16px', position: 'relative' }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(`Component: Primary Button
Category: Buttons
Description: Main call-to-action button used throughout the interface

=== VARIANTS & STATES ===

Variant: Default / State: Default
- Background: #2b2b2b (Neutral 8)
- Text: #ffffff (Neutral 1)
- Border: 1px solid #444444 (Neutral 7)
- Border Radius: 8px
- Padding: 12px 16px
- Font Size: 16px
- Font Weight: 500
- Height: 48px

Variant: Default / State: Hover
- Background: #000000 (Neutral 10)
- Text: #ffbe1a (Accent main)
- Border: 1px solid #ffbe1a (Accent main)
- Border Radius: 8px
- Padding: 12px 16px
- Font Size: 16px
- Font Weight: 500
- Height: 48px

Variant: Default / State: Focused
- Background: #ffbe1a (Accent main)
- Text: #000000 (Neutral 10)
- Border: 1px solid #ffbe1a (Accent main)
- Border Radius: 8px
- Padding: 12px 16px
- Font Size: 16px
- Font Weight: 500
- Height: 48px

Variant: Default / State: Disabled
- Background: #2b2b2b (Neutral 8)
- Text: #ffffff at 50% opacity
- Border: 1px solid #444444 (Neutral 7)
- Border Radius: 8px
- Padding: 12px 16px
- Font Size: 16px
- Font Weight: 500
- Height: 48px
- Opacity: 0.5

=== USAGE NOTES ===
Use for primary actions like "Submit", "Save", "Continue"
`, 2)}
              style={{ position: 'absolute', top: '8px', right: '8px' }}
            >
              {copiedStep === 2 ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            </Button>
            <pre style={{ fontSize: 'var(--text-sm)', overflowX: 'auto', whiteSpace: 'pre-wrap', paddingRight: '40px' }}>
{`Component: Primary Button
Category: Buttons
Description: Main call-to-action button

=== VARIANTS & STATES ===

Variant: Default / State: Default
- Background: #2b2b2b (Neutral 8)
- Text: #ffffff (Neutral 1)
- Border: 1px solid #444444 (Neutral 7)
- Border Radius: 8px
- Padding: 12px 16px
- Font Size: 16px
- Font Weight: 500
- Height: 48px

Variant: Default / State: Hover
- Background: #000000 (Neutral 10)
- Text: #ffbe1a (Accent main)
- Border: 1px solid #ffbe1a
- Border Radius: 8px
- Padding: 12px 16px
- Font Size: 16px
- Font Weight: 500
- Height: 48px

[... continue for all states ...]`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div 
        className="bg-accent/10 border border-accent"
        style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}
      >
        <h2 style={{ marginBottom: '16px' }}>Ready to Submit Your Components?</h2>
        <p className="text-muted-foreground" style={{ marginBottom: '24px' }}>
          Once you've exported your Figma components following this guide, paste the component 
          specifications in our conversation and I'll:
        </p>
        <ul className="list-disc list-inside text-muted-foreground" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <li>Map all values to your design tokens automatically</li>
          <li>Create React components with proper state management</li>
          <li>Generate interactive documentation pages</li>
          <li>Build a searchable component gallery</li>
          <li>Add code snippets showing token usage</li>
        </ul>
        <Button size="lg">
          I'm Ready - Let's Start Importing Components
        </Button>
      </div>
    </div>
  );
}
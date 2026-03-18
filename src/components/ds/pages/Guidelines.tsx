import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { CheckCircle2, XCircle, Info, Lightbulb } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection } from '../PageWrapper';

export function Guidelines() {
  return (
    <PageWrapper>
      <PageHeader
        title="Design Guidelines"
        description="Best practices and principles for creating consistent, accessible, and delightful user experiences with Wugweb Kits."
      />

      {/* Design Principles */}
      <PageSection
        title="Design Principles"
        description="Core principles that guide our design decisions."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Consistency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use design tokens and components consistently across all interfaces to create 
                a unified experience. Consistent patterns help users learn faster and feel more confident.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Clarity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Clear communication through visual hierarchy, readable typography, and intuitive layouts. 
                Every element should have a clear purpose and meaning.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Design for all users, regardless of ability. Follow WCAG guidelines, ensure proper 
                contrast, and support keyboard navigation and screen readers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Help users accomplish tasks quickly with minimal friction. Reduce cognitive load 
                and provide clear paths to completion.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Layout Guidelines */}
      <PageSection
        title="Layout & Spacing"
        description="Guidelines for creating well-structured and balanced layouts."
      >
        <Card>
          <CardHeader>
            <CardTitle>8-Point Grid System</CardTitle>
            <CardDescription>Maintain vertical rhythm and consistent spacing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Why 8-Point Grid?</AlertTitle>
              <AlertDescription>
                Using an 8-point grid creates mathematical harmony and ensures elements align properly 
                across different screen sizes. All spacing should be multiples of 8px: 8, 16, 24, 32, 40, 48, 64, etc.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Do: Use multiples of 8</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    margin: 16px, padding: 24px, gap: 32px
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Don't: Use arbitrary values</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    margin: 13px, padding: 27px, gap: 35px
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: 'var(--spacing-6)' }}>
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Container Widths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Small</span>
                <Badge variant="outline">640px</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Medium</span>
                <Badge variant="outline">768px</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Large</span>
                <Badge variant="outline">1024px</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Extra Large</span>
                <Badge variant="outline">1280px</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Responsive Breakpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mobile</span>
                <Badge variant="outline">0-640px</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tablet</span>
                <Badge variant="outline">640-1024px</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Desktop</span>
                <Badge variant="outline">1024-1280px</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wide</span>
                <Badge variant="outline">1280px+</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Color Usage */}
      <PageSection
        title="Color Usage"
        description="Guidelines for applying colors consistently and effectively."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Do's</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Use accent color sparingly for important actions and highlights
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Ensure sufficient contrast between text and background (4.5:1 minimum)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Use destructive color only for delete/remove actions
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Test colors with colorblind simulators
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Don'ts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <XCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Avoid using too many colors in a single interface
                </p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Don't rely on color alone to convey information
                </p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Never use accent color for large backgrounds
                </p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Avoid pure black (#000000) on pure white (#FFFFFF)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Typography */}
      <PageSection
        title="Typography"
        description="Best practices for readable and scannable text."
      >
        <Card>
          <CardHeader>
            <CardTitle>Typography Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4>Hierarchy</h4>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside" style={{ fontSize: 'var(--text-sm)' }}>
                  <li>Use heading tags (h1-h4) for structure</li>
                  <li>Maintain clear size differentiation</li>
                  <li>Limit heading levels to 3-4 per page</li>
                  <li>One h1 per page for main title</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4>Readability</h4>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside" style={{ fontSize: 'var(--text-sm)' }}>
                  <li>Line length: 50-75 characters optimal</li>
                  <li>Line height: 1.5 for body text</li>
                  <li>Paragraph spacing: 1em between paragraphs</li>
                  <li>Use sentence case for UI labels</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Iconography */}
      <PageSection
        title="Iconography"
        description="Guidelines for using icons effectively."
      >
        <Card>
          <CardHeader>
            <CardTitle>Icon Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Lightbulb size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Use Familiar Icons</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    Stick to universally recognized icons (home, search, settings, etc.)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lightbulb size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Pair with Labels</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    Include text labels for clarity, especially for less common actions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lightbulb size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Consistent Sizing</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    Use 16px, 20px, or 24px for most UI icons
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lightbulb size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Provide Alt Text</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    Always include aria-label or alt text for icon-only buttons
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Motion */}
      <PageSection
        title="Motion & Animation"
        description="Guidelines for meaningful and accessible motion."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Micro-interactions</span>
                <Badge variant="outline">100-200ms</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Small elements</span>
                <Badge variant="outline">200-300ms</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Medium elements</span>
                <Badge variant="outline">300-400ms</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Large elements</span>
                <Badge variant="outline">400-500ms</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Easing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entering</span>
                <Badge variant="outline">ease-out</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exiting</span>
                <Badge variant="outline">ease-in</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Moving</span>
                <Badge variant="outline">ease-in-out</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Default</span>
                <Badge variant="outline">cubic-bezier</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert style={{ marginTop: 'var(--spacing-6)' }}>
          <Info className="h-4 w-4" />
          <AlertTitle>Respect User Preferences</AlertTitle>
          <AlertDescription>
            Always respect the prefers-reduced-motion media query. Users who enable this setting 
            should see minimal or no animations.
          </AlertDescription>
        </Alert>
      </PageSection>
    </PageWrapper>
  );
}
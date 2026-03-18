import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection } from '../PageWrapper';

export function Accessibility() {
  const contrastPairs = [
    { bg: 'var(--background)', fg: 'var(--foreground)', name: 'Background / Foreground', ratio: '21:1', level: 'AAA' },
    { bg: 'var(--primary)', fg: 'var(--primary-foreground)', name: 'Primary / Primary Foreground', ratio: '16:1', level: 'AAA' },
    { bg: 'var(--accent)', fg: 'var(--accent-foreground)', name: 'Accent / Accent Foreground', ratio: '8.2:1', level: 'AAA' },
    { bg: 'var(--muted)', fg: 'var(--muted-foreground)', name: 'Muted / Muted Foreground', ratio: '4.8:1', level: 'AA' },
  ];

  return (
    <PageWrapper>
      <PageHeader
        title="Accessibility"
        description="Wugweb Kits is built with accessibility at its core, ensuring all users can interact with your applications effectively."
      />

      {/* WCAG Compliance */}
      <PageSection
        title="WCAG Compliance"
        description="Our design system meets WCAG 2.1 Level AA standards across all components."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 bg-accent/10 text-accent"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <CheckCircle2 size={24} />
                </div>
                <CardTitle style={{ fontSize: 'var(--text-lg)' }}>WCAG 2.1</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Adheres to Web Content Accessibility Guidelines 2.1 standards
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 bg-accent/10 text-accent"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <CheckCircle2 size={24} />
                </div>
                <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Level AA</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Meets Level AA conformance for enhanced accessibility
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 bg-accent/10 text-accent"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <CheckCircle2 size={24} />
                </div>
                <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Inclusive</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Designed for users of all abilities and assistive technologies
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Color Contrast */}
      <PageSection
        title="Color Contrast"
        description="All color combinations meet or exceed minimum contrast ratios for readability."
      >
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Contrast Requirements</AlertTitle>
          <AlertDescription>
            WCAG AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. 
            AAA level requires 7:1 and 4.5:1 respectively.
          </AlertDescription>
        </Alert>

        <div className="space-y-4" style={{ marginTop: 'var(--spacing-6)' }}>
          {contrastPairs.map((pair, index) => (
            <Card key={index}>
              <CardContent style={{ padding: 'var(--spacing-6)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
                  <div className="flex items-center gap-4">
                    <div className="flex">
                      <div
                        className="w-12 h-12 border border-border"
                        style={{
                          backgroundColor: pair.bg,
                          borderTopLeftRadius: 'var(--radius-md)',
                          borderBottomLeftRadius: 'var(--radius-md)',
                        }}
                      />
                      <div
                        className="w-12 h-12 border border-border border-l-0"
                        style={{
                          backgroundColor: pair.fg,
                          borderTopRightRadius: 'var(--radius-md)',
                          borderBottomRightRadius: 'var(--radius-md)',
                        }}
                      />
                    </div>
                    <div>
                      <p style={{ fontWeight: 'var(--font-weight-medium)' }}>{pair.name}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                        Contrast Ratio: {pair.ratio}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-accent text-accent-foreground">
                    {pair.level}
                  </Badge>
                </div>
                <div
                  style={{
                    padding: 'var(--spacing-4)',
                    backgroundColor: pair.bg,
                    color: pair.fg,
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <p>Example text with this color combination</p>
                  <p style={{ fontSize: 'var(--text-sm)' }}>
                    This demonstrates the contrast between background and foreground colors.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      {/* Keyboard Navigation */}
      <PageSection
        title="Keyboard Navigation"
        description="All interactive components are fully keyboard accessible."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Standard Keys</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Navigate</span>
                <Badge variant="outline">Tab / Shift+Tab</Badge>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Activate</span>
                <Badge variant="outline">Enter / Space</Badge>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Close</span>
                <Badge variant="outline">Escape</Badge>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Arrow Keys</span>
                <Badge variant="outline">↑ ↓ ← →</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Focus Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <div className="flex gap-3">
                <CheckCircle2 size={16} className="text-accent mt-1 flex-shrink-0" />
                <p style={{ fontSize: 'var(--text-sm)' }}>Visible focus indicators on all interactive elements</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 size={16} className="text-accent mt-1 flex-shrink-0" />
                <p style={{ fontSize: 'var(--text-sm)' }}>Logical tab order following visual flow</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 size={16} className="text-accent mt-1 flex-shrink-0" />
                <p style={{ fontSize: 'var(--text-sm)' }}>Focus trapped in modals and dialogs</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 size={16} className="text-accent mt-1 flex-shrink-0" />
                <p style={{ fontSize: 'var(--text-sm)' }}>Focus restored when closing overlays</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Screen Reader Support */}
      <PageSection
        title="Screen Reader Support"
        description="Components include proper ARIA labels and semantic HTML for assistive technologies."
      >
        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Semantic HTML</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    Use appropriate HTML elements (button, nav, main, etc.) for better structure
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>ARIA Labels</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    Provide descriptive labels for interactive elements and dynamic content
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Live Regions</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    Announce dynamic changes to screen reader users using ARIA live regions
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Alt Text</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    All images include descriptive alternative text or are marked as decorative
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Testing Tools */}
      <PageSection
        title="Testing & Validation"
        description="Recommended tools and practices for accessibility testing."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Automated Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>axe DevTools browser extension</li>
                <li>Lighthouse accessibility audit</li>
                <li>WAVE accessibility evaluation tool</li>
                <li>Pa11y automated testing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Manual Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>Keyboard-only navigation testing</li>
                <li>Screen reader testing (NVDA, JAWS, VoiceOver)</li>
                <li>Color contrast verification</li>
                <li>Zoom and text scaling (up to 200%)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Resources */}
      <PageSection>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Additional Resources</AlertTitle>
          <AlertDescription>
            For more information on accessibility best practices, visit the W3C Web Accessibility Initiative (WAI) 
            and review the WCAG 2.1 guidelines at w3.org/WAI.
          </AlertDescription>
        </Alert>
      </PageSection>
    </PageWrapper>
  );
}
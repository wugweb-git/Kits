import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { GitBranch, GitPullRequest, FileText, MessageSquare, CheckCircle2 } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection } from '../PageWrapper';

export function Contribute() {
  return (
    <PageWrapper>
      <PageHeader
        title="Contribute"
        description="Help us improve Wugweb Kits! We welcome contributions from designers and developers to make our design system better for everyone."
      />

      {/* How to Contribute */}
      <PageSection
        title="How to Contribute"
        description="There are many ways to contribute to the Wugweb Kits design system."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <div 
                className="inline-flex p-3 bg-accent/10 text-accent mb-2"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <FileText size={24} />
              </div>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Improve guides, fix typos, or add examples to make docs clearer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div 
                className="inline-flex p-3 bg-accent/10 text-accent mb-2"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <GitBranch size={24} />
              </div>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Components</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Propose new components or improve existing ones.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div 
                className="inline-flex p-3 bg-accent/10 text-accent mb-2"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <MessageSquare size={24} />
              </div>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Report bugs, suggest features, or share your use cases.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div 
                className="inline-flex p-3 bg-accent/10 text-accent mb-2"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <GitPullRequest size={24} />
              </div>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Code Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Help review pull requests and provide constructive feedback.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Contribution Process */}
      <PageSection
        title="Contribution Process"
        description="Follow these steps to contribute to the design system."
      >
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: 'Discuss Your Idea',
              description: 'Open an issue or discussion to share your proposal. This helps us understand your use case and provide guidance before you start working.',
            },
            {
              step: 2,
              title: 'Review Guidelines',
              description: 'Read our design principles and technical guidelines to ensure your contribution aligns with our standards.',
            },
            {
              step: 3,
              title: 'Create Your Changes',
              description: 'Fork the repository, create a branch, and make your changes. Follow our coding standards and design tokens.',
            },
            {
              step: 4,
              title: 'Test Thoroughly',
              description: 'Test your changes across different browsers, screen sizes, and with assistive technologies. Ensure accessibility compliance.',
            },
            {
              step: 5,
              title: 'Submit Pull Request',
              description: 'Create a pull request with a clear description of your changes. Include screenshots or videos for visual changes.',
            },
            {
              step: 6,
              title: 'Iterate on Feedback',
              description: 'Work with maintainers to refine your contribution. Be open to suggestions and make requested changes promptly.',
            },
          ].map((item) => (
            <Card key={item.step}>
              <CardContent style={{ padding: 'var(--spacing-6)' }}>
                <div className="flex gap-6">
                  <div 
                    className="flex items-center justify-center w-12 h-12 bg-accent text-accent-foreground flex-shrink-0"
                    style={{ 
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 'var(--font-weight-bold)'
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h4 style={{ marginBottom: 'var(--spacing-2)' }}>{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      {/* Guidelines for Contributors */}
      <PageSection
        title="Contribution Guidelines"
        description="Standards and requirements for contributions."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Design Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Use existing design tokens (colors, spacing, typography)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Follow 8-point grid system for spacing
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Maintain consistent visual style with existing components
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Ensure responsive design across breakpoints
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Code Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Write clean, readable, and well-documented code
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Include proper TypeScript types
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Follow React best practices and hooks patterns
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Add comprehensive examples and usage documentation
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Accessibility Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Meet WCAG 2.1 Level AA standards
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Ensure keyboard navigation works properly
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Include proper ARIA labels and roles
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Test with screen readers (NVDA, JAWS, VoiceOver)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Documentation Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Provide clear component description and use cases
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Include code examples for all variants
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Document props, types, and default values
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Add accessibility notes and keyboard shortcuts
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Request Features */}
      <PageSection
        title="Request New Features"
        description="Have an idea for a new component or token? Let us know!"
      >
        <Card>
          <CardHeader>
            <CardTitle>Feature Request Template</CardTitle>
            <CardDescription>Use this template when requesting new features</CardDescription>
          </CardHeader>
          <CardContent 
            className="bg-muted p-6"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <pre 
              className="text-foreground whitespace-pre-wrap"
              style={{ fontSize: 'var(--text-sm)' }}
            >
{`**Feature Description**
Brief description of the proposed feature

**Problem Statement**
What problem does this solve?

**Use Cases**
How would this be used? Provide examples.

**Design Considerations**
Any specific design requirements or constraints?

**Alternatives Considered**
What alternatives have you explored?

**Additional Context**
Screenshots, mockups, or links to similar implementations`}
            </pre>
          </CardContent>
        </Card>
      </PageSection>

      {/* Get Help */}
      <PageSection
        title="Get Help"
        description="Need assistance with your contribution?"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>GitHub Discussions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Ask questions and discuss ideas with the community
              </p>
              <Button variant="outline" className="w-full">
                Open Discussion
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Issue Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Report bugs or suggest enhancements
              </p>
              <Button variant="outline" className="w-full">
                Create Issue
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Team Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Reach out to the core team directly
              </p>
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <Alert>
        <MessageSquare className="h-4 w-4" />
        <AlertTitle>Thank You!</AlertTitle>
        <AlertDescription>
          Every contribution, no matter how small, helps make Wugweb Kits better for everyone. 
          We appreciate your time and effort in improving our design system.
        </AlertDescription>
      </Alert>
    </PageWrapper>
  );
}
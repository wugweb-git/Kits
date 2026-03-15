import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Slider } from '../../ui/slider';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Card as WugCard } from '../../wugweb/Card';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { Zap, Layout, Figma, Box, Slack, Hash, Disc } from 'lucide-react';
import { cn } from '../../ui/utils';

// --- Internal Utilities for Documentation (Moved from Patterns.tsx) ---

const PatternHeader = ({ title, description }: { title: string, description: string }) => (
  <div className="mb-[var(--spacing-6)]">
    <h2 className="text-[var(--foreground)] text-[length:var(--text-2xl)] font-bold mb-[var(--spacing-2)] tracking-tight">
      {title}
    </h2>
    <p className="text-[var(--muted-foreground)] text-[length:var(--text-base)] max-w-3xl leading-relaxed">
      {description}
    </p>
  </div>
);

const ViewportControl = ({ isMobile, setMobile }: { isMobile: boolean, setMobile: (v: boolean) => void }) => (
  <div className="flex bg-[var(--surface-900)] p-1 rounded-[var(--radius-md)] border border-[var(--border)]">
    <button
      onClick={() => setMobile(false)}
      className={cn(
        "px-3 py-1.5 rounded-[var(--radius-sm)] text-[length:var(--text-xs)] font-medium transition-all flex items-center gap-2",
        !isMobile ? "bg-[var(--surface-700)] text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      )}
    >
      Desktop
    </button>
    <button
      onClick={() => setMobile(true)}
      className={cn(
        "px-3 py-1.5 rounded-[var(--radius-sm)] text-[length:var(--text-xs)] font-medium transition-all flex items-center gap-2",
        isMobile ? "bg-[var(--surface-700)] text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      )}
    >
      Mobile
    </button>
  </div>
);

interface PatternViewerProps {
  children: React.ReactNode | ((isMobile: boolean) => React.ReactNode);
}

const PatternViewer = ({ children }: PatternViewerProps) => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className="border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--surface-900)] mb-[var(--spacing-10)]">
      <div className="border-b border-[var(--border)] bg-[var(--surface-800)] px-[var(--spacing-4)] py-[var(--spacing-3)] flex justify-between items-center">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[var(--border)] opacity-50" />
          <div className="w-3 h-3 rounded-full bg-[var(--border)] opacity-50" />
          <div className="w-3 h-3 rounded-full bg-[var(--border)] opacity-50" />
        </div>
        <ViewportControl isMobile={isMobile} setMobile={setIsMobile} />
      </div>
      
      <div className="bg-[var(--muted)] p-[var(--spacing-8)] overflow-x-auto flex justify-center min-h-[400px] relative">
        <div 
          className="transition-all duration-500 ease-[var(--motion-easing-emphasized)] origin-top"
          style={{ 
            width: isMobile ? '375px' : '100%',
            maxWidth: isMobile ? '375px' : '1000px',
          }}
        >
          {typeof children === 'function' ? children(isMobile) : children}
        </div>
      </div>
    </div>
  );
};

export function Playground() {
  const [borderRadius, setBorderRadius] = React.useState([8]);
  const [padding, setPadding] = React.useState([16]);
  const [buttonSize, setButtonSize] = React.useState([16]);

  return (
    <div className="space-y-16 animate-fade-in-up">
      <div>
        <h1 className="text-[length:var(--text-4xl)] font-bold text-[var(--foreground)] mb-[var(--spacing-3)] tracking-tight">Playground</h1>
        <p className="text-[var(--muted-foreground)] text-[length:var(--text-lg)] max-w-2xl leading-relaxed">
          Experiment with design tokens in real-time. Adjust values to see how they affect components.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Controls</CardTitle>
              <CardDescription>Adjust token values to see changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Border Radius</Label>
                  <Badge variant="outline">{borderRadius[0]}px</Badge>
                </div>
                <Slider
                  value={borderRadius}
                  onValueChange={setBorderRadius}
                  max={24}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Padding</Label>
                  <Badge variant="outline">{padding[0]}px</Badge>
                </div>
                <Slider
                  value={padding}
                  onValueChange={setPadding}
                  max={48}
                  step={4}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Button Font Size</Label>
                  <Badge variant="outline">{buttonSize[0]}px</Badge>
                </div>
                <Slider
                  value={buttonSize}
                  onValueChange={setButtonSize}
                  min={12}
                  max={24}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Values</CardTitle>
              <CardDescription>CSS variable format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div 
                className="bg-muted p-4"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <pre style={{ fontSize: 'var(--text-sm)' }}>
                  <code>{`--radius-custom: ${borderRadius[0]}px;
--padding-custom: ${padding[0]}px;
--font-size-custom: ${buttonSize[0]}px;`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See your changes in real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className="bg-accent text-accent-foreground p-8 text-center"
                style={{
                  borderRadius: `${borderRadius[0]}px`,
                  padding: `${padding[0]}px`,
                }}
              >
                <p style={{ fontSize: `${buttonSize[0]}px`, fontWeight: 'var(--font-weight-medium)' }}>
                  Preview Box
                </p>
                <p className="mt-2 opacity-75" style={{ fontSize: 'var(--text-sm)' }}>
                  Adjust the controls to see changes
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full"
                  style={{
                    borderRadius: `${borderRadius[0]}px`,
                    padding: `${padding[0]}px`,
                    fontSize: `${buttonSize[0]}px`,
                  }}
                >
                  Primary Button
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  style={{
                    borderRadius: `${borderRadius[0]}px`,
                    padding: `${padding[0]}px`,
                    fontSize: `${buttonSize[0]}px`,
                  }}
                >
                  Outline Button
                </Button>

                <div
                  className="bg-card border border-border"
                  style={{
                    borderRadius: `${borderRadius[0]}px`,
                    padding: `${padding[0]}px`,
                  }}
                >
                  <h4 style={{ fontSize: `${buttonSize[0] * 1.25}px` }}>Card Header</h4>
                  <p className="text-muted-foreground mt-2" style={{ fontSize: `${buttonSize[0] * 0.875}px` }}>
                    This card adapts to your token changes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <div className="flex gap-3">
                <div 
                  className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"
                  style={{ borderRadius: 'var(--radius-full)' }}
                />
                <p style={{ fontSize: 'var(--text-sm)' }}>
                  Use consistent border radius values across related components
                </p>
              </div>
              <div className="flex gap-3">
                <div 
                  className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"
                  style={{ borderRadius: 'var(--radius-full)' }}
                />
                <p style={{ fontSize: 'var(--text-sm)' }}>
                  Maintain 8px grid alignment for padding values
                </p>
              </div>
              <div className="flex gap-3">
                <div 
                  className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"
                  style={{ borderRadius: 'var(--radius-full)' }}
                />
                <p style={{ fontSize: 'var(--text-sm)' }}>
                  Keep font sizes within a modular scale for visual harmony
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Token Combinations */}
      <section className="space-y-6">
        <div>
          <h2>Token Combinations</h2>
          <p className="text-muted-foreground mt-2">
            Examples of well-balanced token combinations for common use cases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Compact</CardTitle>
              <CardDescription>Dense layouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge>4px radius</Badge>
              <Badge variant="outline">8px padding</Badge>
              <Badge variant="secondary">14px font</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Comfortable</CardTitle>
              <CardDescription>Balanced spacing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge>8px radius</Badge>
              <Badge variant="outline">16px padding</Badge>
              <Badge variant="secondary">16px font</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Spacious</CardTitle>
              <CardDescription>Generous whitespace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge>12px radius</Badge>
              <Badge variant="outline">24px padding</Badge>
              <Badge variant="secondary">18px font</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. Bento Grid (Moved from Patterns.tsx) */}
      <section>
        <PatternHeader 
          title="Bento Grid Composition" 
          description="A strict composition of standard Card components. The layout adapts explicitly between a single-column stack on mobile and a 3-column bento grid on desktop, utilizing distinct spacing tokens for each environment."
        />
        <PatternViewer>
          {(isMobile) => (
            <div className={cn(
              "max-w-[1000px] mx-auto",
              isMobile ? "w-full" : "w-full"
            )}>
              <div className={cn(
                "grid",
                isMobile ? "grid-cols-1 gap-[var(--spacing-2)]" : "grid-cols-3 gap-[var(--spacing-2)]"
              )}>
                
                {/* Column 1 */}
                <div className={cn("flex flex-col", isMobile ? "gap-[var(--spacing-2)]" : "gap-[var(--spacing-2)]")}>
                  {/* Strategic Brand Vision (White Tone) */}
                  <WugCard variant="elevated" className="flex-1 flex flex-col p-[var(--spacing-4)] rounded-[var(--radius-lg)] bg-[var(--foreground)] border border-[var(--border)]">
                    <div className="flex-1 mb-[var(--spacing-4)] bg-[var(--surface-950)] rounded-[var(--radius-md)] overflow-hidden relative min-h-[var(--spacing-64)]">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1762081512138-1c0896b35666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbWluaW1hbCUyMHNtYXJ0cGhvbmUlMjBtb2NrdXAlMjBtYXR0ZSUyMGJsYWNrfGVufDF8fHx8MTc2OTUxMzg0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Strategic Vision"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                      />
                    </div>
                    <div>
                      <h3 className="text-[length:var(--text-lg)] font-bold text-[var(--background)] mb-[var(--spacing-2)] leading-tight tracking-tight">
                        Strategic Brand Vision
                      </h3>
                      <p className="text-[length:var(--text-sm)] text-[var(--surface-600)] leading-relaxed opacity-90">
                        Resonant brand foundations are architected through the synthesis of strategic insight and creative brilliance.
                      </p>
                    </div>
                  </WugCard>

                  {/* CTA Button Card */}
                  <WugCard variant="elevated" padding="none" className="h-[var(--spacing-10)] flex items-center justify-center rounded-[var(--radius-lg)] bg-[var(--surface-900)] border border-[var(--surface-800)]">
                    <div className="flex items-center gap-[var(--spacing-2)]">
                      <div className="w-5 h-5 rounded-[var(--radius-sm)] bg-[var(--accent)] flex items-center justify-center">
                         <Layout size={12} className="text-[var(--background)]" />
                      </div>
                      <span className="font-bold text-[var(--foreground)] uppercase tracking-wider text-[length:var(--text-sm)]">CTA Button</span>
                    </div>
                  </WugCard>
                </div>

                {/* Column 2 */}
                <div className={cn("flex flex-col", isMobile ? "gap-[var(--spacing-2)]" : "gap-[var(--spacing-2)]")}>
                  {/* Data-Driven Brand Evolution */}
                  <WugCard variant="elevated" className="min-h-[var(--spacing-48)] flex flex-col justify-between p-[var(--spacing-4)] rounded-[var(--radius-lg)] bg-[var(--surface-900)] border border-[var(--surface-800)]">
                    <div>
                       <h3 className="text-[length:var(--text-lg)] font-bold text-[var(--foreground)] mb-[var(--spacing-2)] leading-tight tracking-tight">
                        Data-Driven Brand Evolution
                      </h3>
                      <p className="text-[length:var(--text-sm)] text-[var(--muted-foreground)] leading-relaxed opacity-80">
                        Data and analytics inform brand strategy, optimizing brand performance and fueling sustainable brand evolution.
                      </p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[var(--surface-700)] mt-[var(--spacing-4)]" />
                  </WugCard>

                  {/* Authentic Brand Storytelling */}
                  <WugCard variant="elevated" className="flex-1 flex flex-col p-[var(--spacing-4)] rounded-[var(--radius-lg)] bg-[var(--surface-900)] border border-[var(--surface-800)]">
                     {/* Text Content */}
                     <div className="mb-[var(--spacing-4)]">
                        <h3 className="text-[length:var(--text-lg)] font-bold text-[var(--foreground)] mb-[var(--spacing-2)] leading-tight tracking-tight">
                          Authentic Brand Storytelling
                        </h3>
                        <p className="text-[length:var(--text-sm)] text-[var(--muted-foreground)] leading-relaxed opacity-80">
                          Brand's core essence is unearthed, crafting authentic narratives that forge emotional connections.
                        </p>
                     </div>

                     {/* Notification Area */}
                     <div className="flex-1 flex items-end justify-center pb-[var(--spacing-2)]">
                        <div className="bg-[var(--surface-950)] border border-[var(--surface-800)] rounded-[var(--radius-lg)] p-[var(--spacing-3)] w-full max-w-[200px] backdrop-blur-sm">
                          <div className="flex flex-col items-center text-center">
                             <div className="flex items-center gap-1.5 mb-1">
                                <Zap size={12} className="text-[var(--foreground)] fill-current" />
                                <span className="text-[length:var(--text-xs)] font-bold text-[var(--foreground)] uppercase tracking-wide">NEW</span>
                             </div>
                             <div className="text-[length:var(--text-sm)] font-bold text-[var(--foreground)]">Latest design</div>
                             <div className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">Today, 11:50</div>
                          </div>
                        </div>
                     </div>
                  </WugCard>
                </div>

                {/* Column 3 */}
                <div className={cn("flex flex-col", isMobile ? "gap-[var(--spacing-2)]" : "gap-[var(--spacing-2)]")}>
                   {/* Icons Grid */}
                   <WugCard variant="elevated" className="min-h-[var(--spacing-32)] flex items-center justify-center p-[var(--spacing-4)] rounded-[var(--radius-lg)] bg-[var(--surface-900)] border border-[var(--surface-800)]">
                      <div className="grid grid-cols-3 gap-x-[var(--spacing-6)] gap-y-[var(--spacing-4)]">
                        {[Figma, Box, Slack, Hash, Disc, Layout].map((Icon, i) => (
                          <div key={i} className="flex items-center justify-center">
                            <Icon size={20} className="text-[var(--foreground)]" />
                          </div>
                        ))}
                      </div>
                   </WugCard>

                   {/* Holistic Brand Experience (White Tone) */}
                   <WugCard variant="elevated" className="flex-1 flex flex-col p-[var(--spacing-4)] rounded-[var(--radius-lg)] bg-[var(--foreground)] border border-[var(--border)]">
                      <div className="mb-[var(--spacing-4)]">
                        <h3 className="text-[length:var(--text-lg)] font-bold text-[var(--background)] mb-[var(--spacing-2)] leading-tight tracking-tight">
                          Holistic Brand Experience Design
                        </h3>
                        <p className="text-[length:var(--text-sm)] text-[var(--surface-600)] leading-relaxed opacity-90">
                           Cohesive brand experiences are engineered across all touchpoints, ensuring consistency and impact.
                        </p>
                      </div>
                      <div className="flex-1 rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface-1000)] relative min-h-[var(--spacing-48)]">
                         <ImageWithFallback 
                          src="https://images.unsplash.com/photo-1722199617938-5d299b43371c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGFuZCUyMHdoaXRlJTIwbW9kZXJuJTIwYXJjaGl0ZWN0dXJlJTIwZ2VvbWV0cmljJTIwY29uY3JldGV8ZW58MXx8fHwxNzY5NTEzODQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Modern Architecture"
                          className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
                        />
                      </div>
                   </WugCard>
                </div>

              </div>
            </div>
          )}
        </PatternViewer>
      </section>
    </div>
  );
}

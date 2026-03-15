import React from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Switch } from '../../ui/switch';
import { Checkbox } from '../../ui/checkbox';
import { Slider } from '../../ui/slider';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface ComponentsProps {
  currentSubPage?: string;
}

export function Components({ currentSubPage }: ComponentsProps) {
  const [sliderValue, setSliderValue] = React.useState([50]);
  const [activeSection, setActiveSection] = React.useState(currentSubPage || 'buttons');

  React.useEffect(() => {
    if (currentSubPage) {
      setActiveSection(currentSubPage);
      // Scroll to section
      const element = document.getElementById(currentSubPage);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentSubPage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
      <div>
        <h1>Components</h1>
        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-lg)', marginTop: '16px' }}>
          A comprehensive library of accessible, customizable components built with your design tokens.
        </p>
      </div>

      {/* Buttons */}
      <section id="buttons" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2>Buttons</h2>
          <p className="text-muted-foreground" style={{ marginTop: '8px' }}>
            Buttons trigger actions and enable user interaction throughout the interface.
          </p>
        </div>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div 
              className="bg-card border border-border"
              style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}
            >
              <h4 style={{ marginBottom: '16px' }}>Variants</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <div 
              className="bg-card border border-border"
              style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}
            >
              <h4 style={{ marginBottom: '16px' }}>Sizes</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div 
              className="bg-card border border-border"
              style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}
            >
              <h4 style={{ marginBottom: '16px' }}>States</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" style={{ marginTop: '24px' }}>
            <div 
              className="bg-card border border-border"
              style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}
            >
              <h4 style={{ marginBottom: '16px' }}>Token Usage</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="text-muted-foreground">
                <p><strong className="text-foreground">Background:</strong> var(--primary)</p>
                <p><strong className="text-foreground">Text Color:</strong> var(--primary-foreground)</p>
                <p><strong className="text-foreground">Border Radius:</strong> var(--radius-md)</p>
                <p><strong className="text-foreground">Font Weight:</strong> var(--font-weight-medium)</p>
              </div>

              <div style={{ marginTop: '24px' }}>
                <h4 style={{ marginBottom: '16px' }}>Code Example</h4>
                <pre 
                  className="bg-muted"
                  style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', padding: '16px', overflowX: 'auto' }}
                >
                  <code>{`<Button variant="default" size="default">
  Click me
</Button>`}</code>
                </pre>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessibility" style={{ marginTop: '24px' }}>
            <div 
              className="bg-card border border-border"
              style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}
            >
              <h4 style={{ marginBottom: '16px' }}>Accessibility Features</h4>
              <ul className="text-muted-foreground list-disc list-inside" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Keyboard accessible (Tab, Enter, Space)</li>
                <li>Focus visible with ring indicator</li>
                <li>Disabled state communicated to screen readers</li>
                <li>Sufficient color contrast (WCAG AA)</li>
                <li>Clear hover and active states</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Inputs */}
      <section id="inputs" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2>Inputs</h2>
          <p className="text-muted-foreground" style={{ marginTop: '8px' }}>
            Text inputs allow users to enter and edit text information.
          </p>
        </div>

        <div 
          className="bg-card border border-border"
          style={{ borderRadius: 'var(--radius-lg)', padding: '32px', maxWidth: '448px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Default Input</label>
              <Input type="text" placeholder="Enter text..." />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Email Input</label>
              <Input type="email" placeholder="email@example.com" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Disabled Input</label>
              <Input type="text" placeholder="Disabled" disabled />
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section id="cards" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2>Cards</h2>
          <p className="text-muted-foreground" style={{ marginTop: '8px' }}>
            Cards contain content and actions about a single subject.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the main content area of the card. You can put any content here.</p>
            </CardContent>
            <CardFooter style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="ghost">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Cards are flexible containers that can adapt to various content types.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Modals */}
      <section id="modals" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2>Modals</h2>
          <p className="text-muted-foreground" style={{ marginTop: '8px' }}>
            Modal dialogs interrupt the user flow to display important information or gather input.
          </p>
        </div>

        <div 
          className="bg-card border border-border"
          style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Modal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modal Dialog</DialogTitle>
                <DialogDescription>
                  This is a modal dialog. It appears on top of the main content and requires user interaction.
                </DialogDescription>
              </DialogHeader>
              <div style={{ padding: '16px 0' }}>
                <p className="text-muted-foreground">
                  Modal content goes here. You can include forms, information, or any other content.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Badges */}
      <section id="badges" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2>Badges</h2>
          <p className="text-muted-foreground" style={{ marginTop: '8px' }}>
            Badges display status, labels, or short pieces of information.
          </p>
        </div>

        <div 
          className="bg-card border border-border"
          style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section id="icons" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2>Icons</h2>
          <p className="text-muted-foreground" style={{ marginTop: '8px' }}>
            Icons from Lucide library used throughout the design system.
          </p>
        </div>

        <div 
          className="bg-card border border-border"
          style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={24} className="text-accent" />
              <span style={{ fontSize: 'var(--text-sm)' }} className="text-muted-foreground">Success</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={24} className="text-destructive" />
              <span style={{ fontSize: 'var(--text-sm)' }} className="text-muted-foreground">Error</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Info size={24} className="text-foreground" />
              <span style={{ fontSize: 'var(--text-sm)' }} className="text-muted-foreground">Info</span>
            </div>
          </div>
        </div>
      </section>

      {/* Component Index */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2>All Available Components</h2>
          <p className="text-muted-foreground" style={{ marginTop: '8px' }}>
            Complete list of components in the Wugweb Kits design system.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            'Accordion', 'Alert Dialog', 'Alert', 'Avatar', 'Badge', 'Breadcrumb',
            'Button', 'Calendar', 'Card', 'Carousel', 'Chart', 'Checkbox',
            'Collapsible', 'Command', 'Context Menu', 'Dialog', 'Drawer', 'Dropdown Menu',
            'Form', 'Hover Card', 'Input', 'Input OTP', 'Label', 'Menubar',
            'Navigation Menu', 'Pagination', 'Popover', 'Progress', 'Radio Group',
            'Resizable', 'Scroll Area', 'Select', 'Separator', 'Sheet', 'Sidebar',
            'Skeleton', 'Slider', 'Switch', 'Table', 'Tabs', 'Textarea',
            'Toast', 'Toggle', 'Toggle Group', 'Tooltip'
          ].map((component) => (
            <div
              key={component}
              className="bg-card border border-border hover:border-accent transition-colors"
              style={{ borderRadius: 'var(--radius-md)', padding: '16px' }}
            >
              <p style={{ fontWeight: 'var(--font-weight-medium)' }}>{component}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

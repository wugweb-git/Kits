import React from 'react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing, typography } from '../../../utils/responsive';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { Checkbox } from '../../ui/checkbox';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../ui/breadcrumb';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { Separator } from '../../ui/separator';
import { AlertCircle, Check, Info, Mail, Search, User, X } from 'lucide-react';

export function AllComponentsShowcase() {
  const { isMobile, isTablet, breakpoint } = useBreakpoint();
  const [isChecked, setIsChecked] = React.useState(false);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  return (
    <div 
      style={{
        padding: isMobile ? 'var(--spacing-4)' : isTablet ? 'var(--spacing-6)' : 'var(--spacing-8)',
        maxWidth: '1400px',
        margin: '0 auto'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: spacing.verticalSpacing.xl[breakpoint] }}>
        <h1 
          className="text-foreground animate-fade-in"
          style={{ 
            fontSize: typography.h1[breakpoint],
            marginBottom: spacing.verticalSpacing.sm[breakpoint],
            fontWeight: 'var(--font-weight-bold)'
          }}
        >
          Component Library
        </h1>
        <p 
          className="text-muted-foreground animate-fade-in"
          style={{ 
            fontSize: typography.body[breakpoint],
            animationDelay: '40ms'
          }}
        >
          Complete showcase of all components using design tokens from your CSS.
        </p>
      </div>

      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: 'var(--spacing-6)'
        }}
      >
        {/* INPUT COMPONENT */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Input</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              Text input fields with various states
            </CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div>
              <Label htmlFor="default-input" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                Default
              </Label>
              <Input id="default-input" placeholder="Enter text..." />
            </div>
            
            <div>
              <Label htmlFor="disabled-input" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                Disabled
              </Label>
              <Input id="disabled-input" placeholder="Disabled input" disabled />
            </div>

            <div>
              <Label htmlFor="email-input" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                With Icon
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email-input" type="email" placeholder="email@example.com" className="pl-10" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="search-input" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="search-input" type="search" placeholder="Search..." className="pl-10" />
              </div>
            </div>

            <div className="mt-2 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <strong className="text-accent">Tokens:</strong>
              <span className="text-muted-foreground"> --input-background, --border, --ring, --radius-md</span>
            </div>
          </CardContent>
        </Card>

        {/* BADGE COMPONENT */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Badge</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              Status indicators and labels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Default</p>
                <Badge>Default Badge</Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Secondary</p>
                <Badge variant="secondary">Secondary</Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Destructive</p>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Outline</p>
                <Badge variant="outline">Outline</Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">With Icons</p>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                  <Badge><Check className="mr-1" size={12} />Success</Badge>
                  <Badge variant="destructive"><X className="mr-1" size={12} />Error</Badge>
                  <Badge variant="secondary"><Info className="mr-1" size={12} />Info</Badge>
                </div>
              </div>

              <div className="mt-2 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                <strong className="text-accent">Tokens:</strong>
                <span className="text-muted-foreground"> --primary, --secondary, --destructive, --border, --radius-md</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ALERT COMPONENT */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Alert</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              Contextual feedback messages
            </CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>
                This is an informational message using design tokens.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                This is an error message with destructive styling.
              </AlertDescription>
            </Alert>

            <div className="mt-2 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <strong className="text-accent">Tokens:</strong>
              <span className="text-muted-foreground"> --foreground, --destructive, --border, --radius-lg</span>
            </div>
          </CardContent>
        </Card>

        {/* BUTTON COMPONENT */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Button</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              Interactive buttons with variants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
              </div>

              <div className="mt-2 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                <strong className="text-accent">Tokens:</strong>
                <span className="text-muted-foreground"> --primary, --secondary, --destructive, --accent, --ring, --radius-md</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SELECT COMPONENT */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Select</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              Dropdown selection component
            </CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div>
              <Label htmlFor="select-1" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                Choose an option
              </Label>
              <Select>
                <SelectTrigger id="select-1">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="cherry">Cherry</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="select-2" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>
                Disabled
              </Label>
              <Select disabled>
                <SelectTrigger id="select-2">
                  <SelectValue placeholder="Disabled select" />
                </SelectTrigger>
              </Select>
            </div>

            <div className="mt-2 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <strong className="text-accent">Tokens:</strong>
              <span className="text-muted-foreground"> --input-background, --border, --ring, --popover, --radius-md</span>
            </div>
          </CardContent>
        </Card>

        {/* SWITCH & CHECKBOX */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Toggle & Checkbox</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              Boolean input controls
            </CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <Switch 
                id="switch-1" 
                checked={isSwitchOn}
                onCheckedChange={setIsSwitchOn}
              />
              <Label htmlFor="switch-1">Enable notifications</Label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <Switch id="switch-2" disabled />
              <Label htmlFor="switch-2" className="text-muted-foreground">Disabled switch</Label>
            </div>

            <Separator />

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <Checkbox 
                id="checkbox-1" 
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked as boolean)}
              />
              <Label htmlFor="checkbox-1">Accept terms and conditions</Label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <Checkbox id="checkbox-2" disabled />
              <Label htmlFor="checkbox-2" className="text-muted-foreground">Disabled checkbox</Label>
            </div>

            <div className="mt-2 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <strong className="text-accent">Tokens:</strong>
              <span className="text-muted-foreground"> --primary, --ring, --border, --radius-full</span>
            </div>
          </CardContent>
        </Card>

        {/* TABS COMPONENT */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            gridColumn: isMobile ? 'span 1' : 'span 2'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Tabs</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              Tabbed navigation interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" style={{ marginTop: 'var(--spacing-4)' }}>
                <div className="p-4 bg-muted/30 border border-border" style={{ borderRadius: 'var(--radius-md)' }}>
                  <h4 className="text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-semibold)' }}>Overview Content</h4>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    This is the overview tab content using design tokens.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="features" style={{ marginTop: 'var(--spacing-4)' }}>
                <div className="p-4 bg-muted/30 border border-border" style={{ borderRadius: 'var(--radius-md)' }}>
                  <h4 className="text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-semibold)' }}>Features</h4>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    Feature list and details go here.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="pricing" style={{ marginTop: 'var(--spacing-4)' }}>
                <div className="p-4 bg-muted/30 border border-border" style={{ borderRadius: 'var(--radius-md)' }}>
                  <h4 className="text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-semibold)' }}>Pricing</h4>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    Pricing information displayed here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <strong className="text-accent">Tokens:</strong>
              <span className="text-muted-foreground"> --muted, --primary, --foreground, --border, --radius-md</span>
            </div>
          </CardContent>
        </Card>

        {/* AVATAR COMPONENT */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Avatar</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              User profile images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', flexWrap: 'wrap' }}>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              
              <Avatar>
                <AvatarFallback><User size={20} /></AvatarFallback>
              </Avatar>
              
              <Avatar>
                <AvatarFallback className="bg-accent text-accent-foreground">AB</AvatarFallback>
              </Avatar>
              
              <Avatar>
                <AvatarFallback className="bg-destructive text-destructive-foreground">XY</AvatarFallback>
              </Avatar>
            </div>

            <div className="mt-4 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <strong className="text-accent">Tokens:</strong>
              <span className="text-muted-foreground"> --muted, --muted-foreground, --radius-full</span>
            </div>
          </CardContent>
        </Card>

        {/* TOOLTIP COMPONENT */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Tooltip</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              Contextual information on hover
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tooltip using design tokens</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary">Info</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Additional information here</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="mt-4 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <strong className="text-accent">Tokens:</strong>
              <span className="text-muted-foreground"> --popover, --popover-foreground, --border, --radius-md</span>
            </div>
          </CardContent>
        </Card>

        {/* BREADCRUMB COMPONENT */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            gridColumn: isMobile ? 'span 1' : 'span 2'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Breadcrumb</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              Navigation hierarchy indicator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <strong className="text-accent">Tokens:</strong>
              <span className="text-muted-foreground"> --foreground, --muted-foreground, --text-sm</span>
            </div>
          </CardContent>
        </Card>

        {/* PAGINATION COMPONENT */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            gridColumn: isMobile ? 'span 1' : 'span 2'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Pagination</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              Page navigation controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="mt-4 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <strong className="text-accent">Tokens:</strong>
              <span className="text-muted-foreground"> --accent, --border, --muted, --radius-md</span>
            </div>
          </CardContent>
        </Card>

        {/* TABLE COMPONENT */}
        <Card 
          className="animate-fade-in-up"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            gridColumn: isMobile ? 'span 1' : 'span 2'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Table</CardTitle>
            <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
              Data table with rows and columns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell><Badge>Active</Badge></TableCell>
                    <TableCell>Developer</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bob Johnson</TableCell>
                    <TableCell><Badge variant="destructive">Inactive</Badge></TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 p-3 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <strong className="text-accent">Tokens:</strong>
              <span className="text-muted-foreground"> --border, --muted, --foreground, --text-sm</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Design System Info */}
      <Card 
        className="animate-fade-in-up mt-8"
        style={{ 
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <CardHeader>
          <CardTitle style={{ fontSize: typography.h3[breakpoint] }}>Design Token Coverage</CardTitle>
          <CardDescription style={{ fontSize: typography.body[breakpoint] }}>
            All components use tokens from /styles/globals.css
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--spacing-4)'
            }}
          >
            <div className="p-4 bg-muted/30 border border-border" style={{ borderRadius: 'var(--radius-md)' }}>
              <h4 className="text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)' }}>
                Color Tokens
              </h4>
              <div style={{ fontSize: 'var(--text-xs)', lineHeight: '1.8' }} className="text-muted-foreground">
                <div>--primary, --secondary</div>
                <div>--accent, --destructive</div>
                <div>--muted, --border</div>
                <div>--background, --foreground</div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 border border-border" style={{ borderRadius: 'var(--radius-md)' }}>
              <h4 className="text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)' }}>
                Spacing Tokens
              </h4>
              <div style={{ fontSize: 'var(--text-xs)', lineHeight: '1.8' }} className="text-muted-foreground">
                <div>--spacing-1 through --spacing-16</div>
                <div>8pt grid system</div>
                <div>Consistent gaps and padding</div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 border border-border" style={{ borderRadius: 'var(--radius-md)' }}>
              <h4 className="text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)' }}>
                Radius Tokens
              </h4>
              <div style={{ fontSize: 'var(--text-xs)', lineHeight: '1.8' }} className="text-muted-foreground">
                <div>--radius-sm (4px)</div>
                <div>--radius-md (8px)</div>
                <div>--radius-lg (12px)</div>
                <div>--radius-full (9999px)</div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 border border-border" style={{ borderRadius: 'var(--radius-md)' }}>
              <h4 className="text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)' }}>
                Typography Tokens
              </h4>
              <div style={{ fontSize: 'var(--text-xs)', lineHeight: '1.8' }} className="text-muted-foreground">
                <div>--text-xs through --text-3xl</div>
                <div>Font: Inter Tight</div>
                <div>Weights: 400, 500, 600, 700</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-accent-subtle border border-accent/20" style={{ borderRadius: 'var(--radius-md)' }}>
            <p className="text-accent" style={{ fontSize: 'var(--text-sm)' }}>
              <strong>💡 Pro Tip:</strong> All visual properties are bound to design tokens. Update <code style={{ background: 'var(--accent)/10', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>/styles/globals.css</code> to change the appearance of all components instantly!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

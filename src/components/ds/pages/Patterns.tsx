import React, { useState } from 'react';
import { Card } from '../../wugweb/Card';
import { Button } from '../../wugweb/Button';
import { Badge } from '../../wugweb/Badge';
import { SocialButton } from '../../ui/social-button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { 
  User, Github, Twitter, 
  MoreHorizontal, BarChart3, ArrowUpRight, ArrowDownRight, Globe,
  Bell, Shield, Check,
  MessageSquare, Zap, Layout, Sparkles, Box, Command, 
  Figma, Slack, Hash, Disc
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { cn } from '../../ui/utils';

// --- Internal Utilities for Documentation ---

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

// --- Patterns ---

export function Patterns() {
  return (
    <div className="space-y-[var(--section-spacing-desktop)] pb-[var(--section-spacing-desktop)] animate-fade-in-up">
      
      {/* Page Header */}
      <div className="border-b border-[var(--border)] pb-[var(--spacing-6)]">
        <h1 className="text-[length:var(--text-4xl)] font-bold text-[var(--foreground)] mb-[var(--spacing-3)] tracking-tight">
          Pattern Composition
        </h1>
        <p className="text-[var(--muted-foreground)] text-[length:var(--text-lg)] max-w-2xl leading-relaxed">
          Documentation illustrating the correct composition of existing design system components. 
          These examples demonstrate best practices for layout and hierarchy using only strict system tokens and unmodified components.
        </p>
      </div>

      {/* 1. Authentication */}
      <section>
        <PatternHeader 
          title="Authentication Composition" 
          description="Demonstrates the standard vertical stacking of Input and Button components within a restricted-width Card. Uses standard spacing tokens to create visual rhythm between form elements."
        />
        <PatternViewer>
          <div className="w-full max-w-[400px] mx-auto">
            <Card variant="elevated" className="relative overflow-hidden border-[var(--border)] p-[var(--spacing-4)] md:p-[var(--spacing-6)]">
              {/* Decorative top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--surface-600)]" />
              
              <div className="text-center mb-[var(--spacing-6)] pt-[var(--spacing-4)]">
                <div className="w-16 h-16 bg-[var(--surface-900)] rounded-full border border-[var(--border)] flex items-center justify-center mx-auto mb-[var(--spacing-4)] shadow-inner">
                  <User size={32} className="text-[var(--foreground)] opacity-90" />
                </div>
                <h3 className="text-[length:var(--text-2xl)] md:text-[length:var(--text-3xl)] font-bold text-[var(--foreground)] mb-[var(--spacing-2)] tracking-tight">
                  Welcome back
                </h3>
                <p className="text-[length:var(--text-sm)] md:text-[length:var(--text-base)] text-[var(--muted-foreground)] max-w-[80%] mx-auto">
                  Enter your credentials to access your account.
                </p>
              </div>

              <div className="space-y-[var(--spacing-5)]">
                <div className="space-y-[var(--spacing-2)]">
                  <Label htmlFor="auth-email" className="text-[var(--foreground)] font-medium">Email</Label>
                  <Input 
                    id="auth-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="bg-[var(--surface-950)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-[var(--accent)]/20 h-12 md:h-11 text-base md:text-sm"
                  />
                </div>

                <div className="space-y-[var(--spacing-2)]">
                  <Label htmlFor="auth-pass" className="text-[var(--foreground)] font-medium">Password</Label>
                  <Input 
                    id="auth-pass" 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-[var(--surface-950)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-[var(--accent)]/20 h-12 md:h-11 text-base md:text-sm"
                  />
                </div>

                <div className="pt-[var(--spacing-2)] flex flex-col gap-[var(--spacing-4)]">
                  <Button fullWidth size="md" variant="primary">
                    Sign In
                  </Button>
                  
                  <div className="text-center">
                    <a href="#" className="text-[length:var(--text-sm)] text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors font-medium">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div className="relative py-[var(--spacing-4)]">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[var(--border)]"></span>
                  </div>
                  <div className="relative flex justify-center text-[length:var(--text-xs)] uppercase tracking-wider font-medium">
                    <span className="bg-[var(--card)] px-3 text-[var(--muted-foreground)]">Or continue with</span>
                  </div>
                </div>

                <SocialButton 
                  variant="outline" 
                  className="w-full justify-center h-12 md:h-11 text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-700)] hover:text-[var(--foreground)] transition-colors"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  }
                >
                  Sign in with Google
                </SocialButton>
              </div>

              <div className="mt-[var(--spacing-8)] text-center text-[length:var(--text-sm)] text-[var(--muted-foreground)]">
                Don't have an account? <a href="#" className="text-[var(--accent)] font-medium hover:underline ml-1">Sign up</a>
              </div>
            </Card>
          </div>
        </PatternViewer>
      </section>

      {/* 2. User Profile */}
      <section>
        <PatternHeader 
          title="Content Hierarchy Layout" 
          description="An example of establishing visual hierarchy using the Card component. Content is organized using standard flex layouts, with Badge components providing metadata without altering component internals."
        />
        <PatternViewer>
          <div className="w-full max-w-[380px] mx-auto">
            <Card variant="elevated" padding="none" className="overflow-hidden bg-[var(--surface-900)] border-[var(--border)] shadow-lg">
              {/* Cover Image */}
              <div className="h-32 bg-[var(--surface-950)] relative w-full border-b border-[var(--border)]">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[var(--surface-900)]/50 to-transparent" />
              </div>
              
              <div className="px-[var(--spacing-6)] pb-[var(--spacing-6)] relative">
                {/* Header Row: Avatar + Actions */}
                <div className="flex justify-between items-end -mt-12 mb-[var(--spacing-3)]">
                  {/* Avatar with Status */}
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-[var(--radius-full)] border-[4px] border-[var(--surface-900)] bg-[var(--surface-800)] overflow-hidden shadow-sm">
                      <ImageWithFallback 
                        src="figma:asset/714473b3945ef2c290e1deafb7887474feaaf953.png" 
                        alt="Alex Morgan" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-[var(--success)] border-[3px] border-[var(--surface-900)] rounded-[var(--radius-full)]"></div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-[var(--spacing-2)] mb-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 w-9 p-0 rounded-[var(--radius-md)] border-[var(--border)] bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-800)] hover:border-[var(--border)] transition-colors"
                    >
                       <MoreHorizontal size={18} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-9 px-4 rounded-[var(--radius-md)] border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-800)] hover:border-[var(--border)] font-medium transition-colors"
                    >
                      Follow
                    </Button>
                  </div>
                </div>

                {/* User Info */}
                <div className="mb-[var(--spacing-5)]">
                  <h3 className="text-[length:var(--text-2xl)] font-bold text-[var(--foreground)] mb-[var(--spacing-1)] tracking-tight">Alex Morgan</h3>
                  <p className="text-[length:var(--text-base)] text-[var(--muted-foreground)]">Product Designer</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-[var(--spacing-6)]">
                  <Badge 
                    label="Design" 
                    tone="neutral" 
                    style="subtle" 
                    size="md" 
                    className="bg-[var(--surface-800)] text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-[var(--surface-700)] transition-colors cursor-default" 
                  />
                  <Badge 
                    label="New York" 
                    tone="neutral" 
                    style="subtle" 
                    size="md" 
                    className="bg-[var(--surface-800)] text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-[var(--surface-700)] transition-colors cursor-default" 
                  />
                  <Badge 
                    label="Pro" 
                    tone="success" 
                    style="subtle" 
                    size="md" 
                    className="bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20" 
                  />
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--border)] mb-[var(--spacing-5)]" />

                {/* Contact Details */}
                <div className="space-y-[var(--spacing-3)]">
                  <div className="flex items-center gap-[var(--spacing-3)] text-[length:var(--text-sm)] text-[var(--muted-foreground)] group cursor-pointer hover:text-[var(--foreground)] transition-colors">
                    <span className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] flex justify-center w-4 font-medium transition-colors">@</span> 
                    <span>alex@example.com</span>
                  </div>
                  <div className="flex items-center gap-[var(--spacing-3)] text-[length:var(--text-sm)] text-[var(--muted-foreground)] group cursor-pointer hover:text-[var(--foreground)] transition-colors">
                    <Globe size={16} className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors" /> 
                    <span>wugweb.com</span>
                  </div>
                  <div className="flex items-center gap-[var(--spacing-3)] text-[length:var(--text-sm)] text-[var(--muted-foreground)]">
                    <Check size={16} className="text-[var(--muted-foreground)]" /> 
                    <span>Joined Jan 2024</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </PatternViewer>
      </section>

      {/* 3. Dashboard Grid */}
      <section>
        <PatternHeader 
          title="Grid Layout Composition" 
          description="Utilizes CSS Grid with system spacing tokens to arrange standard Card components. Text colors adhere to semantic system tokens (success/destructive) rather than arbitrary hex values."
        />
        <PatternViewer>
          {(isMobile: boolean) => (
            <div className={cn(
              "grid gap-[var(--spacing-4)]",
              isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            )}>
              {[
                { label: 'Revenue', value: '$24,500', trend: '+12%', up: true, icon: BarChart3 },
                { label: 'Users', value: '1,234', trend: '+5%', up: true, icon: User },
                { label: 'Bounce Rate', value: '42%', trend: '-2%', up: false, icon: ArrowUpRight },
                { label: 'Active', value: '573', trend: '+8%', up: true, icon: Globe },
              ].map((item, i) => (
                <Card 
                  key={i} 
                  variant="elevated" 
                  padding="none"
                  className="bg-[var(--surface-900)] border-[var(--border)] p-[var(--spacing-5)] flex flex-col justify-between group hover:border-[var(--surface-700)] transition-all duration-200"
                >
                  <div>
                    <div className="flex justify-between items-start mb-[var(--spacing-2)]">
                      <span className="text-[length:var(--text-sm)] text-[var(--muted-foreground)] font-medium tracking-wide">
                        {item.label}
                      </span>
                      <item.icon size={16} className="text-[var(--muted-foreground)] opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[length:var(--text-2xl)] font-bold text-[var(--foreground)] tracking-tight mb-[var(--spacing-1)]">
                      {item.value}
                    </div>
                  </div>
                  
                  <div className={cn(
                    "text-[length:var(--text-xs)] flex items-center gap-1.5 font-medium",
                    item.up ? "text-[var(--success)]" : "text-[var(--destructive)]"
                  )}>
                    {item.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{item.trend}</span>
                    <span className="text-[var(--muted-foreground)] font-normal">vs last month</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </PatternViewer>
      </section>

      {/* 4. Settings Layout */}
      <section>
        <PatternHeader 
          title="Master-Detail Layout" 
          description="A responsive settings layout that adapts from a sidebar configuration on desktop to a stacked layout on mobile. Uses distinct surface tones to separate navigation from content."
        />
        <PatternViewer>
          {(isMobile) => (
            <div className="w-full max-w-[900px] mx-auto">
              <Card 
                variant="elevated" 
                padding="none" 
                className={cn(
                  "flex overflow-hidden border-[var(--border)] bg-[var(--surface-900)]",
                  isMobile ? "flex-col" : "flex-row min-h-[500px]"
                )}
              >
                {/* Sidebar Navigation */}
                <div 
                  className={cn(
                    "bg-[var(--surface-950)] border-[var(--border)] transition-all flex flex-col",
                    isMobile 
                      ? "w-full border-b p-[var(--spacing-4)] gap-[var(--spacing-4)]" 
                      : "w-64 border-r shrink-0 p-[var(--spacing-6)] gap-[var(--spacing-6)]"
                  )}
                >
                  <div className="px-1">
                    <h4 className="font-bold text-[length:var(--text-lg)] text-[var(--foreground)] tracking-tight">Settings</h4>
                  </div>
                  
                  {isMobile ? (
                    <Tabs defaultValue="profile" className="w-full">
                      <TabsList className="w-full bg-[var(--surface-800)] h-10 p-1 rounded-[var(--radius-md)]">
                        <TabsTrigger 
                          value="profile" 
                          className="flex-1 data-[state=active]:bg-[var(--surface-950)] data-[state=active]:text-[var(--foreground)] text-[var(--muted-foreground)] text-[length:var(--text-sm)]"
                        >
                          Profile
                        </TabsTrigger>
                        <TabsTrigger 
                          value="notifications" 
                          className="flex-1 data-[state=active]:bg-[var(--surface-950)] data-[state=active]:text-[var(--foreground)] text-[var(--muted-foreground)] text-[length:var(--text-sm)]"
                        >
                          Notifications
                        </TabsTrigger>
                        <TabsTrigger 
                          value="security" 
                          className="flex-1 data-[state=active]:bg-[var(--surface-950)] data-[state=active]:text-[var(--foreground)] text-[var(--muted-foreground)] text-[length:var(--text-sm)]"
                        >
                          Security
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  ) : (
                    <nav className="flex flex-col gap-1 w-full">
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "justify-start font-medium transition-colors w-full h-10 rounded-[var(--radius-md)]",
                          "bg-[var(--surface-800)] text-[var(--foreground)]"
                        )}
                        leftIcon={<User size={18} />}
                      >
                        Profile
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors w-full h-10 rounded-[var(--radius-md)] hover:bg-[var(--surface-800)]/50"
                        leftIcon={<Bell size={18} />}
                      >
                        Notifications
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors w-full h-10 rounded-[var(--radius-md)] hover:bg-[var(--surface-800)]/50"
                        leftIcon={<Shield size={18} />}
                      >
                        Security
                      </Button>
                    </nav>
                  )}
                </div>

                {/* Main Content */}
                <div className={cn("flex-1 bg-[var(--surface-900)]", isMobile ? "p-[var(--spacing-4)]" : "p-[var(--spacing-10)]")}>
                  <div className={cn("max-w-lg", isMobile ? "space-y-[var(--spacing-6)]" : "space-y-[var(--spacing-8)]")}>
                    <div>
                      <h3 className="text-[length:var(--text-2xl)] font-bold text-[var(--foreground)] mb-[var(--spacing-2)] tracking-tight">
                        Profile Information
                      </h3>
                      <p className="text-[length:var(--text-base)] text-[var(--muted-foreground)]">
                        Update your public profile details.
                      </p>
                    </div>
                    
                    <div className={cn(isMobile ? "space-y-[var(--spacing-5)]" : "space-y-[var(--spacing-6)]")}>
                      <div className="space-y-[var(--spacing-3)]">
                        <Label htmlFor="set-name" className="text-[var(--muted-foreground)]">Display Name</Label>
                        <Input 
                          id="set-name" 
                          defaultValue="Alex Morgan" 
                          className="bg-[var(--surface-950)] border-[var(--border)] h-12 text-[var(--foreground)] focus-visible:ring-[var(--accent)]/20"
                        />
                      </div>
                      
                      <div className="space-y-[var(--spacing-3)]">
                        <Label htmlFor="set-bio" className="text-[var(--muted-foreground)]">Bio</Label>
                        <Input 
                          id="set-bio" 
                          defaultValue="Product Designer @ Wugweb" 
                          className="bg-[var(--surface-950)] border-[var(--border)] h-12 text-[var(--foreground)] focus-visible:ring-[var(--accent)]/20"
                        />
                      </div>

                      <div className="pt-[var(--spacing-4)] flex flex-col items-stretch">
                        <Button 
                          variant="secondary" 
                          size="lg"
                          className="bg-[var(--surface-950)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-800)] w-full md:w-auto transition-colors"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </PatternViewer>
      </section>

      {/* 5. Billing Form */}
      <section>
        <PatternHeader 
          title="Form Grid System" 
          description="Complex data entry layout using responsive grid columns. Demonstrates proper alignment of Input and Label components using standard spacing tokens."
        />
        <PatternViewer>
          {(isMobile) => (
            isMobile ? (
              <div className="w-full">
                <Card variant="elevated">
                  <div className="mb-[var(--spacing-5)] border-b border-[var(--border)] pb-[var(--spacing-4)]">
                    <h3 className="text-[var(--foreground)]">Billing Details</h3>
                    <p className="text-[length:var(--text-sm)] text-[var(--muted-foreground)]">Manage your billing address and payment method.</p>
                  </div>

                  <div className="flex flex-col gap-[var(--spacing-5)]">
                    <div className="space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-fn-m">First Name</Label>
                      <Input id="b-fn-m" placeholder="Jane" />
                    </div>
                    <div className="space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-ln-m">Last Name</Label>
                      <Input id="b-ln-m" placeholder="Doe" />
                    </div>
                    
                    <div className="space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-addr-m">Address</Label>
                      <Input id="b-addr-m" placeholder="1234 Street Name" />
                    </div>

                    <div className="space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-city-m">City</Label>
                      <Input id="b-city-m" placeholder="San Francisco" />
                    </div>
                    
                    <div className="space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-state-m">State</Label>
                      <Input id="b-state-m" placeholder="CA" />
                    </div>
                    <div className="space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-zip-m">Zip</Label>
                      <Input id="b-zip-m" placeholder="94107" />
                    </div>
                  </div>

                  <div className="mt-[var(--spacing-5)] flex flex-col gap-[var(--spacing-3)]">
                    <Button variant="primary" size="lg" className="w-full justify-center">Update Billing</Button>
                    <Button variant="ghost" size="lg" className="w-full justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Cancel</Button>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="w-full max-w-[800px] mx-auto">
                <Card variant="elevated">
                  <div className="mb-[var(--spacing-5)] flex items-start justify-between border-b border-[var(--border)] pb-[var(--spacing-6)]">
                    <div>
                      <h3 className="text-[var(--foreground)]">Billing Details</h3>
                      <p className="mt-[var(--spacing-1)] text-[length:var(--text-sm)] text-[var(--muted-foreground)]">Manage your billing address and payment method.</p>
                    </div>
                    <Badge label="Active Plan" style="outline" tone="info" />
                  </div>

                  <div className="grid grid-cols-12 gap-[var(--spacing-5)]">
                    <div className="col-span-6 space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-fn">First Name</Label>
                      <Input id="b-fn" placeholder="Jane" />
                    </div>
                    <div className="col-span-6 space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-ln">Last Name</Label>
                      <Input id="b-ln" placeholder="Doe" />
                    </div>
                    
                    <div className="col-span-12 space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-addr">Address</Label>
                      <Input id="b-addr" placeholder="1234 Street Name" />
                    </div>

                    <div className="col-span-6 space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-city">City</Label>
                      <Input id="b-city" placeholder="San Francisco" />
                    </div>
                    
                    <div className="col-span-4 space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-state">State / Province</Label>
                      <Input id="b-state" placeholder="CA" />
                    </div>
                    
                    <div className="col-span-2 space-y-[var(--spacing-2)]">
                      <Label htmlFor="b-zip">Zip Code</Label>
                      <Input id="b-zip" placeholder="94107" />
                    </div>
                  </div>

                  <div className="mt-[var(--spacing-5)] flex justify-end gap-[var(--spacing-4)]">
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="primary">Update Billing</Button>
                  </div>
                </Card>
              </div>
            )
          )}
        </PatternViewer>
      </section>

    </div>
  );
}

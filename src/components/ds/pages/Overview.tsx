import React from 'react';
import { ArrowRight, Zap, Palette, Layers, Code, Upload, Box, CheckCircle2, Sparkles, Shield, Gauge } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing, typography } from '../../../utils/responsive';

interface OverviewProps {
  onNavigate: (page: string, subPage?: string) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const { isMobile, isTablet, breakpoint } = useBreakpoint();
  
  const features = [
    {
      icon: Gauge,
      title: 'Lightning Fast',
      description: 'Optimized for performance with minimal bundle size and maximum rendering efficiency.',
      color: 'var(--accent)'
    },
    {
      icon: Palette,
      title: 'Token-Based Design',
      description: 'Complete design token system for colors, typography, spacing, and motion.',
      color: 'var(--accent)'
    },
    {
      icon: Layers,
      title: 'Modular Components',
      description: 'Flexible, composable components that adapt to your needs with extensive props.',
      color: 'var(--accent)'
    },
    {
      icon: Code,
      title: 'Developer First',
      description: 'Clean APIs, TypeScript support, and comprehensive documentation for rapid development.',
      color: 'var(--accent)'
    },
    {
      icon: Shield,
      title: 'Accessible by Default',
      description: 'WCAG 2.1 AA compliant with keyboard navigation and screen reader support built-in.',
      color: 'var(--accent)'
    },
    {
      icon: Sparkles,
      title: 'Micro-interactions',
      description: 'Delightful animations and transitions using motion tokens and design principles.',
      color: 'var(--accent)'
    },
  ];

  const quickActions = [
    {
      id: 'button-dark',
      title: 'Button — Dark',
      description: 'Complete interactive documentation with live preview and code examples',
      icon: CheckCircle2,
      badge: 'Figma Import',
      page: 'components',
      subPage: 'button-dark'
    },
    {
      id: 'buttons',
      title: 'Button Showcase',
      description: 'View all button variants, states, and sizes in one place',
      icon: CheckCircle2,
      badge: 'All Variants',
      page: 'components',
      subPage: 'buttons'
    },
    {
      id: 'import-guide',
      title: 'Import from Figma',
      description: 'Step-by-step guide to import components from Figma to code',
      icon: Upload,
      badge: 'Guide',
      page: 'components',
      subPage: 'import-guide'
    },
    {
      id: 'gallery',
      title: 'Component Gallery',
      description: 'Explore all imported components with live previews',
      icon: Box,
      badge: 'Gallery',
      page: 'components',
      subPage: 'gallery'
    },
    {
      id: 'tokens',
      title: 'Design Tokens',
      description: 'Browse colors, typography, spacing, and all design tokens',
      icon: Palette,
      badge: 'Tokens',
      page: 'tokens',
      subPage: 'colors'
    },
  ];

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
      {/* Premium Hero Section */}
      <section 
        className="animate-fade-in"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: isMobile ? 'flex-start' : 'center',
          textAlign: isMobile ? 'left' : 'center',
          paddingTop: isMobile ? '32px' : isTablet ? '64px' : '80px',
          paddingBottom: isMobile ? '32px' : isTablet ? '64px' : '80px',
          position: 'relative'
        }}
      >
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'center' }}>
          {/* Version Badge with Shimmer */}
          <div 
            className="inline-block border border-accent/30 animate-fade-in-up hover-lift smooth-transition"
            style={{ 
              borderRadius: 'var(--radius-full)',
              fontSize: typography.small[breakpoint],
              fontWeight: 'var(--font-weight-medium)',
              paddingLeft: isMobile ? '12px' : '16px',
              paddingRight: isMobile ? '12px' : '16px',
              paddingTop: '6px',
              paddingBottom: '6px',
              alignSelf: isMobile ? 'flex-start' : 'center',
              marginBottom: spacing.verticalSpacing.md[breakpoint],
              animationDelay: '0ms',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--accent-subtle)',
              color: 'var(--accent)'
            }}
          >
            <Sparkles size={14} />
            <span>Version 0.1.0 — Beta</span>
          </div>
          
          {/* Hero Headline */}
          <h1 
            className="text-foreground animate-fade-in-up"
            style={{ 
              fontSize: isMobile ? 'var(--text-2xl)' : isTablet ? 'var(--text-3xl)' : '3.5rem',
              lineHeight: '1.1',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: spacing.verticalSpacing.md[breakpoint],
              maxWidth: isMobile ? '100%' : '900px',
              animationDelay: '40ms',
              letterSpacing: '-0.02em'
            }}
          >
            Build beautiful interfaces with a{' '}
            <span 
              className="text-accent"
              style={{
                fontSize: 'inherit',
                lineHeight: 'inherit',
                fontWeight: 'inherit',
                letterSpacing: 'inherit'
              }}
            >
              design system
            </span>
            {' '}that scales
          </h1>
          
          {/* Subheadline */}
          <p 
            className="text-muted-foreground animate-fade-in-up"
            style={{ 
              fontSize: typography.bodyLarge[breakpoint],
              lineHeight: '1.6',
              maxWidth: isMobile ? '100%' : '700px',
              marginBottom: spacing.verticalSpacing.lg[breakpoint],
              animationDelay: '80ms'
            }}
          >
            A comprehensive design system built for modern web applications. 
            Inspired by industry leaders, powered by design tokens, and optimized for developer experience.
          </p>
          
          {/* CTA Buttons */}
          <div 
            className="animate-fade-in-up"
            style={{ 
              display: 'flex', 
              gap: isMobile ? '12px' : '16px', 
              flexWrap: 'wrap',
              animationDelay: '120ms',
              justifyContent: isMobile ? 'flex-start' : 'center'
            }}
          >
            <Button 
              onClick={() => onNavigate('components')}
              className="button-press hover-lift"
              size={isMobile ? 'default' : 'lg'}
              style={{ 
                borderRadius: 'var(--radius-md)', 
                display: 'flex', 
                gap: '8px', 
                alignItems: 'center',
                fontSize: typography.body[breakpoint],
                paddingLeft: isMobile ? '20px' : '24px',
                paddingRight: isMobile ? '20px' : '24px',
                height: isMobile ? '44px' : '52px'
              }}
            >
              <span>Browse Components</span>
              <ArrowRight size={isMobile ? 16 : 18} />
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => onNavigate('tokens')}
              className="button-press hover-lift"
              size={isMobile ? 'default' : 'lg'}
              style={{ 
                borderRadius: 'var(--radius-md)',
                fontSize: typography.body[breakpoint],
                paddingLeft: isMobile ? '20px' : '24px',
                paddingRight: isMobile ? '20px' : '24px',
                height: isMobile ? '44px' : '52px'
              }}
            >
              View Design Tokens
            </Button>
          </div>

          {/* Quick Stats */}
          <div 
            className="animate-fade-in-up"
            style={{
              display: 'flex',
              gap: isMobile ? '24px' : isTablet ? '32px' : '48px',
              marginTop: spacing.verticalSpacing.xl[breakpoint],
              animationDelay: '160ms',
              flexWrap: 'wrap',
              justifyContent: isMobile ? 'flex-start' : 'center'
            }}
          >
            {[
              { label: 'Components', value: '50+' },
              { label: 'Design Tokens', value: '100+' },
              { label: 'WCAG AA', value: 'A11y' },
            ].map((stat, index) => (
              <div key={index} style={{ textAlign: isMobile ? 'left' : 'center' }}>
                <div 
                  className="text-accent"
                  style={{
                    fontSize: typography.h2[breakpoint],
                    fontWeight: 'var(--font-weight-bold)',
                    lineHeight: '1'
                  }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-muted-foreground"
                  style={{
                    fontSize: typography.small[breakpoint],
                    marginTop: '4px'
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div 
        className="border-t border-border"
        style={{ opacity: 0.3 }}
      />

      {/* Key Features Section */}
      <section style={{ paddingTop: spacing.verticalSpacing.lg[breakpoint] }}>
        <div 
          className="animate-fade-in-up"
          style={{ 
            marginBottom: spacing.verticalSpacing.xl[breakpoint],
            textAlign: isMobile ? 'left' : 'center'
          }}
        >
          <h2 style={{ 
            marginBottom: spacing.verticalSpacing.sm[breakpoint], 
            fontSize: typography.h1[breakpoint], 
            lineHeight: '1.2',
            fontWeight: 'var(--font-weight-bold)'
          }}>
            Built for modern teams
          </h2>
          <p 
            className="text-muted-foreground" 
            style={{ 
              fontSize: typography.bodyLarge[breakpoint],
              maxWidth: isMobile ? '100%' : '600px',
              margin: isMobile ? '0' : '0 auto',
              lineHeight: '1.6'
            }}
          >
            Everything you need to build consistent, accessible, and beautiful interfaces
          </p>
        </div>
        
        <div 
          className="stagger-children"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
            gap: isMobile ? '20px' : isTablet ? '24px' : '32px'
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="hover-lift smooth-transition group"
                style={{ 
                  borderRadius: 'var(--radius-lg)', 
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default'
                }}
              >
                <CardContent style={{ padding: isMobile ? '24px' : isTablet ? '28px' : '32px' }}>
                  {/* Icon Container */}
                  <div 
                    className="bg-accent/10 group-hover:bg-accent/20 smooth-transition"
                    style={{ 
                      width: isMobile ? '48px' : '56px',
                      height: isMobile ? '48px' : '56px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing.verticalSpacing.md[breakpoint],
                      border: '1px solid var(--accent)',
                      boxShadow: '0 0 0 0 var(--accent)',
                      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Icon size={isMobile ? 22 : 26} className="text-accent" />
                  </div>
                  
                  <h3 style={{ 
                    marginBottom: spacing.verticalSpacing.xs[breakpoint], 
                    fontSize: typography.h3[breakpoint], 
                    lineHeight: '1.2',
                    fontWeight: 'var(--font-weight-semibold)'
                  }}>
                    {feature.title}
                  </h3>
                  
                  <p 
                    className="text-muted-foreground" 
                    style={{ 
                      fontSize: typography.body[breakpoint], 
                      lineHeight: '1.6'
                    }}
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section Divider */}
      <div 
        className="border-t border-border"
        style={{ opacity: 0.3 }}
      />

      {/* Quick Actions Section */}
      <section style={{ paddingTop: spacing.verticalSpacing.lg[breakpoint] }}>
        <div 
          className="animate-fade-in-up"
          style={{ 
            marginBottom: spacing.verticalSpacing.xl[breakpoint],
            textAlign: isMobile ? 'left' : 'center'
          }}
        >
          <h2 style={{ 
            marginBottom: spacing.verticalSpacing.sm[breakpoint], 
            fontSize: typography.h1[breakpoint], 
            lineHeight: '1.2',
            fontWeight: 'var(--font-weight-bold)'
          }}>
            Get started quickly
          </h2>
          <p 
            className="text-muted-foreground" 
            style={{ 
              fontSize: typography.bodyLarge[breakpoint],
              maxWidth: isMobile ? '100%' : '600px',
              margin: isMobile ? '0' : '0 auto',
              lineHeight: '1.6'
            }}
          >
            Jump into examples, guides, and documentation
          </p>
        </div>

        <div 
          className="stagger-children"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
            gap: isMobile ? '16px' : '20px'
          }}
        >
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.id}
                className="hover:border-accent smooth-transition cursor-pointer hover-lift"
                onClick={() => onNavigate(action.page, action.subPage)}
                style={{
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <CardHeader style={{ padding: isMobile ? '20px' : '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div 
                      className="bg-accent/10"
                      style={{ 
                        width: isMobile ? '40px' : '44px', 
                        height: isMobile ? '40px' : '44px',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={isMobile ? 20 : 22} className="text-accent" />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <CardTitle style={{ fontSize: typography.h4[breakpoint], lineHeight: '1.2' }}>
                          {action.title}
                        </CardTitle>
                        <Badge 
                          variant="secondary" 
                          style={{ fontSize: typography.caption[breakpoint] }}
                        >
                          {action.badge}
                        </Badge>
                      </div>
                      <CardDescription style={{ fontSize: typography.small[breakpoint], lineHeight: '1.5', marginTop: '8px' }}>
                        {action.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section Divider */}
      <div 
        className="border-t border-border"
        style={{ opacity: 0.3 }}
      />

      {/* Footer CTA Section */}
      <section 
        className="bg-muted border border-border animate-fade-in-up"
        style={{ 
          borderRadius: 'var(--radius-lg)', 
          padding: isMobile ? '40px 24px' : isTablet ? '56px 40px' : '72px 48px',
          textAlign: isMobile ? 'left' : 'center',
          marginTop: spacing.verticalSpacing.lg[breakpoint],
          marginBottom: spacing.verticalSpacing.lg[breakpoint]
        }}
      >
        <h2 
          style={{ 
            marginBottom: spacing.verticalSpacing.sm[breakpoint], 
            fontSize: typography.h1[breakpoint],
            fontWeight: 'var(--font-weight-bold)',
            lineHeight: '1.2'
          }}
        >
          Ready to build?
        </h2>
        <p 
          className="text-muted-foreground" 
          style={{ 
            fontSize: typography.bodyLarge[breakpoint],
            maxWidth: isMobile ? '100%' : '500px',
            margin: isMobile ? '0 0 24px 0' : '0 auto 32px',
            lineHeight: '1.6'
          }}
        >
          Start exploring components, tokens, and patterns to accelerate your development workflow.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => onNavigate('components', 'button-dark')}
            className="button-press hover-lift"
            style={{ 
              borderRadius: 'var(--radius-md)',
              fontSize: typography.body[breakpoint]
            }}
          >
            View Button Docs
          </Button>
          <Button 
            variant="outline"
            onClick={() => onNavigate('components', 'import-guide')}
            className="button-press hover-lift"
            style={{ 
              borderRadius: 'var(--radius-md)',
              fontSize: typography.body[breakpoint]
            }}
          >
            Import from Figma
          </Button>
        </div>
      </section>
    </div>
  );
}
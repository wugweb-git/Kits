import React from 'react';
import { ArrowRight, Zap, Palette, Layers, Code, Upload, Box, CheckCircle2, Sparkles, Shield, Gauge } from 'lucide-react';
import { Button } from '../../wugweb/Button';
import { Badge } from '../../wugweb/Badge';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';

/**
 * Overview Component
 * 
 * Main landing page for Wugweb Kits design system.
 * 100% CSS variables - NO hardcoded values.
 * Uses ONLY CSS variables from /styles/globals.css.
 */

interface OverviewProps {
  onNavigate: (page: string, subPage?: string) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const features = [
    {
      icon: Gauge,
      title: 'Lightning Fast',
      description: 'Optimized for performance with minimal bundle size and maximum rendering efficiency.',
    },
    {
      icon: Palette,
      title: 'Token-Based Design',
      description: 'Complete design token system for colors, typography, spacing, and motion.',
    },
    {
      icon: Layers,
      title: 'Modular Components',
      description: 'Flexible, composable components that adapt to your needs with extensive props.',
    },
    {
      icon: Code,
      title: 'Developer First',
      description: 'Clean APIs, TypeScript support, and comprehensive documentation for rapid development.',
    },
    {
      icon: Shield,
      title: 'Accessible by Default',
      description: 'WCAG 2.1 AA compliant with keyboard navigation and screen reader support built-in.',
    },
    {
      icon: Sparkles,
      title: 'Micro-interactions',
      description: 'Delightful animations and transitions using motion tokens and design principles.',
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

  const stats = [
    { label: 'Components', value: '127+' },
    { label: 'Design Tokens', value: '300+' },
    { label: 'Token Layers', value: '4' },
    { label: 'Ready to Ship', value: '100%' },
  ];

  return (
    <PageWrapper>
      {/* Hero Section */}
      <div
        style={{
          paddingTop: 'var(--section-spacing-mobile)',
          paddingBottom: 'var(--section-spacing-mobile)',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-1) var(--spacing-4)',
            background: 'var(--accent-subtle)',
            color: 'var(--accent)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-6)',
            fontFamily: 'Inter Tight, sans-serif',
          }}
        >
          <Sparkles size={16} />
          Production Ready
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            margin: 0,
            marginBottom: 'var(--spacing-6)',
            lineHeight: 1.1,
          }}
        >
          Build Faster with Wugweb Kits
        </h1>

        {/* Description */}
        <p
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-xl)',
            color: 'var(--muted-foreground)',
            margin: '0 auto var(--spacing-8) auto',
            maxWidth: '800px',
            lineHeight: 1.6,
          }}
        >
          A complete design system with 82+ production-ready components, comprehensive design tokens, 
          and beautiful documentation. Everything you need to ship products faster.
        </p>

        {/* Badges/Shields */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-3)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 'var(--spacing-8)',
          }}
        >
          <img 
            src="https://img.shields.io/npm/v/wugweb-kits?style=flat-square&color=0EA5E9" 
            alt="NPM Version"
            style={{ height: '20px' }}
          />
          <img 
            src="https://img.shields.io/npm/dm/wugweb-kits?style=flat-square&color=0EA5E9" 
            alt="NPM Downloads"
            style={{ height: '20px' }}
          />
          <img 
            src="https://img.shields.io/github/stars/wugweb/kits?style=flat-square&color=0EA5E9" 
            alt="GitHub Stars"
            style={{ height: '20px' }}
          />
          <img 
            src="https://img.shields.io/badge/license-MIT-0EA5E9?style=flat-square" 
            alt="MIT License"
            style={{ height: '20px' }}
          />
          <img 
            src="https://img.shields.io/badge/PRs-welcome-0EA5E9?style=flat-square" 
            alt="PRs Welcome"
            style={{ height: '20px' }}
          />
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-4)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 'var(--spacing-12)',
          }}
        >
          <Button variant="primary" onClick={() => onNavigate('components')}>
            Browse Components <ArrowRight size={16} style={{ marginLeft: 'var(--spacing-2)' }} />
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('tokens')}>
            View Design Tokens
          </Button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-8)',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {stats.map((stat, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--accent)',
                  marginBottom: 'var(--spacing-2)',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <PageSection title="Why Wugweb Kits?" description="Built for modern product teams who need speed, quality, and flexibility.">
        <PageGrid cols={3}>
          {features.map((feature, index) => (
            <PageCard key={index}>
              <div
                style={{
                  width: 'var(--spacing-12)',
                  height: 'var(--spacing-12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--spacing-4)',
                }}
              >
                <feature.icon size={24} />
              </div>
              <h3
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  margin: 0,
                  marginBottom: 'var(--spacing-2)',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {feature.description}
              </p>
            </PageCard>
          ))}
        </PageGrid>
      </PageSection>

      {/* Quick Actions */}
      <PageSection title="Quick Start" description="Jump right into the most popular components and guides.">
        <PageGrid cols={2}>
          {quickActions.map((action) => (
            <PageCard
              key={action.id}
              hover
              onClick={() => onNavigate(action.page, action.subPage)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)' }}>
                <div
                  style={{
                    width: 'var(--spacing-10)',
                    height: 'var(--spacing-10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                    borderRadius: 'var(--radius-md)',
                    flexShrink: 0,
                  }}
                >
                  <action.icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                    <h3
                      style={{
                        fontFamily: 'Inter Tight, sans-serif',
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--foreground)',
                        margin: 0,
                      }}
                    >
                      {action.title}
                    </h3>
                    <Badge variant="secondary" style={{ fontSize: 'var(--text-xs)' }}>
                      {action.badge}
                    </Badge>
                  </div>
                  <p
                    style={{
                      fontFamily: 'Inter Tight, sans-serif',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {action.description}
                  </p>
                </div>
              </div>
            </PageCard>
          ))}
        </PageGrid>
      </PageSection>

      {/* CTA Banner */}
      <div
        style={{
          padding: 'var(--spacing-12)',
          background: 'var(--accent-subtle)',
          border: '1px solid var(--accent)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            margin: 0,
            marginBottom: 'var(--spacing-4)',
          }}
        >
          Ready to Start Building?
        </h2>
        <p
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-lg)',
            color: 'var(--muted-foreground)',
            margin: '0 auto var(--spacing-6) auto',
            maxWidth: '600px',
            lineHeight: 1.6,
          }}
        >
          Start exploring components, tokens, and patterns to accelerate your development workflow.
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={() => onNavigate('components')}>
            Browse Components
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('tokens')}>
            View Tokens
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
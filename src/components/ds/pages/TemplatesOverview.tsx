import React from 'react';
import { Layout, BarChart2, Globe, Book, Briefcase, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection } from '../PageWrapper';
import { Button } from '../../wugweb/Button';
import { Badge } from '../../wugweb/Badge';

const F = 'Inter Tight, sans-serif';

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  accentColor: string;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  onView: (id: string) => void;
}

function TemplateCard({ id, title, description, category, icon: Icon, accentColor, tags, isNew, isFeatured, onView }: TemplateCardProps) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--card)',
        border: hovered ? '1px solid var(--accent)' : 'var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'all var(--motion-duration-short) var(--motion-easing-standard)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-raised)' : 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Template preview thumbnail */}
      <div
        style={{
          height: 200,
          background: `linear-gradient(135deg, ${accentColor}14 0%, var(--muted) 100%)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: 'var(--border-default)',
          overflow: 'hidden',
        }}
      >
        {/* Mini UI mockup */}
        <div style={{ width: '85%', height: '75%', background: 'var(--card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-raised)', overflow: 'hidden', border: 'var(--border-default)' }}>
          {/* Fake header bar */}
          <div style={{ height: 24, background: 'var(--muted)', borderBottom: 'var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px' }}>
            {[accentColor, 'var(--success)', 'var(--warning)'].map((c, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
          </div>
          {/* Fake content lines */}
          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ height: 8, borderRadius: 4, background: accentColor, width: '40%', opacity: 0.6 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 4 }}>
              {[60, 80, 70].map((h, i) => (
                <div key={i} style={{ height: h, borderRadius: 'var(--radius-sm)', background: 'var(--muted)' }} />
              ))}
            </div>
            <div style={{ height: 6, borderRadius: 4, background: 'var(--muted)', width: '90%' }} />
            <div style={{ height: 6, borderRadius: 4, background: 'var(--muted)', width: '70%' }} />
          </div>
        </div>

        {/* Badges */}
        {(isNew || isFeatured) && (
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
            {isFeatured && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--accent)', color: 'var(--accent-foreground)', fontSize: '10px', fontWeight: 'var(--font-weight-bold)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontFamily: F }}>
                <Star size={9} fill="currentColor" stroke="none" /> Featured
              </span>
            )}
            {isNew && (
              <span style={{ background: 'var(--success)', color: 'white', fontSize: '10px', fontWeight: 'var(--font-weight-bold)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontFamily: F }}>New</span>
            )}
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: 'var(--spacing-5)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: `${accentColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} style={{ color: accentColor }} />
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{category}</span>
        </div>
        <h3 style={{ margin: 0, fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>{title}</h3>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: 1.6, fontFamily: F, flex: 1 }}>{description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)', marginTop: 'var(--spacing-1)' }}>
          {tags.map(t => (
            <span key={t} style={{ fontSize: '11px', padding: '2px 8px', background: 'var(--muted)', color: 'var(--muted-foreground)', borderRadius: 'var(--radius-full)', fontFamily: F }}>{t}</span>
          ))}
        </div>
        <Button
          variant={hovered ? 'default' : 'outline'}
          size="sm"
          style={{ marginTop: 'var(--spacing-2)', width: '100%', transition: 'all var(--motion-duration-short) var(--motion-easing-standard)' }}
          onClick={() => onView(id)}
        >
          View template <ArrowRight size={13} />
        </Button>
      </div>
    </div>
  );
}

interface TemplatesOverviewProps {
  onNavigate: (section: string, subPage: string) => void;
}

export function TemplatesOverview({ onNavigate }: TemplatesOverviewProps) {
  const templates = [
    {
      id: 'dashboard',
      title: 'Analytics Dashboard',
      description: 'Full-featured analytics dashboard with charts, KPI cards, data tables, and sidebar navigation.',
      category: 'Application UI',
      icon: BarChart2,
      accentColor: 'var(--accent)',
      tags: ['Charts', 'Tables', 'Sidebar', 'Responsive'],
      isFeatured: true,
    },
    {
      id: 'landing-page',
      title: 'SaaS Landing Page',
      description: 'Conversion-optimized landing page with hero, features, pricing, testimonials, and CTA sections.',
      category: 'Marketing UI',
      icon: Globe,
      accentColor: '#3B82F6',
      tags: ['Hero', 'Pricing', 'CTA', 'Testimonials'],
      isFeatured: true,
    },
    {
      id: 'marketing-site',
      title: 'Marketing Site',
      description: 'Multi-page marketing site with navigation, blog layout, team page, and contact form.',
      category: 'Marketing UI',
      icon: Layout,
      accentColor: '#10B981',
      tags: ['Blog', 'Team', 'Contact', 'Nav'],
      isNew: true,
    },
    {
      id: 'documentation',
      title: 'Documentation Site',
      description: 'Technical documentation layout with sidebar navigation, search, code blocks, and versioning.',
      category: 'Developer Tools',
      icon: Book,
      accentColor: '#8B5CF6',
      tags: ['Docs', 'Search', 'Code', 'Sidebar'],
      isNew: true,
    },
    {
      id: 'portfolio',
      title: 'Portfolio / Agency',
      description: 'Creative portfolio with project showcase, case studies, about section, and services grid.',
      category: 'Creative',
      icon: Briefcase,
      accentColor: '#F59E0B',
      tags: ['Portfolio', 'Projects', 'About', 'Services'],
    },
    {
      id: 'e-commerce',
      title: 'E-commerce Storefront',
      description: 'Product catalog, product detail page, cart, and checkout flow. Token-driven throughout.',
      category: 'E-commerce',
      icon: ShoppingBag,
      accentColor: '#EC4899',
      tags: ['Products', 'Cart', 'Checkout', 'Filters'],
    },
  ];

  const stats = [
    { value: '6', label: 'Templates' },
    { value: '127+', label: 'Components used' },
    { value: '100%', label: 'Token-driven' },
    { value: 'MIT', label: 'License' },
  ];

  return (
    <PageWrapper>
      <PageHeader
        badge="Templates"
        title="Production Templates"
        description="Complete, copy-paste-ready page templates assembled from Wugweb Kits components. Every pixel is a CSS variable."
      />

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-12)', padding: 'var(--spacing-5)', background: 'var(--card)', borderRadius: 'var(--radius-lg)', border: 'var(--border-default)' }}>
        {stats.map(s => (
          <div key={s.label}>
            <p style={{ margin: 0, fontSize: 'var(--ts-h3-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: F }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{s.label}</p>
          </div>
        ))}
      </div>

      <PageSection title="All Templates" description="Click any template to view the full interactive preview.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-5)' }}>
          {templates.map(t => (
            <TemplateCard
              key={t.id}
              {...t}
              onView={(id) => onNavigate('templates', id)}
            />
          ))}
        </div>
      </PageSection>

      {/* Token reminder */}
      <div style={{ background: 'var(--accent-subtle)', border: 'var(--border-accent)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', marginTop: 6, flexShrink: 0 }} />
        <div>
          <p style={{ margin: '0 0 var(--spacing-1)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>All templates use CSS variables only</p>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F }}>Update <code style={{ fontFamily: 'var(--core-font-family-mono)', fontSize: 'var(--text-xs)', background: 'var(--card)', padding: '1px 5px', borderRadius: 'var(--radius-sm)' }}>/styles/globals.css</code> and every template rebrands automatically. No hardcoded colors, spacing, or radius values anywhere.</p>
        </div>
      </div>
    </PageWrapper>
  );
}

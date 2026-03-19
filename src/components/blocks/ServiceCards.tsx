import React, { useState } from 'react';
import { ArrowRight, Palette, Code2, Zap, Layers, FileCode, Package } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const CARDS = [
  {
    id: 'design-system',
    title: 'Design System',
    desc: 'A 4-layer token architecture powering consistent, scalable UI across every brand touchpoint.',
    icon: Palette,
    color: 'var(--accent)',
    bg: 'var(--accent-subtle)',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    tag: 'Foundation',
  },
  {
    id: 'component-library',
    title: 'Component Library',
    desc: '127+ production-ready React components built on semantic tokens and WCAG AA standards.',
    icon: Code2,
    color: 'var(--info)',
    bg: 'var(--info-subtle)',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80',
    tag: 'React',
  },
  {
    id: 'figma-kits',
    title: 'Figma Kits',
    desc: 'Figma-native components with variables that map 1:1 to the CSS token system.',
    icon: Layers,
    color: '#A259FF',
    bg: 'rgba(162, 89, 255, 0.10)',
    image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&q=80',
    tag: 'Figma',
  },
  {
    id: 'motion',
    title: 'Motion System',
    desc: 'Consistent animation tokens, scroll reveals, and micro-interaction utilities baked in.',
    icon: Zap,
    color: 'var(--success)',
    bg: 'var(--success-subtle)',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    tag: 'Motion',
  },
  {
    id: 'token-export',
    title: 'Token Export',
    desc: 'Export design tokens as JSON, CSS, SCSS, or Tokens Studio format with one click.',
    icon: FileCode,
    color: 'var(--warning)',
    bg: 'var(--warning-subtle)',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
    tag: 'Export',
  },
  {
    id: 'documentation',
    title: 'Documentation',
    desc: 'Interactive docs with live previews, code snippets, and anatomy diagrams for every component.',
    icon: Package,
    color: 'var(--destructive)',
    bg: 'var(--destructive-subtle)',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',
    tag: 'Docs',
  },
];

function ServiceCard({
  title, desc, icon: Icon, color, bg, image, tag
}: (typeof CARDS)[0]) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--card)',
        border: `1px solid ${hovered ? color : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--core-font-family-base)',
        boxShadow: hovered ? 'var(--core-shadow-md)' : 'var(--core-shadow-xs)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: `transform var(--motion-duration-slow) var(--motion-easing-standard),
                     border-color var(--motion-duration-fast) var(--motion-easing-standard),
                     box-shadow var(--motion-duration-slow) var(--motion-easing-standard)`,
        overflowX: 'hidden',
        overflowY: 'hidden',
      }}
    >
      {/* Image area */}
      <div style={{ height: '160px', position: 'relative', flexShrink: 0 }}>
        <ImageWithFallback
          src={image}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--gradient-overlay)',
        }} />
        {/* Tag badge */}
        <div style={{
          position: 'absolute',
          top: 'var(--spacing-3)',
          right: 'var(--spacing-3)',
          background: bg,
          border: `1px solid ${color}`,
          borderRadius: 'var(--radius-full)',
          padding: '2px var(--spacing-3)',
        }}>
          <span style={{
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-caption)',
            fontWeight: 'var(--font-weight-semibold)' as any,
            color: color,
          }}>
            {tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: 'var(--spacing-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
        flex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={18} color={color} />
          </div>
          <h3 style={{
            margin: 0,
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-h4)',
            fontWeight: 'var(--font-weight-semibold)' as any,
            color: 'var(--foreground)',
          }}>
            {title}
          </h3>
        </div>

        <p style={{
          margin: 0,
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-sm)',
          color: 'var(--muted-foreground)',
          lineHeight: 'var(--core-line-height-relaxed)',
          flex: 1,
        }}>
          {desc}
        </p>

        <button style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-1)',
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-sm)',
          fontWeight: 'var(--font-weight-semibold)' as any,
          color: hovered ? color : 'var(--muted-foreground)',
          transition: `color var(--motion-duration-fast) var(--motion-easing-standard)`,
          marginTop: 'auto',
          alignSelf: 'flex-start',
        }}>
          Learn more <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function ServiceCards() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 'var(--spacing-6)',
      padding: 'var(--spacing-8)',
    }}>
      {CARDS.map(card => (
        <ServiceCard key={card.id} {...card} />
      ))}
    </div>
  );
}

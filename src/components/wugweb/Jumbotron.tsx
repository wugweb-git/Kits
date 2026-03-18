import React from 'react';
import { Button } from './Button';

export interface JumbotronProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  backgroundImage?: string;
  overlay?: boolean;
  centered?: boolean;
  size?: 's' | 'm' | 'l';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Jumbotron Component
 * 
 * Hero section with title, description, and call-to-action buttons.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <Jumbotron
 *   title="Welcome to Wugweb"
 *   subtitle="Design System"
 *   description="Build beautiful interfaces with our component library"
 *   primaryAction={{ label: "Get Started", onClick: () => {} }}
 *   secondaryAction={{ label: "Learn More", onClick: () => {} }}
 * />
 */
export function Jumbotron({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage,
  overlay = false,
  centered = true,
  size = 'l',
  className = '',
  style = {},
}: JumbotronProps) {
  const sizeStyles = {
    s: {
      padding: 'var(--spacing-8) var(--spacing-6)',
      titleSize: 'var(--text-2xl)',
      subtitleSize: 'var(--text-lg)',
      descSize: 'var(--text-base)',
    },
    m: {
      padding: 'var(--spacing-12) var(--spacing-8)',
      titleSize: 'var(--text-3xl)',
      subtitleSize: 'var(--text-xl)',
      descSize: 'var(--text-lg)',
    },
    l: {
      padding: 'var(--spacing-16) var(--spacing-10)',
      titleSize: 'var(--text-4xl)',
      subtitleSize: 'var(--text-2xl)',
      descSize: 'var(--text-xl)',
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        padding: currentSize.padding,
        background: backgroundImage
          ? `url(${backgroundImage}) center/cover no-repeat`
          : 'var(--card)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Overlay */}
      {overlay && backgroundImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 0,
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '800px',
          margin: centered ? '0 auto' : '0',
          textAlign: centered ? 'center' : 'left',
        }}
      >
        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: currentSize.subtitleSize,
              fontWeight: 'var(--font-weight-medium)',
              color: backgroundImage ? 'rgba(255, 255, 255, 0.9)' : 'var(--accent)',
              marginBottom: 'var(--spacing-2)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: currentSize.titleSize,
            fontWeight: 'var(--font-weight-bold)',
            color: backgroundImage ? '#FFFFFF' : 'var(--foreground)',
            margin: 0,
            marginBottom: description ? 'var(--spacing-4)' : 'var(--spacing-6)',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: currentSize.descSize,
              fontWeight: 'var(--font-weight-regular)',
              color: backgroundImage ? 'rgba(255, 255, 255, 0.85)' : 'var(--muted-foreground)',
              margin: 0,
              marginBottom: 'var(--spacing-6)',
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        )}

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-4)',
              justifyContent: centered ? 'center' : 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            {primaryAction && (
              <Button onClick={primaryAction.onClick} variant="default" size="l">
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button onClick={secondaryAction.onClick} variant="outline" size="l">
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

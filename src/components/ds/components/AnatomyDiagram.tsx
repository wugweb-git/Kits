import React from 'react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { typography } from '../../../utils/responsive';

interface AnatomyCallout {
  label: string;
  token: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface AnatomyDiagramProps {
  callouts?: AnatomyCallout[];
}

export function AnatomyDiagram({ callouts }: AnatomyDiagramProps) {
  const { isMobile, isTablet, breakpoint } = useBreakpoint();

  const defaultCallouts: AnatomyCallout[] = [
    { label: 'Border Radius', token: 'var(--radius-lg)', position: 'top' },
    { label: 'Padding', token: '16px 20px', position: 'left' },
    { label: 'Focus Ring', token: 'var(--ring)', position: 'bottom' },
    { label: 'Background', token: 'var(--secondary)', position: 'right' }
  ];

  const items = callouts || defaultCallouts;

  return (
    <div 
      className="bg-muted border border-border"
      style={{ 
        borderRadius: 'var(--radius-lg)',
        padding: isMobile ? '32px 16px' : isTablet ? '48px 24px' : '64px 32px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%'
      }}
    >
      {/* Central Button Illustration */}
      <div 
        style={{ 
          position: 'relative',
          padding: isMobile ? '60px 20px' : isTablet ? '100px 60px' : '120px 80px',
          maxWidth: '100%'
        }}
      >
        {/* Mock Button */}
        <div
          className="bg-secondary text-foreground"
          style={{
            padding: '16px 32px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            fontSize: typography.body[breakpoint],
            fontWeight: 'var(--font-weight-semibold)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 0 2px var(--ring)',
            position: 'relative'
          }}
        >
          Button Label
        </div>

        {/* Callout Lines and Labels */}
        {items.map((callout, index) => {
          const isTop = callout.position === 'top';
          const isBottom = callout.position === 'bottom';
          const isLeft = callout.position === 'left';
          const isRight = callout.position === 'right';

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                ...(isTop && { 
                  top: isMobile ? '10px' : '20px', 
                  left: '50%', 
                  transform: 'translateX(-50%)' 
                }),
                ...(isBottom && { 
                  bottom: isMobile ? '10px' : '20px', 
                  left: '50%', 
                  transform: 'translateX(-50%)' 
                }),
                ...(isLeft && { 
                  left: isMobile ? '0' : '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)' 
                }),
                ...(isRight && { 
                  right: isMobile ? '0' : '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)' 
                })
              }}
            >
              {/* Callout Card */}
              <div 
                className="bg-card border border-accent/40 animate-fade-in-up"
                style={{ 
                  borderRadius: 'var(--radius-md)',
                  padding: isMobile ? '6px 10px' : '8px 12px',
                  animationDelay: `${index * 100}ms`,
                  whiteSpace: 'nowrap'
                }}
              >
                <div 
                  style={{ 
                    fontSize: typography.caption[breakpoint],
                    color: 'var(--muted-foreground)',
                    marginBottom: '2px',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  {callout.label}
                </div>
                <code 
                  style={{ 
                    fontSize: typography.caption[breakpoint],
                    color: 'var(--accent)',
                    fontFamily: 'monospace'
                  }}
                >
                  {callout.token}
                </code>
              </div>

              {/* Connecting Line */}
              <div 
                className="bg-accent/30"
                style={{
                  position: 'absolute',
                  ...(isTop && {
                    top: '100%',
                    left: '50%',
                    width: '2px',
                    height: isMobile ? '30px' : '40px',
                    transform: 'translateX(-50%)'
                  }),
                  ...(isBottom && {
                    bottom: '100%',
                    left: '50%',
                    width: '2px',
                    height: isMobile ? '30px' : '40px',
                    transform: 'translateX(-50%)'
                  }),
                  ...(isLeft && {
                    left: '100%',
                    top: '50%',
                    height: '2px',
                    width: isMobile ? '20px' : '30px',
                    transform: 'translateY(-50%)'
                  }),
                  ...(isRight && {
                    right: '100%',
                    top: '50%',
                    height: '2px',
                    width: isMobile ? '20px' : '30px',
                    transform: 'translateY(-50%)'
                  })
                }}
              />

              {/* Arrow/Dot */}
              <div 
                className="bg-accent"
                style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  ...(isTop && {
                    top: '100%',
                    left: '50%',
                    transform: `translate(-50%, ${isMobile ? '30px' : '40px'})`
                  }),
                  ...(isBottom && {
                    bottom: '100%',
                    left: '50%',
                    transform: `translate(-50%, -${isMobile ? '30px' : '40px'})`
                  }),
                  ...(isLeft && {
                    left: '100%',
                    top: '50%',
                    transform: `translate(${isMobile ? '20px' : '30px'}, -50%)`
                  }),
                  ...(isRight && {
                    right: '100%',
                    top: '50%',
                    transform: `translate(-${isMobile ? '20px' : '30px'}, -50%)`
                  })
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
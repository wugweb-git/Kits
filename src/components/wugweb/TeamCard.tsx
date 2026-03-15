import React from 'react';

export interface TeamCardProps {
  name?: string;
  role?: string;
  image?: string;
  onClick?: () => void;
  className?: string;
}

export function TeamCard({
  name = 'Vedanshu Srivastava',
  role = 'Head of Design & Strategy',
  image,
  onClick,
  className = '',
}: TeamCardProps) {
  return (
    <div
      onClick={onClick}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        width: '250px',
        height: '300px',
        padding: 'var(--spacing-2)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform var(--motion-duration-short) var(--motion-easing-standard)',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Background Image */}
      {image && (
        <img
          src={image}
          alt={name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 'var(--radius-md)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
          width: '100%',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            padding: '6px var(--spacing-2)',
            background: 'rgba(0, 0, 0, 0.9)',
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '4px 0',
              overflow: 'hidden',
              color: 'var(--foreground)',
              flex: 1,
            }}
          >
            <p
              style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                lineHeight: '28px',
                color: 'var(--foreground)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              {name}
            </p>
            <p
              style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-regular)',
                lineHeight: '26px',
                color: 'var(--foreground)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              {role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

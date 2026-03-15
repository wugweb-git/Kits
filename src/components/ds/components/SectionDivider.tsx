import React from 'react';

interface SectionDividerProps {
  withAccent?: boolean;
  style?: React.CSSProperties;
}

export function SectionDivider({ withAccent = false, style }: SectionDividerProps) {
  if (withAccent) {
    return (
      <div 
        className="divider-fade"
        style={{
          width: '100%',
          height: '1px',
          background: 'linear-gradient(90deg, var(--accent) 0%, var(--border) 50%, transparent 100%)',
          marginTop: 'var(--spacing-12)',
          marginBottom: 'var(--spacing-12)',
          ...style
        }}
      />
    );
  }

  return (
    <div 
      className="divider-fade"
      style={{
        width: '100%',
        height: '1px',
        background: 'var(--border)',
        marginTop: 'var(--spacing-8)',
        marginBottom: 'var(--spacing-8)',
        ...style
      }}
    />
  );
}

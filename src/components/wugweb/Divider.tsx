import React from 'react';

export interface DividerProps {
  /** Orientation of the divider */
  orientation?: 'horizontal' | 'vertical';
  /** Optional text label */
  label?: string;
  /** Label position */
  labelPosition?: 'left' | 'center' | 'right';
  /** Thickness in pixels */
  thickness?: number;
  /** Color */
  color?: string;
  /** Margin */
  margin?: string;
  /** Dashed style */
  dashed?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  label,
  labelPosition = 'center',
  thickness = 1,
  color,
  margin,
  dashed = false,
  className = '',
}: DividerProps) {
  const dividerColor = color || 'var(--border)';

  const dividerStyles: React.CSSProperties = {
    border: 'none',
    borderStyle: dashed ? 'dashed' : 'solid',
    ...(orientation === 'horizontal' 
      ? {
          width: '100%',
          height: '0',
          borderTopWidth: `${thickness}px`,
          borderTopColor: dividerColor,
          margin: margin || 'var(--spacing-2) 0',
        }
      : {
          height: '100%',
          width: '0',
          borderLeftWidth: `${thickness}px`,
          borderLeftColor: dividerColor,
          margin: margin || '0 var(--spacing-2)',
        }
    ),
  };

  if (label && orientation === 'horizontal') {
    const labelJustifyContent = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    }[labelPosition];

    return (
      <div
        className={`flex items-center gap-[var(--spacing-2)] ${className}`}
        style={{
          width: '100%',
          margin: margin || 'var(--spacing-2) 0',
        }}
      >
        {labelPosition !== 'left' && (
          <div
            style={{
              flex: labelPosition === 'center' ? 1 : 0,
              ...dividerStyles,
              margin: 0,
            }}
          />
        )}
        <span
          style={{
            fontSize: 'var(--text-sm)',
            fontFamily: 'Inter Tight, sans-serif',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--muted-foreground)',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        {labelPosition !== 'right' && (
          <div
            style={{
              flex: labelPosition === 'center' ? 1 : 0,
              ...dividerStyles,
              margin: 0,
            }}
          />
        )}
      </div>
    );
  }

  return (
    <hr
      className={className}
      style={dividerStyles}
      role="separator"
      aria-orientation={orientation}
    />
  );
}

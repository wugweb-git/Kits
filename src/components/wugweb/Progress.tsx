import React from 'react';
import { cn } from '../ui/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value (0-100) */
  value?: number;
  /** Maximum value */
  max?: number;
  /** Color of the indicator */
  indicatorColor?: string;
  /** Height of the progress bar */
  height?: string | number;
  /** Show value label */
  showLabel?: boolean;
}

export function Progress({
  value = 0,
  max = 100,
  indicatorColor,
  height = 8,
  showLabel = false,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full flex items-center gap-[var(--spacing-2)]">
      <div
        className={cn("relative w-full overflow-hidden", className)}
        style={{
          height: height,
          backgroundColor: 'var(--surface-700)',
          borderRadius: 'var(--radius-full)',
        }}
        {...props}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: indicatorColor || 'var(--accent)',
            borderRadius: 'var(--radius-full)',
            transition: 'width var(--motion-duration-normal) var(--motion-easing-standard)',
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--muted-foreground)',
            fontFamily: 'Inter Tight, sans-serif',
            minWidth: '32px',
            textAlign: 'right',
          }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

import React from 'react';
import { cn } from '../ui/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape of the skeleton */
  variant?: 'rectangle' | 'circle' | 'text';
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'rectangle',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const getBorderRadius = () => {
    switch (variant) {
      case 'circle': return '50%';
      case 'text': return 'var(--radius-sm)';
      default: return 'var(--radius-md)';
    }
  };

  const getHeight = () => {
    if (height) return height;
    if (variant === 'text') return '1em';
    return '100%';
  };

  return (
    <div
      className={cn("animate-pulse", className)}
      style={{
        width: width,
        height: getHeight(),
        borderRadius: getBorderRadius(),
        backgroundColor: 'var(--muted)',
        opacity: 0.7,
        ...style,
      }}
      {...props}
    />
  );
}

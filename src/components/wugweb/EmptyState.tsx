import React from 'react';
import { LucideIcon, FileQuestion } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * EmptyState Component
 * 
 * Displays a friendly empty state with optional actions.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <EmptyState
 *   icon={FileQuestion}
 *   title="No results found"
 *   description="Try adjusting your search or filters"
 *   actionLabel="Clear filters"
 *   onAction={() => {}}
 * />
 */
export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
  style = {},
}: EmptyStateProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--spacing-12)',
        ...style,
      }}
    >
      {/* Icon */}
      <div
        style={{
          marginBottom: 'var(--spacing-4)',
          color: 'var(--muted-foreground)',
        }}
      >
        <Icon size={64} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--foreground)',
          margin: 0,
          marginBottom: 'var(--spacing-2)',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--muted-foreground)',
            margin: 0,
            marginBottom: 'var(--spacing-6)',
            maxWidth: '400px',
          }}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-3)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {actionLabel && onAction && (
            <Button onClick={onAction} variant="default">
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button onClick={onSecondaryAction} variant="outline">
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

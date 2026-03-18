import React from 'react';
import { Star } from 'lucide-react';

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 's' | 'm' | 'l';
  readonly?: boolean;
  showValue?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Rating Component
 * 
 * Star rating input with interactive hover states.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <Rating value={rating} onChange={setRating} />
 * <Rating value={4.5} readonly showValue />
 */
export function Rating({
  value,
  onChange,
  max = 5,
  size = 'm',
  readonly = false,
  showValue = false,
  className = '',
  style = {},
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const sizeMap = {
    s: 16,
    m: 24,
    l: 32,
  };

  const iconSize = sizeMap[size];
  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-1)',
        ...style,
      }}
    >
      {/* Stars */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
        }}
        onMouseLeave={() => !readonly && setHoverValue(null)}
      >
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const fillPercentage = Math.min(Math.max(displayValue - index, 0), 1);

          return (
            <div
              key={index}
              style={{
                position: 'relative',
                cursor: readonly ? 'default' : 'pointer',
                display: 'inline-block',
              }}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => !readonly && setHoverValue(starValue)}
            >
              {/* Background Star (Empty) */}
              <Star
                size={iconSize}
                style={{
                  color: 'var(--border)',
                  fill: 'var(--border)',
                }}
              />

              {/* Foreground Star (Filled) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${fillPercentage * 100}%`,
                  overflow: 'hidden',
                  transition: 'width var(--motion-duration-fast) var(--motion-easing-standard)',
                }}
              >
                <Star
                  size={iconSize}
                  style={{
                    color: 'var(--accent)',
                    fill: 'var(--accent)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Value Display */}
      {showValue && (
        <span
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: size === 's' ? 'var(--text-sm)' : size === 'm' ? 'var(--text-base)' : 'var(--text-lg)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--foreground)',
            marginLeft: 'var(--spacing-2)',
          }}
        >
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

import React from 'react';

export interface SliderProps {
  /** Current value */
  value?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Label for the slider */
  label?: string;
  /** Show value label */
  showValue?: boolean;
  /** Optional className for custom styling */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * Slider Component
 * 
 * A range slider input component with full CSS variable support.
 * Uses design tokens from /styles/globals.css for theming.
 * 
 * @example
 * <Slider
 *   label="Volume"
 *   value={50}
 *   min={0}
 *   max={100}
 *   onChange={(value) => console.log(value)}
 *   showValue
 * />
 */
export function Slider({
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  label,
  showValue = false,
  className = '',
  style = {},
}: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange?.(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={className}
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        width: '100%',
        ...style,
      }}
    >
      {(label || showValue) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-2)',
          }}
        >
          {label && (
            <label
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
              }}
            >
              {label}
            </label>
          )}
          {showValue && (
            <span
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--muted-foreground)',
              }}
            >
              {value}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: 'var(--radius-full)',
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percentage}%, var(--muted) ${percentage}%, var(--muted) 100%)`,
            outline: 'none',
            WebkitAppearance: 'none',
            appearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
          }}
          className="slider-input"
        />
        <style>{`
          .slider-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--accent);
            cursor: pointer;
            border: 3px solid var(--background);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          
          .slider-input::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
          
          .slider-input::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--accent);
            cursor: pointer;
            border: 3px solid var(--background);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          
          .slider-input::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
          
          .slider-input:disabled::-webkit-slider-thumb {
            cursor: not-allowed;
          }
          
          .slider-input:disabled::-moz-range-thumb {
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
}

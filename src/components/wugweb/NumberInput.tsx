import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: 's' | 'm' | 'l';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * NumberInput Component
 * 
 * Numeric input with increment/decrement buttons.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <NumberInput
 *   value={quantity}
 *   onChange={setQuantity}
 *   min={1}
 *   max={99}
 *   step={1}
 * />
 */
export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  size = 'm',
  className = '',
  style = {},
}: NumberInputProps) {
  const handleIncrement = () => {
    const newValue = value + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = value - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      if ((min === undefined || newValue >= min) && (max === undefined || newValue <= max)) {
        onChange(newValue);
      }
    }
  };

  const sizeStyles = {
    s: {
      height: '32px',
      fontSize: 'var(--text-sm)',
      buttonWidth: '28px',
      iconSize: 14,
    },
    m: {
      height: '40px',
      fontSize: 'var(--text-base)',
      buttonWidth: '36px',
      iconSize: 16,
    },
    l: {
      height: '48px',
      fontSize: 'var(--text-lg)',
      buttonWidth: '44px',
      iconSize: 18,
    },
  };

  const currentSize = sizeStyles[size];
  const canDecrement = min === undefined || value > min;
  const canIncrement = max === undefined || value < max;

  const buttonStyle: React.CSSProperties = {
    fontFamily: 'Inter Tight, sans-serif',
    width: currentSize.buttonWidth,
    height: '100%',
    background: 'var(--muted)',
    border: 'none',
    color: 'var(--foreground)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  };

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        position: 'relative',
        background: 'var(--input-background)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
        ...style,
      }}
    >
      {/* Decrement Button */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || !canDecrement}
        style={{
          ...buttonStyle,
          borderTopLeftRadius: 'var(--radius-md)',
          borderBottomLeftRadius: 'var(--radius-md)',
          opacity: disabled || !canDecrement ? 0.5 : 1,
          cursor: disabled || !canDecrement ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!disabled && canDecrement) {
            e.currentTarget.style.background = 'var(--secondary)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--muted)';
        }}
      >
        <Minus size={currentSize.iconSize} />
      </button>

      {/* Input Field */}
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: currentSize.fontSize,
          fontWeight: 'var(--font-weight-medium)',
          height: currentSize.height,
          width: '80px',
          textAlign: 'center',
          color: 'var(--foreground)',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          MozAppearance: 'textfield',
          WebkitAppearance: 'none',
          margin: 0,
          padding: '0 8px',
        }}
      />

      {/* Increment Button */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || !canIncrement}
        style={{
          ...buttonStyle,
          borderTopRightRadius: 'var(--radius-md)',
          borderBottomRightRadius: 'var(--radius-md)',
          opacity: disabled || !canIncrement ? 0.5 : 1,
          cursor: disabled || !canIncrement ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!disabled && canIncrement) {
            e.currentTarget.style.background = 'var(--secondary)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--muted)';
        }}
      >
        <Plus size={currentSize.iconSize} />
      </button>

      <style>
        {`
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}
      </style>
    </div>
  );
}

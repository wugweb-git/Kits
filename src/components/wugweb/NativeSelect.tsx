import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NativeSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: NativeSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  size?: 's' | 'm' | 'l';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * NativeSelect Component
 * 
 * Styled native HTML select dropdown.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <NativeSelect
 *   value={country}
 *   onChange={setCountry}
 *   options={countries}
 *   placeholder="Select country"
 * />
 */
export function NativeSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  size = 'm',
  className = '',
  style = {},
}: NativeSelectProps) {
  const sizeStyles = {
    s: {
      height: '32px',
      fontSize: 'var(--text-sm)',
      padding: '0 32px 0 12px',
      iconSize: 16,
    },
    m: {
      height: '40px',
      fontSize: 'var(--text-base)',
      padding: '0 40px 0 16px',
      iconSize: 20,
    },
    l: {
      height: '48px',
      fontSize: 'var(--text-lg)',
      padding: '0 48px 0 20px',
      iconSize: 24,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: '100%',
        ...style,
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: currentSize.fontSize,
          fontWeight: 'var(--font-weight-regular)',
          height: currentSize.height,
          width: '100%',
          padding: currentSize.padding,
          color: value ? 'var(--foreground)' : 'var(--muted-foreground)',
          background: 'var(--input-background)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
          opacity: disabled ? 0.5 : 1,
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = 'var(--ring)';
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 190, 26, 0.1)';
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border)';
          e.target.style.boxShadow = 'none';
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Chevron Icon */}
      <ChevronDown
        size={currentSize.iconSize}
        style={{
          position: 'absolute',
          right: size === 's' ? '10px' : size === 'm' ? '12px' : '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--muted-foreground)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

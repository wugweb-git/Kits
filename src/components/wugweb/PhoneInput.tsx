import React from 'react';
import { Phone } from 'lucide-react';

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  disabled?: boolean;
  placeholder?: string;
  size?: 's' | 'm' | 'l';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * PhoneInput Component
 * 
 * International phone number input with country code selector.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <PhoneInput
 *   value={phone}
 *   onChange={setPhone}
 *   countryCode="+1"
 * />
 */
export function PhoneInput({
  value,
  onChange,
  countryCode = '+1',
  disabled = false,
  placeholder = '(555) 123-4567',
  size = 'm',
  className = '',
  style = {},
}: PhoneInputProps) {
  const [selectedCountryCode, setSelectedCountryCode] = React.useState(countryCode);

  const countryCodes = [
    { code: '+1', country: 'US/CA' },
    { code: '+44', country: 'UK' },
    { code: '+33', country: 'FR' },
    { code: '+49', country: 'DE' },
    { code: '+81', country: 'JP' },
    { code: '+86', country: 'CN' },
    { code: '+91', country: 'IN' },
    { code: '+61', country: 'AU' },
  ];

  const sizeStyles = {
    s: {
      height: '32px',
      fontSize: 'var(--text-sm)',
      padding: '0 8px',
    },
    m: {
      height: '40px',
      fontSize: 'var(--text-base)',
      padding: '0 12px',
    },
    l: {
      height: '48px',
      fontSize: 'var(--text-lg)',
      padding: '0 16px',
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        width: '100%',
        position: 'relative',
        ...style,
      }}
    >
      {/* Country Code Selector */}
      <select
        value={selectedCountryCode}
        onChange={(e) => setSelectedCountryCode(e.target.value)}
        disabled={disabled}
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: currentSize.fontSize,
          fontWeight: 'var(--font-weight-medium)',
          height: currentSize.height,
          padding: currentSize.padding,
          color: 'var(--foreground)',
          background: 'var(--muted)',
          border: '1px solid var(--border)',
          borderRight: 'none',
          borderTopLeftRadius: 'var(--radius-md)',
          borderBottomLeftRadius: 'var(--radius-md)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {countryCodes.map((item) => (
          <option key={item.code} value={item.code}>
            {item.code} {item.country}
          </option>
        ))}
      </select>

      {/* Phone Number Input */}
      <div style={{ position: 'relative', flex: 1 }}>
        <Phone
          size={size === 's' ? 16 : size === 'm' ? 20 : 24}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted-foreground)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: currentSize.fontSize,
            fontWeight: 'var(--font-weight-regular)',
            height: currentSize.height,
            width: '100%',
            paddingLeft: size === 's' ? '36px' : size === 'm' ? '44px' : '52px',
            paddingRight: currentSize.padding,
            color: 'var(--foreground)',
            background: 'var(--input-background)',
            border: '1px solid var(--border)',
            borderTopRightRadius: 'var(--radius-md)',
            borderBottomRightRadius: 'var(--radius-md)',
            outline: 'none',
            transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
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
        />
      </div>
    </div>
  );
}

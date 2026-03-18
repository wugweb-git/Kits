import React from 'react';
import { Clock } from 'lucide-react';

export interface TimePickerProps {
  value: string; // Format: "HH:MM" (24-hour)
  onChange: (value: string) => void;
  disabled?: boolean;
  size?: 's' | 'm' | 'l';
  use12Hour?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * TimePicker Component
 * 
 * Time selection input with hour and minute controls.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <TimePicker
 *   value={time}
 *   onChange={setTime}
 *   use12Hour
 * />
 */
export function TimePicker({
  value,
  onChange,
  disabled = false,
  size = 'm',
  use12Hour = false,
  className = '',
  style = {},
}: TimePickerProps) {
  const [hours, minutes] = value.split(':').map(Number);
  const [period, setPeriod] = React.useState<'AM' | 'PM'>(hours >= 12 ? 'PM' : 'AM');

  const displayHours = use12Hour ? (hours % 12 || 12) : hours;

  const updateTime = (newHours: number, newMinutes: number) => {
    const formatted = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    onChange(formatted);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHours = parseInt(e.target.value) || 0;
    if (use12Hour) {
      if (newHours < 1) newHours = 1;
      if (newHours > 12) newHours = 12;
      newHours = period === 'PM' ? (newHours === 12 ? 12 : newHours + 12) : (newHours === 12 ? 0 : newHours);
    } else {
      if (newHours < 0) newHours = 0;
      if (newHours > 23) newHours = 23;
    }
    updateTime(newHours, minutes);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinutes = parseInt(e.target.value) || 0;
    if (newMinutes < 0) newMinutes = 0;
    if (newMinutes > 59) newMinutes = 59;
    updateTime(hours, newMinutes);
  };

  const handlePeriodToggle = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    const newHours = newPeriod === 'PM' 
      ? (hours < 12 ? hours + 12 : hours)
      : (hours >= 12 ? hours - 12 : hours);
    updateTime(newHours, minutes);
  };

  const sizeStyles = {
    s: {
      height: '32px',
      fontSize: 'var(--text-sm)',
      inputWidth: '36px',
    },
    m: {
      height: '40px',
      fontSize: 'var(--text-base)',
      inputWidth: '48px',
    },
    l: {
      height: '48px',
      fontSize: 'var(--text-lg)',
      inputWidth: '56px',
    },
  };

  const currentSize = sizeStyles[size];

  const inputStyle: React.CSSProperties = {
    fontFamily: 'Inter Tight, sans-serif',
    fontSize: currentSize.fontSize,
    fontWeight: 'var(--font-weight-medium)',
    height: currentSize.height,
    width: currentSize.inputWidth,
    textAlign: 'center',
    color: 'var(--foreground)',
    background: 'var(--input-background)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
  };

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-2)',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        ...style,
      }}
    >
      <Clock size={size === 's' ? 16 : size === 'm' ? 20 : 24} style={{ color: 'var(--muted-foreground)' }} />
      
      {/* Hours */}
      <input
        type="number"
        value={String(displayHours).padStart(2, '0')}
        onChange={handleHourChange}
        disabled={disabled}
        min={use12Hour ? 1 : 0}
        max={use12Hour ? 12 : 23}
        style={inputStyle}
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

      <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: currentSize.fontSize, color: 'var(--foreground)' }}>:</span>

      {/* Minutes */}
      <input
        type="number"
        value={String(minutes).padStart(2, '0')}
        onChange={handleMinuteChange}
        disabled={disabled}
        min={0}
        max={59}
        style={inputStyle}
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

      {/* AM/PM Toggle */}
      {use12Hour && (
        <button
          type="button"
          onClick={handlePeriodToggle}
          disabled={disabled}
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: currentSize.fontSize,
            fontWeight: 'var(--font-weight-medium)',
            height: currentSize.height,
            padding: '0 12px',
            color: 'var(--foreground)',
            background: 'var(--secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
            opacity: disabled ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent-foreground)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--secondary)';
            e.currentTarget.style.color = 'var(--foreground)';
          }}
        >
          {period}
        </button>
      )}

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

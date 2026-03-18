import React from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from './Calendar';

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  size?: 's' | 'm' | 'l';
  showClearButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DatePicker Component
 * 
 * Date selection with calendar popup.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   placeholder="Select date"
 *   showClearButton
 * />
 */
export function DatePicker({
  value,
  onChange,
  disabled = false,
  placeholder = 'Pick a date',
  size = 'm',
  showClearButton = true,
  className = '',
  style = {},
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(undefined);
    onChange(undefined);
  };

  const sizeStyles = {
    s: {
      height: '32px',
      fontSize: 'var(--text-sm)',
      padding: '0 32px 0 36px',
      iconSize: 16,
    },
    m: {
      height: '40px',
      fontSize: 'var(--text-base)',
      padding: '0 40px 0 44px',
      iconSize: 20,
    },
    l: {
      height: '48px',
      fontSize: 'var(--text-lg)',
      padding: '0 48px 0 52px',
      iconSize: 24,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', width: '100%', ...style }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: currentSize.fontSize,
          fontWeight: 'var(--font-weight-regular)',
          height: currentSize.height,
          width: '100%',
          padding: currentSize.padding,
          textAlign: 'left',
          color: selectedDate ? 'var(--foreground)' : 'var(--muted-foreground)',
          background: 'var(--input-background)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
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
        {selectedDate ? formatDate(selectedDate) : placeholder}
      </button>

      {/* Calendar Icon */}
      <CalendarIcon
        size={currentSize.iconSize}
        style={{
          position: 'absolute',
          left: size === 's' ? '10px' : size === 'm' ? '12px' : '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--muted-foreground)',
          pointerEvents: 'none',
        }}
      />

      {/* Clear Button */}
      {showClearButton && selectedDate && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: size === 's' ? '8px' : size === 'm' ? '12px' : '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: 'var(--muted-foreground)',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--radius-sm)',
            transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--foreground)';
            e.currentTarget.style.background = 'var(--muted)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--muted-foreground)';
            e.currentTarget.style.background = 'none';
          }}
        >
          <X size={currentSize.iconSize - 4} />
        </button>
      )}

      {/* Calendar Popup */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 50,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 38px -10px rgba(0, 0, 0, 0.3), 0 10px 20px -15px rgba(0, 0, 0, 0.2)',
            padding: 'var(--spacing-4)',
          }}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}
